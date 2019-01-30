'use strict'

import { isBigNumber, isNumber } from '../../utils/is'
import { errorTransform } from './errorTransform'
import { factory } from '../../utils/factory'

const name = 'expression.transform.concat'
const dependencies = ['typed', 'concat']

export const createConcatTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, concat }) => {
  /**
   * Attach a transform function to math.range
   * Adds a property transform containing the transform function.
   *
   * This transform changed the last `dim` parameter of function concat
   * from one-based to zero based
   */
  return typed('concat', {
    '...any': function (args) {
      // change last argument from one-based to zero-based
      const lastIndex = args.length - 1
      const last = args[lastIndex]
      if (isNumber(last)) {
        args[lastIndex] = last - 1
      } else if (isBigNumber(last)) {
        args[lastIndex] = last.minus(1)
      }

      try {
        return concat.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
