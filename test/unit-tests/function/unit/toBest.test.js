import math from '../../../../src/defaultInstance.js'
import assert from 'assert'

const Unit = math.create().Unit

describe('toBest', function () {
  it('should return the best unit without any parameters', function () {
    assert.equal((new Unit(2 / 3, 'cm').toBest()).units[0].unit.name, 'm')
    assert.equal((new Unit(2 / 3, 'cm').toBest()).units[0].prefix.name, 'c')
    assert.equal((new Unit(2 / 3, 'cm').toBest()).value, 0.6666666666666666)
  })

  it('should format a unit without any value', function () {
    assert.equal(new Unit(null, 'cm').toBest().units[0].unit.name, 'm')
    assert.equal(new Unit(null, 'cm').toBest().units[0].prefix.name, 'c')
    assert.equal(new Unit(null, 'cm').toBest().value, 0)
  })

  it('should return the best unit with only given unit array - valorized and empty', function () {
    const unit1 = new Unit(10, 'm')
    assert.equal(unit1.toBest(['km', 'mm', 'cm']).units[0].unit.name, 'm')
    assert.equal(unit1.toBest(['km', 'mm', 'cm']).units[0].prefix.name, 'm')
    assert.equal(unit1.toBest(['km', 'mm', 'cm']).value, 10000)

    const unit2 = new Unit(5, 'm')

    assert.equal(unit2.toBest(['cm', 'mm']).units[0].unit.name, 'm')
    assert.equal(unit2.toBest(['cm', 'mm']).units[0].prefix.name, 'c')
    assert.equal(unit2.toBest(['cm', 'mm']).value, 500)
  })

  it('should return the best unit with valueless unit as parameter', function () {
    assert.equal(new Unit(1000, 'cm').toBest([new Unit(null, 'km')]).units[0].unit.name, 'm')
    assert.equal(new Unit(1000, 'cm').toBest([new Unit(null, 'km')]).units[0].prefix.name, 'k')
    assert.equal(new Unit(1000, 'cm').toBest([new Unit(null, 'km')]).value, 0.01)
  })

  it('should return the best unit with given array and offset', function () {
    assert.equal(new Unit(10, 'm').toBest(['mm', 'km'], { offset: 1.5 }).units[0].unit.name, 'm')
    assert.equal(new Unit(10, 'm').toBest(['mm', 'km'], { offset: 1.5 }).units[0].prefix.name, 'm')
    assert.equal(new Unit(10, 'm').toBest(['mm', 'km'], { offset: 1.5 }).value, 10000)
  })

  it('should handle negative values correctly', function () {
    assert.equal(new Unit(-1000, 'cm').toBest().units[0].unit.name, 'm')
    assert.equal(new Unit(-1000, 'cm').toBest().units[0].prefix.name, 'c')
    assert.equal(new Unit(-1000, 'cm').toBest().value, -1000)
  })

  it('should handle zero values correctly', function () {
    assert.equal(new Unit(0, 'km').toBest().units[0].unit.name, 'm')
    assert.equal(new Unit(0, 'km').toBest().units[0].prefix.name, 'k')
    assert.equal(new Unit(0, 'km').toBest().value, 0)

    assert.equal(new Unit(0, 'cm').toBest(['km', 'm', 'cm', 'mm']).units[0].unit.name, 'm')
    assert.equal(new Unit(0, 'cm').toBest(['km', 'm', 'cm', 'mm']).units[0].prefix.name, 'k')
    assert.equal(new Unit(0, 'cm').toBest(['km', 'm', 'cm', 'mm']).value, 0)
  })

  it('should throw error for first parameter not being an array', function () {
    assert.throws(
      () => new Unit(2 / 3, 'cm').toBest(new Unit(null, 'cm')),
      /Invalid unit type. Expected string or Unit./
    )
  })

  it('should throw error for incompatible units', function () {
    const functions = []
    functions.push(() => new Unit(1, 'm').toBest(['kg']))
    functions.push(() => new Unit(1, 'm').toBest(['kg m']))
    functions.push(() => new Unit(1, 'N').toBest(['W']))
    functions.push(() => new Unit(1, 'kg').toBest(['degC']))
    functions.push(() => new Unit(1, 'mol').toBest(['rad']))
    functions.push(() => new Unit(1, 'm^2').toBest(['m^3']))
    functions.push(() => new Unit(1, 'Hz').toBest(['Pa']))
    functions.push(() => new Unit(1, 'J').toBest(['cd']))
    functions.forEach((u) => {
      assert.throws(u, /Invalid unit type. Expected compatible string or Unit./)
    })
  })
})
