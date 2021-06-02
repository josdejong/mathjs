import { clone } from '../../../utils/object.js'

export function createComplexEigs ({ addScalar, subtract, flatten, multiply, multiplyScalar, divideScalar, sqrt, abs, bignumber, diag, inv, qr, usolve, usolveAll, equal, complex, larger, smaller, matrixFromColumns, dot }) {
  /**
   * @param {number[][]} arr the matrix to find eigenvalues of
   * @param {number} N size of the matrix
   * @param {number|BigNumber} prec precision, anything lower will be considered zero
   * @param {'number'|'BigNumber'|'Complex'} type
   * @param {boolean} findVectors should we find eigenvectors?
   *
   * @returns {{ values: number[], vectors: number[][] }}
   */
  function complexEigs (arr, N, prec, type, findVectors) {
    if (findVectors === undefined) {
      findVectors = true
    }

    // TODO check if any row/col are zero except the diagonal

    // make sure corresponding rows and columns have similar magnitude
    // important because of numerical stability
    const R = balance(arr, N, prec, type, findVectors)

    // R is the row transformation matrix
    // A' = R A R⁻¹, A is the original matrix
    // (if findVectors is false, R is undefined)

    // TODO if magnitudes of elements vary over many orders,
    // move greatest elements to the top left corner

    // using similarity transformations, reduce the matrix
    // to Hessenberg form (upper triangular plus one subdiagonal row)
    // updates the transformation matrix R with new row operationsq
    reduceToHessenberg(arr, N, prec, type, findVectors, R)

    // find eigenvalues
    let { values, C } = iterateUntilTriangular(arr, N, prec, type, findVectors)

    // values is the list of eigenvalues, C is the column
    // transformation matrix that transforms the hessenberg
    // matrix to upper triangular

    // compose transformations A → hess. and hess. → triang.
    C = multiply(inv(R), C)

    let vectors

    if (findVectors) {
      vectors = findEigenvectors(arr, N, C, values, prec, type)
      vectors = matrixFromColumns(...vectors)
    }

    return { values, vectors }
  }

  /**
   * @param {number[][]} arr
   * @param {number} N
   * @param {number} prec
   * @param {'number'|'BigNumber'|'Complex'} type
   * @returns {number[][]}
   */
  function balance (arr, N, prec, type, findVectors) {
    const big = type === 'BigNumber'
    const cplx = type === 'Complex'

    const zero = big ? bignumber(0) : cplx ? complex(0) : 0
    const one = big ? bignumber(1) : cplx ? complex(1) : 1

    // base of the floating-point arithmetic
    const radix = big ? bignumber(10) : 2
    const radixSq = multiplyScalar(radix, radix)

    // the diagonal transformation matrix R
    let Rdiag
    if (findVectors) {
      Rdiag = Array(N).fill(one)
    }

    // this isn't the only time we loop thru the matrix...
    let last = false

    while (!last) {
      // ...haha I'm joking! unless...
      last = true

      for (let i = 0; i < N; i++) {
        // compute the taxicab norm of i-th column and row
        // TODO optimize for complex numbers
        let colNorm = zero
        let rowNorm = zero

        for (let j = 0; j < N; j++) {
          if (i === j) continue
          const c = abs(arr[i][j])
          colNorm = addScalar(colNorm, c)
          rowNorm = addScalar(rowNorm, c)
        }

        if (!equal(colNorm, 0) && !equal(rowNorm, 0)) {
          // find integer power closest to balancing the matrix
          // (we want to scale only by integer powers of radix,
          // so that we don't lose any precision due to round-off)

          let f = one
          let c = colNorm

          const rowDivRadix = divideScalar(rowNorm, radix)
          const rowMulRadix = multiplyScalar(rowNorm, radix)

          while (smaller(c, rowDivRadix)) {
            c = multiplyScalar(c, radixSq)
            f = multiplyScalar(f, radix)
          }
          while (larger(c, rowMulRadix)) {
            c = divideScalar(c, radixSq)
            f = divideScalar(f, radix)
          }

          // check whether balancing is needed
          // condition = (c + rowNorm) / f < 0.95 * (colNorm + rowNorm)
          const condition = smaller(divideScalar(addScalar(c, rowNorm), f), multiplyScalar(addScalar(colNorm, rowNorm), 0.95))

          // apply balancing similarity transformation
          if (condition) {
            // we should loop once again to check whether
            // another rebalancing is needed
            last = false

            const g = divideScalar(1, f)

            for (let j = 0; j < N; j++) {
              if (i === j) {
                continue
              }
              arr[i][j] = multiplyScalar(arr[i][j], f)
              arr[j][i] = multiplyScalar(arr[j][i], g)
            }

            // keep track of transformations
            if (findVectors) {
              Rdiag[i] = multiplyScalar(Rdiag[i], f)
            }
          }
        }
      }
    }

    // return the diagonal row transformation matrix
    return diag(Rdiag)
  }

  /**
   * @param {number[][]} arr
   * @param {number} N
   * @param {number} prec
   * @param {'number'|'BigNumber'|'Complex'} type
   * @param {boolean} findVectors
   * @param {number[][]} R the row transformation matrix that will be modified
   */
  function reduceToHessenberg (arr, N, prec, type, findVectors, R) {
    const big = type === 'BigNumber'
    const cplx = type === 'Complex'

    const zero = big ? bignumber(0) : cplx ? complex(0) : 0

    if (big) { prec = bignumber(prec) }

    for (let i = 0; i < N - 2; i++) {
      // Find the largest subdiag element in the i-th col

      let maxIndex = 0
      let max = zero

      for (let j = i + 1; j < N; j++) {
        const el = arr[j][i]
        if (smaller(abs(max), abs(el))) {
          max = el
          maxIndex = j
        }
      }

      // This col is pivoted, no need to do anything
      if (smaller(abs(max), prec)) {
        continue
      }

      if (maxIndex !== i + 1) {
        // Interchange maxIndex-th and (i+1)-th row
        const tmp1 = arr[maxIndex]
        arr[maxIndex] = arr[i + 1]
        arr[i + 1] = tmp1

        // Interchange maxIndex-th and (i+1)-th column
        for (let j = 0; j < N; j++) {
          const tmp2 = arr[j][maxIndex]
          arr[j][maxIndex] = arr[j][i + 1]
          arr[j][i + 1] = tmp2
        }

        // keep track of transformations
        if (findVectors) {
          const tmp3 = R[maxIndex]
          R[maxIndex] = R[i + 1]
          R[i + 1] = tmp3
        }
      }

      // Reduce following rows and columns
      for (let j = i + 2; j < N; j++) {
        const n = divideScalar(arr[j][i], max)

        if (n === 0) {
          continue
        }

        // from j-th row subtract n-times (i+1)th row
        for (let k = 0; k < N; k++) {
          arr[j][k] = subtract(arr[j][k], multiplyScalar(n, arr[i + 1][k]))
        }

        // to (i+1)th column add n-times j-th column
        for (let k = 0; k < N; k++) {
          arr[k][i + 1] = addScalar(arr[k][i + 1], multiplyScalar(n, arr[k][j]))
        }

        // keep track of transformations
        if (findVectors) {
          for (let k = 0; k < N; k++) {
            R[j][k] = subtract(R[j][k], multiplyScalar(n, R[i + 1][k]))
          }
        }
      }
    }

    return R
  }

  /**
   * @returns {{values: values, C: Matrix}}
   * @see Press, Wiliams: Numerical recipes in Fortran 77
   * @see https://en.wikipedia.org/wiki/QR_algorithm
   */
  function iterateUntilTriangular (A, N, prec, type, findVectors) {
    const big = type === 'BigNumber'
    const cplx = type === 'Complex'

    const one = big ? bignumber(1) : cplx ? complex(1) : 1

    if (big) { prec = bignumber(prec) }

    // The Francis Algorithm
    // The core idea of this algorithm is that doing successive
    // A' = Q⁺AQ transformations will eventually converge to block-
    // upper-triangular with diagonal blocks either 1x1 or 2x2.
    // The Q here is the one from the QR decomposition, A = QR.
    // Since the eigenvalues of a block-upper-triangular matrix are
    // the eigenvalues of its diagonal blocks and we know how to find
    // eigenvalues of a 2x2 matrix, we know the eigenvalues of A.

    let arr = clone(A)

    // the list of converged eigenvalues
    const lambdas = []

    // size of arr, which will get smaller as eigenvalues converge
    let n = N

    // the diagonal of the block-diagonal matrix that turns
    // converged 2x2 matrices into upper triangular matrices
    const Sdiag = []

    // N×N matrix describing the overall transformation done during the QR algorithm
    let Qtotal = findVectors ? diag(Array(N).fill(one)) : undefined

    // n×n matrix describing the QR transformations done since last convergence
    let Qpartial = findVectors ? diag(Array(n).fill(one)) : undefined

    // last eigenvalue converged before this many steps
    let lastConvergenceBefore = 0

    while (lastConvergenceBefore <= 100) {
      lastConvergenceBefore += 1

      // TODO if the convergence is slow, do something clever

      // Perform the factorization

      const k = 0 // TODO set close to an eigenvalue

      for (let i = 0; i < n; i++) {
        arr[i][i] = subtract(arr[i][i], k)
      }

      // TODO do an implicit QR transformation
      const { Q, R } = qr(arr)
      arr = multiply(R, Q)

      for (let i = 0; i < n; i++) {
        arr[i][i] = addScalar(arr[i][i], k)
      }

      // keep track of transformations
      if (findVectors) {
        Qpartial = multiply(Qpartial, Q)
      }

      // The rightmost diagonal element converged to an eigenvalue
      if (n === 1 || smaller(abs(arr[n - 1][n - 2]), prec)) {
        lastConvergenceBefore = 0
        lambdas.push(arr[n - 1][n - 1])

        // keep track of transformations
        if (findVectors) {
          Sdiag.unshift([[1]])
          inflateMatrix(Qpartial, N)
          Qtotal = multiply(Qtotal, Qpartial)

          if (n > 1) {
            Qpartial = diag(Array(n - 1).fill(one))
          }
        }

        // reduce the matrix size
        n -= 1
        arr.pop()
        for (let i = 0; i < n; i++) {
          arr[i].pop()
        }

      // The rightmost diagonal 2x2 block converged
      } else if (n === 2 || smaller(abs(arr[n - 2][n - 3]), prec)) {
        lastConvergenceBefore = 0
        const ll = eigenvalues2x2(
          arr[n - 2][n - 2], arr[n - 2][n - 1],
          arr[n - 1][n - 2], arr[n - 1][n - 1]
        )
        lambdas.push(...ll)

        // keep track of transformations
        if (findVectors) {
          Sdiag.unshift(jordanBase2x2(
            arr[n - 2][n - 2], arr[n - 2][n - 1],
            arr[n - 1][n - 2], arr[n - 1][n - 1],
            ll[0], ll[1], prec, type
          ))
          inflateMatrix(Qpartial, N)
          Qtotal = multiply(Qtotal, Qpartial)

          if (n > 2) {
            Qpartial = diag(Array(n - 2).fill(one))
          }
        }

        // reduce the matrix size
        n -= 2
        arr.pop()
        arr.pop()
        for (let i = 0; i < n; i++) {
          arr[i].pop()
          arr[i].pop()
        }
      }

      if (n === 0) {
        break
      }
    }

    // standard sorting
    lambdas.sort((a, b) => +subtract(abs(a), abs(b)))

    // the algorithm didn't converge
    if (lastConvergenceBefore > 100) {
      const err = Error('The eigenvalues failed to converge. Only found these eigenvalues: ' + lambdas.join(', '))
      err.values = lambdas
      err.vectors = []
      throw err
    }

    // combine the overall QR transformation Qtotal with the subsequent
    // transformation S that turns the diagonal 2x2 blocks to upper triangular
    const C = findVectors ? multiply(Qtotal, blockDiag(Sdiag, N)) : undefined

    return { values: lambdas, C }
  }

  /**
   * @param {Matrix} A original matrix
   * @param {number} N size of A
   * @param {Matrix} C column transformation matrix that turns A into upper triangular
   * @param {number[]} values array of eigenvalues of A
   * @param {'number'|'BigNumber'|'Complex'} type
   * @returns {number[][]} eigenvalues
   */
  function findEigenvectors (A, N, C, values, prec, type) {
    const Cinv = inv(C)
    const U = multiply(Cinv, A, C)

    const big = type === 'BigNumber'
    const cplx = type === 'Complex'

    const zero = big ? bignumber(0) : cplx ? complex(0) : 0
    const one = big ? bignumber(1) : cplx ? complex(1) : 1

    // turn values into a kind of "multiset"
    // this way it is easier to find eigenvectors
    const uniqueValues = []
    const multiplicities = []

    for (const λ of values) {
      const i = indexOf(uniqueValues, λ, equal)

      if (i === -1) {
        uniqueValues.push(λ)
        multiplicities.push(1)
      } else {
        multiplicities[i] += 1
      }
    }

    // find eigenvectors by solving U − λE = 0
    // TODO replace with an iterative eigenvector algorithm
    // (this one might fail for imprecise eigenvalues)

    const vectors = []
    const len = uniqueValues.length
    const b = Array(N).fill(zero)
    const E = diag(Array(N).fill(one))

    // eigenvalues for which usolve failed (due to numerical error)
    const failedLambdas = []

    for (let i = 0; i < len; i++) {
      const λ = uniqueValues[i]
      const A = subtract(U, multiply(λ, E)) // the characteristic matrix

      let solutions = usolveAll(A, b)
      solutions = solutions.map(v => multiply(C, v))

      solutions.shift() // ignore the null vector

      // looks like we missed something, try inverse iteration
      while (solutions.length < multiplicities[i]) {
        const approxVec = inverseIterate(A, N, solutions, prec, type)

        if (approxVec == null) {
          // no more vectors were found
          failedLambdas.push(λ)
          break
        }

        solutions.push(approxVec)
      }

      vectors.push(...solutions.map(v => flatten(v)))
    }

    if (failedLambdas.length !== 0) {
      const err = new Error('Failed to find eigenvectors for the following eigenvalues: ' + failedLambdas.join(', '))
      err.values = values
      err.vectors = vectors
      throw err
    }

    return vectors
  }

  /**
   * Compute the eigenvalues of an 2x2 matrix
   * @return {[number,number]}
   */
  function eigenvalues2x2 (a, b, c, d) {
    // λ± = ½ trA ± ½ √( tr²A - 4 detA )
    const trA = addScalar(a, d)
    const detA = subtract(multiplyScalar(a, d), multiplyScalar(b, c))
    const x = multiplyScalar(trA, 0.5)
    const y = multiplyScalar(sqrt(subtract(multiplyScalar(trA, trA), multiplyScalar(4, detA))), 0.5)

    return [addScalar(x, y), subtract(x, y)]
  }

  /**
   * For an 2x2 matrix compute the transformation matrix S,
   * so that SAS⁻¹ is an upper triangular matrix
   * @return {[[number,number],[number,number]]}
   * @see https://math.berkeley.edu/~ogus/old/Math_54-05/webfoils/jordan.pdf
   * @see http://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
   */
  function jordanBase2x2 (a, b, c, d, l1, l2, prec, type) {
    const big = type === 'BigNumber'
    const cplx = type === 'Complex'

    const zero = big ? bignumber(0) : cplx ? complex(0) : 0
    const one = big ? bignumber(1) : cplx ? complex(1) : 1

    // matrix is already upper triangular
    // return an identity matrix
    if (smaller(abs(c), prec)) {
      return [[one, zero], [zero, one]]
    }

    // matrix is diagonalizable
    // return its eigenvectors as columns
    if (larger(abs(subtract(l1, l2)), prec)) {
      return [[subtract(l1, d), subtract(l2, d)], [c, c]]
    }

    // matrix is not diagonalizable
    // compute off-diagonal elements of N = A - λI
    // N₁₂ = 0 ⇒ S = ( N⃗₁, I⃗₁ )
    // N₁₂ ≠ 0 ⇒ S = ( N⃗₂, I⃗₂ )

    const na = subtract(a, l1)
    const nb = subtract(b, l1)
    const nc = subtract(c, l1)
    const nd = subtract(d, l1)

    if (smaller(abs(nb), prec)) {
      return [[na, one], [nc, zero]]
    } else {
      return [[nb, zero], [nd, one]]
    }
  }

  /**
   * Enlarge the matrix from n×n to N×N, setting the new
   * elements to 1 on diagonal and 0 elsewhere
   */
  function inflateMatrix (arr, N) {
    // add columns
    for (let i = 0; i < arr.length; i++) {
      arr[i].push(...Array(N - arr[i].length).fill(0))
    }

    // add rows
    for (let i = arr.length; i < N; i++) {
      arr.push(Array(N).fill(0))
      arr[i][i] = 1
    }

    return arr
  }

  /**
   * Create a block-diagonal matrix with the given square matrices on the diagonal
   * @param {Matrix[] | number[][][]} arr array of matrices to be placed on the diagonal
   * @param {number} N the size of the resulting matrix
   */
  function blockDiag (arr, N) {
    const M = []
    for (let i = 0; i < N; i++) {
      M[i] = Array(N).fill(0)
    }

    let I = 0
    for (const sub of arr) {
      const n = sub.length

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          M[I + i][I + j] = sub[i][j]
        }
      }

      I += n
    }

    return M
  }

  /**
   * Finds the index of an element in an array using a custom equality function
   * @template T
   * @param {Array<T>} arr array in which to search
   * @param {T} el the element to find
   * @param {function(T, T): boolean} fn the equality function, first argument is an element of `arr`, the second is always `el`
   * @returns {number} the index of `el`, or -1 when it's not in `arr`
   */
  function indexOf (arr, el, fn) {
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], el)) {
        return i
      }
    }
    return -1
  }

  /**
   * Provided a near-singular upper-triangular matrix A and a list of vectors,
   * finds an eigenvector of A with the smallest eigenvalue, which is orthogonal
   * to each vector in the list
   * @template T
   * @param {T[][]} A near-singular square matrix
   * @param {number} N dimension
   * @param {T[][]} orthog list of vectors
   * @param {number} prec epsilon
   * @param {'number'|'BigNumber'|'Complex'} type
   * @return {T[] | null} eigenvector
   *
   * @see Numerical Recipes for Fortran 77 – 11.7 Eigenvalues or Eigenvectors by Inverse Iteration
   */
  function inverseIterate (A, N, orthog, prec, type) {
    const largeNum = type === 'BigNumber' ? bignumber(1000) : 1000

    let b // the vector

    // you better choose a random vector before I count to five
    let i = 0
    while (true) {
      b = randomOrthogonalVector(N, orthog, type)
      b = usolve(A, b)

      if (larger(norm(b), largeNum)) { break }
      if (++i >= 5) { return null }
    }

    // you better converge before I count to ten
    i = 0
    while (true) {
      const c = usolve(A, b)

      if (smaller(norm(orthogonalComplement(b, [c])), prec)) { break }
      if (++i >= 10) { return null }

      b = normalize(c)
    }

    return b
  }

  /**
   * Generates a random unit vector of dimension N, orthogonal to each vector in the list
   * @template T
   * @param {number} N dimension
   * @param {T[][]} orthog list of vectors
   * @param {'number'|'BigNumber'|'Complex'} type
   * @returns {T[]} random vector
   */
  function randomOrthogonalVector (N, orthog, type) {
    const big = type === 'BigNumber'
    const cplx = type === 'Complex'

    // generate random vector with the correct type
    let v = Array(N).fill(0).map(_ => 2 * Math.random() - 1)
    if (big) { v = v.map(n => bignumber(n)) }
    if (cplx) { v = v.map(n => complex(n)) }

    // project to orthogonal complement
    v = orthogonalComplement(v, orthog)

    // normalize
    return normalize(v, type)
  }

  /**
   * Project vector v to the orthogonal complement of an array of vectors
   */
  function orthogonalComplement (v, orthog) {
    for (const w of orthog) {
      // v := v − (w, v)/∥w∥² w
      v = subtract(v, multiply(divideScalar(dot(w, v), dot(w, w)), w))
    }

    return v
  }

  /**
   * Calculate the norm of a vector.
   * We can't use math.norm because factory can't handle circular dependency.
   * Seriously, I'm really fed up with factory.
   */
  function norm (v) {
    return abs(sqrt(dot(v, v)))
  }

  /**
   * Normalize a vector
   * @template T
   * @param {T[]} v
   * @param {'number'|'BigNumber'|'Complex'} type
   * @returns {T[]} normalized vec
   */
  function normalize (v, type) {
    const big = type === 'BigNumber'
    const cplx = type === 'Complex'
    const one = big ? bignumber(1) : cplx ? complex(1) : 1

    return multiply(divideScalar(one, norm(v)), v)
  }

  return complexEigs
}
