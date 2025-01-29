import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const sum = math.sum
const mapSlices = math.expression.transform.mapSlices

describe('mapSlices.transform', function () {
  it('should apply a function to the rows of a matrix with one based indices', function () {
    assert.deepStrictEqual(mapSlices([[1, 2], [3, 4]], 1, sum), [4, 6])
  })

  it('should apply a function to the columns of a matrix with one based indices', function () {
    assert.deepStrictEqual(mapSlices([[1, 2], [3, 4]], 2, sum), [3, 7])
  })

  it('should throw an error if the dimension is below the range for one based indices', function () {
    assert.throws(function () { mapSlices([[1, 2], [3, 4]], 0, sum) }, /Index out of range/)
  })

  it('should throw an error if the dimension is above the range for one based indices', function () {
    assert.throws(function () { mapSlices([[1, 2], [3, 4]], 3, sum) }, /Index out of range/)
  })

  it('should be callable from the expression parser', function () {
    assert.deepStrictEqual(
      math.evaluate('mapSlices([[1, 2], [3, 4]], 2, sum)'),
      math.evaluate('[3,7]')
    )
  })
})
