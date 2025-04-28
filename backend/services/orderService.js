const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const OrderCounter = require("../models/OrderCounterModel");
const VatPercentage = require("../models/VatPercentage"); // adjust path as needed
const Shipping = require("../models/ShippingModel");
const FreeDeliveryAmount = require("../models/FreeDeliveryAmount");
const User = require("../models/UserModel");
const Coupon = require("../models/CouponModel");
const ProductSizeModel = require('../models/ProductSizeModel');  // Import the ProductSizeModel


// const createOrder = async (orderData, userId) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//
//   try {
//     // Get user (optional for guests)
//     let user = null;
//     if (userId) {
//       user = await User.findById(userId);
//       if (!user) throw new Error("User not found");
//     }
//
//     // Generate order number
//     const counter = await OrderCounter.findOneAndUpdate(
//       { id: "order" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true, session },
//     );
//     const orderNo = String(counter.seq).padStart(6, "0");
//
//     // Get VAT
//     const vatEntry = await VatPercentage.findOne().sort({ createdAt: -1 });
//     const vatPercent = vatEntry ? vatEntry.value : 0;
//
//     // Calculate subtotal and update stock
//     let subtotal = 0;
//     const updatedItems = [];
//
//     for (const item of orderData.items) {
//       const { productId, variantId, quantity } = item;
//
//       const product = await Product.findById(productId);
//       if (!product) throw new Error("Product not found");
//
//       let price, stock;
//
//       if (product.variants.length === 0) {
//         price =
//           product.finalDiscount > 0
//             ? product.finalDiscount
//             : product.finalPrice;
//         stock = product.finalStock;
//
//         if (stock < quantity)
//           throw new Error(`Not enough stock for product ${productId}`);
//
//         await Product.updateOne(
//           { _id: productId },
//           { $inc: { finalStock: -quantity } },
//           { session },
//         );
//       } else {
//         const variant = product.variants.find(
//           (v) => v._id.toString() === variantId,
//         );
//         if (!variant) throw new Error("Variant not found");
//
//         if (variant.stock < quantity)
//           throw new Error(`Not enough stock for variant ${variantId}`);
//
//         price = variant.discount || variant.price;
//
//         await Product.updateOne(
//           { _id: productId, "variants._id": variantId },
//           { $inc: { "variants.$.stock": -quantity } },
//           { session },
//         );
//       }
//
//       subtotal += price * quantity;
//       updatedItems.push({ productId, variantId, quantity });
//     }
//
//     // Handle shipping
//     const shippingMethod = await Shipping.findById(orderData.shippingId);
//     if (!shippingMethod) throw new Error("Invalid shipping method");
//
//     const freeDelivery = await FreeDeliveryAmount.findOne().sort({
//       createdAt: -1,
//     });
//     const freeDeliveryThreshold = freeDelivery ? freeDelivery.value : 0;
//
//     const deliveryCharge =
//       subtotal >= freeDeliveryThreshold ? 0 : shippingMethod.value;
//
//     // ✅ Backend Coupon Validation
//     let promoDiscount = 0;
//     let appliedCouponCode = orderData.promoCode || null;
//
//     if (appliedCouponCode) {
//       const coupon = await Coupon.findOne({
//         code: appliedCouponCode.toUpperCase(),
//         status: "active",
//         startDate: { $lte: new Date() },
//         endDate: { $gte: new Date() },
//       });
//
//       if (!coupon) throw new Error("Invalid or expired promo code");
//
//       if (subtotal < coupon.minimumOrder)
//         throw new Error(
//           `Minimum order amount for this coupon is ৳${coupon.minimumOrder}`,
//         );
//
//       if (coupon.type === "percentage") {
//         promoDiscount = Math.floor((coupon.value / 100) * subtotal);
//       } else if (coupon.type === "amount") {
//         promoDiscount = coupon.value;
//       }
//
//       // Cap promo discount if it exceeds subtotal
//       promoDiscount = Math.min(promoDiscount, subtotal);
//     }
//
//     // Reward points
//     const rewardPointsUsed = orderData.rewardPointsUsed || 0;
//     const finalSubtotal = subtotal - promoDiscount - rewardPointsUsed;
//
//     const vat = (finalSubtotal * vatPercent) / 100;
//     const totalAmount = finalSubtotal + vat + deliveryCharge;
//
//     // Save order
//     const newOrder = new Order({
//       ...orderData,
//       orderNo,
//       userId,
//       items: updatedItems,
//       subtotalAmount: subtotal,
//       deliveryCharge,
//       vat,
//       totalAmount,
//       promoCode: appliedCouponCode,
//       promoDiscount,
//       rewardPointsUsed,
//       specialDiscount: 0,
//       advanceAmount: 0,
//       rewardPointsEarned: 0,
//       adminNote: "",
//     });
//
//     const savedOrder = await newOrder.save({ session });
//
//     await session.commitTransaction();
//     session.endSession();
//
//     return savedOrder;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new Error(error.message);
//   }
// };
const createOrder = async (orderData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get user (optional for guests)
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) throw new Error("User not found");
    }

    // Generate order number
    const counter = await OrderCounter.findOneAndUpdate(
      { id: "order" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session },
    );
    const orderNo = String(counter.seq).padStart(6, "0");

    // Get VAT
    const vatEntry = await VatPercentage.findOne().sort({ createdAt: -1 });
    const vatPercent = vatEntry ? vatEntry.value : 0;

    // Calculate subtotal and update stock
    let subtotal = 0;
    const updatedItems = [];

    for (const item of orderData.items) {
      const { productId, variantId, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) throw new Error("Product not found");

      let price, stock;

      if (product.variants.length === 0) {
        price =
          product.finalDiscount > 0
            ? product.finalDiscount
            : product.finalPrice;
        stock = product.finalStock;

        if (stock < quantity)
          throw new Error(`Not enough stock for product ${productId}`);

        await Product.updateOne(
          { _id: productId },
          { $inc: { finalStock: -quantity } },
          { session },
        );
      } else {
        const variant = product.variants.find(
          (v) => v._id.toString() === variantId,
        );
        if (!variant) throw new Error("Variant not found");

        if (variant.stock < quantity)
          throw new Error(`Not enough stock for variant ${variantId}`);

        price = variant.discount || variant.price;

        await Product.updateOne(
          { _id: productId, "variants._id": variantId },
          { $inc: { "variants.$.stock": -quantity } },
          { session },
        );
      }

      subtotal += price * quantity;
      updatedItems.push({ productId, variantId, quantity, price }); // Store price for each item
    }

    // Handle shipping
    const shippingMethod = await Shipping.findById(orderData.shippingId);
    if (!shippingMethod) throw new Error("Invalid shipping method");

    const freeDelivery = await FreeDeliveryAmount.findOne().sort({
      createdAt: -1,
    });
    const freeDeliveryThreshold = freeDelivery ? freeDelivery.value : 0;

    const deliveryCharge =
      subtotal >= freeDeliveryThreshold ? 0 : shippingMethod.value;

    // ✅ Backend Coupon Validation
    let promoDiscount = 0;
    let appliedCouponCode = orderData.promoCode || null;

    if (appliedCouponCode) {
      const coupon = await Coupon.findOne({
        code: appliedCouponCode.toUpperCase(),
        status: "active",
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

      if (!coupon) throw new Error("Invalid or expired promo code");

      if (subtotal < coupon.minimumOrder)
        throw new Error(
          `Minimum order amount for this coupon is ৳${coupon.minimumOrder}`,
        );

      if (coupon.type === "percentage") {
        promoDiscount = Math.floor((coupon.value / 100) * subtotal);
      } else if (coupon.type === "amount") {
        promoDiscount = coupon.value;
      }

      // Cap promo discount if it exceeds subtotal
      promoDiscount = Math.min(promoDiscount, subtotal);
    }

    // Reward points
    const rewardPointsUsed = orderData.rewardPointsUsed || 0;
    const finalSubtotal = subtotal - promoDiscount - rewardPointsUsed;

    const vat = (finalSubtotal * vatPercent) / 100;
    const totalAmount = finalSubtotal + vat + deliveryCharge;

    // Save order
    const newOrder = new Order({
      ...orderData,
      orderNo,
      userId,
      items: updatedItems,
      subtotalAmount: subtotal,
      deliveryCharge,
      vat,
      totalAmount,
      promoCode: appliedCouponCode,
      promoDiscount,
      rewardPointsUsed,
      specialDiscount: 0,
      advanceAmount: 0,
      rewardPointsEarned: 0,
      adminNote: "",
    });

    const savedOrder = await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    return savedOrder;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

// Get all orders
const getAllOrders = async (filter = {}) => {
  try {
    const orders = await Order.find(filter)
      .populate("userId")
      .populate({
        path: "items.productId",
        select:
          "-sizeChart -longDesc -shortDesc -shippingReturn -videoUrl -flags -metaTitle -metaDescription -metaKeywords -searchTags",
      })
      .populate("items.variantId")
      .sort({ createdAt: -1 }); // sort by newest first
    const totalOrders = await Order.countDocuments(filter);

    return { totalOrders, orders };
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("userId")
      .populate({
        path: "items.productId",
        select:
          "-sizeChart -longDesc -shortDesc -shippingReturn -videoUrl -flags -metaTitle -metaDescription -metaKeywords -searchTags",
      })
      .populate({
        path: "items.variantId",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!order) {
      throw new Error("Order not found");
    }

    // Collect all unique size IDs for the selected variants
    const sizeIds = new Set();
    order.items.forEach(item => {
      if (item.productId && item.productId.variants.length > 0) {
        const matchedVariant = item.productId.variants.find(variant => variant._id.toString() === item.variantId.toString());
        if (matchedVariant && matchedVariant.size) {
          sizeIds.add(matchedVariant.size); // Add the size ID of the matched variant
        }
      }
    });

    // Fetch all size names in one query
    const sizes = await ProductSizeModel.find({ _id: { $in: Array.from(sizeIds) } }).select('name').lean();
    const sizeMap = new Map(sizes.map(size => [size._id.toString(), size.name]));

    // Iterate through items and remove non-matched variants, set size name for the matched variant only
    order.items = order.items.map((item) => {
      if (item.productId && item.productId.variants) {
        // Filter variants to keep only the matched variant
        item.productId.variants = item.productId.variants.filter(variant => variant._id.toString() === item.variantId.toString());

        // If a matched variant is found, set its size name
        if (item.productId.variants.length > 0) {
          const variant = item.productId.variants[0]; // The matched variant
          const sizeId = variant.size;
          variant.sizeName = sizeMap.get(sizeId.toString()) || "N/A"; // Set size name for the matched variant
        }
      }
      return item;
    });

    return order;
  } catch (error) {
    throw new Error("Error fetching order by ID: " + error.message);
  }
};



// Update an order
const updateOrder = async (orderId, updateData) => {
  try {
    return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
  } catch (error) {
    throw new Error("Error updating order: " + error.message);
  }
};

// Delete and order
const deleteOrder = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the order by ID
    const order = await Order.findById(orderId).populate("items.productId").populate("items.variantId");

    if (!order) throw new Error("Order not found");

    // Restore stock for each item in the order
    for (const item of order.items) {
      const { productId, variantId, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) throw new Error(`Product not found for item ${productId}`);

      if (product.variants.length === 0) {
        // If the product doesn't have variants, restore the stock to the product
        await Product.updateOne(
          { _id: productId },
          { $inc: { finalStock: quantity } },
          { session }
        );
      } else {
        // If the product has variants, find the specific variant and restore the stock
        const variant = product.variants.find(v => v._id.toString() === variantId.toString());
        if (!variant) throw new Error(`Variant not found for product ${productId}`);

        await Product.updateOne(
          { _id: productId, "variants._id": variantId },
          { $inc: { "variants.$.stock": quantity } },
          { session }
        );
      }
    }

    // Delete the order after updating stock
    await Order.findByIdAndDelete(orderId, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { message: "Order deleted successfully, stock updated" };
  } catch (error) {
    // Abort the transaction if there's an error
    await session.abortTransaction();
    session.endSession();
    throw new Error("Error deleting order and updating stock: " + error.message);
  }
};



// Export the functions as an object
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
