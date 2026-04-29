import React from "react";
import ReactDOM from "react-dom/client";
import "./app/styles/global.css";
import { RouterProvider } from "react-router";
import { router } from "@/app/routes/router";

const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement) {
  throw new Error("root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
