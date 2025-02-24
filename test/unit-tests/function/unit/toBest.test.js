import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const Unit = math.Unit

describe('toBest', function () {
  it('should convert meters to kilometers', function () {
    const meters = new Unit(5000, 'm')
    assert.equal(meters.toBest().toString(), '5 km')
  })

  it('should convert seconds to microseconds', function () {
    const smallTime = new Unit(0.000001, 's')
    assert.equal(smallTime.toBest().toString(), '1 us')
  })

  it('should keep value in base unit when appropriate', function () {
    const normalTemp = new Unit(15.7, 'degC')
    assert.equal(normalTemp.toBest().toString(), '15.7 degC')
  })

  it('should convert large values to mega prefix', function () {
    const watts = new Unit(3500000, 'W')
    assert.equal(watts.toBest().toString(), '3.5 MW')
  })

  it('should convert very small values to nano prefix', function () {
    const amps = new Unit(0.000000123, 'A')
    assert.equal(amps.toBest().toString(), '123 nA')
  })

  it('should keep original unit at prefix boundary', function () {
    const boundary = new Unit(1000, 'm')
    assert.equal(boundary.toBest().toString(), '1000 m')
  })

  it('should handle negative values correctly', function () {
    const negativeValue = new Unit(-0.002, 'A')
    assert.equal(negativeValue.toBest().toString(), '-2 mA')
  })

  it('should convert to best matching prefix within preferred units', function () {
    const meter = new Unit(0.007, 'km')
    assert.equal(meter.toBest(['mm', 'm', 'km']).toString(), '7 m')
  })

  it('should return original unit if no preferred unit matches', function () {
    const temp = new Unit(20, 'degC')
    assert.equal(temp.toBest(['kelvin', 'fahrenheit']).toString(), '20 degC')
  })

  it('should throw error if preferred units is not an array', function () {
    const meter = new Unit(0.007, 'km')
    assert.throws(() => meter.toBest('mm'), TypeError, 'Preferred units must be an array')
  })

  it('should pick unit closest to 1 when multiple matches exist', function () {
    const value = new Unit(1500, 'mm')
    assert.equal(value.toBest(['mm', 'cm', 'm']).toString(), '1.5 m')
  })

  it('should handle negative values correctly', function () {
    const value = new Unit(-1500, 'mm')
    assert.equal(value.toBest(['mm', 'cm', 'm']).toString(), '-1.5 m')
  })

  it('should ignore incompatible units in preferred units array', function () {
    const distance = new Unit(1500, 'mm')
    assert.equal(distance.toBest(['kg', 'mm', 'cm', 'kelvin', 'm']).toString(), '1.5 m')
  })

  it('should return the right unit if given an array of incompatible units', function () {
    const distance = new Unit(1500, 'mm')
    assert.equal(distance.toBest(['kg', 'kelvin']).toString(), '1.5 m')
  })
})
