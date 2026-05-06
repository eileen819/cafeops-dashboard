import React from "react";
import ReactDOM from "react-dom/client";
import "./app/styles/global.css";
import { RouterProvider } from "react-router";
import { router } from "@/app/routes/router";

const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement) {
  throw new Error("root element not found");
}

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("@/shared/api/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
});
