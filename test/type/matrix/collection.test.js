const assert = require('assert')
const isCollection = require('../../../src/utils/collection/isCollection')
const math = require('../../../src/main')
const DenseMatrix = math.type.DenseMatrix
const SparseMatrix = math.type.SparseMatrix

describe('isCollection', function () {
  it('should test whether an object is a collection', function () {
    assert.strictEqual(isCollection([]), true)
    assert.strictEqual(isCollection({}), false)
    assert.strictEqual(isCollection(2), false)
    assert.strictEqual(isCollection(new DenseMatrix()), true)
    assert.strictEqual(isCollection(new SparseMatrix()), true)
  })
})
