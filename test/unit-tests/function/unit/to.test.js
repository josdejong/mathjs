import assert from 'assert'
import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix
const Unit = math.Unit
const unit = math.unit

describe('to', function () {
  it('should perform the given unit conversion', function () {
    const a = math.unit('500 cm'); a.fixPrefix = true
    approxDeepEqual(math.to(unit('5m'), unit('cm')), a)

    const b = math.unit('1 foot'); b.fixPrefix = true
    approxDeepEqual(math.to(unit('12 inch'), unit('foot')), b)

    const c = math.unit('1 inch'); c.fixPrefix = true
    approxDeepEqual(math.to(unit('2.54 cm'), unit('inch')), c)

    const d = math.unit('68 fahrenheit'); d.fixPrefix = true
    approxDeepEqual(math.to(unit('20 celsius'), unit('fahrenheit')), d)

    const e = math.unit('0.002 m3'); e.fixPrefix = true
    approxDeepEqual(math.to(unit('2 litre'), unit('m3')), e)
  })

  describe('Array', function () {
    it('should perform the given unit conversion, array - scalar', function () {
      approxDeepEqual(math.to([unit('1cm'), unit('2 inch'), unit('2km')], unit('foot')), [new Unit(0.032808, 'foot').to('foot'), new Unit(0.16667, 'foot').to('foot'), new Unit(6561.7, 'foot').to('foot')])
      approxDeepEqual(math.to(unit('1cm'), [unit('cm'), unit('foot'), unit('km'), unit('m')]), [new Unit(1, 'cm').to('cm'), new Unit(1, 'cm').to('foot'), new Unit(1, 'cm').to('km'), new Unit(1, 'cm').to('m')])
    })

    it('should perform the given unit conversion, array - array', function () {
      approxDeepEqual(math.to([[unit('1cm'), unit('2 inch')], [unit('2km'), unit('1 foot')]], [[unit('foot'), unit('foot')], [unit('cm'), unit('foot')]]), [[unit('1cm').to('foot'), unit('2 inch').to('foot')], [unit('2km').to('cm'), unit('1 foot').to('foot')]])
    })

    it('should perform the given unit conversion, between broadcastable arrays', function () {
      approxDeepEqual(math.to([unit('1 cm'), unit('2 inch')], [[unit('foot')], [unit('cm')]]), [[unit('1cm').to('foot'), unit('2 inch').to('foot')], [unit('1cm').to('cm'), unit('2 inch').to('cm')]])
    })

    it('should perform the given unit conversion, array - dense matrix', function () {
      approxDeepEqual(math.to([[unit('1cm'), unit('2 inch')], [unit('2km'), unit('1 foot')]], matrix([[unit('foot'), unit('foot')], [unit('cm'), unit('foot')]])), matrix([[unit('1cm').to('foot'), unit('2 inch').to('foot')], [unit('2km').to('cm'), unit('1 foot').to('foot')]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should perform the given unit conversion, dense matrix - scalar', function () {
      approxDeepEqual(math.to(matrix([unit('1cm'), unit('2 inch'), unit('2km')]), unit('foot')), matrix([new Unit(0.032808, 'foot').to('foot'), new Unit(0.16667, 'foot').to('foot'), new Unit(6561.7, 'foot').to('foot')]))
      approxDeepEqual(math.to(unit('1cm'), matrix([unit('cm'), unit('foot'), unit('km'), unit('m')])), matrix([new Unit(1, 'cm').to('cm'), new Unit(1, 'cm').to('foot'), new Unit(1, 'cm').to('km'), new Unit(1, 'cm').to('m')]))
    })

    it('should perform the given unit conversion, dense matrix - array', function () {
      approxDeepEqual(math.to(matrix([[unit('1cm'), unit('2 inch')], [unit('2km'), unit('1 foot')]]), [[unit('foot'), unit('foot')], [unit('cm'), unit('foot')]]), matrix([[unit('1cm').to('foot'), unit('2 inch').to('foot')], [unit('2km').to('cm'), unit('1 foot').to('foot')]]))
    })

    it('should perform the given unit conversion, dense matrix - dense matrix', function () {
      approxDeepEqual(math.to(matrix([[unit('1cm'), unit('2 inch')], [unit('2km'), unit('1 foot')]]), matrix([[unit('foot'), unit('foot')], [unit('cm'), unit('foot')]])), matrix([[unit('1cm').to('foot'), unit('2 inch').to('foot')], [unit('2km').to('cm'), unit('1 foot').to('foot')]]))
    })
  })

  it('should throw an error if converting between incompatible units', function () {
    assert.throws(function () { math.to(unit('20 kg'), unit('cm')) })
    assert.throws(function () { math.to(unit('20 celsius'), unit('litre')) })
    assert.throws(function () { math.to(unit('5 cm'), unit('2 m^2')) })
  })

  it('should throw an error if called with a wrong number of arguments', function () {
    assert.throws(function () { math.to(unit('20 kg')) })
    assert.throws(function () { math.to(unit('20 kg'), unit('m'), unit('cm')) })
  })

  it('should throw an error if called with a non-plain unit', function () {
    assert.throws(function () { math.unit(5000, 'cm').to('5mm') })
  })

  it('should throw an error if called with a number', function () {
    assert.throws(function () { math.to(5, unit('m')) }, TypeError)
    assert.throws(function () { math.to(unit('5cm'), 2) }, TypeError)
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { math.to('5cm', unit('cm')) }, TypeError)
  })

  it('should LaTeX to', function () {
    const expression = math.parse('to(2cm,m)')
    assert.strictEqual(expression.toTex(), '\\left(2~\\mathrm{cm}\\rightarrow\\mathrm{m}\\right)')
  })
})
