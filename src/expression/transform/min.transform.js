import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import { createMin } from '../../function/statistics/min.js'
import { lastDimToZeroBase } from './utils/lastDimToZeroBase.js'

const name = 'min'
const dependencies = ['typed', 'config', 'numeric', 'smaller', 'isNaN']

export const createMinTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, numeric, smaller, isNaN: mathIsNaN }) => {
  const min = createMin({ typed, config, numeric, smaller, isNaN: mathIsNaN })

  /**
   * Attach a transform function to math.min
   * Adds a property transform containing the transform function.
   *
   * This transform changed the last `dim` parameter of function min
   * from one-based to zero based
   */
  return typed('min', {
    '...any': function (args) {
      args = lastDimToZeroBase(args)

      try {
        return min.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
