import { Reflect } from "https://deno.land/x/deno_reflect@v0.2.1/mod.ts";

import { metakey } from "./metakey.ts";

const Controller = (prefix: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(metakey.controller.prefix, prefix, target);
  };
};

export default Controller;
