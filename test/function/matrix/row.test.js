const assert = require('assert')
const math = require('../../../src/main')
const matrix = math.matrix

describe('row', function () {
  const a = [
    [0, 2, 0, 0, 0],
    [0, 1, 0, 2, 4],
    [0, 0, 0, 0, 0],
    [8, 4, 0, 3, 0],
    [0, 0, 0, 6, 0]
  ]
  const m = matrix(a)

  it('should throw an error if the row is out of range', function () {
    assert.throws(function () {
      const r = m.row(9)
      assert.deepStrictEqual(
        r.valueOf(), [[0], [0], [0], [0], [0]]
      )
    }, /IndexError: Index out of range \(9 > 4\)/)
  })

  it('should throw an error if the row is not an integer', function () {
    assert.throws(function () {
      const r = m.row('x')
      assert.deepStrictEqual(
        r.valueOf(), [[0], [0], [0], [0], [0]]
      )
    }, /TypeError: Index must be an integer \(value: x\)/)
  })

  it('should throw an error if the matrix does not have two dimensions', function () {
    assert.throws(function () {
      const m = matrix([[[1, 2, 3]]])
      const r = m.row(0)
      assert.deepStrictEqual(
        r.valueOf(), [[0], [0], [0], [0], [0]]
      )
    }, /Error: Only two dimensional matrix is supported/)

    it('should return the first matrix row', function () {
      const r = m.row(0)
      assert.deepStrictEqual(
        r.valueOf(), [[0, 2, 0, 0, 0]]
      )
    })

    it('should return the first array row', function () {
      const r = a.row(0)
      assert.deepStrictEqual(
        r.valueOf(), [0, 2, 0, 0, 0]
      )
    })

    it('should return the last matrix row', function () {
      const r = m.row(4)
      assert.deepStrictEqual(
        r.valueOf(), [[0, 0, 0, 6, 0]]
      )
    })

    it('should return the last array row', function () {
      const r = a.row(4)
      assert.deepStrictEqual(
        r.valueOf(), [0, 0, 0, 6, 0]
      )
    })

    it('should return an intermediate matrix row', function () {
      const r = m.row(1)
      assert.deepStrictEqual(
        r.valueOf(), [[0, 1, 0, 2, 4]]
      )
    })

    it('should return an intermediate array row', function () {
      const r = m.row(1)
      assert.deepStrictEqual(
        r.valueOf(), [0, 1, 0, 2, 4]
      )
    })

    it('should return an empty matrix row', function () {
      const r = m.row(2)
      assert.deepStrictEqual(
        r.valueOf(), [[0, 0, 0, 0, 0]]
      )
    })

    it('should return an empty array row', function () {
      const r = m.row(2)
      assert.deepStrictEqual(
        r.valueOf(), [0, 0, 0, 0, 0]
      )
    })
  })
})
