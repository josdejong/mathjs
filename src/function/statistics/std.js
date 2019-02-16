'use strict'

function factory (type, config, load, typed) {
  const sqrt = load(require('../arithmetic/sqrt'))
  const variance = load(require('../statistics/var'))

  /**
   * Compute the standard deviation of a matrix or a  list with values.
   * The standard deviations is defined as the square root of the variance:
   * `std(A) = sqrt(var(A))`.
   * In case of a (multi dimensional) array or matrix, the standard deviation
   * over all elements will be calculated by default, unless an axis is specified
   * in which case the standard deviation will be computed along that axis.
   *
   * Additionally, it is possible to compute the standard deviation along the rows
   * or columns of a matrix by specifying the dimension as the second argument.
   *
   * Optionally, the type of normalization can be specified as the final
   * parameter. The parameter `normalization` can be one of the following values:
   *
   * - 'unbiased' (default) The sum of squared errors is divided by (n - 1)
   * - 'uncorrected'        The sum of squared errors is divided by n
   * - 'biased'             The sum of squared errors is divided by (n + 1)
   *
   *
   * Syntax:
   *
   *     math.std(a, b, c, ...)
   *     math.std(A)
   *     math.std(A, normalization)
   *     math.std(A, dimension)
   *     math.std(A, dimension, normalization)
   *
   * Examples:
   *
   *     math.std(2, 4, 6)                     // returns 2
   *     math.std([2, 4, 6, 8])                // returns 2.581988897471611
   *     math.std([2, 4, 6, 8], 'uncorrected') // returns 2.23606797749979
   *     math.std([2, 4, 6, 8], 'biased')      // returns 2
   *
   *     math.std([[1, 2, 3], [4, 5, 6]])      // returns 1.8708286933869707
   *     math.std([[1, 2, 3], [4, 6, 8]], 0)    // returns [2.1213203435596424, 2.8284271247461903, 3.5355339059327378]
   *     math.std([[1, 2, 3], [4, 6, 8]], 1)    // returns [1, 2]
   *     math.std([[1, 2, 3], [4, 6, 8]], 1, 'biased') // returns [0.7071067811865476, 1.4142135623730951]
   *
   * See also:
   *
   *    mean, median, max, min, prod, sum, var
   *
   * @param {Array | Matrix} array
   *                        A single matrix or or multiple scalar values
   * @param {string} [normalization='unbiased']
   *                        Determines how to normalize the variance.
   *                        Choose 'unbiased' (default), 'uncorrected', or 'biased'.
   * @param dimension {number | BigNumber}
   *                        Determines the axis to compute the standard deviation for a matrix
   * @return {*} The standard deviation
   */
  const std = typed('std', {
    // std([a, b, c, d, ...])
    'Array | Matrix': _std,

    // std([a, b, c, d, ...], normalization)
    'Array | Matrix, string': _std,

    // std([a, b, c, c, ...], dim)
    'Array | Matrix, number | BigNumber': _std,

    // std([a, b, c, c, ...], dim, normalization)
    'Array | Matrix, number | BigNumber, string': _std,

    // std(a, b, c, d, ...)
    '...': function (args) {
      return _std(args)
    }
  })

  std.toTex = undefined // use default template

  return std

  function _std (array, normalization) {
    if (array.length === 0) {
      throw new SyntaxError('Function std requires one or more parameters (0 provided)')
    }

    try {
      return sqrt(variance.apply(null, arguments))
    } catch (err) {
      if (err instanceof TypeError && err.message.indexOf(' var') !== -1) {
        throw new TypeError(err.message.replace(' var', ' std'))
      } else {
        throw err
      }
    }
  }
}

exports.name = 'std'
exports.factory = factory
