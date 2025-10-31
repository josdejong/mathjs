import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo07xSSf } from '../../type/matrix/utils/matAlgo07xSSf.js'
import { factory } from '../../utils/factory.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { norNumber } from '../../plain/number/logical.js'

const name = 'nor'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'SparseMatrix',
  'DenseMatrix',
  'concat'
]

export const createNor = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, SparseMatrix, DenseMatrix, concat }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo07xSSf = createMatAlgo07xSSf({ typed, SparseMatrix })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix, concat })

  /**
   * Logical `nor`. Test if both of values are defined with zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.nor(x, y)
   *
   * Examples:
   *
   *    math.nor(2, 4)   // returns false
   *
   *    a = [2, 5, 0]
   *    b = [0, 22, 0]
   *    c = 0
   *
   *    math.nor(a, b)   // returns [false, false, true]
   *    math.nor(b, c)   // returns [true, false, true]
   *
   * See also:
   *
   *    and, nand, or, not, xor
   *
   * @param  {number | BigNumber | bigint | Complex | Unit | Array | Matrix} x First value to check
   * @param  {number | BigNumber | bigint | Complex | Unit | Array | Matrix} y Second value to check
   * @return {boolean | Array | Matrix}
   *            Returns true when both inputs are zero
   */
  return typed(
    name,
    {
      'number, number': norNumber,

      'Complex, Complex': function (x, y) {
        return !((x.re !== 0 || x.im !== 0) || (y.re !== 0 || y.im !== 0))
      },

      'BigNumber, BigNumber': function (x, y) {
        return !((!x.isZero() && !x.isNaN()) || (!y.isZero() && !y.isNaN()))
      },

      'bigint, bigint': norNumber,

      'Unit, Unit': typed.referToSelf(self =>
        (x, y) => self(x.value || 0, y.value || 0))
    },
    matrixAlgorithmSuite({
      SS: matAlgo07xSSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    })
  )
})
