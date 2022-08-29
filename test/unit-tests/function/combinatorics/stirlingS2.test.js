import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const stirlingS2 = math.stirlingS2

describe('stirlingS2', function () {
  it('should calculate the number of ways to partition a set of n objects into k non-empty subsets', function () {
    assert.strictEqual(stirlingS2(5, 3), 25)
    assert.strictEqual(stirlingS2(0, 0), 1)
    assert.strictEqual(stirlingS2(8, 7), 28)
    assert.strictEqual(stirlingS2(14, 13), 91)
    assert.strictEqual(stirlingS2(10, 5), 42525)
    assert.strictEqual(stirlingS2(15, 6), 420693273)
    assert.strictEqual(stirlingS2(22, 9), 1241963303533920)
    // and that's about as big as we can go with the number type
  })

  it('should calculate the stirlingS2 of n items taken k at a time with BigNumbers', function () {
    const bn = math.bignumber
    assert.deepStrictEqual(stirlingS2(bn(7), bn(5)), bn(140))
    assert.deepStrictEqual(stirlingS2(bn(8), bn(6)), bn(266))
    assert.deepStrictEqual(stirlingS2(bn(14), 13), bn(91))
    assert.deepStrictEqual(stirlingS2(10, bn(5)), bn(42525))
    assert.deepStrictEqual(stirlingS2(bn(15), bn(6)), bn(420693273))
    assert.deepStrictEqual(stirlingS2(bn(22), 9), bn(1241963303533920))
    // And now we can go bigger:
    assert.deepStrictEqual(stirlingS2(bn(23), 9), bn('12320068811796900'))
    assert.deepStrictEqual(stirlingS2(bn(50), 14),
      bn('16132809270066494376125322988035691981158490930'))
  })

  it('should not work with non-integer and negative input', function () {
    assert.throws(function () { stirlingS2(0.5, 3) }, /Non-negative integer value expected/)
    assert.throws(function () { stirlingS2(-2, 3) }, /Non-negative integer value expected/)

    assert.throws(function () { stirlingS2(3, 5) }, /k must be less than or equal to n in function stirlingS2/)
    assert.throws(function () { stirlingS2(math.bignumber(3), math.bignumber(5)) }, /k must be less than or equal to n in function stirlingS2/)
    assert.throws(function () { stirlingS2(math.bignumber(3.5), math.bignumber(-3)) }, /Non-negative integer value expected/)
    assert.throws(function () { stirlingS2(math.bignumber(3.5), 1 / 3) }, /Non-negative integer value expected/)
  })

  it('should not work with the wrong number or type of arguments', function () {
    assert.throws(function () { stirlingS2(5, 3, 2) })
    assert.throws(function () { stirlingS2(true, 'hello world') })
  })

  it('should LaTeX stirlingS2', function () {
    const expression = math.parse('stirlingS2(3,2)')
    assert.strictEqual(expression.toTex(), '\\mathrm{S}\\left(3,2\\right)')
  })
})
