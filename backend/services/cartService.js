const CartModel = require("../models/CartModel");

const getCart = async (userId) => {
  const cart = await CartModel.findOne({ user: userId });
  return cart || { user: userId, items: [] };
};

const addToCart = async (userId, item) => {
  let cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    cart = new CartModel({ user: userId, items: [item] });
  } else {
    const index = cart.items.findIndex(
      (i) => i.product.toString() === item.product && i.variant === item.variant
    );

    if (index > -1) {
      cart.items[index].quantity += item.quantity;
      if (cart.items[index].quantity > 5) {
        cart.items[index].quantity = 5;
      }
    } else {
      cart.items.push(item);
    }
  }

  await cart.save();
  return cart;
};

const updateCartItem = async (userId, productId, variant, quantity) => {
  const cart = await CartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const index = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.variant === variant
  );

  if (index > -1) {
    cart.items[index].quantity = quantity;
    await cart.save();
    return cart;
  } else {
    throw new Error("Item not found in cart");
  }
};

const removeCartItem = async (userId, productId, variant) => {
  const cart = await CartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (item) => !(item.product.toString() === productId && item.variant === variant)
  );
  await cart.save();
  return cart;
};

const clearCart = async (userId) => {
  const cart = await CartModel.findOne({ user: userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return { message: "Cart cleared successfully" };
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
