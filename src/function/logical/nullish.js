import { factory } from '../../utils/factory.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { DimensionError } from '../../error/DimensionError.js'

const name = 'nullish'
const dependencies = ['typed', 'matrix', 'size', 'flatten', 'deepEqual']

export const createNullish = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed, matrix, size, flatten, deepEqual }) => {
    const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
    const matAlgo14xDs = createMatAlgo14xDs({ typed })
    const matAlgo13xDD = createMatAlgo13xDD({ typed })

    /**
     * Nullish coalescing operator (??). Returns the right-hand side operand
     * when the left-hand side operand is null or undefined, and otherwise
     * returns the left-hand side operand.
     *
     * For matrices, the function is evaluated element wise.
     *
     * Syntax:
     *
     *    math.nullish(x, y)
     *
     * Examples:
     *
     *    math.nullish(null, 42)        // returns 42
     *    math.nullish(undefined, 42)   // returns 42
     *    math.nullish(0, 42)           // returns 0
     *    math.nullish(false, 42)       // returns false
     *    math.nullish('', 42)          // returns ''
     *
     *    // Object property access with fallback
     *    const obj = {foo: 7, bar: 3}
     *    math.nullish(obj.baz, 0)      // returns 0
     *
     * See also:
     *
     *    and, or, not
     *
     * @param  {*} x First value to check
     * @param  {*} y Fallback value
     * @return {*} Returns y when x is null or undefined, otherwise returns x
     */

    return typed(
      name,
      {
        // Scalar and SparseMatrix-first short-circuit handlers
        'number|bigint|Complex|BigNumber|Fraction|Unit|string|boolean|SparseMatrix, any': (x, _y) => x,
        'null, any': (_x, y) => y,
        'undefined, any': (_x, y) => y,

        // SparseMatrix-first with collection RHS: enforce exact shape match
        'SparseMatrix, Array | Matrix': (x, y) => {
          const sx = size(x)
          const sy = size(y)
          if (deepEqual(sx, sy)) return x
          throw new DimensionError(sx, sy)
        },

        // DenseMatrix-first handlers (no broadcasting between collections)
        'DenseMatrix, DenseMatrix': typed.referToSelf(self => (x, y) => matAlgo13xDD(x, y, self)),
        'DenseMatrix, SparseMatrix': typed.referToSelf(self => (x, y) => matAlgo03xDSf(x, y, self, false)),
        'DenseMatrix, Array': typed.referToSelf(self => (x, y) => matAlgo13xDD(x, matrix(y), self)),
        'DenseMatrix, any': typed.referToSelf(self => (x, y) => matAlgo14xDs(x, y, self, false)),

        // Array-first handlers (bridge via matrix() where needed)
        'Array, Array': typed.referToSelf(self => (x, y) => matAlgo13xDD(matrix(x), matrix(y), self).valueOf()),
        'Array, DenseMatrix': typed.referToSelf(self => (x, y) => matAlgo13xDD(matrix(x), y, self)),
        'Array, SparseMatrix': typed.referToSelf(self => (x, y) => matAlgo03xDSf(matrix(x), y, self, false)),
        'Array, any': typed.referToSelf(self => (x, y) => matAlgo14xDs(matrix(x), y, self, false).valueOf())
      }
    )
  }
)
