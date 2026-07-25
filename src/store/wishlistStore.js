import { create } from "zustand";

import {
    getWishlist,
    addWishlist,
    removeWishlist,
} from "../services/wishlistService";

const useWishlistStore = create((set, get) => ({

    wishlist: [],

    loading: false,

    fetchWishlist: async () => {

        set({ loading: true });

        try {

            const data = await getWishlist();

            set({
                wishlist: data.wishlist,
                loading: false
            });

        } catch (err) {

            set({ loading: false });

        }

    },

    addToWishlist: async (productId) => {

        const data = await addWishlist(productId);

        set({
            wishlist: data.wishlist
        });

    },

    removeFromWishlist: async (productId) => {

        const data = await removeWishlist(productId);

        set({
            wishlist: data.wishlist
        });

    }

}));

export default useWishlistStore;
