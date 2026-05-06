import { http, HttpResponse } from "msw";
import { inventoryItemsMock } from "@/entities/inventory/model/mock";
import {
  categorySalesRatioMock,
  salesSummaryMock,
  salesTrendMock,
} from "@/entities/sales/model/mock";

let inventoryItems = [...inventoryItemsMock];

export const handlers = [
  http.get("/inventory", () => {
    return HttpResponse.json({
      items: inventoryItems,
    });
  }),

  http.post("/inventory", async ({ request }) => {
    const body = await request.json();

    const newItem = {
      ...(body as object),
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };

    inventoryItems = [
      ...inventoryItems,
      newItem as (typeof inventoryItems)[number],
    ];

    return HttpResponse.json(
      {
        item: newItem,
      },
      { status: 201 },
    );
  }),

  http.patch("/inventory/:id", async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();

    inventoryItems = inventoryItems.map((item) =>
      item.id === id
        ? {
            ...item,
            ...(body as object),
            updatedAt: new Date().toISOString(),
          }
        : item,
    );

    const updatedItem = inventoryItems.find((item) => item.id === id);

    if (!updatedItem) {
      return HttpResponse.json(
        { message: "Inventory item not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      item: updatedItem,
    });
  }),

  http.get("/sales/summary", () => {
    return HttpResponse.json({
      summary: salesSummaryMock,
    });
  }),

  http.get("/sales/trend", () => {
    return HttpResponse.json({
      items: salesTrendMock,
    });
  }),

  http.get("/sales/category-ratio", () => {
    return HttpResponse.json({
      items: categorySalesRatioMock,
    });
  }),
];
