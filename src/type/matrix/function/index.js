import { isBigNumber, isMatrix, isArray, isRange } from '../../../utils/is.js'
import { factory } from '../../../utils/factory.js'

const name = 'index'
const dependencies = ['typed', 'Index', 'number', 'Range']

export const createIndex = /* #__PURE__ */ factory(name, dependencies, ({ typed, Index, number, Range }) => {
  /**
   * Create an Index. An Index can store a single position, a range of
   * positions, or an arbitrary collection of positions, for each of possibly
   * multiple dimensions. This sort of Index can be used to specify some entry
   * or entries of a Matrix or Array, in which case the number of dimensions
   * of the Index must equal the number of dimensions of the Matrix/Array.
   * An Index can also store a single string for accessing a (plain JavaScript)
   * object -- even if the object is nested, each layer must be indexed
   * separately.
   *
   * Currently, the only place that Index values are used is in the
   * `math.subset()` function (which see) to specify the collection of entries
   * to be retrieved or replaced.
   *
   * Syntax:
   *
   *     math.index(dim1, dim2, ...)
   *
   * where each dimension specifier can be any of:
   *
   * - A natural number (indicating just the one position that should be used
   *   along that dimension).
   * - A **one**-dimensional Array or Matrix of natural numbers, listing the
   *   positions that should be used along that dimension. Note that repeated
   *   positions are supported, although _replacing_ a subset when the index
   *   has repeated positions may produce somewhat unintuitive results.
   *   For this option, the specifier will commonly be a Range (a Matrix
   *   with entries given by start, step, and end values), since often one
   *   wants a block of consecutive positions.
   * - A one-dimensional Array or Matrix of booleans, in which case the
   *   positions in which `true` values appear are selected.
   * - A string. In this case, if the Index is used to access a Matrix or
   *   Array, the string will be interpreted as a Range specification in
   *   the form `'start:end'` or `start:step:end`. On the other hand, if it
   *   is used to access a (plain JavaScript) object, the string value will
   *   be used directly.
   *
   * When used via the JavaScript API, the values in an Index are
   * interpreted as zero-based positions, and Ranges exclude their endpoints.
   * Conversely, when using `math.evaluate()` to compute a value from a string
   * expression, Index positions are one-based, and Ranges include their
   * endpoints.
   *
   * Examples:
   *
   *    const b = [1, 2, 3, 4, 5]
   *    math.subset(b, math.index([1, 2, 3]))                         // returns [2, 3, 4] ...
   *    math.subset(b, math.index([false, true, true, true, false]))  // returns [2, 3, 4]
   *
   *    const a = math.matrix([[1, 2], [3, 4]])
   *    a.subset(math.index(0, 1))             // returns 2 ...
   *    a.subset(math.index(0, [false, true])) // Matrix [2]
   *    math.evaluate('subset([1, 2; 3, 4], index(1, 2))') // returns 2
   *
   * See also:
   *
   *    subset, range, matrix
   *
   * @param {...*} ranges
   *     Zero or more numbers, 1-D matrices (often ranges), or strings.
   * @return {Index}        Returns the created index
   */
  return typed(name, {
    '...number | string | BigNumber | Range | Array | Matrix': function (args) {
      const ranges = args.map(function (arg) {
        if (isBigNumber(arg)) {
          return arg.toNumber() // convert BigNumber to Number
        } else if (isRange(arg)) {
          if (arg.datatype() !== 'number') {
            return new Range({
              from: number(arg.from), by: number(arg.by), for: arg.for
            })
          } else return arg
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
