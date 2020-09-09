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
})
