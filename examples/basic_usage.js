// basic usage
import {
  add,
  atan2,
  chain,
  derivative,
  e,
  evaluate,
  format,
  log,
  matrix,
  multiply,
  pi,
  pow,
  round,
  sqrt,
  subtract,
  unit
} from '../lib/esm/index.js'

// functions and constants
console.log('functions and constants')
print(round(e, 3)) // 2.718
print(atan2(3, -3) / pi) // 0.75
print(log(10000, 10)) // 4
print(sqrt(-4)) // 2i
print(pow([[-1, 2], [3, 1]], 2)) // [[7, 0], [0, 7]]
print(derivative('x^2 + x', 'x')) // 2 * x + 1
console.log()

// expressions
console.log('expressions')
print(evaluate('1.2 * (2 + 4.5)')) // 7.8
print(evaluate('12.7 cm to inch')) // 5 inch
print(evaluate('sin(45 deg) ^ 2')) // 0.5
print(evaluate('9 / 3 + 2i')) // 3 + 2i
print(evaluate('det([-1, 2; 3, 1])')) // -7
console.log()

// chained operations
console.log('chained operations')
const a = chain(3)
  .add(4)
  .multiply(2)
  .done()
print(a) // 14
console.log()

// mixed use of different data types in functions
console.log('mixed use of data types')
print(add(4, [5, 6])) // number + Array, [9, 10]
print(multiply(unit('5 mm'), 3)) // Unit * number,  15 mm
print(subtract([2, 3, 4], 5)) // Array - number, [-3, -2, -1]
print(add(matrix([2, 3]), [4, 5])) // Matrix + Array, [6, 8]
console.log()

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  const precision = 14
  console.log(format(value, precision))
}
