'use strict'

const array = require('../../utils/array')
const latex = require('../../utils/latex')
const string = require('../../utils/string')

function factory (type, config, load, typed) {
  const abs = load(require('../arithmetic/abs'))
  const add = load(require('../arithmetic/add'))
  const multiply = load(require('../arithmetic/multiply'))
  const sqrt = load(require('../arithmetic/sqrt'))
  const subtract = load(require('../arithmetic/subtract'))
  const inv = load(require('../matrix/inv'))
  const size = load(require('../matrix/size'))
  const max = load(require('../statistics/max'))
  const identity = load(require('./identity'))

  /**
   * Calculate the principal square root of a square matrix.
   * The principal square root matrix `X` of another matrix `A` is such that `X * X = A`.
   *
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix
   *
   * Syntax:
   *
   *     X = math.sqrtm(A)
   *
   * Examples:
   *
   *     math.sqrtm([[1, 2], [3, 4]]) // returns [[-2, 1], [1.5, -0.5]]
   *
   * See also:
   *
   *     sqrt, pow
   *
   * @param  {Array | Matrix} A   The square matrix `A`
   * @return {Array | Matrix}     The principal square root of matrix `A`
   */
  const sqrtm = typed('sqrtm', {
    'Array | Matrix': function (A) {
      const size = type.isMatrix(A) ? A.size() : array.size(A)
      switch (size.length) {
        case 1:
          // Single element Array | Matrix
          if (size[0] === 1) {
            return sqrt(A)
          } else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')')
          }

        case 2:
          // Two-dimensional Array | Matrix
          const rows = size[0]
          const cols = size[1]
          if (rows === cols) {
            return _denmanBeavers(A)
          } else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')')
          }
      }
    }
  })

  const _maxIterations = 1e3
  const _tolerance = 1e-6

  /**
   * Calculate the principal square root matrix using the Denman–Beavers iterative method
   *
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix#By_Denman–Beavers_iteration
   *
   * @param  {Array | Matrix} A   The square matrix `A`
   * @return {Array | Matrix}     The principal square root of matrix `A`
   * @private
   */
  function _denmanBeavers (A) {
    let error
    let iterations = 0

    let Y = A
    let Z = identity(size(A))

    do {
      const Yk = Y
      Y = multiply(0.5, add(Yk, inv(Z)))
      Z = multiply(0.5, add(Z, inv(Yk)))

      error = max(abs(subtract(Y, Yk)))

      if (error > _tolerance && ++iterations > _maxIterations) {
        throw new Error('computing square root of matrix: iterative method could not converge')
      }
    } while (error > _tolerance)

    return Y
  }

  sqrtm.toTex = { 1: `{\${args[0]}}${latex.operators['pow']}{\\frac{1}{2}}` }

  return sqrtm
}

exports.name = 'sqrtm'
exports.factory = factory
