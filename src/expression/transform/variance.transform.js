import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import { createVariance } from '../../function/statistics/variance.js'
import { lastDimToZeroBase } from './utils/lastDimToZeroBase.js'
import { dimToZeroBase, isNumberOrBigNumber } from './utils/dimToZeroBase.js'
import { isCollection } from '../../utils/is.js'

const name = 'variance'
const dependencies = ['typed', 'add', 'subtract', 'multiply', 'divide', 'mapSlices', 'isNaN']

/**
 * Attach a transform function to math.var
 * Adds a property transform containing the transform function.
 *
 * This transform changed the `dim` parameter of function var
 * from one-based to zero based
 */
export const createVarianceTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, subtract, multiply, divide, mapSlices, isNaN: mathIsNaN }) => {
  const variance = createVariance({ typed, add, subtract, multiply, divide, mapSlices, isNaN: mathIsNaN })

  return typed(name, {
    '...any': function (args) {
      if (args.length === 3 && isCollection(args[0]) && isNumberOrBigNumber(args[1])) {
        // variance(A, dimension, normalization)
        args = [args[0], dimToZeroBase(args[1]), args[2]]
      } else {
        args = lastDimToZeroBase(args)
      }

      try {
        return variance.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
