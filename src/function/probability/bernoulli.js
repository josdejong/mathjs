import { factory } from '../../utils/factory.js'

const name = 'bernoulli'
const dependencies = [
  'typed', 'config', 'typeOf', 'isInteger', 'smaller', 'number',
  'add', 'subtract', 'multiply', 'divide'
]

export const createBernoulli = /* #__PURE__ */ factory(name, dependencies, ({
  typed, config, typeOf, isInteger, smaller, number,
  add, subtract, multiply, divide
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
   *     math.bernoulli(1) // returns -0.5
   *     // all other odd Bernoulli numbers are 0:
   *     math.bernoulli(7) // returns 0
   *     math.bernoulli(math.bignumber(6))  // value bignumber(1).div(42)
   *     math.bernoulli(math.fraction(8))   // Fraction -1,30
   *
   * See also:
   *
   *     combinations, gamma, stirlingS2
   *
   * @param {number | BigNumber | Fraction} n  Index of the Bernoulli number
   * @return {number | BigNumber | Fraction}
   *    nth Bernoulli number, of the same type as the argument n
   */

  const cache = {}
  return typed(name, {
    'number | BigNumber | Fraction': n => {
      if (!isInteger(n) || smaller(n, 0)) {
        throw new RangeError(
          'Bernoulli numbers defined only for nonnegative integer indices')
      }
      const num = number(n)
      if (num === 0) return add(n, 1) // 1 of correct type
      if (num === 1) return divide(n, -2) // -1/2 of correct type
      if (num % 2 === 1) return subtract(n, n) // 0 of correct type
      // OK, a positive even integer index. We need to compute.
      // First get the correct cache
      if (!('precision' in cache)) {
        cache.precision = config.precision
      }
      const typ = typeOf(n)
      if (typ === 'BigNumber' && config.precision !== cache.precision) {
        cache[typ] = [undefined]
        cache.precision = config.precision
      }
      if (!(typ in cache)) cache[typ] = [undefined]
      const A = cache[typ]
      // We proceed as in https://math.stackexchange.com/a/2844337
      // (by no means the most efficient, but very simple to implement)
      // A cache entry consists of a triple
      // [cotangent coefficient a_n, prefactor, Bernouilli number B_2n]
      const one = subtract(add(n, 1), n) // correct type
      if (A.length === 1) {
        A.push([divide(one, -3), divide(one, -2), divide(one, 6)])
      }
      const half = num / 2
      const zero = subtract(one, one) // correct type
      while (A.length <= half) {
        const i = A.length // next index to compute
        const lim = Math.floor((i + 1) / 2)
        let a = zero
        for (let m = 1; m < lim; ++m) {
          a = add(a, multiply(A[m][0], A[i - m][0]))
        }
        a = multiply(a, 2)
        if (i % 2 === 0) a = add(a, multiply(A[lim][0], A[lim][0]))
        a = divide(a, -(2 * i + 1))
        const prefactor = multiply(A[i - 1][1], -i * (2 * i - 1) / 2)
        A.push([a, prefactor, multiply(prefactor, a)])
      }
      return A[half][2]
    }
  })
})
