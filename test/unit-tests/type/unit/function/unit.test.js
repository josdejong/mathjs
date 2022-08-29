import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
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

  it('should create a unit from an existing unit', function () {
    const kelvin = math.unit('K')
    const degF = math.unit('degF')
    const a = math.unit(0, kelvin)
    assert.deepStrictEqual(a.toNumeric(degF), -459.67)
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
})
