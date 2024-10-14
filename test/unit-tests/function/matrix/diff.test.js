import assert from 'assert'
import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

// Parsing tests are inside diff.transform.test

const matrix = math.matrix
const diff = math.diff

const smallTestArray = [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [9, 8, 7, 6, 4]]

const smallTestArrayDimension0 = [[0, 0, 0, 0, 0], [8, 6, 4, 2, -1]]
const smallTestArrayDimension1 = [[1, 1, 1, 1], [1, 1, 1, 1], [-1, -1, -1, -2]]

// largeTestArrayDimension0-3 were generated from largeTestArray using numpy.diff() for consistency. Please dont change them because they are a pain to get linted correctly
const largeTestArray = [[[[1, 2, 3], [2, 3, 4], [3, 4, 5]], [[3, 2, 1], [2, 3, 4], [5, 4, 3]], [[5, 2, 1], [5, 2, 1], [5, 2, 1]]], [[[8, 12, 345], [23, 35, 23], [123, 234, 12]], [[1, 2, 3], [1, 3, 5], [5, 6, 7]], [[66, 55, 44], [32, 32, 1], [0, 1, 2]]], [[[1, 64, 3], [2, 34, 61], [128, 92, 64]], [[12, 2, 1], [6, 8, 9], [2, 7, 3]], [[52, 22, 21], [55, 52, 51], [111, 12, 11]]]]

const largeTestArrayDimension0 = [[[[7, 10, 342], [21, 32, 19], [120, 230, 7]], [[-2, 0, 2], [-1, 0, 1], [0, 2, 4]], [[61, 53, 43], [27, 30, 0], [-5, -1, 1]]], [[[-7, 52, -342], [-21, -1, 38], [5, -142, 52]], [[11, 0, -2], [5, 5, 4], [-3, 1, -4]], [[-14, -33, -23], [23, 20, 50], [111, 11, 9]]]]
const largeTestArrayDimension1 = [[[[2, 0, -2], [0, 0, 0], [2, 0, -2]], [[2, 0, 0], [3, -1, -3], [0, -2, -2]]], [[[-7, -10, -342], [-22, -32, -18], [-118, -228, -5]], [[65, 53, 41], [31, 29, -4], [-5, -5, -5]]], [[[11, -62, -2], [4, -26, -52], [-126, -85, -61]], [[40, 20, 20], [49, 44, 42], [109, 5, 8]]]]
const largeTestArrayDimension2 = [[[[1, 1, 1], [1, 1, 1]], [[-1, 1, 3], [3, 1, -1]], [[0, 0, 0], [0, 0, 0]]], [[[15, 23, -322], [100, 199, -11]], [[0, 1, 2], [4, 3, 2]], [[-34, -23, -43], [-32, -31, 1]]], [[[1, -30, 58], [126, 58, 3]], [[-6, 6, 8], [-4, -1, -6]], [[3, 30, 30], [56, -40, -40]]]]
const largeTestArrayDimension3 = [[[[1, 1], [1, 1], [1, 1]], [[-1, -1], [1, 1], [-1, -1]], [[-3, -1], [-3, -1], [-3, -1]]], [[[4, 333], [12, -12], [111, -222]], [[1, 1], [2, 2], [1, 1]], [[-11, -11], [0, -31], [1, 1]]], [[[63, -61], [32, 27], [-36, -28]], [[-10, -1], [2, 1], [5, -4]], [[-30, -1], [-3, -1], [-99, -1]]]]

