export type IRequest<P = unknown, Q = unknown> = Request & {
  params: {
    [K in keyof P]: P[K];
  };
  query: {
    [K in keyof Q]: Q[K];
  };
};
