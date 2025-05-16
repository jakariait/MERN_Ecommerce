const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

let tokenCache = {
  token: null,
  expiry: null,
};

// Load bKash config from environment variables
const BkashConfig = {
  base_url: process.env.BKASH_BASE_URL,
  username: process.env.BKASH_USERNAME,
  password: process.env.BKASH_PASSWORD,
  app_key: process.env.BKASH_APP_KEY,
  app_secret: process.env.BKASH_APP_SECRET,
  client_url: process.env.BKASH_CLIENT_URL,
};

// Token request body
const tokenParameters = () => ({
  app_key: BkashConfig.app_key,
  app_secret: BkashConfig.app_secret,
});

// Token request headers
const tokenHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  username: BkashConfig.username,
  password: BkashConfig.password,
});

// Authenticated request headers
const authHeaders = async () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${await getToken()}`,
  "X-App-Key": BkashConfig.app_key,
});

// Get new or cached token
const getToken = async () => {
  const now = new Date();

  if (tokenCache.token && tokenCache.expiry > now) {
    return tokenCache.token;
  }

  try {
    const tokenUrl = `${BkashConfig.base_url}/tokenized/checkout/token/grant`;

    const response = await axios.post(tokenUrl, tokenParameters(), {
      headers: tokenHeaders(),
    });

    const { id_token, expires_in } = response.data;

    if (!id_token) {
      console.error("No id_token received from bKash API");
      return null;
    }

    tokenCache.token = id_token;
    tokenCache.expiry = new Date(now.getTime() + expires_in * 1000);

    return id_token;
  } catch (error) {
    console.error(
      "Error fetching token:",
      error?.response?.data || error.message,
    );
    throw new Error("Failed to fetch token");
  }
};

// Create payment request
const createPayment = async (
  amount,
  payerReference = "guestUser",
  callbackURL,
) => {
  try {
    if (!amount || amount < 1) {
      return {
        statusCode: 400,
        message: "Amount is required and must be at least 1 BDT",
      };
    }

    const payload = {
      mode: "0011",
      payerReference,
      callbackURL,
      amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 6),
    };

    const response = await axios.post(
      `${BkashConfig.base_url}/tokenized/checkout/create`,
      payload,
      { headers: await authHeaders() },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Create Payment Error - response:", error.response.data);
    } else if (error.request) {
      console.error("Create Payment Error - no response:", error.request);
    } else {
      console.error("Create Payment Error - general:", error.message);
    }

    throw new Error("Failed to create payment");
  }
};

// Execute payment request
const executePayment = async (paymentID) => {
  if (!paymentID) {
    return { error: "PaymentID is required to execute the payment" };
  }

  try {
    const payload = { paymentID };

    const response = await axios.post(
      `${BkashConfig.base_url}/tokenized/checkout/execute`,
      payload,
      { headers: await authHeaders() },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Execute Payment Error:",
      error?.response?.data || error.message,
    );
    return { error: "Failed to execute payment" };
  }
};

// Query Payment Request
const queryPayment = async (paymentID) => {
  if (!paymentID) {
    return { error: "PaymentID is required to query the payment status" };
  }

  try {
    const url = `${BkashConfig.base_url}/tokenized/checkout/payment/status`;
    const payload = { paymentID };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${await getToken()}`,
        "X-App-Key": BkashConfig.app_key,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error querying payment status:",
      error?.response?.data || error.message,
    );
    return { error: "Failed to query payment status" };
  }
};

module.exports = {
  createPayment,
  executePayment,
  queryPayment,
};
