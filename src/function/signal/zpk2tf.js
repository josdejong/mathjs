import { factory } from '../../utils/factory.js'

const name = 'zpk2tf'

const dependencies = [
  'typed',
  'add',
  'multiply',
  'Complex'
]

export const createZpk2tf = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply, Complex }) => {
  /**
     * Compute the transfer function of a zero-pole-gain model.
     *
     * Syntax:
     *      math.zpk2tf(z, p, k)
     *
     * Examples:
     *    math.zpk2tf([1, 2], [3, 4], 5)    // returns [5]
     *
     * @param {Array | Complex} z
     * @param {Array | Complex} p
     * @param {number | Complex} k
     * @return {Array | Complex}
     *
     */
  return typed(name, {
    'Array,Array,number': function (z, p, k) {
      return _zpk2tf(z, p, k)
    },
    'Array,Array': function (z, p) {
      return _zpk2tf(z, p, 1)
    }
  })

  function _zpk2tf (z, p, k) {
    let num = [Complex(1, 0)]
    let den = [Complex(1, 0)]
    for (let i = 0; i < z.length; i++) {
      let zero = z[i]
      if (typeof zero === 'number') zero = Complex(zero, 0)
      num = _multiply(num, [Complex(1, 0), Complex(-zero.re, -zero.im)])
    }
    for (let i = 0; i < p.length; i++) {
      let pole = p[i]
      if (typeof pole === 'number') pole = Complex(pole, 0)
      den = _multiply(den, [Complex(1, 0), Complex(-pole.re, -pole.im)])
    }
    for (let i = 0; i < num.length; i++) {
      num[i] = multiply(num[i], k)
    }
    return [num, den]
  }

  function _multiply (a, b) {
    const c = []
    for (let i = 0; i < a.length + b.length - 1; i++) {
      c[i] = Complex(0, 0)
      for (let j = 0; j < a.length; j++) {
        if (i - j >= 0 && i - j < b.length) {
          c[i] = add(c[i], multiply(a[j], b[i - j]))
        }
      }
    }
    return c
  }
})
