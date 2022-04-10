/* eslint-disable no-loss-of-precision */

import { lgammaNumber, lnSqrt2PI } from '../../plain/number/index.js'
import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'lgamma'
const dependencies = ['Complex', 'typed']

export const createLgamma = /* #__PURE__ */ factory(name, dependencies, ({ Complex, typed }) => {
  const TWOPI = 6.2831853071795864769252842 // 2*pi
  const LOGPI = 1.1447298858494001741434262 // log(pi)
  const SMALLX = 7
  const SMALLY = 7

  const REFLECTION = 0.1

  const coeffs = [
    -2.955065359477124183e-2, 6.4102564102564102564e-3, -1.9175269175269175269e-3, 8.4175084175084175084e-4,
    -5.952380952380952381e-4, 7.9365079365079365079e-4, -2.7777777777777777778e-3, 8.3333333333333333333e-2
  ]

  /**
   * Logarithm of the gamma function for real, positive numbers.
   * Based off of Tom Minka's lightspeed toolbox.
   *
   * Syntax:
   *
   *    math.lgamma(n)
   *
   * Examples:
   *
   *    math.lgamma(5)       // returns 3.178053830347945
   *    math.lgamma(0)       // returns Infinity
   *    math.lgamma(-0.5)    // returns NaN
   *    math.lgamma(math.i)  // returns -0.6509231993018536 - 1.8724366472624294i
   *
   * See also:
   *
   *    gamma
   *
   * @param {number | Complex | Array | Matrix} n   A real or complex number
   * @return {number | Complex | Array | Matrix}    The log gamma of `n`
   */

  return typed(name, {
    number: lgammaNumber,

    Complex: function (n) {
      if (n.isNaN()) {
        return new Complex(NaN, NaN)
      } else if (n.im === 0) {
        return new Complex(this(n.re), 0)
      } else if (n.re >= SMALLX || Math.abs(n.im) >= SMALLY) {
        return lgammaStriling(n)
      } else if (n.re <= REFLECTION) {
        // Reflection formula
        const tmp = copysign(TWOPI, n.im) * Math.floor(0.5 * n.re + 0.25)
        // TODO: `complex.js sin` doesn't have extremely high precision, so this value `a` may lose a little precision,
        // causing the computation results to be less accurate than the lgamma of real numbers
        const a = n.mul(Math.PI).sin().log()
        const b = this(new Complex(1 - n.re, -n.im))
        return new Complex(LOGPI, tmp).sub(a).sub(b)
      } else if (n.im >= 0) {
        return lgammaRecurrence(n)
      } else {
        return lgammaRecurrence(n.conjugate()).conjugate()
      }
    },

    'Array | Matrix': function (n) {
      return deepMap(n, this)
    }
  })

  function copysign (a, b) {
    const signa = a > 0 ? true : a < 0 ? false : 1 / a === Infinity
    const signb = b > 0 ? true : b < 0 ? false : 1 / b === Infinity

    return signa ^ signb ? -a : a
  }

  function lgammaStriling (z) {
    // formula ref:
    // https://math.stackexchange.com/questions/1338753/how-do-i-calculate-values-for-gamma-function-with-complex-arguments
    // computation ref:
    // https://github.com/scipy/scipy/blob/v1.8.0/scipy/special/_loggamma.pxd#L101

    // left part

    // x (log(x) - 1) + 1/2 (log(2PI) - log(x))
    // => (x - 0.5) * log(x) - x + log(2PI) / 2
    const leftPart = z.sub(0.5).mul(z.log()).sub(z).add(lnSqrt2PI)

    // right part

    const rz = new Complex(1, 0).div(z)
    const rzz = rz.div(z)

    let a = coeffs[0]
    let b = coeffs[1]
    const r = 2 * rzz.re
    const s = rzz.re * rzz.re + rzz.im * rzz.im

    for (let i = 2; i < 8; i++) {
      const tmp = b
      b = -s * a + coeffs[i]
      a = r * a + tmp
    }

    const rightPart = rz.mul(rzz.mul(a).add(b))

    // plus left and right

    return leftPart.add(rightPart)
  }

  function lgammaRecurrence (z) {
    // computation ref:
    // https://github.com/scipy/scipy/blob/v1.8.0/scipy/special/_loggamma.pxd#L78

    let signflips = 0
    let sb = 0
    let shiftprod = z

    z = z.add(1)
    while (z.re <= SMALLX) {
      shiftprod = shiftprod.mul(z)

      const nsb = shiftprod.im < 0 ? 1 : 0
      if (nsb !== 0 && sb === 0) signflips++
      sb = nsb

      z = z.add(1)
    }

    return lgammaStriling(z)
      .sub(shiftprod.log())
      .sub(new Complex(0, signflips * 2 * Math.PI * 1))
  }
})
