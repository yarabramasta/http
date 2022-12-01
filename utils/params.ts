// deno-lint-ignore ban-types
function params<T extends object>(pattern: string, path: string): T {
  const map = new Map<string, unknown>();
  const _params = pattern.split("/");
  const _path = path.split("/");

  for (let i = 0; i < _params.length; i++) {
    if (_params[i].startsWith(":")) {
      map.set(_params[i].slice(1), _path[i]);
    }
  }

  return <T> Object.fromEntries(map);
}

export default params;
