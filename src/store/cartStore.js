import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      // ==========================
      // STATE
      // ==========================
      cart: [],
      orders: [],

      // ==========================
      // CART
      // ==========================
      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.cart.find(
            (item) => item._id === product._id
          );

          if (existingProduct) {
            return {
              cart: state.cart.map((item) =>
                item._id === product._id
                  ? {
                      ...item,
                      quantity: (item.quantity || 1) + 1,
                    }
                  : item
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: 1,
              },
            ],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
        })),

      increaseQty: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        })),

      decreaseQty: (id) =>
        set((state) => {
          const targetItem = state.cart.find(
            (item) => item._id === id
          );

          if (!targetItem) return {};

          if (targetItem.quantity <= 1) {
            return {
              cart: state.cart.filter(
                (item) => item._id !== id
              ),
            };
          }

          return {
            cart: state.cart.map((item) =>
              item._id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item
            ),
          };
        }),

      clearCart: () => set({ cart: [] }),

      // ==========================
      // ORDERS
      // ==========================
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "ecommerce-storage",
    }
  )
);

export default useCartStore;
