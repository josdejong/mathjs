import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('forEach', function () {
  it('should iterate over all elements of the matrix', function () {
    const m = math.matrix([1, 2, 3])
    const output = []
    math.forEach(m, function (value) { output.push(value) })
    assert.deepStrictEqual(output, [1, 2, 3])
  })

  it('should iterate deep over all elements in the array', function () {
    const arr = [1, 2, 3]
    const output = []
    math.forEach(arr, function (value) { output.push(value) })
    assert.deepStrictEqual(output, [1, 2, 3])
  })

  it('should invoke a typed function with correct number of arguments (1)', function () {
    const output = []
    math.forEach([1, 2, 3], math.typed('callback', {
      number: function (value) {
        output.push([value, arguments.length])
      }
    }))
    assert.deepStrictEqual(output, [
      [1, 1],
      [2, 1],
      [3, 1]
    ])
  })

  it('should invoke a typed function with correct number of arguments (2)', function () {
    const arr = [1, 2, 3]
    const output = []
    math.forEach(arr, math.typed('callback', {
      'number, Array': function (value, index) {
        output.push([value, index, arguments.length])
      }
    }))
    assert.deepStrictEqual(output, [
      [1, [0], 2],
      [2, [1], 2],
      [3, [2], 2]
    ])
  })

  it('should invoke callback with 3 parameters (value, index, obj)', function () {
    const arr = [[1, 2, 3], [4, 5, 6]]
    const output = []

    math.forEach(arr, function (value, index, obj) {
      // note: we don't copy index, it should be a copy with each iteration
      output.push([value, index, obj === arr])
    })
    assert.deepStrictEqual(output, [
      [1, [0, 0], true],
      [2, [0, 1], true],
      [3, [0, 2], true],
      [4, [1, 0], true],
      [5, [1, 1], true],
      [6, [1, 2], true]
    ])
  })

  it('should invoke callback with 3 parameters when not providing explicit arguments', function () {
    const arr = [1, 2, 3]
    const output = []

    math.forEach(arr, function () {
      output.push(arguments.length)
    })

    assert.deepStrictEqual(output, [3, 3, 3])
  })

  it(
    'should not throw on empty arrays/matrices, with a typed callback',
    function () {
      const testCases = [
        [],
        [[]],
        [[], []],
        [[[]]],
        [[[], []]],
        [
          [[], []],
          [[], []]
        ],
        // We are going to wait until after discussion #3537 resolves to
        // settle on the expected behavior of the following two cases:
        // [[], [1]], // Empty 2nd dimension b/c 1st nested array is empty
        // [[1], []], // Non-empty 2nd dimension b/c 1st nested array non-empty

        math.matrix([]),
        math.matrix([[]]),
        math.matrix([[], []]),
        math.matrix([[[]]]),
        math.matrix([[[], []]]),
        math.matrix([
          [[], []],
          [[], []]
        ]),
        // The next is not a valid matrix because rows have different sizes
        // math.matrix([[], [1]]),
        math.matrix(), // empty matrix with size 0

        math.matrix([], 'sparse'),
        math.matrix([[]], 'sparse'),
        math.matrix([[], []], 'sparse')
      ]
      testCases.forEach(function (testCase) {
        assert.doesNotThrow(function () {
          math.forEach(
            testCase,
            math.typed('callback', {
              'any, any, any': function (value) {
                throw new Error(`Somehow callback was called on '${value}'`)
              }
            })
          )
        })
      })
    })

  it('should not throw an error on an empty array with a typed function', function () {
    assert.doesNotThrow(function () {
      math.forEach([], math.square)
    })
  })

  it('should not throw an error on an empty matrix with a typed function', function () {
    assert.doesNotThrow(function () {
      math.forEach(math.matrix([]), math.square)
    })
  })

  it('should throw an error if called with unsupported type', function () {
    assert.throws(function () { math.forEach(1, function () {}) })
    assert.throws(function () { math.forEach('arr', function () {}) })
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { math.forEach([1, 2, 3]) })
  })

  it('should LaTeX forEach', function () {
    const expression = math.parse('forEach([1,2,3],callback)')
    assert.strictEqual(expression.toTex(), '\\mathrm{forEach}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}, callback\\right)')
  })
})
