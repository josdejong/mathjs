import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('leafCount', function () {
  it('handles nodes', function () {
    assert.strictEqual(math.leafCount(new math.SymbolNode('x')), 1)
    assert.strictEqual(math.leafCount(math.parse('2+y')), 2)
    assert.strictEqual(math.leafCount(math.parse('[3,a+5,2/2,z]')), 6)
  })

  it('handles strings', function () {
    assert.strictEqual(math.leafCount('3x^2-7x+2'), 6)
    assert.strictEqual(math.leafCount('13 < m+n < abs(n^2-m^2)'), 8)
  })

  it('can be used in an expression', function () {
    assert(math.evaluate('leafCount("identity(2)[0,1]") == 4'))
    assert.strictEqual(math.evaluate('leafCount("{a: 7, b: x}.b")'), 3)
  })
})
