type CompareText<T extends string> = (N: number) => boolean;
type EvaluateText = () => boolean;

type TextEvaluator<T extends string> = {
  empty: EvaluateText;
  isOverMax: CompareText<T>;
  isBelowMin: CompareText<T>;
};

function __txt__<T extends string = string>(value: T) {
  const text = value || value.trim();
  const length = text.length;

  const textEvaluator: TextEvaluator<T> = {
    empty: (() => (length >= 1 ? false : true)) as EvaluateText,
    isOverMax: ((max: number) => length > max) as CompareText<T>,
    isBelowMin: ((min: number) => length < min) as CompareText<T>,
  } as const;

  return textEvaluator;
}

export { __txt__ };
