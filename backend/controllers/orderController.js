const User = require("../models/UserModel"); // Import the User model
const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const { userId, rewardPointsUsed = 0, ...orderData } = req.body;

    let user = null;

    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const rewardPointsUsedNumber = Number(rewardPointsUsed);
      const userRewardPoints = Number(user.rewardPoints || 0);

      if (rewardPointsUsedNumber > userRewardPoints) {
        return res.status(400).json({
          success: false,
          message: "You cannot use more reward points than you have available.",
        });
      }
    }

    // Proceed with creating the order (pass userId only if available)
    const order = await orderService.createOrder(
      { ...orderData, rewardPointsUsed },
      userId || null,
    );

    if (user && rewardPointsUsed > 0) {
      user.rewardPoints -= Number(rewardPointsUsed);
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order: " + error.message,
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { orderStatus } = req.query;

    // Build filter object
    const filter = {};
    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    const { totalOrders, orders } = await orderService.getAllOrders(filter);

    res.status(200).json({ success: true, totalOrders, orders });
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
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      updatedOrder,
    });
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
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by Order No
const getOrderByOrderNo = async (req, res) => {
  const { orderNo } = req.params;
  try {
    const order = await orderService.getOrderByOrderNo(orderNo);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
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
  getOrderByOrderNo
};
