import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
import { isCollection } from '../../../../../src/utils/is.js'

const DenseMatrix = math.DenseMatrix

describe('isCollection', function () {
  it('should return true for simple arrays', function () {
    assert.strictEqual(isCollection([1, 2, 3]), true)
  })

  it('should return true for nested arrays', function () {
    assert.strictEqual(isCollection([[1, 2], [3, [4, 5]]]), true)
  })

  it('should return true for empty arrays', function () {
    assert.strictEqual(isCollection([]), true)
  })

  it('should return true for DenseMatrix instances', function () {
    const matrix = new DenseMatrix([[1, 2], [3, 4]])
    assert.strictEqual(isCollection(matrix), true)
  })

  it('should return true for SparseMatrix instances', function () {
    const matrix = math.sparse([[1, 2], [3, 4]])
    assert.strictEqual(isCollection(matrix), true)
  })

  it('should return false for simple objects', function () {
    assert.strictEqual(isCollection({ a: 1, b: 2 }), false)
  })

  it('should return false for numbers', function () {
    assert.strictEqual(isCollection(123), false)
  })

  it('should return false for strings', function () {
    assert.strictEqual(isCollection('string'), false)
  })

  it('should return false for null', function () {
    assert.strictEqual(isCollection(null), false)
  })

  it('should return false for undefined', function () {
    assert.strictEqual(isCollection(undefined), false)
  })

  it('should return false for boolean values', function () {
    assert.strictEqual(isCollection(true), false)
    assert.strictEqual(isCollection(false), false)
  })

  it('should return false for complex numbers', function () {
    const complex = math.complex(2, 3)
    assert.strictEqual(isCollection(complex), false)
  })

  it('should return false for functions', function () {
    const func = () => {}
    assert.strictEqual(isCollection(func), false)
  })
})
