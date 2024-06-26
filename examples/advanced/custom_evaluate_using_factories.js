// we use the number only implementation in order to not pull in
// the `Unit` class for example. when using as library,
// use import 'mathjs/number'
import { create, evaluateDependencies, factory } from '../../lib/esm/number.js'

// custom implementations of all functions you want to support
const add = (a, b) => a + b
const subtract = (a, b) => a - b
const multiply = (a, b) => a * b
const divide = (a, b) => a / b

// create factories for the functions, and create an evaluate function with those
// these functions will also be used by the classes like Unit.
const { evaluate } = create({
  evaluateDependencies,
  createAdd: factory('add', [], () => add),
  createSubtract: factory('subtract', [], () => subtract),
  createMultiply: factory('multiply', [], () => multiply),
  createDivide: factory('divide', [], () => divide)
})

console.log(evaluate('2 + 3 * 4')) // 14
