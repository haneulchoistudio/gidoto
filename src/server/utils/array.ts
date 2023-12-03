function __len__<T>(a: Array<T>) {
  const length = a.length;

  return {
    eq: (N: number) => {
      return length === N;
    },
    le: (N: number) => {
      return length < N;
    },
    ge: (N: number) => {
      return length > N;
    },
    geq: (N: number) => {
      return [length === N, length > N].some(Boolean);
    },
    leq: (N: number) => {
      return [length === N, length < N].some(Boolean);
    },
  };
}

export { __len__ };
