import { create } from "zustand";

// Load cart from local storage
const loadCart = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

// Save cart to local storage
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const useCartStore = create((set) => ({
  cart: loadCart(),

  addToCart: (product, quantity, selectedVariant) =>
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.id === product.id && item.variant === selectedVariant?.size.name
      );

      let updatedCart = [...state.cart];

      if (existingIndex !== -1) {
        updatedCart[existingIndex].quantity += quantity;
        if (updatedCart[existingIndex].quantity > 5) {
          updatedCart[existingIndex].quantity = 5; // Limit max quantity per item
        }
      } else {
        updatedCart.push({
          id: product.id,
          name: product.name,
          price: selectedVariant?.discount || product.finalDiscount,
          variant: selectedVariant?.size.name || "Default",
          quantity,
          thumbnail: product.thumbnailImage,
        });
      }

      saveCart(updatedCart);
      return { cart: updatedCart };
    }),

  removeFromCart: (productId, variant) =>
    set((state) => {
      const updatedCart = state.cart.filter(
        (item) => !(item.id === productId && item.variant === variant)
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    }),

  updateQuantity: (productId, variant, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === productId && item.variant === variant
          ? { ...item, quantity: Math.min(quantity, 5) }
          : item
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    }),

  clearCart: () =>
    set(() => {
      saveCart([]);
      return { cart: [] };
    }),
}));

export default useCartStore;
