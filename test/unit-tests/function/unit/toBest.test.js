import math from '../../../../src/defaultInstance.js'
import assert from 'assert'

const Unit = math.create().Unit

function assertUnit (actualUnit, expectedValue, expectedPrefix, expectedName) {
  assert.equal(actualUnit.value, expectedValue)
  assert.equal(actualUnit.units[0].prefix.name, expectedPrefix)
  assert.equal(actualUnit.units[0].unit.name, expectedName)
  assert.equal(actualUnit.units.length, 1)
}

describe('toBest', function () {
  it('should return the best unit without any parameters', function () {
    assertUnit(new Unit(2 / 3, 'cm').toBest(), 0.006666666666666666, 'c', 'm')
  })

  it('should format a unit without any value', function () {
    assertUnit(new Unit(null, 'cm').toBest(), null, 'c', 'm')
  })

  it('should return the best unit with only given unit array - valorized and empty', function () {
    const unit1 = new Unit(10, 'm')
    assertUnit(unit1.toBest(['km', 'mm', 'cm']), 10, 'm', 'm')

    const unit2 = new Unit(5, 'm')
    assertUnit(unit2.toBest(['cm', 'mm']), 5, 'c', 'm')
  })

  it('should return the best unit with valueless unit as parameter', function () {
    assertUnit(new Unit(1000, 'cm').toBest([new Unit(null, 'km')]), 10, 'k', 'm')
  })

  it('should return the best unit with given array and offset', function () {
    assertUnit(new Unit(10, 'm').toBest(['mm', 'km'], { offset: 1.5 }), 10, 'm', 'm')
  })

  it('should handle negative values correctly', function () {
    assertUnit(new Unit(-1000, 'cm').toBest(), -10, 'c', 'm')
  })

  it('should handle zero values correctly', function () {
    assertUnit(new Unit(0, 'km').toBest(), 0, 'k', 'm')
    assertUnit(new Unit(0, 'cm').toBest(['km', 'm', 'cm', 'mm']), 0, 'k', 'm')
  })

  it('should throw error for first parameter not being an array', function () {
    assert.throws(
      () => new Unit(2 / 3, 'cm').toBest(new Unit(null, 'cm')),
      /Invalid unit type. Expected string or Unit./
    )
  })

  it('should return the correct string representation', function () {
    assert.equal(new Unit(2 / 3, 'cm').toBest().toString(), '0.6666666666666666 cm')
    assert.equal(new Unit(5, 'm').toBest(['cm', 'mm']).toString(), '500 cm')
    assert.equal(new Unit(1000, 'cm').toBest(['m', 'km']).toString(), '10 m')
  })

  const incompatibleUnits = [
    ['length to mass', 'm', ['kg']],
    ['length to mass times length', 'm', ['kg m']],
    ['force to power', 'N', ['W']],
    ['mass to temperature', 'kg', ['degC']],
    ['amount of substance to angle', 'mol', ['rad']],
    ['area to volume', 'm^2', ['m^3']],
    ['frequency to pressure', 'Hz', ['Pa']],
    ['energy to luminous intensity', 'J', ['cd']]
  ]

  incompatibleUnits.forEach(([description, sourceUnit, targetUnits]) => {
    it(`should throw error when converting ${description}`, function () {
      assert.throws(
        () => new Unit(1, sourceUnit).toBest(targetUnits),
        /Invalid unit type. Expected compatible string or Unit./
      )
    })
  })
})
