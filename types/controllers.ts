import type { Route } from "./route.ts";

export type Controllers = (Omit<Route, "handler"> & {
  handler: string;
})[];
