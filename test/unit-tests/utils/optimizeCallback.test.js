import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { optimizeCallback } from '../../../src/utils/optimizeCallback.js'

describe('optimizeCallback', function () {
  function unaryCallback (a) {
    a + 1
  }
  const typedUnaryCallback = math.typed('unaryCallback', {
    number: unaryCallback
  })

  function ternaryCallback (a, b, c) {
    return a + b + c + 1
  }
  const typedTernaryCallback = math.typed('ternaryCallback', {
    'number, number, number': ternaryCallback
  })

  const arrayOfNumbers = [1, 2, 3]
  const matrixOfNumbers = math.matrix(arrayOfNumbers)
  const sparseMatrixOfNumbers = math.matrix(arrayOfNumbers, 'sparse')
  const name = 'myFunction'

  it('should find the right number of arguments for a function', function () {
    const optimizedUnary = optimizeCallback(unaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedUnary.isUnary, true)
    const optimizedTernary = optimizeCallback(ternaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTernary.isUnary, false)
    const optimizedUnaryMatrix = optimizeCallback(unaryCallback, matrixOfNumbers, name, false)
    assert.strictEqual(optimizedUnaryMatrix.isUnary, true)
    const optimizedTernaryMatrix = optimizeCallback(ternaryCallback, matrixOfNumbers, name, false)
    assert.strictEqual(optimizedTernaryMatrix.isUnary, false)
    const optimizedUnarySparseMatrix = optimizeCallback(unaryCallback, sparseMatrixOfNumbers, name, false)
    assert.strictEqual(optimizedUnarySparseMatrix.isUnary, true)
    const optimizedTernarySparseMatrix = optimizeCallback(ternaryCallback, sparseMatrixOfNumbers, name, false)
    assert.strictEqual(optimizedTernarySparseMatrix.isUnary, false)
  })

  it('should find the right number of arguments for a typed function', function () {
    const optimizedTypedUnary = optimizeCallback(typedUnaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTypedUnary.isUnary, true)
    const optimizedTypedTernary = optimizeCallback(typedTernaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTypedTernary.isUnary, false)
    const optimizedTypedUnaryMatrix = optimizeCallback(typedUnaryCallback, matrixOfNumbers, name, false)
    assert.strictEqual(optimizedTypedUnaryMatrix.isUnary, true)
    const optimizedTypedTernaryMatrix = optimizeCallback(typedTernaryCallback, matrixOfNumbers, name, false)
    assert.strictEqual(optimizedTypedTernaryMatrix.isUnary, false)
    const optimizedTypedUnarySparseMatrix = optimizeCallback(typedUnaryCallback, sparseMatrixOfNumbers, name, false)
    assert.strictEqual(optimizedTypedUnarySparseMatrix.isUnary, true)
    const optimizedTypedTernarySparseMatrix = optimizeCallback(typedTernaryCallback, sparseMatrixOfNumbers, name, false)
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
    const optimizedUnary = optimizeCallback(unaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedUnary.fn(1), 2)
    const optimizedTernary = optimizeCallback(ternaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTernary.fn(1, 2, 3), 7)
    const optimizedTypedUnary = optimizeCallback(typedUnaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTypedUnary.fn(1), 2)
    const optimizedTypedTernary = optimizeCallback(typedTernaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTypedTernary.fn(1, 2, 3), 7)
    const optimizedUnaryMatrix = optimizeCallback(unaryCallback, matrixOfNumbers, name, false)
    assert.strictEqual(optimizedUnaryMatrix.fn(1), 2)
    const optimizedTernaryMatrix = optimizeCallback(ternaryCallback, matrixOfNumbers, name, false)
    assert.strictEqual(optimizedTernaryMatrix.fn(1, 2, 3), 7)
    const optimizedTypedUnaryMatrix = optimizeCallback(typedUnaryCallback, matrixOfNumbers, name, false)
    assert.strictEqual(optimizedTypedUnaryMatrix.fn(1), 2)
    const optimizedTypedTernaryMatrix = optimizeCallback(typedTernaryCallback, matrixOfNumbers, name, false)
    assert.strictEqual(optimizedTypedTernaryMatrix.fn(1, 2, 3), 7)
    const optimizedUnarySparseMatrix = optimizeCallback(unaryCallback, sparseMatrixOfNumbers, name, false)
    assert.strictEqual(optimizedUnarySparseMatrix.fn(1), 2)
    const optimizedTernarySparseMatrix = optimizeCallback(ternaryCallback, sparseMatrixOfNumbers, name, false)
    assert.strictEqual(optimizedTernarySparseMatrix.fn(1, 2, 3), 7)
})

}
)
