import { factory } from '../../utils/factory.js'

const name = 'freqz'

const dependencies = [
  'typed',
  'add',
  'multiply',
  'Complex',
  'divide',
  'matrix'
]

export const createFreqz = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply, Complex, divide, matrix }) => {
  /**
     * Calculates the frequency response of a filter given its numerator and denominator coefficients.
     *
     * Syntax:
     *    math.freqz(b, a)
     *    math.freqz(b, a, w)
     *
     * Examples:
     *   math.freqz([1, 2], [1, 2, 3], 4) // returns { h: [0.5+0j, 0.47685+0.2861j, 0.2500+0.75j,  -0.770+0.4625j], w: [0, 0.7853981633974483, 1.5707963267948966, 2.356194490192345 ] }
     *   math.freqz([1, 2], [1, 2, 3], [0, 1]) // returns { h: [0.5+0.j, 0.45436781+0.38598051j], w: [0, 1] }
     *
     * See also:
     *  zpk2tf
     *
     * @param {Array.<number>} b The numerator coefficients of the filter.
     * @param {Array.<number>} a The denominator coefficients of the filter.
     * @param {Array.<number>} [w] A vector of frequencies (in radians/sample) at which the frequency response is to be computed or the number of points to compute (if a number is not provided, the default is 512 points)
     * @returns {Object} An object with two properties: h, a vector containing the complex frequency response, and w, a vector containing the normalized frequencies (in radians/sample) at which the response was computed.
     *
     *
     */
  return typed(name, {
    'Array, Array': function (b, a) {
      const w = []
      for (let i = 0; i < 512; i++) {
        w.push(i / 512 * Math.PI)
      }
      return _freqz(b, a, w)
    },
    'Array, Array, Array': function (b, a, w) {
      return _freqz(b, a, w)
    },
    'Array, Array, number': function (b, a, w) {
      if (w < 0) {
        throw new Error('w must be a positive number')
      }
      const w2 = []
      for (let i = 0; i < w; i++) {
        w2.push(i / w * Math.PI)
      }
      return _freqz(b, a, w2)
    },
    'Matrix, Matrix': function (b, a) {
      const { w, h } = _freqz(b.valueOf(), a.valueOf())
      return {
        w: matrix(w),
        h: matrix(h)
      }
    },
    'Matrix, Matrix, Array': function (b, a, w) {
      const { h } = _freqz(b.valueOf(), a.valueOf(), w)
      return {
        h: matrix(h),
        w: matrix(w)
      }
    },
    'Matrix, Matrix, number': function (b, a, w) {
      if (w < 0) {
        throw new Error('w must be a positive number')
      }
      const w2 = []
      for (let i = 0; i < w; i++) {
        w2.push(i / w * Math.PI)
      }
      const { h } = _freqz(b.valueOf(), a.valueOf(), w2)
      return {
        h: matrix(h),
        w: matrix(w2)
      }
    }
  })

  function _freqz (b, a, w) {
    const num = []
    const den = []
    for (let i = 0; i < w.length; i++) {
      let sumNum = Complex(0, 0)
      let sumDen = Complex(0, 0)
      for (let j = 0; j < b.length; j++) {
        sumNum = add(sumNum, multiply(b[j], Complex(Math.cos(-j * w[i]), Math.sin(-j * w[i]))))
      }
      for (let j = 0; j < a.length; j++) {
        sumDen = add(sumDen, multiply(a[j], Complex(Math.cos(-j * w[i]), Math.sin(-j * w[i]))))
      }
      num.push(sumNum)
      den.push(sumDen)
    }
    const h = []
    for (let i = 0; i < num.length; i++) {
      h.push(divide(num[i], den[i]))
    }
    return { h, w }
  }
})
