const { create, evaluateDependencies } = require('../..')

// custom implementations of all functions you want to support
const add = (a, b) => a + b
const subtract = (a, b) => a - b
const multiply = (a, b) => a * b
const divide = (a, b) => a / b

// create a mathjs instance with hardly any functions
// there are some functions created which are used internally by evaluate though,
// for example by the Unit class which has dependencies on addScalar, subtract,
// multiplyScalar, etc.
const math = create(evaluateDependencies)

// import your own functions
math.import({ add, subtract, multiply, divide }, { override: true })

console.log(math.evaluate('2 + 3 * 4')) // 14
