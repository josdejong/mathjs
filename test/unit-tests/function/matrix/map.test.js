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

  it('should throw an error if called with unsupported type', function () {
    assert.throws(function () { math.map(1, function () {}) })
    assert.throws(function () { math.map('arr', function () {}) })
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { math.map([1, 2, 3]) })
  })

  it('should LaTeX map', function () {
    const expression = math.parse('map([1,2,3],callback)')
    assert.strictEqual(expression.toTex(), '\\mathrm{map}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}, callback\\right)')
  })
})
