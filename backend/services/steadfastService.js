const axios = require("axios");

const createSteadfastOrderService = async (orderData) => {
  const {
    invoice,
    recipient_name,
    recipient_phone,
    recipient_address,
    cod_amount,
    note,
  } = orderData;

  const payload = {
    invoice,
    recipient_name,
    recipient_phone,
    recipient_address,
    cod_amount,
    note,
  };

  const response = await axios.post(
    `${process.env.STEADFAST_BASE_URL}/create_order`,
    payload,
    {
      headers: {
        "Api-Key": process.env.STEADFAST_API_KEY,
        "Secret-Key": process.env.STEADFAST_SECRET_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};


const getSteadfastOrderStatusByInvoiceService = async (invoiceId) => {
  const response = await axios.get(
    `${process.env.STEADFAST_BASE_URL}/status_by_invoice/${invoiceId}`,
    {
      headers: {
        "Api-Key": process.env.STEADFAST_API_KEY,
        "Secret-Key": process.env.STEADFAST_SECRET_KEY,
      },
    }
  );

  return response.data;
};

module.exports = {
  createSteadfastOrderService,
  getSteadfastOrderStatusByInvoiceService
};
