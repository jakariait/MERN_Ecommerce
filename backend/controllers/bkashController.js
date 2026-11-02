const bkashService = require('../services/bkashService');
const cartService = require('../services/cartService');

const createPayment = async (req, res) => {
  try {
    const { amount, payerReference, callbackURL } = req.body;

    // Verify the requested amount against the user's current cart (server-side)
    const cart = await cartService.getCart(req.user._id);
    const items = Array.isArray(cart.items) ? cart.items : [];

    if (items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let expectedAmount = 0;
    for (const item of items) {
      const unitPrice =
        item.discountPrice > 0 ? item.discountPrice : item.originalPrice;
      expectedAmount += Number(unitPrice || 0) * Number(item.quantity || 1);
    }

    const requestedAmount = Number(amount);
    if (!requestedAmount || requestedAmount < 1) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    // Allow a small rounding tolerance (cents) but reject mismatches
    if (Math.abs(requestedAmount - expectedAmount) > 0.01) {
      return res.status(400).json({
        error: 'Payment amount does not match cart total',
        expectedAmount,
      });
    }

    const data = await bkashService.createPayment(
      expectedAmount.toFixed(2),
      payerReference,
      callbackURL
    );

    res.status(200).json({
      paymentID: data.paymentID,
      bkashURL: data.bkashURL,
    });
  } catch (error) {
    console.error('Create Payment Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

const executePayment = async (req, res) => {
  try {
    const { paymentID } = req.body;
    const data = await bkashService.executePayment(paymentID);

    res.status(200).json(data);
  } catch (error) {
    console.error('Execute Payment Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to execute payment' });
  }
};

// Controller for querying payment status
const queryPaymentStatus = async (req, res) => {
  const { paymentID } = req.body;

  if (!paymentID) {
    return res.status(400).json({
      error: 'PaymentID is required to query the payment status',
    });
  }

  try {
    const paymentStatus = await bkashService.queryPayment(paymentID); // Corrected this line

    if (paymentStatus.error) {
      return res.status(500).json({
        error: paymentStatus.error,
      });
    }

    return res.status(200).json(paymentStatus);
  } catch (error) {
    console.error('Error querying payment status:', error);
    return res.status(500).json({
      error: 'Failed to query payment status',
    });
  }
};

module.exports = {
  createPayment,
  executePayment,
  queryPaymentStatus,
};
