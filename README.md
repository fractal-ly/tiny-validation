# tiny-validation

A simple fp-based validation library (based on a talk by DrBoolean)

## Installation

```
npm install tiny-validation
```
or
```
yarn add tiny-validation
```

## Uses

Validates an object against a given schema. The library provides some validations as well as the means by which to make any validation you want. 

This was developed for use with form validation, but can be used for validating any object if you provide the validations for the fields (or use the ones provided).

Each field to validate is the key-value pair in the object you provide, and it will be validated against the set of validations defined in your schema. 

input object: `{ email: "bootsMccloud$gmail.com" }`
schema: `{ name: [isPresent(), maxChars(30)] }`

The result of the validation is a Result object (of type Fail or Success) that contains either the original object (when successful) or an object of key-value pairs where the values are the set of error messages for failed validations.

output inside the Result object: `{ email: ["Bad email format"] }`

### Example usage

A user first creates a schema object that represents the shape of the input and the validations to be run against each field

```
import { Schema, minChars, isPresent, maxChars, isEmail, maxVal, minVal } from 'tiny-validation'

const schema: Schema = {
  name: [isPresent(), maxChars(30), minChars(3)],
  password: [isPresent(), minChars(8), maxChars(30), onlyNumbers],
  tos: [isTrue()],
  age: [minVal(18), maxVal(40)],
  email: [isPresent(), isEmail()],
  limit: [maxVal(500)],
};
```

To validate an input, the user then calls the validate function, which will run through each field (input object key), create a chain of validating functions to run against that field's value, run it and return the result object. 

```
import { validate } from 'tiny-validation`

// ... define the schema and add your code

  const inputObject = {
    name: 'Johnny McWhiskers',
    password: '342354234243',
    email: 'something@somewhere',
    tos: true,
    age: 23,
    limit: 300,
  };

  const result = validate(schema, inputObject);

  result.fold(console.error, console.log);
```

this will print back out your input object to the log console. and result.isFail will be false.

For the error case, if instead your code was: 

```
import { validate } from 'tiny-validation`

// ... define the schema and add your code

  const inputObject = {
    name: '',
    password: '342354234243374823784293874928374928374829374928374somethingelse',
    email: 'something$somewhere',
    tos: false,
    age: 17,
    limit: 700,
  };

  const result = validate(schema, inputObject);

  result.fold(console.error, console.log);
```

will print out the following to your error console: 

```
  {
    age: ['age has to be greater than 18'],
    email: ['email is not present', 'email must be a string'],
    limit: ['limit has to be less than 500'],
    name: ['name is not present', 'name has to be greater than 3 chars'],
    password: ['password has to be shorter than 30 chars'],
    tos: ['tos must be set'],
  }
```

If you do not wish to use the fold function, you can simply access `result.x` and read `result.isFail`

### Result objects

A result is an object with the following properties:

`isFailed`: whether the Result is a failure or success
`x`: The actual value of the result (the input object if successful, or an object where the keys are the fields that failed and the values are an array of error messages for all validations that have failed for that field).
`fold`: takes two functions, the first will be applied to `x` if the result is a Failure, the second will be applied if it is a success.
`concat`: used internally to chain results as the validations run through all fields.

### Provided validations

We provide a sample of simple validations you can use out of the box

`isEmail`: passes if a provided string is an email.
`isPresent`: passes if the field is present (via truthiness check).
`isTrue`: passes the argument === true 
`maxVal`: fails if a number goes over a provided value
`minVal`: fails if a number is under a provided value
`maxChars`: fails if a string goes over a provided number of chars
`minChars`: fails if a string goes under a provided number of chars
`pattern`: fails if a string does not conform to a RegExp pattern (via RegExp.test())

### Creating custom validations

you can see how to create your own validations by reading `validators.ts`, here's an example:

If we want to make sure a field only contains numbers:

```
const onlyNumbers = Validation(
  pattern(/^[0-9]+$/, 'should only contain numbers')
);
```

To check that a field always starts with the number 8:

```
const startsWith8 = Validation(
  pattern(/^8/, 'should only contain numbers')
);
```

If you then want to validate a field that should only contain numbers, always start with 8 and be less than 801, you could write this in your schema:

```
const schema = {
  ...
  someDataPoint = [onlyNumbers, startsWith8, maxVal(800)]
}
```