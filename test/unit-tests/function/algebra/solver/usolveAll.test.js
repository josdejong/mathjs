// test usolveAll
import assert from 'assert'

import { approxDeepEqual } from '../../../../../tools/approx.js'
import math from '../../../../../src/defaultInstance.js'

describe('usolveAll', function () {
  it('should solve linear system 4 x 4, arrays', function () {
    const m =
        [
          [1, 1, 1, 1],
          [0, 1, 1, 1],
          [0, 0, 1, 1],
          [0, 0, 0, 1]
        ]
    const b = [1, 2, 3, 4]

    const x = math.usolveAll(m, b)

    approxDeepEqual(x, [[[-1], [-1], [-1], [4]]])
  })

  it('should solve linear system 4 x 4, array and column array', function () {
    const m =
        [
          [1, 1, 1, 1],
          [0, 1, 1, 1],
          [0, 0, 1, 1],
          [0, 0, 0, 1]
        ]
    const b = [
      [1],
      [2],
      [3],
      [4]
    ]
    const x = math.usolveAll(m, b)

    approxDeepEqual(x, [[[-1], [-1], [-1], [4]]])
  })

  it('should solve linear system 4 x 4, matrices', function () {
    const m = math.matrix(
      [
        [1, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 0, 1, 1],
        [0, 0, 0, 1]
      ])
    const b = math.matrix([1, 2, 3, 4])

    const x = math.usolveAll(m, b)

    assert(x[0] instanceof math.Matrix)
    approxDeepEqual(x, [math.matrix([[-1], [-1], [-1], [4]])])
  })

  it('should solve linear system 4 x 4, sparse matrices', function () {
    const m = math.sparse(
      [
        [1, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 0, 1, 1],
        [0, 0, 0, 1]
      ])
    const b = math.matrix([[1], [2], [3], [4]], 'sparse')

    const x = math.usolveAll(m, b)

    assert(x[0] instanceof math.Matrix)
    approxDeepEqual(x, [math.matrix([[-1], [-1], [-1], [4]])])
  })

  it('should solve linear system 4 x 4, matrix and column matrix', function () {
    const m = math.matrix(
      [
        [1, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 0, 1, 1],
        [0, 0, 0, 1]
      ])
    const b = math.matrix([
      [1],
      [2],
      [3],
      [4]
    ])

    const x = math.usolveAll(m, b)

    assert(x[0] instanceof math.Matrix)
    approxDeepEqual(x, [math.matrix([[-1], [-1], [-1], [4]])])
  })

  it('should solve linear system 4 x 4, sparse matrix and column matrix', function () {
    const m = math.matrix(
      [
        [1, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 0, 1, 1],
        [0, 0, 0, 1]
      ], 'sparse')
    const b = math.matrix([
      [1],
      [2],
      [3],
      [4]
    ], 'sparse')

    const x = math.usolveAll(m, b)

    assert(x[0] instanceof math.Matrix)
    approxDeepEqual(x, [math.matrix([[-1], [-1], [-1], [4]])])
  })

  it('should return an empty array when there is no solution', function () {
    assert.deepStrictEqual([], math.usolveAll([[1, 1], [0, 0]], [1, 1]))
    assert.deepStrictEqual([], math.usolveAll(math.matrix([[1, 1], [0, 0]], 'dense'), [1, 1]))
    assert.deepStrictEqual([], math.usolveAll(math.matrix([[1, 1], [0, 0]], 'sparse'), [1, 1]))
  })

  it('should solve systems with singular dense matrices', function () {
    approxDeepEqual(
      math.usolveAll([[1, 1, -1], [0, 0, 1], [0, 0, 2]], [1, 2, 4]),
      [[[3], [0], [2]], [[2], [1], [2]]]
    )

    approxDeepEqual(
      math.usolveAll([[0, 1, 2], [0, 1, 1], [0, 0, 0]], [2, 2, 0]),
      [[[0], [2], [0]], [[1], [2], [0]]]
    )

    approxDeepEqual(
      math.usolveAll([[0, 1, 1], [0, 1, 1], [0, 0, 0]], [2, 2, 0]),
      [[[0], [2], [0]], [[0], [1], [1]], [[1], [2], [0]]]
    )
  })

  it('should solve systems with singular sparse matrices', function () {
    approxDeepEqual(
      math.usolveAll(math.matrix([[1, 1, -1], [0, 0, 1], [0, 0, 2]], 'sparse'), [1, 2, 4]),
      [math.matrix([[3], [0], [2]]), math.matrix([[2], [1], [2]])]
    )

    approxDeepEqual(
      math.usolveAll(math.matrix([[0, 1, 2], [0, 1, 1], [0, 0, 0]], 'sparse'), [2, 2, 0]),
      [math.matrix([[0], [2], [0]]), math.matrix([[1], [2], [0]])]
    )

    approxDeepEqual(
      math.usolveAll(math.matrix([[0, 1, 1], [0, 1, 1], [0, 0, 0]], 'sparse'), [2, 2, 0]),
      [math.matrix([[0], [2], [0]]), math.matrix([[0], [1], [1]]), math.matrix([[1], [2], [0]])]
    )
  })
})
