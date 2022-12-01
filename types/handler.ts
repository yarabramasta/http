import { IRequest } from "./request.ts";
import { Result } from "./result.ts";

export type Handler<T = unknown, P = unknown, Q = unknown> = (
  req: IRequest<P, Q>,
  headers?: Headers,
) => Promise<Result<T>> | Result<T> | Promise<void> | void;
