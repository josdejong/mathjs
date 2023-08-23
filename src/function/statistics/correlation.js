import { factory } from '../../utils/factory.js'

const name = 'corr'
const dependencies = ['typed']

export const createCorrelation = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Compute the colleration of a two list with values.
   *
   * Syntax:
   *
   *     math.corr(A, B)
   *
   * Examples:
   *
   *     math.corr([1, 2, 3, 4, 5], [4, 5, 6, 7, 8])     // returns 1
   *     math.corr([1, 2.2, 3, 4.8, 5], [4, 5.3, 6.6, 7, 8])     // returns 0.9569941688503644
   *
   */
  return typed(name, {
    // correlation(xArray, yArray)
    'Array, Array': function (xArray, yArray) {
      return _corr(xArray, yArray)
    }
  })
  /**
   * Calculate the correlation coefficient between two arrays.
   * @param {Array} xArray
   * @param {Array} yArray
   * @return {number | BigNumber} correlation coefficient
   * @private
   */
  function _corr (xArray, yArray, normalization) {
    if (xArray.length !== yArray.length) {
      throw new SyntaxError('Input arrays must have the same length')
    }
    if (xArray.length < 2) {
      throw new SyntaxError('Function corr requires two or more parameters (' + xArray.length + ' provided) in first input array')
    }
    if (yArray.length < 2) {
      throw new SyntaxError('Function corr requires two or more parameters (' + yArray.length + ' provided) in second input array')
    }

    const n = xArray.length

    const sumX = xArray.reduce((acc, x) => acc + x, 0)
    const sumY = yArray.reduce((acc, y) => acc + y, 0)

    const sumXY = xArray.reduce((acc, x, index) => acc + x * yArray[index], 0)
    const sumXSquare = xArray.reduce((acc, x) => acc + x ** 2, 0)
    const sumYSquare = yArray.reduce((acc, y) => acc + y ** 2, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXSquare - sumX ** 2) * (n * sumYSquare - sumY ** 2))

    const correlation = numerator / denominator

    return correlation
  }
})
