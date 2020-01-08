import { errorTransform } from './utils/errorTransform'
import { factory } from '../../utils/factory'
import { createApply } from '../../function/matrix/apply'
import { isBigNumber, isNumber } from '../../utils/is'

const name = 'apply'
const dependencies = ['typed', 'isInteger']

/**
 * Attach a transform function to math.apply
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function apply
 * from one-based to zero based
 */
export const createApplyTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, isInteger }) => {
  const apply = createApply({ typed, isInteger })

  // @see: comment of concat itself
  return typed('apply', {
    '...any': function (args) {
      // change dim from one-based to zero-based
      const dim = args[1]

      if (isNumber(dim)) {
        args[1] = dim - 1
      } else if (isBigNumber(dim)) {
        args[1] = dim.minus(1)
      }

      try {
        return apply.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
