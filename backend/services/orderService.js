const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const OrderCounter = require("../models/OrderCounterModel");
const VatPercentage = require("../models/VatPercentage"); // adjust path as needed
const Shipping = require("../models/ShippingModel");
const FreeDeliveryAmount = require("../models/FreeDeliveryAmount");
const User = require("../models/UserModel");



// const createOrder = async (orderData) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//
//   try {
//     // Step 1: Generate sequential order number
//     let counter = await OrderCounter.findOneAndUpdate(
//       { id: "order" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true, session }
//     );
//     const orderNo = String(counter.seq).padStart(6, "0");
//
//     // Step 2: Get latest VAT percentage
//     const vatEntry = await VatPercentage.findOne().sort({ createdAt: -1 });
//     const vatPercent = vatEntry ? vatEntry.value : 0;
//
//     // Step 3: Calculate subtotal from items
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
//         price = product.finalDiscount > 0 ? product.finalDiscount : product.finalPrice;
//         stock = product.finalStock;
//       } else {
//         const variant = product.variants.find((v) => v._id.toString() === variantId);
//         if (!variant) throw new Error("Variant not found");
//
//         if (variant.stock < quantity) {
//           throw new Error(`Not enough stock for variant ${variantId}`);
//         }
//
//         await Product.updateOne(
//           { _id: productId, "variants._id": variantId },
//           { $inc: { "variants.$.stock": -quantity } },
//           { session }
//         );
//
//         price = variant.discount || variant.price;
//         stock = variant.stock;
//       }
//
//       if (stock < quantity) {
//         throw new Error(`Not enough stock for product ${productId}`);
//       }
//
//       if (product.variants.length === 0) {
//         await Product.updateOne(
//           { _id: productId },
//           { $inc: { finalStock: -quantity } },
//           { session }
//         );
//       }
//
//       subtotal += price * quantity;
//
//       updatedItems.push({ productId, variantId, quantity });
//     }
//
//     // Step 4: Fetch Shipping Charge if applicable
//     const shippingMethod = await Shipping.findById(orderData.shippingId);
//     if (!shippingMethod) throw new Error("Invalid shipping method");
//
//     const freeDeliveryAmount = await FreeDeliveryAmount.findOne().sort({ createdAt: -1 });
//     const freeDeliveryThreshold = freeDeliveryAmount ? freeDeliveryAmount.value : 0;
//
//     // Apply free delivery only if the freeDeliveryThreshold is > 0 and subtotal meets or exceeds it
//     let deliveryCharge = 0;
//     if (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) {
//       deliveryCharge = 0; // Free delivery
//     } else {
//       deliveryCharge = shippingMethod.value; // Standard shipping charge
//     }
//
//     // Step 5: Apply discounts (we're ignoring rewardPointsEarned here as per your requirement)
//     const {
//       promoDiscount = 0,
//       finalDiscount = 0,
//       // 🚫 Ignore rewardPointsEarned during creation
//     } = orderData;
//
//     let discountedSubtotal = subtotal;
//     if (finalDiscount > 0) {
//       discountedSubtotal -= finalDiscount;
//     }
//
//     // Step 6: Calculate VAT
//     const vat = (discountedSubtotal * vatPercent) / 100;
//
//     // Step 7: Final amount calculation
//     const totalAmount =
//       discountedSubtotal - promoDiscount + deliveryCharge + vat;
//
//     // Step 8: Save order with advanceAmount set to 0 during creation
//     const newOrder = new Order({
//       ...orderData,
//       orderNo,
//       items: updatedItems,
//       subtotalAmount: discountedSubtotal,
//       deliveryCharge,
//       vat,
//       totalAmount,
//       specialDiscount: 0, // 🚫 force 0 during creation
//       advanceAmount: 0,  // 🚫 force 0 during creation
//       rewardPointsEarned: 0,
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
//     throw new Error("Error creating order: " + error.message);
//   }
// };
const createOrder = async (orderData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch user if available (optional now)
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) throw new Error("User not found");
    }

    // Generate order number
    let counter = await OrderCounter.findOneAndUpdate(
      { id: "order" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );
    const orderNo = String(counter.seq).padStart(6, "0");

    // Get VAT percentage
    const vatEntry = await VatPercentage.findOne().sort({ createdAt: -1 });
    const vatPercent = vatEntry ? vatEntry.value : 0;

    // Calculate subtotal
    let subtotal = 0;
    const updatedItems = [];

    for (const item of orderData.items) {
      const { productId, variantId, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) throw new Error("Product not found");

      let price, stock;

      if (product.variants.length === 0) {
        price = product.finalDiscount > 0 ? product.finalDiscount : product.finalPrice;
        stock = product.finalStock;
        if (stock < quantity) throw new Error(`Not enough stock for product ${productId}`);
        await Product.updateOne(
          { _id: productId },
          { $inc: { finalStock: -quantity } },
          { session }
        );
      } else {
        const variant = product.variants.find((v) => v._id.toString() === variantId);
        if (!variant) throw new Error("Variant not found");
        if (variant.stock < quantity) throw new Error(`Not enough stock for variant ${variantId}`);

        price = variant.discount || variant.price;

        await Product.updateOne(
          { _id: productId, "variants._id": variantId },
          { $inc: { "variants.$.stock": -quantity } },
          { session }
        );
      }

      subtotal += price * quantity;
      updatedItems.push({ productId, variantId, quantity });
    }

    // Shipping cost
    const shippingMethod = await Shipping.findById(orderData.shippingId);
    if (!shippingMethod) throw new Error("Invalid shipping method");

    const freeDelivery = await FreeDeliveryAmount.findOne().sort({ createdAt: -1 });
    const freeDeliveryThreshold = freeDelivery ? freeDelivery.value : 0;

    let deliveryCharge = subtotal >= freeDeliveryThreshold ? 0 : shippingMethod.value;

    // Discounts and totals
    const {
      promoDiscount = 0,
      finalDiscount = 0,
      rewardPointsUsed = 0,
    } = orderData;

    let discountedSubtotal = subtotal - finalDiscount - rewardPointsUsed;
    const vat = (discountedSubtotal * vatPercent) / 100;
    const totalAmount = discountedSubtotal - promoDiscount + deliveryCharge + vat;

    // Create and save order
    const newOrder = new Order({
      ...orderData,
      orderNo,
      userId,
      items: updatedItems,
      subtotalAmount: discountedSubtotal,
      deliveryCharge,
      vat,
      totalAmount,
      rewardDiscount: rewardPointsUsed,
      specialDiscount: 0,
      advanceAmount: 0,
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
const getAllOrders = async () => {
  try {
    return await Order.find()
      .populate("userId")
      .populate({
        path: "items.productId",
        select:
          "-sizeChart -longDesc -shortDesc -shippingReturn -videoUrl -flags -metaTitle -metaDescription -metaKeywords -searchTags",
      })
      .populate("items.variantId");
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

// Get order by ID
const getOrderById = async (orderId) => {
  try {
    return await Order.findById(orderId)
      .populate("userId")
      .populate("items.productId")
      .populate("items.variantId");
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

// Delete an order
const deleteOrder = async (orderId) => {
  try {
    return await Order.findByIdAndDelete(orderId);
  } catch (error) {
    throw new Error("Error deleting order: " + error.message);
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
