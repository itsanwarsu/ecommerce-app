import {
  useParams,
  useOutletContext,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../../api/axios";

import LocalReviews from "../../components/LocalReviews";
import FooterNavbar from "../../components/FooterNavbar";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import useRecentStore from "../../store/recentStore";
import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";

import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineShoppingCart,
} from "react-icons/hi2";

import "swiper/css";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  // =====================================================
  // OUTLET CONTEXT
  // =====================================================

  const context = useOutletContext() || {};
  const setCurrentProduct = context.setCurrentProduct;

  // =====================================================
  // AUTH
  // =====================================================

  const user = useAuthStore((state) => state.user);

  // =====================================================
  // RECENT PRODUCTS
  // =====================================================

  const addRecentProduct = useRecentStore(
    (state) => state.addRecentProduct
  );

  // =====================================================
  // CART
  // =====================================================

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  // =====================================================
  // WISHLIST
  // =====================================================

  const {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlistStore();

  // =====================================================
  // STATE
  // =====================================================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH WISHLIST
  // =====================================================

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/products/${id}`);

        const productData =
          res.data.product || res.data;

        console.log(
          "PRODUCT DATA:",
          productData
        );

        console.log(
          "SELLER FIELD:",
          productData.seller
        );

        setProduct(productData);

        // Set current product ke layout
        if (
          typeof setCurrentProduct === "function"
        ) {
          setCurrentProduct(productData);
        }

        // =================================================
        // SAVE RECENT PRODUCT
        // =================================================

        const userId =
          user?._id ||
          user?.id ||
          "guest";

        addRecentProduct(
          userId,
          productData
        );

      } catch (err) {
        console.error(
          "Gagal mengambil detail produk:",
          err
        );

        setProduct(null);

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      if (
        typeof setCurrentProduct === "function"
      ) {
        setCurrentProduct(null);
      }
    };

  }, [
    id,
    user,
    setCurrentProduct,
    addRecentProduct,
  ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Memuat produk...
        </p>
      </div>
    );
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h1 className="text-center text-xl text-gray-500 font-medium">
          Produk tidak ditemukan
        </h1>
      </div>
    );
  }

  // =====================================================
  // PRODUCT ID
  // =====================================================

  const productId =
    product.id || product._id;

  // =====================================================
  // IMAGE LIST
  // =====================================================

  const imageList =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images.map(
          (img) => img.url || img
        )
      : [
          product.image?.url ||
            product.image ||
            product.imageUrl ||
            "https://via.placeholder.com/400",
        ];

  // =====================================================
  // WISHLIST STATUS
  // =====================================================

  const isWishlisted = wishlist.some(
    (item) => {
      const wishlistProduct =
        item.product || item;

      return (
        String(
          wishlistProduct._id ||
            wishlistProduct.id
        ) === String(productId)
      );
    }
  );

  // =====================================================
  // WISHLIST HANDLER
  // =====================================================

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(
          productId
        );
      } else {
        await addToWishlist(
          productId
        );
      }

    } catch (err) {
      console.error(
        "Wishlist error:",
        err
      );

      console.error(
        "Response:",
        err.response?.data
      );
    }
  };

  // =====================================================
  // CHAT HANDLER
  // =====================================================

  const handleChat = () => {
    if (!product) {
      console.warn(
        "Produk belum tersedia."
      );

      return;
    }

    const currentProductId =
      product.id || product._id;

    const sellerId =
      product.sellerId ||
      product.seller?.id ||
      product.seller?._id ||
      product.seller;

    if (
      !currentProductId ||
      !sellerId
    ) {
      console.warn(
        "ID produk atau seller tidak ditemukan:",
        {
          product,
          productId: currentProductId,
          sellerId,
        }
      );

      return;
    }

    console.log(
      "Membuka chat dengan:",
      {
        productId: currentProductId,
        sellerId,
      }
    );

    navigate("/chat", {
      state: {
        productId:
          currentProductId,

        sellerId,
      },
    });
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = () => {
    if (!product) return;

    addToCart(product);

    navigate("/checkout");
  };

  // =====================================================
  // STOCK
  // =====================================================

  const isOutOfStock =
    product.stock !== undefined &&
    Number(product.stock) <= 0;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      <main className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 mt-16 pb-28">

        {/* =================================================
            DESKTOP 3 COLUMN LAYOUT
            ================================================= */}

        <div className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_280px] lg:gap-8 lg:items-start">

          {/* =================================================
              LEFT
              PRODUCT IMAGE
              ================================================= */}

          <section className="w-full">

            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
              }}
              spaceBetween={10}
              slidesPerView={1}
              className="
                rounded-2xl
                overflow-hidden
                bg-white
                dark:bg-gray-800
                border
                border-gray-100
                dark:border-gray-700
                shadow-sm
              "
            >

              {imageList.map(
                (image, index) => (
                  <SwiperSlide
                    key={index}
                  >

                    <div
                      className="
                        h-80
                        sm:h-[420px]
                        lg:h-[500px]
                        flex
                        items-center
                        justify-center
                        p-6
                      "
                    >

                      <img
                        src={image}
                        alt={
                          product.name ||
                          "Gambar Produk"
                        }
                        className="
                          w-full
                          h-full
                          object-contain
                        "
                      />

                    </div>

                  </SwiperSlide>
                )
              )}

            </Swiper>

            {/* =================================================
                DESKTOP THUMBNAILS
                ================================================= */}

            {imageList.length > 1 && (
              <div
                className="
                  hidden
                  lg:flex
                  gap-3
                  mt-4
                  overflow-x-auto
                "
              >

                {imageList.map(
                  (image, index) => (
                    <div
                      key={index}
                      className="
                        w-20
                        h-20
                        flex-shrink-0
                        rounded-xl
                        border
                        border-gray-200
                        dark:border-gray-700
                        bg-white
                        dark:bg-gray-800
                        p-2
                      "
                    >

                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="
                          w-full
                          h-full
                          object-contain
                          rounded-lg
                        "
                      />

                    </div>
                  )
                )}

              </div>
            )}

          </section>

          {/* =================================================
              CENTER
              PRODUCT INFORMATION
              ================================================= */}

          <section className="mt-4 lg:mt-0">

            {/* =================================================
                MOBILE PRICE + WISHLIST

                FooterNavbar akan menangani tombol
                Buy + Cart di mobile.
                ================================================= */}

            <div className="lg:hidden flex items-center justify-between">

              <h2
                className="
                  text-xl
                  font-bold
                  text-blue-600
                  ml-2
                "
              >
                Rp{" "}
                <span className="text-2xl">
                  {Number(
                    product.price || 0
                  ).toLocaleString(
                    "id-ID"
                  )}
                </span>
              </h2>

              <button
                onClick={handleWishlist}
                className="
                  mr-2
                  w-10
                  h-10
                  rounded-full
                  bg-white
                  dark:bg-gray-900
                  shadow
                  flex
                  items-center
                  justify-center
                  hover:scale-110
                  transition
                "
                aria-label="Wishlist"
              >

                {isWishlisted ? (
                  <HiHeart
                    className="
                      text-red-500
                      text-3xl
                    "
                  />
                ) : (
                  <HiOutlineHeart
                    className="
                      text-gray-500
                      text-3xl
                    "
                  />
                )}

              </button>

            </div>

            {/* =================================================
                DESKTOP PRICE
                ================================================= */}

            <div
              className="
                hidden
                lg:flex
                items-center
                justify-between
                mb-3
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                  text-blue-600
                "
              >
                Rp{" "}
                <span className="text-3xl">
                  {Number(
                    product.price || 0
                  ).toLocaleString(
                    "id-ID"
                  )}
                </span>
              </h2>

              <button
                onClick={handleWishlist}
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-white
                  dark:bg-gray-900
                  border
                  border-gray-200
                  dark:border-gray-700
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  hover:scale-110
                  transition
                "
                aria-label="Wishlist"
              >

                {isWishlisted ? (
                  <HiHeart
                    className="
                      text-red-500
                      text-3xl
                    "
                  />
                ) : (
                  <HiOutlineHeart
                    className="
                      text-gray-500
                      text-3xl
                    "
                  />
                )}

              </button>

            </div>

            {/* =================================================
                PRODUCT NAME
                ================================================= */}

            <h1
              className="
                text-2xl
                lg:text-3xl
                font-bold
                mt-1
                text-gray-900
                dark:text-white
              "
            >
              {product.name}
            </h1>

            {/* =================================================
                PRODUCT META
                ================================================= */}

            <div
              className="
                flex
                flex-wrap
                gap-3
                mt-4
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >

              {product.category && (
                <span
                  className="
                    px-3
                    py-1
                    bg-gray-100
                    dark:bg-gray-800
                    rounded-full
                  "
                >
                  {product.category.name ||
                    product.category}
                </span>
              )}

              {product.stock !==
                undefined && (
                <span
                  className="
                    px-3
                    py-1
                    bg-gray-100
                    dark:bg-gray-800
                    rounded-full
                  "
                >
                  Stok:{" "}
                  {product.stock}
                </span>
              )}

            </div>

            {/* =================================================
                DESCRIPTION
                ================================================= */}

            <div
              className="
                mt-6
                bg-white
                dark:bg-gray-800
                rounded-2xl
                border
                border-gray-100
                dark:border-gray-700
                shadow-sm
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-4
                "
              >

                <div
                  className="
                    w-1.5
                    h-6
                    bg-blue-600
                    rounded-full
                  "
                />

                <h2
                  className="
                    text-xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Deskripsi Produk
                </h2>

              </div>

              <div
                className="
                  border-t
                  border-gray-100
                  dark:border-gray-700
                  pt-4
                "
              >

                <p
                  className="
                    text-gray-700
                    dark:text-white
                    text-[15px]
                    leading-8
                    whitespace-pre-line
                  "
                >
                  {product.description ||
                    "Tidak ada deskripsi untuk produk ini."}
                </p>

              </div>

            </div>

            {/* =================================================
                REVIEWS
                ================================================= */}

            <div className="mt-6">

              <LocalReviews
                productId={productId}
              />

            </div>

          </section>

          {/* =================================================
              RIGHT
              DESKTOP ACTION PANEL
              ================================================= */}

          <aside
            className="
              hidden
              lg:block
              lg:sticky
              lg:top-24
            "
          >

            <div
              className="
                bg-white
                dark:bg-gray-800
                rounded-2xl
                border
                border-gray-100
                dark:border-gray-700
                shadow-sm
                p-5
              "
            >

              {/* =================================================
                  TOTAL PRICE
                  ================================================= */}

              <div className="mb-5">

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Total harga
                </p>

                <p
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                    dark:text-white
                    mt-1
                  "
                >
                  Rp{" "}
                  {Number(
                    product.price || 0
                  ).toLocaleString(
                    "id-ID"
                  )}
                </p>

              </div>

              {/* =================================================
                  STOCK
                  ================================================= */}

              {product.stock !==
                undefined && (
                <div className="mb-5">

                  {product.stock > 0 ? (
                    <p
                      className="
                        text-sm
                        text-green-600
                        font-medium
                      "
                    >
                      ✓ Stok tersedia
                    </p>
                  ) : (
                    <p
                      className="
                        text-sm
                        text-red-500
                        font-medium
                      "
                    >
                      Stok habis
                    </p>
                  )}

                </div>
              )}

              {/* =================================================
                  CHAT + CART
                  ================================================= */}

              <div className="flex gap-2">

                {/* CHAT */}

                <button
                  onClick={handleChat}
                  disabled={
                    !product
                  }
                  aria-label="Chat penjual"
                  className="
                    w-14
                    h-12
                    border
                    border-gray-300
                    dark:border-gray-600
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    hover:bg-gray-50
                    dark:hover:bg-gray-700
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  <HiOutlineChatBubbleOvalLeft
                    className="
                      text-2xl
                      text-gray-700
                      dark:text-white
                    "
                  />

                </button>

                {/* ADD CART */}

                <button
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    !product ||
                    isOutOfStock
                  }
                  className="
                    flex-1
                    border-2
                    border-orange-500
                    text-orange-500
                    hover:bg-orange-50
                    dark:hover:bg-gray-700
                    font-semibold
                    rounded-xl
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  <span
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

                    <HiOutlineShoppingCart
                      className="text-xl"
                    />

                    Keranjang

                  </span>

                </button>

              </div>

              {/* =================================================
                  BUY NOW
                  ================================================= */}

              <button
                onClick={handleBuyNow}
                disabled={
                  !product ||
                  isOutOfStock
                }
                className="
                  w-full
                  mt-3
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  py-3.5
                  rounded-xl
                  transition
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                "
              >
                Beli Sekarang
              </button>

              {/* =================================================
                  WISHLIST
                  ================================================= */}

              <button
                onClick={
                  handleWishlist
                }
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-3
                  py-3
                  rounded-xl
                  text-gray-600
                  dark:text-gray-300
                  hover:bg-gray-100
                  dark:hover:bg-gray-700
                  transition
                "
              >

                {isWishlisted ? (
                  <>
                    <HiHeart
                      className="
                        text-xl
                        text-red-500
                      "
                    />

                    Hapus dari Wishlist
                  </>
                ) : (
                  <>
                    <HiOutlineHeart
                      className="text-xl"
                    />

                    Tambah ke Wishlist
                  </>
                )}

              </button>

              {/* =================================================
                  INFORMATION
                  ================================================= */}

              <div
                className="
                  border-t
                  border-gray-100
                  dark:border-gray-700
                  mt-5
                  pt-5
                "
              >

                <p
                  className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    text-center
                    leading-5
                  "
                >
                  Pembayaran aman dan
                  proses checkout mudah.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

      {/* =====================================================
          MOBILE FOOTER NAVBAR

          FooterNavbar sudah menggunakan:
          - addToCart(product)
          - navigate("/checkout")
          - navigate("/chat")

          lg:hidden membuatnya otomatis hilang
          pada desktop.
          ===================================================== */}

      <FooterNavbar
        product={product}
      />
    </>
  );
}
