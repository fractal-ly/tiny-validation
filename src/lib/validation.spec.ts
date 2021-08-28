import test from 'ava';

import { Fail, Schema, Success, validate, Validation } from './validation';
import {
  equals,
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
  email: 'some.person@somewhere.com',
  tos: true,
  age: 23,
  limit: 300,
};

const onlyNumbers = Validation(
  pattern(/^[0-9]+$/, 'should only contain numbers')
);

const isEven = Validation((key, x) =>
  typeof x !== 'number'
    ? Fail({ [key]: [`${key} must be a number`] })
    : x % 2 === 0
    ? Success()
    : Fail({
        [key]: [`${key} has to be even`],
      })
);

const schema: Schema = {
  name: [isPresent(), maxChars(30), minChars(3)],
  password: [isPresent(), minChars(8), maxChars(30), onlyNumbers],
  tos: [isTrue()],
  age: [minVal(18), maxVal(40)],
  email: [isPresent(), isEmail()],
  limit: [maxVal(500)],
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
      'should only contain numbers',
    ],
    tos: ['tos must be set'],
  });
});

test('Test custom validation', (t) => {
  const result = validate(
    {
      even: [isEven, maxVal(800)],
      odd: [isEven, maxVal(800)],
    },
    {
      even: 78,
      odd: 73,
    }
  );

  t.is(result.isFail, true);
  t.deepEqual(result.x, {
    odd: ['odd has to be even'],
  });
});

test('Test successful validation with input object', (t) => {
  const result = validate(
    {
      pin: [isPresent(), minChars(4)],
      pin2: [equals('pin')],
    },
    {
      pin: 'hello',
      pin2: 'hello',
    }
  );

  t.is(result.isFail, false);
});

test('Test failing validation with input object', (t) => {
  const result = validate(
    {
      pin: [isPresent(), minChars(4)],
      pin2: [equals('pin')],
    },
    {
      pin: 'hello',
      pin2: 'helo',
    }
  );

  t.is(result.isFail, true);
  t.deepEqual(result.x, {
    pin2: ['pin does not match'],
  });
});
