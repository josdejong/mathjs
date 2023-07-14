import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import { createSubset } from '../../function/matrix/subset.js'

const name = 'subset'
const dependencies = ['typed', 'matrix', 'config']

export const createSubsetTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, config }) => {
  const subset = createSubset({ typed, matrix, config })

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
