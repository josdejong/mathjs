import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const corr = math.corr
const BigNumber = math.BigNumber

describe('correlation', function () {
  it('should return the correlation coefficient from an array', function () {
    assert.strictEqual(corr([new BigNumber(1), new BigNumber(2.2), new BigNumber(3), new BigNumber(4.8), new BigNumber(5)], [new BigNumber(4), new BigNumber(5.3), new BigNumber(6.6), new BigNumber(7), new BigNumber(8)]).toNumber(), 0.9569941688503653)
    assert.strictEqual(corr([1, 2, 3, 4, 5], [4, 5, 6, 7, 8]), 1)
    assert.strictEqual(corr([1, 2.2, 3, 4.8, 5], [4, 5.3, 6.6, 7, 8]), 0.9569941688503644)
    assert.deepStrictEqual(corr(math.matrix([[1, 2.2, 3, 4.8, 5], [1, 2, 3, 4, 5]]), math.matrix([[4, 5.3, 6.6, 7, 8], [1, 2, 3, 4, 5]]))._data, [0.9569941688503644, 1])
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { corr() })
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { corr([]) })
  })
})
