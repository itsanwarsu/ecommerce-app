import { Link } from "react-router-dom";

const shopLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Best Sellers", to: "/best-sellers" },
  { label: "New Arrivals", to: "/new-arrivals" },
];

const brandLinks = [
  { label: "Contact Us", to: "/contact" },
  { label: "Track Your Order", to: "/track-order" },
  { label: "Refer A Friend, Get $20", to: "/refer" },
  { label: "Reseller Program", to: "/reseller" },
  { label: "Brand Ambassadors", to: "/brand-ambassadors" },
  { label: "Shipping & Returns", to: "/shipping-returns" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms Of Service", to: "/terms" },
  { label: "Search", to: "/search" },
];

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 bg-white dark:bg-gray-900 dark:text-white text-[#4b4b4b]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* =========================
            MAIN FOOTER
        ========================== */}
        <div
          className="
            py-10
            sm:py-12
            md:py-14
            lg:py-16
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-10
              text-center

              md:grid-cols-3
              md:gap-8
              md:text-left
            "
          >

            {/* =====================
                SHOP
            ====================== */}
            <FooterColumn
              title="SHOP"
              links={shopLinks}
            />

            {/* =====================
                BRAND
            ====================== */}
            <FooterColumn
              title="BRAND"
              links={brandLinks}
            />

            {/* =====================
                LOGO
            ====================== */}
            <div
              className="
                flex
                items-center
                justify-center

                md:items-start
                md:justify-end
                lg:pr-8
              "
            >
              <Link
                to="/"
                aria-label="Ashlen Home"
                className="
                  select-none
                  font-[cursive]
                  text-5xl
                  font-normal
                  tracking-tight
                  text-[#d4b184]
                 
                  sm:text-6xl
                  lg:text-7xl
                "
              >
                Ashlen
              </Link>
            </div>

          </div>
        </div>

        {/* =========================
            BOTTOM FOOTER
        ========================== */}
        <div className="border-t border-gray-200 py-8 sm:py-10">

          {/* Copyright */}
          <div className="mx-auto max-w-2xl text-center">

            <p
              className="
                text-[13px]
                leading-6
                text-gray-600
                dark:text-white

                sm:text-sm
                sm:leading-7
              "
            >
              © 2025 Ashlen. All rights reserved. Ashlen and
              ash​​len.co are the Trademarks of Ashlen. All rights
              reserved.
            </p>

            <p
              className="
                mt-7
                text-[13px]
                text-gray-600

                sm:mt-8
                sm:text-sm
              "
            >
              © 2026 Ashlen
            </p>

          </div>

          {/* =====================
              PAYMENT METHODS
          ====================== */}
          <PaymentMethods />

        </div>

      </div>
    </footer>
  );
};


/* =================================
   FOOTER COLUMN
================================= */

const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h3
        className="
          mb-5
          text-[15px]
          font-medium
          tracking-wide
          text-[#3f3f3f]
          dark:text-white

          sm:text-base
        "
      >
        {title}
      </h3>

      <nav className="flex flex-col gap-2.5">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="
              text-[16px]
              leading-6
              text-[#555]
              dark:text-white

              transition-colors
              duration-200

              hover:text-[#c7a373]
            "
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};


/* =================================
   PAYMENT METHODS
================================= */

const PaymentMethods = () => {
  return (
    <div
      className="
        mt-10
        flex
        flex-wrap
        items-center
        justify-center
        gap-x-5
        gap-y-4

        sm:mt-12
        sm:gap-x-6
      "
    >

      {/* DISCOVER */}
      <span
        className="
          text-[12px]
          font-bold
          tracking-tight
          text-gray-600
          dark:text-white
        "
      >
        DISCOVER
      </span>


      {/* DINERS CLUB */}
      <div
        className="
          flex
          h-7
          w-11
          items-center
          justify-center
          rounded-full
          border-2
          border-gray-600
        "
      >
        <span className="text-sm font-bold text-gray-600">
          D
        </span>
      </div>


      {/* AMERICAN EXPRESS */}
      <div
        className="
          flex
          h-7
          w-11
          items-center
          justify-center
          bg-gray-600
          px-1
          text-center
          text-[6px]
          font-bold
          leading-[7px]
          text-white
        "
      >
        AMERICAN
        <br />
        EXPRESS
      </div>


      {/* MASTERCARD */}
      <div className="relative h-7 w-12">

        <div
          className="
            absolute
            left-0
            top-0
            h-7
            w-7
            rounded-full
            bg-gray-600
          "
        />

        <div
          className="
            absolute
            right-0
            top-0
            h-7
            w-7
            rounded-full
            bg-gray-500
          "
        />

      </div>


      {/* VISA */}
      <span
        className="
          text-xl
          font-black
          italic
          tracking-tight
          text-gray-600
        "
      >
        VISA
      </span>

    </div>
  );
};

export default Footer;
