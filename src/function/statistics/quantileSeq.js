import { isBigNumber, isNumber } from '../../utils/is.js'
import { isInteger } from '../../utils/number.js'
import { flatten } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'quantileSeq'
const dependencies = ['typed', 'add', 'multiply', 'partitionSelect', 'compare']

export const createQuantileSeq = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply, partitionSelect, compare }) => {
  /**
   * Compute the prob order quantile of a matrix or a list with values.
   * The sequence is sorted and the middle value is returned.
   * Supported types of sequence values are: Number, BigNumber, Unit
   * Supported types of probability are: Number, BigNumber
   *
   * In case of a multidimensional array or matrix, the prob order quantile
   * of all elements will be calculated.
   *
   * Syntax:
   *
   *     math.quantileSeq(A, prob[, sorted])
   *     math.quantileSeq(A, [prob1, prob2, ...][, sorted])
   *     math.quantileSeq(A, N[, sorted])
   *
   * Examples:
   *
   *     math.quantileSeq([3, -1, 5, 7], 0.5)         // returns 4
   *     math.quantileSeq([3, -1, 5, 7], [1/3, 2/3])  // returns [3, 5]
   *     math.quantileSeq([3, -1, 5, 7], 2)           // returns [3, 5]
   *     math.quantileSeq([-1, 3, 5, 7], 0.5, true)   // returns 4
   *
   * See also:
   *
   *     median, mean, min, max, sum, prod, std, variance
   *
   * @param {Array, Matrix} data                A single matrix or Array
   * @param {Number, BigNumber, Array} probOrN  prob is the order of the quantile, while N is
   *                                            the amount of evenly distributed steps of
   *                                            probabilities; only one of these options can
   *                                            be provided
   * @param {Boolean} sorted=false              is data sorted in ascending order
   * @return {Number, BigNumber, Unit, Array}   Quantile(s)
   */

  return typed(name, {
    'Array | Matrix, number | BigNumber | Unit': (data, p) => _quantileSeqProbNumber(data, p, false),
    'Array | Matrix, number | BigNumber | Unit, boolean': _quantileSeqProbNumber,
    'Array | Matrix, Array | Matrix': (data, p) => _quantileSeqProbCollection(data, p, false),
    'Array | Matrix, Array | Matrix, boolean': _quantileSeqProbCollection
  })

  function _quantileSeqProbNumber (data, probOrN, sorted) {
    let probArr, one
    const dataArr = data.valueOf()
    if (isNumber(probOrN)) {
      if (probOrN < 0) {
        throw new Error('N/prob must be non-negative')
      }

      if (probOrN <= 1) {
        // quantileSeq([a, b, c, d, ...], prob[,sorted])
        return _quantileSeq(dataArr, probOrN, sorted)
      }

      if (probOrN > 1) {
        // quantileSeq([a, b, c, d, ...], N[,sorted])
        if (!isInteger(probOrN)) {
          throw new Error('N must be a positive integer')
        }

        const nPlusOne = probOrN + 1
        probArr = new Array(probOrN)
        for (let i = 0; i < probOrN; i++) {
          probArr[i] = _quantileSeq(dataArr, (i + 1) / nPlusOne, sorted)
        }
        return probArr
      }
    }

    if (isBigNumber(probOrN)) {
      const BigNumber = probOrN.constructor

      if (probOrN.isNegative()) {
        throw new Error('N/prob must be non-negative')
      }

      one = new BigNumber(1)

      if (probOrN.lte(one)) {
        // quantileSeq([a, b, c, d, ...], prob[,sorted])
        return new BigNumber(_quantileSeq(dataArr, probOrN, sorted))
      }

      if (probOrN.gt(one)) {
        // quantileSeq([a, b, c, d, ...], N[,sorted])
        if (!probOrN.isInteger()) {
          throw new Error('N must be a positive integer')
        }

        // largest possible Array length is 2^32-1
        // 2^32 < 10^15, thus safe conversion guaranteed
        const intN = probOrN.toNumber()
        if (intN > 4294967295) {
          throw new Error('N must be less than or equal to 2^32-1, as that is the maximum length of an Array')
        }

        const nPlusOne = new BigNumber(intN + 1)
        probArr = new Array(intN)
        for (let i = 0; i < intN; i++) {
          probArr[i] = new BigNumber(_quantileSeq(dataArr, new BigNumber(i + 1).div(nPlusOne), sorted))
        }
        return probArr
      }
    }
  }

  /**
   * Calculate the prob order quantile of an n-dimensional array.
   *
   * @param {Array, Matrix} array
   * @param {Array, Matrix} prob
   * @param {Boolean} sorted
   * @return {Number, BigNumber, Unit} prob order quantile
   * @private
   */

  function _quantileSeqProbCollection (data, probOrN, sorted) {
    const dataArr = data.valueOf()
    let one

    // quantileSeq([a, b, c, d, ...], [prob1, prob2, ...][,sorted])
    const probOrNArr = probOrN.valueOf()
    const probArr = new Array(probOrNArr.length)
    for (let i = 0; i < probArr.length; ++i) {
      const currProb = probOrNArr[i]
      if (isNumber(currProb)) {
        if (currProb < 0 || currProb > 1) {
          throw new Error('Probability must be between 0 and 1, inclusive')
        }
      } else if (isBigNumber(currProb)) {
        one = new currProb.constructor(1)
        if (currProb.isNegative() || currProb.gt(one)) {
          throw new Error('Probability must be between 0 and 1, inclusive')
        }
      } else {
        throw new TypeError('Unexpected type of argument in function quantileSeq') // FIXME: becomes redundant when converted to typed-function
      }

      probArr[i] = _quantileSeq(dataArr, currProb, sorted)
    }
    return probArr
  }

  /**
   * Calculate the prob order quantile of an n-dimensional array.
   *
   * @param {Array} array
   * @param {Number, BigNumber} prob
   * @param {Boolean} sorted
   * @return {Number, BigNumber, Unit} prob order quantile
   * @private
   */
  function _quantileSeq (array, prob, sorted) {
    const flat = flatten(array)
    const len = flat.length
    if (len === 0) {
      throw new Error('Cannot calculate quantile of an empty sequence')
    }

    if (isNumber(prob)) {
      const index = prob * (len - 1)
      const fracPart = index % 1
      if (fracPart === 0) {
        const value = sorted ? flat[index] : partitionSelect(flat, index)
        return value
      }

      const integerPart = Math.floor(index)

      let left
      let right
      if (sorted) {
        left = flat[integerPart]
        right = flat[integerPart + 1]
      } else {
        right = partitionSelect(flat, integerPart + 1)

        // max of partition is kth largest
        left = flat[integerPart]
        for (let i = 0; i < integerPart; ++i) {
          if (compare(flat[i], left) > 0) {
            left = flat[i]
          }
        }
      }

      // Q(prob) = (1-f)*A[floor(index)] + f*A[floor(index)+1]
      return add(multiply(left, 1 - fracPart), multiply(right, fracPart))
    }

    // If prob is a BigNumber
    let index = prob.times(len - 1)
    if (index.isInteger()) {
      index = index.toNumber()
      const value = sorted ? flat[index] : partitionSelect(flat, index)
      return value
    }

    const integerPart = index.floor()
    const fracPart = index.minus(integerPart)
    const integerPartNumber = integerPart.toNumber()

    let left
    let right
    if (sorted) {
      left = flat[integerPartNumber]
      right = flat[integerPartNumber + 1]
    } else {
      right = partitionSelect(flat, integerPartNumber + 1)

      // max of partition is kth largest
      left = flat[integerPartNumber]
      for (let i = 0; i < integerPartNumber; ++i) {
        if (compare(flat[i], left) > 0) {
          left = flat[i]
        }
      }
    }

    // Q(prob) = (1-f)*A[floor(index)] + f*A[floor(index)+1]
    const one = new fracPart.constructor(1)
    return add(multiply(left, one.minus(fracPart)), multiply(right, fracPart))
  }
})
