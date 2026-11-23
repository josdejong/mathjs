import { isBigNumber, isFraction, isMatrix } from '../../utils/is.js'
import { isInteger } from '../../utils/number.js'
import { factory } from '../../utils/factory.js'

const name = 'partitionSelect'
const dependencies = ['typed', 'isNumeric', 'isNaN', 'compare']

export const createPartitionSelect = /* #__PURE__ */ factory(name, dependencies, ({ typed, isNumeric, isNaN: mathIsNaN, compare }) => {
  const asc = compare
  const desc = (a, b) => -compare(a, b)

  /**
   * Partition-based selection of an array or 1D matrix.
   * Will find the kth smallest value, and mutates the input array.
   * Uses Quickselect.
   *
   * Syntax:
   *
   *    math.partitionSelect(x, k)
   *    math.partitionSelect(x, k, compare)
   *
   * The index k can be a number, BigNumber, bigint, or Fraction, and is
   * converted to a plain number internally.
   *
   * Examples:
   *
   *    math.partitionSelect([5, 10, 1], 2)                               // returns 10
   *    math.partitionSelect(['C', 'B', 'A', 'D'], 1, math.compareText)   // returns 'B'
   *
   *    function sortByLength (a, b) {
   *      return a.length - b.length
   *    }
   *    math.partitionSelect(['Langdon', 'Tom', 'Sara'], 2, sortByLength) // returns 'Langdon'
   *
   *    // the input array is mutated
   *    arr = [5, 2, 1]
   *    math.partitionSelect(arr, 0) // returns 1, arr is now: [1, 2, 5]
   *    math.partitionSelect(arr, 1, 'desc') // returns 2, arr is now: [5, 2, 1]
   *
   * See also:
   *
   *    sort
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to sort
   * @param {Number | BigNumber | bigint | Fraction} k
   *        The kth smallest value to be retrieved, zero-based index.
   *        Any numeric type is accepted and converted to a number internally.
   * @param {Function | 'asc' | 'desc'} [compare='asc']
   *        An optional comparator function. The function is called as
   *        `compare(a, b)`, and must return 1 when a > b, -1 when a < b,
   *        and 0 when a == b.
   * @return {*} Returns the kth lowest value.
   *
   * History:
   *
   *    v15.4  Accept BigNumber, bigint, and Fraction for the index k
   *    v0.13  Created
   */
  return typed(name, {
    'Array | Matrix, number | BigNumber | bigint | Fraction': function (x, k) {
      return _partitionSelect(x, toNumberIndex(k), asc, true)
    },

    'Array | Matrix, number | BigNumber | bigint | Fraction, string': function (x, k, compare) {
      const index = toNumberIndex(k)
      if (compare === 'asc') {
        return _partitionSelect(x, index, asc, true)
      } else if (compare === 'desc') {
        return _partitionSelect(x, index, desc, true)
      } else {
        throw new Error('Compare string must be "asc" or "desc"')
      }
    },

    'Array | Matrix, number | BigNumber | bigint | Fraction, function': function (x, k, compare) {
      return _partitionSelect(x, toNumberIndex(k), compare, false)
    }
  })

  /**
   * Convert an index of any supported numeric type into a plain
   * JavaScript number.
   *
   * Note: math.js `Fraction` has no `toNumber()` method, but its `valueOf()`
   * already returns a plain number. `BigNumber` does have a `toNumber()`
   * method, while its `valueOf()` returns a BigNumber (not a number), so
   * BigNumber must be handled with `toNumber()`.
   *
   * @param {Number | BigNumber | bigint | Fraction} k
   * @return {Number}
   * @private
   */
  function toNumberIndex (k) {
    if (typeof k === 'number') {
      return k
    }

    if (typeof k === 'bigint') {
      return Number(k)
    }

    if (isBigNumber(k)) {
      return k.toNumber()
    }

    if (isFraction(k)) {
      return k.valueOf()
    }

    return Number(k)
  }

  /**
   * @param {Matrix | Array} x
   * @param {Number} k
   * @param {Function} compare
   * @param {Boolean} isStandardCompare
   *        True when using the built-in `asc` or `desc` comparator, in which
   *        case NaN values are detected and returned right away. When a custom
   *        comparator is used, NaN handling is left entirely to that comparator.
   * @private
   */
  function _partitionSelect (x, k, compare, isStandardCompare) {
    if (!isInteger(k) || k < 0) {
      throw new Error(`k must be a non-negative integer, but got ${k}`)
    }

    if (isMatrix(x)) {
      const size = x.size()
      if (size.length > 1) {
        throw new Error('Only one dimensional matrices supported')
      }
      return quickSelect(x.valueOf(), k, compare, isStandardCompare)
    }

    if (Array.isArray(x)) {
      return quickSelect(x, k, compare, isStandardCompare)
    }
  }

  /**
   * Quickselect algorithm.
   * Code adapted from:
   * https://blog.teamleadnet.com/2012/07/quick-select-algorithm-find-kth-element.html
   *
   * @param {Array} arr
   * @param {Number} k
   * @param {Function} compare
   * @param {Boolean} isStandardCompare
   *        True when using the built-in `asc` or `desc` comparator, in which
   *        case NaN values are detected and returned right away. When a custom
   *        comparator is used, NaN handling is left entirely to that comparator.
   * @private
   */
  function quickSelect (arr, k, compare, isStandardCompare) {
    if (k >= arr.length) {
      throw new Error(`k out of bounds: index ${k} is larger than the number of elements (${arr.length})`)
    }

    // check for NaN values since these can cause an infinite while loop.
    // only done for the standard comparators: a custom comparator may define
    // its own NaN handling and must be respected.
    if (isStandardCompare) {
      for (let i = 0; i < arr.length; i++) {
        if (isNumeric(arr[i]) && mathIsNaN(arr[i])) {
          return arr[i] // return NaN
        }
      }
    }

    let from = 0
    let to = arr.length - 1

    // if from == to we reached the kth element
    while (from < to) {
      let r = from
      let w = to
      const pivot = arr[Math.floor(Math.random() * (to - from + 1)) + from]

      // stop if the reader and writer meets
      while (r < w) {
        // arr[r] >= pivot
        if (compare(arr[r], pivot) >= 0) { // put the large values at the end
          const tmp = arr[w]
          arr[w] = arr[r]
          arr[r] = tmp
          --w
        } else { // the value is smaller than the pivot, skip
          ++r
        }
      }

      // if we stepped up (r++) we need to step one down (arr[r] > pivot)
      if (compare(arr[r], pivot) > 0) {
        --r
      }

      // the r pointer is on the end of the first k elements
      if (k <= r) {
        to = r
      } else {
        from = r + 1
      }
    }

    return arr[k]
  }
})
