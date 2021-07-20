import test from 'ava';

import { Schema, validate } from './validation';
import {
  isEmail,
  isPresent,
  isTrue,
  maxChars,
  minChars,
  minVal,
} from './validators';

const toValidate = {
  name: 'Filiberto Umberticula',
  password: '2309udifhasdkfhlkweru',
  email: 'something@somewhere',
  tos: true,
  age: 23,
};

const schema: Schema = {
  name: { initial: '', validations: [isPresent, maxChars(30), minChars(3)] },
  password: { initial: '', validations: [isPresent, minChars(8)] },
  tos: { initial: false, validations: [isTrue] },
  age: { initial: 0, validations: [minVal(18)] },
  email: { initial: '', validations: [isPresent, isEmail] },
};

test('Test successful validation', (t) => {
  const result = validate(schema, toValidate);

  t.is(result.isFail, false);
  t.is(JSON.stringify(result.x), JSON.stringify(toValidate));
});

test('Test failing validation', (t) => {
  const result = validate(schema, {
    name: '',
    password: '23223',
    tos: false,
    age: 10,
  });

  t.is(result.isFail, true);
  t.deepEqual(result.x, {
    age: ['age has to be greater than 18'],
    email: ['email is not present', 'email must be a string'],
    name: ['name is not present', 'name has to be greater than 3 chars'],
    password: ['password has to be greater than 8 chars'],
    tos: ['tos must be set'],
  });
});
