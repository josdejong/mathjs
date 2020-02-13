import { factory } from '../../utils/factory'
import { format } from '../../utils/string'
import { createRealSymmetric } from './eigs/realSymetric'
import { createComplex } from './eigs/complex'

const name = 'eigs'
const dependencies = [
  'typed',
  'matrix',
  'bignumber',
  'add',
  'addScalar',
  'subtract',
  'multiply',
  'multiplyScalar',
  'abs',
  'equal',
  'larger',
  'atan',
  'cos',
  'sin',
  'inv'
]

export const createEigs = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, addScalar, subtract, equal, abs, larger, atan, cos, sin, multiplyScalar, inv, bignumber, multiply, add }) => {
  /**
   * Compute eigenvalues and eigenvectors of a matrix.
   *
   * Syntax:
   *
   *     math.eigs(x, [prec])
   *
   * Examples:
   *
   *     const H = [[5, 2.3], [2.3, 1]]
   *     const ans = math.eigs(H) // returns {values: [E1,E2...sorted], vectors: [v1,v2.... corresponding vectors]}
   *     const E = ans.values
   *     const U = ans.vectors
   *     const UTxHxU = math.multiply(math.transpose(U), H, U) // rotates H to the eigen-representation
   *     E[0] == UTxHxU[0][0]  // returns true
   *
   * See also:
   *
   *     inv
   *
   * @param {Array | Matrix} x  Matrix to be diagonalized
   * @param {number | BigNumber} [prec] Precision, default value: 1e-15
   * @return {{values: Array, vectors: Array} | {values: Matrix, vectors: Matrix}} Object containing eigenvalues (Array or Matrix) and eigenvectors (2D Array/Matrix).
   */
  const eigs = typed('eigs', {

    'Array': function (x) {
      const mat = matrix(x)
      return computeValuesAndVectors(mat);
    },

    'Array, number|BigNumber': function (x, prec) {
      const mat = matrix(x)
      return computeValuesAndVectors(mat, prec);
    },

    'Matrix': function (mat) {
      return computeValuesAndVectors(mat);
    },

    'Matrix, number|BigNumber': function (mat, prec) {
      return computeValuesAndVectors(mat, prec);
    }
  })

  const doRealSymetric = createRealSymmetric({ addScalar, subtract, equal, abs, atan, cos, sin, multiplyScalar, inv, bignumber, multiply, add });
  const doComplex = createComplex();

  /** @return {boolean} */
  function isSymmetric(arr, N, prec) {

    for (let i = 0; i < N; i++)
      for (let j = i; j < N; j++)
        if ( larger( subtract(arr[i][j], arr[j][i]), prec) )
          return false;

    return true;
  }

  function computeValuesAndVectors(/**@type {Matrix}*/ mat, prec)
  {
    if (prec === undefined)
      prec = 1e-14;

    const size = mat.size();

    if (size.length !== 2 || size[0] !== size[1]) {
      throw new RangeError('Matrix must be square (size: ' + format(size) + ')')
    }

    const arr = mat.toArray();
    const N = size[0];

    if (isSymmetric(arr, N, prec))
      return doRealSymetric(mat, N, prec)

    return doComplex(mat, prec);
  }

  return eigs;
})