import { errorTransform } from './utils/errorTransform.js'
import { factory } from '../../utils/factory.js'
import { createMapSlices } from '../../function/matrix/mapSlices.js'
import { isBigNumber, isNumber } from '../../utils/is.js'

const name = 'mapSlices'
const dependencies = ['typed', 'isInteger']

/**
 * Attach a transform function to math.mapSlices
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function mapSlices
 * from one-based to zero based
 */
export const createMapSlicesTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, isInteger }) => {
  const mapSlices = createMapSlices({ typed, isInteger })

  // @see: comment of concat itself
  return typed('mapSlices', {
    '...any': function (args) {
      // change dim from one-based to zero-based
      const dim = args[1]

      if (isNumber(dim)) {
        args[1] = dim - 1
      } else if (isBigNumber(dim)) {
        args[1] = dim.minus(1)
      }

      try {
        return mapSlices.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true, ...createMapSlices.meta })
