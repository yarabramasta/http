import { Handler } from "./handler.ts";
import { HttpMethods } from "./methods.ts";

export type Route<T = unknown, P = unknown, Q = unknown> = {
  path: string;
  method: HttpMethods;
  handler: Handler<T, P, Q>;
};
