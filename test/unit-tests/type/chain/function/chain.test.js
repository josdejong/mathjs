import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
const Chain = math.Chain

describe('chain', function () {
  it('should construct a chain', function () {
    assert.ok(math.chain(45) instanceof Chain)
    assert.ok(math.chain(math.complex(2, 3)) instanceof Chain)
    assert.ok(math.chain() instanceof Chain)
  })

  it('should LaTeX chain', function () {
    const expression = math.parse('chain(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{chain}\\left(1\\right)')
  })
})
