const { create, all, factory } = require('../..')

// First let's see what the default behavior is:
// strings are compared by their numerical value
console.log('default (compare string by their numerical value)')
const { evaluate } = create(all)
evaluateAndLog(evaluate, '2 < 10') // true
evaluateAndLog(evaluate, '"2" < "10"') // true
evaluateAndLog(evaluate, '"a" == "b"') // Error: Cannot convert "a" to a number
evaluateAndLog(evaluate, '"a" == "a"') // Error: Cannot convert "a" to a number
console.log('')

// Suppose we want different behavior for string comparisons. To achieve
// this we can replace the factory functions for all relational functions
// with our own. In this simple example we use the JavaScript implementation.
console.log('custom (compare strings lexically)')

const allWithCustomFunctions = {
  ...all,

  createEqual: factory('equal', [], () => function equal (a, b) {
    return a === b
  }),

  createUnequal: factory('unequal', [], () => function unequal (a, b) {
    return a !== b
  }),

  createSmaller: factory('smaller', [], () => function smaller (a, b) {
    return a < b
  }),

  createSmallerEq: factory('smallerEq', [], () => function smallerEq (a, b) {
    return a <= b
  }),

  createLarger: factory('larger', [], () => function larger (a, b) {
    return a > b
  }),

  createLargerEq: factory('largerEq', [], () => function largerEq (a, b) {
    return a >= b
  }),

  createCompare: factory('compare', [], () => function compare (a, b) {
    return a > b ? 1 : a < b ? -1 : 0
  })
}
const evaluateCustom = create(allWithCustomFunctions).evaluate
evaluateAndLog(evaluateCustom, '2 < 10') // true
evaluateAndLog(evaluateCustom, '"2" < "10"') // false
evaluateAndLog(evaluateCustom, '"a" == "b"') // false
evaluateAndLog(evaluateCustom, '"a" == "a"') // true

// helper function to evaluate an expression and print the results
function evaluateAndLog (evaluate, expression) {
  try {
    console.log(expression, evaluate(expression))
  } catch (err) {
    console.error(expression, err.toString())
  }
}
