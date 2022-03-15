import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const { count, matrix, sparse } = math

describe('count', function () {
  it('should count arrays', function () {
    assert.strictEqual(count([[1, 2, 3], [4, 5, 6]]), 6)
    assert.strictEqual(count([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]), 8)
    assert.strictEqual(count([]), 0)
    assert.strictEqual(count([[]]), 0)
  })

  it('should count dense matrices', function () {
    assert.strictEqual(count(matrix([[1, 2, 3], [4, 5, 6]])), 6)
    assert.strictEqual(count(matrix([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])), 8)
    assert.strictEqual(count(matrix([])), 0)
    assert.strictEqual(count(matrix([[]])), 0)
  })

  it('should count sparse matrices', function () {
    assert.strictEqual(count(sparse([[1, 2, 3], [4, 5, 6]])), 6)
    assert.strictEqual(count(sparse([])), 0)
    assert.strictEqual(count(sparse([[]])), 0)
  })

  it('should count strings', function () {
    assert.strictEqual(count('123456'), 6)
    assert.strictEqual(count(''), 0)
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { count() }, /TypeError: Too few arguments/)
    assert.throws(function () { count([1], 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { count(new Date()) }, /TypeError: Unexpected type of argument/)
  })
})
