import { clone } from '../../../utils/object.js'

export function createRealSymmetric ({ config, addScalar, subtract, abs, atan, cos, sin, multiplyScalar, inv, bignumber, multiply, add }) {
  /**
   * @param {number[] | BigNumber[]} arr
   * @param {number} N
   * @param {number} prec
   * @param {'number' | 'BigNumber'} type
   */
  function main (arr, N, prec = config.relTol, type, computeVectors) {
    if (type === 'number') {
      return diag(arr, prec, computeVectors)
    }

    if (type === 'BigNumber') {
      return diagBig(arr, prec, computeVectors)
    }

    throw TypeError('Unsupported data type: ' + type)
  }

  // diagonalization implementation for number (efficient)
  function diag (x, precision, computeVectors) {
    const N = x.length
    const e0 = Math.abs(precision / N)
    let psi
    let Sij
    if (computeVectors) {
      Sij = new Array(N)
      // Sij is Identity Matrix
      for (let i = 0; i < N; i++) {
        Sij[i] = Array(N).fill(0)
        Sij[i][i] = 1.0
      }
    }
    // initial error
    let Vab = getAij(x)
    while (Math.abs(Vab[1]) >= Math.abs(e0)) {
      const i = Vab[0][0]
      const j = Vab[0][1]
      psi = getTheta(x[i][i], x[j][j], x[i][j])
      x = x1(x, psi, i, j)
      if (computeVectors) Sij = Sij1(Sij, psi, i, j)
      Vab = getAij(x)
    }
    const Ei = Array(N).fill(0) // eigenvalues
    for (let i = 0; i < N; i++) {
      Ei[i] = x[i][i]
    }
    return sorting(clone(Ei), Sij, computeVectors)
  }

  // diagonalization implementation for bigNumber
  function diagBig (x, precision, computeVectors) {
    const N = x.length
    const e0 = abs(precision / N)
    let psi
    let Sij
    if (computeVectors) {
      Sij = new Array(N)
      // Sij is Identity Matrix
      for (let i = 0; i < N; i++) {
        Sij[i] = Array(N).fill(0)
        Sij[i][i] = 1.0
      }
    }
    // initial error
    let Vab = getAijBig(x)
    while (abs(Vab[1]) >= abs(e0)) {
      const i = Vab[0][0]
      const j = Vab[0][1]
      psi = getThetaBig(x[i][i], x[j][j], x[i][j])
      x = x1Big(x, psi, i, j)
      if (computeVectors) Sij = Sij1Big(Sij, psi, i, j)
      Vab = getAijBig(x)
    }
    const Ei = Array(N).fill(0) // eigenvalues
    for (let i = 0; i < N; i++) {
      Ei[i] = x[i][i]
    }
    // return [clone(Ei), clone(Sij)]
    return sorting(clone(Ei), Sij, computeVectors)
  }

  // get angle
  function getTheta (aii, ajj, aij) {
    const denom = (ajj - aii)
    if (Math.abs(denom) <= config.relTol) {
      return Math.PI / 4.0
    } else {
      return 0.5 * Math.atan(2.0 * aij / (ajj - aii))
    }
  }

  // get angle
  function getThetaBig (aii, ajj, aij) {
    const denom = subtract(ajj, aii)
    if (abs(denom) <= config.relTol) {
      return bignumber(-1).acos().div(4)
    } else {
      return multiplyScalar(0.5, atan(multiply(2.0, aij, inv(denom))))
    }
  }

  // update eigvec
  function Sij1 (Sij, theta, i, j) {
    const N = Sij.length
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    const Ski = Array(N).fill(0)
    const Skj = Array(N).fill(0)
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
    const Ski = Array(N).fill(bignumber(0))
    const Skj = Array(N).fill(bignumber(0))
    for (let k = 0; k < N; k++) {
      Ski[k] = subtract(multiplyScalar(c, Sij[k][i]), multiplyScalar(s, Sij[k][j]))
      Skj[k] = addScalar(multiplyScalar(s, Sij[k][i]), multiplyScalar(c, Sij[k][j]))
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
    const c = bignumber(cos(theta))
    const s = bignumber(sin(theta))
    const c2 = multiplyScalar(c, c)
    const s2 = multiplyScalar(s, s)
    const Aki = Array(N).fill(bignumber(0))
    const Akj = Array(N).fill(bignumber(0))
    // 2cs Hij
    const csHij = multiply(bignumber(2), c, s, Hij[i][j])
    //  Aii
    const Aii = addScalar(subtract(multiplyScalar(c2, Hij[i][i]), csHij), multiplyScalar(s2, Hij[j][j]))
    const Ajj = add(multiplyScalar(s2, Hij[i][i]), csHij, multiplyScalar(c2, Hij[j][j]))
    // 0  to i
    for (let k = 0; k < N; k++) {
      Aki[k] = subtract(multiplyScalar(c, Hij[i][k]), multiplyScalar(s, Hij[j][k]))
      Akj[k] = addScalar(multiplyScalar(s, Hij[i][k]), multiplyScalar(c, Hij[j][k]))
    }
    // Modify Hij
    Hij[i][i] = Aii
    Hij[j][j] = Ajj
    Hij[i][j] = bignumber(0)
    Hij[j][i] = bignumber(0)
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
    const Aki = Array(N).fill(0)
    const Akj = Array(N).fill(0)
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
    const N = Mij.length
    let maxMij = 0
    let maxIJ = [0, 1]
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
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
    const N = Mij.length
    let maxMij = 0
    let maxIJ = [0, 1]
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (abs(maxMij) < abs(Mij[i][j])) {
          maxMij = abs(Mij[i][j])
          maxIJ = [i, j]
        }
      }
    }
    return [maxIJ, maxMij]
  }

  // sort results
  function sorting (E, S, computeVectors) {
    const N = E.length
    const values = Array(N)
    let vecs
    if (computeVectors) {
      vecs = Array(N)
      for (let k = 0; k < N; k++) {
        vecs[k] = Array(N)
      }
    }
    for (let i = 0; i < N; i++) {
      let minID = 0
      let minE = E[0]
      for (let j = 0; j < E.length; j++) {
        if (abs(E[j]) < abs(minE)) {
          minID = j
          minE = E[minID]
        }
      }
      values[i] = E.splice(minID, 1)[0]
      if (computeVectors) {
        for (let k = 0; k < N; k++) {
          vecs[i][k] = S[k][minID]
          S[k].splice(minID, 1)
        }
      }
    }
    if (!computeVectors) return { values }
    const eigenvectors = vecs.map((vector, i) => ({ value: values[i], vector }))
    return { values, eigenvectors }
  }

  return main
}
