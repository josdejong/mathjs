import { factory } from '../../utils/factory'
import { errorTransform } from './utils/errorTransform'
import { createSubset } from '../../function/matrix/subset'

const name = 'subset'
const dependencies = ['typed', 'matrix']

export const createSubsetTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  const subset = createSubset({ typed, matrix })

  /**
   * Attach a transform function to math.subset
   * Adds a property transform containing the transform function.
   *
   * This transform creates a range which includes the end value
   */
  return typed('subset', {
    '...any': function (args) {
      try {
        return subset.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
