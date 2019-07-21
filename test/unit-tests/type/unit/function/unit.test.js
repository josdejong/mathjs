import assert from 'assert'
import math from '../../../../../src/bundleAny'
import { isBigNumber, isFraction } from '../../../../../src/utils/is'

const unit = math.unit
const Unit = math.Unit

describe('unit', function () {
  it('should construct a unit', function () {
    const u = unit('5 cm')
    assert.deepStrictEqual(u, new Unit(5, 'cm'))
  })

  it('should parse a valid string to a unit', function () {
    assert.deepStrictEqual(unit('5 cm').toString(), '5 cm')
    assert.deepStrictEqual(unit('5000 cm').toString(), '50 m')
    assert.deepStrictEqual(unit('10 kg').toString(), '10 kg')
    assert.deepStrictEqual(unit('5Mcd').toString(), '5 Mcd')
    assert.deepStrictEqual(unit('12mcd').toString(), '12 mcd')
    assert.deepStrictEqual(unit('10 millicandela').toString(), '10 millicandela')
    assert.deepStrictEqual(unit('3t').toString(), '3 t')
    assert.deepStrictEqual(unit('3mt').toString(), '3 mt')
    assert.deepStrictEqual(unit('6 tonne').toString(), '6 tonne')
    assert.deepStrictEqual(unit('4 megatonne').toString(), '4 megatonne')
  })

  it('should clone a unit', function () {
    const a = math.unit('5cm')
    const b = math.unit(a)
    assert.deepStrictEqual(b.toString(), '5 cm')
  })

  it('should create units from all elements in an array', function () {
    assert.deepStrictEqual(math.unit(['5 cm', '3kg']), [math.unit('5cm'), math.unit('3kg')])
  })

  it('should create units from all elements in an array', function () {
    assert.deepStrictEqual(math.unit(math.matrix(['5 cm', '3kg'])), math.matrix([math.unit('5cm'), math.unit('3kg')]))
  })

  it('should throw an error if called with an invalid string', function () {
    assert.throws(function () { unit('invalid unit') }, SyntaxError)
  })

  it('should create dimensionless units (pure numbers)', function () {
    const unit1 = unit(5)
    assert.strictEqual(unit1.toString(), '5')
    assert.strictEqual(unit1.value, 5)
    assert.strictEqual(unit1.units.length, 0)
    assert.deepStrictEqual(unit1, unit('5'))
  })

  it('should throw an error if called with a complex', function () {
    assert.throws(function () { unit(math.complex(2, 3)) }, TypeError)
  })

  it('should take a number as the quantity and a string as the unit', function () {
    assert.deepStrictEqual(unit(5, 'cm').toString(), '5 cm')
    assert.deepStrictEqual(unit(10, 'kg').toString(), '10 kg')
  })

  it('should take a bignumber as the quantity and a string as the unit', function () {
    assert.deepStrictEqual(unit(math.bignumber(5).plus(1e-24), 'cm').toString(), '5.000000000000000000000001 cm')
  })

  it('should take a fraction as the quantity and a string as the unit', function () {
    assert.deepStrictEqual(unit(math.fraction(1, 3), 'cm').toString(), '1/3 cm')
  })

  it('should convert a string to number with 2 strings', function () {
    assert.deepStrictEqual(unit('5', 'cm').toString(), '5 cm')
  })

  it('should throw an error if called with an invalid argument', function () {
    assert.throws(function () { unit(2, math.complex(2, 3)) }, TypeError)
    assert.throws(function () { unit(new Date()) }, TypeError)
  })

  it('should throw an error if called with no argument', function () {
    assert.throws(function () { unit() }, /TypeError: Too few arguments/)
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { unit(1, 'cm', 3) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX unit', function () {
    const expr1 = math.parse('unit(cm)')
    const expr2 = math.parse('unit(1,cm)')

    assert.strictEqual(expr1.toTex(), '\\left(\\mathrm{cm}\\right)')
    assert.strictEqual(expr2.toTex(), '\\left(\\left(1\\right)\\mathrm{cm}\\right)')
  })

  describe('config option \'number\'', function () {
    it('should use original and updated config option \'number\'', function () {
      const math2 = math.create({ number: 'Fraction' })
      const unit2 = math2.Unit(5, 'kg')
      const unit2b = math2.Unit('5 kg')
      assert(isFraction(unit2.value))
      assert(isFraction(unit2b.value))

      math2.config({ number: 'BigNumber' })
      const unit3 = math2.Unit(5, 'kg')
      const unit3b = math2.Unit('5 kg')
      assert(isBigNumber(unit3.value))
      assert(isBigNumber(unit3b.value))
    })

    it('should create angle units to required number of digits', function () {
      // Original instance
      console.log("******** default math")
      console.log(math.unit.unitmath().definitions().units.deg.value.toString())
      console.log(math.unit.unitmath()._unitStore.defs.units.deg.value.toString())
      assert.strictEqual(math.unit('180 deg').to('rad').toString(), '3.141592653589793 rad')
      
      // Create new instance
      console.log("******** math2 = math.create")
      const math2 = math.create({ number: 'BigNumber' })
      assert.strictEqual(math2.unit('180 deg').to('rad').toString(), '3.141592653589793238462643383279502884197169399375105820974944592 rad')

      // Create another new instance
      console.log("******** math3 = math.create")
      const math3 = math.create({ number: 'BigNumber', precision: 80 })
      assert.strictEqual(math3.unit('180 deg').to('rad').toString(), '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089 rad')

      // Modify config of existing instance
      console.log("******** math2.config")
      console.log("Value of deg before modifying config:")
      console.log(math2.unit.unitmath().definitions().units.deg.value.toString())
      console.log(math2.unit.unitmath()._unitStore.defs.units.deg.value.toString())
      math2.config({ precision: 80 })
      console.log("Value of deg after modifying config:")
      console.log(math2.unit.unitmath().definitions().units.deg.value.toString())
      console.log(math2.unit.unitmath()._unitStore.defs.units.deg.value.toString())

      assert.strictEqual(math2.unit('180 deg').to('rad').toString(), '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089 rad')

      
    })
  })

  it('should use original and updated config option \'precision\'', function () {
    const math2 = math.create({ number: 'BigNumber', precision: 30 })
    const unit2 = math2.Unit('3.141592653589793238462643383279502884 C')
    assert(isBigNumber(unit2.value))
    assert.strictEqual(unit2.toString(), '3.14159265358979323846264338328 C')

    math2.config({ precision: 20 })

    const unit3 = math2.Unit('3.141592653589793238462643383279502884 C')
    assert(isBigNumber(unit3.value))
    assert.strictEqual(unit2.toString(), '3.1415926535897932385 C')
    assert.strictEqual(unit3.toString(), '3.1415926535897932385 C')

  })

})
