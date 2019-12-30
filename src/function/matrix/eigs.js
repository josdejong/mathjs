//  import { clone } from '../../utils/object'
import { factory } from '../../utils/factory'
import { format } from '../../utils/string'

const name = 'eigs'
const dependencies = ['typed', 'matrix']

export const createEigs = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  /**
   * Compute eigenvalue and eigenvector of a real symmetric matrix.
   * Only applicable to two dimensional symmetric matrices. Uses Jacobi
   * Algorithm.
   *
   * Syntax:
   *
   *     math.eigs(x)
   *
   * Examples:
   *
   *     const A = [[1, 1], [1, 1]]
   *     math.eigs(A)               // returns {eigval: [0, 2],eigvec:[[0.5, -0.5],[0.5, 0.5]]}
   *
   * See also:
   *
   *     inv
   *
   * @param {Array | Matrix} x  Matrix to be diagonalized
   * @return {Array | Matrix}   The obtect containing eigenvalues and eigenvectors
   */
  const eigs = typed('eigs', {

    Array: function (x) {
      // check array size
      const mat = matrix(x)
      const size = mat.size()
      if (size.length !== 2 || size[0] !== size[1]) {
        throw new RangeError('Matrix must be square ' +
          '(size: ' + format(size) + ')')
      }

      // use dense 2D matrix implementation
      return diag(x)
    },

    Matrix: function (x) {
      // use dense 2D array implementation
      // dense matrix
      const size = x.size()
      if (size.length !== 2 || size[0] !== size[1]) {
        throw new RangeError('Matrix must be square ' +
          '(size: ' + format(size) + ')')
      }

      return diag(x.toArray())
    }
  })

  // diagonalization implementation
  function diag (x, precision = 1E-12) {
    const N = len(x)
    let Ei = Array(N) // eigenvalues
    const e0 =  Math.abs(precision/N)
    let Sij = new Array(N);
    // Sij is Identity Matrix
    for (let i = 0; i<N;i++){
      Sij[i] = Array(N).fill(0)
      Sij[i][i] = 1.0;
    }
    // initial error 
    let Vab = getAij(x); 
    while (Math.abs(Vab[1]) >= Math.abs(e0)){
      let i =  Vab[0][0];
      let j =  Vab[0][1];
      let psi = getTheta(x[i][i], x[j][j], x[i][j]); 
      x = x1(x,psi,i,j);
      Sij = Sij1(Sij,psi,i,j);
      Vab = getAij(x); 
    }
    for (let i = 0; i<N;i++){
      Ei[i] = Hij[i][i]; 
    }
    return [Ei,Sij]
  }

  // Rotation Matrix
  function Rot (theta) {
    let s = Math.sin(theta);
    let c = Math.cos(theta);
    let Mat = [[c,s],[-s,c]];
    return Mat
  }

  // get angle
  function getTheta (aii, ajj, aij) {
    let  th = 0.0 
    let denom = (ajj - aii);
    if (Math.abs(denom) <= 1E-14){
      th = Math.PI/4.0
    }
    else {
      th = 0.5 * Math.atan(2.0 * aij / (ajj - aii) ) 
    }
    return th 
  }
  
  function Sij1 (Sij, theta,i,j) {
    let N = Sij.length;
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    let Ski =  new Array(N).fill(0);
    let Skj =  new Array(N).fill(0);
    for (var k=0; k<N; k++){
        Ski[k] = c * Sij[k][i] - s * Sij[k][j];
        Skj[k] = s * Sij[k][i] + c * Sij[k][j];
    }
    for (var k=0; k<N; k++){
        Sij[k][i] =  Ski[k] ;
        Sij[k][j] =  Skj[k] ;
    }
    return Sij;
  }
  return eigs
})
