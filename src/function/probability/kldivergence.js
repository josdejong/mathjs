import { factory } from '../../utils/factory.js'

const name = 'kldivergence'
const dependencies = ['typed', 'matrix', 'divide', 'sum', 'multiply', 'map', 'dotDivide', 'log', 'isNumeric']

export const createKldivergence = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, divide, sum, multiply, map, dotDivide, log, isNumeric }) => {
  /**
     * Calculate the Kullback-Leibler (KL) divergence from a reference distribution
     * to a test (approximating) distribution. Each vector is normalized to sum to 1.
     * The result is the sum of `reference[i] * log(reference[i] / test[i])` over the
     * normalized entries. KL divergence is not symmetric: the argument order matters.
     *
     * Syntax:
     *
     *     math.kldivergence(reference, test)
     *
     * Examples:
     *
     *     math.kldivergence([0.7, 0.5, 0.4], [0.2, 0.9, 0.5]) // returns 0.3086145781062587
     *     math.kldivergence([0.2, 0.9, 0.5], [0.7, 0.5, 0.4]) // returns 0.24376698773121153
     *
     *
     * History:
     *
     *     v2.1   Created
     *
     * @param  {Array | Matrix} reference  Weights of the reference distribution
     * @param  {Array | Matrix} test       Weights of the approximating distribution
     * @return {number}                    KL divergence of reference relative to test
     */
  return typed(name, {
    'Array, Array': function (reference, test) {
      return _kldiv(matrix(reference), matrix(test))
    },

    'Matrix, Array': function (reference, test) {
      return _kldiv(reference, matrix(test))
    },

    'Array, Matrix': function (reference, test) {
      return _kldiv(matrix(reference), test)
    },

    'Matrix, Matrix': function (reference, test) {
      return _kldiv(reference, test)
    }

  })

  function _kldiv (reference, test) {
    const testDimensions = test.size().length
    const referenceDimensions = reference.size().length
    if (testDimensions > 1) {
      throw new Error('first object must be one dimensional')
    }

    if (referenceDimensions > 1) {
      throw new Error('second object must be one dimensional')
    }

    if (testDimensions !== referenceDimensions) {
      throw new Error('Length of two vectors must be equal')
    }

    // Before calculation, apply normalization
    const referenceTotal = sum(reference)
    if (referenceTotal === 0) {
      throw new Error('Sum of elements in first object must be non zero')
    }

    const testTotal = sum(test)
    if (testTotal === 0) {
      throw new Error('Sum of elements in second object must be non zero')
    }
    const normalizedReference = divide(reference, referenceTotal)
    const normalizedTest = divide(test, testTotal)

    const result = sum(multiply(normalizedReference, map(dotDivide(normalizedReference, normalizedTest), x => log(x))))
    if (isNumeric(result)) {
      return result
    } else {
      return Number.NaN
    }
  }
})
