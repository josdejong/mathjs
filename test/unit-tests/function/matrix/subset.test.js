import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { DimensionError } from '../../../../src/error/DimensionError.js'
import sinon from 'sinon'

const subset = math.subset
const matrix = math.matrix
const Range = math.Range
const index = math.index

describe('subset', function () {
  const a = [[1, 2], [3, 4]]
  const b = math.matrix(a)

  it('should get the right subset of an array', function () {
    assert.deepStrictEqual(subset(a, index(new Range(0, 2), 1)), [2, 4])
    assert.deepStrictEqual(subset(a, index(1, 0)), 3)
    assert.deepStrictEqual(subset([math.bignumber(2)], index(0)), math.bignumber(2))
  })

  it('should get the right subset of an array of booleans', function () {
    assert.deepStrictEqual(subset(a, index([true, true], [1])), [[2], [4]])
    assert.deepStrictEqual(subset(a, index([false, true], [true, false])), [[3]])
    assert.deepStrictEqual(subset([math.bignumber(2)], index([true])), [math.bignumber(2)])
  })

  it('should return an empty value with an empty index', function () {
    assert.deepStrictEqual(subset(a, index([], 1)), [])
    assert.deepStrictEqual(subset(a, index(new math.Range(0, 0), 1)), [])
    assert.deepStrictEqual(subset(b, index([], 1)), math.matrix())
    assert.deepStrictEqual(subset(b, index(new math.Range(0, 0), 1)), math.matrix())
    assert.deepStrictEqual(subset({ a: 1 }, index('')), undefined)
    assert.deepStrictEqual(subset('hello', index('')), '')
  })

  it('should get the right subset of an array of booleans in the parser', function () {
    assert.deepStrictEqual(math.evaluate('a[[true, true], 2]', { a }), [2, 4])
    assert.deepStrictEqual(math.evaluate('a[[false, true], [true, false]]', { a }), [[3]])
    assert.deepStrictEqual(math.evaluate('[bignumber(2)][[true]]'), math.matrix([math.bignumber(2)]))
  })

  it('should throw an error if the array of booleans doesn\'t have the same size as the array', function () {
    assert.throws(function () { subset(a, index([true], 0)) }, DimensionError)
    assert.throws(function () { subset(a, index([true, true, false], 1)) }, DimensionError)
    assert.throws(function () { subset(a, index(0, [true])) }, DimensionError)
    assert.throws(function () { subset(a, index(0, [true, true, false])) }, DimensionError)
    assert.throws(function () { subset(b, index([true], 0)) }, DimensionError)
    assert.throws(function () { subset(b, index([true, true, false], 1)) }, DimensionError)
    assert.throws(function () { subset(b, index(0, [true])) }, DimensionError)
    assert.throws(function () { subset(b, index(0, [true, true, false])) }, DimensionError)
  })

  it('should return an empty value with an empty index in the parser', function () {
    assert.deepStrictEqual(math.evaluate('a[[],1]', { a }), [])
    assert.deepStrictEqual(math.evaluate('b[[],1]', { b }), math.matrix())
    // TODO: add test for objects and strings: currently throws no access property when it's ""
  })

  it('should throw an error if trying to access an invalid subset of an array', function () {
    assert.throws(function () { subset(a, index(6, 0)) }, RangeError)
    assert.throws(function () { subset(a, index(1)) }, RangeError)
    assert.throws(function () { subset(a, index(1, 0, 0)) }, RangeError)
    assert.throws(function () { subset(a, index(1.3, 0)) }, TypeError)
  })

  it('should get the right subset of an object', function () {
    const obj = { foo: 'bar' }
    assert.deepStrictEqual(subset(obj, index('foo')), 'bar')
    assert.deepStrictEqual(subset(obj, index('bla')), undefined)
  })

  it('should throw an error in case of an invalid subset for an object', function () {
    const obj = { foo: 'bar' }
    const i = index('a', 'b')
    assert.throws(function () { subset(obj, i) }, /DimensionError/)
    assert.throws(function () { subset(obj, 'notAnIndex') }, /TypeError.*/)
  })

  it('should get the right subset of a matrix', function () {
    assert.deepStrictEqual(subset(b, index(new Range(0, 2), 1)), matrix([2, 4]))
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

  it('should leave arrays as such if the index is empty', function () {
    assert.deepStrictEqual(subset(d, index([], 1), 1), d)
    assert.deepStrictEqual(subset(d, index(1, new Range(0, 0)), 1), d)
    assert.deepStrictEqual(subset(d, index([], 1), 1, 1), d)
    assert.deepStrictEqual(subset(d, index(1, new Range(0, 0)), 1, 1), d)
    assert.deepStrictEqual(subset(g, index([], 1), 1), g)
    assert.deepStrictEqual(subset(g, index(1, new Range(0, 0)), 1), g)
    assert.deepStrictEqual(subset(g, index([], 1), 1, 1), g)
    assert.deepStrictEqual(subset(g, index(1, new Range(0, 0)), 1, 1), g)
    assert.deepStrictEqual(subset('hello', index([]), 'x'), 'hello')
    assert.deepStrictEqual(subset('hello', index([]), 'x', 'x'), 'hello')
  })

  it('should set the right subset of an array if the replacement can be broadcasted to the index', function () {
    assert.deepStrictEqual(d, [[1, 2], [3, 4]])
    assert.deepStrictEqual(subset(d, index(new Range(0, 2), 1), -2), [[1, -2], [3, -2]])
    assert.deepStrictEqual(d, [[1, 2], [3, 4]])
    assert.deepStrictEqual(subset(d, index(2, new Range(0, 2)), [5]), [[1, 2], [3, 4], [5, 5]])
    assert.deepStrictEqual(d, [[1, 2], [3, 4]])
    assert.deepStrictEqual(subset(d, index(0, [0, 1]), 123), [[123, 123], [3, 4]])
  })

  it('should set the right subset of an array or matrix with default value if the replacement can\'t be broadcasted to the index', function () {
    assert.deepStrictEqual(subset(d, index(2, 1), 7, 0), [[1, 2], [3, 4], [0, 7]])
    assert.deepStrictEqual(subset(g, index(2, 1), 7, 0), math.matrix([[1, 2], [3, 4], [0, 7]]))
    assert.deepStrictEqual(subset(d, index(1, 2), 7, 0), [[1, 2, 0], [3, 4, 7]])
    assert.deepStrictEqual(subset(g, index(1, 2), 7, 0), math.matrix([[1, 2, 0], [3, 4, 7]]))
  })

  it('should set a subset of an array with undefined default value', function () {
    const a = []
    assert.deepStrictEqual(subset(a, index(2), 1), [0, 0, 1])
    assert.deepStrictEqual(subset(a, index(2), 1, null), [null, null, 1])
  })

  it('should set a subset of an array or matrix by broadcasting the replacement', function () {
    assert.deepStrictEqual(subset(d, index([0, 1], 1), -2), [[1, -2], [3, -2]])
    assert.deepStrictEqual(subset(d, index(new Range(0, 2), 1), -2), [[1, -2], [3, -2]])
    assert.deepStrictEqual(subset(g, index([0, 1], 1), -2), math.matrix([[1, -2], [3, -2]]))
    assert.deepStrictEqual(subset(g, index(new Range(0, 2), 1), -2), math.matrix([[1, -2], [3, -2]]))
  })

  it('should throw an error if setting the subset of an array with an invalid array of booleans', function () {
    assert.throws(function () { subset(d, index([true], 0), 123) }, DimensionError)
    assert.throws(function () { subset(d, index(0, [true, false, true]), 123) }, DimensionError)
    assert.throws(function () { subset(g, index([true], 0), 123) }, DimensionError)
    assert.throws(function () { subset(g, index(0, [true, false, true]), 123) }, DimensionError)
    assert.throws(function () { subset(d, index([true], 0), 123, 1) }, DimensionError)
    assert.throws(function () { subset(d, index(0, [true, false, true]), 123, 1) }, DimensionError)
    assert.throws(function () { subset(g, index([true], 0), 123, 1) }, DimensionError)
    assert.throws(function () { subset(g, index(0, [true, false, true]), 123, 1) }, DimensionError)
  })

  it('should throw an error if setting the subset of an array with an invalid index', function () {
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
      const res2 = subset(obj, index(''), 'bar')
      assert.deepStrictEqual(res2, {}) // should leave the original object untouched
    })

    it('should throw an error when attempting to index an object with something other than a string', function () {
      const obj = { foo: 'bar' }
      assert.throws(function () { subset(obj, index(1)) }, /TypeError/)
      assert.throws(function () { subset(obj, index([1]), 1) }, /TypeError/)
      assert.throws(function () { subset(obj, index([true]), 1, 1) }, /TypeError/)
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
      assert.throws(function () { subset('hello', 2, 'A', 'B') }, /TypeError: Unexpected type of argument/)
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
    assert.strictEqual(expression.toTex(), '\\mathrm{subset}\\left(\\begin{bmatrix}1\\end{bmatrix},\\mathrm{index}\\left(0,0\\right)\\right)')
  })

  it('should work with config legacySubset during deprecation', function () {
    const math2 = math.create()
    // Add a spy to temporarily disable console.warn
    const warnStub = sinon.stub(console, 'warn')

    math2.config({ legacySubset: true })

    // Test legacy syntax for getting a subset of a matrix
    const A = math2.matrix([[1, 2, 3], [4, 5, 6]])
    const index = math2.index
    assert.deepStrictEqual(math2.subset(A, index(1, 2)), 6)
    assert.deepStrictEqual(math2.subset(A, index([1], 2)), 6)
    assert.deepStrictEqual(math2.subset(A, index(1, [2])), 6)
    assert.deepStrictEqual(math2.subset(A, index([1], [2])), 6)
    assert.deepStrictEqual(math2.subset(A, index(1, [1, 2])).toArray(), [[5, 6]])
    assert.deepStrictEqual(math2.subset(A, index([0, 1], 1)).toArray(), [[2], [5]])

    math2.config({ legacySubset: false })
    // Test without legacy syntax
    assert.deepStrictEqual(math2.subset(A, index(1, 2)), 6)
    assert.deepStrictEqual(math2.subset(A, index([1], 2)).toArray(), [6])
    assert.deepStrictEqual(math2.subset(A, index(1, [2])).toArray(), [6])
    assert.deepStrictEqual(math2.subset(A, index([1], [2])).toArray(), [[6]])
    assert.deepStrictEqual(math2.subset(A, index(1, [1, 2])).toArray(), [5, 6])
    assert.deepStrictEqual(math2.subset(A, index([1], [1, 2])).toArray(), [[5, 6]])
    assert.deepStrictEqual(math2.subset(A, index([0, 1], 1)).toArray(), [2, 5])
    assert.deepStrictEqual(math2.subset(A, index([0, 1], [1])).toArray(), [[2], [5]])

    // Restore console.warn
    warnStub.restore()
  })
})
