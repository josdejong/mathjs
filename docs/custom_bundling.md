# Custom bundling

Math.js is a large library containing many data types and functions.
It is well possible that you only need a small portion of the library.
Math.js allows for picking just the functions and data types you need.
This gives faster load times and smaller browser bundles. Math.js uses
ES6 modules, and creating small bundles using tree-shaking works out of
the box when using Webpack for example.

This page describes:

- How to use just a few functions for faster load times and smaller bundles.
- How to use light-weight, number only implementations of functions.
- What to expect from bundle sizes when using tree-shaking.

## Using just a few functions

Using the function `create`, a mathjs instance can be created.
The `all` object contains all functionality available in mathjs,
and a mathjs instance containing everything can be created like:

```js
import { create, all } from 'mathjs'

const math = create(all)
```

To create an instance with just a few functions, you have to pass the
factory functions of the functions you need, and all their dependencies.
For example the function `add` depends on the functions `addScalar`,
`equalScalar`, classes `DenseMatrix` and `SparseMatrix`, and more.
Because it is hard to figure out what the dependencies of a function are,
and the dependencies of the dependencies, mathjs provides ready made
collections of all dependencies for every function. For example all
factory functions of function `add` and its dependencies are available
as `addDependencies`.

Here is a full example of loading just a few functions in a mathjs instance:

```js
// file: custom_loading.js

import {
  create,
  fractionDependencies,
  addDependencies,
  divideDependencies,
  formatDependencies
} from 'mathjs'

const config = {
  // optionally, you can specify configuration
}

// Create just the functions we need
const { fraction, add, divide, format } = create({
  fractionDependencies,
  addDependencies,
  divideDependencies,
  formatDependencies
}, config)

// Use the created functions
const a = fraction(1, 3)
const b = fraction(3, 7)
const c = add(a, b)
const d = divide(a, b)
console.log('c =', format(c)) // outputs "c = 16/21"
console.log('d =', format(d)) // outputs "d = 7/9"
```

This example can be bundled using for example Webpack:

```
npx webpack custom_loading.js -o custom_loading.bundle.js --mode=production
```

Only the used parts of mathjs will be bundled thanks to tree-shaking.


## Numbers only

The functions of mathjs support multiple data types out of the box, like
numbers, bignumbers, complex numbers, units, and matrices. Quite commonly however,
only support for numbers is needed and the other data-types are overkill.

To accomodate for this use case of only numbers only, mathjs offers light-weight,
number only implementations of all relevant functions. These are available by
importing from `'mathjs/number'` instead of `'mathjs'`:

```js
// use light-weight, numbers only implementations of functions
import { create, all } from 'mathjs/number'

const math = create(all)
console.log(add(2, 3)) // 5
```

## Bundle size

When using just a few functions of mathjs instead of the whole library,
you may expect the size of the bundle to be just a small fraction of the
complete library. However, to create the function `add` supporting all data
types, all these data types must be included: Unit, BigNumber, Complex,
DenseMatrix, SparseMatrix, etc. A rough idea of the size of different parts of
mathjs:

- About 5% is coming from core functionality like `create`, `import`, `factory`,
  `typed-function`, etc.
- About 30% of the bundle size comes from the data classes `Complex`, `BigNumber`, `Fraction`, `Unit`, `SparseMatrix`, `DenseMatrix`.
- About 25%  of the bundle size comes from the expression parser.
  Half of this comes from the embedded docs.
- About 40% comes from the about 200 built-in functions and some constants.

To get a better insight in what is in your JavaScript bundle, you can use
a tool like [source-map-explorer](https://github.com/danvk/source-map-explorer).
