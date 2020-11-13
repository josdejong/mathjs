import { isBigNumber, isCollection, isNumber } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import { createMin } from '../../function/statistics/min.js'

const name = 'min'
const dependencies = ['typed', 'config', 'numeric', 'smaller']

export const createMinTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, numeric, smaller }) => {
  const min = createMin({ typed, config, numeric, smaller })

  /**
   * Attach a transform function to math.min
   * Adds a property transform containing the transform function.
   *
   * This transform changed the last `dim` parameter of function min
   * from one-based to zero based
   */
  return typed('min', {
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
        return min.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
