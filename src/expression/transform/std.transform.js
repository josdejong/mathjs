import { factory } from '../../utils/factory.js'
import { createStd } from '../../function/statistics/std.js'
import { errorTransform } from './utils/errorTransform.js'
import { lastDimToZeroBase } from './utils/lastDimToZeroBase.js'
import { dimToZeroBase, isNumberOrBigNumber } from './utils/dimToZeroBase.js'
import { isCollection } from '../../utils/is.js'

const name = 'std'
const dependencies = ['typed', 'map', 'sqrt', 'variance']

/**
 * Attach a transform function to math.std
 * Adds a property transform containing the transform function.
 *
 * This transform changed the `dim` parameter of function std
 * from one-based to zero based
 */
export const createStdTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, map, sqrt, variance }) => {
  const std = createStd({ typed, map, sqrt, variance })

  return typed('std', {
    '...any': function (args) {
      if (args.length === 3 && isCollection(args[0]) && isNumberOrBigNumber(args[1])) {
        // std(A, dimension, normalization)
        args = [args[0], dimToZeroBase(args[1]), args[2]]
      } else {
        args = lastDimToZeroBase(args)
      }

      try {
        return std.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
