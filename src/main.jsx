import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import initAdmin from "./config/initAdmin.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

import { ThemeProvider } from './context/ThemeContext'; 

if (import.meta.env.DEV) {
  import("eruda").then((eruda) => {
    eruda.default.init();
  });
}

initAdmin();

ReactDOM.createRoot(document.getElementById("root")).render(
<>  
<BrowserRouter>
<ThemeProvider>
    <App />
</ThemeProvider>
     <ToastContainer
        position="top-right"
        autoClose={3000}
    />
  </BrowserRouter>
</>
)
