import { create } from "zustand";

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};

const getCartKey = () => {
  const user = getCurrentUser();
  return user ? `cart_${user._id}` : null;
};

const getOrderKey = () => {
  const user = getCurrentUser();
  return user ? `orders_${user._id}` : null;
};

const loadCart = () => {
  const key = getCartKey();
  if (!key) return [];

  return JSON.parse(localStorage.getItem(key)) || [];
};

const saveCart = (cart) => {
  const key = getCartKey();
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(cart));
};

const loadOrders = () => {
  const key = getOrderKey();
  if (!key) return [];

  return JSON.parse(localStorage.getItem(key)) || [];
};

const saveOrders = (orders) => {
  const key = getOrderKey();
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(orders));
};

const useCartStore =
  create((set) => ({
      // ==========================
      // STATE
      // ==========================
      cart: loadCart(),
      orders: loadOrders(),
  
        loadUserData: () => {
  set({
    cart: loadCart(),
    orders: loadOrders(),
  });
},
      // ==========================
      // CART
      // ==========================
 addToCart: (product) =>
  set((state) => {
    let newCart;

    const existingProduct = state.cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      newCart = state.cart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      newCart = [
        ...state.cart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    saveCart(newCart);

    return {
      cart: newCart,
    };
  }),

 removeFromCart: (id) =>
  set((state) => {
    const newCart = state.cart.filter(
      (item) => item._id !== id
    );

    saveCart(newCart);

    return {
      cart: newCart,
    };
  }),

 increaseQty: (id) =>
  set((state) => {
    const newCart = state.cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(newCart);

    return {
      cart: newCart,
    };
  }),

decreaseQty: (id) =>
  set((state) => {
    const targetItem = state.cart.find(
      (item) => item._id === id
    );

    if (!targetItem) return {};

    let newCart;

    if (targetItem.quantity <= 1) {
      newCart = state.cart.filter(
        (item) => item._id !== id
      );
    } else {
      newCart = state.cart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      );
    }

    saveCart(newCart);

    return {
      cart: newCart,
    };
  }),

clearCart: () => {
  saveCart([]);

  set({
    cart: [],
  });
},
      // ==========================
      // ORDERS
      // ==========================
addOrder: (order) =>
  set((state) => {
    const newOrders = [...state.orders, order];

    saveOrders(newOrders);

    return {
      orders: newOrders,
    };
  }),

clearOrders: () => {
  saveOrders([]);

  set({
    orders: [],
  });
},  
}));

export default useCartStore;
