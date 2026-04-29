import RootLayout from "@/app/layout/root-layout";
import { DashboardPage } from "@/pages/dashboard";
import { InventoryPage } from "@/pages/inventory";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/inventory",
        element: <InventoryPage />,
      },
    ],
  },
]);
