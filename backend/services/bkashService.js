// const axios = require("axios");
//
// let tokenCache = {
//   token: null,
//   expiry: null,
// };
//
// const getToken = async () => {
//   const now = new Date();
//
//   try {
//     // Check if a valid token is already cached
//     if (tokenCache.token && tokenCache.expiry > now) {
//       return tokenCache.token;
//     }
//
//     // Request a new token from bKash API
//     const response = await axios.post(
//       `${process.env.BKASH_BASE_URL}/checkout/token/grant`,
//       {
//         app_key: process.env.BKASH_APP_KEY,
//         app_secret: process.env.BKASH_APP_SECRET,
//       },
//       {
//         headers: {
//           username: process.env.BKASH_USERNAME,
//           password: process.env.BKASH_PASSWORD,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//
//     console.log("Token response:", response.data); // Full response for debugging
//
//     const { id_token, expires_in } = response.data;
//
//     if (!id_token) {
//       console.error("No id_token received from bKash API");
//       return null; // Handle this case gracefully
//     }
//
//     // Cache the token and set the expiry time
//     tokenCache.token = id_token;
//     tokenCache.expiry = new Date(now.getTime() + expires_in * 1000);
//
//     console.log("New token generated:", id_token);
//     console.log("Token expiry:", tokenCache.expiry);
//
//     return id_token;
//
//   } catch (error) {
//     console.error("Error in getToken:", error.message || error);
//     throw new Error("Failed to fetch token");
//   }
// };
//
// const createPayment = async (amount, payerReference = "guestUser") => {
//   console.log("Creating payment...");
//
//   const idToken = await getToken();
//   console.log("ID Token used for payment creation:", idToken); // Log the token
//
//   const paymentPayload = {
//     mode: "0011",
//     payerReference,
//     callbackURL: "https://yourfrontend.com/bkash/callback",
//     amount,
//     currency: "BDT",
//     intent: "sale",
//     merchantInvoiceNumber: "Inv" + Date.now(),
//   };
//
//   try {
//     const response = await axios.post(
//       `${process.env.BKASH_BASE_URL}/checkout/create`,
//       paymentPayload,
//       {
//         headers: {
//           authorization: `Bearer ${idToken}`,
//           "X-APP-Key": process.env.BKASH_APP_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//
//     console.log("Payment API response:", response.data); // Log full response for debugging
//     return response.data;
//
//   } catch (error) {
//     console.error("Create Payment Error:", error.message || error);
//     throw new Error("Failed to create payment");
//   }
// };
//
//
// const executePayment = async (paymentID) => {
//   const idToken = await getToken(); // Get the id_token from the authentication step
//
//   if (!idToken) {
//     console.error("No valid id_token found, unable to execute payment");
//     return { error: "Failed to authenticate with bKash API" };
//   }
//
//   try {
//     // Prepare the request payload
//     const payload = {
//       paymentID,  // PaymentID returned from the Create Payment API
//     };
//
//     // Make the POST request to execute the payment
//     const response = await axios.post(
//       `${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`,  // Endpoint to execute the payment
//       payload,  // Send the paymentID in the request body
//       {
//         headers: {
//           Accept: "application/json",  // Accept application/json response
//           Authorization: `Bearer ${idToken}`,  // Use the id_token as Bearer token
//           "X-App-Key": process.env.BKASH_APP_KEY,  // Application key provided by bKash
//           "Content-Type": "application/json",  // Set the content type
//         },
//       }
//     );
//     console.log("Pyaload:", payload);
//     // Log and return the successful response
//     console.log("Payment executed successfully:", response.data);
//     return response.data;  // Return the response data containing the payment status
//   } catch (error) {
//     // Log and handle errors
//     console.error("Error in executePayment:", error.response ? error.response.data : error.message || error);
//     return { error: "Failed to execute payment" };  // Return error details
//   }
// };
//
//
// module.exports = {
//   createPayment,
//   executePayment,
// };
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
    console.log("Token request URL:", tokenUrl);
    console.log("Token request headers:", tokenHeaders());
    console.log("Token request body:", tokenParameters());

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

    console.log("New token fetched:", id_token);
    console.log("Token valid until:", tokenCache.expiry);

    return id_token;
  } catch (error) {
    console.error("Error fetching token:", error?.response?.data || error.message);
    throw new Error("Failed to fetch token");
  }
};

// Create payment request
const createPayment = async (
  amount,
  payerReference = "guestUser",
  callbackURL = `${BkashConfig.client_url}/bkash-callback`

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

    console.log("Creating payment with payload:", payload);

    const response = await axios.post(
      `${BkashConfig.base_url}/tokenized/checkout/create`,
      payload,
      { headers: await authHeaders() }
    );

    console.log("Payment creation response:", response.data);

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

    console.log("Executing payment with payload:", payload);

    const response = await axios.post(
      `${BkashConfig.base_url}/tokenized/checkout/execute`,
      payload,
      { headers: await authHeaders() }
    );

    console.log("Payment executed successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error("Execute Payment Error:", error?.response?.data || error.message);
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
    console.error("Error querying payment status:", error?.response?.data || error.message);
    return { error: "Failed to query payment status" };
  }
};


module.exports = {
  createPayment,
  executePayment,
  queryPayment
};

