import {
  isArray, isBigInt, isBigNumber, isMatrix, isNumber, isRange
} from '../../utils/is.js'
import { factory } from '../../utils/factory.js'

const name = 'index'
export const dependencies = ['Index', 'Range', 'number', 'getMatrixDataType']

export const createIndexTransform = /* #__PURE__ */ factory(name, dependencies, ({ Index, Range, number, getMatrixDataType }) => {
  /**
   * Attach a transform function to math.index
   * Adds a property transform containing the transform function.
   *
   * This transform creates a one-based index instead of a zero-based index
   */
  return function indexTransform () {
    const args = []
    for (let i = 0, ii = arguments.length; i < ii; i++) {
      let arg = arguments[i]

      // change from one-based to zero based, convert BigNumber to number and leave Array of Booleans as is
      if (isRange(arg)) {
        arg = new Range({
          start: number(arg.start) - 1,
          length: arg.length,
          step: number(arg.step)
        })
      } else if (arg && arg.isSet === true) {
        arg = arg.map(function (v) { return v - 1 })
      } else if (isArray(arg) || isMatrix(arg)) {
        if (getMatrixDataType(arg) !== 'boolean') {
          arg = arg.map(function (v) { return v - 1 })
        }
      } else if (isNumber(arg) || isBigInt(arg)) {
        arg--
      } else if (isBigNumber(arg)) {
        arg = arg.toNumber() - 1
      } else if (typeof arg === 'string') {
        // leave as is, will be interpreted later
      } else {
        throw new TypeError('Dimension must be an Array, Matrix, number, bigint, string, or Range')
      }

      args[i] = arg
    }

    const res = new Index()
    Index.apply(res, args)
    res.includeEnd = true
    res.shiftPosition = 1
    return res
  }
}, { isTransformFunction: true })
