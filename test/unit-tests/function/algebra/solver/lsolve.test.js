// test lsolve
import assert from 'assert'

import approx from '../../../../../tools/approx'
import math from '../../../../../src/bundleAny'

describe('lsolve', function () {
  it('should solve linear system 4 x 4, arrays', function () {
    const m =
        [
          [1, 0, 0, 0],
          [1, 1, 0, 0],
          [1, 1, 1, 0],
          [1, 1, 1, 1]
        ]
    const b = [1, 2, 3, 4]

    const x = math.lsolve(m, b)

    approx.deepEqual(x, [[[1], [1], [1], [1]]])
  })

  it('should solve linear system 4 x 4, array and column array', function () {
    const m =
        [
          [1, 0, 0, 0],
          [1, 1, 0, 0],
          [1, 1, 1, 0],
          [1, 1, 1, 1]
        ]
    const b = [
      [1],
      [2],
      [3],
      [4]
    ]
    const x = math.lsolve(m, b)

    approx.deepEqual(x, [[[1], [1], [1], [1]]])
  })

  it('should solve linear system 4 x 4, matrices', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 1, 1, 0],
        [1, 1, 1, 1]
      ])
    const b = math.matrix([1, 2, 3, 4])

    const x = math.lsolve(m, b)

    assert(x[0] instanceof math.Matrix)
    approx.deepEqual(x, [math.matrix([[1], [1], [1], [1]])])
  })

  it('should solve linear system 4 x 4, sparse matrices', function () {
    const m = math.sparse(
      [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 1, 1, 0],
        [1, 1, 1, 1]
      ])
    const b = math.matrix([[1], [2], [3], [4]], 'sparse')

    const x = math.lsolve(m, b)

    assert(x[0] instanceof math.Matrix)
    approx.deepEqual(x, [math.matrix([[1], [1], [1], [1]])])
  })

  it('should solve linear system 4 x 4, matrix and column matrix', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 1, 1, 0],
        [1, 1, 1, 1]
      ])
    const b = math.matrix([
      [1],
      [2],
      [3],
      [4]
    ])

    const x = math.lsolve(m, b)

    assert(x[0] instanceof math.Matrix)
    approx.deepEqual(x, [math.matrix([[1], [1], [1], [1]])])
  })

  it('should solve linear system 4 x 4, sparse matrix and column matrix', function () {
    const m = math.matrix(
      [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 1, 1, 0],
        [1, 1, 1, 1]
      ], 'sparse')
    const b = math.matrix([
      [1],
      [2],
      [3],
      [4]
    ], 'sparse')

    const x = math.lsolve(m, b)

    assert(x[0] instanceof math.Matrix)
    approx.deepEqual(x, [math.matrix([[1], [1], [1], [1]])])
  })

  it('should throw exception when matrix is singular', function () {
    assert.throws(function () { math.lsolve([[1, 1], [0, 0]], [1, 1]) }, /Error: Linear system cannot be solved since matrix is singular/)
    assert.throws(function () { math.lsolve(math.matrix([[1, 1], [0, 0]], 'dense'), [1, 1]) }, /Error: Linear system cannot be solved since matrix is singular/)
    assert.throws(function () { math.lsolve(math.matrix([[1, 1], [0, 0]], 'sparse'), [1, 1]) }, /Error: Linear system cannot be solved since matrix is singular/)
  })

  it('should solve systems with singular matrices', function () {
    approx.deepEqual(
      math.lsolve([[2, 0, 0], [1, 0, 0], [-1, 1, 1]], [4, 2, 1]),
      [[[2], [0], [3]], [[2], [1], [2]]]
    )

    approx.deepEqual(
      math.lsolve([[0, 0, 0], [1, 1, 0], [2, 1, 0]], [0, 2, 2]),
      [[[0], [2], [0]], [[0], [2], [1]]]
    )

    approx.deepEqual(
      math.lsolve([[0, 0, 0], [1, 1, 0], [1, 1, 0]], [0, 2, 2]),
      [[[0], [2], [0]], [[1], [1], [0]], [[0], [2], [1]]]
    )
  })
})
