const assert = require('assert')
const math = require('../../../src/main')

describe('Fraction', function () {
  it('should have a property isFraction', function () {
    const a = new math.type.Fraction(1, 3)
    assert.strictEqual(a.isFraction, true)
  })

  it('should have a property type', function () {
    const a = new math.type.Fraction(1, 3)
    assert.strictEqual(a.type, 'Fraction')
  })

  it('should have a valueOf method', function () {
    const a = new math.type.Fraction(1, 2)
    assert.strictEqual(a.valueOf(), 0.5)
  })

  it('toJSON', function () {
    assert.deepStrictEqual(new math.type.Fraction(0.375).toJSON(), { 'mathjs': 'Fraction', n: 3, d: 8 })
    assert.deepStrictEqual(new math.type.Fraction(-0.375).toJSON(), { 'mathjs': 'Fraction', n: -3, d: 8 })
  })

  it('fromJSON', function () {
    const b = math.type.Fraction.fromJSON({ n: 3, d: 8 })
    assert.ok(b instanceof math.type.Fraction)
    assert.strictEqual(b.toString(), '0.375')

    const c = math.type.Fraction.fromJSON({ n: -3, d: 8 })
    assert.ok(c instanceof math.type.Fraction)
    assert.strictEqual(c.toString(), '-0.375')

    const d = math.type.Fraction.fromJSON({ n: 3, d: -8 })
    assert.ok(d instanceof math.type.Fraction)
    assert.strictEqual(d.toString(), '-0.375')
  })
})
