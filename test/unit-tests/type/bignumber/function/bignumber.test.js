import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const BigNumber = math.BigNumber

describe('bignumber', function () {
  it('should create a bignumber', function () {
    // no arguments
    const n = bignumber()
    assert.ok(n instanceof BigNumber)
    assert.strictEqual(n.valueOf(), '0')

    // from number
    const a1 = bignumber(0.1)
    assert.ok(a1 instanceof BigNumber)
    assert.strictEqual(a1.valueOf(), '0.1')

    // from Fraction
    const a2 = bignumber(math.fraction(0.1))
    assert.ok(a2 instanceof BigNumber)
    assert.strictEqual(a2.valueOf(), '0.1')

    // from number with >15 digits
    const a3 = bignumber(1 / 3)
    assert.ok(a3 instanceof BigNumber)
    assert.strictEqual(a3.valueOf(), '0.3333333333333333')

    // from string
    const b = bignumber('0.1')
    assert.ok(b instanceof BigNumber)
    assert.strictEqual(b.valueOf(), '0.1')

    // from boolean
    const c1 = bignumber(true)
    assert.ok(c1 instanceof BigNumber)
    assert.strictEqual(c1.valueOf(), '1')

    // from null
    const c2 = bignumber(null)
    assert.ok(c2 instanceof BigNumber)
    assert.strictEqual(c2.valueOf(), '0')

    // from array
    const d = bignumber([0.1, 0.2, '0.3'])
    assert.ok(Array.isArray(d))
    assert.strictEqual(d.length, 3)
    assert.ok(d[0] instanceof BigNumber)
    assert.ok(d[1] instanceof BigNumber)
    assert.ok(d[2] instanceof BigNumber)
    assert.strictEqual(d[0].valueOf(), '0.1')
    assert.strictEqual(d[1].valueOf(), '0.2')
    assert.strictEqual(d[2].valueOf(), '0.3')

    // from matrix
    const e = bignumber(math.matrix([0.1, 0.2]))
    assert.ok(e instanceof math.Matrix)
    assert.deepStrictEqual(e.size(), [2])
    assert.ok(e.get([0]) instanceof BigNumber)
    assert.ok(e.get([1]) instanceof BigNumber)
    assert.strictEqual(e.get([0]).valueOf(), '0.1')
    assert.strictEqual(e.get([1]).valueOf(), '0.2')

    // really big
    const f = bignumber('1.2e500')
    assert.strictEqual(f.valueOf(), '1.2e+500')
  })

  it('should create a bignumber from a fraction', function () {
    const f = math.fraction(2, 3)
    const b = math.bignumber(f)
    assert.strictEqual(b.toString(), '0.6666666666666666666666666666666666666666666666666666666666666667')
  })

  it('should create a bignumber from a bigint', function () {
    assert.deepStrictEqual(math.bignumber(12345678901234567890n), new BigNumber('12345678901234567890'))
  })

  it('should convert the number value of a Unit to BigNumber', function () {
    const b = math.bignumber(math.unit(10, 'inch')).toNumeric('cm')

    assert.ok(b instanceof BigNumber)
    assert.strictEqual(b.valueOf(), '25.4')
  })

  it('should convert the Fraction value of a Unit to BigNumber', function () {
    const b = math.bignumber(math.unit(math.fraction(1, 2), 'cm')).toNumeric('cm')

    assert.ok(b instanceof BigNumber)
    assert.strictEqual(b.valueOf(), '0.5')
  })

  it('should apply precision setting to bignumbers', function () {
    const mymath = math.create({
      precision: 32
    })

    const a = mymath.bignumber(1).dividedBy(3)
    assert.strictEqual(a.toString(), '0.33333333333333333333333333333333')
  })

  it('should support very high precisions', function () {
    const mymath = math.create({
      precision: 2000
    })

    const a = mymath.bignumber(1).dividedBy(3)

    const aStr = '0.' + Array(2001).join('3')
    assert.strictEqual(a.toString(), aStr)
  })

  it('should throw an error in case of unsupported type of argument', function () {
    assert.throws(function () { math.bignumber(new Date()) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.bignumber(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX bignumber', function () {
    const expr1 = math.parse('bignumber()')
    const expr2 = math.parse('bignumber(1)')

    assert.strictEqual(expr1.toTex(), '0')
    assert.strictEqual(expr2.toTex(), '\\left(1\\right)')
  })
})
