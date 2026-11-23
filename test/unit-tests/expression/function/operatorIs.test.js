// test operatorIs
import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('operatorIs', function () {
  it('should return properties of operators', function () {
    assert(math.operatorIs(math.parse('x y'), 'associative'))
    assert.strictEqual(math.operatorIs('divide', 'commutative'), false)
    assert(math.operatorIs('abs', 'trivial', math.simplify.positiveContext))
    assert(math.operatorIs('sin', 'total', math.simplify.realContext))
  })

  it('should obtain properties from context', function () {
    assert.strictEqual(
      math.operatorIs('pow', 'total', { pow: { total: false } }),
      false)
    assert.strictEqual(
      math.operatorIs(
        math.parse('2 x'), 'commutative', { multiply: { commutative: false } }),
      false)
  })
})
