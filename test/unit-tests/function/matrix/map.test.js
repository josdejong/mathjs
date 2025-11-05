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

  it('should map two arrays', function () {
    const arrA = [[1, 2, 3], [4, 5, 6]]
    const arrB = [[10, 20, 30], [40, 50, 60]]
    const callback = function (valueA, valueB) { return valueA * 2 + valueB }
    const arr2 = math.map(arrA, arrB, callback)
    const expected = [[12, 24, 36], [48, 60, 72]]
    assert.deepStrictEqual(arr2, expected)
    assert.ok(Array.isArray(arr2))
    const arr3 = math.map(arrA, arrB, math.typed({ 'number, number': callback }))
    assert.deepStrictEqual(arr3, expected)
    assert.ok(Array.isArray(arr3))
  })

  it('should map three arrays', function () {
    const arrA = [[1, 2, 3], [4, 5, 6]]
    const arrB = [[10, 20, 30], [40, 50, 60]]
    const arrC = [[100, 200, 300], [400, 500, 600]]
    const expected = [[112, 224, 336], [448, 560, 672]]
    const callback = function (valueA, valueB, valueC) { return valueA * 2 + valueB + valueC }
    const arr2 = math.map(arrA, arrB, arrC, callback)
    assert.deepStrictEqual(arr2, expected)
    assert.ok(Array.isArray(arr2))
    const arr3 = math.map(arrA, arrB, arrC, math.typed({ 'number, number, number': callback }))
    assert.deepStrictEqual(arr3, expected)
    assert.ok(Array.isArray(arr3))
  })

  it('should map three arrays with broadcasting', function () {
    const arrA = [1, 2, 3]
    const arrB = [[10], [20], [30]]
    const arrC = [100, 200, 300]
    const arr2 = math.map(arrA, arrB, arrC, function (valueA, valueB, valueC) { return valueA * 2 + valueB + valueC / 2 })
    assert.deepStrictEqual(arr2, [[62, 114, 166], [72, 124, 176], [82, 134, 186]])
    assert.ok(Array.isArray(arr2))
  })

  it('should map two matrices', function () {
    const matA = math.matrix([[1, 2, 3], [4, 5, 6]])
    const matB = math.matrix([[10, 20, 30], [40, 50, 60]])
    const mat2 = math.map(matA, matB, function (valueA, valueB) { return valueA * 2 + valueB })
    assert.deepStrictEqual(mat2, math.matrix([[12, 24, 36], [48, 60, 72]]))
    assert.ok(mat2 instanceof math.Matrix)
  })

  it('should map three matrices', function () {
    const matA = math.matrix([[1, 2, 3], [4, 5, 6]])
    const matB = math.matrix([[10, 20, 30], [40, 50, 60]])
    const matC = math.matrix([[100, 200, 300], [400, 500, 600]])
    const expected = math.matrix([[112, 224, 336], [448, 560, 672]])
    const callback = function (valueA, valueB, valueC) { return valueA * 2 + valueB + valueC }
    const mat2 = math.map(matA, matB, matC, callback)
    assert.deepStrictEqual(mat2, expected)
    assert.ok(mat2 instanceof math.Matrix)
    const mat3 = math.map(matA, matB, matC, math.typed({ 'number, number, number': callback }))
    assert.deepStrictEqual(mat3, expected)
    assert.ok(mat3 instanceof math.Matrix)
  })

  it('should map three matrices with broadcasting', function () {
    const matA = math.matrix([1, 2, 3])
    const matB = math.matrix([[10], [20], [30]])
    const matC = math.matrix([100, 200, 300])
    const expected = [[62, 114, 166], [72, 124, 176], [82, 134, 186]]
    const callback = function (valueA, valueB, valueC) { return valueA * 2 + valueB + valueC / 2 }
    const mat2 = math.map(matA, matB, matC, callback)
    assert.deepStrictEqual(mat2, math.matrix(expected))
    assert.ok(mat2 instanceof math.Matrix)
    const mat3 = math.map(matA, matB, matC, math.typed({ 'number, number, number': callback }))
    assert.deepStrictEqual(mat3, math.matrix(expected))
    assert.ok(mat3 instanceof math.Matrix)
  })

  it('should map three matrices or arrays with broadcasting', function () {
    const matA = math.matrix([1, 2, 3])
    const matB = [[10], [20], [30]]
    const matC = math.matrix([100, 200, 300])
    const expected = math.matrix([[62, 114, 166], [72, 124, 176], [82, 134, 186]])
    const callback = function (valueA, valueB, valueC) { return valueA * 2 + valueB + valueC / 2 }
    const mat2 = math.map(matA, matB, matC, callback)
    assert.deepStrictEqual(mat2, expected)
    assert.ok(mat2 instanceof math.Matrix)
    const mat3 = math.map(matA, matB, matC, math.typed({ 'number, number, number': callback }))
    assert.deepStrictEqual(mat3, expected)
    assert.ok(mat3 instanceof math.Matrix)
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

  it('should invoke a typed function with the correct number of arguments (1)', function () {
    const output = math.map([1, 2, 3], math.typed('callback', {
      number: function (value) {
        return value + 2
      }
    }))
    assert.deepStrictEqual(output, [3, 4, 5])
  })

  it('should invoke a typed function with the correct number of arguments (2) for two arrays', function () {
    const output = math.map([1, 2, 3], [4, 5, 6], math.typed('callback', {
      'number, number': function (a, b) {
        return a + b
      }
    }))
    assert.deepStrictEqual(output, [5, 7, 9])
  })

  it('should invoke a typed function with correct number of arguments (2) for two matrices', function () {
    const output = math.map(math.matrix([1, 2, 3]), math.matrix([4, 5, 6]), math.typed('callback', {
      'number, number': function (a, b) {
        return a + b
      }
    }))
    assert.deepStrictEqual(output, math.matrix([5, 7, 9]))
  })

  it('should invoke a typed function with correct number of arguments for two matrices and an index', function () {
    const callback = function (a, b, idx) {
      return a + b + idx[0]
    }
    const output = math.map(math.matrix([1, 2, 3]), math.matrix([4, 5, 6]), math.typed('callback', {
      'number, number, Array': callback
    }))
    const expected = math.matrix([5, 8, 11])
    assert.deepStrictEqual(output, expected)
  })

  it('should invoke a function with correct number of arguments for two matrices and an index', function () {
    const callback = function (a, b, idx) {
      return a + b + idx[0]
    }
    const output = math.map(math.matrix([1, 2, 3]), math.matrix([4, 5, 6]), callback)
    const expected = math.matrix([5, 8, 11])
    assert.deepStrictEqual(output, expected)
  })

  it('should invoke a function with correct number of arguments for two matrices, index and original matrices', function () {
    const callback = function (a, b, idx, A, B) {
      return a + b + A.get(idx) + B.get(idx) + idx[0]
    }
    const output = math.map(math.matrix([1, 2, 3]), math.matrix([4, 5, 6]), callback)
    const expected = math.matrix([10, 15, 20])
    assert.deepStrictEqual(output, expected)
  })

  it('should invoke a typed function with correct number of arguments (2)', function () {
    const output = math.map([1, 2, 3], math.typed('callback', {
      'number, Array': function (value, index) {
        return value + 2 * index[0]
      }
    }))
    assert.deepStrictEqual(output, [1, 4, 7])
  })

  it('should invoke a typed function with correct number of arguments (3)', function () {
    const output = math.map([1, 2, 3], math.typed('callback', {
      'number, Array, Array': function (value, index, array) {
        return value + index[0] + array[1]
      }
    }))
    assert.deepStrictEqual(output, [3, 5, 7])
  })

  it('should invoke a typed function with correct number of arguments (4)', function () {
    // cbrt has a syntax cbrt(x, allRoots), but it should invoke cbrt(x) here
    assert.deepStrictEqual(math.map([1, 8, 27], math.cbrt), [1, 2, 3])
    assert.deepStrictEqual(math.map(math.matrix([1, 8, 27]), math.cbrt), math.matrix([1, 2, 3]))
    assert.deepStrictEqual(math.map(math.matrix([1, 8, 27], 'sparse'), math.cbrt), math.matrix([1, 2, 3], 'sparse'))
  })

  it('should invoke a typed function with correct number of arguments (5)', function () {
    // format has a syntax format(x, options), but it should invoke format(x) here
    assert.deepStrictEqual(math.map([1, 8, 27], math.format), ['1', '8', '27'])
    assert.deepStrictEqual(math.map(math.matrix([1, 8, 27]), math.format), math.matrix(['1', '8', '27']))
    assert.deepStrictEqual(math.map(math.matrix([1, 8, 27], 'sparse'), math.format), math.matrix(['1', '8', '27'], 'sparse'))
  })

  it(
    'should return an empty array/matrix unchanged, with a typed callback',
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

        math.matrix([]),
        math.matrix([[]]),
        math.matrix([[], []]),
        math.matrix([[[]]]),
        math.matrix([[[], []]]),
        math.matrix([
          [[], []],
          [[], []]
        ]),
        math.matrix(), // empty matrix with size 0

        math.matrix([], 'sparse'),
        math.matrix([[]], 'sparse'),
        math.matrix([[], []], 'sparse')
      ]
      testCases.forEach(function (testCase) {
        const result = math.map(
          testCase,
          math.typed({
            'any, any, any': function (value) {
              throw new Error(`Callback somehow called with ${value}`)
            }
          })
        )
        assert.deepStrictEqual(result, testCase)
      })
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

  it('should throw an error if the last argument of a mullti callback function is not a function', function () {
    assert.throws(() => math.map([1], [2], 'not a function'),
      /TypeError: Unexpected type of argument in function map/)

    assert.throws(() => math.map([1], [2], ['not a function']),
      /Last argument must be a callback function/)
  })

  it('should operate from the parser', function () {
    assert.deepStrictEqual(
      math.evaluate('map([1,2,3], square)'),
      math.matrix([1, 4, 9]))
    assert.deepStrictEqual(
      math.evaluate('map([1,2,3], f(x) = format(x))'),
      math.matrix(['1', '2', '3']))
  })

  it('should operate from the parser with multiple inputs', function () {
    assert.deepStrictEqual(
      math.evaluate('map([1, 2], [3, 4], f)', { f: (a, b) => a + b }),
      math.matrix([4, 6])
    )
    assert.deepStrictEqual(
      math.evaluate('map([1, 2], [3, 4], _(a, b) = a + b)'),
      math.matrix([4, 6])
    )
    assert.deepStrictEqual(
      math.evaluate('map([[1, 2, 3], [4, 5, 6]], [[10, 20, 30], [40, 50, 60]], f(a, b) = a * 2 + b)'),
      math.matrix([[12, 24, 36], [48, 60, 72]])
    )
  })

  it('should operate from the parser with three arrays with broadcasting', function () {
    const arr2 = math.evaluate('map([1, 2, 3], [[10], [20], [30]], [100, 200, 300], _(A, B, C) = A * 2 + B + C / 2)')
    assert.deepStrictEqual(arr2, math.matrix([[62, 114, 166], [72, 124, 176], [82, 134, 186]]))
  })

  it('should operate from the parser with multiple inputs and one based indices', function () {
    const arr2 = math.evaluate('map([1,2],[3,4], f(a,b,idx)=a+b+idx[1])')
    const expected = math.matrix([5, 8])
    assert.deepStrictEqual(arr2, expected)
  })

  it('should operate from the parser with multiple inputs that need broadcasting and one based indices', function () {
    const arr2 = math.evaluate('map([1],[3,4], f(a,b,idx)=a+b+idx[1])')
    const expected = math.matrix([5, 7])
    assert.deepStrictEqual(arr2, expected)
  })

  it('should operate from the parser with multiple inputs that need broadcasting and one based indices and the broadcasted arrays', function () {
    // this is a convoluted way of calculating f(a,b,idx) = 2a+2b+index
    // 2(1) + 2([3,4]) + [1, 2] # yields [9, 12]
    const arr2 = math.evaluate('map([1],[3,4], f(a,b,idx,A,B)= a + A[idx[1]] + b + B[idx[1]] + idx[1])')
    const expected = math.matrix([9, 12])
    assert.deepStrictEqual(arr2, expected)
  })

  it('should LaTeX map', function () {
    const expression = math.parse('map([1,2,3],callback)')
    assert.strictEqual(expression.toTex(), '\\mathrm{map}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}, callback\\right)')
  })
})
