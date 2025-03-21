import { isBigNumber, isMatrix, isArray } from '../../../utils/is.js'
import { factory } from '../../../utils/factory.js'

const name = 'index'
const dependencies = ['typed', 'Index']

export const createIndex = /* #__PURE__ */ factory(name, dependencies, ({ typed, Index }) => {
  /**
   * Create an index. An Index can store ranges having start, step, and end
   * for multiple dimensions.
   * Matrix.get, Matrix.set, and math.subset accept an Index as input.
   *
   * Syntax:
   *
   *     math.index(range1, range2, ...)
   *
   * Where each range can be any of:
   *
   * - A number
   * - A string for getting/setting an object property
   * - An instance of `Range`
   * - A one-dimensional Array or a Matrix with numbers or booleans
   *
   * Indexes must be zero-based, integer numbers.
   *
   * Examples:
   *
   *    const b = [1, 2, 3, 4, 5]
   *    math.subset(b, math.index([1, 2, 3]))                         // returns [2, 3, 4]
   *    math.subset(b, math.index([false, true, true, true, false]))  // returns [2, 3, 4]
   *
   *    const a = math.matrix([[1, 2], [3, 4]])
   *    a.subset(math.index(0, 1))             // returns 2
   *    a.subset(math.index(0, [false, true])) // returns [[2]]
   *
   * See also:
   *
   *    bignumber, boolean, complex, matrix, number, string, unit
   *
   * History:
   *
   *    v?      Created
   *    v2      Dropped support for `[start, end, step]` arguments in favor
   *            of lists of arbitrary values; added support for Range
   *            objects.
   *    v11.10  Added support for arrays of booleans as indices.
   *
   * @param {...*} ranges   Zero or more ranges or numbers.
   * @return {Index}        Returns the created index
   */
  return typed(name, {
    '...number | string | BigNumber | Range | Array | Matrix': function (args) {
      const ranges = args.map(function (arg) {
        if (isBigNumber(arg)) {
          return arg.toNumber() // convert BigNumber to Number
        } else if (isArray(arg) || isMatrix(arg)) {
          return arg.map(function (elem) {
            // convert BigNumber to Number
            return isBigNumber(elem) ? elem.toNumber() : elem
          })
        } else {
          return arg
        }
      })

      const res = new Index()
      Index.apply(res, ranges)
      return res
    }
  })
})
