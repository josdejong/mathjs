import { factory } from '../../utils/factory.js'

const name = 'invmod'
const dependencies = ['typed', 'config', 'BigNumber', 'xgcd', 'equal', 'smaller', 'mod', 'add', 'isInteger']

export const createInvmod = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, BigNumber, xgcd, equal, smaller, mod, add, isInteger }) => {
  /**
   * Calculate the (modular) multiplicative inverse of a modulo b. Solution to the equation `ax ≣ 1 (mod b)`
   * See https://en.wikipedia.org/wiki/Modular_multiplicative_inverse.
   *
   * Syntax:
   *
   *    math.invmod(a, b)
   *
   * Examples:
   *
   *    math.invmod(8, 12)             // returns NaN
   *    math.invmod(7, 13)             // returns 2
   *    math.invmod(15151, 15122)      // returns 10429
   *
   * See also:
   *
   *    gcd, xgcd
   *
   * @param {number | BigNumber} a  An integer number
   * @param {number | BigNumber} b  An integer number
   * @return {number | BigNumber }  Returns an integer number
   *                              where `invmod(a,b)*a ≣ 1 (mod b)`
   */
  return typed(name, {
    'number, number': invmod,
    'BigNumber, BigNumber': invmod
  })

  function invmod (a, b) {
    if (!isInteger(a) || !isInteger(b)) throw new Error('Parameters in function invmod must be integer numbers')
    a = mod(a, b)
    if (equal(b, 0)) throw new Error('Divisor must be non zero')
    let res = xgcd(a, b)
    res = res.valueOf()
    let [gcd, inv] = res
    if (!equal(gcd, BigNumber(1))) return NaN
    inv = mod(inv, b)
    if (smaller(inv, BigNumber(0))) inv = add(inv, b)
    return inv
  }
})
