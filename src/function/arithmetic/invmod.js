import { factory } from '../../utils/factory.js'

const name = 'invmod'
const dependencies = [
  'typed',
  'config',
  'BigNumber',
  'xgcd',
  'equalScalar',
  'mod',
  'isInteger',
  'isZero'
]

export const createInvmod = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, BigNumber, xgcd, equalScalar, mod, isInteger, isZero }) => {
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
   * History:
   *
   *    v15.3  Added bigint support
   *    v10.1  Created
   *
   * @param {number | BigNumber | bigint} a  An integer number
   * @param {number | BigNumber | bigint} b  An integer number
   * @return {number | BigNumber | bigint }  Returns an integer number
   *                              where `invmod(a,b)*a ≣ 1 (mod b)`
   */
  return typed(name, {
    'bigint, bigint': invmodUnchecked,
    'number | BigNumber, number | BigNumber | bigint': invmod,
    'bigint, number | BigNumber': invmod
  })

  function invmod (a, b) {
    if (!isInteger(a) || !isInteger(b)) {
      throw new Error(`Arguments of invmod must be integers, not ${a} and ${b}`)
    }
    return invmodUnchecked(a, b)
  }

  function invmodUnchecked (a, b) {
    if (isZero(b)) return NaN // FIXME sometimes a return type violation
    a = mod(a, b) // reduce the size of the problem
    const [gcd, inv] = xgcd(a, b).valueOf()
    if (!equalScalar(gcd, 1)) return NaN // FIXME ditto
    // Make sure we end up in the proper value range mod b:
    return mod(inv, b)
  }
})
