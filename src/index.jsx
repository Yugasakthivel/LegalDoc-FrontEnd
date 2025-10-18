// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // your Tailwind + custom CSS
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
