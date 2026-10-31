import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo07xSSf } from '../../type/matrix/utils/matAlgo07xSSf.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { factory } from '../../utils/factory.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { xorNumber } from '../../plain/number/index.js'

const name = 'xor'
const dependencies = [
  'typed',
  'matrix',
  'DenseMatrix',
  'SparseMatrix'
]

export const createXor = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, DenseMatrix, SparseMatrix }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo07xSSf = createMatAlgo07xSSf({ typed, SparseMatrix })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  // the implementation for two arguments
  const xorTwo = typed(
    name,
    {
      'number, number': xorNumber,

      'Complex, Complex': function (x, y) {
        return ((x.re !== 0 || x.im !== 0) !== (y.re !== 0 || y.im !== 0))
      },

      'bigint, bigint': xorNumber,

      'BigNumber, BigNumber': function (x, y) {
        return ((!x.isZero() && !x.isNaN()) !== (!y.isZero() && !y.isNaN()))
      },

      'Unit, Unit': typed.referToSelf(self =>
        (x, y) => self(x.value || 0, y.value || 0))
    },
    matrixAlgorithmSuite({
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    })
  )

  /**
   * Logical `xor`. Test whether one and only one value is defined with a nonzero/nonempty value.
   * With more than two arguments, the function is applied from left to right,
   * so it returns true when an odd number of values is nonzero/nonempty.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.xor(x, y)
   *    math.xor(x, y, z, ...)
   *
   * Examples:
   *
   *    math.xor(2, 4)      // returns false
   *    math.xor(2, 4, 6)   // returns true
   *
   *    a = [2, 0, 0]
   *    b = [2, 7, 0]
   *    c = 0
   *
   *    math.xor(a, b)   // returns [false, true, false]
   *    math.xor(a, c)   // returns [true, false, false]
   *
   * See also:
   *
   *    and, not, or
   *
   * History:
   *
   *    v15.3   Support more than two arguments
   *    v14.0.0 Return a sparse matrix for sparse inputs
   *    v11.6   Support matrix broadcasting
   *    v1.2    Created
   *
   * @param  {number | BigNumber | bigint | Complex | Unit | Array | Matrix} x First value to check
   * @param  {number | BigNumber | bigint | Complex | Unit | Array | Matrix} y Second value to check
   * @param  {...number | BigNumber | bigint | Complex | Unit | Array | Matrix} rest Additional values to check
   * @return {boolean | Array | Matrix}
   *            Returns true when one and only one input is defined with a nonzero/nonempty value.
   */
  return typed(name, {
    'any, any': xorTwo,

    'any, any, ...any': function (x, y, rest) {
      let result = xorTwo(x, y)

      for (let i = 0; i < rest.length; i++) {
        result = xorTwo(result, rest[i])
      }

      return result
    }
  })
})
