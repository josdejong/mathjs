// test Kronecker product
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('kron', function () {
  it('should calculate the Kronecker product of two arrays', function () {
    assert.deepStrictEqual(math.kron([[2]], [[3]]), [[6]])
    assert.deepStrictEqual(math.kron([
      [1, -2, 1],
      [1, 1, 0]
    ], [
      [1, 0],
      [0, 1]
    ]), [
      [1, 0, -2, -0, 1, 0],
      [0, 1, -0, -2, 0, 1],
      [1, 0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0, 0]
    ])
    assert.deepStrictEqual(math.kron([
      [53, 12, -9, 0],
      [2, 2, 5, 2]
    ], [
      [99, 56, 22, 7]
    ]), [
      [5247, 2968, 1166, 371, 1188, 672, 264, 84, -891, -504, -198, -63, 0, 0, 0, 0],
      [198, 112, 44, 14, 198, 112, 44, 14, 495, 280, 110, 35, 198, 112, 44, 14]
    ])
  })

  it('should calculate product for empty 1D Arrays', function () {
    assert.deepStrictEqual(math.kron([], []), [])
  })

  it('should calculate product for empty 2D Arrays', function () {
    assert.deepStrictEqual(math.kron([[]], [[]]), [[]])
  })

  it('should calculate product for 1D Arrays', function () {
    assert.deepStrictEqual(math.kron([2], [3]), [6])
    assert.deepStrictEqual(math.kron([1, 2], [3, 4]), [3, 4, 6, 8])
    assert.deepStrictEqual(math.kron([1, 2, 6, 8], [12, 1, 2, 3]), [12, 1, 2, 3, 24, 2, 4, 6, 72, 6, 12, 18, 96, 8, 16, 24])
  })

  it('should calculate product for 1D & 2D Arrays', function () {
    assert.deepStrictEqual(math.kron([1, 1], [[1, 0], [0, 1]]), [[1, 0, 1, 0], [0, 1, 0, 1]])
    assert.deepStrictEqual(math.kron([[1, 0], [0, 1]], [1, 1]), [[1, 1, 0, 0], [0, 0, 1, 1]])
    assert.deepStrictEqual(math.kron([[1, 2]], [[1, 2, 3]]), [[1, 2, 3, 2, 4, 6]])
    assert.deepStrictEqual(math.kron([[1], [2]], [[1], [2], [3]]), [[1], [2], [3], [2], [4], [6]])
    assert.deepStrictEqual(math.kron([[1, 2]], [[1], [2], [3]]), [[1, 2], [2, 4], [3, 6]])
    assert.deepStrictEqual(math.kron([[1], [2]], [[1, 2, 3]]), [[1, 2, 3], [2, 4, 6]])
  })

  it('should support complex numbers', function () {
    assert.deepStrictEqual(math.kron([
      [1, math.complex(0, 1)],
      [math.complex(0, 1), 2]
    ],
    [
      [2, 2],
      [2, 2]
    ]),
    [
      [2, 2, math.complex(0, 2), math.complex(0, 2)],
      [2, 2, math.complex(0, 2), math.complex(0, 2)],
      [math.complex(0, 2), math.complex(0, 2), 4, 4],
      [math.complex(0, 2), math.complex(0, 2), 4, 4]
    ])
  })

  it('should calculate a 3D Kronecker product', function () {
    assert.deepStrictEqual(
      math.kron([
        [[1, 2], [2, 3]],
        [[2, 3], [3, 4]]
      ], [
        [[4, 3], [3, 2]],
        [[3, 2], [2, 1]]
      ]), [
        /* eslint-disable no-multi-spaces, array-bracket-spacing */
        [[4, 3,  8, 6], [3, 2, 6, 4], [ 8, 6, 12,  9], [6, 4,  9, 6]],
        [[3, 2,  6, 4], [2, 1, 4, 2], [ 6, 4,  9,  6], [4, 2,  6, 3]],
        [[8, 6, 12, 9], [6, 4, 9, 6], [12, 9, 16, 12], [9, 6, 12, 8]],
        [[6, 4,  9, 6], [4, 2, 6, 3], [ 9, 6, 12,  8], [6, 3,  8, 4]]
        /* eslint-enable */
      ]
    )
  })

  it('should allow mixed-dimensional Kronecker products', function () {
    const b = [[[4, 3], [3, 2]], [[3, 2], [2, 1]]]
    const a = [1, 2]
    assert.deepStrictEqual(math.kron(a, b), math.kron([[a]], b))
    assert.deepStrictEqual(math.kron([a], b), math.kron([[a]], b))
    assert.deepStrictEqual(math.kron(b, a), math.kron(b, [[a]]))
    assert.deepStrictEqual(math.kron(b, [a]), math.kron(b, [[a]]))
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { math.kron() }, TypeError)
    assert.throws(function () { math.kron([[1, 2]]) }, TypeError)
  })

  describe('DenseMatrix', function () {
    it('should calculate the Kronecker product of a 2d matrix (1)', function () {
      const y = math.matrix([[1, 1], [1, 1]])
      const x = math.matrix([[1, 0], [0, 1]])
      const product = math.kron(x, y)
      assert.deepStrictEqual(product.valueOf(), [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]])
    })

    it('should calculate the Kronecker product of a 2d matrix (2)', function () {
      const y = math.matrix([[1, 2], [55, -1]])
      const x = math.matrix([[13, 0], [0, -1]])
      const product = math.kron(x, y)
      assert.deepStrictEqual(product.toArray(), [[13, 26, 0, 0], [715, -13, 0, -0], [0, 0, -1, -2], [0, -0, -55, 1]])
    })

    it('should calculate the Kronecker product of 3d matrices', function () {
      const y = math.matrix([[[3]]])
      const x = math.matrix([[[1, 1], [1, 1]], [[1, 1], [1, 1]]])
      const product = math.kron(x, y)
      assert.deepStrictEqual(
        product.toArray(), [[[3, 3], [3, 3]], [[3, 3], [3, 3]]])
    })
  })

  describe('SparseMatrix', function () {
    it('should calculate the Kronecker product of a 2d matrix (1)', function () {
      const y = math.sparse([[1, 1], [1, 1]])
      const x = math.sparse([[1, 0], [0, 1]])
      const product = math.kron(x, y)
      assert.deepStrictEqual(product.valueOf(), [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]])
    })

    it('should calculate the Kronecker product of a 2d matrix (2)', function () {
      const y = math.matrix([[1, 2], [55, -1]], 'sparse')
      const x = math.matrix([[13, 0], [0, -1]], 'sparse')
      const product = math.kron(x, y)
      assert.deepStrictEqual(product.toArray(), [[13, 26, 0, 0], [715, -13, 0, -0], [0, 0, -1, -2], [0, -0, -55, 1]])
    })
  })
})
