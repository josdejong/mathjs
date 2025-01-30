// test floor
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const fraction = math.fraction
const matrix = math.matrix
const unit = math.unit
const floor = math.floor
const i = math.i
const sparse = math.sparse

describe('floor', function () {
  it('should floor booleans correctly', function () {
    assert.strictEqual(floor(true), 1)
    assert.strictEqual(floor(false), 0)
  })

  it('should floor numbers correctly', function () {
    assert.strictEqual(floor(0), 0)
    assert.strictEqual(floor(1), 1)
    assert.strictEqual(floor(1.3), 1)
    assert.strictEqual(floor(1.8), 1)
    assert.strictEqual(floor(2), 2)
    assert.strictEqual(floor(-1), -1)
    assert.strictEqual(floor(-1.3), -2)
    assert.strictEqual(floor(-1.8), -2)
    assert.strictEqual(floor(-2), -2)
    assert.strictEqual(floor(-2.1), -3)
    assert.strictEqual(floor(math.pi), 3)
  })

  it('should return the floor of a number with a given number of decimals', function () {
    assert.strictEqual(floor(0, 5), 0)
    assert.strictEqual(floor(2, 3), 2)
    assert.strictEqual(floor(1.3216, 2), 1.32)
    assert.strictEqual(floor(math.pi, 3), 3.141)
    assert.strictEqual(floor(math.pi, 6), 3.141592)
    assert.strictEqual(floor(1234.5678, 2), 1234.56)
    assert.strictEqual(floor(2.135, 2), 2.13)
    assert.deepStrictEqual(floor(2.135, bignumber(2)), bignumber(2.13))
    assert.strictEqual(floor(-1.8, 0), -2)
    assert.strictEqual(floor(-1.8, 1), -1.8)
    assert.strictEqual(floor(-2.178, 2), -2.18)
  })

  it('should be safe to call with a bigint', function () {
    const b = 12345678901234567890n
    assert.strictEqual(floor(b), b)
    assert.strictEqual(floor(b, 7), b)
  })

  it('should floor big numbers correctly', function () {
    assert.deepStrictEqual(floor(bignumber(0)), bignumber(0))
    assert.deepStrictEqual(floor(bignumber(1)), bignumber(1))
    assert.deepStrictEqual(floor(bignumber(1.3)), bignumber(1))
    assert.deepStrictEqual(floor(bignumber(1.8)), bignumber(1))
    assert.deepStrictEqual(floor(bignumber(2)), bignumber(2))
    assert.deepStrictEqual(floor(bignumber(-1)), bignumber(-1))
    assert.deepStrictEqual(floor(bignumber(-1.3)), bignumber(-2))
    assert.deepStrictEqual(floor(bignumber(-1.8)), bignumber(-2))
    assert.deepStrictEqual(floor(bignumber(-2)), bignumber(-2))
    assert.deepStrictEqual(floor(bignumber(-2.1)), bignumber(-3))
  })

  it('should return the floor of a big number with a given number of decimals', function () {
    assert.deepStrictEqual(floor(bignumber(0), 3), bignumber(0))
    assert.deepStrictEqual(floor(bignumber(1), 3), bignumber(1))
    assert.deepStrictEqual(floor(bignumber(1.315), 2), bignumber(1.31))
    assert.deepStrictEqual(floor(bignumber(1.8), 1), bignumber(1.8))
    assert.deepStrictEqual(floor(bignumber(2.135), bignumber(2)), bignumber(2.13))
    assert.deepStrictEqual(floor(bignumber(-1), 4), bignumber(-1))
    assert.deepStrictEqual(floor(bignumber(-1.3), 4), bignumber(-1.3))
    assert.deepStrictEqual(floor(bignumber(-1.8), 0), bignumber(-2))
    assert.deepStrictEqual(floor(bignumber(-1.315), 2), bignumber(-1.32))
    assert.deepStrictEqual(floor(bignumber(-2), 0), bignumber(-2))
    assert.deepStrictEqual(floor(bignumber(-2.1), 0), bignumber(-3))
  })

  it('should floor complex numbers correctly', function () {
    assert.deepStrictEqual(floor(complex(0, 0)), complex(0, 0))
    assert.deepStrictEqual(floor(complex(1.3, 1.8)), complex(1, 1))
    assert.deepStrictEqual(floor(i), complex(0, 1))
    assert.deepStrictEqual(floor(complex(-1.3, -1.8)), complex(-2, -2))
  })

  it('should return the floor of real and imag part of a complex with a given number of decimals', function () {
    assert.deepStrictEqual(floor(complex(0, 0), 3), complex(0, 0))
    assert.deepStrictEqual(floor(complex(1.3, 1.8), 0), complex(1, 1))
    assert.deepStrictEqual(floor(complex(1.3, 1.8), 1), complex(1.3, 1.8))
    assert.deepStrictEqual(floor(complex(1.315, 1.878), 2), complex(1.31, 1.87))
    assert.deepStrictEqual(floor(complex(1.315, 1.878), bignumber(2)), complex(1.31, 1.87))
    assert.deepStrictEqual(floor(i, 0), complex(0, 1))
    assert.deepStrictEqual(floor(i, 4), complex(0, 1))
    assert.deepStrictEqual(floor(complex(-1.3, -1.8), 0), complex(-2, -2))
    assert.deepStrictEqual(floor(complex(-1.3, -1.8), 1), complex(-1.3, -1.8))
    assert.deepStrictEqual(floor(complex(-1.315, -1.878), 2), complex(-1.32, -1.88))
  })

  it('should floor fractions correctly', function () {
    const a = fraction('2/3')
    assert(floor(a) instanceof math.Fraction)
    assert.strictEqual(a.toString(), '0.(6)')

    assert.strictEqual(floor(fraction(0)).toString(), '0')
    assert.strictEqual(floor(fraction(1)).toString(), '1')
    assert.strictEqual(floor(fraction(1.3)).toString(), '1')
    assert.strictEqual(floor(fraction(1.8)).toString(), '1')
    assert.strictEqual(floor(fraction(2)).toString(), '2')
    assert.strictEqual(floor(fraction(-1)).toString(), '-1')
    assert.strictEqual(floor(fraction(-1.3)).toString(), '-2')
    assert.strictEqual(floor(fraction(-1.8)).toString(), '-2')
    assert.strictEqual(floor(fraction(-2)).toString(), '-2')
    assert.strictEqual(floor(fraction(-2.1)).toString(), '-3')
  })

  it('should return the floor of a fraction with a given number of decimals', function () {
    assert.strictEqual(floor(fraction(0), 0).toString(), '0')
    assert.strictEqual(floor(fraction(0), 3).toString(), '0')
    assert.strictEqual(floor(fraction(1), 4).toString(), '1')
    assert.strictEqual(floor(fraction(1.315), 2).toString(), '1.31')
    assert.strictEqual(floor(fraction(1.315), bignumber(2)).toString(), '1.31')
    assert.deepStrictEqual(floor(fraction(44, 7), bignumber(2)), fraction(628, 100))
    assert.strictEqual(floor(fraction(-1), 0).toString(), '-1')
    assert.strictEqual(floor(fraction(-1.315), 2).toString(), '-1.32')
  })

  it('should gracefully handle round-off errors', function () {
    assert.strictEqual(floor(3.0000000000000004), 3)
    assert.strictEqual(floor(7.999999999999999), 8)
    assert.strictEqual(floor(-3.0000000000000004), -3)
    assert.strictEqual(floor(-7.999999999999999), -8)
    assert.strictEqual(floor(30000.000000000004), 30000)
    assert.strictEqual(floor(799999.9999999999), 800000)
    assert.strictEqual(floor(799999999.9999999), 800000000)
    assert.strictEqual(floor(-30000.000000000004), -30000)

    assert.strictEqual(floor(3.0000000000000004, 2), 3)
    assert.strictEqual(floor(7.999999999999999, 2), 8)
    assert.strictEqual(floor(-3.0000000000000004, 2), -3)
    assert.strictEqual(floor(-7.999999999999999, 2), -8)
    assert.strictEqual(floor(30000.000000000004, 2), 30000)
    assert.strictEqual(floor(799999.9999999999, 2), 800000)
    assert.strictEqual(floor(799999.9999999999, 3), 800000)
    assert.strictEqual(floor(-30000.000000000004, 2), -30000)
  })

  it('should not be confused by default tolerances', function () {
    assert.strictEqual(floor(1234567890123.5), 1234567890123)
    assert.strictEqual(
      floor(bignumber('12345678901234567890.5')).toFixed(),
      '12345678901234567890')
  })

  it('should gracefully handle round-off errors with bignumbers', function () {
    assert.deepStrictEqual(floor(bignumber(3.0000000000000004)), bignumber(3))
    assert.deepStrictEqual(floor(bignumber(7.999999999999999)), bignumber(8))
    assert.deepStrictEqual(floor(bignumber(-3.0000000000000004)), bignumber(-3))
    assert.deepStrictEqual(floor(bignumber(-7.999999999999999)), bignumber(-8))
    assert.deepStrictEqual(floor(bignumber(30000.000000000004)), bignumber(30000))
    assert.deepStrictEqual(floor(bignumber(799999.9999999999)), bignumber(800000))
    assert.deepStrictEqual(floor(bignumber(-30000.000000000004)), bignumber(-30000))
  })

  it('should floor units', function () {
    assert.deepStrictEqual(floor(unit('5.99 inch'), unit('inch')), unit('5 inch'))
    assert.deepStrictEqual(floor(unit('3.12345 cm'), 3, unit('cm')), unit('3.123 cm'))
    assert.deepStrictEqual(floor(unit('3.12345 cm'), unit('cm')), unit('3 cm'))
    assert.deepStrictEqual(floor(unit('2 inch'), unit('cm')), unit('5 cm'))
    assert.deepStrictEqual(floor(unit('2 inch'), 1, unit('cm')), unit('5 cm'))

    // bignumber values
    assert.deepStrictEqual(floor(unit('3.12345 cm'), bignumber(2), unit('cm')), unit('3.12 cm'))
    assert.deepStrictEqual(floor(unit(bignumber('2'), 'inch'), unit('cm')), unit(bignumber('5'), 'cm'))
    assert.deepStrictEqual(floor(unit(bignumber('2'), 'inch'), bignumber(1), unit('cm')), unit(bignumber('5.0'), 'cm'))

    // first argument is a collection
    assert.deepStrictEqual(floor([unit('2 inch'), unit('3 inch')], unit('cm')), [unit('5 cm'), unit('7 cm')])
    assert.deepStrictEqual(floor(matrix([unit('2 inch'), unit('3 inch')]), unit('cm')), matrix([unit('5 cm'), unit('7 cm')]))
  })

  it('should throw an error if used with a unit without valueless unit', function () {
    assert.throws(function () { floor(unit('5cm')) }, TypeError, 'Function floor(unit) not supported')
    assert.throws(function () { floor(unit('5cm'), 2) }, TypeError, 'Function floor(unit) not supported')
    assert.throws(function () { floor(unit('5cm'), bignumber(2)) }, TypeError, 'Function floor(unit) not supported')
  })

  it('should throw an error if used with a unit with a second unit that is not valueless', function () {
    assert.throws(function () { floor(unit('2 inch'), 1, unit('10 cm')) }, Error)
    assert.throws(function () { floor(unit('2 inch'), unit('10 cm')) }, Error)
  })

  it('should throw an error with a unit', function () {
    assert.throws(function () { floor(unit('5cm')) }, TypeError, 'Function floor(unit) not supported')
  })

  it('should convert a string to a number', function () {
    assert.strictEqual(floor('1.8'), 1)
    assert.strictEqual(floor('1.812', '2'), 1.81)
    assert.strictEqual(floor('1.812', 2).toString(), '1.81')
    assert.strictEqual(floor(1.812, '2').toString(), '1.81')
  })

  it('should floor all elements in a matrix', function () {
    assert.deepStrictEqual(floor([1.2, 3.4, 5.6, 7.8, 10.0]), [1, 3, 5, 7, 10])
    assert.deepStrictEqual(floor(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([1, 3, 5, 7, 10]))
  })

  it('should floor each element in a matrix with a given number of decimals', function () {
    assert.deepStrictEqual(floor([1.282, 3.415, -5.121, -10.128], 2), [1.28, 3.41, -5.13, -10.13])
    assert.deepStrictEqual(floor([1.282, 3.415, -5.121, -10.128], bignumber(2)), [bignumber(1.28), bignumber(3.41), bignumber(-5.13), bignumber(-10.13)])
    assert.deepStrictEqual(floor(matrix([1.282, 3.415, -5.121, -10.128]), 2), matrix([1.28, 3.41, -5.13, -10.13]))
    assert.deepStrictEqual(floor(matrix([1.282, 3.415, -5.121, -10.128]), bignumber(2)), matrix([bignumber(1.28), bignumber(3.41), bignumber(-5.13), bignumber(-10.13)]))
  })

  it('should floor when number of decimals is provided in an array', function () {
    assert.deepStrictEqual(floor(3.12385, [2, 3]), [3.12, 3.123])
    assert.deepStrictEqual(floor(bignumber(3.12385), [2, 3]), bignumber([3.12, 3.123]))
    assert.deepStrictEqual(floor(complex(3.12385, -1.6789), [2, 3]), [complex(3.12, -1.68), complex(3.123, -1.679)])
    assert.deepStrictEqual(floor(fraction(44, 7), [2, 3]), [fraction(628, 100), fraction(6285, 1000)])
  })

  it('should floor when number of decimals is provided in a matrix', function () {
    assert.deepStrictEqual(floor(3.12385, matrix([2, 3])), matrix([3.12, 3.123]))
    assert.deepStrictEqual(floor(0, matrix([2, 3])), matrix([0, 0]))
    assert.deepStrictEqual(floor(bignumber(3.12385), sparse([2, 3])), bignumber(matrix([[3.12], [3.123]])))
    assert.deepStrictEqual(floor(complex(3.12385, -1.6789), matrix([2, 3])), matrix([complex(3.12, -1.68), complex(3.123, -1.679)]))
    assert.deepStrictEqual(floor(fraction(44, 7), sparse([2, 3])), matrix([[fraction(628, 100)], [fraction(6285, 1000)]]))
  })

  it('should floor dense matrix', function () {
    assert.deepStrictEqual(floor(matrix([[1.712, 2.345], [8.987, -3.565]]), 2), matrix([[1.71, 2.34], [8.98, -3.57]]))
  })

  it('should floor dense matrix and scalar', function () {
    assert.deepStrictEqual(floor(matrix([[1.7777, 2.3456], [-90.8272, 0]]), 3), matrix([[1.777, 2.345], [-90.828, 0]]))
  })

  it('should floor dense matrix with given bignumber decimals', function () {
    const expected = bignumber(matrix([[1.777, 2.345], [-90.828, 0]]))
    const decimals = bignumber(3)
    assert.deepStrictEqual(floor(matrix([[1.7777, 2.3456], [-90.8272, 0]]), decimals), expected)
  })

  it('should floor sparse matrix', function () {
    assert.deepStrictEqual(floor(sparse([[1.7, 0], [8.987, -3.565]]), 2), sparse([[1.7, 0], [8.98, -3.57]]))
  })

  it('should floor sparse matrix and scalar', function () {
    assert.deepStrictEqual(floor(sparse([[1.7777, 2.3456], [-90.8272, 0]]), 3), sparse([[1.777, 2.345], [-90.828, 0]]))
  })

  it('should floor sparse matrix with given bignumber decimals', function () {
    const expected = bignumber(sparse([[1.777, 2.345], [-90.828, 0]]))
    const decimals = bignumber(3)
    assert.deepStrictEqual(floor(sparse([[1.7777, 2.3456], [-90.8272, 0]]), decimals), expected)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { floor() }, /TypeError: Too few arguments/)
    assert.throws(function () { floor(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { floor(null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { floor(42, null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { floor([3.82, 3.15], [1, 2]) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error if requested number of decimals is incorrect', function () {
    assert.throws(function () { floor(2.5, 1.5) }, Error, 'Number of decimals in function floor must be an integer')
    assert.throws(function () { floor(2.5, -2) }, Error, ' Number of decimals in function floor must be in the range of 0-15')
    assert.throws(function () { floor(2.5, Infinity) }, Error, ' Number of decimals in function floor must be in the range of 0-15')
  })

  it('should LaTeX floor', function () {
    const expression = math.parse('floor(0.6)')
    assert.strictEqual(expression.toTex(), '\\left\\lfloor0.6\\right\\rfloor')
  })
})
