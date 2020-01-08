import { clone } from '../../utils/object'
import { factory } from '../../utils/factory'
import { format } from '../../utils/string'

const name = 'eigs'
const dependencies = ['typed', 'matrix', 'typeOf', 'add', 'equal', 'subtract', 'abs', 'atan', 'cos', 'sin']

export const createEigs = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, typeOf, add, subtract, equal, abs, atan, cos, sin }) => {
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
   *     const H = [[5, 2.3], [2.3, 1]]
   *     const [E, U] = math.eigs(H) // E  is an array of sorted eigenvalues and U is the corresponding eigenvectors
   *     const UTxHxU = math.multiply(math.transpose(U), H, U) // rotates H to the eigen-representation
   *     E[0] == UTxHxU[0][0]  // returns true
   * See also:
   *
   *     inv
   *
   * @param {Array | Matrix} x  Matrix to be diagonalized
   * @return {Array | Array} Array containing eigenvalues (Array) and eigenvectors (2D Array).
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
      return checkAndSubmit(clone(x), size[0])
    },

    Matrix: function (x) {
      // use dense 2D array implementation
      // dense matrix
      const size = x.size()
      if (size.length !== 2 || size[0] !== size[1]) {
        throw new RangeError('Matrix must be square ' +
          '(size: ' + format(size) + ')')
      }

      return checkAndSubmit(x.toArray(), size[0])
    }
  })

  // check input for possible problems
  // and perform diagonalization efficiently for
  // specific type of number
  function checkAndSubmit (x, n) {
    let type = typeOf(x[0][0])
    if (type !== 'number' && type !== 'Fraction' && type !== 'BigNumber') {
      throw new TypeError('Matrix element type not supported (' + type + ')')
    }
    // check if matrix is symmetric and what is the type of elements
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        // not symmtric
        if (!equal(x[i][j], x[j][i])) {
          throw new TypeError('Input matrix is not symmetric')
        }
        // not same type
        const thisType = typeOf(x[i][j])
        if (type !== thisType) {
          type = 'mixed'
          throw new TypeError('Mixed matrix element type is not supported')
        }
      }
    }
    // perform efficient calculation for 'numbers'
    if (type === 'number') {
      return diag(x)
    } else if (type === 'Fraction') {
      // convert fraction to numbers
      for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
          x[i][j] = x[i][j].valueOf()
          x[j][i] = x[i][j]
        }
      }
      return diag(x)
    } else {
      throw new TypeError('Elements type not supported')
    }
  }

  // diagonalization implementation for number (efficient)
  function diag (x, precision = 1E-12) {
    const N = x.length
    const e0 = Math.abs(precision / N)
    let psi
    var Sij = new Array(N)
    // Sij is Identity Matrix
    for (let i = 0; i < N; i++) {
      Sij[i] = Array(N).fill(0)
      Sij[i][i] = 1.0
    }
    // initial error
    let Vab = getAij(x)
    while (Math.abs(Vab[1]) >= Math.abs(e0)) {
      const i = Vab[0][0]
      const j = Vab[0][1]
      psi = getTheta(x[i][i], x[j][j], x[i][j])
      x = x1(x, psi, i, j)
      Sij = Sij1(Sij, psi, i, j)
      Vab = getAij(x)
    }
    var Ei = Array(N).fill(0) // eigenvalues
    for (let i = 0; i < N; i++) {
      Ei[i] = x[i][i]
    }
    return sorting(clone(Ei), clone(Sij))
  }

    // diagonalization implementation for bigNumber
    function diagBig (x, precision = 1E-12) {
      const N = x.length
      const e0 = abs(precision / N)
      let psi
      var Sij = new Array(N)
      // Sij is Identity Matrix
      for (let i = 0; i < N; i++) {
        Sij[i] = Array(N).fill(0)
        Sij[i][i] = 1.0
      }
      // initial error
      let Vab = getAijBig(x)
      while (abs(Vab[1]) >= abs(e0)) {
        const i = Vab[0][0]
        const j = Vab[0][1]
        psi = getThetaBig(x[i][i], x[j][j], x[i][j])
        x = x1Big(x, psi, i, j)
        Sij = Sij1Big(Sij, psi, i, j)
        Vab = getAijBig(x)
      }
      var Ei = Array(N).fill(0) // eigenvalues
      for (let i = 0; i < N; i++) {
        Ei[i] = x[i][i]
      }
      return sorting(clone(Ei), clone(Sij))
    }

  

  // get angle
  function getTheta (aii, ajj, aij) {
    let th = 0.0
    const denom = (ajj - aii)
    if (Math.abs(denom) <= 1E-14) {
      th = Math.PI / 4.0
    } else {
      th = 0.5 * Math.atan(2.0 * aij / (ajj - aii))
    }
    return th
  }

  // get angle
  function getThetaBig (aii, ajj, aij) {
    let th = 0.0
    const denom = subtract(ajj , aii)
    if (abs(denom) <= 1E-14) {
      th = Math.PI / 4.0
    } else {
      th = multiply(0.5, atan( multiply(2.0, aij, inv(denom))))
    }
    return th
  }

  // update eigvec
  function Sij1 (Sij, theta, i, j) {
    const N = Sij.length
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    var Ski = new Array(N).fill(0)
    var Skj = new Array(N).fill(0)
    for (let k = 0; k < N; k++) {
      Ski[k] = c * Sij[k][i] - s * Sij[k][j]
      Skj[k] = s * Sij[k][i] + c * Sij[k][j]
    }
    for (let k = 0; k < N; k++) {
      Sij[k][i] = Ski[k]
      Sij[k][j] = Skj[k]
    }
    return Sij
  }
  // update eigvec for overlap
  function Sij1Big (Sij, theta, i, j) {
    const N = Sij.length
    const c = cos(theta)
    const s = sin(theta)
    var Ski = new Array(N).fill(0)
    var Skj = new Array(N).fill(0)
    for (let k = 0; k < N; k++) {
      Ski[k] = subtract(multiply(c, Sij[k][i]), multiply( s, Sij[k][j]))
      Skj[k] = add(multiply(s, Sij[k][i]), multiply(c, Sij[k][j]))
    }
    for (let k = 0; k < N; k++) {
      Sij[k][i] = Ski[k]
      Sij[k][j] = Skj[k]
    }
    return Sij
  }

  // update matrix
  function x1Big (Hij, theta, i, j) {
    const N = Hij.length
    const c = cos(theta)
    const s = sin(theta)
    const c2 = multiply(c, c)
    const s2 = multiply(s, s)
    //  var Ans = new Array(N).fill(Array(N).fill(0));
    var Aki = new Array(N).fill(0)
    var Akj = new Array(N).fill(0)
    //  Aii
    const Aii = add(subtract(multiply(c2, Hij[i][i]), multiply(2 , c , s , Hij[i][j])) , multiply(s2 , Hij[j][j]))
    const Ajj = add(multiply(s2, Hij[i][i]), multiply(2, c, s, Hij[i][j]), multiply(c2, Hij[j][j]))
    // 0  to i
    for (let k = 0; k < N; k++) {
      Aki[k] = subtract(multiply(c, Hij[i][k]), multiply(s, Hij[j][k]))
      Akj[k] = add(multiply(s, Hij[i][k]), multiply(c, Hij[j][k]))
    }
    // Modify Hij
    Hij[i][i] = Aii
    Hij[j][j] = Ajj
    Hij[i][j] = 0
    Hij[j][i] = 0
    // 0  to i
    for (let k = 0; k < N; k++) {
      if (k !== i && k !== j) {
        Hij[i][k] = Aki[k]
        Hij[k][i] = Aki[k]
        Hij[j][k] = Akj[k]
        Hij[k][j] = Akj[k]
      }
    }
    return Hij
  }



  // update matrix
  function x1 (Hij, theta, i, j) {
    const N = Hij.length
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    const c2 = c * c
    const s2 = s * s
    //  var Ans = new Array(N).fill(Array(N).fill(0));
    var Aki = new Array(N).fill(0)
    var Akj = new Array(N).fill(0)
    //  Aii
    const Aii = c2 * Hij[i][i] - 2 * c * s * Hij[i][j] + s2 * Hij[j][j]
    const Ajj = s2 * Hij[i][i] + 2 * c * s * Hij[i][j] + c2 * Hij[j][j]
    // 0  to i
    for (let k = 0; k < N; k++) {
      Aki[k] = c * Hij[i][k] - s * Hij[j][k]
      Akj[k] = s * Hij[i][k] + c * Hij[j][k]
    }
    // Modify Hij
    Hij[i][i] = Aii
    Hij[j][j] = Ajj
    Hij[i][j] = 0
    Hij[j][i] = 0
    // 0  to i
    for (let k = 0; k < N; k++) {
      if (k !== i && k !== j) {
        Hij[i][k] = Aki[k]
        Hij[k][i] = Aki[k]
        Hij[j][k] = Akj[k]
        Hij[k][j] = Akj[k]
      }
    }
    return Hij
  }

  // get max off-diagonal value from Upper Diagonal
  function getAij (Mij) {
    var N = Mij.length
    var maxMij = 0.0
    var maxIJ = [0, 1]
    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        if (Math.abs(maxMij) < Math.abs(Mij[i][j])) {
          maxMij = Math.abs(Mij[i][j])
          maxIJ = [i, j]
        }
      }
    }
    return [maxIJ, maxMij]
  }
 
    // get max off-diagonal value from Upper Diagonal
    function getAijBig (Mij) {
      var N = Mij.length
      var maxMij = 0.0
      var maxIJ = [0, 1]
      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          if (abs(maxMij) < abs(Mij[i][j])) {
            maxMij = abs(Mij[i][j])
            maxIJ = [i, j]
          }
        }
      }
      return [maxIJ, maxMij]
    }

  // sort results
  function sorting (E, S) {
    var N = E.length
    var Ef = Array(N)
    var Sf = Array(N)
    for (let k = 0; k < N; k++) {
      Sf[k] = Array(N)
    }
    for (var i = 0; i < N; i++) {
      var minID = 0
      var minE = E[0]
      for (var j = 0; j < E.length; j++) {
        if (E[j] < minE) {
          minID = j
          minE = E[minID]
        }
      }
      Ef[i] = E.splice(minID, 1)[0]
      for (var k = 0; k < N; k++) {
        Sf[k][i] = S[k][minID]
        S[k].splice(minID, 1)
      }
    }
    return [clone(Ef), clone(Sf)]
  }

  return eigs
})
