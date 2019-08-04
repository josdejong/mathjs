import assert from 'assert'
import approx from '../../../../tools/approx'
import math from '../../../../src/bundleAny'
import { isBigNumber, isFraction } from '../../../../src/utils/is'

const unit = math.unit

describe('Unit', function () {
  describe('constructor', function () {
    it('should create unit correctly', function () {
      let unit1 = unit(5000, 'cm')
      assert.strictEqual(unit1.toSI().value, 50)
      assert.strictEqual(unit1.units[0].unit.name, 'm')

      unit1 = unit(5, 'kg')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')

      unit1 = unit('kg')
      assert.strictEqual(unit1.value, null)
      assert.strictEqual(unit1.units[0].unit.name, 'g')

      unit1 = unit(10, 'Hz')
      assert.strictEqual(unit1.value, 10)
      assert.strictEqual(unit1.units[0].unit.name, 'Hz')

      unit1 = unit(9.81, 'kg m/s^2')
      assert.strictEqual(unit1.value, 9.81)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[1].unit.name, 'm')
      assert.strictEqual(unit1.units[2].unit.name, 's')
    })

    it('should create a unit with Fraction value', function () {
      const unit1 = unit(math.fraction(1000, 3), 'cm')
      assert.deepStrictEqual(unit1.value, math.fraction(1000, 3))
      assert.strictEqual(unit1.units[0].unit.name, 'm')
    })

    it('should create a unit with BigNumber value', function () {
      const unit1 = unit(math.bignumber(5000), 'cm')
      assert.deepStrictEqual(unit1.value, math.bignumber(5000))
      assert.strictEqual(unit1.units[0].unit.name, 'm')
    })

    it('should create a unit with Complex value', function () {
      const unit1 = unit(math.complex(500, 600), 'cm')
      assert.deepStrictEqual(unit1.value, math.complex(500, 600))
      assert.strictEqual(unit1.units[0].unit.name, 'm')
    })

    it('should create square meter correctly', function () {
      const unit1 = unit(0.000001, 'km2')
      assert.strictEqual(unit1.to('m2').value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 'm2')
    })

    it('should create cubic meter correctly', function () {
      const unit1 = unit(0.000000001, 'km3')
      assert.strictEqual(unit1.to('m3').value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 'm3')
    })

    it('should ignore properties on Object.prototype', function () {
      Object.prototype.foo = unit._unitStore.defs.units['meter'] // eslint-disable-line no-extend-native

      assert.throws(function () { console.log(unit(1, 'foo')) }, /Unit "foo" not found/)

      delete Object.prototype.foo
    })

    it('should throw an error if called without new keyword', function () {
      assert.throws(function () {
        unit(2, 'inch')
      })
    })

    it('should throw an error if called with wrong type of arguments', function () {
      // assert.throws(function () { console.log(unit('24', 'inch')) })
      assert.throws(function () { console.log(unit(0, 'bla')) })
      // assert.throws(function () { console.log(unit(4, '')) })
      assert.throws(function () { console.log(unit(0, 3)) })
    })

    // This is not true in UnitMath any more, there's no distinction made based on where the unit was created
    it.skip('should skip automatic simplification if created directly in the constructor', function () {
      const unit1 = unit(9.81, 'kg m/s^2')
      assert.strictEqual(unit1.skipAutomaticSimplification, true)
      assert.strictEqual(unit1.toString(), '9.81 (kg m) / s^2')

      const unit2 = unit('kg m/s^2')
      assert.strictEqual(unit2.skipAutomaticSimplification, true)
      assert.strictEqual(unit2.toString(), '(kg m) / s^2')
    })
  })

  describe('isValuelessUnit', function () {
    it('should return true if the string is a plain unit', function () {
      assert.strictEqual(unit.exists('cm'), true)
      assert.strictEqual(unit.exists('inch'), true)
      assert.strictEqual(unit.exists('kb'), true)
    })

    it('should return false if the unit is not a plain unit', function () {
      assert.strictEqual(unit.exists('bla'), false)
      assert.strictEqual(unit.exists('5cm'), false)
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

  describe('hasQuantity', function () {
    it('should test whether a unit has a certain quantity', function () {
      assert.strictEqual(unit(5, 'cm').hasQuantity('ANGLE'), false)
      assert.strictEqual(unit(5, 'cm').hasQuantity('LENGTH'), true)
      assert.strictEqual(unit(5, 'kg m / s ^ 2').hasQuantity('FORCE'), true)
    })
  })

  describe('equalQuantity', function () {
    it('should test whether two units have the same base unit', function () {
      assert.strictEqual(unit(5, 'cm').equalQuantity(unit(10, 'm')), true)
      assert.strictEqual(unit(5, 'cm').equalQuantity(unit(10, 'kg')), false)
      assert.strictEqual(unit(5, 'N').equalQuantity(unit(10, 'kg m / s ^ 2')), true)
      assert.strictEqual(unit(8.314, 'J / mol K').equalQuantity(unit(0.02366, 'ft^3 psi / mol degF')), true)
    })
  })

  describe('equals', function () {
    it('should test whether two units are equal', function () {
      assert.strictEqual(unit(100, 'cm').equals(unit(1, 'm')), true)
      assert.strictEqual(unit(100, 'cm').equals(unit(2, 'm')), false)
      assert.strictEqual(unit(100, 'cm').equals(unit(1, 'kg')), false)
      assert.strictEqual(unit(100, 'ft lbf').equals(unit(1200, 'in lbf')), true)
      assert.strictEqual(unit(100, 'N').equals(unit(100, 'kg m / s ^ 2')), true)
      assert.strictEqual(unit(100, 'N').equals(unit(100, 'kg m / s')), false)
      assert.strictEqual(unit(100, 'Hz').equals(unit(100, 's ^ -1')), true)
    })

    it('should test whether two units with Fractions are equal', function () {
      assert.strictEqual(unit(math.fraction(100), 'cm').equals(unit(math.fraction(1), 'm')), true)
      assert.strictEqual(unit(math.fraction(100), 'cm').equals(unit(math.fraction(2), 'm')), false)
    })

    it('should test whether two units with a Fraction and a number are equal', function () {
      assert.strictEqual(unit(math.fraction(100), 'cm').equals(unit(1, 'm')), true)
      assert.strictEqual(unit(100, 'cm').equals(unit(math.fraction(2), 'm')), false)
    })

    it('should test whether two Complex units are equal', function () {
      assert.strictEqual(unit(math.complex(3, 4), 'km').equals(unit(math.complex(3000, 4000), 'm')), true)
      assert.strictEqual(unit(math.complex(3, 4), 'km').equals(unit(math.complex(3000, 10), 'm')), false)
    })

    it('should test whether a Complex unit and a unit with a number are equal', function () {
      assert.strictEqual(new math.Unit(math.complex(3, 0), 'km').equals(new math.Unit(3000, 'm')), true)
      assert.strictEqual(new math.Unit(math.complex(3, 4), 'km').equals(new math.Unit(3000, 'm')), false)
    })
  })

  describe('clone', function () {
    it('should clone a unit', function () {
      const u1 = unit(100, 'cm')
      const u2 = u1.clone()
      assert(u1 !== u2)
      assert.deepStrictEqual(u1, u2)

      const u3 = unit(100, 'cm').to('inch')
      const u4 = u3.clone()
      assert(u3 !== u4)
      assert.deepStrictEqual(u3, u4)

      const u5 = unit('cm').to('inch')
      const u6 = u5.clone()
      assert(u5 !== u6)
      assert.deepStrictEqual(u5, u6)

      const u7 = unit(8.314, 'kg m^2 / s^2 K mol')
      const u8 = u7.clone()
      assert(u7 !== u8)
      assert.deepStrictEqual(u7, u8)
    })

    it('should clone a with a Fraction', function () {
      const u1 = unit(math.fraction(1, 3), 'cm')
      const u2 = u1.clone()
      assert(u1 !== u2)
      assert.deepStrictEqual(u1, u2)
      assert(u1.value !== u2.value) // should be cloned
    })

    it('should clone a Complex unit', function () {
      const u1 = unit(math.complex(1, 3), 'cm')
      const u2 = u1.clone()
      assert(u1 !== u2)
      assert.deepStrictEqual(u1, u2)
      assert(u1.value !== u2.value) // should be cloned
    })
  })

  describe('value', function () {
    it('should return the unit\'s numeric value', function () {
      const u = unit(math.fraction(1, 3), 'cm')
      assert.deepStrictEqual(u.to('mm').value, math.fraction(10, 3))
    })
 
    it('should convert a unit to a number', function () {
      const u = unit(5000, 'cm')
      approx.equal(u.to('mm').value, 50000)
  
      approx.equal(unit(5.08, 'cm').to('inch').value, 2)
  
      approx.equal(unit(101325, 'N/m^2').to('lbf/in^2').value, 14.6959487763741)
    })
  
    it('should convert a unit with fixed prefix to a number', function () {
      const u1 = unit(5000, 'cm')
      const u2 = u1.to('km')
      approx.equal(u2.to('mm').value, 50000)
  
      const u3 = unit(981, 'cm/s^2')
      const u4 = u3.to('km/ms^2')
      approx.equal(u4.to('m/s^2').value, 9.81)
    })
  
    it('should convert a unit with fraction to a number', function () {
      const u = unit(math.fraction(5), 'cm')
      assert.strictEqual(u.to('mm').value, 50)
    })

    it('should return the value of a unit without needing the \'to\' method', function () {
      const u = unit('45 deg')
      assert.strictEqual(u.value, 45)
    })
  })

  describe('to', function () {
    it('should convert a unit to a fixed unitName', function () {
      const u1 = unit(5000, 'cm')
      assert.strictEqual(u1.value, 5000)
      assert.strictEqual(u1.units[0].unit.name, 'm')
      assert.strictEqual(u1.units[0].prefix, 'c')
      assert(!u1.fixed)

      const u2 = u1.to('inch')
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      approx.equal(u2.value, 1968.5039370078741)
      assert.strictEqual(u2.units[0].unit.name, 'inch')
      assert.strictEqual(u2.units[0].prefix, '')
      assert(u2.fixed)

      const u3 = unit(299792.458, 'km/s')
      assert.strictEqual(u3.value, 299792.458)
      assert.strictEqual(u3.units[0].unit.name, 'm')
      assert.strictEqual(u3.units[1].unit.name, 's')
      assert.strictEqual(u3.units[0].prefix, 'k')
      assert(!u3.fixed)

      const u4 = u3.to('mi/h')
      assert.notStrictEqual(u3, u4) // u4 must be a clone
      assert.strictEqual(u4.value, 670616629.3843951)
      assert.strictEqual(u4.units[0].unit.name, 'mi')
      assert.strictEqual(u4.units[1].unit.name, 'h')
      assert.strictEqual(u4.units[0].prefix, '')
      assert(u4.fixed)
    })

    it('should convert a unit with a fraction', function () {
      const u1 = unit(math.fraction(1, 3), 'm')

      const u2 = u1.to('cm')
      assert.deepStrictEqual(u2.value, math.fraction(100, 3))
      assert(math.isFraction(u2.value))
      assert.strictEqual(u2.units[0].unit.name, 'm')
      assert.strictEqual(u2.units[0].prefix, 'c')
      assert(u2.fixed)
    })

    it('should convert a Complex unit', function () {
      const u1 = unit(math.complex(300, 400), 'kPa')
      const u2 = u1.to('lbf/in^2')
      approx.deepEqual(u2.value, math.complex(43.511321319062766, 58.01509509208368))
      assert.deepStrictEqual(u2.toString(), '(43.511321319062766 + 58.01509509208368i) lbf / in^2')
    })

    it('should convert a unit to a fixed unit', function () {
      const u1 = unit(5000, 'cm')
      assert.strictEqual(u1.value, 5000)
      assert.strictEqual(u1.units[0].unit.name, 'm')
      assert.strictEqual(u1.units[0].prefix, 'c')
      assert(!u1.fixed)

      const u2 = u1.to(unit('km'))
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 0.05)
      assert.strictEqual(u2.units[0].unit.name, 'm')
      assert.strictEqual(u2.units[0].prefix, 'k')
      assert(u2.fixed)

      const u3 = unit(5000, 'cm/s')
      assert.strictEqual(u3.value, 5000)
      assert.strictEqual(u3.units[0].unit.name, 'm')
      assert.strictEqual(u3.units[1].unit.name, 's')
      assert.strictEqual(u3.units[0].prefix, 'c')
      assert(!u3.fixed)

      const u4 = u3.to(unit('km/h'))
      assert.notStrictEqual(u3, u4) // u4 must be a clone
      assert.strictEqual(u4.value, 180)
      assert.strictEqual(u4.units[0].unit.name, 'm')
      assert.strictEqual(u4.units[1].unit.name, 'h')
      assert.strictEqual(u4.units[0].prefix, 'k')
      assert(u4.fixed)
    })

    it('should convert a valueless unit', function () {
      const u1 = unit('m')
      assert.strictEqual(u1.value, null)
      assert.strictEqual(u1.units[0].unit.name, 'm')
      assert.strictEqual(u1.units[0].prefix, '')
      assert(!u1.fixed)

      const u2 = u1.to(unit('cm'))
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 100) // u2 must have a value
      assert.strictEqual(u2.units[0].unit.name, 'm')
      assert.strictEqual(u2.units[0].prefix, 'c')
      assert(u2.fixed)

      const u3 = unit('m/s')
      assert.strictEqual(u3.value, null)
      assert.strictEqual(u3.units[0].unit.name, 'm')
      assert.strictEqual(u3.units[1].unit.name, 's')
      assert.strictEqual(u3.units[0].prefix, '')
      assert(!u3.fixed)

      const u4 = u3.to(unit('cm/s'))
      assert.notStrictEqual(u3, u4) // u4 must be a clone
      assert.strictEqual(u4.value, 100) // u4 must have a value
      assert.strictEqual(u4.units[0].unit.name, 'm')
      assert.strictEqual(u4.units[1].unit.name, 's')
      assert.strictEqual(u4.units[0].prefix, 'c')
      assert(u4.fixed)
    })

    it('should convert a binary prefixes (1)', function () {
      const u1 = unit(1, 'Kib')
      assert.strictEqual(u1.to('b').value, 1024)
      assert.strictEqual(u1.units[0].unit.name, 'b')
      assert.strictEqual(u1.units[0].prefix, 'Ki')
      assert(!u1.fixed)

      const u2 = u1.to(unit('b'))
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 1024) // u2 must have a value
      assert.strictEqual(u2.units[0].unit.name, 'b')
      assert.strictEqual(u2.units[0].prefix, '')
      assert(u2.fixed)

      const u3 = unit(1, 'Kib/s')
      assert.strictEqual(u3.to('b/s').value, 1024)
      assert.strictEqual(u3.units[0].unit.name, 'b')
      assert.strictEqual(u3.units[1].unit.name, 's')
      assert.strictEqual(u3.units[0].prefix, 'Ki')
      assert(!u3.fixed)

      const u4 = u3.to(unit('b/s'))
      assert.notStrictEqual(u3, u4) // u4 must be a clone
      assert.strictEqual(u4.value, 1024) // u4 must have a value
      assert.strictEqual(u4.units[0].unit.name, 'b')
      assert.strictEqual(u4.units[1].unit.name, 's')
      assert.strictEqual(u4.units[0].prefix, '')
      assert(u4.fixed)
    })

    it('should convert a binary prefixes (2)', function () {
      const u1 = unit(1, 'kb')
      assert.strictEqual(u1.to('b').value, 1000)
      assert.strictEqual(u1.units[0].unit.name, 'b')
      assert.strictEqual(u1.units[0].prefix, 'k')
      assert(!u1.fixed)

      const u2 = u1.to(unit('b'))
      assert.notStrictEqual(u1, u2) // u2 must be a clone
      assert.strictEqual(u2.value, 1000) // u2 must have a value
      assert.strictEqual(u2.units[0].unit.name, 'b')
      assert.strictEqual(u2.units[0].prefix, '')
      assert(u2.fixed)
    })

    it('should fix the unit if result of to or toSI', function () {
      const u1 = unit(1, 'ft lbf').mul(unit(2, 'rad'))
      assert(!u1.fixed)
      const u2 = u1.to('in lbf rad')
      assert(u2.fixed)
      assert.strictEqual(u2.toString(), '24 in lbf rad')
      const u3 = u1.toSI()
      assert(u3.fixed)
      assert.strictEqual(u3.format(5), '2.7116 (kg m^2 rad) / s^2')
    })

    it('should throw an error when converting to an incompatible unit', function () {
      const u1 = unit(5000, 'cm')
      assert.throws(function () { u1.to('kg') }, /dimensions do not match/)
      const u2 = unit(5000, 'N s')
      assert.throws(function () { u2.to('kg^5 / s') }, /dimensions do not match/)
    })

    it('should throw an error when converting to a unit having a value', function () {
      const u1 = unit(5000, 'cm')
      assert.throws(function () { u1.to(unit(4, 'm')) }, /target unit must be valueless/)
    })

    it('should throw an error when converting to an unsupported type of argument', function () {
      const u1 = unit(5000, 'cm')
      assert.throws(function () { u1.to(new Date()) }, /Parameter must be a Unit or a string./)
    })
  })

  describe('toString', function () {
    it('should convert to string properly', function () {
      assert.strictEqual(unit(5000, 'cm').toString(), '50 m')
      assert.strictEqual(unit(5, 'kg').toString(), '5 kg')
      assert.strictEqual(unit(2 / 3, 'm').toString(), '0.6666666666666666 m')
      assert.strictEqual(unit(5, 'N').toString(), '5 N')
      assert.strictEqual(unit(5, 'kg^1.0e0 m^1.0e0 s^-2.0e0').toString(), '5 N')
      assert.strictEqual(unit(5, 's^-2').toString(), '5 s^-2')
      assert.strictEqual(unit(5, 'm / s ^ 2').toString(), '5 m / s^2')
      assert.strictEqual(unit('kg m^2 / s^2 mol').toString(), '(kg m^2) / (s^2 mol)')
      assert.strictEqual(unit(10, 'hertz').toString(), '10 hertz')
    })

    it('should render with the best prefix', function () {
      assert.strictEqual(unit(0.000001, 'm').format(8), '1 um')
      assert.strictEqual(unit(0.00001, 'm').format(8), '10 um')
      assert.strictEqual(unit(0.00009, 'm').format(8), '90 um')
      assert.strictEqual(unit(0.0001, 'm').format(8), '0.1 mm')
      assert.strictEqual(unit(0.0005, 'm').format(8), '0.5 mm')
      assert.strictEqual(unit(0.0006, 'm').toString(), '0.6 mm')
      assert.strictEqual(unit(0.001, 'm').toString(), '0.1 cm')
      assert.strictEqual(unit(0.01, 'm').toString(), '1 cm')
      assert.strictEqual(unit(100000, 'm').toString(), '100 km')
      assert.strictEqual(unit(300000, 'm').toString(), '300 km')
      assert.strictEqual(unit(500000, 'm').toString(), '500 km')
      assert.strictEqual(unit(600000, 'm').toString(), '600 km')
      assert.strictEqual(unit(1000000, 'm').toString(), '1000 km')
      assert.strictEqual(unit(2000, 'ohm').toString(), '2 kohm')
    })

    it('should keep the original prefix when in range', function () {
      assert.strictEqual(unit(0.0999, 'm').toString(), '9.99 cm')
      assert.strictEqual(unit(0.1, 'm').toString(), '0.1 m')
      assert.strictEqual(unit(0.5, 'm').toString(), '0.5 m')
      assert.strictEqual(unit(0.6, 'm').toString(), '0.6 m')
      assert.strictEqual(unit(1, 'm').toString(), '1 m')
      assert.strictEqual(unit(10, 'm').toString(), '10 m')
      assert.strictEqual(unit(100, 'm').toString(), '100 m')
      assert.strictEqual(unit(300, 'm').toString(), '300 m')
      assert.strictEqual(unit(500, 'm').toString(), '500 m')
      assert.strictEqual(unit(600, 'm').toString(), '600 m')
      assert.strictEqual(unit(1000, 'm').toString(), '1000 m')
      assert.strictEqual(unit(1001, 'm').toString(), '1.001 km')
    })

    it('should render best prefix for a single unit raised to integral power', function () {
      assert.strictEqual(unit(3.2e7, 'm^2').toString(), '32 km^2')
      assert.strictEqual(unit(3.2e-7, 'm^2').toString(), '0.32 mm^2')
      assert.strictEqual(unit(15000, 'm^-1').toString(), '150 cm^-1')
      assert.strictEqual(unit(3e-9, 'm^-2').toString(), '0.003 km^-2')
      assert.strictEqual(unit(3e-9, 'm^-1.5').toString(), '3e-9 m^-1.5')
      assert.strictEqual(unit(2, 'kg^0').toString(), '2')
    })

    it('should not render best prefix if "fixed" is set', function () {
      let u = unit(5e-3, 'm')
      assert.strictEqual(u.toString(), '0.5 cm')
      u = u.to()
      assert.strictEqual(u.toString(), '0.005 m')
    })

    it('should convert a unit with Fraction to string properly', function () {
      assert.strictEqual(unit(math.fraction(9 / 10), 'mm').toString(), '9/10 mm')
    })

    it('should convert a Complex unit to string properly', function () {
      assert.strictEqual(unit(math.complex(-1, -2), 'J / mol K').toString(), '(-1 - 2i) J / (mol K)')
    })
  })

  describe('simplify', function () {
    // This is no longer true--units behave the same no matter how they are created
    // it('should not simplify units created with unit()', function () {
    //   const unit1 = unit(10, 'kg m/s^2')
    //   assert.strictEqual(unit1.units[0].unit.name, 'g')
    //   assert.strictEqual(unit1.units[1].unit.name, 'm')
    //   assert.strictEqual(unit1.units[2].unit.name, 's')
    //   assert.strictEqual(unit1.toString(), '10 (kg m) / s^2')
    // })

    it('should only simplify units with values', function () {
      let unit1 = unit('kg m mol / s^2 mol').pow(1)
      assert.strictEqual(unit1.toString(), '(kg m) / s^2')
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

      const c = math2.unit('8.314 J / mol K')
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
      const unit1 = unit(10, 'N')
      unit.setUnitSystem('us')
      assert.strictEqual(unit1.simplify().toString(), '2.248089430997105 lbf')
      assert.strictEqual(unit1.simplify().units[0].unit.name, 'lbf')

      unitsetUnitSystem('cgs')
      assert.strictEqual(unit1.simplify().format(2), '1 Mdyn')
      assert.strictEqual(unit1.simplify().units[0].unit.name, 'dyn')
    })

    it('should correctly simplify units when unit system is "auto"', function () {
      unitsetUnitSystem('auto')
      const unit1 = unit(5, 'lbf min / s')
      assert.strictEqual(unit1.simplify().toString(), '300 lbf')
    })

    it('should simplify user-defined units when unit system is "auto"', function () {
      unit.setUnitSystem('auto')
      unit.createUnit({ 'USD': '' })
      unit.createUnit({ 'EUR': '1.15 USD' })
      assert.strictEqual(math.evaluate('10 EUR/hour * 2 hours').toString(), '20 EUR')
    })
  })

  describe('valueOf', function () {
    it('should return string representation, with no simplifying or extra formatting options, when calling valueOf', function () {
      assert.strictEqual(unit(5000, 'cm').valueOf(), '5000 cm')
      assert.strictEqual(unit(5, 'kg').valueOf(), '5 kg')
      assert.strictEqual(unit(2 / 3, 'm').valueOf(), '0.6666666666666666 m')
      assert.strictEqual(unit(5, 'N').valueOf(), '5 N')
      assert.strictEqual(unit(5, 'kg^1.0e0 m^1.0e0 s^-2.0e0').valueOf(), '5 kg m / s^2')
      assert.strictEqual(unit(5, 's^-2').valueOf(), '5 s^-2')
    })
  })

  describe('json', function () {
    it('toJSON', function () {
      assert.deepStrictEqual(unit(5, 'cm').toJSON(),
        { 'mathjs': 'Unit', value: 5, unit: 'cm', fixPrefix: false })
      assert.deepStrictEqual(unit(5, 'cm').to('mm').toJSON(),
        { 'mathjs': 'Unit', value: 50, unit: 'mm', fixPrefix: true })
      assert.deepStrictEqual(unit(5, 'kN').to('kg m s ^ -2').toJSON(),
        { 'mathjs': 'Unit', value: 5000, unit: '(kg m) / s^2', fixPrefix: true })
      assert.deepStrictEqual(unit(math.fraction(0.375), 'cm').toJSON(),
        {
          mathjs: 'Unit',
          value: math.fraction(0.375), // Note that value is not serialized at this point, that will be done by JSON.stringify
          unit: 'cm',
          fixPrefix: false
        })
      approx.deepEqual(unit(math.complex(2, 4), 'g').toJSON(),
        {
          mathjs: 'Unit',
          value: math.complex(2, 4),
          unit: 'g',
          fixPrefix: false
        })

      const str = JSON.stringify(unit(math.fraction(0.375), 'cm'))
      assert.deepStrictEqual(str, '{"mathjs":"Unit","value":{"mathjs":"Fraction","n":3,"d":8},"unit":"cm","fixPrefix":false}')

      const cmpx = JSON.stringify(unit(math.complex(2, 4), 'g'))
      assert.strictEqual(cmpx, '{"mathjs":"Unit","value":{"mathjs":"Complex","re":2,"im":4},"unit":"g","fixPrefix":false}')
    })

    it('fromJSON', function () {
      const u1 = unit(5, 'cm')
      const u2 = unit.fromJSON({ 'mathjs': 'Unit', value: 5, unit: 'cm', fixPrefix: false })
      assert.ok(u2 instanceof unit)
      assert.deepStrictEqual(u2, u1)

      const u3 = unit(5, 'cm').to('mm')
      const u4 = unit.fromJSON({ 'mathjs': 'Unit', value: 50, unit: 'mm', fixPrefix: true })
      assert.ok(u4 instanceof unit)
      assert.deepStrictEqual(u4, u3)

      const u5 = unit(5, 'kN').to('kg m/s^2')
      const u6 = unit.fromJSON({ 'mathjs': 'Unit', value: 5000, unit: 'kg m s^-2', fixPrefix: true })
      assert.ok(u6 instanceof unit)
      assert.deepStrictEqual(u5, u6)

      const u7 = unit.fromJSON({
        mathjs: 'Unit',
        value: math.fraction(0.375), // Note that value is already a Fraction at this point, that will be done by JSON.parse(str, reviver)
        unit: 'cm',
        fixPrefix: false
      })
      assert.deepStrictEqual(u7, unit(math.fraction(0.375), 'cm'))

      const u8 = unit.fromJSON({
        mathjs: 'Unit',
        value: math.complex(2, 4),
        unit: 'g',
        fixPrefix: false
      })
      assert.deepStrictEqual(u8, unit(math.complex(2, 4), 'g'))
    })

    it('toJSON -> fromJSON should recover an "equal" unit', function () {
      const unit1 = unit('1.23(m/(s/(kg mol)/(lbm/h)K))')
      const unit2 = unit.fromJSON(unit1.toJSON())
      assert.strictEqual(unit1.equals(unit2), true)
    })
  })

  describe('format', function () {
    it('should format units with given precision', function () {
      assert.strictEqual(unit(2 / 3, 'm').format(3), '0.667 m')
      assert.strictEqual(unit(2 / 3, 'm').format(4), '0.6667 m')
      assert.strictEqual(unit(2 / 3, 'm').format(), '0.6666666666666666 m')
    })

    it('should format a unit without value', function () {
      assert.strictEqual(unit('cm').format(), 'cm')
      assert.strictEqual(unit('m').format(), 'm')
      assert.strictEqual(unit('kg m/s').format(), '(kg m) / s')
    })

    it('should format a unit with fixed prefix and without value', function () {
      assert.strictEqual(unit('km').to('cm').format(), '1e+5 cm')
      assert.strictEqual(unit('inch').to('cm').format(), '2.54 cm')
      assert.strictEqual(unit('N/m^2').to('lbf/inch^2').format(5), '1.4504e-4 lbf / inch^2')
    })

    it('should format a unit with a bignumber', function () {
      assert.strictEqual(unit(math.bignumber(1).plus(1e-24), 'm').format(), '1.000000000000000000000001 m')
      assert.strictEqual(unit(math.bignumber(1e24).plus(1), 'm').format(), '1.000000000000000000000001e+21 km')
    })

    it('should format a unit with a fraction', function () {
      assert.strictEqual(unit(math.fraction(4 / 5), 'm').format(), '4/5 m')
    })

    it('should format a Complex unit', function () {
      assert.strictEqual(unit(math.complex(-2, 4.5), 'mm').format(14), '(-2 + 4.5i) mm')
    })

    it.skip('should format units with VA and VAR correctly', function () {
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

      assert.strictEqual(unit(5e5, 'cm').format(), '5 km')

      delete Object.prototype.foo
    })
  })

  describe('parse', function () {
    it('should parse units correctly', function () {
      let unit1

      unit1 = unit('5kg')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('5 kg')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit(' 5 kg ')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('5e-3kg')
      assert.strictEqual(unit1.value, 0.005)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('5e+3kg')
      assert.strictEqual(unit1.value, 5000)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('5e3kg')
      assert.strictEqual(unit1.value, 5000)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('-5kg')
      assert.strictEqual(unit1.value, -5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('+5kg')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('.5kg')
      assert.strictEqual(unit1.value, 0.5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('-5mg')
      approx.equal(unit1.toSI().value, -0.000005)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'm')

      unit1 = unit('5.2mg')
      approx.equal(unit1.toSI().value, 0.0000052)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[0].prefix, 'm')

      unit1 = unit('300 kg/minute')
      approx.equal(unit1.toSI().value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'g')
      assert.strictEqual(unit1.units[1].unit.name, 'minute')
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('981 cm/s^2')
      approx.equal(unit1.toSI().value, 9.81)
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.units[1].unit.name, 's')
      assert.strictEqual(unit1.units[1].power, -2)
      assert.strictEqual(unit1.units[0].prefix, 'c')

      unit1 = unit('981 cm*s^-2')
      approx.equal(unit1.toSI().value, 9.81)
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.units[1].unit.name, 's')
      assert.strictEqual(unit1.units[1].power, -2)
      assert.strictEqual(unit1.units[0].prefix, 'c')

      unit1 = unit('8.314 kg m^2 / s^2 K mol')
      approx.equal(unit1.value, 8.314)
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
      assert.strictEqual(unit1.units[0].prefix, 'k')

      unit1 = unit('5exabytes')
      approx.equal(unit1.to('bit').value, 4e19)
      assert.strictEqual(unit1.units[0].unit.name, 'bytes')

      unit1 = unit('1 / s')
      approx.equal(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 's')
      assert.strictEqual(unit1.units[0].power, -1)

      unit1 = unit('1/s')
      approx.equal(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 's')
      assert.strictEqual(unit1.units[0].power, -1)

      unit1 = unit('1 * s')
      approx.equal(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 's')
      assert.strictEqual(unit1.units[0].power, 1)
    })

    // it('should parse expressions with nested parentheses correctly', function () {
    //   let unit1 = Unit('8.314 kg (m^2 / (s^2 / (K^-1 / mol)))')
    //   approx.equal(unit1.value, 8.314)
    //   assert.strictEqual(unit1.units[0].unit.name, 'g')
    //   assert.strictEqual(unit1.units[1].unit.name, 'm')
    //   assert.strictEqual(unit1.units[2].unit.name, 's')
    //   assert.strictEqual(unit1.units[3].unit.name, 'K')
    //   assert.strictEqual(unit1.units[4].unit.name, 'mol')
    //   assert.strictEqual(unit1.units[0].power, 1)
    //   assert.strictEqual(unit1.units[1].power, 2)
    //   assert.strictEqual(unit1.units[2].power, -2)
    //   assert.strictEqual(unit1.units[3].power, -1)
    //   assert.strictEqual(unit1.units[4].power, -1)
    //   assert.strictEqual(unit1.units[0].prefix, 'k')

    //   unit1 = Unit('1 (m / ( s / ( kg mol ) / ( lbm / h ) K ) )')
    //   assert.strictEqual(unit1.units[0].unit.name, 'm')
    //   assert.strictEqual(unit1.units[1].unit.name, 's')
    //   assert.strictEqual(unit1.units[2].unit.name, 'g')
    //   assert.strictEqual(unit1.units[3].unit.name, 'mol')
    //   assert.strictEqual(unit1.units[4].unit.name, 'lbm')
    //   assert.strictEqual(unit1.units[5].unit.name, 'h')
    //   assert.strictEqual(unit1.units[6].unit.name, 'K')
    //   assert.strictEqual(unit1.units[0].power, 1)
    //   assert.strictEqual(unit1.units[1].power, -1)
    //   assert.strictEqual(unit1.units[2].power, 1)
    //   assert.strictEqual(unit1.units[3].power, 1)
    //   assert.strictEqual(unit1.units[4].power, 1)
    //   assert.strictEqual(unit1.units[5].power, -1)
    //   assert.strictEqual(unit1.units[6].power, -1)

    //   const unit2 = Unit('1(m/(s/(kg mol)/(lbm/h)K))')
    //   assert.deepStrictEqual(unit1, unit2)
    // })

    it('should parse units with correct precedence', function () {
      const unit1 = unit('1  m^3 / kg s^2') // implicit multiplication

      approx.equal(unit1.value, 1)
      assert.strictEqual(unit1.units[0].unit.name, 'm')
      assert.strictEqual(unit1.units[1].unit.name, 'g')
      assert.strictEqual(unit1.units[2].unit.name, 's')
      assert.strictEqual(unit1.units[0].power, 3)
      assert.strictEqual(unit1.units[1].power, -1)
      assert.strictEqual(unit1.units[2].power, -2)
      assert.strictEqual(unit1.units[0].prefix, '')
    })

    it('should throw an exception when parsing an invalid unit', function () {
      assert.throws(function () { unit('.meter') }, /Unexpected "\."/)
      assert.throws(function () { unit('5e') }, /Unit "e" not found/)
      assert.throws(function () { unit('5e.') }, /Unit "e" not found/)
      assert.throws(function () { unit('5e1.3') }, /Unexpected "\."/)
      assert.throws(function () { unit('meter.') }, /Unexpected "\."/)
      assert.throws(function () { unit('meter/') }, /Trailing characters/)
      assert.throws(function () { unit('/meter') }, /Unexpected "\/"/)
      assert.throws(function () { unit('1 */ s') }, /Unexpected "\/"/)
      assert.throws(function () { unit('45 kg 34 m') }, /Unexpected "3"/)
    })

    // it('should throw an exception when parsing an invalid type of argument', function () {
    //   assert.throws(function () { Unit(123) }, /TypeError: Invalid argument in Unit, string expected/)
    // })

    it('should parse the value of the unit as Fraction or BigNumber when math.js is configured so', function () {
      const math2 = math.create({ number: 'Fraction' })
      const unit2 = math2.Unit('5kg')
      assert(isFraction(unit2.value))

      const math3 = math.create({ number: 'BigNumber' })
      const unit3 = math3.Unit('5kg')
      assert(isBigNumber(unit3.value))
    })
  })

  describe('prefixes', function () {
    it('should accept both long and short prefixes for ohm', function () {
      assert.strictEqual(unit('5 ohm').toString(), '5 ohm')
      assert.strictEqual(unit('5 milliohm').toString(), '5 milliohm')
      assert.strictEqual(unit('5 mohm').toString(), '5 mohm')
    })

    it('should accept both long and short prefixes for bar', function () {
      assert.strictEqual(unit('5 bar').toString(), '5 bar')
      assert.strictEqual(unit('5 millibar').toString(), '5 millibar')
      assert.strictEqual(unit('5 mbar').toString(), '5 mbar')
    })
  })

  describe('isCompound', function () {
    it('should return the correct value', function () {
      assert.strictEqual(unit('34 kg').isCompound(), false)
      assert.strictEqual(unit('34 kg/s').isCompound(), true)
      assert.strictEqual(unit('34 kg^2').isCompound(), true)
      assert.strictEqual(unit('34 N').isCompound(), false)
      assert.strictEqual(unit('34 kg m / s^2').isCompound(), true)
      const unit1 = unit('34 kg m / s^2')
      assert.strictEqual(unit1.isCompound(), true)
      assert.strictEqual(unit1.simplify().isCompound(), false)
    })
  })

  describe('multiply, divide, and pow', function () {
    it('should return a Unit that will be automatically simplified', function () {
      const unit1 = unit(10, 'kg')
      const unit2 = unit(9.81, 'm/s^2')
      assert.notStrictEqual(unit1.mul(unit2).fixed, true)
      assert.notStrictEqual(unit1.div(unit2).fixed, true)
      assert.notStrictEqual(unit1.pow(2).fixed, true)
    })

    it('should retain the units of their operands without simplifying (but will combine duplicates)', function () {
      const unit1 = unit(10, 'N/s')
      const unit2 = unit(10, 'h')
      const unitM = unit1.mul(unit2)
      assert.strictEqual(unitM.units[0].unit.name, 'N')
      assert.strictEqual(unitM.units[1].unit.name, 's')
      assert.strictEqual(unitM.units[2].unit.name, 'h')

      const unit3 = unit(14.7, 'lbf')
      const unit4 = unit(1, 'in in')
      const unitD = unit3.div(unit4)
      assert.strictEqual(unitD.units[0].unit.name, 'lbf')
      assert.strictEqual(unitD.units[1].unit.name, 'in')
      assert.strictEqual(unitD.units[1].power, -2)

      const unit5 = unit(1, 'N h/s')
      const unitP = unit5.pow(-3.5)
      assert.strictEqual(unitP.units[0].unit.name, 'N')
      assert.strictEqual(unitP.units[1].unit.name, 'h')
      assert.strictEqual(unitP.units[2].unit.name, 's')
    })

    it('should keep the same numeric type for the units value', function () {
      const unit1 = unit(math.bignumber(10), 'N/s')
      const unit2 = unit(math.bignumber(10), 'h')
      const unitM = unit1.mul(unit2)
      assert(math.isBigNumber(unitM.value))

      const unit3 = unit(math.bignumber(14.7), 'lbf')
      const unit4 = unit(math.bignumber(1), 'in in')
      const unitD = unit3.div(unit4)
      assert(math.isBigNumber(unitD.value))

      const unit5 = unit(math.bignumber(1), 'N h/s')
      const unitP = unit5.pow(math.bignumber(-3.5))
      assert(math.isBigNumber(unitP.value))
    })
  })

  describe('plurals', function () {
    it('should support plurals', function () {
      const unit1 = unit(5, 'meters')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'meters')
      assert.strictEqual(unit1.units[0].prefix, '')

      const unit2 = unit(5, 'kilometers')
      assert.strictEqual(unit2.value, 5)
      assert.strictEqual(unit2.units[0].unit.name, 'meters')
      assert.strictEqual(unit2.units[0].prefix, 'kilo')

      const unit3 = unit(5, 'inches')
      approx.equal(unit3.value, 5)
      assert.strictEqual(unit3.units[0].unit.name, 'inches')
      assert.strictEqual(unit3.units[0].prefix, '')

      const unit4 = unit(9.81, 'meters/second^2')
      approx.equal(unit4.value, 9.81)
      assert.strictEqual(unit4.units[0].unit.name, 'meters')
      assert.strictEqual(unit4.units[0].prefix, '')

      assert.strictEqual(unit(10, 'decades').to('decade').value, 10)
      assert.strictEqual(unit(10, 'centuries').to('century').value, 10)
      assert.strictEqual(unit(10, 'millennia').to('millennium').value, 10)
    })
  })

  describe('aliases', function () {
    it('should support aliases', function () {
      const unit1 = unit(5, 'lt')
      assert.strictEqual(unit1.value, 5)
      assert.strictEqual(unit1.units[0].unit.name, 'lt')
      assert.strictEqual(unit1.units[0].prefix, '')

      const unit2 = unit(1, 'lb')
      assert.strictEqual(unit2.value, 1)
      assert.strictEqual(unit2.units[0].unit.name, 'lb')
      assert.strictEqual(unit2.units[0].prefix, '')

      assert.strictEqual(math.evaluate('2 feet * 8 s').toString(), '16 feet s')
      assert.strictEqual(math.evaluate('2 s * 8 feet').toString(), '16 s feet')
    })
  })

  describe('UNITS', function () {
    it('should be of the correct value and dimension', function () {
      assert.strictEqual(unit(1, 's A').equals(unit(1, 'C')), true)
      assert.strictEqual(unit(1, 'W/A').equals(unit(1, 'V')), true)
      assert.strictEqual(unit(1, 'V/A').equals(unit(1, 'ohm')), true)
      assert.strictEqual(unit(1, 'C/V').equals(unit(1, 'F')), true)
      assert.strictEqual(unit(1, 'J/A').equals(unit(1, 'Wb')), true)
      assert.strictEqual(unit(1, 'Wb/m^2').equals(unit(1, 'T')), true)
      assert.strictEqual(unit(1, 'Wb/A').equals(unit(1, 'H')), true)
      assert.strictEqual(unit(1, 'ohm^-1').equals(unit(1, 'S')), true)
      assert.strictEqual(unit(1, 'eV').equals(unit(1.602176565e-19, 'J')), true)
    })

    it("For each built-in unit, 'name' should match key", function () {
      for (const key in unit.UNITS) {
        assert.strictEqual(key, unit.UNITS[key].name)
      }
    })
  })

  describe('angles', function () {
    it('should create angles', function () {
      assert.strictEqual(unit(1, 'radian').equals(unit(1, 'rad')), true)
      assert.strictEqual(unit(1, 'radians').equals(unit(1, 'rad')), true)
      assert.strictEqual(unit(1, 'degree').equals(unit(1, 'deg')), true)
      assert.strictEqual(unit(1, 'degrees').equals(unit(1, 'deg')), true)
      assert.strictEqual(unit(1, 'gradian').equals(unit(1, 'grad')), true)
      assert.strictEqual(unit(1, 'gradians').equals(unit(1, 'grad')), true)

      assert.strictEqual(unit(1, 'radian').to('rad').equals(unit(1, 'rad')), true)
      assert.strictEqual(unit(1, 'radians').to('rad').equals(unit(1, 'rad')), true)
      assert.strictEqual(unit(1, 'deg').to('rad').equals(unit(2 * Math.PI / 360, 'rad')), true)
      assert.strictEqual(unit(1, 'degree').to('rad').equals(unit(2 * Math.PI / 360, 'rad')), true)
      assert.strictEqual(unit(1, 'degrees').to('rad').equals(unit(2 * Math.PI / 360, 'rad')), true)
      assert.strictEqual(unit(1, 'gradian').to('rad').equals(unit(Math.PI / 200, 'rad')), true)
      assert.strictEqual(unit(1, 'gradians').to('rad').equals(unit(Math.PI / 200, 'rad')), true)
    })

    it('should have correct long/short prefixes', function () {
      assert.strictEqual(unit(0.02, 'rad').toString(), '20 mrad')
      assert.strictEqual(unit(0.02, 'radian').toString(), '20 milliradian')
      assert.strictEqual(unit(0.02, 'radians').toString(), '20 milliradians')

      assert.strictEqual(unit(0.02, 'deg').toString(), '0.02 deg')
      assert.strictEqual(unit(0.02, 'degree').toString(), '0.02 degree')
      assert.strictEqual(unit(0.02, 'degrees').toString(), '0.02 degrees')

      assert.strictEqual(unit(0.02, 'grad').toString(), '2 cgrad')
      assert.strictEqual(unit(0.02, 'gradian').toString(), '2 centigradian')
      assert.strictEqual(unit(0.02, 'gradians').toString(), '2 centigradians')
    })
  })

  describe('createUnitSingle', function () {
    it('should create a custom unit from a string definition', function () {
      unit.createUnitSingle('widget', '5 kg bytes')
      assert.strictEqual(unit(1, 'widget').equals(unit(5, 'kg bytes')), true)
      unit.createUnitSingle('woggle', '4 widget^2')
      assert.strictEqual(unit(1, 'woggle').equals(unit(4, 'widget^2')), true)
      assert.strictEqual(unit(2, 'woggle').equals(unit(200, 'kg^2 bytes^2')), true)
    })

    it('should create a custom unit from a Unit definition', function () {
      const Unit1 = unit(5, 'N/woggle')
      unit.createUnitSingle('gadget', Unit1)
      assert.strictEqual(unit(1, 'gadget').equals(unit(5, 'N/woggle')), true)
    })

    it('should create a custom unit from a configuration object', function () {
      unit.createUnitSingle('wiggle', { definition: '4 rad^2/s', offset: 1, prefixes: 'long' })
      assert.strictEqual(math.evaluate('8000 rad^2/s').toString(), '1 kilowiggle')
    })

    it('should return the new (value-less) unit', function () {
      const Unit2 = unit(1000, 'N h kg^-2 bytes^-2')
      const newUnit = unit.createUnitSingle('whimsy', '8 gadget hours')
      assert.strictEqual(Unit2.to(newUnit).toString(), '2500 whimsy')
    })

    it('should not override an existing unit', function () {
      assert.throws(function () { unit.createUnitSingle('m', '1 kg') }, /Cannot create unit .*: a unit with that name already exists/)
      assert.throws(function () { unit.createUnitSingle('gadget', '1 kg') }, /Cannot create unit .*: a unit with that name already exists/)
      assert.throws(function () { unit.createUnitSingle('morogrove', { aliases: 's' }) }, /Cannot create alias .*: a unit with that name already exists/)
    })

    it('should throw an error for invalid parameters', function () {
      assert.throws(function () { unit.createUnitSingle() }, /createUnitSingle expects first parameter/)
      assert.throws(function () { unit.createUnitSingle(42) }, /createUnitSingle expects first parameter/)
      assert.throws(function () { unit.createUnitSingle('42') }, /Error: Invalid unit name/)
    })

    it('should apply the correct prefixes', function () {
      unit.createUnitSingle('millizilch', { definition: '1e-3 m', prefixes: 'long' })
      assert.strictEqual(unit(1e-6, 'millizilch').toString(), '1 micromillizilch')
    })

    it('should override prefixed built-in units', function () {
      unit.createUnitSingle('mm', { definition: '1e-4 m', prefixes: 'short' }) // User is being silly
      assert.strictEqual(unit(1e-3, 'mm').toString(), '1 mmm') // Use the user's new definition
      assert.strictEqual(unit(1e-3, 'mm').to('m').format(4), '1e-7 m') // Use the user's new definition
    })

    it('should create aliases', function () {
      unit.createUnitSingle('knot', { definition: '0.51444444 m/s', aliases: ['knots', 'kts', 'kt'] })
      assert.strictEqual(unit(1, 'knot').equals(unit(1, 'kts')), true)
      assert.strictEqual(unit(1, 'kt').equals(unit(1, 'knots')), true)
    })

    it('should apply offset correctly', function () {
      unit.createUnitSingle('whatsit', { definition: '3.14 kN', offset: 2 })
      assert.strictEqual(unit(1, 'whatsit').to('kN').toString(), '9.42 kN')
    })

    it('should create new base units', function () {
      const fooBaseUnit = unit.createUnitSingle('fooBase')
      assert.strictEqual(fooBaseUnit.dimensions.toString(), unit.BASE_UNITS['fooBase_STUFF'].dimensions.toString())
      const testUnit = unit(5, 'fooBase')
      assert.strictEqual(testUnit.toString(), '5 fooBase')
    })

    it('should not override base units', function () {
      assert.throws(function () { unit.createUnitSingle('fooBase', '', { override: true }) }, /Cannot create/)
    })

    it('should create and use a new base if no matching base exists', function () {
      unit.createUnitSingle('jabberwocky', '1 mile^5/hour')
      assert.strictEqual('jabberwocky_STUFF' in unit.BASE_UNITS, true)
      assert.strictEqual(math.evaluate('4 mile^5/minute').format(4), '240 jabberwocky')
    })
  })

  describe('createUnit', function () {
    it('should create multiple units', function () {
      unit.createUnit({
        'foo1': '',
        'foo2': '2 foo1',
        'foo3': {
          definition: '2 foo2',
          prefixes: 'long'
        }
      })
      assert.strictEqual(math.evaluate('2 foo3 to foo1').toString(), '8 foo1')
    })

    it('should override units when requested and if able', function () {
      assert.throws(function () { unit.createUnit({ foo1: '' }) }, /Cannot/)
      assert.throws(function () { unit.createUnit({ foo1: '', override: true }) }, /Cannot/)
      unit.createUnit({ foo3: '' }, { override: true })
    })

    it.only('should not reset custom units when config is changed', function () {
      // Create a unit
      math.createUnit({
        'astronomicalUnit': '149597870700 m'
      })
      assert.strictEqual(math.evaluate('10 astronomicalUnit to m').toString(), '1495978707000 m')

      // Create another math instance
      const math2 = math.create({ precision: 6 })
      assert.strictEqual(math.evaluate('10 astronomicalUnit to m').toString(), '1495978707000 m')

      // Create another unit
      math2.unit.createUnit({
        'lightyear': '63241.07708426628 astronomicalUnit'
      })
      assert.strictEqual(math.evaluate('10 lightyear to m').toString(), '94607304725808000 m')

      // Reconfigure math instance
      math2.config({ precision: 8 })
      assert.strictEqual(math.evaluate('10 lightyear to m').toString(), '94607304725808000 m')

      // Create a third unit
      math2.unit.createUnit({
        'parsec': '3.261563777 lightyear'
      })
      assert.strictEqual(math.evaluate('10 parsec to m').toString(), '3.085677581e+17 m')

      // Reconfigure math instance again
      math2.config({ precision: 10 })
      assert.strictEqual(math.evaluate('10 parsec to m').toString(), '3.085677581e+17 m')

    })

    it('should throw error when first parameter is not an object', function () {
      assert.throws(function () { unit.createUnit('not an object') }, /createUnit expects first/)
    })
  })

  describe('splitUnit', function () {
    it('should split a unit into parts', function () {
      assert.strictEqual((unit(1, 'm')).split(['ft', 'in']).toString(), '3 ft,3.370078740157485 in')
      assert.strictEqual((unit(-1, 'm')).split(['ft', 'in']).toString(), '-3 ft,-3.370078740157485 in')
      assert.strictEqual((unit(1, 'm/s')).split(['m/s']).toString(), '1 m / s')
      assert.strictEqual((unit(1, 'm')).split(['ft', 'ft']).toString(), '3 ft,0.2808398950131238 ft')
      assert.strictEqual((unit(1.23, 'm/s')).split([]).toString(), '1.23 m / s')
      assert.strictEqual((unit(1, 'm')).split(['in', 'ft']).toString(), '39 in,0.03083989501312361 ft')
      assert.strictEqual((unit(1, 'm')).split([ unit('ft'), unit('in') ]).toString(), '3 ft,3.370078740157485 in')
    })

    it('should be resistant to round-off error', function () {
      assert.strictEqual((unit(-12, 'in')).split(['ft', 'in']).toString(), '-1 ft,0 in')
      assert.strictEqual((unit(12, 'in')).split(['ft', 'in']).toString(), '1 ft,0 in')
      assert.strictEqual((unit(24, 'in')).split(['ft', 'in']).toString(), '2 ft,0 in')
      assert.strictEqual((unit(36, 'in')).split(['ft', 'in']).toString(), '3 ft,0 in')
      assert.strictEqual((unit(48, 'in')).split(['ft', 'in']).toString(), '4 ft,0 in')
      assert.strictEqual((unit(60, 'in')).split(['ft', 'in']).toString(), '5 ft,0 in')
      assert.strictEqual((unit(36000, 'in')).split(['ft', 'in']).toString(), '3000 ft,0 in')
    })
  })

  describe('toSI', function () {
    it('should return a clone of the unit', function () {
      const u1 = unit('3 ft')
      const u2 = u1.toSI()
      assert.strictEqual(u1 === u2, false)
    })

    it('should return the unit in SI units', function () {
      assert.strictEqual(unit('3 ft').toSI().format(10), '0.9144 m')
      assert.strictEqual(unit('0.111 ft^2').toSI().format(10), '0.01031223744 m^2')
    })

    it('should return SI units for valueless units', function () {
      assert.strictEqual(unit('ft/minute').toSI().toString(), 'm / s')
    })

    it('should return SI units for custom units defined from other units', function () {
      unit.createUnit({ foo: '3 kW' }, { override: true })
      assert.strictEqual(unit('42 foo').toSI().toString(), '1.26e+5 (kg m^2) / s^3')
    })

    it('should throw if custom unit not defined from existing units', function () {
      unit.createUnit({ baz: '' }, { override: true })
      assert.throws(function () { unit('10 baz').toSI() }, /Cannot express custom unit/)
    })
  })
})
