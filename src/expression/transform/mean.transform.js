import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import { createMean } from '../../function/statistics/mean.js'
import { lastDimToZeroBase } from './utils/lastDimToZeroBase.js'

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
      args = lastDimToZeroBase(args)

      try {
        return mean.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
