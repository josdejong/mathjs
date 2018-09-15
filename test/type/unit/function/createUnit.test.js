const assert = require('assert')
const math = require('../../../../src/main')
const createUnit = math.createUnit

describe('createUnit', function () {
  it('should create a unit', function () {
    createUnit('flibbity', '4 hogshead')
    assert.strictEqual(math.eval('2 flibbity to hogshead').toString(), '8 hogshead')
  })

  it('should accept a unit as second parameter', function () {
    assert.strictEqual(math.eval('50 in^2 to createUnit("bingo", 25 in^2)').toString(), '2 bingo')
  })

  it('should accept a string as second parameter', function () {
    assert.strictEqual(math.eval('50 in^2 to createUnit("zingo", "25 in^2")').toString(), '2 zingo')
  })

  it('should return the created unit', function () {
    assert.strictEqual(math.eval('createUnit("giblet", "6 flibbity")').toString(), 'giblet')
    assert.strictEqual(math.eval('120 hogshead to createUnit("fliblet", "0.25 giblet")').format(4), '20 fliblet')
  })

  it('should accept options', function () {
    math.eval('createUnit("whosit", { definition: 3.14 kN, prefixes:"long"})')
    assert.strictEqual(math.eval('1e-9 whosit').toString(), '1 nanowhosit')

    math.eval('createUnit("wheresit", { definition: 3.14 kN, offset:2})')
    assert.strictEqual(math.eval('1 wheresit to kN').toString(), '9.42 kN')
  })

  it('should create multiple units', function () {
    math.eval('createUnit({"xfoo":{}, "xbar":{}, "xfoobar":"1 xfoo xbar"})')
    assert.strictEqual(math.eval('5 xfoo').toString(), '5 xfoo')
  })

  it('should simplify created units', function () {
    // TODO: New units do not have base units set, therefore simplifying is impossible. Figure out a way to create base units for created units.
    assert.strictEqual(math.eval('5 xfoo * 5 xbar').toString(), '25 xfoobar')
  })

  it('should override units', function () {
    math.eval('createUnit({"bar": 1e12 Pa}, {"override":true})')
    assert.strictEqual(math.eval('1 bar to Pa').toString(), '1e+12 Pa')
  })
})
