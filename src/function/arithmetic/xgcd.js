import { factory } from '../../utils/factory'
import { xgcdNumber } from '../../plain/number'

const name = 'xgcd'
const dependencies = ['typed', 'config', 'matrix', 'BigNumber']

export const createXgcd = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix, BigNumber }) => {
  /**
   * Calculate the extended greatest common divisor for two values.
   * See https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm.
   *
   * Syntax:
   *
   *    math.xgcd(a, b)
   *
   * Examples:
   *
   *    math.xgcd(8, 12)             // returns [4, -1, 1]
   *    math.gcd(8, 12)              // returns 4
   *    math.xgcd(36163, 21199)      // returns [1247, -7, 12]
   *
   * See also:
   *
   *    gcd, lcm
   *
   * @param {number | BigNumber} a  An integer number
   * @param {number | BigNumber} b  An integer number
   * @return {Array}              Returns an array containing 3 integers `[div, m, n]`
   *                              where `div = gcd(a, b)` and `a*m + b*n = div`
   */
  return typed(name, {
    'number, number': function (a, b) {
      const res = xgcdNumber(a, b)

      return (config.matrix === 'Array')
        ? res
        : matrix(res)
    },
    'BigNumber, BigNumber': _xgcdBigNumber
    // TODO: implement support for Fraction
  })

  /**
   * Calculate xgcd for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @return {BigNumber[]} result
   * @private
   */
  function _xgcdBigNumber (a, b) {
    // source: https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    let // used to swap two variables
      t

    let // quotient
      q

    let // remainder
      r

    const zero = new BigNumber(0)
    const one = new BigNumber(1)
    let x = zero
    let lastx = one
    let y = one
    let lasty = zero

    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function xgcd must be integer numbers')
    }

    while (!b.isZero()) {
      q = a.div(b).floor()
      r = a.mod(b)

      t = x
      x = lastx.minus(q.times(x))
      lastx = t

      t = y
      y = lasty.minus(q.times(y))
      lasty = t

      a = b
      b = r
    }

    let res
    if (a.lt(zero)) {
      res = [a.neg(), lastx.neg(), lasty.neg()]
    } else {
      res = [a, !a.isZero() ? lastx : 0, lasty]
    }
    return (config.matrix === 'Array') ? res : matrix(res)
  }
})
