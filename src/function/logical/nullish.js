import { factory } from '../../utils/factory.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo05xSfSf } from '../../type/matrix/utils/matAlgo05xSfSf.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'

const name = 'nullish'
const dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix']

export const createNullish = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed, matrix, equalScalar, DenseMatrix }) => {
    const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
    const matAlgo05xSfSf = createMatAlgo05xSfSf({ typed, equalScalar })
    const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
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
     *    math.nullish(obj.baz, 0)      // returns 0 (undefined ?? 0)
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

    return typed(
      name,
      {
        // Scalar handlers
        'number, any': (x, y) => (isNullish(x) ? y : x),
        'bigint, any': (x, y) => (isNullish(x) ? y : x),
        'Complex, any': (x, y) => (isNullish(x) ? y : x),
        'BigNumber, any': (x, y) => (isNullish(x) ? y : x),
        'Fraction, any': (x, y) => (isNullish(x) ? y : x),
        'Unit, any': (x, y) => (isNullish(x) ? y : x),
        'string, any': (x, y) => (isNullish(x) ? y : x),
        'boolean, any': (x, y) => (isNullish(x) ? y : x),
        'null, any': (x, y) => y,
        'undefined, any': (x, y) => y,

        // Matrix-aware overloads and array bridging (no broadcasting)
        'DenseMatrix, any': typed.referToSelf(self => (x, y) =>
          // element-wise evaluation over dense with scalar/array-like
          matAlgo14xDs(x, y, self, false)
        ),

        'SparseMatrix, any': typed.referToSelf(self => (x, y) =>
          // element-wise evaluation over sparse with scalar/array-like
          matAlgo12xSfs(x, y, self, false)
        ),

        // Left SparseMatrix with right Dense/Array: sizes must match; zeros are not nullish -> return left
        'SparseMatrix, DenseMatrix': (x, y) => {
          const xs = x.size()
          const ys = y.size()
          if (xs.length !== ys.length || xs.some((v, i) => v !== ys[i])) {
            throw new RangeError('Dimension mismatch. Matrix A (' + xs + ') must match Matrix B (' + ys + ')')
          }
          return x
        },

        'SparseMatrix, Array': (x, y) => {
          const ym = matrix(y)
          const xs = x.size()
          const ys = ym.size()
          if (xs.length !== ys.length || xs.some((v, i) => v !== ys[i])) {
            throw new RangeError('Dimension mismatch. Matrix A (' + xs + ') must match Matrix B (' + ys + ')')
          }
          return x
        },

        'any, SparseMatrix': (x, y) => {
          // short-circuit: if left is not nullish, return it; else return the matrix as-is
          return isNullish(x) ? y : x
        },

        'any, DenseMatrix': (x, y) => {
          // short-circuit: if left is not nullish, return it; else return the matrix as-is
          return isNullish(x) ? y : x
        },

        'Array, any': typed.referToSelf(self => (x, y) => self(matrix(x), y).valueOf()),
        'any, Array': typed.referToSelf(self => (x, y) => self(x, matrix(y)).valueOf()),

        // Dense-Dense without broadcasting
        'DenseMatrix, DenseMatrix': typed.referToSelf(self => (x, y) => {
          const xs = x.size()
          const ys = y.size()
          if (xs.length !== ys.length || xs.some((v, i) => v !== ys[i])) {
            throw new RangeError('Dimension mismatch. Matrix A (' + xs + ') must match Matrix B (' + ys + ')')
          }
          return matAlgo13xDD(x, y, self)
        }),
        'Array, Array': typed.referToSelf(self => (x, y) => {
          const xm = matrix(x)
          const ym = matrix(y)
          const xs = xm.size()
          const ys = ym.size()
          if (xs.length !== ys.length || xs.some((v, i) => v !== ys[i])) {
            throw new RangeError('Dimension mismatch. Matrix A (' + xs + ') must match Matrix B (' + ys + ')')
          }
          return matAlgo13xDD(xm, ym, self).valueOf()
        }),
        'Array, DenseMatrix': typed.referToSelf(self => (x, y) => {
          const xm = matrix(x)
          const xs = xm.size()
          const ys = y.size()
          if (xs.length !== ys.length || xs.some((v, i) => v !== ys[i])) {
            throw new RangeError('Dimension mismatch. Matrix A (' + xs + ') must match Matrix B (' + ys + ')')
          }
          return matAlgo13xDD(xm, y, self)
        }),
        'DenseMatrix, Array': typed.referToSelf(self => (x, y) => {
          const ym = matrix(y)
          const xs = x.size()
          const ys = ym.size()
          if (xs.length !== ys.length || xs.some((v, i) => v !== ys[i])) {
            throw new RangeError('Dimension mismatch. Matrix A (' + xs + ') must match Matrix B (' + ys + ')')
          }
          return matAlgo13xDD(x, ym, self)
        }),

        // Sparse-Sparse elementwise
        'SparseMatrix, SparseMatrix': typed.referToSelf(self => (x, y) => matAlgo05xSfSf(x, y, self, false)),
        // Dense-Sparse elementwise
        'DenseMatrix, SparseMatrix': typed.referToSelf(self => (x, y) => matAlgo03xDSf(x, y, self, false)),
        'Array, SparseMatrix': typed.referToSelf(self => (x, y) => matAlgo03xDSf(matrix(x), y, self, false))
      }
    )
  }
)
