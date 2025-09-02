import { factory } from '../../utils/factory.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { DimensionError } from '../../error/DimensionError.js'

const name = 'nullish'
const dependencies = ['typed', 'matrix']

export const createNullish = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed, matrix }) => {
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

    // Helper function to check if a value is nullish
    const isNullish = (x) => x == null || x === undefined

    const returnLeftIfSameSize = (x, y) => {
      const xs = x.size()
      const ys = y.size()
      if (xs.length !== ys.length) {
        throw new DimensionError(xs.length, ys.length)
      }
      for (let i = 0; i < xs.length; i++) {
        if (xs[i] !== ys[i]) {
          throw new DimensionError(xs, ys)
        }
      }
      return x
    }

    return typed(
      name,
      {
        // Scalar handlers
        'number|bigint|Complex|BigNumber|Fraction|Unit|string|boolean|SparseMatrix, any': (x, _y) => x,
        'null, any': (_x, y) => y,
        'undefined, any': (_x, y) => y,

        // Matrix-aware overloads and array bridging (no broadcasting)
        'DenseMatrix, any': typed.referToSelf(self => (x, y) =>
          // element-wise evaluation over dense with scalar/array-like
          matAlgo14xDs(x, y, self, false)
        ),

        'SparseMatrix, DenseMatrix': (x, y) => returnLeftIfSameSize(x, y),
        'SparseMatrix, Array': (x, y) => returnLeftIfSameSize(x, matrix(y)),

        'any, SparseMatrix': (x, y) => (isNullish(x) ? y : x),
        'any, DenseMatrix': (x, y) => (isNullish(x) ? y : x),

        'Array, any': typed.referToSelf(self => (x, y) => self(matrix(x), y).valueOf()),
        'any, Array': typed.referToSelf(self => (x, y) => self(x, matrix(y)).valueOf()),

        // Dense-Dense without broadcasting
        'DenseMatrix, DenseMatrix': typed.referToSelf(self => (x, y) => matAlgo13xDD(x, y, self)),
        'Array, Array': typed.referToSelf(self => (x, y) => matAlgo13xDD(matrix(x), matrix(y), self).valueOf()),
        'Array, DenseMatrix': typed.referToSelf(self => (x, y) => matAlgo13xDD(matrix(x), y, self).valueOf()),
        'DenseMatrix, Array': typed.referToSelf(self => (x, y) => matAlgo13xDD(x, matrix(y), self).valueOf()),

        // Dense-Sparse elementwise
        'DenseMatrix, SparseMatrix': typed.referToSelf(self => (x, y) => matAlgo03xDSf(x, y, self, false)),
        'Array, SparseMatrix': typed.referToSelf(self => (x, y) => matAlgo03xDSf(matrix(x), y, self, false))
      }
    )
  }
)
