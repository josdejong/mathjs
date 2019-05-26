import { errorTransform } from './utils/errorTransform'
import { factory } from '../../utils/factory'
import { createColumn } from '../../function/matrix/column'
import { isNumber } from '../../utils/is'

const name = 'column'
const dependencies = ['typed', 'Index', 'matrix', 'range']

/**
 * Attach a transform function to matrix.column
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `index` parameter of function column
 * from zero-based to one-based
 */
export const createColumnTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, Index, matrix, range }) => {
  const column = createColumn({ typed, Index, matrix, range })

  // @see: comment of column itself
  return typed('column', {
    '...any': function (args) {
      // change last argument from zero-based to one-based
      const lastIndex = args.length - 1
      const last = args[lastIndex]
      if (isNumber(last)) {
        args[lastIndex] = last - 1
      }

      try {
        return column.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}, { isTransformFunction: true })
