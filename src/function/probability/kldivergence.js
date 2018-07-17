'use strict'

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const divide = load(require('../arithmetic/divide'))
  const sum = load(require('../statistics/sum'))
  const multiply = load(require('../arithmetic/multiply'))
  const dotDivide = load(require('../arithmetic/dotDivide'))
  const log = load(require('../arithmetic/log'))
  const isNumeric = load(require('../utils/isNumeric'))

  /**
     * Calculate the Kullback-Leibler (KL) divergence  between two distributions
     *
     * Syntax:
     *
     *     math.kldivergence(x, y)
     *
     * Examples:
     *
     *     math.kldivergence([0.7,0.5,0.4], [0.2,0.9,0.5])   //returns 0.24376698773121153
     *
     *
     * @param  {Array | Matrix} q    First vector
     * @param  {Array | Matrix} p    Second vector
     * @return {number}              Returns distance between q and p
     */
  const kldivergence = typed('kldivergence', {
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

    if (plength !== qlength) {
      throw new Error('Length of two vectors must be equal')
    }

    // Before calculation, apply normalization
    const sumq = sum(q)
    if (sumq === 0) {
      throw new Error('Sum of elements in first object must be non zero')
    }

    const sump = sum(p)
    if (sump === 0) {
      throw new Error('Sum of elements in second object must be non zero')
    }
    const qnorm = divide(q, sum(q))
    const pnorm = divide(p, sum(p))

    const result = sum(multiply(qnorm, log(dotDivide(qnorm, pnorm))))
    if (isNumeric(result)) {
      return result
    } else {
      return Number.NaN
    }
  }

  return kldivergence
}

exports.name = 'kldivergence'
exports.factory = factory
