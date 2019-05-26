# Extension

The library can easily be extended with functions and variables using the
[`import`](../reference/functions/import.md) function. The `import` function is available on a mathjs instance, which can be created using the `create` function.

```js
import { create, all } from 'mathjs'

const math = create(all)

math.import(/* ... */)
```

The function `import` accepts an object with functions and variables, or an array with factory functions. It has the following syntax:

```js
math.import(functions: Object [, options: Object])
```

Where:

- `functions` is an object or array containing the functions and/or values to be
  imported. `import` support regular values and functions, typed functions
  (see section [Typed functions](#typed-functions)), and factory functions
  (see section [Factory functions](#factory-functions)).
  An array is only applicable when it contains factory functions.

- `options` is an optional second argument with options.
  The following options are available:

    - `{boolean} override`
      If `true`, existing functions will be overwritten. The default value is `false`.
    - `{boolean} silent`
      If `true`, the function will not throw errors on duplicates or invalid
      types. Default value is `false`.
    - `{boolean} wrap`
      If `true`, the functions will be wrapped in a wrapper function which
      converts data types like Matrix to primitive data types like Array.
      The wrapper is needed when extending math.js with libraries which do not
      support the math.js data types. The default value is `false`.

The following code example shows how to import a function and a value into math.js:

```js
// define new functions and variables
math.import({
  myvalue: 42,
  hello: function (name) {
    return 'hello, ' + name + '!'
  }
})

// defined functions can be used in both JavaScript as well as the parser
math.myvalue * 2                 // 84
math.hello('user')               // 'hello, user!'

const parser = math.parser()
parser.evaluate('myvalue + 10')  // 52
parser.evaluate('hello("user")') // 'hello, user!'
```

## Import external libraries

External libraries like
[numbers.js](https://github.com/sjkaliski/numbers.js) and
[numeric.js](https://github.com/sloisel/numeric) can be imported as follows.
The libraries must be installed using npm:

    $ npm install numbers
    $ npm install numeric

The libraries can be easily imported into math.js using `import`.
In order to convert math.js specific data types like `Matrix` to primitive types
like `Array`, the imported functions can be wrapped by enabling `{wrap: true}`.

```js
import { create, all } from 'mathjs'
import * as numbers from 'numbers'
import * as numeric from 'numeric'

// create a mathjs instance and import the numbers.js and numeric.js libraries
const math = create(all)
math.import(numbers, {wrap: true, silent: true})
math.import(numeric, {wrap: true, silent: true})

// use functions from numbers.js
math.fibonacci(7)                           // 13
math.evaluate('fibonacci(7)')               // 13

// use functions from numeric.js
math.evaluate('eig([1, 2; 4, 3])').lambda.x // [5, -1]
```


## Typed functions

Typed functions can be created using `math.typed`. A typed function is a function
which does type checking on the input arguments. It can have multiple signatures.
And can automatically convert input types where needed.

A typed function can be created like:

```js
const max = typed('max', {
  'number, number': function (a, b) {
    return Math.max(a, b)
  },

  'BigNumber, BigNumber': function (a, b) {
    return a.greaterThan(b) ? a : b
  }
})
```

Typed functions can be merged as long as there are no conflicts in the signatures.
This allows for extending existing functions in math.js with support for new
data types.

```js
// create a new data type
function MyType (value) {
  this.value = value
}
MyType.prototype.isMyType = true
MyType.prototype.toString = function () {
  return 'MyType:' + this.value
}

// define a new datatype
math.typed.addType({
  name: 'MyType',
  test: function (x) {
    // test whether x is of type MyType
    return x && x.isMyType
  }
})

// use the type in a new typed function
const add = typed('add', {
  'MyType, MyType': function (a, b) {
    return new MyType(a.value + b.value)
  }
})

// import in math.js, extend the existing function `add` with support for MyType
math.import({add: add})

// use the new type
const ans = math.add(new MyType(2), new MyType(3)) // returns MyType(5)
console.log(ans)                                 // outputs 'MyType:5'
```

Detailed information on typed functions is available here:
[https://github.com/josdejong/typed-function](https://github.com/josdejong/typed-function)




## Factory functions

Regular JavaScript functions can be imported in math.js using `math.import`:

```js
math.import({
  myFunction: function (a, b) {
     // ...
  }
})
```

The function can be stored in a separate file:

```js
export function myFunction (a, b) {
  // ...
}
```

Which can be imported like:

```js
import { myFunction } from './myFunction.js'

math.import({
  myFunction
})
```

An issue arises when `myFunction` needs functionality from math.js:
it doesn't have access to the current instance of math.js when in a separate file.
Factory functions can be used to solve this issue. A factory function allows to inject dependencies into a function when creating it.

A syntax of factory function is:

```js
factory(name: string, dependencies: string[], create: function, meta?: Object): function
```

where:

-   `name` is the name of the created function.
-   `dependencies` is an array with names of the dependent functions.
-   `create` is a function which creates the function.
    An object with the dependencies is passed as first argument.
-   `meta` An optional object which can contain any meta data you want.
    This will be attached as a property `meta` on the created function.
    Known meta data properties used by the mathjs instance are:
    -   `isClass: boolean`  If true, the created function is supposed to be a
        class, and for example will not be exposed in the expression parser
        for security reasons.
    -   `lazy: boolean`.  By default, everything is imported lazily by `import`.
        only as soon as the imported function or constant is actually used, it
        will be constructed. A function can be forced to be created immediately
        by setting `lazy: false` in the meta data.
    -   `isTransformFunction: boolean`. If true, the created function is imported
        as a transform function. It will not be imported in `math` itself, only
        in the internal `mathWithTransform` namespace that is used by the
        expression parser.
    -   `recreateOnConfigChange: boolean`. If true, the imported factory will be
        created again when there is a change in the configuration. This is for
        example used for the constants like `pi`, which is different depending
        on the configsetting `number` which can be numbers or BigNumbers.

Here an example of a factory function which depends on `multiply`:

```js
import { factory, create, all } from 'mathjs'

// create a factory function
const name = 'negativeSquare'
const dependencies = ['multiply', 'unaryMinus']
const createNegativeSquare = factory(name, dependencies, function ({ multiply, unaryMinus }) {
    return function negativeSquare (x) {
      return unaryMinus(multiply(x, x))
    }
  })

// create an instance of the function yourself:
const multiply = (a, b) => a * b
const unaryMinus = (a) => -a
const negativeSquare = createNegativeSquare({ multiply, unaryMinus })
console.log(negativeSquare(3)) // -9

// or import the factory in a mathjs instance and use it there
const math = create(all)
math.import(createNegativeSquare)
console.log(math.negativeSquare(4)) // -16
console.log(math.evaluate('negativeSquare(5)')) // -25
```

You may wonder why you would inject functions `multiply` and `unaryMinus`
instead of just doing these calculations inside the function itself. The
reason is that this makes the factory function `negativeSquare` work for
different implementations: numbers, BigNumbers, units, etc.

```js
import { Decimal } from 'decimal.js'

// create an instance of our negativeSquare supporting BigNumbers instead of numbers
const multiply = (a, b) => a.mul(b)
const unaryMinus = (a) => new Decimal(0).minus(a)
const negativeSquare = createNegativeSquare({ multiply, unaryMinus })
```