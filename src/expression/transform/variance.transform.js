import { factory } from '../../utils/factory'
import { isBigNumber, isCollection, isNumber } from '../../utils/is'
import { errorTransform } from './utils/errorTransform'
import { createVariance } from '../../function/statistics/variance'

const name = 'variance'
const dependencies = ['typed', 'add', 'subtract', 'multiply', 'divide', 'apply', 'isNaN']

/**
 * Attach a transform function to math.var
 * Adds a property transform containing the transform function.
 *
 * This transform changed the `dim` parameter of function var
 * from one-based to zero based
 */
export const createVarianceTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, subtract, multiply, divide, apply, isNaN }) => {
  const variance = createVariance({ typed, add, subtract, multiply, divide, apply, isNaN })

  return typed(name, {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length >= 2 && isCollection(args[0])) {
        const dim = args[1]
        if (isNumber(dim)) {
          args[1] = dim - 1
        } else if (isBigNumber(dim)) {
          args[1] = dim.minus(1)
        }
      }

      try {
        return variance.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
