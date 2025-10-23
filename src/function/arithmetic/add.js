import { factory } from '../../utils/factory.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo04xSidSid } from '../../type/matrix/utils/matAlgo04xSidSid.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'add'
const dependencies = [
  'typed',
  'addScalar',
  'equalScalar',
  'DenseMatrix',
  'SparseMatrix'
]

export const createAdd = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed, addScalar, equalScalar, DenseMatrix, SparseMatrix, math, concat }) => {
    const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
    const matAlgo04xSidSid = createMatAlgo04xSidSid({ typed, equalScalar })
    const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
    const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, DenseMatrix })
    /**
     * Add two or more values, `x + y`.
     * For matrices, the function is evaluated element wise.
     *
     * Syntax:
     *
     *    math.add(x, y)
     *    math.add(x, y, z, ...)
     *
     * Examples:
     *
     *    math.add(2, 3)               // returns number 5
     *    math.add(2, 3, 4)            // returns number 9
     *
     *    const a = math.complex(2, 3)
     *    const b = math.complex(-4, 1)
     *    math.add(a, b)               // returns Complex -2 + 4i
     *
     *    math.add([1, 2, 3], 4)       // returns Array [5, 6, 7]
     *
     *    const c = math.unit('5 cm')
     *    const d = math.unit('2.1 mm')
     *    math.add(c, d)               // returns Unit 52.1 mm
     *
     *    math.add("2.3", "4")         // returns number 6.3
     *
     * See also:
     *
     *    subtract, sum
     *
     * @param  {number | BigNumber | bigint | Fraction | Complex | Unit | Array | Matrix} x First value to add
     * @param  {number | BigNumber | bigint | Fraction | Complex | Unit | Array | Matrix} y Second value to add
     * @return {number | BigNumber | bigint | Fraction | Complex | Unit | Array | Matrix} Sum of `x` and `y`
     */
    return typed(
      name,
      {
        'any, any': addScalar,

        'any, any, ...any': typed.referToSelf(self => (x, y, rest) => {
          let result = self(x, y)

          for (let i = 0; i < rest.length; i++) {
            result = self(result, rest[i])
          }

          return result
        }),
        'Range, Range': typed.referToSelf(self => (r, p) => {
          if (r.for !== p.for) throw new Error('Range length mismatch')
          return r.createRange({
            from: self(r.from, p.from),
            for: r.for,
            by: self(r.by, p.by)
          })
        }),
        'Range, Matrix': typed.referToSelf(
          self => (r, m) => self(r.valueOf(), m)),
        'Range, any': typed.referToSelf(self => (r, s) => r.createRange({
          from: self(r.from, s),
          for: r.for,
          by: r.by
        })),
        'Matrix, Range': typed.referToSelf(
          self => (m, r) => self(m, r.valueOf())),
        'any, Range': typed.referToSelf(self => (s, r) => r.createRange({
          from: self(s, r.from),
          for: r.for,
          by: r.by
        }))
      },
      matrixAlgorithmSuite({
        elop: addScalar,
        DS: matAlgo01xDSid,
        SS: matAlgo04xSidSid,
        Ss: matAlgo10xSids
      })
    )
  })
