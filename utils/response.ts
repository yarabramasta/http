function response<T>(data?: T, headers?: Headers): Response {
  const timestamp = new Date().toISOString();
  const opt = {
    status: 200,
    statusText: "OK",
    headers: headers,
  };

  if (typeof data === "undefined" || data === null) {
    return Response.json({ message: "OK", error: null, timestamp }, opt);
  } else if (typeof data === "string") {
    return Response.json({ message: data, error: null, timestamp }, opt);
  } else if (Array.isArray(data) || typeof data === "object") {
    return Response.json({ data, error: null, timestamp }, opt);
  } else {
    return Response.json({ message: "OK", error: null, timestamp }, opt);
  }
}

export default response;
