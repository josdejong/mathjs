import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('comparisons of units with offsets', function () {
  const scales = ['degC', 'degF', 'K', 'degR']

  it('should preserve ordering when temperatures use different scales', function () {
    for (const leftScale of scales) {
      for (const rightScale of scales) {
        const low = math.unit('9 degC').to(leftScale)
        const high = math.unit('10 degC').to(rightScale)
        assert.strictEqual(math.smaller(low, high), true)
        assert.strictEqual(math.smaller(high, low), false)
        assert.strictEqual(math.smallerEq(low, high), true)
        assert.strictEqual(math.larger(high, low), true)
        assert.strictEqual(math.largerEq(high, low), true)
        assert.strictEqual(math.compare(low, high), -1)
        assert.strictEqual(math.compare(high, low), 1)
      }
    }
  })

  it('should compare equal temperatures across scales', function () {
    const freezing = math.unit('0 degC')
    for (const scale of scales) {
      const converted = freezing.to(scale)
      assert.strictEqual(math.equal(freezing, converted), true)
      assert.strictEqual(math.unequal(freezing, converted), false)
      assert.strictEqual(math.smallerEq(freezing, converted), true)
      assert.strictEqual(math.largerEq(freezing, converted), true)
      assert.strictEqual(math.compare(freezing, converted), 0)
      assert.strictEqual(freezing.equals(converted), true)
    }
  })

  it('should preserve the numeric types when applying offsets', function () {
    for (const convert of [math.bignumber, math.fraction]) {
      const low = math.unit(convert(9), 'degC')
      const high = math.unit(convert(283.15), 'K')
      assert.strictEqual(math.smaller(low, high), true)
      assert.strictEqual(math.larger(high, low), true)
      assert.strictEqual(math.equal(math.unit(convert(10), 'degC'), high), true)
    }
  })

  it('should compare exact values beyond number precision', function () {
    const precise = math.create({ relTol: 1e-30, absTol: 0 })
    for (const convert of [precise.bignumber, precise.fraction]) {
      const temperature = precise.unit(convert('9007199254740993'), 'degC')
      const equivalent = precise.unit(convert('9007199254741266.15'), 'K')
      const higher = precise.unit(convert('9007199254741267.15'), 'K')
      assert.strictEqual(precise.equal(temperature, equivalent), true)
      assert.strictEqual(precise.smaller(temperature, higher), true)
      assert.strictEqual(temperature.equals(equivalent), true)
    }
  })

  it('should account for offsets on custom base units', function () {
    const custom = math.create()
    custom.createUnit('comparisonBase')
    custom.createUnit('comparisonOffset', { definition: '2 comparisonBase', offset: 5 })
    const value = custom.unit('3 comparisonOffset')
    assert.strictEqual(custom.equal(value, custom.unit('16 comparisonBase')), true)
    assert.strictEqual(custom.smaller(value, custom.unit('17 comparisonBase')), true)
    assert.strictEqual(value.equals(custom.unit('16 comparisonBase')), true)
  })

  it('should not apply offsets to derived units', function () {
    assert.strictEqual(math.equal(math.unit('9 degC/s'), math.unit('9 K/s')), true)
    assert.strictEqual(math.equal(math.unit('9 degC^2'), math.unit('9 K^2')), true)
    assert.strictEqual(math.smaller(math.unit('9 degC/s'), math.unit('10 K/s')), true)
  })

  it('should preserve small differences on the same temperature scale', function () {
    const low = math.unit(0, 'degC')
    const high = math.unit(1e-14, 'degC')
    assert.strictEqual(math.smaller(low, high), true)
    assert.strictEqual(math.equal(low, high), false)
    assert.strictEqual(low.equals(high), false)
  })

  it('should preserve small differences when custom units share an origin', function () {
    const custom = math.create()
    custom.createUnit('comparisonBase')
    custom.createUnit('comparisonFirst', { definition: '2 comparisonBase', offset: 5 })
    custom.createUnit('comparisonSecond', { definition: '1 comparisonBase', offset: 10 })
    const low = custom.unit(0, 'comparisonFirst')
    const high = custom.unit(1e-14, 'comparisonSecond')
    assert.strictEqual(custom.smaller(low, high), true)
    assert.strictEqual(custom.equal(low, high), false)
    assert.strictEqual(low.equals(high), false)
  })

  it('should leave arithmetic and the compared units unchanged', function () {
    const low = math.unit('9 degC')
    const high = math.unit('283.15 K')
    const before = [low.toJSON(), high.toJSON()]
    math.smaller(low, high)
    low.equals(high)
    assert.deepStrictEqual([low.toJSON(), high.toJSON()], before)
    assert.strictEqual(math.add(math.unit('5 degC'), math.unit('10 degC')).toString(), '15 degC')
    assert.strictEqual(math.multiply(math.unit('14 degF'), 2).toString(), '28 degF')
  })
})
