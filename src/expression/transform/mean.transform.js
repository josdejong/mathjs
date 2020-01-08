import { isBigNumber, isCollection, isNumber } from '../../utils/is'
import { factory } from '../../utils/factory'
import { errorTransform } from './utils/errorTransform'
import { createMean } from '../../function/statistics/mean'

const name = 'mean'
const dependencies = ['typed', 'add', 'divide']

export const createMeanTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, divide }) => {
  const mean = createMean({ typed, add, divide })

  /**
   * Attach a transform function to math.mean
   * Adds a property transform containing the transform function.
   *
   * This transform changed the last `dim` parameter of function mean
   * from one-based to zero based
   */
  return typed('mean', {
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
        return mean.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
