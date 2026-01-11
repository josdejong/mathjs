import { factory } from '../../../utils/factory.js'

const name = 'schur'
const dependencies = [
  'typed',
  'matrix',
  'identity',
  'multiply',
  'qr',
  'norm',
  'subtract',
  'abs',
  'addScalar',
  'divideScalar',
  'multiplyScalar',
  'subtractScalar',
  'sqrt',
  'transpose'
]

export const createSchur = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    matrix,
    identity,
    multiply,
    qr,
    norm,
    subtract,
    abs,
    addScalar,
    divideScalar,
    multiplyScalar,
    subtractScalar,
    sqrt,
    transpose
  }
) => {
  /**
   *
   * Performs a real Schur decomposition of the real matrix A = UTU' where U is orthogonal
   * and T is upper quasi-triangular.
   *
   * Real Schur decomposition: For a real square matrix A, returns orthogonal U and
   * quasi-upper-triangular T such that A = U*T*U'.
   * T is block upper triangular with 1x1 and 2x2 blocks on the diagonal.
   * 1x1 blocks correspond to real eigenvalues, 2x2 blocks correspond to
   * complex conjugate eigenvalue pairs.
   *
   * https://en.wikipedia.org/wiki/Schur_decomposition
   *
   * Syntax:
   *
   *     math.schur(A)
   *
   * Examples:
   *
   *     const A = [[1, 0], [-4, 3]]
   *     math.schur(A) // returns {U: [[0, 1], [-1, 0]], T: [[3, 4], [0, 1]]}
   *
   * See also:
   *
   *     sylvester, lyap, qr
   *
   * @param {Array | Matrix} A  Matrix A
   * @return {{U: Array | Matrix, T: Array | Matrix}} Object containing both matrix U and T of the Schur Decomposition A=UTU'
   */
  return typed(name, {
    Array: function (X) {
      const r = _schur(matrix(X))
      return {
        U: r.U.valueOf(),
        T: r.T.valueOf()
      }
    },

    Matrix: function (X) {
      return _schur(X)
    }
  })

  /**
   * Main Schur decomposition function using Francis QR algorithm
   */
  function _schur (X) {
    const size = X.size()
    if (size.length !== 2 || size[0] !== size[1]) {
      throw new RangeError('Matrix must be square')
    }

    const n = size[0]

    // Handle trivial cases
    if (n === 0) {
      return { U: matrix([]), T: matrix([]) }
    }
    if (n === 1) {
      return { U: identity(1), T: X.clone() }
    }

    // Convert to 2D array for internal processing
    const arr = X.toArray()

    // Step 1: Reduce to upper Hessenberg form
    // This is a similarity transformation: H = P' * A * P
    const { H, P } = reduceToHessenberg(arr, n)

    // Step 2: Apply Francis QR algorithm to get quasi-triangular form
    // This computes the Schur form: T = Q' * H * Q
    const { T, Q } = francisQR(H, n)

    // Step 3: Combine transformations: U = P * Q
    // So that A = U * T * U'
    const U = multiply(matrix(P), matrix(Q))

    return { U, T: matrix(T) }
  }

  /**
   * Reduce matrix to upper Hessenberg form using Householder reflections.
   * Returns H (upper Hessenberg) and P (orthogonal) such that H = P' * A * P
   */
  function reduceToHessenberg (arr, n) {
    // Clone the array to avoid modifying the original
    const H = arr.map(row => [...row])

    // P will accumulate the orthogonal transformation
    const P = []
    for (let i = 0; i < n; i++) {
      P[i] = Array(n).fill(0)
      P[i][i] = 1
    }

    for (let k = 0; k < n - 2; k++) {
      // Compute Householder vector for column k, rows k+1 to n-1
      const x = []
      for (let i = k + 1; i < n; i++) {
        x.push(H[i][k])
      }

      const householder = computeHouseholderVector(x)
      if (householder === null) {
        continue // Column is already zero, skip
      }

      const { v, beta } = householder

      // Apply Householder reflection from the left: H := (I - beta*v*v') * H
      // Only affects rows k+1 to n-1
      for (let j = k; j < n; j++) {
        let sum = 0
        for (let i = 0; i < v.length; i++) {
          sum = addScalar(sum, multiplyScalar(v[i], H[k + 1 + i][j]))
        }
        sum = multiplyScalar(sum, beta)
        for (let i = 0; i < v.length; i++) {
          H[k + 1 + i][j] = subtractScalar(H[k + 1 + i][j], multiplyScalar(v[i], sum))
        }
      }

      // Apply Householder reflection from the right: H := H * (I - beta*v*v')
      // Affects all rows, columns k+1 to n-1
      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < v.length; j++) {
          sum = addScalar(sum, multiplyScalar(H[i][k + 1 + j], v[j]))
        }
        sum = multiplyScalar(sum, beta)
        for (let j = 0; j < v.length; j++) {
          H[i][k + 1 + j] = subtractScalar(H[i][k + 1 + j], multiplyScalar(sum, v[j]))
        }
      }

      // Accumulate P: P := P * (I - beta*v*v')
      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < v.length; j++) {
          sum = addScalar(sum, multiplyScalar(P[i][k + 1 + j], v[j]))
        }
        sum = multiplyScalar(sum, beta)
        for (let j = 0; j < v.length; j++) {
          P[i][k + 1 + j] = subtractScalar(P[i][k + 1 + j], multiplyScalar(sum, v[j]))
        }
      }
    }

    // Clean up small subdiagonal entries (should be zero due to Householder)
    for (let i = 2; i < n; i++) {
      for (let j = 0; j < i - 1; j++) {
        H[i][j] = 0
      }
    }

    return { H, P }
  }

  /**
   * Compute Householder vector v and scalar beta such that
   * (I - beta * v * v') * x = ||x|| * e_1
   */
  function computeHouseholderVector (x) {
    const m = x.length
    if (m === 0) return null

    let sigma = 0
    for (let i = 1; i < m; i++) {
      sigma = addScalar(sigma, multiplyScalar(x[i], x[i]))
    }

    const x0 = x[0]
    const x0sq = multiplyScalar(x0, x0)

    // If the vector is already a multiple of e_1, no transformation needed
    if (abs(sigma) < 1e-14 && abs(x0) < 1e-14) {
      return null
    }
    if (abs(sigma) < 1e-14) {
      return null
    }

    const normX = sqrt(addScalar(x0sq, sigma))

    // Choose sign to avoid cancellation
    let v0
    if (x0 <= 0) {
      v0 = subtractScalar(x0, normX)
    } else {
      v0 = divideScalar(-sigma, addScalar(x0, normX))
    }

    const v0sq = multiplyScalar(v0, v0)
    const beta = divideScalar(2, addScalar(1, divideScalar(sigma, v0sq)))

    // Construct v = [1, x[1]/v0, x[2]/v0, ...]
    const v = [1]
    for (let i = 1; i < m; i++) {
      v.push(divideScalar(x[i], v0))
    }

    return { v, beta }
  }

  /**
   * Francis QR algorithm with implicit double shift for upper Hessenberg matrices.
   * Computes the real Schur form T and orthogonal Q such that T = Q' * H * Q
   */
  function francisQR (Hin, n) {
    const H = Hin.map(row => [...row])

    // Q accumulates the orthogonal transformations
    const Q = []
    for (let i = 0; i < n; i++) {
      Q[i] = Array(n).fill(0)
      Q[i][i] = 1
    }

    const eps = Number.EPSILON // machine epsilon for convergence
    const maxIterationsPerEigenvalue = 30 // max iterations per eigenvalue
    const maxTotalIterations = 30 * n // safety limit

    let p = n - 1 // Index of last unconverged eigenvalue
    let iterCount = 0
    let totalIter = 0

    while (p > 0 && totalIter < maxTotalIterations) {
      totalIter++
      let q = p - 1

      // Find the largest q such that H[q][q-1] is negligible
      while (q > 0) {
        const threshold = eps * (abs(H[q - 1][q - 1]) + abs(H[q][q]))
        if (abs(H[q][q - 1]) <= threshold) {
          H[q][q - 1] = 0
          break
        }
        q--
      }

      // q is the start of the unreduced block [q, p]
      // If q == p, we have a 1x1 block (real eigenvalue)
      if (q === p) {
        p--
        iterCount = 0
        continue
      }

      // If q == p-1, we have a 2x2 block
      if (q === p - 1) {
        // Check if eigenvalues are complex
        const a = H[p - 1][p - 1]
        const b = H[p - 1][p]
        const c = H[p][p - 1]
        const d = H[p][p]

        // Discriminant: (a-d)^2 + 4bc (derived from characteristic polynomial)
        const diff = subtractScalar(a, d)
        const discriminant = addScalar(multiplyScalar(diff, diff), multiplyScalar(4, multiplyScalar(b, c)))

        if (discriminant < 0) {
          // Complex eigenvalues - keep the 2x2 block
          p -= 2
          iterCount = 0
          continue
        }

        // Real eigenvalues in a 2x2 block
        // If we've tried many times and it won't split, accept it
        if (iterCount > maxIterationsPerEigenvalue) {
          p -= 2
          iterCount = 0
          continue
        }
      }

      // Perform Francis double shift QR step
      iterCount++

      // Apply exceptional shift if convergence is slow
      if (iterCount === 10 || iterCount === 20) {
        // Exceptional shift: use a random-ish perturbation
        const shift = multiplyScalar(addScalar(abs(H[p][p - 1]), abs(H[p - 1][p - 2] || 0)), iterCount === 10 ? 1.5 : -1.5)
        for (let i = q; i <= p; i++) {
          H[i][i] = addScalar(H[i][i], shift)
        }
        francisStep(H, Q, n, q, p)
        for (let i = q; i <= p; i++) {
          H[i][i] = subtractScalar(H[i][i], shift)
        }
      } else {
        francisStep(H, Q, n, q, p)
      }
    }

    // Clean up tiny subdiagonal elements
    for (let i = 1; i < n; i++) {
      // Use a relative threshold based on nearby diagonal elements
      const threshold = eps * (abs(H[i - 1][i - 1]) + abs(H[i][i]))
      if (abs(H[i][i - 1]) <= threshold) {
        H[i][i - 1] = 0
      }
    }

    return { T: H, Q }
  }

  /**
   * Perform one Francis double shift QR step on the active block [q, p] of H.
   * This implements the implicit double shift QR iteration.
   */
  function francisStep (H, Q, n, q, p) {
    // Compute the Wilkinson shift from the bottom 2x2 submatrix
    // The shift is chosen as the eigenvalue of the 2x2 block closest to H[p][p]
    const a = H[p - 1][p - 1]
    const b = H[p - 1][p]
    const c = H[p][p - 1]
    const d = H[p][p]

    // Compute the eigenvalues of the 2x2 matrix [[a,b],[c,d]]
    // trace and determinant
    const trace = addScalar(a, d)
    const det = subtractScalar(multiplyScalar(a, d), multiplyScalar(b, c))

    // For the implicit double shift, we use both eigenvalues
    // First column of (H - s1*I)(H - s2*I) where s1, s2 are the eigenvalues
    // = H^2 - trace*H + det*I
    // First column is [H^2]_0 - trace*H_0 + det*e_0 for active block

    // Compute first column of H^2 - trace*H + det*I (restricted to active block)
    // For row q: sum_k H[q][k]*H[k][q] - trace*H[q][q] + det
    // Since H is Hessenberg, H[k][q] = 0 for k > q+1

    const Hqq = H[q][q]
    const Hqq1 = H[q][q + 1]
    const Hq1q = H[q + 1][q]
    const Hq1q1 = H[q + 1][q + 1]

    // First column of M = H^2 - trace*H + det*I
    // M[q][q] = H[q][q]*H[q][q] + H[q][q+1]*H[q+1][q] - trace*H[q][q] + det
    let x = addScalar(
      addScalar(
        multiplyScalar(Hqq, Hqq),
        multiplyScalar(Hqq1, Hq1q)
      ),
      subtractScalar(det, multiplyScalar(trace, Hqq))
    )

    // M[q+1][q] = H[q+1][q]*H[q][q] + H[q+1][q+1]*H[q+1][q] - trace*H[q+1][q]
    //           = H[q+1][q] * (H[q][q] + H[q+1][q+1] - trace)
    //           = H[q+1][q] * (H[q][q] + H[q+1][q+1] - a - d)
    let y = multiplyScalar(
      Hq1q,
      subtractScalar(addScalar(Hqq, Hq1q1), trace)
    )

    // M[q+2][q] = H[q+2][q+1]*H[q+1][q] (only nonzero element from Hessenberg structure)
    let z = 0
    if (q + 2 <= p) {
      z = multiplyScalar(H[q + 2][q + 1], Hq1q)
    }

    // Perform bulge chasing: apply Householder reflections to eliminate the bulge
    for (let k = q; k <= p - 1; k++) {
      // Determine the size of the Householder reflection (3 or 2)
      const r = Math.min(3, p - k + 1)

      // Compute Householder vector for [x, y, z] or [x, y]
      let householder
      if (r === 3) {
        householder = computeHouseholderVector3(x, y, z)
      } else {
        householder = computeHouseholderVector2(x, y)
      }

      if (householder === null) {
        // Small values, skip this iteration
        if (k < p - 1) {
          x = H[k + 1][k]
          y = H[k + 2][k]
          z = (k + 3 <= p) ? H[k + 3][k] : 0
        }
        continue
      }

      const { v, beta } = householder

      // Apply Householder reflection from the left
      const jStart = Math.max(0, k - 1)
      for (let j = jStart; j < n; j++) {
        let sum = 0
        for (let i = 0; i < r; i++) {
          sum = addScalar(sum, multiplyScalar(v[i], H[k + i][j]))
        }
        sum = multiplyScalar(sum, beta)
        for (let i = 0; i < r; i++) {
          H[k + i][j] = subtractScalar(H[k + i][j], multiplyScalar(v[i], sum))
        }
      }

      // Apply Householder reflection from the right
      const iEnd = Math.min(n, k + r + 1)
      for (let i = 0; i < iEnd; i++) {
        let sum = 0
        for (let j = 0; j < r; j++) {
          sum = addScalar(sum, multiplyScalar(H[i][k + j], v[j]))
        }
        sum = multiplyScalar(sum, beta)
        for (let j = 0; j < r; j++) {
          H[i][k + j] = subtractScalar(H[i][k + j], multiplyScalar(sum, v[j]))
        }
      }

      // Accumulate Q
      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < r; j++) {
          sum = addScalar(sum, multiplyScalar(Q[i][k + j], v[j]))
        }
        sum = multiplyScalar(sum, beta)
        for (let j = 0; j < r; j++) {
          Q[i][k + j] = subtractScalar(Q[i][k + j], multiplyScalar(sum, v[j]))
        }
      }

      // Prepare for next iteration
      if (k < p - 1) {
        x = H[k + 1][k]
        y = H[k + 2][k]
        z = (k + 3 <= p) ? H[k + 3][k] : 0
      }
    }
  }

  /**
   * Compute Householder vector for 3-element vector [x, y, z]
   */
  function computeHouseholderVector3 (x, y, z) {
    const norm = sqrt(addScalar(addScalar(
      multiplyScalar(x, x),
      multiplyScalar(y, y)
    ), multiplyScalar(z, z)))

    if (abs(norm) < 1e-14) {
      return null
    }

    // Choose sign to avoid cancellation
    const s = x >= 0 ? 1 : -1
    const u0 = addScalar(x, multiplyScalar(s, norm))

    const v = [1, divideScalar(y, u0), divideScalar(z, u0)]
    const vNormSq = addScalar(addScalar(1, multiplyScalar(v[1], v[1])), multiplyScalar(v[2], v[2]))
    const beta = divideScalar(2, vNormSq)

    return { v, beta }
  }

  /**
   * Compute Householder vector for 2-element vector [x, y]
   */
  function computeHouseholderVector2 (x, y) {
    const norm = sqrt(addScalar(multiplyScalar(x, x), multiplyScalar(y, y)))

    if (abs(norm) < 1e-14) {
      return null
    }

    // Choose sign to avoid cancellation
    const s = x >= 0 ? 1 : -1
    const u0 = addScalar(x, multiplyScalar(s, norm))

    const v = [1, divideScalar(y, u0)]
    const vNormSq = addScalar(1, multiplyScalar(v[1], v[1]))
    const beta = divideScalar(2, vNormSq)

    return { v, beta }
  }
})
