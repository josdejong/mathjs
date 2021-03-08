import assert from 'assert'
import { isCollection } from '../../../../src/utils/is.js'
import math from '../../../../src/defaultInstance.js'
const DenseMatrix = math.DenseMatrix
const SparseMatrix = math.SparseMatrix

describe('isCollection', function () {
  it('should test whether an object is a collection', function () {
    assert.strictEqual(isCollection([]), true)
    assert.strictEqual(isCollection({}), false)
    assert.strictEqual(isCollection(2), false)
    assert.strictEqual(isCollection(new DenseMatrix()), true)
    assert.strictEqual(isCollection(new SparseMatrix()), true)
  })
})
