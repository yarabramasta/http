function endpoint(path: string) {
  path = path.startsWith("/") ? path : `/${path}`;
  path = path.endsWith("/") ? path.slice(0, -1) : path;

  path = path.replaceAll(/[%<>\[\]{}|\\^]/g, "");

  // deno-lint-ignore no-explicit-any
  const replaced = <Record<string, any>> {
    "//": /\/\//g,
    "/./": /\/\.\//g,
  };

  for (const key in replaced) {
    path = path.replaceAll(replaced[key], "/");
  }

  return path;
}

export default endpoint;
