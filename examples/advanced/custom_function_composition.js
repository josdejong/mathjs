// It is possible to use individual functions and compose them the way you want
// containing support for just the data-types you need.
//
// Note that in the following examples, we do not load the math namespace but
// just the functions and data types that we actually use.
//
// Let's load typed-function, it's used by most high level functions in math.js
// to compose functions with multiple signatures and do runtime type checking.
const typed = require('typed-function')

// Low level functions can be used right away.
// The following implementation of function `add` only supports numbers:
const add = require('../../lib/plain/number/arithmetic').add

// Use the loaded function:
console.log('add(4, 3) =', add(4, 3)) // 7

// This gives you high performance but no runtime type checking:
console.log('add(4, {})', add(4, {})) // "4[object Object]" hm, not really helpful

// To add runtime type checking, turn the function into a typed-function:
const addTyped = typed(add)
try {
  addTyped(4, {})
} catch (err) {
  console.log(err.message)
  // Unexpected type of argument in function add (expected: number, actual: Object, index: 1)
}

// Let's add a BigNumber data type to the typed-function, so we can use it later on.
// Note that you can do this with any data type unknown to math.js.
const BigNumber = require('decimal.js')
typed.addType({
  name: 'BigNumber',
  test: (x) => x instanceof BigNumber
})
typed.addConversion({
  from: 'number',
  to: 'BigNumber',
  convert: (x) => new BigNumber(x)
})

// We can compose a typed function `add` such that it supports number and BigNumber:
const addBigNumber = require('../../lib/plain/bignumber/arithmetic').add
const addComposed = typed('add', add, addBigNumber)

// Use the composed function add:
console.log('addComposed(4, 3) =', addComposed(4, new BigNumber(3)).toString()) // BigNumber 7

// High level functions typically have dependencies and need to
// be created via a factory function such as `hypotFactory`.
const hypotFactory = require('../../lib/function/arithmetic/hypotFactory').hypotFactory

// We must satisfy all dependencies of the factory function before we can create it:
console.log('dependencies:', hypotFactory.dependencies.join(', '))

// In this case, hypot also supports a type Matrix.
// But we're not interested in it now so we mark this type to be ignored
typed.ignore.push('Matrix')

// Create a hypot instance that only works with numbers:
const hypot = hypotFactory.create({
  typed,
  abs: Math.abs,
  addScalar: (a, b) => a + b,
  divideScalar: (a, b) => a / b,
  multiplyScalar: (a, b) => a * b,
  sqrt: Math.sqrt,
  smaller: (a, b) => a < b,
  isPositive: a => a > 0
})

// Use the created function:
console.log('hypot(3, 4) =', hypot(3, 4)) // 5
