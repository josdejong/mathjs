import { isBigNumber, isCollection, isNumber } from '../../utils/is'
import { factory } from '../../utils/factory'
import { errorTransform } from './utils/errorTransform'
import { createDiff } from '../../function/matrix/diff'

const name = 'diff'
const dependencies = ['typed', 'matrix', 'subtract', 'number', 'bignumber']

export const createDiffTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, subtract, number, bignumber }) => {
  const diff = createDiff({ typed, matrix, subtract, number, bignumber })

  /**
   * Attach a transform function to math.diff
   * Adds a property transform containing the transform function.
   *
   * This transform creates a range which includes the end value
   */
  return typed(name, {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length === 2 && isCollection(args[0])) {
        const dim = args[1]
        if (isNumber(dim)) {
          args[1] = dim - 1
        } else if (isBigNumber(dim)) {
          args[1] = dim.minus(1)
        }
      }

      try {
        return diff.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
