// test format
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('format', function () {
  it('should format numbers', function () {
    assert.strictEqual(math.format(2 / 7), '0.2857142857142857')
    assert.strictEqual(math.format(0.10400), '0.104')
    assert.strictEqual(math.format(2.3), '2.3')
    assert.strictEqual(math.format(2.3e6), '2.3e+6')
  })

  it('should format strings', function () {
    assert.strictEqual(math.format('hello'), '"hello"')
  })

  it('should format arrays', function () {
    assert.strictEqual(math.format([[1, 2], [3, 4]]), '[[1, 2], [3, 4]]')
    const array = [[math.unit(2 / 3, 'm'), 2 / 7], ['hi', math.complex(2, 1 / 3)]]
    assert.strictEqual(math.format(array, 5), '[[0.66667 m, 0.28571], ["hi", 2 + 0.33333i]]')
  })

  it('should format complex values', function () {
    assert.strictEqual(math.format(math.divide(math.complex(2, 5), 3)), '0.6666666666666666 + 1.6666666666666667i')
    assert.strictEqual(math.format(math.divide(math.complex(2, 5), 3), 5), '0.66667 + 1.6667i')
    assert.strictEqual(math.format(math.divide(math.complex(2, 5), 3), { notation: 'fixed', precision: 1 }), '0.7 + 1.7i')
    assert.strictEqual(math.format(math.divide(math.complex(6, 9), 3), { notation: 'fixed' }), '2 + 3i')

    assert.strictEqual(math.format(math.complex(NaN, NaN)), 'NaN + NaNi')
    assert.strictEqual(math.format(math.complex(Infinity, Infinity)), 'Infinity + Infinityi')
    assert.strictEqual(math.format(math.complex(Infinity, -Infinity)), 'Infinity - Infinityi')
  })

  describe('precision', function () {
    it('should format numbers with given precision', function () {
      assert.strictEqual(math.format(1 / 3), '0.3333333333333333')
      assert.strictEqual(math.format(1 / 3, 3), '0.333')
      assert.strictEqual(math.format(1 / 3, 4), '0.3333')
      assert.strictEqual(math.format(1 / 3, 5), '0.33333')
      assert.strictEqual(math.format(math.complex(1 / 3, 2), 3), '0.333 + 2i')
    })

    it('should format complex numbers with given precision', function () {
      assert.strictEqual(math.format(math.complex(1 / 3, 1 / 3), 3), '0.333 + 0.333i')
      assert.strictEqual(math.format(math.complex(1 / 3, 1 / 3), 4), '0.3333 + 0.3333i')
    })

    it('should format matrices with given precision', function () {
      assert.strictEqual(math.format([1 / 3, 1 / 3], 3), '[0.333, 0.333]')
      assert.strictEqual(math.format([1 / 3, 1 / 3], 4), '[0.3333, 0.3333]')
      assert.strictEqual(math.format(math.matrix([1 / 3, 1 / 3]), 4), '[0.3333, 0.3333]')
    })

    it('should format units with given precision', function () {
      assert.strictEqual(math.format(math.unit(2 / 3, 'm'), 3), '0.667 m')
      assert.strictEqual(math.format(math.unit(2 / 3, 'm'), 4), '0.6667 m')
    })

    it('should format ranges with given precision', function () {
      assert.strictEqual(math.format(new math.Range(1 / 3, 4 / 3, 2 / 3), 3), '0.333:0.667:1.33')
    })
  })

  describe('engineering notation', function () {
    it('should format positive single digit to engineering notation', function () {
      assert.strictEqual(math.format(3, { notation: 'engineering' }), '3e+0')
    })
    it('should format positive two digits to engineering notation', function () {
      assert.strictEqual(math.format(30, { notation: 'engineering' }), '30e+0')
    })
    it('should format positive three digits to engineering notation', function () {
      assert.strictEqual(math.format(300, { notation: 'engineering' }), '300e+0')
      assert.strictEqual(math.format(320, { notation: 'engineering' }), '320e+0')
    })
    it('should format positive four digits to engineering notation', function () {
      assert.strictEqual(math.format(3000, { notation: 'engineering' }), '3e+3')
    })
    it('should format positive uneven four digits to engineering notation', function () {
      assert.strictEqual(math.format(3001, { notation: 'engineering' }), '3.001e+3')
    })
    it('should format a number without trailing zeros to engineering notation', function () {
      assert.strictEqual(math.format(3010, { notation: 'engineering' }), '3.01e+3')
      assert.strictEqual(math.format(452550000, { notation: 'engineering' }), '452.55e+6')
    })
    it('should format positive uneven ten digits to engineering notation', function () {
      assert.strictEqual(math.format(3741293481, { notation: 'engineering' }), '3.741293481e+9')
    })
    it('should format negative uneven ten digits to engineering notation', function () {
      assert.strictEqual(math.format(-3741293481, { notation: 'engineering' }), '-3.741293481e+9')
    })
    it('should format positive single digit floating point numbers to engineering notation', function () {
      assert.strictEqual(math.format(0.1, { notation: 'engineering' }), '100e-3')
    })
    it('should format positive two digit floating point numbers to engineering notation', function () {
      assert.strictEqual(math.format(0.01, { notation: 'engineering' }), '10e-3')
      assert.strictEqual(math.format(0.011, { notation: 'engineering' }), '11e-3')
      assert.strictEqual(math.format(0.0111, { notation: 'engineering' }), '11.1e-3')
    })
    it('should format positive three digit floating point numbers to engineering notation', function () {
      assert.strictEqual(math.format(0.003, { notation: 'engineering' }), '3e-3')
    })
    it('should format positive repeating three digit floating point numbers to engineering notation with precision', function () {
      assert.strictEqual(math.format(1 / 3, { precision: 3, notation: 'engineering' }), '333e-3')
    })
    it('should format positive seven digit floating point numbers to engineering notation', function () {
      assert.strictEqual(math.format(0.1234567, { notation: 'engineering' }), '123.4567e-3')
    })
    it('should format negative single digit floating point numbers to engineering notation', function () {
      assert.strictEqual(math.format(-0.1, { notation: 'engineering' }), '-100e-3')
      assert.strictEqual(math.format(-0.11, { notation: 'engineering' }), '-110e-3')
    })
    it('should format positive floating point number to engineering notation', function () {
      assert.strictEqual(math.format(13308.0333333333, { precision: 11, notation: 'engineering' }), '13.308033333e+3')
    })
    it('should add or remove zeroes if necessary to output precision sig figs', function () {
      assert.strictEqual(math.format(12400, { notation: 'engineering', precision: 2 }), '12e+3')
      assert.strictEqual(math.format(12400, { notation: 'engineering', precision: 3 }), '12.4e+3')
      assert.strictEqual(math.format(124000, { notation: 'engineering', precision: 3 }), '124e+3')
      assert.strictEqual(math.format(124000, { notation: 'engineering', precision: 4 }), '124.0e+3')
      assert.strictEqual(math.format(12400, { notation: 'engineering', precision: 7 }), '12.40000e+3')
      assert.strictEqual(math.format(12400, { notation: 'engineering', precision: 8 }), '12.400000e+3')
      assert.strictEqual(math.format(12400, { notation: 'engineering', precision: 9 }), '12.4000000e+3')
      assert.strictEqual(math.format(-12400, { notation: 'engineering', precision: 7 }), '-12.40000e+3')
      assert.strictEqual(math.format(0.0124, { notation: 'engineering', precision: 7 }), '12.40000e-3')
      assert.strictEqual(math.format(0.00124, { notation: 'engineering', precision: 7 }), '1.240000e-3')
      assert.strictEqual(math.format(0.000124, { notation: 'engineering', precision: 7 }), '124.0000e-6')
      assert.strictEqual(math.format(0.000124, { notation: 'engineering', precision: 4 }), '124.0e-6')
      assert.strictEqual(math.format(0.000124, { notation: 'engineering', precision: 3 }), '124e-6')
      assert.strictEqual(math.format(1.24, { notation: 'engineering', precision: 3 }), '1.24e+0')

      // less significant figures than precision, need to add zeros
      assert.strictEqual(math.format(-1e12, { notation: 'engineering', precision: 3 }), '-1.00e+12')
      assert.strictEqual(math.format(-1e11, { notation: 'engineering', precision: 3 }), '-100e+9')
      assert.strictEqual(math.format(-1e10, { notation: 'engineering', precision: 3 }), '-10.0e+9')
      assert.strictEqual(math.format(-1e9, { notation: 'engineering', precision: 3 }), '-1.00e+9')
      assert.strictEqual(math.format(1e12, { notation: 'engineering', precision: 3 }), '1.00e+12')
      assert.strictEqual(math.format(1e11, { notation: 'engineering', precision: 3 }), '100e+9')
      assert.strictEqual(math.format(1e10, { notation: 'engineering', precision: 3 }), '10.0e+9')
      assert.strictEqual(math.format(1e9, { notation: 'engineering', precision: 3 }), '1.00e+9')
      assert.strictEqual(math.format(1e12, { notation: 'engineering', precision: 2 }), '1.0e+12')
      assert.strictEqual(math.format(1e11, { notation: 'engineering', precision: 2 }), '100e+9')
      assert.strictEqual(math.format(1e10, { notation: 'engineering', precision: 2 }), '10e+9')
      assert.strictEqual(math.format(1e9, { notation: 'engineering', precision: 2 }), '1.0e+9')
      assert.strictEqual(math.format(1e12, { notation: 'engineering', precision: 1 }), '1e+12')
      assert.strictEqual(math.format(1e11, { notation: 'engineering', precision: 1 }), '100e+9')
      assert.strictEqual(math.format(1e10, { notation: 'engineering', precision: 1 }), '10e+9')
      assert.strictEqual(math.format(1e9, { notation: 'engineering', precision: 1 }), '1e+9')
      assert.strictEqual(math.format(10e3, { notation: 'engineering', precision: 2 }), '10e+3')
      assert.strictEqual(math.format(10e3, { notation: 'engineering', precision: 1 }), '10e+3')
      assert.strictEqual(math.format(100e3, { notation: 'engineering', precision: 2 }), '100e+3')
      assert.strictEqual(math.format(100e3, { notation: 'engineering', precision: 1 }), '100e+3')
      assert.strictEqual(math.format(100, { notation: 'engineering', precision: 2 }), '100e+0')
      assert.strictEqual(math.format(10, { notation: 'engineering', precision: 2 }), '10e+0')
      assert.strictEqual(math.format(10, { notation: 'engineering', precision: 1 }), '10e+0')
      assert.strictEqual(math.format(1, { notation: 'engineering', precision: 2 }), '1.0e+0')
      assert.strictEqual(math.format(10e-3, { notation: 'engineering', precision: 2 }), '10e-3')
      assert.strictEqual(math.format(100e-3, { notation: 'engineering', precision: 2 }), '100e-3')
      assert.strictEqual(math.format(100e-3, { notation: 'engineering', precision: 1 }), '100e-3')
      assert.strictEqual(math.format(1e-3, { notation: 'engineering', precision: 1 }), '1e-3')
      assert.strictEqual(math.format(1e-4, { notation: 'engineering', precision: 1 }), '100e-6')
      assert.strictEqual(math.format(1e-5, { notation: 'engineering', precision: 1 }), '10e-6')
      assert.strictEqual(math.format(1e-6, { notation: 'engineering', precision: 1 }), '1e-6')
      assert.strictEqual(math.format(1e-3, { notation: 'engineering', precision: 3 }), '1.00e-3')
      assert.strictEqual(math.format(1e-4, { notation: 'engineering', precision: 3 }), '100e-6')
      assert.strictEqual(math.format(1e-5, { notation: 'engineering', precision: 3 }), '10.0e-6')
      assert.strictEqual(math.format(1e-6, { notation: 'engineering', precision: 3 }), '1.00e-6')
      assert.strictEqual(math.format(-1e-3, { notation: 'engineering', precision: 3 }), '-1.00e-3')
      assert.strictEqual(math.format(-1e-4, { notation: 'engineering', precision: 3 }), '-100e-6')
      assert.strictEqual(math.format(-1e-5, { notation: 'engineering', precision: 3 }), '-10.0e-6')
      assert.strictEqual(math.format(-1e-6, { notation: 'engineering', precision: 3 }), '-1.00e-6')
    })
  })

  describe('non decimal base formatting', function () {
    it('should format in binary, octal, and hexadecimal', function () {
      assert.strictEqual(math.format(128, { notation: 'bin' }), '0b10000000')
      assert.strictEqual(math.format(128, { notation: 'oct' }), '0o200')
      assert.strictEqual(math.format(128, { notation: 'hex' }), '0x80')
      assert.strictEqual(math.format(-128, { notation: 'hex' }), '-0x80')
      assert.strictEqual(math.format(-128, { notation: 'hex', wordSize: 8 }), '0x80i8')
      assert.strictEqual(math.format(127, { notation: 'hex', wordSize: 8 }), '0x7fi8')
      assert.strictEqual(math.format(-1, { notation: 'hex', wordSize: 8 }), '0xffi8')
      assert.strictEqual(math.format(1.25, { notation: 'bin' }), '0b1.01')
      assert.strictEqual(math.format(1.25, { notation: 'oct' }), '0o1.2')
      assert.strictEqual(math.format(1.25, { notation: 'hex' }), '0x1.4')
      assert.strictEqual(math.bin(-128), '-0b10000000')
      assert.strictEqual(math.bin(-128, 8), '0b10000000i8')
      assert.strictEqual(math.oct(-128), '-0o200')
      assert.strictEqual(math.oct(-128, 8), '0o200i8')
      assert.strictEqual(math.hex(-128), '-0x80')
      assert.strictEqual(math.hex(-128, 8), '0x80i8')
    })
    it('should throw an error for invalid values', function () {
      assert.throws(function () { math.format(1.25, { notation: 'hex', wordSize: 8 }) }, 'Error: Value must be an integer')
      assert.throws(function () { math.format(1, { notation: 'hex', wordSize: -8 }) }, 'Error: size must be greater than 0')
      assert.throws(function () { math.format(1, { notation: 'hex', wordSize: 8.5 }) }, 'Error: size must be an integer')
    })
  })

  describe('bignumber', function () {
    const bigmath = math.create({ precision: 20 }) // ensure the precision is 20 digits

    it('should format big numbers', function () {
      assert.strictEqual(math.format(bigmath.bignumber(2).dividedBy(7)), '0.28571428571428571429')
      assert.strictEqual(math.format(bigmath.bignumber(0.10400)), '0.104')
      assert.strictEqual(math.format(bigmath.bignumber(2.3)), '2.3')
      assert.strictEqual(math.format(bigmath.bignumber(2.3e6)), '2.3e+6')
    })

    it('should format big numbers with given precision', function () {
      const oneThird = bigmath.bignumber(1).div(3)
      assert.strictEqual(bigmath.format(oneThird), '0.33333333333333333333') // 20 digits
      assert.strictEqual(bigmath.format(oneThird, 3), '0.333')
      assert.strictEqual(bigmath.format(oneThird, 4), '0.3333')
      assert.strictEqual(bigmath.format(oneThird, 5), '0.33333')
      assert.strictEqual(bigmath.format(oneThird, 18), '0.333333333333333333')
    })

    describe('engineering notation', function () {
      const bignumber = math.bignumber

      it('should format positive single digit to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(3), { notation: 'engineering' }), '3e+0')
      })
      it('should format positive two digits to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(30), { notation: 'engineering' }), '30e+0')
      })
      it('should format positive three digits to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(300), { notation: 'engineering' }), '300e+0')
        assert.strictEqual(math.format(bignumber(320), { notation: 'engineering' }), '320e+0')
      })
      it('should format positive four digits to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(3000), { notation: 'engineering' }), '3e+3')
      })
      it('should format positive uneven four digits to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(3001), { notation: 'engineering' }), '3.001e+3')
      })
      it('should format a number without trailing zeros to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(3010), { notation: 'engineering' }), '3.01e+3')
        assert.strictEqual(math.format(bignumber(452550000), { notation: 'engineering' }), '452.55e+6')
      })
      it('should format positive uneven ten digits to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(3741293481), { notation: 'engineering' }), '3.741293481e+9')
      })
      it('should format negative uneven ten digits to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(-3741293481), { notation: 'engineering' }), '-3.741293481e+9')
      })
      it('should format positive single digit floating point numbers to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(0.1), { notation: 'engineering' }), '100e-3')
        assert.strictEqual(math.format(bignumber(0.11), { notation: 'engineering' }), '110e-3')
      })
      it('should format positive two digit floating point numbers to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(0.01), { notation: 'engineering' }), '10e-3')
        assert.strictEqual(math.format(bignumber(0.011), { notation: 'engineering' }), '11e-3')
        assert.strictEqual(math.format(bignumber(0.0111), { notation: 'engineering' }), '11.1e-3')
      })
      it('should format positive three digit floating point numbers to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(0.003), { notation: 'engineering' }), '3e-3')
      })
      it('should format positive repeating three digit floating point numbers to engineering notation with precision', function () {
        assert.strictEqual(math.format(bignumber(1).div(3), { precision: 3, notation: 'engineering' }), '333e-3')
      })
      it('should format positive seven digit floating point numbers to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(0.1234567), { notation: 'engineering' }), '123.4567e-3')
      })
      it('should format negative single digit floating point numbers to engineering notation', function () {
        assert.strictEqual(math.format(bignumber(-0.1), { notation: 'engineering' }), '-100e-3')
      })
      it('should format positive floating point number to engineering notation', function () {
        assert.strictEqual(math.format(bignumber('13308.0333333333'), { precision: 11, notation: 'engineering' }), '13.308033333e+3')
      })
      it('should add or remove zeroes if necessary to output precision sig figs', function () {
        assert.strictEqual(math.format(bignumber(12400), { notation: 'engineering', precision: 2 }), '12e+3')
        assert.strictEqual(math.format(bignumber(12400), { notation: 'engineering', precision: 3 }), '12.4e+3')
        assert.strictEqual(math.format(bignumber(124000), { notation: 'engineering', precision: 3 }), '124e+3')
        assert.strictEqual(math.format(bignumber(124000), { notation: 'engineering', precision: 4 }), '124.0e+3')
        assert.strictEqual(math.format(bignumber(12400), { notation: 'engineering', precision: 7 }), '12.40000e+3')
        assert.strictEqual(math.format(bignumber(12400), { notation: 'engineering', precision: 8 }), '12.400000e+3')
        assert.strictEqual(math.format(bignumber(12400), { notation: 'engineering', precision: 9 }), '12.4000000e+3')
        assert.strictEqual(math.format(bignumber(-12400), { notation: 'engineering', precision: 7 }), '-12.40000e+3')
        assert.strictEqual(math.format(bignumber(0.0124), { notation: 'engineering', precision: 7 }), '12.40000e-3')
        assert.strictEqual(math.format(bignumber(0.00124), { notation: 'engineering', precision: 7 }), '1.240000e-3')
        assert.strictEqual(math.format(bignumber(0.000124), { notation: 'engineering', precision: 7 }), '124.0000e-6')
        assert.strictEqual(math.format(bignumber(0.000124), { notation: 'engineering', precision: 4 }), '124.0e-6')
        assert.strictEqual(math.format(bignumber(0.000124), { notation: 'engineering', precision: 3 }), '124e-6')
        assert.strictEqual(math.format(bignumber(1.24), { notation: 'engineering', precision: 3 }), '1.24e+0')

        // less significant figures than precision, need to add zeros
        assert.strictEqual(math.format(bignumber(-1e12), { notation: 'engineering', precision: 3 }), '-1.00e+12')
        assert.strictEqual(math.format(bignumber(-1e11), { notation: 'engineering', precision: 3 }), '-100e+9')
        assert.strictEqual(math.format(bignumber(-1e10), { notation: 'engineering', precision: 3 }), '-10.0e+9')
        assert.strictEqual(math.format(bignumber(-1e9), { notation: 'engineering', precision: 3 }), '-1.00e+9')
        assert.strictEqual(math.format(bignumber(1e12), { notation: 'engineering', precision: 3 }), '1.00e+12')
        assert.strictEqual(math.format(bignumber(1e11), { notation: 'engineering', precision: 3 }), '100e+9')
        assert.strictEqual(math.format(bignumber(1e10), { notation: 'engineering', precision: 3 }), '10.0e+9')
        assert.strictEqual(math.format(bignumber(1e9), { notation: 'engineering', precision: 3 }), '1.00e+9')
        assert.strictEqual(math.format(bignumber(1e12), { notation: 'engineering', precision: 2 }), '1.0e+12')
        assert.strictEqual(math.format(bignumber(1e11), { notation: 'engineering', precision: 2 }), '100e+9')
        assert.strictEqual(math.format(bignumber(1e10), { notation: 'engineering', precision: 2 }), '10e+9')
        assert.strictEqual(math.format(bignumber(1e9), { notation: 'engineering', precision: 2 }), '1.0e+9')
        assert.strictEqual(math.format(bignumber(1e12), { notation: 'engineering', precision: 1 }), '1e+12')
        assert.strictEqual(math.format(bignumber(1e11), { notation: 'engineering', precision: 1 }), '100e+9')
        assert.strictEqual(math.format(bignumber(1e10), { notation: 'engineering', precision: 1 }), '10e+9')
        assert.strictEqual(math.format(bignumber(1e9), { notation: 'engineering', precision: 1 }), '1e+9')
        assert.strictEqual(math.format(bignumber(10e3), { notation: 'engineering', precision: 2 }), '10e+3')
        assert.strictEqual(math.format(bignumber(10e3), { notation: 'engineering', precision: 1 }), '10e+3')
        assert.strictEqual(math.format(bignumber(100e3), { notation: 'engineering', precision: 2 }), '100e+3')
        assert.strictEqual(math.format(bignumber(100e3), { notation: 'engineering', precision: 1 }), '100e+3')
        assert.strictEqual(math.format(bignumber(100), { notation: 'engineering', precision: 2 }), '100e+0')
        assert.strictEqual(math.format(bignumber(10), { notation: 'engineering', precision: 2 }), '10e+0')
        assert.strictEqual(math.format(bignumber(10), { notation: 'engineering', precision: 1 }), '10e+0')
        assert.strictEqual(math.format(bignumber(1), { notation: 'engineering', precision: 2 }), '1.0e+0')
        assert.strictEqual(math.format(bignumber(10e-3), { notation: 'engineering', precision: 2 }), '10e-3')
        assert.strictEqual(math.format(bignumber(100e-3), { notation: 'engineering', precision: 2 }), '100e-3')
        assert.strictEqual(math.format(bignumber(100e-3), { notation: 'engineering', precision: 1 }), '100e-3')
        assert.strictEqual(math.format(bignumber(1e-3), { notation: 'engineering', precision: 1 }), '1e-3')
        assert.strictEqual(math.format(bignumber(1e-4), { notation: 'engineering', precision: 1 }), '100e-6')
        assert.strictEqual(math.format(bignumber(1e-5), { notation: 'engineering', precision: 1 }), '10e-6')
        assert.strictEqual(math.format(bignumber(1e-6), { notation: 'engineering', precision: 1 }), '1e-6')
        assert.strictEqual(math.format(bignumber(1e-3), { notation: 'engineering', precision: 3 }), '1.00e-3')
        assert.strictEqual(math.format(bignumber(1e-4), { notation: 'engineering', precision: 3 }), '100e-6')
        assert.strictEqual(math.format(bignumber(1e-5), { notation: 'engineering', precision: 3 }), '10.0e-6')
        assert.strictEqual(math.format(bignumber(1e-6), { notation: 'engineering', precision: 3 }), '1.00e-6')
        assert.strictEqual(math.format(bignumber(-1e-3), { notation: 'engineering', precision: 3 }), '-1.00e-3')
        assert.strictEqual(math.format(bignumber(-1e-4), { notation: 'engineering', precision: 3 }), '-100e-6')
        assert.strictEqual(math.format(bignumber(-1e-5), { notation: 'engineering', precision: 3 }), '-10.0e-6')
        assert.strictEqual(math.format(bignumber(-1e-6), { notation: 'engineering', precision: 3 }), '-1.00e-6')
        assert.strictEqual(math.format(bignumber('12345600000000'), { notation: 'engineering', precision: 3 }), '12.3e+12')
        assert.strictEqual(math.format(bignumber('12345600000000'), { notation: 'engineering', precision: 16 }), '12.34560000000000e+12')
        assert.strictEqual(math.format(bignumber('12345678901234.56789'), { notation: 'engineering', precision: 3 }), '12.3e+12')
        assert.strictEqual(math.format(bignumber('12345678901234.56789'), { notation: 'engineering', precision: 16 }), '12.34567890123457e+12')
        assert.strictEqual(math.format(bignumber('0.000000000000123456'), { notation: 'engineering', precision: 3 }), '123e-15')
        assert.strictEqual(math.format(bignumber('0.000000000000123456'), { notation: 'engineering', precision: 16 }), '123.4560000000000e-15')
        assert.strictEqual(math.format(bignumber('0.0000000000001234567890123456789'), { notation: 'engineering', precision: 3 }), '123e-15')
        assert.strictEqual(math.format(bignumber('0.0000000000001234567890123456789'), { notation: 'engineering', precision: 16 }), '123.4567890123457e-15')
      })
    })

    describe('non decimal base formatting', function () {
      it('should format in binary, octal, and hexadecimal', function () {
        assert.strictEqual(math.format(math.bignumber(128), { notation: 'bin' }), '0b10000000')
        assert.strictEqual(math.format(math.bignumber(128), { notation: 'oct' }), '0o200')
        assert.strictEqual(math.format(math.bignumber(128), { notation: 'hex' }), '0x80')
        assert.strictEqual(math.format(math.bignumber(-128), { notation: 'hex' }), '-0x80')
        assert.strictEqual(math.format(math.bignumber(-128), { notation: 'hex', wordSize: 8 }), '0x80i8')
        assert.strictEqual(math.format(math.bignumber(127), { notation: 'hex', wordSize: 8 }), '0x7fi8')
        assert.strictEqual(math.format(math.bignumber(1.25), { notation: 'bin' }), '0b1.01')
        assert.strictEqual(math.format(math.bignumber(1.25), { notation: 'oct' }), '0o1.2')
        assert.strictEqual(math.format(math.bignumber(1.25), { notation: 'hex' }), '0x1.4')
      })
      it('should throw an error for invalid values', function () {
        assert.throws(function () { math.format(math.bignumber(1.25), { notation: 'hex', wordSize: 8 }) }, 'Error: Value must be an integer')
        assert.throws(function () { math.format(math.bignumber(1), { notation: 'hex', wordSize: -8 }) }, 'Error: size must be greater than 0')
        assert.throws(function () { math.format(math.bignumber(1), { notation: 'hex', wordSize: 8.5 }) }, 'Error: size must be an integer')
      })
    })
  })

  it('should format expressions', () => {
    assert.strictEqual(math.format(math.parse('0.3333'), { precision: 1 }), '0.3')
    assert.strictEqual(math.format(math.parse('0.3333 + [0.4444]'), { precision: 1 }), '0.3 + [0.4]')

    const bigmath = math.create({ number: 'BigNumber' })
    assert.strictEqual(bigmath.format(bigmath.parse('0.3333 + [0.4444]'), { precision: 1 }), '0.3 + [0.4]')
  })

  it('should throw an error on wrong number of arguments', function () {
    assert.throws(function () { math.format() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.format(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX format', function () {
    const expression = math.parse('format(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{format}\\left(1\\right)')
  })
})
