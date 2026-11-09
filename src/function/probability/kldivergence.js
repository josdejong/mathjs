import { factory } from '../../utils/factory.js'
import { isBigNumber } from '../../utils/is.js'

const name = 'kldivergence'
const dependencies = ['typed', 'matrix', 'divide', 'sum', 'multiply', 'map', 'log', 'isNumeric', 'sign']

export const createKldivergence = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, divide, sum, multiply, map, log, isNumeric, sign }) => {
  /**
     * Calculate the Kullback-Leibler (KL) divergence  between two distributions
     *
     * Syntax:
     *
     *     math.kldivergence(x, y)
     *
     * Examples:
     *
     *     math.kldivergence([0.7,0.5,0.4], [0.2,0.9,0.5])   //returns 0.3086145781062587
     *
     *
     * History:
     *
     *     v2.1   Created
     *
     * @param  {Array | Matrix} q    First vector
     * @param  {Array | Matrix} p    Second vector
     * @return {number}              Returns distance between q and p
     */
  return typed(name, {
    'Array, Array': function (q, p) {
      return _kldiv(matrix(q), matrix(p))
    },

    'Matrix, Array': function (q, p) {
      return _kldiv(q, matrix(p))
    },

    'Array, Matrix': function (q, p) {
      return _kldiv(matrix(q), p)
    },

    'Matrix, Matrix': function (q, p) {
      return _kldiv(q, p)
    }

  })

  function _kldiv (q, p) {
    const plength = p.size().length
    const qlength = q.size().length
    if (plength > 1) {
      throw new Error('first object must be one dimensional')
    }

    if (qlength > 1) {
      throw new Error('second object must be one dimensional')
    }

    if (p.size()[0] !== q.size()[0]) {
      throw new Error('Length of two vectors must be equal')
    }

    // Before calculation, apply normalization
    const sumq = sum(q)
    if (isExactZero(sumq)) {
      throw new Error('Sum of elements in first object must be non zero')
    }

    const sump = sum(p)
    if (isExactZero(sump)) {
      throw new Error('Sum of elements in second object must be non zero')
    }
    const qnorm = divide(q, sumq)
    const pnorm = divide(p, sump)

    const result = sum(map(qnorm, (value, index) => {
      const reference = pnorm.get(index)
      if (isExactZero(value) && isNumeric(reference) && Number(sign(reference)) >= 0) {
        return value
      }
      return multiply(value, log(divide(value, reference)))
    }))
    if (isNumeric(result)) {
      return result
    } else {
      return Number.NaN
    }
  }
})

/**
 * Test distribution zeros exactly, independent of comparison tolerances.
 * @param {*} value
 * @returns {boolean}
 */
function isExactZero (value) {
  if (isBigNumber(value)) {
    return value.isZero()
  }
  return value === 0 || value === 0n
}
