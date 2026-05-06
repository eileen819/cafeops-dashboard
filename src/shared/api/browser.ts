import { handlers } from "@/shared/api/handler";
import { setupWorker } from "msw/browser";

export const worker = setupWorker(...handlers);
