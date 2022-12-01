// deno-lint-ignore ban-types
function querystr<T extends object>(url: string): T {
  const { searchParams } = new URL(url);
  const queries = new Map<string, unknown>();

  searchParams.forEach((v, k) => {
    let value: string | number;

    if (!isNaN(parseFloat(v))) {
      const float = parseFloat(v);
      const num = String(float).endsWith(".0") ? float.toFixed() : float;
      value = <number> num;
    } else {
      value = <string> v;
    }

    queries.set(k, value);
  });

  return <T> Object.fromEntries(queries.entries());
}

export default querystr;
