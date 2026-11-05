import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
const splitUnit = math.splitUnit
const Unit = math.Unit

describe('splitUnit', function () {
  it('should split a unit into parts', function () {
    assert.strictEqual(splitUnit(new Unit(1, 'm'), ['ft', 'in']).toString(), '3 ft,3.3700787401574765 in')
    assert.strictEqual(splitUnit(new Unit(-1, 'm'), ['ft', 'in']).toString(), '-3 ft,-3.3700787401574765 in')
    assert.strictEqual(splitUnit(new Unit(1, 'm/s'), ['m/s']).toString(), '1 m / s')

    assert.strictEqual(math.evaluate('splitUnit(1 m, [ft, in])').toString(), '3 ft,3.3700787401574765 in')
  })

  it('should split a unit when parts are passed as a Matrix', function () {
    // when splitUnit is called as a method in the expression parser, the parts
    // are passed as a Matrix rather than an Array (see #3644)
    assert.strictEqual(splitUnit(new Unit(1, 'm'), math.matrix(['ft', 'in'])).toString(), '3 ft,3.3700787401574765 in')

    assert.strictEqual(math.evaluate('(1 m).splitUnit([ft, in])').toString(), '3 ft,3.3700787401574765 in')
    assert.strictEqual(math.evaluate('(1 m).splitUnit(["ft", "in"])').toString(), '3 ft,3.3700787401574765 in')
  })
})
