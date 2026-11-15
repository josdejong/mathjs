import { factory } from '../../utils/factory.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo07xSSf } from '../../type/matrix/utils/matAlgo07xSSf.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'dotPow'
const dependencies = [
  'typed',
  'equalScalar',
  'matrix',
  'pow',
  'DenseMatrix',
  'SparseMatrix'
]

export const createDotPow = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar, matrix, pow, DenseMatrix, SparseMatrix }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo07xSSf = createMatAlgo07xSSf({ typed, SparseMatrix })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const powScalarSignatures = {}
  for (const signature in pow.signatures) {
    if (Object.prototype.hasOwnProperty.call(pow.signatures, signature)) {
      if (!signature.includes('Matrix') && !signature.includes('Array')) {
        powScalarSignatures[signature] = pow.signatures[signature]
      }
    }
  }
  const powScalar = typed(powScalarSignatures)

  // The zeros of a sparse base only stay zero for a positive exponent:
  // 0 ^ 0 is 1 and 0 ^ -1 is Infinity. In that case every entry has to be
  // evaluated and the result is no longer sparse.
  const matAlgoSs = (x, y, f, inverse) => {
    const keepsZeros = equalScalar(f(0, y), 0)
    const algorithm = keepsZeros ? matAlgo11xS0s : matAlgo12xSfs
    return algorithm(x, y, f, inverse)
  }

  /**
   * Calculates the power of x to y element wise.
   *
   * Syntax:
   *
   *    math.dotPow(x, y)
   *
   * Examples:
   *
   *    math.dotPow(2, 3)            // returns number 8
   *
   *    const a = [[1, 2], [4, 3]]
   *    math.dotPow(a, 2)            // returns Array [[1, 4], [16, 9]]
   *    math.pow(a, 2)               // returns Array [[9, 8], [16, 17]]
   *
   * See also:
   *
   *    pow, sqrt, multiply
   *
   * History:
   *
   *    v14.0.0  Return a sparse matrix for sparse inputs
   *    v11.6    Support matrix broadcasting
   *    v0.23    Renamed from `epow`
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x  The base
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} y  The exponent
   * @return {number | BigNumber | Complex | Unit | Array | Matrix}                     The value of `x` to the power `y`
   */
  return typed(name, matrixAlgorithmSuite({
    elop: powScalar,
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgoSs,
    sS: matAlgo12xSfs
  }))
})
