const User = require('../models/UserModel'); // Import the User model
const orderService = require('../services/orderService');



// Create a new order
// const createOrder = async (req, res) => {
//   try {
//     const orderData = req.body;
//     const order = await orderService.createOrder(orderData);
//     res.status(201).json({ success: true, message: 'Order created successfully', order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const createOrder = async (req, res) => {
  try {
    const { userId, rewardPointsUsed = 0, ...orderData } = req.body;

    // Fetch the user to validate reward points
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Parse values
    const rewardPointsUsedNumber = Number(rewardPointsUsed);
    const userRewardPoints = Number(user.rewardPoints || 0);

    // Validate reward points
    if (rewardPointsUsedNumber > userRewardPoints) {
      return res.status(400).json({
        success: false,
        message: "You cannot use more reward points than you have available.",
      });
    }

    // Proceed with creating the order (send rewardPointsUsed as part of orderData)
    const order = await orderService.createOrder({ ...orderData, rewardPointsUsed }, userId);

    // Deduct reward points and save user
    user.rewardPoints -= rewardPointsUsedNumber;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Error creating order: " + error.message });
  }
};







// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updateData = req.body;
  try {
    const updatedOrder = await orderService.updateOrder(orderId, updateData);
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order updated successfully', updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const deletedOrder = await orderService.deleteOrder(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Exporting the controller functions
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
