import { create } from "zustand";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Load cart from local storage
const loadCart = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

// Save cart to local storage
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const useCartStore = create((set, get) => ({
  cart: loadCart(),

  addToCart: (product, quantity, selectedVariant) =>
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) =>
          item.id === product.id && item.variant === selectedVariant?.size.name,
      );

      let updatedCart = [...state.cart];

      if (existingIndex !== -1) {
        updatedCart[existingIndex].quantity += quantity;
        if (updatedCart[existingIndex].quantity > 5) {
          updatedCart[existingIndex].quantity = 5;
        }
      } else {
        updatedCart.push({
          productId: product.id,
          name: product.name,
          originalPrice: selectedVariant?.price ?? product.finalPrice,
          discountPrice:
            selectedVariant?.discount > 0
              ? selectedVariant.discount
              : 0, // Only if > 0, else 0
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
        (item) => !(item.id === productId && item.variant === variant),
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    }),

  updateQuantity: (productId, variant, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === productId && item.variant === variant
          ? { ...item, quantity: Math.min(quantity, 5) }
          : item,
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    }),

  clearCart: () =>
    set(() => {
      saveCart([]);
      return { cart: [] };
    }),

  syncCartToDB: async (token) => {
    const localCart = get().cart;

    try {
      for (const item of localCart) {
        await axios.post(
          `${apiUrl}/addToCart`,
          {
            productId: item.productId, // 🔥 FIXED HERE
            name: item.name,
            originalPrice: item.originalPrice,
            discountPrice: item.discountPrice,
            variant: item.variant,
            quantity: item.quantity,
            thumbnail: item.thumbnail,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      const res = await axios.get(`${apiUrl}/getCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const serverCartItems = res.data.cart.items.map((item) => ({
        id: item.product._id,
        productId: item.product._id, // optionally store both
        name: item.name,
        originalPrice: item.originalPrice,
        discountPrice: item.discountPrice,
        variant: item.variant,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      }));

      saveCart(serverCartItems);
      set({ cart: serverCartItems });
    } catch (error) {
      console.error("Cart sync error:", error);
    }
  }

}));

export default useCartStore;
