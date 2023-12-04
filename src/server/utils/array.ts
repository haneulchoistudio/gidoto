type Compute = (N: number) => boolean;
type ComputeEquality<K extends string> = Record<K, Compute>;

function __len__<T = unknown>(a: Array<T>) {
  const length = a.length;
  const lenFunctions = {
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
  } as const;

  return lenFunctions as ComputeEquality<keyof typeof lenFunctions>;
}

export { __len__ };
