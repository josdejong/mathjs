import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const ev = math.evaluate
const matrix = math.matrix
const nummat = x => matrix(x, 'dense', 'number')

describe('subset.transform', function () {
  it('should obey indexing conventions of expressions', function () {
    assert.strictEqual(ev('subset([1,2;3,4], (2, 1))'), 3)
    assert.deepStrictEqual(
      ev('subset(range(2,10), ([9,7,5],))'), nummat([10, 8, 6]))
    assert.deepStrictEqual(
      ev("subset([1,2,3;4,5,6], ('1:2', '2:3'))"), matrix([[2, 3], [5, 6]]))
  })
})
