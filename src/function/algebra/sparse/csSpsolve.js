// Copyright (c) 2006-2024, Timothy A. Davis, All Rights Reserved.
// SPDX-License-Identifier: LGPL-2.1+
// https://github.com/DrTimothyAldenDavis/SuiteSparse/tree/dev/CSparse/Source
import { csReach } from './csReach.js'
import { factory } from '../../../utils/factory.js'

const name = 'csSpsolve'
const dependencies = [
  'typed',
  'divideScalar',
  'multiply',
  'subtract'
]

export const createCsSpsolve = /* #__PURE__ */ factory(name, dependencies, ({ typed, divideScalar, multiply, subtract }) => {
  const divideNumber = numberOperation(divideScalar)
  const multiplyNumber = numberOperation(multiply)
  const subtractNumber = numberOperation(subtract)

  // Keep injected operations, including plain functions and broader signatures.
  // A typed scalar implementation may itself change the numeric domain, so
  // mixed intermediate values must still go through the original dispatcher.
  function numberOperation (operation) {
    let implementation = operation
    const seen = new Set()
    while (typed.isTypedFunction(implementation) && !seen.has(implementation)) {
      seen.add(implementation)
      if (!implementation.signatures['number,number'] &&
          !implementation.signatures['any,any']) {
        break
      }
      implementation = typed.find(implementation, ['number', 'number'], { exact: true })
    }
    return implementation
  }

  /**
   * The function csSpsolve() computes the solution to G * x = bk, where bk is the
   * kth column of B. When lo is true, the function assumes G = L is lower triangular with the
   * diagonal entry as the first entry in each column. When lo is true, the function assumes G = U
   * is upper triangular with the diagonal entry as the last entry in each column.
   *
   * @param {Matrix}  g               The G matrix
   * @param {Matrix}  b               The B matrix
   * @param {Number}  k               The kth column in B
   * @param {Array}   xi              The nonzero pattern xi[top] .. xi[n - 1], an array of size = 2 * n
   *                                  The first n entries is the nonzero pattern, the last n entries is the stack
   * @param {Array}   x               The soluton to the linear system G * x = b
   * @param {Array}   pinv            The inverse row permutation vector, must be null for L * x = b
   * @param {boolean} lo              The lower (true) upper triangular (false) flag
   *
   * @return {Number}                 The index for the nonzero pattern
   */
  return function csSpsolve (g, b, k, xi, x, pinv, lo) {
    // Select scalar arithmetic once for the declared numeric matrix domain.
    const numbers = b._datatype === 'number'
    // g arrays
    const gvalues = g._values
    const gindex = g._index
    const gptr = g._ptr
    const gsize = g._size
    // columns
    const n = gsize[1]
    // b arrays
    const bvalues = b._values
    const bindex = b._index
    const bptr = b._ptr
    // vars
    let p, p0, p1, q
    // xi[top..n-1] = csReach(B(:,k))
    const top = csReach(g, b, k, xi, pinv)
    // clear x
    for (p = top; p < n; p++) { x[xi[p]] = 0 }
    // scatter b
    for (p0 = bptr[k], p1 = bptr[k + 1], p = p0; p < p1; p++) { x[bindex[p]] = bvalues[p] }
    // loop columns
    for (let px = top; px < n; px++) {
      // x array index for px
      const j = xi[px]
      // apply permutation vector (U x = b), j maps to column J of G
      const J = pinv ? pinv[j] : j
      // check column J is empty
      if (J < 0) { continue }
      // column value indeces in G, p0 <= p < p1
      p0 = gptr[J]
      p1 = gptr[J + 1]
      // x(j) /= G(j,j)
      const current = x[j]
      const diagonal = gvalues[lo ? p0 : (p1 - 1)]
      x[j] = numbers && typeof current === 'number' && typeof diagonal === 'number'
        ? divideNumber(current, diagonal)
        : divideScalar(current, diagonal)
      // first entry L(j,j)
      p = lo ? (p0 + 1) : p0
      q = lo ? (p1) : (p1 - 1)
      // loop
      for (; p < q; p++) {
        // row
        const i = gindex[p]
        // x(i) -= G(i,j) * x(j)
        const previous = x[i]
        const value = gvalues[p]
        const pivot = x[j]
        const product = numbers && typeof value === 'number' && typeof pivot === 'number'
          ? multiplyNumber(value, pivot)
          : multiply(value, pivot)
        x[i] = numbers && typeof previous === 'number' && typeof product === 'number'
          ? subtractNumber(previous, product)
          : subtract(previous, product)
      }
    }
    // return top of stack
    return top
  }
})
