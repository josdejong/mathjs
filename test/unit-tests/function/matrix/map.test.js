import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('map', function () {
  it('should apply map to all elements of the matrix', function () {
    const m = math.matrix([[1, 2, 3], [4, 5, 6]])
    const m2 = math.map(m, function (value) { return value * 2 })
    assert.deepStrictEqual(m2.valueOf(), [[2, 4, 6], [8, 10, 12]])
    assert.ok(m2 instanceof math.Matrix)
  })

  it('should apply deep-map to all elements in the array', function () {
    const arr = [[1, 2, 3], [4, 5, 6]]
    const arr2 = math.map(arr, function (value) { return value * 2 })
    assert.deepStrictEqual(arr2, [[2, 4, 6], [8, 10, 12]])
    assert.ok(Array.isArray(arr2))
  })

  it('should invoke callback with parameters value, index, obj', function () {
    const arr = [[1, 2, 3], [4, 5, 6]]

    assert.deepStrictEqual(math.map(arr, function (value, index, obj) {
      // we don't clone index here, this should return a copy with every iteration
      return [value, index, obj === arr]
    }).valueOf(), [
      [
        [1, [0, 0], true],
        [2, [0, 1], true],
        [3, [0, 2], true]
      ],
      [
        [4, [1, 0], true],
        [5, [1, 1], true],
        [6, [1, 2], true]
      ]
    ])
  })

  it('should invoke a typed function with correct number of arguments (1)', function () {
    const output = math.map([1, 2, 3], math.typed('callback', {
      number: function (value) {
        return value + 2
      }
    }))
    assert.deepStrictEqual(output, [3, 4, 5])
  })

  it('should invoke a typed function with correct number of arguments (2)', function () {
    const output = math.map([1, 2, 3], math.typed('callback', {
      'number, Array': function (value, index) {
        return value + 2
      }
    }))
    assert.deepStrictEqual(output, [3, 4, 5])
  })

  it('should invoke a typed function with correct number of arguments (3)', function () {
    const output = math.map([1, 2, 3], math.typed('callback', {
      'number, Array, Array': function (value, index, array) {
        return value + 2
      }
    }))
    assert.deepStrictEqual(output, [3, 4, 5])
  })

  it('should invoke a typed function with correct number of arguments (4)', function () {
    // cbrt has a syntax cbrt(x, allRoots), but it should invoke cbrt(x) here
    assert.deepStrictEqual(math.map([1, 8, 27], math.cbrt), [1, 2, 3])
  })

  it('should invoke a typed function with correct number of arguments (5)', function () {
    // cbrt has a syntax cbrt(x, allRoots), but it should invoke cbrt(x) here
    assert.deepStrictEqual(math.map([1, 8, 27], math.format), ['1', '8', '27'])
  })

  it('should throw an error if called with unsupported type', function () {
    assert.throws(function () { math.map(1, function () {}) })
    assert.throws(function () { math.map('arr', function () {}) })
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { math.map([1, 2, 3]) })
  })

  it('should throw an error if the callback argument types are incorrect (1)', function () {
    assert.throws(() => math.map([1, 2, 3], math.equalText),
      /Function map cannot apply callback arguments to function equalText: Unexpected type of argument in function compareText \(expected: string or Array or Matrix, actual: number, index: 0\)/)
  })

  it('should throw an error if the callback argument types are incorrect (2)', function () {
    assert.throws(() => math.map([math.sin, 2, 3], math.sqrt),
      /TypeError: Function map cannot apply callback arguments sqrt\(value: function, index: Array, array: Array\) at index \[0]/)
  })

  it('should operate from the parser', function () {
    assert.deepStrictEqual(
      math.evaluate('map([1,2,3], square)'),
      math.matrix([1, 4, 9]))
    assert.deepStrictEqual(
      math.evaluate('map([1,2,3], f(x) = format(x))'),
      math.matrix(['1', '2', '3']))
  })

  it('should LaTeX map', function () {
    const expression = math.parse('map([1,2,3],callback)')
    assert.strictEqual(expression.toTex(), '\\mathrm{map}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}, callback\\right)')
  })
})
