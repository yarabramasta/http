import type { Class } from "../types/mod.ts";

/**
 * Register all controllers defined in a directory.
 */
async function register(dir: string) {
  const controllers: Class[] = [];

  for await (const f of Deno.readDir(dir)) {
    if (!f.isFile) continue;
    if (!/[a-zA-Z]+_controller\.ts/.test(f.name)) continue;

    const c = await import(dir + `/${f.name}`);

    controllers.push(c.default);
  }

  return controllers;
}

export default register;
