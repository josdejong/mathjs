import { factory } from '../../utils/factory.js'
import { isInteger } from '../../utils/number.js'

const name = 'bernoulli'
const dependencies = [
  'typed', 'config', 'isInteger', 'number', '?BigNumber', '?Fraction'
]

export const createBernoulli = /* #__PURE__ */ factory(name, dependencies, ({
  typed, config, number, BigNumber, Fraction
}) => {
  /**
   * Return the `n`th Bernoulli number, for positive integers `n`
   *
   * Syntax:
   *
   *     math.bernoulli(n)
   *
   * Examples:
   *
   *     math.bernoulli(1)                  // returns -0.5
   *     // All other odd Bernoulli numbers are 0:
   *     math.bernoulli(7)                  // returns 0
   *     math.bernoulli(math.bignumber(6))  // value bignumber(1).div(42)
   *     // Produces exact rationals for bigint or fraction input:
   *     math.bernoulli(8n)                 // Fraction -1,30
   *     math.bernoulli(math.fraction(10))  // Fraction 5,66
   *
   * See also:
   *
   *     combinations, gamma, stirlingS2
   *
   * @param {number | BigNumber | bigint | Fraction} n
   *    Index of the Bernoulli number
   * @return {number | BigNumber | Fraction}
   *    nth Bernoulli number, of a type corresponding to the argument n
   */

  const numberCache = [undefined]
  const fractionCache = [undefined]
  let bigCache = [undefined]
  let cachedPrecision = 50
  return typed(name, {
    number: index => _bernoulli(
      index, n => n, numberCache,
      (a, b) => a + b, (a, b) => a * b, (a, b) => a / b),
    'bigint | Fraction': index => _bernoulli(
      number(index), n => new Fraction(n), fractionCache,
      (a, b) => a.add(b), (a, b) => a.mul(b), (a, b) => a.div(b)),
    BigNumber: index => {
      if (config.precision !== cachedPrecision) {
        bigCache = [undefined]
        cachedPrecision = config.precision
      }
      return _bernoulli(
        number(index), n => new BigNumber(n), bigCache,
        (a, b) => a.add(b), (a, b) => a.mul(b), (a, b) => a.div(b))
    }
  })
})

/**
 * Underlying implementation, with all operations passed in.
 * Parameters:
 * 1. index: a (positive integer) number specifying which Bernoulli number
 *    to compute.
 * 2. promote: a function that takes an integer number and returns
 *    the desired type for the Bernoulli number values.
 * 3. A: a cache array of partial computation data that _bernoulli should use.
 *    Different cache arrays should be provided for different types.
 * 4. plus: a function that adds two values of the desired type.
 * 5. times: a function that multiplies two values of the desired type.
 * 6. divide: a function that divides one value of the desired type by another.
 */
function _bernoulli (index, promote, A, plus, times, divide) {
  if (index < 0 || !isInteger(index)) {
    throw new RangeError('Bernoulli index must be nonnegative integer')
  }
  if (index === 0) return promote(1)
  if (index === 1) return divide(promote(-1), promote(2))
  if (index % 2 === 1) return promote(0)
  // We proceed as in https://math.stackexchange.com/a/2844337
  // (by no means the most efficient, but very simple to implement)
  // A cache entry consists of a triple
  // [cotangent coefficient a_n, prefactor, Bernouilli number B_2n]
  const one = promote(1)
  if (A.length === 1) {
    A.push([
      divide(one, promote(-3)),
      divide(one, promote(-2)),
      divide(one, promote(6))
    ])
  }
  const half = index / 2
  const zero = promote(0)
  const two = promote(2)
  while (A.length <= half) {
    const i = A.length // next cotangent coefficient to compute
    const lim = Math.floor((i + 1) / 2)
    let a = zero
    for (let m = 1; m < lim; ++m) {
      a = plus(a, times(A[m][0], A[i - m][0]))
    }
    a = times(a, two)
    if (i % 2 === 0) a = plus(a, times(A[lim][0], A[lim][0]))
    a = divide(a, promote(-(2 * i + 1)))
    const prefactor = divide(
      times(A[i - 1][1], promote(-i * (2 * i - 1))), two)
    A.push([a, prefactor, times(prefactor, a)])
  }
  return A[half][2]
}
