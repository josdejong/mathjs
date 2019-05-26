import { isBigNumber, isNumber } from '../../utils/is'
import { errorTransform } from './utils/errorTransform'
import { factory } from '../../utils/factory'
import { createConcat } from '../../function/matrix/concat'

const name = 'concat'
const dependencies = ['typed', 'matrix', 'isInteger']

export const createConcatTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, isInteger }) => {
  const concat = createConcat({ typed, matrix, isInteger })

  /**
   * Attach a transform function to math.range
   * Adds a property transform containing the transform function.
   *
   * This transform changed the last `dim` parameter of function concat
   * from one-based to zero based
   */
  return typed('concat', {
    '...any': function (args) {
      // change last argument from one-based to zero-based
      const lastIndex = args.length - 1
      const last = args[lastIndex]
      if (isNumber(last)) {
        args[lastIndex] = last - 1
      } else if (isBigNumber(last)) {
        args[lastIndex] = last.minus(1)
      }

      try {
        return concat.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
