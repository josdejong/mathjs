import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber

describe('diag', function () {
  it('should return a diagonal matrix on the default diagonal', function () {
    assert.deepStrictEqual(math.diag([1, 2, 3]), [[1, 0, 0], [0, 2, 0], [0, 0, 3]])
    assert.deepStrictEqual(math.diag([[1, 2, 3], [4, 5, 6]]), [1, 5])
  })

  it('should return a diagonal matrix on the default diagonal, dense matrix', function () {
    assert.deepStrictEqual(math.diag([1, 2, 3], 'dense'), math.matrix([[1, 0, 0], [0, 2, 0], [0, 0, 3]], 'dense'))
    assert.deepStrictEqual(math.diag(math.matrix([[1, 2, 3], [4, 5, 6]], 'dense')), math.matrix([1, 5], 'dense'))
  })

  it('should return a diagonal matrix on the default diagonal, sparse matrix', function () {
    assert.deepStrictEqual(math.diag([1, 2, 3], 'sparse'), math.matrix([[1, 0, 0], [0, 2, 0], [0, 0, 3]], 'sparse'))
    assert.deepStrictEqual(math.diag(math.matrix([[1, 2, 3], [4, 5, 6]], 'sparse')), math.matrix([1, 5], 'sparse'))
  })

  it('should return a array output on array input', function () {
    assert.deepStrictEqual(math.diag([1, 2]), [[1, 0], [0, 2]])
  })

  it('should return a matrix output on matrix input', function () {
    assert.deepStrictEqual(math.diag(math.matrix([1, 2])), math.matrix([[1, 0], [0, 2]]))
    assert.deepStrictEqual(math.diag(math.matrix([[1, 2], [3, 4]])), math.matrix([1, 4]))
  })

  it('should put vector on given diagonal k in returned matrix', function () {
    assert.deepStrictEqual(math.diag([1, 2, 3], 1), [[0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3]])
    assert.deepStrictEqual(math.diag([1, 2, 3], -1), [[0, 0, 0], [1, 0, 0], [0, 2, 0], [0, 0, 3]])
  })

  it('should return diagonal k from a matrix', function () {
    assert.deepStrictEqual(math.diag([[1, 2, 3], [4, 5, 6]], 1), [2, 6])
    assert.deepStrictEqual(math.diag([[1, 2, 3], [4, 5, 6]], -1), [4])
    assert.deepStrictEqual(math.diag([[1, 2, 3], [4, 5, 6]], -2), [])
  })

  it('should throw an error in case of invalid k', function () {
    assert.throws(function () { math.diag([[1, 2, 3], [4, 5, 6]], 2.4) }, /Second parameter in function diag must be an integer/)
  })

  describe('bignumber', function () {
    const array123 = [bignumber(1), bignumber(2), bignumber(3)]
    const array123456 = [
      [bignumber(1), bignumber(2), bignumber(3)],
      [bignumber(4), bignumber(5), bignumber(6)]
    ]

    it('should return a diagonal matrix on the default diagonal', function () {
      assert.deepStrictEqual(math.diag(array123),
        [
          [bignumber(1), bignumber(0), bignumber(0)],
          [bignumber(0), bignumber(2), bignumber(0)],
          [bignumber(0), bignumber(0), bignumber(3)]
        ])

      assert.deepStrictEqual(math.diag(array123456), [bignumber(1), bignumber(5)])
    })

    it('should return a array output on array input', function () {
      assert.deepStrictEqual(math.diag([bignumber(1), bignumber(2)]),
        [
          [bignumber(1), bignumber(0)],
          [bignumber(0), bignumber(2)]
        ])
    })

    it('should return a matrix output on matrix input', function () {
      assert.deepStrictEqual(math.diag(math.matrix([bignumber(1), bignumber(2)])),
        math.matrix([
          [bignumber(1), bignumber(0)],
          [bignumber(0), bignumber(2)]
        ]))
      assert.deepStrictEqual(math.diag(math.matrix([
        [bignumber(1), bignumber(2)],
        [bignumber(3), bignumber(4)]
      ])), math.matrix([bignumber(1), bignumber(4)]))
    })

    it('should put vector on given diagonal k in returned matrix', function () {
      assert.deepStrictEqual(math.diag(array123, bignumber(1)), [
        [bignumber(0), bignumber(1), bignumber(0), bignumber(0)],
        [bignumber(0), bignumber(0), bignumber(2), bignumber(0)],
        [bignumber(0), bignumber(0), bignumber(0), bignumber(3)]
      ])
      assert.deepStrictEqual(math.diag(array123, bignumber(-1)), [
        [bignumber(0), bignumber(0), bignumber(0)],
        [bignumber(1), bignumber(0), bignumber(0)],
        [bignumber(0), bignumber(2), bignumber(0)],
        [bignumber(0), bignumber(0), bignumber(3)]
      ])
    })

    it('should return diagonal k from a matrix', function () {
      assert.deepStrictEqual(math.diag(array123456, bignumber(1)), [bignumber(2), bignumber(6)])
      assert.deepStrictEqual(math.diag(array123456, bignumber(-1)), [bignumber(4)])
      assert.deepStrictEqual(math.diag(array123456, bignumber(-2)), [])
    })
  })

  it('should throw an error of the input matrix is not valid', function () {
    assert.throws(function () { math.diag([[[1], [2]], [[3], [4]]]) })
    // TODO: test diag for all types of input (also scalar)
  })

  it('should throw an error in case of wrong number of arguments', function () {
    assert.throws(function () { math.diag() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.diag([], 2, 'dense', 4) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { math.diag(2) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { math.diag([], new Date()) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX diag', function () {
    const expr1 = math.parse('diag([1,2,3])')
    const expr2 = math.parse('diag([1,2,3],1)')

    assert.strictEqual(expr1.toTex(), '\\mathrm{diag}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}\\right)')
    assert.strictEqual(expr2.toTex(), '\\mathrm{diag}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix},1\\right)')
  })
})
