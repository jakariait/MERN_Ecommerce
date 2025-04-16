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

  // Fetch cart from backend after login
  loadCartFromBackend: async (token) => {
    try {
      const res = await axios.get(`api/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serverCartItems = res.data.cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        originalPrice: item.originalPrice,
        discountPrice: item.discountPrice,
        variant: item.variant,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        slug: item.slug,
      }));

      saveCart(serverCartItems);
      set({ cart: serverCartItems });
    } catch (error) {
      console.error("Error loading cart from backend:", error);
    }
  },

  addToCart: async (product, quantity, selectedVariant) => {
    const variant = selectedVariant?.size.name || "Default";
    const variantId = selectedVariant?._id || "Default";
    const token = localStorage.getItem("user_token");

    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.productId === product.id && item.variant === variant,
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
            selectedVariant?.discount > 0 ? selectedVariant.discount : 0,
          variant,
          quantity,
          thumbnail: product.thumbnailImage,
          variantId,
          slug: product.slug,
        });
      }

      saveCart(updatedCart);
      return { cart: updatedCart };
    });

    if (token) {
      try {
        await axios.post(
          `${apiUrl}/addToCart`,
          {
            productId: product.id,
            name: product.name,
            originalPrice: selectedVariant?.price ?? product.finalPrice,
            discountPrice:
              selectedVariant?.discount > 0 ? selectedVariant.discount : 0,
            variant,
            quantity,
            thumbnail: product.thumbnailImage,
            slug: product.slug,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (error) {
        console.error("Error adding item to DB cart:", error);
      }
    }
  },

  updateQuantity: async (productId, variant, quantity) => {
    const newQuantity = Math.min(quantity, 5);
    const token = localStorage.getItem("user_token");

    // Update local cart immediately
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.productId === productId && item.variant === variant
          ? { ...item, quantity: newQuantity }
          : item,
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    });

    // Ensure token is available
    if (!token) {
      return;
    }

    try {
      const response = await axios.patch(
        `/api/updateCartItem`, // ✅ relative path
        { productId, variant, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error("Error updating quantity in DB:", error);
      if (error.response) {
        console.error("Response from backend:", error.response.data);
        console.error("Response status code:", error.response.status);
      }
    }
  },

  removeFromCart: async (productId, variant) => {
    set((state) => {
      const updatedCart = state.cart.filter(
        (item) => !(item.productId === productId && item.variant === variant),
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    });

    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        await axios.delete(`api/removeCartItem`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId, variant },
        });
      } catch (error) {
        console.error("Error removing cart item from DB:", error);
      }
    }
  },

  clearCart: async () => {
    set(() => {
      saveCart([]);
      return { cart: [] };
    });

    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        await axios.delete(`${apiUrl}/clearCart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error clearing cart in DB:", error);
      }
    }
  },

  // Sync full cart (used after login or fallback)
  syncCartToDB: async (token) => {
    const localCart = get().cart;

    try {
      // Loop through each item in the cart and send it individually
      for (const item of localCart) {
        await axios.post(
          `/api/addToCart`, // relative path
          {
            productId: item.productId, // Send each item's productId
            name: item.name,
            originalPrice: item.originalPrice,
            discountPrice: item.discountPrice,
            variant: item.variant,
            quantity: item.quantity,
            thumbnail: item.thumbnail,
            slug: item.slug,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      // Optionally, after adding all items, fetch the updated cart from the backend
      const res = await axios.get(`/api/getCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const serverCartItems = res.data.cart.items.map((item) => ({
        productId: item.product._id,
        name: item.name,
        originalPrice: item.originalPrice,
        discountPrice: item.discountPrice,
        variant: item.variant,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        slug: item.product?.slug,

      }));

      saveCart(serverCartItems);
      set({ cart: serverCartItems });
    } catch (error) {
      console.error("Error syncing entire cart to DB:", error);
    }
  },
}));

export default useCartStore;
