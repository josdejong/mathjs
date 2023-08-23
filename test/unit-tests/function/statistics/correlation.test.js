import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const corr = math.corr

describe('correlation', function () {
  it('should return the correlation coefficient from an array', function () {
    assert.strictEqual(corr([1, 2, 3, 4, 5], [4, 5, 6, 7, 8]), 1)
    assert.strictEqual(corr([1, 2.2, 3, 4.8, 5], [4, 5.3, 6.6, 7, 8]), 0.9569941688503644)
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { corr() })
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { corr([]) })
  })
})
