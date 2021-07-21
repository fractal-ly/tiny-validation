/* eslint-disable functional/no-mixed-type */
type Input = Record<string, unknown>;
type SuccessfulOutput = Input;
type FailedOutput = Record<string, readonly string[]>;

type Runner = (key: string, value: unknown) => Result;
type Fold = (
  f: (value: FailedOutput) => unknown,
  g: (value: SuccessfulOutput) => unknown
) => unknown;

type Validation = {
  readonly run: Runner;
  readonly concat: (other: Validation) => Validation;
};

type Result = {
  readonly isFail: boolean;
  readonly x: Input | FailedOutput;
  readonly fold: Fold;
  readonly concat: (other: Result) => Result;
};

type Schema = Record<string, readonly Validation[]>;

const Validation = (run: Runner): Validation => ({
  run,
  concat: (other) =>
    Validation((key, x) => run(key, x).concat(other.run(key, x))),
});

const Success = (x: Input = {}): Result => ({
  isFail: false,
  x,
  fold: (_, g) => g(x),
  concat: (other) => (other.isFail ? other : Success(x)),
});

const Fail = (x: FailedOutput): Result => ({
  isFail: true,
  x,
  fold: (f) => f(x),
  concat: (other) =>
    other.isFail ? Fail(mergeFailures(other.x as FailedOutput, x)) : Fail(x),
});

const mergeFailures = (
  fail1: FailedOutput,
  fail2: FailedOutput
): FailedOutput =>
  Object.entries(fail2).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: [...(acc[key] ?? []), ...value],
    }),
    fail1 ?? {}
  );

const validate = (schema: Schema, obj: Input): Result =>
  Object.keys(schema).reduce(
    (acc, key) => acc.concat(schema[key].reduce(concat).run(key, obj[key])),
    Success(obj)
  );

const concat = (f: Validation, g: Validation) => g?.concat(f) ?? g;

export { Schema, Validation, Success, Fail, Runner, validate };
