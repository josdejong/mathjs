import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
const createUnit = math.createUnit

describe('createUnit', function () {
  it('should create a unit', function () {
    createUnit('flibbity', '4 hogshead')
    assert.strictEqual(math.evaluate('2 flibbity to hogshead').toString(), '8 hogshead')
  })

  it('should accept a unit as second parameter', function () {
    assert.strictEqual(math.evaluate('50 in^2 to createUnit("bingo", 25 in^2)').toString(), '2 bingo')
  })

  it('should accept a string as second parameter', function () {
    assert.strictEqual(math.evaluate('50 in^2 to createUnit("zingo", "25 in^2")').toString(), '2 zingo')
  })

  it('should return the created unit', function () {
    assert.strictEqual(math.evaluate('createUnit("giblet", "6 flibbity")').toString(), 'giblet')
    assert.strictEqual(math.evaluate('120 hogshead to createUnit("fliblet", "0.25 giblet")').format(4), '20 fliblet')
  })

  it('should accept options', function () {
    math.evaluate('createUnit("whosit", { definition: 3.14 kN, prefixes:"long"})')
    assert.strictEqual(math.evaluate('1e-9 whosit').toString(), '1 nanowhosit')

    math.evaluate('createUnit("wheresit", { definition: 3.14 kN, offset:2})')
    assert.strictEqual(math.evaluate('1 wheresit to kN').toString(), '9.42 kN')
  })

  it('should create multiple units', function () {
    math.evaluate('createUnit({"xfoo":{}, "xbar":{}, "xfoobar":"1 xfoo xbar"})')
    assert.strictEqual(math.evaluate('5 xfoo').toString(), '5 xfoo')
  })

  it('should simplify created units', function () {
    // TODO: New units do not have base units set, therefore simplifying is impossible. Figure out a way to create base units for created units.
    assert.strictEqual(math.evaluate('5 xfoo * 5 xbar').toString(), '25 xfoobar')
  })

  it('should override units', function () {
    const math2 = math.create()
    math2.evaluate('createUnit({"bar": 1e12 Pa}, {"override":true})')
    assert.strictEqual(math2.evaluate('1 bar to Pa').toString(), '1e+12 Pa')
  })
})
