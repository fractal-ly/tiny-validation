import { Fail, Runner, Success, Validation } from './validation';

export const pattern =
  (re: RegExp, errorMessage: string): Runner =>
  (key, x) =>
    typeof x !== 'string'
      ? Fail({ [key]: [`${key} must be a string`] })
      : re.test(x)
      ? Success()
      : Fail({ [key]: [`${key}: ${errorMessage ?? `${key} bad format`}`] });

export const isPresent = (errorMessage?: string) =>
  Validation((key, x) =>
    x ? Success() : Fail({ [key]: [errorMessage ?? `${key} is not present`] })
  );

export const isEmail = (errorMessage?: string) =>
  Validation(pattern(/@/, errorMessage ?? 'Bad email format'));

export const isTrue = (errorMessage?: string) =>
  Validation((key, x) =>
    x === true
      ? Success()
      : Fail({ [key]: [errorMessage ?? `${key} must be set`] })
  );

export const maxChars = (max: number, errorMessage?: string) =>
  Validation((key, x) =>
    typeof x !== 'string'
      ? Fail({ [key]: [`${key} must be a string`] })
      : x.length < max
      ? Success()
      : Fail({
          [key]: [errorMessage ?? `${key} has to be shorter than ${max} chars`],
        })
  );

export const minChars = (min: number, errorMessage?: string) =>
  Validation((key, x) =>
    typeof x !== 'string'
      ? Fail({ [key]: [`${key} must be a string`] })
      : x.length >= min
      ? Success()
      : Fail({
          [key]: [errorMessage ?? `${key} has to be greater than ${min} chars`],
        })
  );

export const minVal = (min: number, errorMessage?: string) =>
  Validation((key, x) =>
    typeof x !== 'number'
      ? Fail({ [key]: [`${key} must be a number`] })
      : x >= min
      ? Success()
      : Fail({
          [key]: [errorMessage ?? `${key} has to be greater than ${min}`],
        })
  );

export const maxVal = (max: number, errorMessage?: string) =>
  Validation((key, x) =>
    typeof x !== 'number'
      ? Fail({ [key]: [`${key} must be a number`] })
      : x <= max
      ? Success()
      : Fail({ [key]: [errorMessage ?? `${key} has to be less than ${max}`] })
  );
