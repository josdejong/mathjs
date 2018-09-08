const assert = require('assert')
const math = require('../../../src/main')
const subset = math.subset
const matrix = math.matrix
const Range = math.type.Range
const index = math.index

describe('subset', function () {
  const a = [[1, 2], [3, 4]]
  const b = math.matrix(a)

  it('should get the right subset of an array', function () {
    assert.deepStrictEqual(subset(a, index(new Range(0, 2), 1)), [[2], [4]])
    assert.deepStrictEqual(subset(a, index(1, 0)), 3)
    assert.deepStrictEqual(subset([math.bignumber(2)], index(0)), math.bignumber(2))
  })

  it('should throw an error if trying to access an invalid subset of an array', function () {
    assert.throws(function () { subset(a, index(6, 0)) }, RangeError)
    assert.throws(function () { subset(a, index(1)) }, RangeError)
    assert.throws(function () { subset(a, index(1, 0, 0)) }, RangeError)
    assert.throws(function () { subset(a, index(1.3, 0)) }, TypeError)
  })

  it('should get the right subset of an object', function () {
    const obj = { 'foo': 'bar' }
    assert.deepStrictEqual(subset(obj, index('foo')), 'bar')
    assert.deepStrictEqual(subset(obj, index('bla')), undefined)
  })

  it('should throw an error in case of an invalid subset for an object', function () {
    const obj = { 'foo': 'bar' }
    const i = index('a', 'b')
    assert.throws(function () { subset(obj, i) }, /DimensionError/)
  })

  it('should get the right subset of a matrix', function () {
    assert.deepStrictEqual(subset(b, index(new Range(0, 2), 1)), matrix([[2], [4]]))
    assert.deepStrictEqual(subset(b, index(1, 0)), 3)
  })

  it('should get a subset of a matrix returning a null or undefined value', function () {
    assert.deepStrictEqual(subset([0], index(0)), 0)
    assert.deepStrictEqual(subset([null], index(0)), null)
    assert.deepStrictEqual(subset([undefined], index(0)), undefined)

    assert.deepStrictEqual(subset([null, undefined], index(new Range(0, 2))), [null, undefined])
  })

  it('should throw an error if trying to access an invalid subset of a matrix', function () {
    assert.throws(function () { subset(b, index(6, 0)) }, RangeError)
    assert.throws(function () { subset(b, index(1)) }, RangeError)
    assert.throws(function () { subset(b, index(1, 0, 0)) }, RangeError)
    assert.throws(function () { subset(b, index(1.3, 0)) }, TypeError)
  })

  const d = [[1, 2], [3, 4]]
  const g = matrix([[1, 2], [3, 4]])

  // TODO: test getting subset of an array and matrix

  it('should set the right subset of an array', function () {
    assert.deepStrictEqual(d, [[1, 2], [3, 4]])
    assert.deepStrictEqual(subset(d, index(new Range(0, 2), 1), [[-2], [-4]]), [[1, -2], [3, -4]])
    assert.deepStrictEqual(d, [[1, 2], [3, 4]])
    assert.deepStrictEqual(subset(d, index(2, new Range(0, 2)), [[5, 6]]), [[1, 2], [3, 4], [5, 6]])
    assert.deepStrictEqual(d, [[1, 2], [3, 4]])
    assert.deepStrictEqual(subset(d, index(0, 0), 123), [[123, 2], [3, 4]])
  })

  it('should set a subset of an array with undefined default value', function () {
    const a = []
    assert.deepStrictEqual(subset(a, index(2), 1), [0, 0, 1])
    assert.deepStrictEqual(subset(a, index(2), 1, null), [null, null, 1])
  })

  it('should throw an error if setting the subset of an array with an invalid replacement', function () {
    assert.throws(function () { subset(d, index(1), 123) }, RangeError)
    assert.throws(function () { subset(d, index(1.3, 0), 123) }, TypeError)
  })

  it('should set the right subset of a matrix', function () {
    assert.deepStrictEqual(g, matrix([[1, 2], [3, 4]]))
    assert.deepStrictEqual(subset(g, index(new Range(0, 2), 1), [[-2], [-4]]), matrix([[1, -2], [3, -4]]))
    assert.deepStrictEqual(g, matrix([[1, 2], [3, 4]]))
    assert.deepStrictEqual(subset(g, index(2, new Range(0, 2)), [[5, 6]]), matrix([[1, 2], [3, 4], [5, 6]]))
  })

  it('should throw an error if setting the subset of a matrix with an invalid replacement', function () {
    assert.throws(function () { subset(d, index(1), 123) }, RangeError)
    assert.throws(function () { subset(d, index(1.3, 0), 123) }, TypeError)
  })

  describe('string', function () {
    it('should get the right subset of a string', function () {
      assert.deepStrictEqual(subset('hello', index(1)), 'e')
      assert.deepStrictEqual(subset('hello', index(new Range(4, -1, -1))), 'olleh')
    })

    it('should throw an error if trying to access an invalid subset of a string', function () {
      // assert.throws(function () {subset('hello', 1);}, TypeError)
      assert.throws(function () { subset('hello', index([6])) }, RangeError)
      assert.throws(function () { subset('hello', index([-2])) }, RangeError)
      assert.throws(function () { subset('hello', index([1.3])) }, TypeError)
    })

    it('should set the right subset of a string', function () {
      const j = 'hello'
      assert.deepStrictEqual(subset(j, index(0), 'H'), 'Hello')
      assert.deepStrictEqual(j, 'hello')
      assert.deepStrictEqual(subset(j, index(5), '!'), 'hello!')
      assert.deepStrictEqual(j, 'hello')
      assert.deepStrictEqual(subset(j, index(new Range(5, 11)), ' world'), 'hello world')
      assert.deepStrictEqual(j, 'hello')
    })

    it('should throw an error when index is out of range for a string', function () {
      assert.throws(function () { subset('hello', index(5)) }, /Index out of range/)
      assert.throws(function () { subset('hello', index(-1)) }, /Index out of range/)
    })

    it('should set the right subset of a string with resizing', function () {
      const j = ''
      const defaultValue = 'i'
      assert.deepStrictEqual(subset(j, index(5), '!', defaultValue), 'iiiii!')
    })

    it('should set a property of an object', function () {
      const obj = {}
      const res = subset(obj, index('foo'), 'bar')
      assert.deepStrictEqual(res, { foo: 'bar' })
      assert.deepStrictEqual(obj, {}) // should leave the original object untouched
    })

    it('should throw an error if setting the subset of a string with an invalid replacement', function () {
      assert.throws(function () { subset('hello', index([1, 2]), '1234') }, RangeError)
      assert.throws(function () { subset('hello', index(1, 2), 'a') }, RangeError)
    })

    it('should throw an error if in case of dimensions mismatch', function () {
      assert.throws(function () { subset('hello', index(1, 2)) }, /Dimension mismatch/)
      assert.throws(function () { subset('hello', index(1, 2), 'a') }, /Dimension mismatch/)
    })

    it('should throw an error if in case of a default value with length > 0', function () {
      assert.throws(function () { subset('hello', index(10), '!', 'foo') }, /Single character expected as defaultValue/)
    })

    it('should throw an error if in case of an invalid index type', function () {
      assert.throws(function () { subset('hello', 2) }, /TypeError: Unexpected type of argument/)
      assert.throws(function () { subset('hello', 2, 'A') }, /TypeError: Unexpected type of argument/)
    })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { subset() }, /TypeError: Too few arguments/)
    assert.throws(function () { subset(d) }, /TypeError: Too few arguments/)
    assert.throws(function () { subset(d, index(0, 0), 1, 0, 5) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { subset([1, 2], [0]) }, /TypeError: Unexpected type of argument/)
    // assert.throws(function () {subset(new Date(), index(0))}, /TypeError: Unexpected type of argument/) // FIXME: should fail too. Problem is, Date is also an Object
    // assert.throws(function () {subset(/foo/, index(0))}, /TypeError: Unexpected type of argument/) // FIXME: should fail too. Problem is, Date is also an Object
  })

  it('should LaTeX subset', function () {
    const expression = math.parse('subset([1],index(0,0))')
    assert.strictEqual(expression.toTex(), '\\mathrm{subset}\\left(\\begin{bmatrix}1\\\\\\end{bmatrix},\\mathrm{index}\\left(0,0\\right)\\right)')
  })
})
