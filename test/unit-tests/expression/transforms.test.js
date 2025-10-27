// test transforms
import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { createMap } from '../../../src/utils/map.js'

const parse = math.parse

describe('transforms', function () {
  describe('filter', function () {
    it('should execute filter on an array with one based indices', function () {
      const logs = []
      const scope = {
        A: [1, 2, 3],
        callback: function (value, index, matrix) {
          assert.strictEqual(matrix, scope.A)
          // note: we don't copy index, index should be a new Array for every call of callback
          logs.push([value, index])
          return value > 1
        }
      }
      const res = math.evaluate('filter(A, callback)', scope)
      assert.deepStrictEqual(res, [2, 3])

      assert.deepStrictEqual(logs, [[1, [1]], [2, [2]], [3, [3]]])
    })

    it('should evaluate filter with a callback function', function () {
      const scope = {}
      parseAndEval('isPositive(x) = x > 0', scope)
      assert.deepStrictEqual(parseAndEval('filter([6, -2, -1, 4, 3], isPositive)', scope),
        math.matrix([6, 4, 3]))
    })

    it('should evaluate filter with an inline expression as callback (1)', function () {
      assert.deepStrictEqual(parseAndEval('filter([6, -2, -1, 4, 3], x > 0)'),
        math.matrix([6, 4, 3]))
    })

    it('should evaluate filter with an inline expression as callback (2)', function () {
      assert.deepStrictEqual(parseAndEval('filter([6, -2, -1, 4, 3], (x > 0))'),
        math.matrix([6, 4, 3]))
    })

    it('should evaluate filter with an inline expression as callback (3)', function () {
      assert.deepStrictEqual(parseAndEval('filter([6, -2, -1, 4, 3], f(x) = x > 0)'),
        math.matrix([6, 4, 3]))
    })

    it('should evaluate filter with an inline expression as callback (4)', function () {
      assert.deepStrictEqual(parseAndEval('filter([6, 0, 1, -0.2], boolean(x))'),
        math.matrix([6, 1, -0.2]))
    })
  })

  describe('map', function () {
    it('should execute map on an array with one based indices', function () {
      const logs = []
      const scope = {
        A: [1, 2, 3],
        callback: function (value, index, matrix) {
          assert.strictEqual(matrix, scope.A)
          // note: we don't copy index, index should be a new Array for every call of callback
          logs.push([value, index])
          return value + 1
        }
      }
      const res = math.evaluate('map(A, callback)', scope)
      assert.deepStrictEqual(res, [2, 3, 4])

      assert.deepStrictEqual(logs, [[1, [1]], [2, [2]], [3, [3]]])
    })

    it('should execute map on a Matrix with one based indices', function () {
      const logs = []
      const scope = {
        A: math.matrix([1, 2, 3]),
        callback: function (value, index, matrix) {
          assert.strictEqual(matrix, scope.A)
          // note: we don't copy index, index should be a new Array for every call of callback
          logs.push([value, index])
          return value + 1
        }
      }
      const res = math.evaluate('map(A, callback)', scope)
      assert.deepStrictEqual(res, math.matrix([2, 3, 4]))

      assert.deepStrictEqual(logs, [[1, [1]], [2, [2]], [3, [3]]])
    })

    it('should evaluate map with a callback', function () {
      assert.deepStrictEqual(parseAndEval('map([6, 2, 3], square)'),
        math.matrix([36, 4, 9]))
    })

    it('should evaluate map with an inline expression as callback (1)', function () {
      assert.deepStrictEqual(parseAndEval('map([6, -2, -1, 4, 3], x > 0)'),
        math.matrix([true, false, false, true, true]))
    })

    it('should evaluate map with an inline expression as callback (2)', function () {
      assert.deepStrictEqual(parseAndEval('map([6, -2, -1, 4, 3], (x > 0))'),
        math.matrix([true, false, false, true, true]))
    })

    it('should evaluate map with an inline expression as callback (3)', function () {
      assert.deepStrictEqual(parseAndEval('map([6, -2, -1, 4, 3], f(x) = x > 0)'),
        math.matrix([true, false, false, true, true]))
    })

    it('should evaluate map with an inline expression as callback (4)', function () {
      assert.deepStrictEqual(parseAndEval('map([6, -2, -1, 4, 3], f(x, index) = index[1])'),
        math.matrix([1, 2, 3, 4, 5]))
    })

    it('should evaluate map with an inline expression as callback (5)', function () {
      assert.deepStrictEqual(parseAndEval('map([6, 0, 1, -0.2], boolean(x))'),
        math.matrix([true, false, true, true]))
    })
  })

  describe('forEach', function () {
    it('should execute forEach on an array with one based indices', function () {
      const logs = []
      const scope = {
        A: [1, 2, 3],
        callback: function (value, index, matrix) {
          assert.strictEqual(matrix, scope.A)
          // note: we don't copy index, index should be a new Array for every call of callback
          logs.push([value, index])
        }
      }
      math.evaluate('forEach(A, callback)', scope)

      assert.deepStrictEqual(logs, [[1, [1]], [2, [2]], [3, [3]]])
    })

    it('should execute forEach on a Matrix with one based indices', function () {
      const logs = []
      const scope = {
        A: math.matrix([1, 2, 3]),
        callback: function (value, index, matrix) {
          assert.strictEqual(matrix, scope.A)
          // note: we don't copy index, index should be a new Array for every call of callback
          logs.push([value, index])
        }
      }
      math.evaluate('forEach(A, callback)', scope)

      assert.deepStrictEqual(logs, [[1, [1]], [2, [2]], [3, [3]]])
    })

    it('should evaluate forEach with an inline expression as callback (1)', function () {
      const logs1 = []
      const scope = {
        callback: function (value) {
          assert.strictEqual(arguments.length, 1)
          logs1.push(value)
        }
      }
      parseAndEval('forEach([6, -2, -1, 4, 3], callback(x + 1))', scope)
      assert.deepStrictEqual(logs1, [7, -1, 0, 5, 4])
    })

    it('should evaluate forEach with an inline expression as callback (2)', function () {
      const logs1 = []
      const scope = {
        callback: function (value) {
          assert.strictEqual(arguments.length, 1)
          logs1.push(value)
        },
        noop: function () {}
      }
      parseAndEval('forEach([6, -2, -1, 4, 3], x > 0 ? callback(x) : noop())', scope)
      assert.deepStrictEqual(logs1, [6, 4, 3])
    })
  })

  describe('empty arrays and matrices', function () {
    const testCases = [
      '[]',
      '[[]]',
      '[[], []]',
      '[[[]]]',
      '[[[], []]]',
      '[[[], []],[[], []]]',

      'matrix()', // empty matrix with size 0
      'matrix([[], []])', // Equivalent to one above, but just to be careful
      'matrix([], "sparse")',
      'matrix([[]], "sparse")',
      'matrix([[], []], "sparse")'
    ]

    describe('with untyped callbacks', function () {
      it('filter should return an empty array on empty input', function () {
        assert.deepStrictEqual(
          parseAndEval('filter([], x > 0)'),
          math.matrix([])
        )
      })

      it('map should return the input unchanged on empty input', function () {
        testCases.forEach(function (testCase) {
          assert.deepStrictEqual(
            parseAndEval(`map(${testCase}, x > 0)`),
            parseAndEval(testCase)
          )
        })
      })

      it('forEach should not throw on empty input', function () {
        testCases.forEach(function (testCase) {
          assert.doesNotThrow(() => {
            parseAndEval(`forEach(${testCase}, x > 0)`)
          })
        })
      })
    })

    describe('with typed callbacks', function () {
      it('should return an empty array when filtering an empty array', function () {
        assert.deepStrictEqual(
          parseAndEval('filter([], f(x) = x > 0)'),
          math.matrix([])
        )
      })

      it('map should return the input unchanged on empty input', function () {
        testCases.forEach(function (testCase) {
          assert.deepStrictEqual(
            parseAndEval(`map(${testCase}, f(x) = x > 0)`),
            parseAndEval(testCase)
          )
        })
      })

      it('forEach should not throw on empty input', function () {
        testCases.forEach(function (testCase) {
          assert.doesNotThrow(() => {
            parseAndEval(`forEach(${testCase}, f(x) = x > 0)`)
          })
        })
      })
    })
  })

  // TODO: test transforms more thoroughly
})

/**
 * Helper function to parse an expression and immediately evaluate its results
 * @param {String} expr
 * @param {Object} [scope]
 * @return {*} result
 */
function parseAndEval (expr, scope) {
  return parse(expr).evaluate(createMap(scope))
}
