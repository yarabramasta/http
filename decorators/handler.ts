import { Reflect } from "https://deno.land/x/deno_reflect@v0.2.1/mod.ts";

import type { Controllers, HttpMethods } from "../types/mod.ts";

import { metakey } from "./metakey.ts";

const _factory = (method: HttpMethods) => {
  return (path: string): MethodDecorator => (target, propKey, _descriptor) => {
    const { routes } = metakey.controller;

    const c = target.constructor;
    const r: Controllers = Reflect.hasMetadata(routes, c)
      ? Reflect.getMetadata(routes, c)
      : [];

    r.push({
      path,
      method,
      handler: String(propKey),
    });

    Reflect.defineMetadata(routes, r, c);
  };
};

export const Get = _factory("GET");
export const Post = _factory("POST");
export const Put = _factory("PUT");
export const Delete = _factory("DELETE");
