import assert from 'assert'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
import { isBigNumber, isFraction } from '../../../../src/utils/is.js'
import { hasOwnProperty } from '../../../../src/utils/object.js'

const Unit = math.Unit

describe('Unit', function () {
  describe('constructor', function () {
    it('should create unit correctly', function () {
      let unit1 = new Unit(5000, 'cm')
      assert.strictEqual(unit1.value, 50)
      assert.strictEqual(unit1.units[0].unit.name, 'm')

      unit1 = new Unit(5, 'kg')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')

      unit1 = new Unit(null, 'kg')
      assert.strictEqual(unit1.value, null)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.valueType(), 'null')

      unit1 = new Unit(10, 'Hz')
      assert.strictEqual(unit1.value, 10)
      assert.strictEqual(unit1.units[0].unit.name, 'Hz')
      assert.strictEqual(unit1.valueType(), 'number')

      unit1 = new Unit(9.81, 'kg m/s^2')
      assert.strictEqual(unit1.value, 9.81)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[1].unit.name, 'm')
      assert.strictEqual(unit1.units[2].unit.name, 's')
    })

    it('should create a unit with Fraction value', function () {
      const unit1 = new Unit(math.fraction(1000, 3), 'cm')
      assert.deepStrictEqual(unit1.value, math.fraction(10, 3))
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.valueType(), 'Fraction')
    })

    it('should create a unit with BigNumber value', function () {
      const unit1 = new Unit(math.bignumber(5000), 'cm')
      assert.deepStrictEqual(unit1.value, math.bignumber(50))
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.valueType(), 'BigNumber')
    })

    it('should create a unit with Complex value', function () {
      const unit1 = new Unit(math.complex(500, 600), 'cm')
      assert.deepStrictEqual(unit1.value, math.complex(5, 6))
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.valueType(), 'Complex')
    })

    it('should create square meter correctly', function () {
      const unit1 = new Unit(0.000001, 'km2')
      assert.strictEqual(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 'm2')
    })

    it('should create cubic meter correctly', function () {
      const unit1 = new Unit(0.000000001, 'km3')
      assert.strictEqual(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 'm3')
    })

    it('should create a unit from an existing unit', function () {
      const unit1 = new Unit(null, 'm/s^2')
      const unit2 = new Unit(5, unit1)
      assert.strictEqual(unit2.value, 5)
      assert.strictEqual(unit2.units.length, 2)
      assert.strictEqual(unit2.units[0].unit.name, 'm')
      assert.strictEqual(unit2.units[1].unit.name, 's')
      assert.strictEqual(unit2.units[1].power, -2)
    })

    it('should create a unitless Unit if second parameter is undefined', function () {
      const a = new Unit(6)
      assert(a.dimensions.every(d => d === 0))
    })

    it('should ignore properties on Object.prototype', function () {
      Object.prototype.foo = Unit.UNITS.meter // eslint-disable-line no-extend-native

      assert.throws(function () { console.log(new Unit(1, 'foo')) }, /Unit "foo" not found/)

      delete Object.prototype.foo
    })

    it('should throw an error if called without new keyword', function () {
      assert.throws(function () {
        Unit(2, 'inch')
      })
    })

    it('should throw an error if called with wrong type of arguments', function () {
      assert.throws(function () { console.log(new Unit('24', 'inch')) })
      assert.throws(function () { console.log(new Unit(0, 'bla')) })
      assert.throws(function () { console.log(new Unit(4, '')) })
      assert.throws(function () { console.log(new Unit(0, 3)) })
    })

    it('should skip automatic simplification if created directly in the constructor', function () {
      const unit1 = new Unit(9.81, 'kg m/s^2')
      assert.strictEqual(unit1.skipAutomaticSimplification, true)
      assert.strictEqual(unit1.toString(), '9.81 (kg m) / s^2')

      const unit2 = new Unit(null, 'kg m/s^2')
      assert.strictEqual(unit2.skipAutomaticSimplification, true)
      assert.strictEqual(unit2.toString(), '(kg m) / s^2')
    })
  })

  describe('isValuelessUnit', function () {
    it('should return true if the string is a plain unit', function () {
      assert.strictEqual(Unit.isValuelessUnit('cm'), true)
      assert.strictEqual(Unit.isValuelessUnit('inch'), true)
      assert.strictEqual(Unit.isValuelessUnit('kb'), true)
    })

    it('should return false if the unit is not a plain unit', function () {
      assert.strictEqual(Unit.isValuelessUnit('bla'), false)
      assert.strictEqual(Unit.isValuelessUnit('5cm'), false)
    })
  })

  describe('type', function () {
    it('should have a property isUnit', function () {
      const a = new math.Unit(5, 'cm')
      assert.strictEqual(a.isUnit, true)
    })

    it('should have a property type', function () {
      const a = new math.Unit(5, 'cm')
      assert.strictEqual(a.type, 'Unit')
    })
  })

  describe('hasBase', function () {
    it('should test whether a unit has a certain base unit', function () {
      assert.strictEqual(new Unit(5, 'cm').hasBase(Unit.BASE_UNITS.ANGLE), false)
      assert.strictEqual(new Unit(5, 'cm').hasBase(Unit.BASE_UNITS.LENGTH), true)
      assert.strictEqual(new Unit(5, 'kg m / s ^ 2').hasBase(Unit.BASE_UNITS.FORCE), true)
    })
  })

  describe('equalBase', function () {
    it('should test whether two units have the same base unit', function () {
      assert.strictEqual(new Unit(5, 'cm').equalBase(new Unit(10, 'm')), true)
      assert.strictEqual(new Unit(5, 'cm').equalBase(new Unit(10, 'kg')), false)
      assert.strictEqual(new Unit(5, 'N').equalBase(new Unit(10, 'kg m / s ^ 2')), true)
      assert.strictEqual(new Unit(8.314, 'J / mol K').equalBase(new Unit(0.02366, 'ft^3 psi / mol degF')), true)
    })
  })

  describe('equals', function () {
    it('should test whether two units are equal', function () {
      assert.strictEqual(new Unit(100, 'cm').equals(new Unit(1, 'm')), true)
      assert.strictEqual(new Unit(100, 'cm').equals(new Unit(2, 'm')), false)
      assert.strictEqual(new Unit(100, 'cm').equals(new Unit(1, 'kg')), false)
      assert.strictEqual(new Unit(100, 'ft lbf').equals(new Unit(1200, 'in lbf')), true)
      assert.strictEqual(new Unit(100, 'N').equals(new Unit(100, 'kg m / s ^ 2')), true)
      assert.strictEqual(new Unit(100, 'N').equals(new Unit(100, 'kg m / s')), false)
      assert.strictEqual(new Unit(100, 'Hz').equals(new Unit(100, 's ^ -1')), true)
    })

    it('should test whether two units with Fractions are equal', function () {
      assert.strictEqual(new Unit(math.fraction(100), 'cm').equals(new Unit(math.fraction(1), 'm')), true)
      assert.strictEqual(new Unit(math.fraction(100), 'cm').equals(new Unit(math.fraction(2), 'm')), false)
    })

    it('should test whether two units with a Fraction and a number are equal', function () {
      assert.strictEqual(new Unit(math.fraction(100), 'cm').equals(new Unit(1, 'm')), true)
      assert.strictEqual(new Unit(100, 'cm').equals(new Unit(math.fraction(2), 'm')), false)
    })

    it('should test whether two Complex units are equal', function () {
      assert.strictEqual(new Unit(math.complex(3, 4), 'km').equals(new Unit(math.complex(3000, 4000), 'm')), true)
      assert.strictEqual(new Unit(math.complex(3, 4), 'km').equals(new Unit(math.complex(3000, 10), 'm')), false)
    })

    it('should test whether a Complex unit and a unit with a number are equal', function () {
      assert.strictEqual(new math.Unit(math.complex(3, 0), 'km').equals(new math.Unit(3000, 'm')), true)
      assert.strictEqual(new math.Unit(math.complex(3, 4), 'km').equals(new math.Unit(3000, 'm')), false)
    })
  })

  describe('clone', function () {
    it('should clone a unit', function () {
      const u1 = new Unit(100, 'cm')
      const u2 = u1.clone()
      assert(u1 !== u2)
      assert.deepStrictEqual(u1, u2)

      const u3 = new Unit(100, 'cm').to('inch')
      const u4 = u3.clone()
      assert(u3 !== u4)
      assert.deepStrictEqual(u3, u4)

      const u5 = new Unit(null, 'cm').to('inch')
      const u6 = u5.clone()
      assert(u5 !== u6)
      assert.deepStrictEqual(u5, u6)

      const u7 = new Unit(8.314, 'kg m^2 / s^2 K mol')
      const u8 = u7.clone()
      assert(u7 !== u8)
      assert.deepStrictEqual(u7, u8)
    })

    it('should clone a with a Fraction', function () {
      const u1 = new Unit(math.fraction(1, 3), 'cm')
      const u2 = u1.clone()
      assert(u1 !== u2)
      assert.deepStrictEqual(u1, u2)
      assert(u1.value !== u2.value) // should be cloned
    })

    it('should clone a Complex unit', function () {
      const u1 = new Unit(math.complex(1, 3), 'cm')
      const u2 = u1.clone()
      assert(u1 !== u2)
      assert.deepStrictEqual(u1, u2)
      assert(u1.value !== u2.value) // should be cloned
    })
  })

  describe('toNumber', function () {
    it('should convert a unit to a number', function () {
      const u = new Unit(5000, 'cm')
      approxEqual(u.toNumber('mm'), 50000)

      approxEqual(new Unit(5.08, 'cm').toNumber('inch'), 2)

      approxEqual(new Unit(101325, 'N/m^2').toNumber('lbf/in^2'), 14.6959487763741)
    })

    it('should convert a unit with fixed prefix to a number', function () {
      const u1 = new Unit(5000, 'cm')
      const u2 = u1.to('km')
      approxEqual(u2.toNumber('mm'), 50000)

      const u3 = new Unit(981, 'cm/s^2')
      const u4 = u3.to('km/ms^2')
      approxEqual(u4.toNumber('m/s^2'), 9.81)
    })

    it('should convert a unit with fraction to a number', function () {
      const u = new Unit(math.fraction(5), 'cm')
      assert.strictEqual(u.toNumber('mm'), 50)
    })

    it('should convert a unit with value only to a number', function () {
      const u = Unit.parse('5', { allowNoUnits: true })
      assert.strictEqual(u.toNumber(), 5)
    })
  })

  describe('toNumeric', function () {
    it('should convert a unit to a numeric value', function () {
      const u = new Unit(math.fraction(1, 3), 'cm')
      assert.deepStrictEqual(u.toNumeric('mm'), math.fraction(10, 3))
    })
  })

  describe('to', function () {
    it('should convert a unit to a fixed unitName', function () {
      const u1 = new Unit(5000, 'cm')
      assert.strictEqual(u1.value, 50)
      assert.strictEqual(u1.units[0].unit.name, 'm')
      assert.strictEqual(u1.units[0].prefix.name, 'c')
      assert.strictEqual(u1.fixPrefix, false)

      const u2 = u1.to('inch')
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 50)
      assert.strictEqual(u2.units[0].unit.name, 'inch')
      assert.strictEqual(u2.units[0].prefix.name, '')
      assert.strictEqual(u2.fixPrefix, true)

      const u3 = new Unit(299792.458, 'km/s')
      assert.strictEqual(u3.value, 299792458)
      assert.strictEqual(u3.units[0].unit.name, 'm')
      assert.strictEqual(u3.units[1].unit.name, 's')
      assert.strictEqual(u3.units[0].prefix.name, 'k')
      assert.strictEqual(u3.fixPrefix, false)

      const u4 = u3.to('mi/h')
      assert.notStrictEqual(u3, u4) // u4 must be a clone
      assert.strictEqual(u4.value, 299792458)
      assert.strictEqual(u4.units[0].unit.name, 'mi')
      assert.strictEqual(u4.units[1].unit.name, 'h')
      assert.strictEqual(u4.units[0].prefix.name, '')
      assert.strictEqual(u4.fixPrefix, true)
    })

    it('should avoid round-off in offset conversions', function () {
      assert.strictEqual(math.unit('-218.79 degC').to('degF').toString(), '-361.822 degF')
      assert.strictEqual(math.unit('-40 degC').to('degF').toString(), '-40 degF')
      assert.strictEqual(math.unit('32 degF').to('degC').toString(), '0 degC')
      assert.strictEqual(math.unit('68 degF').to('degC').toString(), '20 degC')
      assert.strictEqual(math.unit('98.6 degF').to('degC').toString(), '37 degC')
      assert.strictEqual(math.unit('212 degF').to('degC').toString(), '100 degC')
    })

    it('should avoid bignumber round-off in offset conversions', function () {
      assert.deepEqual(math.unit(math.bignumber(32), 'degF').toNumeric('degC'), math.bignumber(0))
      assert.deepEqual(math.unit(math.bignumber(10.5), 'degC').toNumeric('degF'), math.bignumber(50.9))
      assert.deepEqual(math.unit(math.bignumber(98.6), 'degF').toNumeric('degC'), math.bignumber(37))
    })

    it('should convert a unit with a fraction', function () {
      const u1 = new Unit(math.fraction(1, 3), 'm')

      const u2 = u1.to('cm')
      assert.deepStrictEqual(u2.value, math.fraction(1, 3))
      assert(math.isFraction(u2.value))
      assert.strictEqual(u2.units[0].unit.name, 'm')
      assert.strictEqual(u2.units[0].prefix.name, 'c')
      assert.strictEqual(u2.fixPrefix, true)
    })

    it('should convert a Complex unit', function () {
      const u1 = new Unit(math.complex(300, 400), 'kPa')
      const u2 = u1.to('lbf/in^2')
      approxDeepEqual(u2.value, math.complex(300000, 400000))
      assert.deepStrictEqual(u2.toString(), '(43.511321319062766 + 58.01509509208368i) lbf / in^2')
    })

    it('should convert a unit to a fixed unit', function () {
      const u1 = new Unit(5000, 'cm')
      assert.strictEqual(u1.value, 50)
      assert.strictEqual(u1.units[0].unit.name, 'm')
      assert.strictEqual(u1.units[0].prefix.name, 'c')
      assert.strictEqual(u1.fixPrefix, false)

      const u2 = u1.to(new Unit(null, 'km'))
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 50)
      assert.strictEqual(u2.units[0].unit.name, 'm')
      assert.strictEqual(u2.units[0].prefix.name, 'k')
      assert.strictEqual(u2.fixPrefix, true)

      const u3 = new Unit(5000, 'cm/s')
      assert.strictEqual(u3.value, 50)
      assert.strictEqual(u3.units[0].unit.name, 'm')
      assert.strictEqual(u3.units[1].unit.name, 's')
      assert.strictEqual(u3.units[0].prefix.name, 'c')
      assert.strictEqual(u3.fixPrefix, false)

      const u4 = u3.to(new Unit(null, 'km/h'))
      assert.notStrictEqual(u3, u4) // u4 must be a clone
      assert.strictEqual(u4.value, 50)
      assert.strictEqual(u4.units[0].unit.name, 'm')
      assert.strictEqual(u4.units[1].unit.name, 'h')
      assert.strictEqual(u4.units[0].prefix.name, 'k')
      assert.strictEqual(u4.fixPrefix, true)
    })

    it('should convert a valueless unit', function () {
      const u1 = new Unit(null, 'm')
      assert.strictEqual(u1.value, null)
      assert.strictEqual(u1.units[0].unit.name, 'm')
      assert.strictEqual(u1.units[0].prefix.name, '')
      assert.strictEqual(u1.fixPrefix, false)

      const u2 = u1.to(new Unit(null, 'cm'))
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 1) // u2 must have a value
      assert.strictEqual(u2.units[0].unit.name, 'm')
      assert.strictEqual(u2.units[0].prefix.name, 'c')
      assert.strictEqual(u2.fixPrefix, true)

      const u3 = new Unit(null, 'm/s')
      assert.strictEqual(u3.value, null)
      assert.strictEqual(u3.units[0].unit.name, 'm')
      assert.strictEqual(u3.units[1].unit.name, 's')
      assert.strictEqual(u3.units[0].prefix.name, '')
      assert.strictEqual(u3.fixPrefix, false)

      const u4 = u3.to(new Unit(null, 'cm/s'))
      assert.notStrictEqual(u3, u4) // u4 must be a clone
      assert.strictEqual(u4.value, 1) // u4 must have a value
      assert.strictEqual(u4.units[0].unit.name, 'm')
      assert.strictEqual(u4.units[1].unit.name, 's')
      assert.strictEqual(u4.units[0].prefix.name, 'c')
      assert.strictEqual(u4.fixPrefix, true)
    })

    it('should convert a unitless quantity', function () {
      const u = Unit.parse('5', { allowNoUnits: true })
      assert.strictEqual(u.toNumeric(), 5)
      assert.strictEqual(u.toNumeric('mm/m'), 5000)
    })

    it('should convert a binary prefixes (1)', function () {
      const u1 = new Unit(1, 'Kib')
      assert.strictEqual(u1.value, 1024)
      assert.strictEqual(u1.units[0].unit.name, 'b')
      assert.strictEqual(u1.units[0].prefix.name, 'Ki')
      assert.strictEqual(u1.fixPrefix, false)

      const u2 = u1.to(new Unit(null, 'b'))
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 1024) // u2 must have a value
      assert.strictEqual(u2.units[0].unit.name, 'b')
      assert.strictEqual(u2.units[0].prefix.name, '')
      assert.strictEqual(u2.fixPrefix, true)

      const u3 = new Unit(1, 'Kib/s')
      assert.strictEqual(u3.value, 1024)
      assert.strictEqual(u3.units[0].unit.name, 'b')
      assert.strictEqual(u3.units[1].unit.name, 's')
      assert.strictEqual(u3.units[0].prefix.name, 'Ki')
      assert.strictEqual(u3.fixPrefix, false)

      const u4 = u3.to(new Unit(null, 'b/s'))
      assert.notStrictEqual(u3, u4) // u4 must be a clone
      assert.strictEqual(u4.value, 1024) // u4 must have a value
      assert.strictEqual(u4.units[0].unit.name, 'b')
      assert.strictEqual(u4.units[1].unit.name, 's')
      assert.strictEqual(u4.units[0].prefix.name, '')
      assert.strictEqual(u4.fixPrefix, true)
    })

    it('should convert a binary prefixes (2)', function () {
      const u1 = new Unit(1, 'kb')
      assert.strictEqual(u1.value, 1000)
      assert.strictEqual(u1.units[0].unit.name, 'b')
      assert.strictEqual(u1.units[0].prefix.name, 'k')
      assert.strictEqual(u1.fixPrefix, false)

      const u2 = u1.to(new Unit(null, 'b'))
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 1000) // u2 must have a value
      assert.strictEqual(u2.units[0].unit.name, 'b')
      assert.strictEqual(u2.units[0].prefix.name, '')
      assert.strictEqual(u2.fixPrefix, true)
    })

    it('should skip automatic simplification if unit is result of to or toSI', function () {
      const u1 = new Unit(1, 'ft lbf').multiply(new Unit(2, 'rad'))
      assert.strictEqual(u1.skipAutomaticSimplification, false)
      const u2 = u1.to('in lbf rad')
      assert.strictEqual(u2.skipAutomaticSimplification, true)
      assert.strictEqual(u2.toString(), '24 in lbf rad')
      const u3 = u1.toSI()
      assert.strictEqual(u3.skipAutomaticSimplification, true)
      assert.strictEqual(u3.format(5), '2.7116 (kg m^2 rad) / s^2')
    })

    it('should throw an error when converting to an incompatible unit', function () {
      const u1 = new Unit(5000, 'cm')
      assert.throws(function () { u1.to('kg') }, /Units do not match/)
      const u2 = new Unit(5000, 'N s')
      assert.throws(function () { u2.to('kg^5 / s') }, /Units do not match/)
    })

    it('should throw an error when converting to a unit having a value', function () {
      const u1 = new Unit(5000, 'cm')
      assert.throws(function () { u1.to(new Unit(4, 'm')) }, /Cannot convert to a unit with a value/)
    })

    it('should throw an error when converting to an unsupported type of argument', function () {
      const u1 = new Unit(5000, 'cm')
      assert.throws(function () { u1.to(new Date()) }, /String or Unit expected as parameter/)
    })
  })

  describe('toString', function () {
    it('should convert to string properly', function () {
      assert.strictEqual(new Unit(5000, 'cm').toString(), '50 m')
      assert.strictEqual(new Unit(5, 'kg').toString(), '5 kg')
      assert.strictEqual(new Unit(2 / 3, 'm').toString(), '0.6666666666666666 m')
      assert.strictEqual(new Unit(5, 'N').toString(), '5 N')
      assert.strictEqual(new Unit(5, 'kg^1.0e0 m^1.0e0 s^-2.0e0').toString(), '5 (kg m) / s^2')
      assert.strictEqual(new Unit(5, 's^-2').toString(), '5 s^-2')
      assert.strictEqual(new Unit(5, 'm / s ^ 2').toString(), '5 m / s^2')
      assert.strictEqual(new Unit(null, 'kg m^2 / s^2 / mol').toString(), '(kg m^2) / (s^2 mol)')
      assert.strictEqual(new Unit(10, 'hertz').toString(), '10 hertz')
    })

    it('should render with the best prefix', function () {
      assert.strictEqual(new Unit(0.000001, 'm').format(8), '1 um')
      assert.strictEqual(new Unit(0.00001, 'm').format(8), '10 um')
      assert.strictEqual(new Unit(0.0001, 'm').format(8), '100 um')
      assert.strictEqual(new Unit(0.0005, 'm').format(8), '500 um')
      assert.strictEqual(new Unit(0.0006, 'm').toString(), '0.6 mm')
      assert.strictEqual(new Unit(0.001, 'm').toString(), '1 mm')
      assert.strictEqual(new Unit(0.01, 'm').toString(), '10 mm')
      assert.strictEqual(new Unit(100000, 'm').toString(), '100 km')
      assert.strictEqual(new Unit(300000, 'm').toString(), '300 km')
      assert.strictEqual(new Unit(500000, 'm').toString(), '500 km')
      assert.strictEqual(new Unit(600000, 'm').toString(), '0.6 Mm')
      assert.strictEqual(new Unit(1000000, 'm').toString(), '1 Mm')
      assert.strictEqual(new Unit(2000, 'ohm').toString(), '2 kohm')
    })

    it('should keep the original prefix when in range', function () {
      assert.strictEqual(new Unit(0.0999, 'm').toString(), '99.9 mm')
      assert.strictEqual(new Unit(0.1, 'm').toString(), '0.1 m')
      assert.strictEqual(new Unit(0.5, 'm').toString(), '0.5 m')
      assert.strictEqual(new Unit(0.6, 'm').toString(), '0.6 m')
      assert.strictEqual(new Unit(1, 'm').toString(), '1 m')
      assert.strictEqual(new Unit(10, 'm').toString(), '10 m')
      assert.strictEqual(new Unit(100, 'm').toString(), '100 m')
      assert.strictEqual(new Unit(300, 'm').toString(), '300 m')
      assert.strictEqual(new Unit(500, 'm').toString(), '500 m')
      assert.strictEqual(new Unit(600, 'm').toString(), '600 m')
      assert.strictEqual(new Unit(1000, 'm').toString(), '1000 m')
      assert.strictEqual(new Unit(1001, 'm').toString(), '1.001 km')
    })

    it('should render best prefix for a single unit raised to integral power', function () {
      assert.strictEqual(new Unit(3.2e7, 'm^2').toString(), '32 km^2')
      assert.strictEqual(new Unit(3.2e-7, 'm^2').toString(), '0.32 mm^2')
      assert.strictEqual(new Unit(15000, 'm^-1').toString(), '15 mm^-1')
      assert.strictEqual(new Unit(3e-9, 'm^-2').toString(), '3000 Mm^-2')
      assert.strictEqual(new Unit(3e-9, 'm^-1.5').toString(), '3e-9 m^-1.5')
      assert.strictEqual(new Unit(2, 'kg^0').toString(), '2')
    })

    it('should not render best prefix if "fixPrefix" is set', function () {
      const u = new Unit(5e-3, 'm')
      u.fixPrefix = true
      assert.strictEqual(u.toString(), '0.005 m')
      u.fixPrefix = false
      assert.strictEqual(u.toString(), '5 mm')
    })

    it('should convert a unit with Fraction to string properly', function () {
      assert.strictEqual(new Unit(math.fraction(9 / 10), 'mm').toString(), '9/10 mm')
    })

    it('should convert a Complex unit to string properly', function () {
      assert.strictEqual(new Unit(math.complex(-1, -2), 'J / (mol K)').toString(), '(-1 - 2i) J / (mol K)')
    })
  })

  describe('simplify', function () {
    it('should not simplify units created with new Unit()', function () {
      const unit1 = new Unit(10, 'kg m/s^2')
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[1].unit.name, 'm')
      assert.strictEqual(unit1.units[2].unit.name, 's')
      assert.strictEqual(unit1.toString(), '10 (kg m) / s^2')
    })

    it('should only simplify units with values', function () {
      let unit1 = new Unit(null, 'kg m mol / s^2 / mol').pow(1) // Remove the "skipSimplify" flag
      assert.strictEqual(unit1.toString(), '(kg m mol) / (s^2 mol)')
      unit1 = math.multiply(unit1, 1)
      assert.strictEqual(unit1.toString(), '1 N')
    })

    it('should simplify units when they cancel out with {predictable: true}', function () {
      const math2 = math.create({ predictable: true })
      const unit1 = new math2.Unit(2, 'Hz')
      const unit2 = new math2.Unit(2, 's')
      const unit3 = math2.multiply(unit1, unit2)
      assert.strictEqual(unit3.toString(), '4')
      assert.strictEqual(unit3.simplify().units.length, 0)

      const nounit = math2.evaluate('40m * 40N / (40J)')
      assert.strictEqual(nounit.toString(), '40')
      assert.strictEqual(nounit.simplify().units.length, 0)

      const a = math2.unit('3 s^-1')
      const b = math2.unit('4 s')
      assert.strictEqual(math2.multiply(a, b).type, 'Unit')

      const c = math2.unit('8.314 J / mol / K')
      assert.strictEqual(math2.pow(c, 0).type, 'Unit')

      const d = math2.unit('60 minute')
      const e = math2.unit('1 s')
      assert.strictEqual(math2.divide(d, e).type, 'Unit')
    })

    it('should convert units to appropriate _numeric_ values when they cancel out with {predictable: false}', function () {
      const origConfig = math.config()
      math.config({ predictable: false })

      assert.strictEqual(typeof (math.evaluate('40 m * 40 N / (40 J)')), 'number')

      let bigunit = math.unit(math.bignumber(1), 'km')
      let smallunit = math.unit(math.bignumber(3000000), 'mm')
      let verybignumber = math.divide(bigunit, smallunit)
      assert.strictEqual(verybignumber.type, 'BigNumber')
      assert.strictEqual(verybignumber.toString(), '0.3333333333333333333333333333333333333333333333333333333333333333')

      bigunit = math.unit(math.fraction(1), 'km')
      smallunit = math.unit(math.fraction(3000000), 'mm')
      verybignumber = math.divide(bigunit, smallunit)
      assert.strictEqual(verybignumber.type, 'Fraction')
      assert.strictEqual(verybignumber.toFraction(), '1/3')

      const a = math.unit('3 s^-1')
      const b = math.unit('4 s')
      assert.strictEqual(typeof (math.multiply(a, b)), 'number')

      const c = math.unit('8.314 J / mol / K')
      assert.strictEqual(typeof (math.pow(c, 0)), 'number')

      const d = math.unit('60 minute')
      const e = math.unit('1 s')
      assert.strictEqual(typeof (math.divide(d, e)), 'number')

      math.config(origConfig)
    })

    it('should simplify units according to chosen unit system', function () {
      const unit1 = new Unit(10, 'N')
      Unit.setUnitSystem('us')
      assert.strictEqual(unit1.simplify().toString(), '2.248089430997105 lbf')
      assert.strictEqual(unit1.simplify().units[0].unit.name, 'lbf')

      Unit.setUnitSystem('cgs')
      assert.strictEqual(unit1.simplify().format(2), '1 Mdyn')
      assert.strictEqual(unit1.simplify().units[0].unit.name, 'dyn')
    })

    it('should correctly simplify units when unit system is "auto"', function () {
      Unit.setUnitSystem('auto')
      const unit1 = new Unit(5, 'lbf min / s')
      assert.strictEqual(unit1.simplify().toString(), '300 lbf')
    })

    it('should simplify user-defined units when unit system is "auto"', function () {
      Unit.setUnitSystem('auto')
      Unit.createUnit({ USD: '' })
      Unit.createUnit({ EUR: '1.15 USD' })
      assert.strictEqual(math.evaluate('10 EUR/hour * 2 hours').toString(), '20 EUR')
    })
  })

  describe('valueOf', function () {
    it('should return string representation when calling valueOf', function () {
      assert.strictEqual(new Unit(5000, 'cm').valueOf(), '50 m')
      assert.strictEqual(new Unit(5, 'kg').valueOf(), '5 kg')
      assert.strictEqual(new Unit(2 / 3, 'm').valueOf(), '0.6666666666666666 m')
      assert.strictEqual(new Unit(5, 'N').valueOf(), '5 N')
      assert.strictEqual(new Unit(5, 'kg^1.0e0 m^1.0e0 s^-2.0e0').valueOf(), '5 (kg m) / s^2')
      assert.strictEqual(new Unit(5, 's^-2').valueOf(), '5 s^-2')
    })
  })

  describe('json', function () {
    it('toJSON', function () {
      assert.deepStrictEqual(new Unit(5, 'cm').toJSON(),
        { mathjs: 'Unit', value: 5, unit: 'cm', fixPrefix: false, skipSimp: true })
      assert.deepStrictEqual(new Unit(5, 'cm').to('mm').toJSON(),
        { mathjs: 'Unit', value: 50, unit: 'mm', fixPrefix: true, skipSimp: true })
      assert.deepStrictEqual(new Unit(5, 'kN').to('kg m s ^ -2').toJSON(),
        { mathjs: 'Unit', value: 5000, unit: '(kg m) / s^2', fixPrefix: true, skipSimp: true })
      assert.deepStrictEqual(new Unit(math.fraction(0.375), 'cm').toJSON(),
        {
          mathjs: 'Unit',
          value: math.fraction(0.375), // Note that value is not serialized at this point, that will be done by JSON.stringify
          unit: 'cm',
          fixPrefix: false,
          skipSimp: true
        })
      approxDeepEqual(new Unit(math.complex(2, 4), 'g').toJSON(),
        {
          mathjs: 'Unit',
          value: math.complex(2, 4),
          unit: 'g',
          fixPrefix: false,
          skipSimp: true
        })

      assert.deepStrictEqual(math.evaluate('2 kg * 3 in^2').toJSON(),
        {
          mathjs: 'Unit',
          value: 6,
          unit: 'kg in^2',
          fixPrefix: false,
          skipSimp: false
        })

      const str = JSON.stringify(new Unit(math.fraction(0.375), 'cm'))
      assert.deepStrictEqual(str, '{"mathjs":"Unit","value":{"mathjs":"Fraction","n":"3","d":"8"},"unit":"cm","fixPrefix":false,"skipSimp":true}')

      const cmpx = JSON.stringify(new Unit(math.complex(2, 4), 'g'))
      assert.strictEqual(cmpx, '{"mathjs":"Unit","value":{"mathjs":"Complex","re":2,"im":4},"unit":"g","fixPrefix":false,"skipSimp":true}')
    })

    it('fromJSON', function () {
      const u1 = new Unit(5, 'cm')
      const u2 = Unit.fromJSON({ mathjs: 'Unit', value: 5, unit: 'cm', fixPrefix: false, skipSimp: true })
      assert.ok(u2 instanceof Unit)
      assert.deepStrictEqual(u2, u1)

      const u3 = new Unit(5, 'cm').to('mm')
      const u4 = Unit.fromJSON({ mathjs: 'Unit', value: 50, unit: 'mm', fixPrefix: true, skipSimp: true })
      assert.ok(u4 instanceof Unit)
      assert.deepStrictEqual(u4, u3)

      const u5 = new Unit(5, 'kN').to('kg m/s^2')
      const u6 = Unit.fromJSON({ mathjs: 'Unit', value: 5000, unit: 'kg m s^-2', fixPrefix: true, skipSimp: true })
      assert.ok(u6 instanceof Unit)
      assert.deepStrictEqual(u5, u6)

      const u7 = Unit.fromJSON({
        mathjs: 'Unit',
        value: math.fraction(0.375), // Note that value is already a Fraction at this point, that will be done by JSON.parse(str, reviver)
        unit: 'cm',
        fixPrefix: false,
        skipSimp: true
      })
      assert.deepStrictEqual(u7, new Unit(math.fraction(0.375), 'cm'))

      const u8 = Unit.fromJSON({
        mathjs: 'Unit',
        value: math.complex(2, 4),
        unit: 'g',
        fixPrefix: false,
        skipSimp: true
      })
      assert.deepStrictEqual(u8, new Unit(math.complex(2, 4), 'g'))

      const u9 = Unit.fromJSON({
        mathjs: 'Unit',
        value: 6,
        unit: 'kg in^2',
        fixPrefix: false,
        skipSimp: false
      })
      const u10 = math.evaluate('2 kg * 3 in^2')
      assert.deepStrictEqual(u9, u10)
    })

    it('toJSON -> fromJSON should recover an "equal" unit', function () {
      const unit1 = Unit.parse('1.23(m/(s/(kg mol)/(lbm/h)K))')
      const unit2 = Unit.fromJSON(unit1.toJSON())
      assert.strictEqual(unit1.equals(unit2), true)
    })
  })

  describe('format', function () {
    it('should format units with given precision', function () {
      assert.strictEqual(new Unit(2 / 3, 'm').format(3), '0.667 m')
      assert.strictEqual(new Unit(2 / 3, 'm').format(4), '0.6667 m')
      assert.strictEqual(new Unit(2 / 3, 'm').format(), '0.6666666666666666 m')
    })

    it('should format a unit without value', function () {
      assert.strictEqual(new Unit(null, 'cm').format(), 'cm')
      assert.strictEqual(new Unit(null, 'm').format(), 'm')
      assert.strictEqual(new Unit(null, 'kg m/s').format(), '(kg m) / s')
    })

    it('should format a unit with fixed prefix and without value', function () {
      assert.strictEqual(new Unit(null, 'km').to('cm').format(), '1e+5 cm')
      assert.strictEqual(new Unit(null, 'inch').to('cm').format(), '2.54 cm')
      assert.strictEqual(new Unit(null, 'N/m^2').to('lbf/inch^2').format(5), '1.4504e-4 lbf / inch^2')
    })

    it('should format a unit with a bignumber', function () {
      assert.strictEqual(new Unit(math.bignumber(1).plus(1e-30), 'm').format(), '1.000000000000000000000000000001 m')
      assert.strictEqual(new Unit(math.bignumber(1e30).plus(1), 'm').format(), '1.000000000000000000000000000001 Qm')
    })

    it('should format a unit with a fraction', function () {
      assert.strictEqual(new Unit(math.fraction(4 / 5), 'm').format(), '4/5 m')
    })

    it('should format a Complex unit', function () {
      assert.strictEqual(new Unit(math.complex(-2, 4.5), 'mm').format(14), '(-2 + 4.5i) mm')
    })

    it('should format units with VA and VAR correctly', function () {
      assert.strictEqual(math.evaluate('4000 VAR + 3000 VA').format(), '(3 + 4i) kVA')
      assert.strictEqual(math.evaluate('3000 VA + 4000 VAR').format(), '(3 + 4i) kVA')
      assert.strictEqual(math.evaluate('4000 VAR').format(), '(4) kVAR')
      assert.strictEqual(math.evaluate('4000i VA').format(), '(4) kVAR')
      assert.strictEqual(math.evaluate('4000i VAR').format(), '(-4) kVA')
      assert.strictEqual(math.evaluate('abs(4000 VAR + 3000 VA)').format(), '5 kW')
      assert.strictEqual(math.evaluate('abs(3000 VA + 4000 VAR)').format(), '5 kW')
      assert.strictEqual(math.evaluate('abs(4000 VAR)').format(), '4 kW')
      assert.strictEqual(math.evaluate('abs(4000i VA)').format(), '4 kW')
      assert.strictEqual(math.evaluate('abs(4000i VAR)').format(), '4 kW')
    })

    it('should ignore properties in Object.prototype when finding the best prefix', function () {
      Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native

      assert.strictEqual(new Unit(5e5, 'cm').format(), '5 km')

      delete Object.prototype.foo
    })
  })

  describe('parse', function () {
    it('should parse units correctly', function () {
      let unit1

      unit1 = Unit.parse('5kg')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('5 kg')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse(' 5 kg ')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('5e-3kg')
      assert.strictEqual(unit1.value, 0.005)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('5e+3kg')
      assert.strictEqual(unit1.value, 5000)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('5e3kg')
      assert.strictEqual(unit1.value, 5000)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('-5kg')
      assert.strictEqual(unit1.value, -5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('+5kg')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('.5kg')
      assert.strictEqual(unit1.value, 0.5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('-5mg')
      approxEqual(unit1.value, -0.000005)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'm')

      unit1 = Unit.parse('5.2mg')
      approxEqual(unit1.value, 0.0000052)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix.name, 'm')

      unit1 = Unit.parse('300 kg/minute')
      approxEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[1].unit.name, 'minute')
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('981 cm/s^2')
      approxEqual(unit1.value, 9.81)
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.units[1].unit.name, 's')
      assert.strictEqual(unit1.units[1].power, -2)
      assert.strictEqual(unit1.units[0].prefix.name, 'c')

      unit1 = Unit.parse('981 cm*s^-2')
      approxEqual(unit1.value, 9.81)
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.units[1].unit.name, 's')
      assert.strictEqual(unit1.units[1].power, -2)
      assert.strictEqual(unit1.units[0].prefix.name, 'c')

      unit1 = Unit.parse('8.314 kg m^2 / s^2 / K / mol')
      approxEqual(unit1.value, 8.314)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[1].unit.name, 'm')
      assert.strictEqual(unit1.units[2].unit.name, 's')
      assert.strictEqual(unit1.units[3].unit.name, 'K')
      assert.strictEqual(unit1.units[4].unit.name, 'mol')
      assert.strictEqual(unit1.units[0].power, 1)
      assert.strictEqual(unit1.units[1].power, 2)
      assert.strictEqual(unit1.units[2].power, -2)
      assert.strictEqual(unit1.units[3].power, -1)
      assert.strictEqual(unit1.units[4].power, -1)
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('5exabytes')
      approxEqual(unit1.value, 4e19)
      assert.strictEqual(unit1.units[0].unit.name, 'bytes')

      unit1 = Unit.parse('1 / s')
      approxEqual(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 's')
      assert.strictEqual(unit1.units[0].power, -1)

      unit1 = Unit.parse('1/s')
      approxEqual(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 's')
      assert.strictEqual(unit1.units[0].power, -1)

      unit1 = Unit.parse('1 * s')
      approxEqual(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 's')
      assert.strictEqual(unit1.units[0].power, 1)
    })

    it('should parse expressions with nested parentheses correctly', function () {
      let unit1 = Unit.parse('8.314 kg (m^2 / (s^2 / (K^-1 / mol)))')
      approxEqual(unit1.value, 8.314)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[1].unit.name, 'm')
      assert.strictEqual(unit1.units[2].unit.name, 's')
      assert.strictEqual(unit1.units[3].unit.name, 'K')
      assert.strictEqual(unit1.units[4].unit.name, 'mol')
      assert.strictEqual(unit1.units[0].power, 1)
      assert.strictEqual(unit1.units[1].power, 2)
      assert.strictEqual(unit1.units[2].power, -2)
      assert.strictEqual(unit1.units[3].power, -1)
      assert.strictEqual(unit1.units[4].power, -1)
      assert.strictEqual(unit1.units[0].prefix.name, 'k')

      unit1 = Unit.parse('1 (m / ( s / ( kg mol ) / ( lbm / h ) K ) )')
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.units[1].unit.name, 's')
      assert.strictEqual(unit1.units[2].unit.name, 'g')
      assert.strictEqual(unit1.units[3].unit.name, 'mol')
      assert.strictEqual(unit1.units[4].unit.name, 'lbm')
      assert.strictEqual(unit1.units[5].unit.name, 'h')
      assert.strictEqual(unit1.units[6].unit.name, 'K')
      assert.strictEqual(unit1.units[0].power, 1)
      assert.strictEqual(unit1.units[1].power, -1)
      assert.strictEqual(unit1.units[2].power, 1)
      assert.strictEqual(unit1.units[3].power, 1)
      assert.strictEqual(unit1.units[4].power, 1)
      assert.strictEqual(unit1.units[5].power, -1)
      assert.strictEqual(unit1.units[6].power, -1)

      const unit2 = Unit.parse('1(m/(s/(kg mol)/(lbm/h)K))')
      assert.deepStrictEqual(unit1, unit2)
    })

    it('should parse units with correct precedence', function () {
      const unit1 = Unit.parse('1  m^3 / kg s^2') // implicit multiplication

      approxEqual(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.units[1].unit.name, 'g')
      assert.strictEqual(unit1.units[2].unit.name, 's')
      assert.strictEqual(unit1.units[0].power, 3)
      assert.strictEqual(unit1.units[1].power, -1)
      assert.strictEqual(unit1.units[2].power, 2)
      assert.strictEqual(unit1.units[0].prefix.name, '')
    })

    it('should throw an exception when parsing an invalid unit', function () {
      assert.throws(function () { Unit.parse('.meter') }, /Unexpected "\."/)
      assert.throws(function () { Unit.parse('5e') }, /Unit "e" not found/)
      assert.throws(function () { Unit.parse('5e.') }, /Unit "e" not found/)
      assert.throws(function () { Unit.parse('5e1.3') }, /Unexpected "\."/)
      assert.throws(function () { Unit.parse('5') }, /contains no units/)
      assert.throws(function () { Unit.parse('') }, /contains no units/)
      assert.throws(function () { Unit.parse('meter.') }, /Unexpected "\."/)
      assert.throws(function () { Unit.parse('meter/') }, /Trailing characters/)
      assert.throws(function () { Unit.parse('/meter') }, /Unexpected "\/"/)
      assert.throws(function () { Unit.parse('1 */ s') }, /Unexpected "\/"/)
      assert.throws(function () { Unit.parse('45 kg 34 m') }, /Unexpected "3"/)
    })

    it('should throw an exception when parsing an invalid type of argument', function () {
      assert.throws(function () { Unit.parse(123) }, /TypeError: Invalid argument in Unit.parse, string expected/)
    })

    it('should parse the value of the unit as Fraction or BigNumber when math.js is configured so', function () {
      const math2 = math.create({ number: 'Fraction' })
      const unit2 = math2.Unit.parse('5kg')
      assert(isFraction(unit2.value))

      const math3 = math.create({ number: 'BigNumber' })
      const unit3 = math3.Unit.parse('5kg')
      assert(isBigNumber(unit3.value))
    })

    it('should parse new units that override old units', function () {
      const math2 = math.create()
      const oldMm = math2.Unit.parse('mm')
      const newMm = math2.createUnit('mm', '2 A')
      assert.notDeepStrictEqual(oldMm, newMm)
      assert.deepStrictEqual(newMm, math2.Unit.parse('mm'))
    })

    it('should support prefixes on specific units', function () {
      assert.deepStrictEqual(Unit.parse('1 nK').toNumeric('K'), 1e-9)
      assert.deepStrictEqual(Unit.parse('1 ndegR').toNumeric('degR'), 1e-9)
      assert.deepStrictEqual(Unit.parse('1 ndegF').toNumeric('degF'), 1e-9)
      assert.deepStrictEqual(Unit.parse('1 ndegC').toNumeric('degC'), 1e-9)
      assert.deepStrictEqual(Unit.parse('1 nanorankine').toNumeric('rankine'), 1e-9)
      assert.deepStrictEqual(Unit.parse('1 nanokelvin').toNumeric('kelvin'), 1e-9)
      assert.deepStrictEqual(Unit.parse('1 nanocelsius').toNumeric('celsius'), 1e-9)
      assert.deepStrictEqual(Unit.parse('1 nanofahrenheit').toNumeric('fahrenheit'), 1e-9)
    })
  })

  describe('prefixes', function () {
    it('should accept both long and short prefixes for ohm', function () {
      assert.strictEqual(Unit.parse('5 ohm').toString(), '5 ohm')
      assert.strictEqual(Unit.parse('5 milliohm').toString(), '5 milliohm')
      assert.strictEqual(Unit.parse('5 mohm').toString(), '5 mohm')
    })

    it('should accept both long and short prefixes for bar', function () {
      assert.strictEqual(Unit.parse('5 bar').toString(), '5 bar')
      assert.strictEqual(Unit.parse('5 millibar').toString(), '5 millibar')
      assert.strictEqual(Unit.parse('5 mbar').toString(), '5 mbar')
    })
  })

  describe('metric prefixes adopted by BIPM in 2022: Q(uetta), R(onna), r(onto), and q(uecto)', function () {
    it('should accept long prefixes', function () {
      assert.strictEqual(new Unit(math.bignumber(1e30), 'meter').format(), '1 quettameter')
      assert.strictEqual(new Unit(math.bignumber(1e27), 'meter').format(), '1 ronnameter')
      assert.strictEqual(new Unit(math.bignumber(1e-27), 'meter').format(), '1 rontometer')
      assert.strictEqual(new Unit(math.bignumber(1e-30), 'meter').format(), '1 quectometer')
    })

    it('should accept short prefixes', function () {
      assert.strictEqual(new Unit(math.bignumber(1e30), 'm').format(), '1 Qm')
      assert.strictEqual(new Unit(math.bignumber(1e27), 'm').format(), '1 Rm')
      assert.strictEqual(new Unit(math.bignumber(1e-27), 'm').format(), '1 rm')
      assert.strictEqual(new Unit(math.bignumber(1e-30), 'm').format(), '1 qm')
    })

    it('should create square meter correctly', function () {
      assert.strictEqual(new Unit(math.bignumber(1e60), 'm2').format(), '1 Qm2')
      assert.strictEqual(new Unit(math.bignumber(1e54), 'm2').format(), '1 Rm2')
      assert.strictEqual(new Unit(math.bignumber(1e-54), 'm2').format(), '1 rm2')
      assert.strictEqual(new Unit(math.bignumber(1e-60), 'm2').format(), '1 qm2')
    })

    it('should create cubic meter correctly', function () {
      assert.strictEqual(new Unit(math.bignumber(1e90), 'm3').format(), '1 Qm3')
      assert.strictEqual(new Unit(math.bignumber(1e81), 'm3').format(), '1 Rm3')
      assert.strictEqual(new Unit(math.bignumber(1e-81), 'm3').format(), '1 rm3')
      assert.strictEqual(new Unit(math.bignumber(1e-90), 'm3').format(), '1 qm3')
    })
  })

  describe('_isDerived', function () {
    it('should return the correct value', function () {
      assert.strictEqual(Unit.parse('34 kg')._isDerived(), false)
      assert.strictEqual(Unit.parse('34 kg/s')._isDerived(), true)
      assert.strictEqual(Unit.parse('34 kg^2')._isDerived(), true)
      assert.strictEqual(Unit.parse('34 N')._isDerived(), false)
      assert.strictEqual(Unit.parse('34 kg m / s^2')._isDerived(), true)
      const unit1 = Unit.parse('34 kg m / s^2')
      assert.strictEqual(unit1._isDerived(), true)
      assert.strictEqual(unit1.simplify()._isDerived(), false)
    })
  })

  describe('multiply, divide, and pow', function () {
    it('should return a Unit that will be automatically simplified', function () {
      const unit1 = new Unit(10, 'kg')
      const unit2 = new Unit(9.81, 'm/s^2')
      assert.strictEqual(unit1.multiply(unit2).skipAutomaticSimplification, false)
      assert.strictEqual(unit1.divide(unit2).skipAutomaticSimplification, false)
      assert.strictEqual(unit1.pow(2).skipAutomaticSimplification, false)
    })

    it('should retain the units of their operands without simplifying', function () {
      const unit1 = new Unit(10, 'N/s')
      const unit2 = new Unit(10, 'h')
      const unitM = unit1.multiply(unit2)
      assert.strictEqual(unitM.units[0].unit.name, 'N')
      assert.strictEqual(unitM.units[1].unit.name, 's')
      assert.strictEqual(unitM.units[2].unit.name, 'h')

      const unit3 = new Unit(14.7, 'lbf')
      const unit4 = new Unit(1, 'in in')
      const unitD = unit3.divide(unit4)
      assert.strictEqual(unitD.units[0].unit.name, 'lbf')
      assert.strictEqual(unitD.units[1].unit.name, 'in')
      assert.strictEqual(unitD.units[2].unit.name, 'in')

      const unit5 = new Unit(1, 'N h/s')
      const unitP = unit5.pow(-3.5)
      assert.strictEqual(unitP.units[0].unit.name, 'N')
      assert.strictEqual(unitP.units[1].unit.name, 'h')
      assert.strictEqual(unitP.units[2].unit.name, 's')
    })

    it('should keep the same numeric type for the units value', function () {
      const unit1 = new Unit(math.bignumber(10), 'N/s')
      const unit2 = new Unit(math.bignumber(10), 'h')
      const unitM = unit1.multiply(unit2)
      assert(math.isBigNumber(unitM.value))

      const unit3 = new Unit(math.bignumber(14.7), 'lbf')
      const unit4 = new Unit(math.bignumber(1), 'in in')
      const unitD = unit3.divide(unit4)
      assert(math.isBigNumber(unitD.value))

      const unit5 = new Unit(math.bignumber(1), 'N h/s')
      const unitP = unit5.pow(math.bignumber(-3.5))
      assert(math.isBigNumber(unitP.value))
    })

    it('should multiply/divide units with offsets correctly', function () {
      const unit1 = new Unit(1, 'm')
      const unit2 = new Unit(1, 'degC')
      const unit3 = new Unit(1, 'm degC')
      unit3.skipAutomaticSimplification = false
      assert.deepStrictEqual(unit1.multiply(unit2), unit3)
      const unit4 = new Unit(1, 'in')
      const unit5 = new Unit(1, 'degF')
      const unit6 = new Unit(1, 'in/degF')
      unit6.skipAutomaticSimplification = false
      assert.deepStrictEqual(unit4.divide(unit5), unit6)
    })

    it('should multiply valueless units by any supported numeric type', function () {
      const valuelessF = new Unit(null, 'fahrenheit')
      assert.strictEqual(valuelessF.multiply(math.bignumber(123)).format(12), '123 fahrenheit')
      assert.strictEqual(valuelessF.multiply(math.fraction(123, 2)).format(12), '123/2 fahrenheit')
      assert.strictEqual(valuelessF.multiply(math.complex(123, 123)).format(12), '(123 + 123i) fahrenheit')
      assert.strictEqual(valuelessF.multiply(123).format(12), '123 fahrenheit')
    })

    it('should divide valueless units by any supported numeric type', function () {
      const valuelessF = new Unit(null, 'fahrenheit')
      assert.strictEqual(valuelessF.divide(math.bignumber(1).div(123)).format(12), '123 fahrenheit')
      assert.strictEqual(valuelessF.divide(math.fraction(2, 123)).format(12), '123/2 fahrenheit')
      assert.strictEqual(valuelessF.divide(math.complex(0.25, 0.25)).format(12), '(2 - 2i) fahrenheit')
      assert.strictEqual(valuelessF.divide(1 / 123).format(12), '123 fahrenheit')
    })

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('should cancel units in numerator and denominator', function () {
      assert.strictEqual(math.evaluate('2 J/K/g * 2 g').toString(), '4 J / K')
      assert.strictEqual(math.evaluate('2 J/K/g * 2K').toString(), '4 J / g')
    })
  })

  describe('plurals', function () {
    it('should support plurals', function () {
      const unit1 = new Unit(5, 'meters')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'meters')
      assert.strictEqual(unit1.units[0].prefix.name, '')

      const unit2 = new Unit(5, 'kilometers')
      assert.strictEqual(unit2.value, 5000)
      assert.strictEqual(unit2.units[0].unit.name, 'meters')
      assert.strictEqual(unit2.units[0].prefix.name, 'kilo')

      const unit3 = new Unit(5, 'inches')
      approxEqual(unit3.value, 0.127)
      assert.strictEqual(unit3.units[0].unit.name, 'inches')
      assert.strictEqual(unit3.units[0].prefix.name, '')

      const unit4 = new Unit(9.81, 'meters/second^2')
      approxEqual(unit4.value, 9.81)
      assert.strictEqual(unit4.units[0].unit.name, 'meters')
      assert.strictEqual(unit4.units[0].prefix.name, '')

      assert.strictEqual(new Unit(10, 'decades').toNumeric('decade'), 10)
      assert.strictEqual(new Unit(10, 'centuries').toNumeric('century'), 10)
      assert.strictEqual(new Unit(10, 'millennia').toNumeric('millennium'), 10)
    })
  })

  describe('aliases', function () {
    it('should support aliases', function () {
      const unit1 = new Unit(5, 'lt')
      assert.strictEqual(unit1.value, 5e-3)
      assert.strictEqual(unit1.units[0].unit.name, 'lt')
      assert.strictEqual(unit1.units[0].prefix.name, '')

      const unit2 = new Unit(1, 'lb')
      assert.strictEqual(unit2.value, 453.59237e-3)
      assert.strictEqual(unit2.units[0].unit.name, 'lb')
      assert.strictEqual(unit2.units[0].prefix.name, '')

      assert.strictEqual(math.evaluate('2 feet * 8 s').toString(), '16 feet s')
      assert.strictEqual(math.evaluate('2 s * 8 feet').toString(), '16 s feet')

      assert.strictEqual(math.evaluate('2 N + 2 kgf').toString(), '21.6133 N')
    })
  })

  describe('UNITS', function () {
    it('should be of the correct value and dimension', function () {
      assert.strictEqual(new Unit(1, 's A').equals(new Unit(1, 'C')), true)
      assert.strictEqual(new Unit(1, 'W/A').equals(new Unit(1, 'V')), true)
      assert.strictEqual(new Unit(1, 'V/A').equals(new Unit(1, 'ohm')), true)
      assert.strictEqual(new Unit(1, 'C/V').equals(new Unit(1, 'F')), true)
      assert.strictEqual(new Unit(1, 'J/A').equals(new Unit(1, 'Wb')), true)
      assert.strictEqual(new Unit(1, 'Wb/m^2').equals(new Unit(1, 'T')), true)
      assert.strictEqual(new Unit(1, 'Wb/A').equals(new Unit(1, 'H')), true)
      assert.strictEqual(new Unit(1, 'ohm^-1').equals(new Unit(1, 'S')), true)
      assert.strictEqual(new Unit(1, 'eV').equals(new Unit(1.602176565e-19, 'J')), true)
      assert.strictEqual(new Unit(1, 'kilogramforce').equals(new Unit(1, 'kgf')), true)
    })

    it("For each built-in unit, 'name' should match key", function () {
      for (const key in Unit.UNITS) {
        if (hasOwnProperty(Unit.UNITS, key)) {
          assert.strictEqual(key, Unit.UNITS[key].name)
        }
      }
    })
  })

  describe('angles', function () {
    it('should create angles', function () {
      assert.strictEqual(new Unit(1, 'radian').equals(new Unit(1, 'rad')), true)
      assert.strictEqual(new Unit(1, 'radians').equals(new Unit(1, 'rad')), true)
      assert.strictEqual(new Unit(1, 'degree').equals(new Unit(1, 'deg')), true)
      assert.strictEqual(new Unit(1, 'degrees').equals(new Unit(1, 'deg')), true)
      assert.strictEqual(new Unit(1, 'gradian').equals(new Unit(1, 'grad')), true)
      assert.strictEqual(new Unit(1, 'gradians').equals(new Unit(1, 'grad')), true)

      assert.strictEqual(new Unit(1, 'radian').to('rad').equals(new Unit(1, 'rad')), true)
      assert.strictEqual(new Unit(1, 'radians').to('rad').equals(new Unit(1, 'rad')), true)
      assert.strictEqual(new Unit(1, 'deg').to('rad').equals(new Unit(2 * Math.PI / 360, 'rad')), true)
      assert.strictEqual(new Unit(1, 'degree').to('rad').equals(new Unit(2 * Math.PI / 360, 'rad')), true)
      assert.strictEqual(new Unit(1, 'degrees').to('rad').equals(new Unit(2 * Math.PI / 360, 'rad')), true)
      assert.strictEqual(new Unit(1, 'gradian').to('rad').equals(new Unit(Math.PI / 200, 'rad')), true)
      assert.strictEqual(new Unit(1, 'gradians').to('rad').equals(new Unit(Math.PI / 200, 'rad')), true)
    })

    it('should have correct long/short prefixes', function () {
      assert.strictEqual(new Unit(20000, 'rad').toString(), '20 krad')
      assert.strictEqual(new Unit(20000, 'radian').toString(), '20 kiloradian')
      assert.strictEqual(new Unit(20000, 'radians').toString(), '20 kiloradians')

      assert.strictEqual(new Unit(20000, 'deg').toString(), '20 kdeg')
      assert.strictEqual(new Unit(20000, 'degree').toString(), '20 kilodegree')
      assert.strictEqual(new Unit(20000, 'degrees').toString(), '20 kilodegrees')

      assert.strictEqual(new Unit(20000, 'grad').toString(), '20 kgrad')
      assert.strictEqual(new Unit(20000, 'gradian').toString(), '20 kilogradian')
      assert.strictEqual(new Unit(20000, 'gradians').toString(), '20 kilogradians')
    })
  })

  describe('createUnitSingle', function () {
    it('should create a custom unit from a string definition', function () {
      Unit.createUnitSingle('widget', '5 kg bytes')
      assert.strictEqual(new Unit(1, 'widget').equals(new Unit(5, 'kg bytes')), true)
      Unit.createUnitSingle('woggle', '4 widget^2')
      assert.strictEqual(new Unit(1, 'woggle').equals(new Unit(4, 'widget^2')), true)
      assert.strictEqual(new Unit(2, 'woggle').equals(new Unit(200, 'kg^2 bytes^2')), true)
    })

    it('should create a custom unit from a Unit definition', function () {
      const Unit1 = new Unit(5, 'N/woggle')
      Unit.createUnitSingle('gadget', Unit1)
      assert.strictEqual(new Unit(1, 'gadget').equals(new Unit(5, 'N/woggle')), true)
    })

    it('should create a custom unit from a configuration object', function () {
      Unit.createUnitSingle('wiggle', { definition: '4 rad^2/s', offset: 1, prefixes: 'long' })
      assert.strictEqual(math.evaluate('8000 rad^2/s').toString(), '2 kilowiggle')
      Unit.createUnitSingle('wriggle', { definition: '4 rad^2/s', offset: 0, prefixes: 'long' })
      assert.strictEqual(math.evaluate('2 wriggle to wiggle').toString(), '1 wiggle')
    })

    it('should return the new (value-less) unit', function () {
      const Unit2 = new Unit(1000, 'N h kg^-2 bytes^-2')
      const newUnit = Unit.createUnitSingle('whimsy', '8 gadget hours')
      assert.strictEqual(Unit2.to(newUnit).toString(), '2500 whimsy')
    })

    it('should not override an existing unit', function () {
      assert.throws(function () { Unit.createUnitSingle('m', '1 kg') }, /Cannot create unit .*: a unit with that name already exists/)
      assert.throws(function () { Unit.createUnitSingle('gadget', '1 kg') }, /Cannot create unit .*: a unit with that name already exists/)
      assert.throws(function () { Unit.createUnitSingle('morogrove', { aliases: 's' }) }, /Cannot create alias .*: a unit with that name already exists/)
    })

    it('should throw an error for invalid parameters', function () {
      assert.throws(function () { Unit.createUnitSingle() }, /createUnitSingle expects first parameter/)
      assert.throws(function () { Unit.createUnitSingle(42) }, /createUnitSingle expects first parameter/)
      assert.throws(function () { Unit.createUnitSingle('42') }, /Error: Invalid unit name/)
      assert.throws(function () { Unit.createUnitSingle('toto', 5) }, /TypeError: Cannot create unit/)
      assert.throws(function () { Unit.createUnitSingle('foo', { definition: '1 vteřiny', prefixes: 'long' }) }, /Error: Could not create unit/)
    })

    it('should apply the correct prefixes', function () {
      Unit.createUnitSingle('millizilch', { definition: '1e-3 m', prefixes: 'long' })
      assert.strictEqual(new Unit(1e-6, 'millizilch').toString(), '1 micromillizilch')
    })

    it('should override prefixed built-in units', function () {
      Unit.createUnitSingle('mm', { definition: '1e-4 m', prefixes: 'short' }) // User is being silly
      assert.strictEqual(new Unit(1e-3, 'mm').toString(), '1 mmm') // Use the user's new definition
      assert.strictEqual(new Unit(1e-3, 'mm').to('m').format(4), '1e-7 m') // Use the user's new definition
    })

    it('should create aliases', function () {
      Unit.createUnitSingle('knot', { definition: '0.51444444 m/s', aliases: ['knots', 'kts', 'kt'] })
      assert.strictEqual(new Unit(1, 'knot').equals(new Unit(1, 'kts')), true)
      assert.strictEqual(new Unit(1, 'kt').equals(new Unit(1, 'knots')), true)
    })

    it('should apply offset correctly', function () {
      Unit.createUnitSingle('whatsit', { definition: '3.14 kN', offset: 2 })
      assert.strictEqual(new Unit(1, 'whatsit').to('kN').toString(), '9.42 kN')
    })

    it('should create new base units', function () {
      const fooBaseUnit = Unit.createUnitSingle('fooBase')
      assert.strictEqual(fooBaseUnit.dimensions.toString(), Unit.BASE_UNITS.fooBase_STUFF.dimensions.toString())
      const testUnit = new Unit(5, 'fooBase')
      assert.strictEqual(testUnit.toString(), '5 fooBase')
    })

    it('should not override base units', function () {
      assert.throws(function () { Unit.createUnitSingle('fooBase', '', { override: true }) }, /Cannot create/)
    })

    it('should create and use a new base if no matching base exists', function () {
      Unit.createUnitSingle('jabberwocky', '1 mile^5/hour')
      assert.strictEqual('jabberwocky_STUFF' in Unit.BASE_UNITS, true)
      assert.strictEqual(math.evaluate('4 mile^5/minute').format(4), '240 jabberwocky')
    })

    it('should use baseName', function () {
      Unit.createUnitSingle('truck', { baseName: 'VEHICLE' })
      Unit.createUnitSingle('speedy', { definition: '1 truck/day', baseName: 'VEHICLE_PRODUCTION_RATE' })
      assert('VEHICLE' in Unit.BASE_UNITS)
      assert('VEHICLE_PRODUCTION_RATE' in Unit.BASE_UNITS)
      assert(new Unit(1, 'truck').hasBase('VEHICLE'))
      assert(new Unit(1, 'truck/day').hasBase('VEHICLE_PRODUCTION_RATE'))
      assert.strictEqual(math.evaluate('10 truck/hr').format(4), '240 speedy')
    })
  })

  describe('createUnit', function () {
    it('should create multiple units', function () {
      Unit.createUnit({
        foo1: '',
        foo2: '2 foo1',
        foo3: {
          definition: '2 foo2',
          prefixes: 'long'
        }
      })
      assert.strictEqual(math.evaluate('2 foo3 to foo1').toString(), '8 foo1')
    })

    it('should override units when requested and if able', function () {
      assert.throws(function () { Unit.createUnit({ foo1: '' }) }, /Cannot/)
      assert.throws(function () { Unit.createUnit({ foo1: '', override: true }) }, /Cannot/)
      Unit.createUnit({ foo3: '' }, { override: true })
    })

    it('should throw error when first parameter is not an object', function () {
      assert.throws(function () { Unit.createUnit('not an object') }, /createUnit expects first/)
    })
  })

  describe('deleteUnit', function () {
    it('should delete a unit', function () {
      const math2 = math.create()

      assert.strictEqual(math2.evaluate('5 b').toString(), '5 b')
      assert.strictEqual(math2.evaluate('5 bytes').toString(), '5 bytes')
      assert.strictEqual(math2.evaluate('5 byte').toString(), '5 byte') // alias of "bytes"

      math2.Unit.deleteUnit('b')
      math2.Unit.deleteUnit('bytes')
      math2.Unit.deleteUnit('byte')

      assert.throws(() => math2.evaluate('5 b').toString(), 'foo')
      assert.throws(() => math2.evaluate('5 bytes').toString(), 'foo')
      assert.throws(() => math2.evaluate('5 byte').toString(), 'foo')

      // should not have changed the original math
      assert.strictEqual(math.evaluate('5 b').toString(), '5 b')
      assert.strictEqual(math.evaluate('5 bytes').toString(), '5 bytes')
      assert.strictEqual(math.evaluate('5 byte').toString(), '5 byte')
    })
  })

  describe('splitUnit', function () {
    it('should split a unit into parts', function () {
      assert.strictEqual((new Unit(1, 'm')).splitUnit(['ft', 'in']).toString(), '3 ft,3.3700787401574765 in')
      assert.strictEqual((new Unit(-1, 'm')).splitUnit(['ft', 'in']).toString(), '-3 ft,-3.3700787401574765 in')
      assert.strictEqual((new Unit(1, 'm/s')).splitUnit(['m/s']).toString(), '1 m / s')
      assert.strictEqual((new Unit(1, 'm')).splitUnit(['ft', 'ft']).toString(), '3 ft,0.280839895013123 ft')
      assert.strictEqual((new Unit(1.23, 'm/s')).splitUnit([]).toString(), '1.23 m / s')
      assert.strictEqual((new Unit(1, 'm')).splitUnit(['in', 'ft']).toString(), '39 in,0.030839895013123605 ft')
      assert.strictEqual((new Unit(1, 'm')).splitUnit([new Unit(null, 'ft'), new Unit(null, 'in')]).toString(), '3 ft,3.3700787401574765 in')
    })

    it('should be resistant to round-off error', function () {
      assert.strictEqual((new Unit(-12, 'in')).splitUnit(['ft', 'in']).toString(), '-1 ft,0 in')
      assert.strictEqual((new Unit(12, 'in')).splitUnit(['ft', 'in']).toString(), '1 ft,0 in')
      assert.strictEqual((new Unit(24, 'in')).splitUnit(['ft', 'in']).toString(), '2 ft,0 in')
      assert.strictEqual((new Unit(36, 'in')).splitUnit(['ft', 'in']).toString(), '3 ft,0 in')
      assert.strictEqual((new Unit(48, 'in')).splitUnit(['ft', 'in']).toString(), '4 ft,0 in')
      assert.strictEqual((new Unit(60, 'in')).splitUnit(['ft', 'in']).toString(), '5 ft,0 in')
      assert.strictEqual((new Unit(36000, 'in')).splitUnit(['ft', 'in']).toString(), '3000 ft,0 in')
    })
  })

  describe('toSI', function () {
    it('should return a clone of the unit', function () {
      const u1 = Unit.parse('3 ft')
      const u2 = u1.toSI()
      assert.strictEqual(u1 === u2, false)
    })

    it('should return the unit in SI units', function () {
      assert.strictEqual(Unit.parse('3 ft').toSI().format(10), '0.9144 m')
      assert.strictEqual(Unit.parse('0.111 ft^2').toSI().format(10), '0.01031223744 m^2')
      assert.strictEqual(Unit.parse('1 kgf').toSI().toString(), '9.80665 (kg m) / s^2')
      assert.strictEqual(Unit.parse('300 degC').toSI().toString(), '573.15 K')
    })

    it('should return SI units for valueless units', function () {
      assert.strictEqual(Unit.parse('ft/minute').toSI().toString(), 'm / s')
    })

    it('should return SI units for custom units defined from other units', function () {
      Unit.createUnit({ foo: '3 kW' }, { override: true })
      assert.strictEqual(Unit.parse('42 foo').toSI().toString(), '1.26e+5 (kg m^2) / s^3')
    })

    it('should throw if custom unit not defined from existing units', function () {
      Unit.createUnit({ baz: '' }, { override: true })
      assert.throws(function () { Unit.parse('10 baz').toSI() }, /Cannot express custom unit/)
    })
  })

  describe('isValidAlpha', function () {
    it('per default refuse to parse non-latin unit names', function () {
      assert.throws(function () { Unit.createUnit({ чекушки: '0.25 L' }) }, /Error: Invalid unit name/)
    })

    it('should support cyrillic when Unit.isValidAlpha is overridden', function () {
      const isValidCyrillic = function (c) {
        const charCode = c.charCodeAt(0)
        return charCode > 1039 && charCode < 1103
      }
      const isAlphaOriginal = math.Unit.isValidAlpha
      Unit.isValidAlpha = function (c) {
        return isAlphaOriginal(c) || isValidCyrillic(c)
      }

      Unit.createUnit({ чекушки: '0.25 L' })

      assert.strictEqual(Unit.parse('2 чекушки').toSI().toString(), '5e-4 m^3')
    })

    it('should support wide range of european alphabets when Unit.isValidAlpha is overridden', function () {
      const isAlphaOriginal = math.Unit.isValidAlpha
      Unit.isValidAlpha = function (c) {
        return isAlphaOriginal(c) || ((c).toUpperCase() !== (c).toLowerCase())
      }

      Unit.createUnit({ vteřiny: '1 s' })

      assert.strictEqual(Unit.parse('21 vteřiny').toSI().toString(), '21 s')
    })
  })
})
