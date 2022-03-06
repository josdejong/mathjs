import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import { createSum } from '../../function/statistics/sum.js'
import { lastDimToZeroBase } from './utils/lastDimToZeroBase.js'

/**
 * Attach a transform function to math.sum
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function sum
 * from one-based to zero based
 */
const name = 'sum'
const dependencies = ['typed', 'config', 'add', 'numeric']

export const createSumTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, add, numeric }) => {
  const sum = createSum({ typed, config, add, numeric })

  return typed(name, {
    '...any': function (args) {
      args = lastDimToZeroBase(args)

      try {
        return sum.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