describe('diff', function () {
  it('should return an empty array/matrix for less than 2 elements, with and without specified dimension', function () {
    // With Dim = 0 specified
    assert.deepStrictEqual(diff([], 0), [])
    assert.deepStrictEqual(diff(matrix([]), 0), matrix([]))
    assert.deepStrictEqual(diff([2], 0), [])
    assert.deepStrictEqual(diff(matrix([2]), 0), matrix([]))

    // Without Dim = 0 specified
    assert.deepStrictEqual(diff([]), [])
    assert.deepStrictEqual(diff(matrix([])), matrix([]))
    assert.deepStrictEqual(diff([2]), [])
    assert.deepStrictEqual(diff(matrix([2])), matrix([]))

    // Two-dimensional:
    assert.deepStrictEqual(diff([[1, 3, 6, 10, 15]]), [])
    assert.deepStrictEqual(diff([[1, 3, 6, 10, 15]], 1), [[2, 3, 4, 5]])
    assert.deepStrictEqual(diff([[1], [3], [6], [10], [15]]), [[2], [3], [4], [5]])
    assert.deepStrictEqual(diff([[1], [3], [6], [10], [15]], 1), [[], [], [], [], []])
  })

  it('should return difference between elements of a 1-dimensional array, with and without specified dimension', function () {
    // With Dim = 0
    assert.deepStrictEqual(diff([1, 2, 4, 7, 0], 0), [1, 2, 3, -7])

    // Without Dim = 0
    assert.deepStrictEqual(diff([1, 2, 4, 7, 0]), [1, 2, 3, -7])
  })

  it('should return difference between elements of a 1-dimensional matrix, with and without specified dimension', function () {
    // With Dim = 0
    assert.deepStrictEqual(diff(matrix([1, 2, 4, 7, 0]), 0), matrix([1, 2, 3, -7]))

    // Without Dim = 0
    assert.deepStrictEqual(diff(matrix([1, 2, 4, 7, 0])), matrix([1, 2, 3, -7]))
  })

  it('should return difference between elements of a 2-dimensional array, with and without specified dimension', function () {
    // With Dim specified
    assert.deepStrictEqual(diff(smallTestArray, 0), smallTestArrayDimension0)
    assert.deepStrictEqual(diff(smallTestArray, 1), smallTestArrayDimension1)
    assert.deepStrictEqual(diff(smallTestArray, math.bignumber(1)), smallTestArrayDimension1)

    // Without Dim specified
    assert.deepStrictEqual(diff(smallTestArray), smallTestArrayDimension0)
  })

  it('should return difference between elements of a 2-dimensional matrix, with and without specified dimension', function () {
    // With Dim specified
    assert.deepStrictEqual(diff(matrix(smallTestArray), 0), matrix(smallTestArrayDimension0))
    assert.deepStrictEqual(diff(matrix(smallTestArray), 1), matrix(smallTestArrayDimension1))

    // Without Dim specified
    assert.deepStrictEqual(diff(matrix(smallTestArray)), matrix(smallTestArrayDimension0))
  })

  it('should return difference between elements of a 4-dimensional array, with and without specified dimension', function () {
    // With Dim specified
    assert.deepStrictEqual(diff(largeTestArray, 0), largeTestArrayDimension0)
    assert.deepStrictEqual(diff(largeTestArray, 1), largeTestArrayDimension1)
    assert.deepStrictEqual(diff(largeTestArray, 2), largeTestArrayDimension2)
    assert.deepStrictEqual(diff(largeTestArray, 3), largeTestArrayDimension3)
    assert.deepStrictEqual(diff(largeTestArray, math.bignumber(1)), largeTestArrayDimension1)
    assert.deepStrictEqual(diff(largeTestArray, math.bignumber(2)), largeTestArrayDimension2)
    assert.deepStrictEqual(diff(largeTestArray, math.bignumber(3)), largeTestArrayDimension3)

    // Without Dim specified
    assert.deepStrictEqual(diff(largeTestArray), largeTestArrayDimension0)
  })

  it('should return difference between elements of a 4-dimensional matrix, with and without specified dimension', function () {
    // With Dim specified
    assert.deepStrictEqual(diff(matrix(largeTestArray), 0), matrix(largeTestArrayDimension0))
    assert.deepStrictEqual(diff(matrix(largeTestArray), 1), matrix(largeTestArrayDimension1))
    assert.deepStrictEqual(diff(matrix(largeTestArray), 2), matrix(largeTestArrayDimension2))
    assert.deepStrictEqual(diff(matrix(largeTestArray), 3), matrix(largeTestArrayDimension3))

    // Without Dim specified
    assert.deepStrictEqual(diff(matrix(largeTestArray)), matrix(largeTestArrayDimension0))
  })

  it('should treat an array of matrices as an array of arrays', function () {
    // With Dim = 0
    assert.deepStrictEqual(diff([matrix([1, 2]), matrix([3, 4])], 0), [[2, 2]])
    assert.deepStrictEqual(diff([matrix([1, 2]), matrix([3, 4])], 1), [[1], [1]])
    assert.deepStrictEqual(diff([[1, 2], matrix([3, 4])], 0), [[2, 2]])
    assert.deepStrictEqual(diff([[1, 2], matrix([3, 4])], 1), [[1], [1]])
    assert.deepStrictEqual(diff([matrix([1, 2]), [3, 4]], 0), [[2, 2]])
    assert.deepStrictEqual(diff([matrix([1, 2]), [3, 4]], 1), [[1], [1]])

    // Without Dim = 0
    assert.deepStrictEqual(diff([matrix([1, 2]), matrix([3, 4])]), [[2, 2]])
    assert.deepStrictEqual(diff([[1, 2], matrix([3, 4])]), [[2, 2]])
    assert.deepStrictEqual(diff([matrix([1, 2]), [3, 4]]), [[2, 2]])
  })

  it('should be consistent with bignumber', function () {
    // 4-dim array but done with bignumber
    assert.deepStrictEqual(diff(math.bignumber(largeTestArray), 0), math.bignumber(largeTestArrayDimension0))
    assert.deepStrictEqual(diff(math.bignumber(largeTestArray), 1), math.bignumber(largeTestArrayDimension1))
    assert.deepStrictEqual(diff(math.bignumber(largeTestArray), 2), math.bignumber(largeTestArrayDimension2))
    assert.deepStrictEqual(diff(math.bignumber(largeTestArray), 3), math.bignumber(largeTestArrayDimension3))

    // Without Dim specified
    assert.deepStrictEqual(diff(math.bignumber(largeTestArray)), math.bignumber(largeTestArrayDimension0))
  })

  it('should be consistent with fraction', function () {
    // 4-dim array but done with bignumber
    assert.deepStrictEqual(diff(math.fraction(largeTestArray), 0), math.fraction(largeTestArrayDimension0))
    assert.deepStrictEqual(diff(math.fraction(largeTestArray), 1), math.fraction(largeTestArrayDimension1))
    assert.deepStrictEqual(diff(math.fraction(largeTestArray), 2), math.fraction(largeTestArrayDimension2))
    assert.deepStrictEqual(diff(math.fraction(largeTestArray), 3), math.fraction(largeTestArrayDimension3))

    // Without Dim specified
    assert.deepStrictEqual(diff(math.fraction(largeTestArray)), math.fraction(largeTestArrayDimension0))
  })

  it('should be consistent with units', function () {
    // Derived from previous smallTestArray
    const smallUnitsArray = [[math.unit('1 cm'), math.unit('2 cm'), math.unit('3 cm'), math.unit('4 cm'), math.unit('5 cm')], [math.unit('1 cm'), math.unit('2 cm'), math.unit('3 cm'), math.unit('4 cm'), math.unit('5 cm')], [math.unit('9 cm'), math.unit('8 cm'), math.unit('7 cm'), math.unit('6 cm'), math.unit('4 cm')]]

    const smallUnitsArrayDimension0 = [[math.unit('0 cm'), math.unit('0 cm'), math.unit('0 cm'), math.unit('0 cm'), math.unit('0 cm')], [math.unit('8 cm'), math.unit('6 cm'), math.unit('4 cm'), math.unit('2 cm'), math.unit('-1 cm')]]
    const smallUnitsArrayDimension1 = [[math.unit('1 cm'), math.unit('1 cm'), math.unit('1 cm'), math.unit('1 cm')], [math.unit('1 cm'), math.unit('1 cm'), math.unit('1 cm'), math.unit('1 cm')], [math.unit('-1 cm'), math.unit('-1 cm'), math.unit('-1 cm'), math.unit('-2 cm')]]

    // With Dim specified
    approxDeepEqual(diff(smallUnitsArray, 0), smallUnitsArrayDimension0)
    approxDeepEqual(diff(smallUnitsArray, 1), smallUnitsArrayDimension1)

    // Without Dim specified
    approxDeepEqual(diff(smallUnitsArray), smallUnitsArrayDimension0)
  })

  it('should throw if input is not an array or matrix', function () {
    assert.throws(function () { diff(1, 0) }, TypeError)
  })

  it('should throw if dimension is too large, negative or not an integer', function () {
    // Not enough dimensions in the array
    assert.throws(function () { diff([1, 2, 3, 4], 1) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), 1) }, RangeError)

    // No negative dimensions
    assert.throws(function () { diff([1, 2, 3, 4], -1) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), -1) }, RangeError)

    // No decimal dimensions
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), 0.5) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), -0.5) }, RangeError)
  })

  it('should throw if bignumber is not a valid index', function () {
    // Not enough dimensions in the array
    assert.throws(function () { diff([1, 2, 3, 4], math.bignumber(1)) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), math.bignumber(1)) }, RangeError)

    // No negative dimensions
    assert.throws(function () { diff([1, 2, 3, 4], math.bignumber(-1)) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), math.bignumber(-1)) }, RangeError)

    // No decimal dimensions
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), math.bignumber(0.5)) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), math.bignumber(-0.5)) }, RangeError)

    // Infinity
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), Infinity) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), -Infinity) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), math.bignumber('Infinity')) }, RangeError)
    assert.throws(function () { diff(matrix([1, 2, 3, 4]), math.bignumber('-Infinity')) }, RangeError)
  })

  it('should throw if array is not \'rectangular\'', function () {
    // Matrices are already 'rectangular' so this error doesnt apply to them
    // The first one throws TypeError for trying to do 2 - [3,4] whereas the second one throws RangeError as [1,2].length != [3,4,3].length
    assert.throws(function () { diff([1, 2, [3, 4]], 0) }, TypeError)
    assert.throws(function () { diff([[1, 2], [3, 4, 3]], 0) }, RangeError)
  })
})
