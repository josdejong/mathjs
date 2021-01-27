import { factory } from '../../utils/factory.js'
import { errorTransform } from './utils/errorTransform.js'
import { createDiff } from '../../function/matrix/diff.js'
import { lastDimToZeroBase } from './utils/lastDimToZeroBase.js'

const name = 'diff'
const dependencies = ['typed', 'matrix', 'subtract', 'number', 'bignumber']

export const createDiffTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, subtract, number, bignumber }) => {
  const diff = createDiff({ typed, matrix, subtract, number, bignumber })

  /**
   * Attach a transform function to math.diff
   * Adds a property transform containing the transform function.
   *
   * This transform creates a range which includes the end value
   */
  return typed(name, {
    '...any': function (args) {
      args = lastDimToZeroBase(args)

      try {
        return diff.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
