import api from "../api/axios";

export const getWishlist = async () => {
    const res = await api.get("/wishlist");
    return res.data;
};

export const addWishlist = async (productId) => {
    const res = await api.post(`/wishlist/${productId}`);
    return res.data;
};

export const removeWishlist = async (productId) => {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data;
};
