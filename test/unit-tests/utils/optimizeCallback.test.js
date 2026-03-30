import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { optimizeCallback, findFirst } from '../../../src/utils/optimizeCallback.js'

describe('utils.optimizeCallback', function () {
  describe('optimizeCallback', function () {
    function unaryCallback (a) {
      return a + 1
    }
    const typedUnaryCallback = math.typed('unaryCallback', {
      number: unaryCallback
    })

    function ternaryCallback (a, index, c) {
      return a + index[0] + c[0]
    }
    const typedTernaryCallback = math.typed('ternaryCallback', {
      'number, Array, Array': ternaryCallback
    })

    const arrayOfNumbers = [1, 2, 3]
    const matrixOfNumbers = math.matrix(arrayOfNumbers)
    const sparseMatrixOfNumbers = math.matrix(arrayOfNumbers, 'sparse')
    const name = 'myFunction'

    it('should find the right number of arguments for a function', function () {
      const optimizedUnary = optimizeCallback(unaryCallback, arrayOfNumbers, name)
      assert.strictEqual(optimizedUnary.isUnary, true)
      const optimizedTernary = optimizeCallback(ternaryCallback, arrayOfNumbers, name)
      assert.strictEqual(optimizedTernary.isUnary, false)
      const optimizedUnaryMatrix = optimizeCallback(unaryCallback, matrixOfNumbers, name)
      assert.strictEqual(optimizedUnaryMatrix.isUnary, true)
      const optimizedTernaryMatrix = optimizeCallback(ternaryCallback, matrixOfNumbers, name)
      assert.strictEqual(optimizedTernaryMatrix.isUnary, false)
      const optimizedUnarySparseMatrix = optimizeCallback(unaryCallback, sparseMatrixOfNumbers, name)
      assert.strictEqual(optimizedUnarySparseMatrix.isUnary, true)
      const optimizedTernarySparseMatrix = optimizeCallback(ternaryCallback, sparseMatrixOfNumbers, name)
      assert.strictEqual(optimizedTernarySparseMatrix.isUnary, false)
    })

    it('should find the right number of arguments for a typed function', function () {
      const optimizedTypedUnary = optimizeCallback(typedUnaryCallback, arrayOfNumbers, name)
      assert.strictEqual(optimizedTypedUnary.isUnary, true)
      const optimizedTypedTernary = optimizeCallback(typedTernaryCallback, arrayOfNumbers, name)
      assert.strictEqual(optimizedTypedTernary.isUnary, false)
      const optimizedTypedUnaryMatrix = optimizeCallback(typedUnaryCallback, matrixOfNumbers, name)
      assert.strictEqual(optimizedTypedUnaryMatrix.isUnary, true)
      const optimizedTypedTernaryMatrix = optimizeCallback(typedTernaryCallback, matrixOfNumbers, name)
      assert.strictEqual(optimizedTypedTernaryMatrix.isUnary, false)
      const optimizedTypedUnarySparseMatrix = optimizeCallback(typedUnaryCallback, sparseMatrixOfNumbers, name)
      assert.strictEqual(optimizedTypedUnarySparseMatrix.isUnary, true)
      const optimizedTypedTernarySparseMatrix = optimizeCallback(typedTernaryCallback, sparseMatrixOfNumbers, name)
      assert.strictEqual(optimizedTypedTernarySparseMatrix.isUnary, false)
    })

    it('should return unary functions as unary when isUnary is set to true', function () {
      const optimizedUnary = optimizeCallback(unaryCallback, arrayOfNumbers, name, true)
      assert.strictEqual(optimizedUnary.isUnary, true)
      const optimizedTernary = optimizeCallback(ternaryCallback, arrayOfNumbers, name, true)
      assert.strictEqual(optimizedTernary.isUnary, true)
      const optimizedTypedUnary = optimizeCallback(typedUnaryCallback, arrayOfNumbers, name, true)
      assert.strictEqual(optimizedTypedUnary.isUnary, true)
      const optimizedTypedTernary = optimizeCallback(typedTernaryCallback, arrayOfNumbers, name, true)
      assert.strictEqual(optimizedTypedTernary.isUnary, true)
    })

    it('should run the optimized callback', function () {
      const optimizedUnary = optimizeCallback(unaryCallback, arrayOfNumbers, name)
      const args = [1, [2, 2], [3]]
      assert.strictEqual(unaryCallback(1), 2)
      assert.strictEqual(optimizedUnary.fn(1), 2)
      const optimizedTernary = optimizeCallback(ternaryCallback, arrayOfNumbers, name)
      assert.strictEqual(optimizedTernary.fn(...args), 6)
      const optimizedTypedUnary = optimizeCallback(typedUnaryCallback, arrayOfNumbers, name)
      assert.strictEqual(optimizedTypedUnary.fn(1), 2)
      const optimizedTypedTernary = optimizeCallback(typedTernaryCallback, arrayOfNumbers, name)
      assert.strictEqual(optimizedTypedTernary.fn(...args), 6)
      const optimizedUnaryMatrix = optimizeCallback(unaryCallback, matrixOfNumbers, name)
      assert.strictEqual(optimizedUnaryMatrix.fn(1), 2)
      const optimizedTernaryMatrix = optimizeCallback(ternaryCallback, matrixOfNumbers, name)
      assert.strictEqual(optimizedTernaryMatrix.fn(...args), 6)
      const optimizedTypedUnaryMatrix = optimizeCallback(typedUnaryCallback, matrixOfNumbers, name)
      assert.strictEqual(optimizedTypedUnaryMatrix.fn(1), 2)
      const optimizedTypedTernaryMatrix = optimizeCallback(typedTernaryCallback, matrixOfNumbers, name)
      assert.strictEqual(optimizedTypedTernaryMatrix.fn(...args), 6)
      const optimizedUnarySparseMatrix = optimizeCallback(unaryCallback, sparseMatrixOfNumbers, name)
      assert.strictEqual(optimizedUnarySparseMatrix.fn(1), 2)
      const optimizedTernarySparseMatrix = optimizeCallback(ternaryCallback, sparseMatrixOfNumbers, name)
      assert.strictEqual(optimizedTernarySparseMatrix.fn(...args), 6)
    })
  }
  )

  describe('findFirst', function () {
    it('should find the first value in a nested array', function () {
      assert.strictEqual(findFirst([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]), 1)
      assert.strictEqual(findFirst([[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], [8]]]]), 1)
      assert.strictEqual(findFirst([[[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [[[9, 10], [11, 12]], [[13, 14], [15, 16]]]]), 1)
    })

    it('should find the first value in a matrix', function () {
      assert.strictEqual(findFirst(math.matrix([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])), 1)
      assert.strictEqual(findFirst(math.matrix([[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], [8]]]])), 1)
      assert.strictEqual(findFirst(math.matrix([[[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [[[9, 10], [11, 12]], [[13, 14], [15, 16]]]])), 1)
    })

    it('should find the first value in a sparse matrix', function () {
      assert.strictEqual(findFirst(math.matrix([[1, 2], [3, 4]], 'sparse')), 1)
      assert.strictEqual(findFirst(math.matrix([[1], [2]], 'sparse')), 1)
      assert.strictEqual(findFirst(math.matrix([[1, 2], [3, 4], [5, 6]], 'sparse')), 1)
    })

    it('should return undefined for an empty array or matrix', function () {
      assert.strictEqual(findFirst([]), undefined)
      assert.strictEqual(findFirst(math.matrix([])), undefined)
    })

    it('should find the first value in a jagged array if the first element is empty', function () {
      assert.strictEqual(findFirst([[], [1, 2], [3, 4]]), 1)
      assert.strictEqual(findFirst([[], [[1], [2]], [[3], [4]]]), 1)
      assert.strictEqual(findFirst([[], [[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [[[9, 10], [11, 12]], [[13, 14], [15, 16]]]]), 1)
    })
  })
})
