import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user ? user._id.toString() : "guest"; // Amankan ke string
  } catch (error) {
    return "guest";
  }
};

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      whishlist: [],

      loadUserData: () => {},

      // ==========================
      // CART ACTIONS (FIXED)
      // ==========================
      addToCart: (product) => {
        if (!product) return;
        
        const currentCart = get().cart;
        const productId = (product._id || product.id).toString(); // Paksa ke String

        // Cari apakah produk sudah ada di keranjang dengan aman
        const existingProduct = currentCart.find((item) => {
          const itemId = (item._id || item.id).toString();
          return itemId === productId;
        });

        let newCart;
        if (existingProduct) {
          newCart = currentCart.map((item) => {
            const itemId = (item._id || item.id).toString();
            return itemId === productId
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item;
          });
        } else {
          newCart = [...currentCart, { ...product, quantity: 1 }];
        }

        set({ cart: newCart });
      },

      removeFromCart: (id) => {
        if (!id) return;
        const newCart = get().cart.filter(
          (item) => (item._id || item.id).toString() !== id.toString()
        );
        set({ cart: newCart });
      },

      increaseQty: (id) => {
        if (!id) return;
        const newCart = get().cart.map((item) =>
          (item._id || item.id).toString() === id.toString()
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
        set({ cart: newCart });
      },

      decreaseQty: (id) => {
        if (!id) return;
        const currentCart = get().cart;
        const targetItem = currentCart.find(
          (item) => (item._id || item.id).toString() === id.toString()
        );

        if (!targetItem) return;

        let newCart;
        if ((targetItem.quantity || 1) <= 1) {
          newCart = currentCart.filter(
            (item) => (item._id || item.id).toString() !== id.toString()
          );
        } else {
          newCart = currentCart.map((item) =>
            (item._id || item.id).toString() === id.toString()
              ? { ...item, quantity: targetItem.quantity - 1 }
              : item
          );
        }

        set({ cart: newCart });
      },

  addToWishlist: (product) => {
  if (!product) return;

  const currentWishlist = get().wishlist;
  const productId = (product._id || product.id).toString();

  const alreadyExists = currentWishlist.some(
    (item) => (item._id || item.id).toString() === productId
  );

  if (alreadyExists) return; // hindari duplikat

  set({ wishlist: [...currentWishlist, product] });
},

removeFromWishlist: (id) => {
  if (!id) return;
  const newWishlist = get().wishlist.filter(
    (item) => (item._id || item.id).toString() !== id.toString()
  );
  set({ wishlist: newWishlist });
},

     clearWishlist: () => set({ wishlist: [] }),
     
     clearCart: () => set({ cart: [] }),

      addOrder: (order) => {
        set((state) => ({ orders: [...state.orders, order] }));
      },

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: `user_store_${getUserId()}`,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;

