import { resolve } from "https://deno.land/std@0.166.0/path/posix.ts";

import type { Class } from "../types/mod.ts";

/**
 * Register all controllers defined in a directory.
 */
async function register(dir: string) {
  if (dir === Deno.cwd()) {
    throw new Error("Directory cannot be the same as the project root.");
  }

  const controllers: Class[] = [];
  const CONTROLLERS_PATH = resolve(Deno.cwd(), dir);

  for await (const f of Deno.readDir(CONTROLLERS_PATH)) {
    if (!f.isFile) continue;
    if (!/[a-zA-Z]+_controller\.ts/.test(f.name)) continue;

    const _path = resolve(CONTROLLERS_PATH + `/${f.name}`);
    const c = await import(_path);

    controllers.push(c.default);
  }

  return controllers;
}

export default register;
