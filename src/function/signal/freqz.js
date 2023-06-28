import { factory } from '../../utils/factory.js'

const name = 'freqz'

const dependencies = [
  'typed',
  'add',
  'multiply',
  'Complex',
  'divide'
]

export const createFreqz = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply, Complex, divide }) => {
  /**
     * Calculates the frequency response of a filter given its numerator and denominator coefficients.
     * @param {Array.<number>} b The numerator coefficients of the filter.
     * @param {Array.<number>} a The denominator coefficients of the filter.
     * @param {Array.<number>} [w] A vector of frequencies (in radians/sample) at which the frequency response is to be computed.
     * @returns {Array.<number>} The frequency response.
     *
     * @example
     *  freqz([1, 2], [1, 2, 3]); // returns [0.5, 0.5]
     *  freqz([1, 2], [1, 2, 3], [0, 1]); // returns [0.5, 0.5]
     *
     */
  return typed(name, {
    'Array, Array': function (b, a) {
      return _freqz(b, a)
    },
    'Array, Array, Array': function (b, a, w) {
      return _freqz(b, a, w)
    },
    'Array, Array, number': function (b, a, w) {
      return _freqz(b, a, w)
    }
  })

  function _freqz (b, a, w) {
    if (w === undefined) {
      w = []
      for (let i = 0; i < 512; i++) {
        w.push(i / 512 * Math.PI)
      }
    }
    if (typeof w === 'number') {
      const w2 = []
      for (let i = 0; i < w; i++) {
        w2.push(i / w * Math.PI)
      }
      w = w2
    }
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
