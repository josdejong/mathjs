/* eslint-disable no-loss-of-precision */

// BigNumbers

const { create, all } = require('..')

// configure the default type of numbers as BigNumbers
const config = {
  // Default type of number
  // Available options: 'number' (default), 'BigNumber', or 'Fraction'
  number: 'BigNumber',

  // Number of significant digits for BigNumbers
  precision: 20
}
const math = create(all, config)

console.log('round-off errors with numbers')
print(math.add(0.1, 0.2)) // number, 0.30000000000000004
print(math.divide(0.3, 0.2)) // number, 1.4999999999999998
console.log()

console.log('no round-off errors with BigNumbers')
print(math.add(math.bignumber(0.1), math.bignumber(0.2))) // BigNumber, 0.3
print(math.divide(math.bignumber(0.3), math.bignumber(0.2))) // BigNumber, 1.5
console.log()

console.log('create BigNumbers from strings when exceeding the range of a number')
print(math.bignumber(1.2e+500)) // BigNumber, Infinity      WRONG
print(math.bignumber('1.2e+500')) // BigNumber, 1.2e+500
console.log()

console.log('BigNumbers still have a limited precision and are no silve bullet')
const third = math.divide(math.bignumber(1), math.bignumber(3))
const total = math.add(third, third, third)
print(total) // BigNumber, 0.99999999999999999999
console.log()

// one can work conveniently with BigNumbers using the expression parser.
// note though that BigNumbers are only supported in arithmetic functions
console.log('use BigNumbers in the expression parser')
print(math.evaluate('0.1 + 0.2')) // BigNumber, 0.3
print(math.evaluate('0.3 / 0.2')) // BigNumber, 1.5
console.log()

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  console.log(math.format(value))
}
