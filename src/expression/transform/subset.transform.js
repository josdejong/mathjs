'use strict'

import { factory } from '../../utils/factory'
import { errorTransform } from './utils/errorTransform'

const name = 'expression.transform.subset'
const dependencies = ['typed', 'subset']

export const createSubsetTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, subset }) => {
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
