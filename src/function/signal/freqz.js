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
     *   math.freqz([1, 2], [1, 2, 3], 4) // returns { h: [0.5 + 0i, 0.4768589245763655 + 0.2861153547458193i, 0.25000000000000006 + 0.75i, -0.770976571635189 + 0.4625859429811135i], w: [0, 0.7853981633974483, 1.5707963267948966, 2.356194490192345 ] }
     *   math.freqz([1, 2], [1, 2, 3], [0, 1]) // returns { h: [0.5 + 0i, 0.45436781 + 0.38598051i], w: [0, 1] }
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
      const w = createBins(512)
      return _freqz(b, a, w)
    },
    'Array, Array, Array': function (b, a, w) {
      return _freqz(b, a, w)
    },
    'Array, Array, number': function (b, a, w) {
      if (w < 0) {
        throw new Error('w must be a positive number')
      }
      const w2 = createBins(w)
      return _freqz(b, a, w2)
    },
    'Matrix, Matrix': function (b, a) {
      // console.log('here')
      const _w = createBins(512)
      const { w, h } = _freqz(b.valueOf(), a.valueOf(), _w)
      return {
        w: matrix(w),
        h: matrix(h)
      }
    },
    'Matrix, Matrix, Matrix': function (b, a, w) {
      const { h } = _freqz(b.valueOf(), a.valueOf(), w.valueOf())
      return {
        h: matrix(h),
        w: matrix(w)
      }
    },
    'Matrix, Matrix, number': function (b, a, w) {
      if (w < 0) {
        throw new Error('w must be a positive number')
      }
      const _w = createBins(w)
      const { h } = _freqz(b.valueOf(), a.valueOf(), _w)
      return {
        h: matrix(h),
        w: matrix(_w)
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

  function createBins (n) {
    const bins = []
    for (let i = 0; i < n; i++) {
      bins.push(i / n * Math.PI)
    }
    return bins
  }
})
