import test from 'ava';

import { Schema, validate, Validation } from './validation';
import {
  isEmail,
  isPresent,
  isTrue,
  maxChars,
  maxVal,
  minChars,
  minVal,
  pattern,
} from './validators';

const toValidate = {
  name: 'Filiberto Umberticula',
  password: '342354234243',
  email: 'something@somewhere',
  tos: true,
  age: 23,
  limit: 300,
};

const onlyNumbers = Validation(
  pattern(/^[0-9]+$/, 'should only contain numbers')
);

const schema: Schema = {
  name: { initial: '', validations: [isPresent(), maxChars(30), minChars(3)] },
  password: {
    initial: '',
    validations: [isPresent(), minChars(8), maxChars(30), onlyNumbers],
  },
  tos: { initial: false, validations: [isTrue()] },
  age: { initial: 0, validations: [minVal(18), maxVal(40)] },
  email: { initial: '', validations: [isPresent(), isEmail()] },
  limit: { initial: 200, validations: [maxVal(500)] },
};

test('Test successful validation', (t) => {
  const result = validate(schema, toValidate);

  t.is(result.isFail, false);
  t.is(JSON.stringify(result.x), JSON.stringify(toValidate));
});

test('Test failing validation', (t) => {
  const result = validate(schema, {
    name: '',
    password:
      '2478237498237498273948273948723984729384729384729384729384729834732d23',
    tos: false,
    age: 10,
    limit: 600,
  });

  t.is(result.isFail, true);
  t.deepEqual(result.x, {
    age: ['age has to be greater than 18'],
    email: ['email is not present', 'email must be a string'],
    limit: ['limit has to be less than 500'],
    name: ['name is not present', 'name has to be greater than 3 chars'],
    password: [
      'password has to be shorter than 30 chars',
      'password: should only contain numbers',
    ],
    tos: ['tos must be set'],
  });
});
