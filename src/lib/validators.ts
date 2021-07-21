import { Fail, Runner, Success, Validation } from './validation';

export const pattern =
  (re: RegExp, message: string): Runner =>
  (key, x) =>
    typeof x !== 'string'
      ? Fail({ [key]: [`${key} must be a string`] })
      : re.test(x)
      ? Success()
      : Fail({ [key]: [`${key}: ${message}`] });

export const isPresent = Validation((key, x) =>
  x ? Success() : Fail({ [key]: [`${key} is not present`] })
);

export const isEmail = Validation(pattern(/@/, 'bad email format'));

export const isTrue = Validation((key, x) =>
  x === true ? Success() : Fail({ [key]: [`${key} must be set`] })
);

export const maxChars = (max: number) =>
  Validation((key, x) =>
    typeof x !== 'string'
      ? Fail({ [key]: [`${key} must be a string`] })
      : x.length < max
      ? Success()
      : Fail({ [key]: [`${key} has to be shorter than ${max} chars`] })
  );

export const minChars = (min: number) =>
  Validation((key, x) =>
    typeof x !== 'string'
      ? Fail({ [key]: [`${key} must be a string`] })
      : x.length >= min
      ? Success()
      : Fail({ [key]: [`${key} has to be greater than ${min} chars`] })
  );

export const minVal = (min: number) =>
  Validation((key, x) =>
    typeof x !== 'number'
      ? Fail({ [key]: [`${key} must be a number`] })
      : x >= min
      ? Success()
      : Fail({ [key]: [`${key} has to be greater than ${min}`] })
  );

export const maxVal = (max: number) =>
  Validation((key, x) =>
    typeof x !== 'number'
      ? Fail({ [key]: [`${key} must be a number`] })
      : x <= max
      ? Success()
      : Fail({ [key]: [`${key} has to be less than ${max}`] })
  );
