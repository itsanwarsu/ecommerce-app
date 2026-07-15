import { Outlet, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";

export default function MainLayout() {
  const [currentProduct, setCurrentProduct] = useState(null);

  return (
    <>
      <Navbar />
      {/* Kita berikan fungsi untuk mengeset produk ke semua halaman anak */}
      <Outlet context={{ setCurrentProduct }} />
      {/* Berikan data produk yang sedang aktif ke FooterNavbar */}
      <FooterNavbar product={currentProduct} />
    </>
  );
}

