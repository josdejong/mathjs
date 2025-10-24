import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import { createSubset, dependencies } from '../../function/matrix/subset.js'

const name = 'subset'

export const createSubsetTransform = /* #__PURE__ */ factory(name, dependencies, provided => {
  const subset = createSubset(provided)

  /**
   * Attach a transform function to math.subset
   * Adds a property transform containing the transform function.
   *
   * This transform creates a range which includes the end value
   */
  return provided.typed('subset', {
    '...any': function (args) {
      try {
        return subset.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
