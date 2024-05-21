// test lusolve
import assert from 'assert'

import { approxDeepEqual } from '../../../../../tools/approx.js'
import math from '../../../../../src/defaultInstance.js'

describe('lusolve', function () {
  it('should solve linear system 4 x 4, arrays', function () {
    const m =
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ]
    const b = [-1, -1, -1, -1]

    const x = math.lusolve(m, b)

    approxDeepEqual(x, [[-1], [-0.5], [-1 / 3], [-0.25]])
  })

  it('should solve linear system 4 x 4, array and column array', function () {
    const m =
        [
          [1, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 3, 0],
          [0, 0, 0, 4]
        ]
    const b = [
      [-1],
      [-1],
      [-1],
      [-1]
    ]
    const x = math.lusolve(m, b)

    approxDeepEqual(x, [[-1], [-0.5], [-1 / 3], [-0.25]])
  })

  it('should solve linear system 4 x 4, matrices', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ])
    const b = math.matrix([-1, -1, -1, -1])

    const x = math.lusolve(m, b)

    assert(x instanceof math.Matrix)
    approxDeepEqual(x, math.matrix([[-1], [-0.5], [-1 / 3], [-0.25]]))
  })

  it('should solve linear system 4 x 4, sparse matrices', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'sparse')
    const b = math.matrix([[-1], [-1], [-1], [-1]], 'sparse')

    const x = math.lusolve(m, b)

    assert(x instanceof math.Matrix)
    approxDeepEqual(x, math.matrix([[-1], [-0.5], [-1 / 3], [-0.25]]))
  })

  it('should solve linear system 4 x 4, matrix and column matrix', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ])
    const b = math.matrix([
      [-1],
      [-1],
      [-1],
      [-1]
    ])

    const x = math.lusolve(m, b)

    assert(x instanceof math.Matrix)
    approxDeepEqual(x, math.matrix([[-1], [-0.5], [-1 / 3], [-0.25]]))
  })

  it('should solve linear system 4 x 4, sparse matrix and column matrix', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'sparse')
    const b = math.matrix([
      [-1],
      [-1],
      [-1],
      [-1]
    ], 'sparse')

    const x = math.lusolve(m, b)

    assert(x instanceof math.Matrix)
    approxDeepEqual(x, math.matrix([[-1], [-0.5], [-1 / 3], [-0.25]]))
  })

  it('should solve linear system 4 x 4, LUP decomposition (array)', function () {
    const m =
        [
          [1, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 3, 0],
          [0, 0, 0, 4]
        ]
    const lup = math.lup(m)

    const x = math.lusolve(lup, [-1, -1, -1, -1])
    approxDeepEqual(x, math.matrix([[-1], [-0.5], [-1 / 3], [-0.25]]))

    const y = math.lusolve(lup, [1, 2, 1, -1])
    approxDeepEqual(y, math.matrix([[1], [1], [1 / 3], [-0.25]]))
  })

  it('should solve linear system 4 x 4, LUP decomposition (matrix)', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ])
    const lup = math.lup(m)

    const x = math.lusolve(lup, [-1, -1, -1, -1])
    approxDeepEqual(x, math.matrix([[-1], [-0.5], [-1 / 3], [-0.25]]))

    const y = math.lusolve(lup, [1, 2, 1, -1])
    approxDeepEqual(y, math.matrix([[1], [1], [1 / 3], [-0.25]]))
  })

  it('should solve linear system 4 x 4, LUP decomposition (sparse matrix)', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'sparse')
    const lup = math.lup(m)

    const x = math.lusolve(lup, [-1, -1, -1, -1])
    approxDeepEqual(x, math.matrix([[-1], [-0.5], [-1 / 3], [-0.25]]))

    const y = math.lusolve(lup, [1, 2, 1, -1])
    approxDeepEqual(y, math.matrix([[1], [1], [1 / 3], [-0.25]]))
  })

  it('should solve linear system 3 x 3, no permutations, arrays', function () {
    const m =
        [
          [2, 1, 1],
          [1, 2, -1],
          [1, 2, 1]
        ]
    const b = [-2, 4, 2]

    const x = math.lusolve(m, b)

    approxDeepEqual(x, [[-5 / 3], [7 / 3], [-1]])
  })

  it('should solve linear system 3 x 3, no permutations, matrix', function () {
    const m = math.matrix(
      [
        [2, 1, 1],
        [1, 2, -1],
        [1, 2, 1]
      ])
    const b = [-2, 4, 2]

    const x = math.lusolve(m, b)

    approxDeepEqual(x, math.matrix([[-5 / 3], [7 / 3], [-1]]))
  })

  it('should solve linear system 3 x 3, no permutations, sparse matrix', function () {
    const m = math.matrix(
      [
        [2, 1, 1],
        [1, 2, -1],
        [1, 2, 1]
      ], 'sparse')
    const b = [-2, 4, 2]

    const x = math.lusolve(m, b)

    approxDeepEqual(x, math.matrix([[-5 / 3], [7 / 3], [-1]]))
  })

  it('should solve linear system 3 x 3, permutations, arrays', function () {
    const m =
        [
          [1, 2, -1],
          [2, 1, 1],
          [1, 2, 1]
        ]
    const b = [4, -2, 2]

    const x = math.lusolve(m, b)

    approxDeepEqual(x, [[-5 / 3], [7 / 3], [-1]])
  })

  it('should solve linear system 4 x 4, permutations, matrix - Issue 437', function () {
    const m = math.matrix(
      [
        [-1, 1, -1, 1],
        [0, 0, 0, 1],
        [1, 1, 1, 1],
        [8, 4, 2, 1]
      ])

    const b = [0.1, 0.2, 0.15, 0.1]

    const x = math.lusolve(m, b)

    approxDeepEqual(x, math.matrix([[0.025], [-0.075], [0], [0.2]]))
  })

  it('should solve linear system 4 x 4, permutations, sparse - Issue 437', function () {
    const m = math.sparse(
      [
        [-1, 1, -1, 1],
        [0, 0, 0, 1],
        [1, 1, 1, 1],
        [8, 4, 2, 1]
      ])

    const b = [0.1, 0.2, 0.15, 0.1]

    const x = math.lusolve(m, b)

    approxDeepEqual(x, math.matrix([[0.025], [-0.075], [0], [0.2]]))
  })

  it('should solve linear system 3 x 3, permutations, sparse matrix', function () {
    const m = math.matrix(
      [
        [1, 2, -1],
        [2, 1, 1],
        [1, 2, 1]
      ], 'sparse')
    const b = [4, -2, 2]

    const x = math.lusolve(m, b)

    approxDeepEqual(x, math.matrix([[-5 / 3], [7 / 3], [-1]]))
  })

  it('should solve linear system 4 x 4, natural ordering (order=0), partial pivoting, sparse matrix', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    const b = [1.000000, 1.250000, 1.500000, 1.750000]

    const x = math.lusolve(m, b, 0, 1)

    approxDeepEqual(x, math.matrix([[-0.186372], [-0.131621], [0.574586], [2.454950]]))
  })

  it('should solve linear system 4 x 4, amd(A+A\') (order=1), partial pivoting, sparse matrix', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    const b = [1.000000, 1.250000, 1.500000, 1.750000]

    const x = math.lusolve(m, b, 1, 1)

    approxDeepEqual(x, math.matrix([[-0.186372], [-0.131621], [0.574586], [2.454950]]))
  })

  it('should solve linear system 4 x 4, amd(A\'*A) (order=2), partial pivoting, sparse matrix', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    const b = [1.000000, 1.250000, 1.500000, 1.750000]

    const x = math.lusolve(m, b, 2, 1)

    approxDeepEqual(x, math.matrix([[-0.186372], [-0.131621], [0.574586], [2.454950]]))
  })

  it('should solve linear system 4 x 4, amd(A\'*A) (order=3), partial pivoting, sparse matrix', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    const b = [1.000000, 1.250000, 1.500000, 1.750000]

    const x = math.lusolve(m, b, 3, 1)

    approxDeepEqual(x, math.matrix([[-0.186372], [-0.131621], [0.574586], [2.454950]]))
  })

  it('should throw exception when matrix is singular', function () {
    assert.throws(function () { math.lusolve([[1, 1], [0, 0]], [1, 1]) }, /Error: Linear system cannot be solved since matrix is singular/)
    assert.throws(function () { math.lusolve(math.matrix([[1, 1], [0, 0]], 'dense'), [1, 1]) }, /Error: Linear system cannot be solved since matrix is singular/)
    assert.throws(function () { math.lusolve(math.matrix([[1, 1], [0, 0]], 'sparse'), [1, 1]) }, /Error: Linear system cannot be solved since matrix is singular/)
  })
})
