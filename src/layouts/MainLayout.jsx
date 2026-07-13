import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <FooterNavbar />
    </>
  );
}
