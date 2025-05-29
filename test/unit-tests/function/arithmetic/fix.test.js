// test fix
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const fraction = math.fraction
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const fix = math.fix

describe('fix', function () {
  it('should round booleans correctly', function () {
    assert.strictEqual(fix(true), 1)
    assert.strictEqual(fix(false), 0)
  })

  it('should round numbers correctly', function () {
    assert.strictEqual(fix(0), 0)
    assert.strictEqual(fix(1), 1)
    assert.strictEqual(fix(1.3), 1)
    assert.strictEqual(fix(1.8), 1)
    assert.strictEqual(fix(2), 2)
    assert.strictEqual(fix(-1), -1)
    assert.strictEqual(fix(-1.3), -1)
    assert.strictEqual(fix(-1.8), -1)
    assert.strictEqual(fix(-2), -2)
    assert.strictEqual(fix(-2.1), -2)
    assert.strictEqual(fix(math.pi), 3)
  })

  it('should round numbers with a given number of decimals', function () {
    assert.strictEqual(fix(0, 5), 0)
    assert.strictEqual(fix(1, 5), 1)
    assert.strictEqual(fix(1.3, 5), 1.3)
    assert.strictEqual(fix(1.313, 2), 1.31)
    assert.strictEqual(fix(1.383, 2), 1.38)
    assert.strictEqual(fix(2.22, 2), 2.22)
    assert.strictEqual(fix(-1, 5), -1)
    assert.strictEqual(fix(-1.3, 5), -1.3)
    assert.strictEqual(fix(-1.883, 2), -1.88)
    assert.strictEqual(fix(-1.888, 2), -1.88)
    assert.strictEqual(fix(-2.22, 2), -2.22)
    assert.strictEqual(fix(math.pi, 6), 3.141592)

    assert.deepStrictEqual(fix(1.313, bignumber(2)), bignumber(1.31))
    assert.deepStrictEqual(fix(1.383, bignumber(2)), bignumber(1.38))
    assert.deepStrictEqual(fix(-1.883, bignumber(2)), bignumber(-1.88))
    assert.deepStrictEqual(fix(-1.888, bignumber(2)), bignumber(-1.88))
  })

  it('should be safe to call with a bigint', function () {
    const b = 12345678901234567890n
    assert.strictEqual(fix(b), b)
    assert.strictEqual(fix(b, 7), b)
  })

  it('should round big numbers correctly', function () {
    assert.deepStrictEqual(fix(bignumber(0)), bignumber(0))
    assert.deepStrictEqual(fix(bignumber(1)), bignumber(1))
    assert.deepStrictEqual(fix(bignumber(1.3)), bignumber(1))
    assert.deepStrictEqual(fix(bignumber(1.8)), bignumber(1))
    assert.deepStrictEqual(fix(bignumber(2)), bignumber(2))
    assert.deepStrictEqual(fix(bignumber(-1)), bignumber(-1))
    assert.deepStrictEqual(fix(bignumber(-1.3)), bignumber(-1))
    assert.deepStrictEqual(fix(bignumber(-1.8)), bignumber(-1))
    assert.deepStrictEqual(fix(bignumber(-2)), bignumber(-2))
    assert.deepStrictEqual(fix(bignumber(-2.1)), bignumber(-2))
  })

  it('should round big numbers with a given number of decimals', function () {
    assert.deepStrictEqual(fix(bignumber(0), 5), bignumber(0))
    assert.deepStrictEqual(fix(bignumber(1), 5), bignumber(1))
    assert.deepStrictEqual(fix(bignumber(1.315), 2), bignumber(1.31))
    assert.deepStrictEqual(fix(bignumber(1.381), 2), bignumber(1.38))
    assert.deepStrictEqual(fix(bignumber(2), 2), bignumber(2))
    assert.deepStrictEqual(fix(bignumber(-1), 2), bignumber(-1))
    assert.deepStrictEqual(fix(bignumber(-1.31), 1), bignumber(-1.3))
    assert.deepStrictEqual(fix(bignumber(-1.38), 1), bignumber(-1.3))
    assert.deepStrictEqual(fix(bignumber(-2.22), 2), bignumber(-2.22))

    assert.deepStrictEqual(fix(bignumber(1.315), bignumber(2)), bignumber(1.31))
    assert.deepStrictEqual(fix(bignumber(1.381), bignumber(2)), bignumber(1.38))
    assert.deepStrictEqual(fix(bignumber(-1.31), bignumber(1)), bignumber(-1.3))
    assert.deepStrictEqual(fix(bignumber(-1.38), bignumber(1)), bignumber(-1.3))
    assert.deepStrictEqual(fix(bignumber(math.pi), bignumber(6)), bignumber(3.141592))
  })

  it('should round complex numbers correctly', function () {
    // complex
    assert.deepStrictEqual(fix(complex(0, 0)), complex(0, 0))
    assert.deepStrictEqual(fix(complex(1.3, 1.8)), complex(1, 1))
    assert.deepStrictEqual(fix(math.i), complex(0, 1))
    assert.deepStrictEqual(fix(complex(-1.3, -1.8)), complex(-1, -1))
  })

  it('should round complex numbers with a given number of decimals', function () {
    assert.deepStrictEqual(fix(complex(0, 0), 5), complex(0, 0))
    assert.deepStrictEqual(fix(complex(1.335, 2.835), 2), complex(1.33, 2.83))
    assert.deepStrictEqual(fix(math.i, 5), complex(0, 1))
    assert.deepStrictEqual(fix(complex(-1.335, -1.835), 2), complex(-1.33, -1.83))

    assert.deepStrictEqual(fix(complex(0, 0), bignumber(5)), complex(0, 0))
    assert.deepStrictEqual(fix(complex(1.335, 2.835), bignumber(2)), complex(1.33, 2.83))
    assert.deepStrictEqual(fix(math.i, bignumber(5)), complex(0, 1))
    assert.deepStrictEqual(fix(complex(-1.335, -1.835), bignumber(2)), complex(-1.33, -1.83))
  })

  it('should round fractions correctly', function () {
    const a = fraction('2/3')
    assert(fix(a) instanceof math.Fraction)
    assert.strictEqual(a.toString(), '0.(6)')

    assert.strictEqual(fix(fraction(0)).toString(), '0')
    assert.strictEqual(fix(fraction(1)).toString(), '1')
    assert.strictEqual(fix(fraction(1.3)).toString(), '1')
    assert.strictEqual(fix(fraction(1.8)).toString(), '1')
    assert.strictEqual(fix(fraction(2)).toString(), '2')
    assert.strictEqual(fix(fraction(-1)).toString(), '-1')
    assert.strictEqual(fix(fraction(-1.3)).toString(), '-1')
    assert.strictEqual(fix(fraction(-1.8)).toString(), '-1')
    assert.strictEqual(fix(fraction(-2)).toString(), '-2')
    assert.strictEqual(fix(fraction(-2.1)).toString(), '-2')
  })

  it('should round fractions with a given number of decimals', function () {
    const a = fraction('2/3')
    assert(fix(a, 3) instanceof math.Fraction)
    assert.strictEqual(a.toString(), '0.(6)')
    const b = fraction('-2/3')
    assert(fix(b, 3) instanceof math.Fraction)
    assert.strictEqual(b.toString(), '-0.(6)')

    assert.strictEqual(fix(fraction(0), 5).toString(), '0')
    assert.strictEqual(fix(fraction(1), 5).toString(), '1')
    assert.strictEqual(fix(fraction(1.33), 1).toString(), '1.3')
    assert.strictEqual(fix(fraction(1.38), 1).toString(), '1.3')
    assert.strictEqual(fix(fraction(2), 5).toString(), '2')
    assert.strictEqual(fix(fraction(-1), 5).toString(), '-1')
    assert.strictEqual(fix(fraction(-1.33), 1).toString(), '-1.3')
    assert.strictEqual(fix(fraction(-1.38), 1).toString(), '-1.3')
    assert.strictEqual(fix(fraction(-2.22), 2).toString(), '-2.22')

    assert.strictEqual(fix(fraction(1.381), bignumber(2)).toString(), '1.38')
    assert.strictEqual(fix(fraction(-1.381), bignumber(2)).toString(), '-1.38')
  })

  it('should gracefully handle round-off errors', function () {
    assert.strictEqual(fix(3.0000000000000004), 3)
    assert.strictEqual(fix(7.999999999999999), 8)
    assert.strictEqual(fix(-3.0000000000000004), -3)
    assert.strictEqual(fix(-7.999999999999999), -8)
    assert.strictEqual(fix(30000.000000000004), 30000)
    assert.strictEqual(fix(799999.9999999999), 800000)
    assert.strictEqual(fix(-30000.000000000004), -30000)
    assert.strictEqual(fix(-799999.9999999999), -800000)
  })

  it('should gracefully handle round-off errors with bignumbers', function () {
    assert.deepStrictEqual(fix(bignumber(3.0000000000000004)), bignumber(3))
    assert.deepStrictEqual(fix(bignumber(7.999999999999999)), bignumber(8))
    assert.deepStrictEqual(fix(bignumber(-3.0000000000000004)), bignumber(-3))
    assert.deepStrictEqual(fix(bignumber(-7.999999999999999)), bignumber(-8))
    assert.deepStrictEqual(fix(bignumber(30000.000000000004)), bignumber(30000))
    assert.deepStrictEqual(fix(bignumber(799999.9999999999)), bignumber(800000))
    assert.deepStrictEqual(fix(bignumber(-30000.000000000004)), bignumber(-30000))
    assert.deepStrictEqual(fix(bignumber(-799999.9999999999)), bignumber(-800000))
  })

  it('should gracefully handle round-off errors with given number of decimals', function () {
    assert.strictEqual(fix(3.0000000000000004, 3), 3)
    assert.strictEqual(fix(7.999999999999999, 3), 8)
    assert.strictEqual(fix(-3.0000000000000004, 3), -3)
    assert.strictEqual(fix(-7.999999999999999, 3), -8)
    assert.strictEqual(fix(30000.000000000004, 3), 30000)
    assert.strictEqual(fix(799999.9999999999, 3), 800000)
    assert.strictEqual(fix(-30000.000000000004, 3), -30000)
    assert.strictEqual(fix(-799999.9999999999, 3), -800000)
  })

  it('should fix units', function () {
    assert.deepStrictEqual(fix(unit('5.99 inch'), unit('inch')), unit('5 inch'))
    assert.deepStrictEqual(fix(unit('3.12345 cm'), 3, unit('cm')), unit('3.123 cm'))
    assert.deepStrictEqual(fix(unit('3.12345 cm'), unit('cm')), unit('3 cm'))
    assert.deepStrictEqual(fix(unit('2 inch'), unit('cm')), unit('5 cm'))
    assert.deepStrictEqual(fix(unit('2 inch'), 1, unit('cm')), unit('5 cm'))
    assert.deepStrictEqual(fix(unit('-1.9 inch'), unit('cm')), unit('-4 cm'))

    // bignumber values
    assert.deepStrictEqual(fix(unit('3.12345 cm'), bignumber(2), unit('cm')), unit('3.12 cm'))
    assert.deepStrictEqual(fix(unit(bignumber('2'), 'inch'), unit('cm')), unit(bignumber('5'), 'cm'))
    assert.deepStrictEqual(fix(unit(bignumber('2'), 'inch'), bignumber(1), unit('cm')), unit(bignumber('5.0'), 'cm'))

    // first argument is a collection
    assert.deepStrictEqual(fix([unit('2 inch'), unit('3 inch')], unit('cm')), [unit('5 cm'), unit('7 cm')])
    assert.deepStrictEqual(fix(matrix([unit('2 inch'), unit('3 inch')]), unit('cm')), matrix([unit('5 cm'), unit('7 cm')]))
  })

  it('should throw an error if used with a unit without valueless unit', function () {
    assert.throws(function () { fix(unit('5cm')) }, TypeError, 'Function fix(unit) not supported')
    assert.throws(function () { fix(unit('5cm'), 2) }, TypeError, 'Function fix(unit) not supported')
    assert.throws(function () { fix(unit('5cm'), bignumber(2)) }, TypeError, 'Function fix(unit) not supported')
  })

  it('should throw an error if used with a unit with a second unit that is not valueless', function () {
    assert.throws(function () { fix(unit('2 inch'), 1, unit('10 cm')) }, Error)
    assert.throws(function () { fix(unit('2 inch'), unit('10 cm')) }, Error)
  })

  it('should throw an error with a unit', function () {
    assert.throws(function () { fix(unit('5cm')) }, TypeError, 'Function fix(unit) not supported')
  })

  it('should throw an error on unit as parameter', function () {
    // unit
    assert.throws(function () { fix(unit('5cm')) }, TypeError, 'Function fix(unit) not supported')
  })

  it('should convert a string to a number', function () {
    assert.strictEqual(fix('1.81'), 1)
    assert.strictEqual(fix('1.815', '2').toString(), '1.81')
    assert.strictEqual(fix('1.815', 2).toString(), '1.81')
    assert.strictEqual(fix(1.815, '2').toString(), '1.81')
  })

  it('should correctly round all values of a matrix element-wise', function () {
    // matrix, array, range
    assert.deepStrictEqual(fix([1.2, 3.4, 5.6, 7.8, 10.0]), [1, 3, 5, 7, 10])
    assert.deepStrictEqual(fix(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([1, 3, 5, 7, 10]))
  })

  it('should round all values of a matrix element-wise with a given number of decimals', function () {
    assert.deepStrictEqual(fix([1.234, 3.456, 5.678, 7.891, 10.01], 2), [1.23, 3.45, 5.67, 7.89, 10.01])
    assert.deepStrictEqual(fix(matrix([1.234, 3.456, 5.678, 7.891, 10.01]), 2), matrix([1.23, 3.45, 5.67, 7.89, 10.01]))

    assert.deepStrictEqual(fix([1.234, 3.456, 5.678, 7.891, 10.01], bignumber(2)), bignumber([1.23, 3.45, 5.67, 7.89, 10.01]))
    assert.deepStrictEqual(fix(matrix([1.234, 3.456, 5.678, 7.891, 10.01]), bignumber(2)), matrix(bignumber([1.23, 3.45, 5.67, 7.89, 10.01])))
  })

  it('should round correctly with decimals provided in an array', function () {
    assert.deepStrictEqual(fix(1.234567, [0, 1, 2, 3, 4]), [1, 1.2, 1.23, 1.234, 1.2345])
    assert.deepStrictEqual(fix(bignumber(math.pi), [0, 1, 2, 3, 4]), bignumber([3, 3.1, 3.14, 3.141, 3.1415]))
    assert.deepStrictEqual(fix(complex(1.335, 2.835), [1, 2]), [complex(1.3, 2.8), complex(1.33, 2.83)])
  })

  it('should round correctly with decimals provided in a matrix', function () {
    assert.deepStrictEqual(fix(1.234567, matrix([0, 1, 2, 3, 4])), matrix([1, 1.2, 1.23, 1.234, 1.2345]))
    assert.deepStrictEqual(fix(0, matrix([0, 2, 4])), matrix([0, 0, 0]))
    assert.deepStrictEqual(fix(bignumber(math.pi), sparse([0, 1, 2, 3, 4])), matrix(bignumber([[3], [3.1], [3.14], [3.141], [3.1415]])))
    assert.deepStrictEqual(fix(complex(1.335, 2.835), matrix([1, 2])), matrix([complex(1.3, 2.8), complex(1.33, 2.83)]))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { fix() }, /TypeError: Too few arguments/)
    assert.throws(function () { fix(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { fix(null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { fix(1, null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX fix', function () {
    const expression = math.parse('fix(0.6)')
    assert.strictEqual(expression.toTex(), '\\mathrm{fix}\\left(0.6\\right)')
  })
})
