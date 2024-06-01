// chaining
import { chain, format, index, pi } from '../lib/esm/index.js'

// create a chained operation using the function `chain(value)`
// end a chain using done(). Let's calculate (3 + 4) * 2
const a = chain(3)
  .add(4)
  .multiply(2)
  .done()
print(a) // 14

// Another example, calculate square(sin(pi / 4))
const b = chain(pi)
  .divide(4)
  .sin()
  .square()
  .done()
print(b) // 0.5

// A chain has a few special methods: done, toString, valueOf, get, and set.
// these are demonstrated in the following examples

// toString will return a string representation of the chain's value
const myChain = chain(2).divide(3)
const str = myChain.toString()
print(str) // "0.6666666666666666"

// a chain has a function .valueOf(), which returns the value hold by the chain.
// This allows using it in regular operations. The function valueOf() acts the
// same as function done().
print(myChain.valueOf()) // 0.66666666666667
print(myChain + 2) // 2.6666666666667

// the function subset can be used to get or replace sub matrices
const array = [[1, 2], [3, 4]]
const v = chain(array)
  .subset(index(1, 0))
  .done()
print(v) // 3

const m = chain(array)
  .subset(index(0, 0), 8)
  .multiply(3)
  .done()
print(m) // [[24, 6], [9, 12]]

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  const precision = 14
  console.log(format(value, precision))
}
