import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const range = math.range
const Range = math.Range
const bignumber = math.bignumber
const unit = math.unit
const evaluate = math.evaluate

describe('range', function () {
  it('should parse a valid string correctly', function () {
    assert.deepStrictEqual(range('1:6'), new Range(1, 6))
    assert.deepStrictEqual(range('0:2:10'), new Range(0, 10, 2))
    assert.deepStrictEqual(range('5:-1:0'), new Range(5, 0, -1))
    assert.deepStrictEqual(range('2:-2:-3'), new Range(2, -4, -2))
  })

  it('should throw an error in case of invalid string', function () {
    assert.throws(function () { range('1:2:6:4') }, SyntaxError)
    assert.throws(function () { range('1') }, SyntaxError)
    assert.throws(function () { range('1,3:4') }, /Error: Cannot convert/)
    assert.throws(function () { range('1:2,4') }, /Error: Cannot convert/)
    assert.throws(function () { range('1:a') }, /Error: Cannot convert/)
  })

  it('should create a range start:1:end if called with 2 numbers', function () {
    assert.deepStrictEqual(range(3, 6), new Range(3, 6))
    assert.deepStrictEqual(range(3, 6).valueOf(), [3, 4, 5])
    assert.deepStrictEqual(range(1, 6).valueOf(), [1, 2, 3, 4, 5])
    assert.deepStrictEqual(range(1, 6.1).valueOf(), [1, 2, 3, 4, 5, 6])
    assert.deepStrictEqual(range(1, 5.9).valueOf(), [1, 2, 3, 4, 5])
    assert.deepStrictEqual(range(6, 1).valueOf(), [])
  })

  it('should create a range start:step:end if called with 3 numbers', function () {
    assert.deepStrictEqual(range(0, 10, 2), new Range(0, 10, 2))
    assert.deepStrictEqual(range(0, 10, 2).valueOf(), [0, 2, 4, 6, 8])
    assert.deepStrictEqual(range(5, 0, -1).valueOf(), [5, 4, 3, 2, 1])
    assert.deepStrictEqual(range(2, -4, -2).valueOf(), [2, 0, -2])
  })

  it('should take care handling step==0', function () {
    assert.deepStrictEqual(range(0, 0, 0).valueOf(), [])
    assert.throws(function () { range(0, 10, 0) }, /No scalar/)
    assert.throws(function () { range(0, 10, 0, true) }, /No scalar/)
  })

  it('should create an empty range when start and stop are equal', function () {
    assert.deepStrictEqual(range(0, 0).valueOf(), [])
    assert.deepStrictEqual(range(1, 1, 2).valueOf(), [])
    assert.deepStrictEqual(range('0:0').valueOf(), [])
    assert.deepStrictEqual(range('0:1:0').valueOf(), [])
    assert.deepStrictEqual(range('1:2:1').valueOf(), [])
    assert.deepStrictEqual(range('1:1:1').valueOf(), [])
  })

  it('should create an array with the end value when start and stop are equal and includeEnd=true', function () {
    assert.deepStrictEqual(range(0, 0, true).valueOf(), [0])
    assert.deepStrictEqual(range(1, 1, 2, true).valueOf(), [1])
    assert.deepStrictEqual(range('0:0', true).valueOf(), [0])
    assert.deepStrictEqual(range('1:1:1', true).valueOf(), [1])
  })

  it('should accept an object of attributes', function () {
    const frac = math.fraction
    assert.deepStrictEqual(range({ start: 0, last: 3 }).valueOf(), [0, 1, 2, 3])
    assert.deepStrictEqual(
      range({ start: 0n, end: 8n, step: 2n }).valueOf(), [0n, 2n, 4n, 6n])
    assert.deepStrictEqual(
      range({ start: frac(1, 2), length: 3 }).valueOf(),
      [frac(1, 2), frac(3, 2), frac(5, 2)])
  })

  it('should output an array when setting matrix==="array"', function () {
    const math2 = math.create({
      matrix: 'Array'
    })

    assert.deepStrictEqual(math2.range(0, 10, 2), [0, 2, 4, 6, 8])
    assert.deepStrictEqual(math2.range(5, 0, -1), [5, 4, 3, 2, 1])
  })

  it('should create a range with bigints', function () {
    assert.deepStrictEqual(range(1n, 3n), new Range(1n, 3n))
    assert.deepStrictEqual(range(1n, 3n).valueOf(), [1n, 2n])
    assert.deepStrictEqual(range(3n, 1n, -1n).valueOf(), [3n, 2n])
    assert.deepStrictEqual(range(1n, 3n, true).valueOf(), [1n, 2n, 3n])
    assert.deepStrictEqual(range(3n, 1n, -1n, true).valueOf(), [3n, 2n, 1n])
  })

  it('should handle mixed numbers and bigints appropriately', function () {
    assert.deepStrictEqual(range(1n, 3), new Range(1n, 3n))
    assert.deepStrictEqual(range(1n, 3).valueOf(), [1n, 2n])
    assert.deepStrictEqual(range(3, 1n, -1n).valueOf(), [3, 2])
    assert.deepStrictEqual(range(3n, 1, -1).valueOf(), [3, 2])
    assert.deepStrictEqual(range(1, 3n, true).valueOf(), [1, 2, 3])
    assert.deepStrictEqual(range(3n, 1, -1n, true).valueOf(), [3n, 2n, 1n])
    assert.deepStrictEqual(range(3, 1n, -1, true).valueOf(), [3, 2, 1])
    assert.deepStrictEqual(range(1, 5, 2n).valueOf(), [1, 3])
    assert.deepStrictEqual(range(5, 1, -2n, true).valueOf(), [5, 3, 1])
  })

  it('should create a range with bignumbers', function () {
    const bigRange = range(bignumber(1), bignumber(3))
    assert.deepStrictEqual(bigRange, new Range(bignumber(1), bignumber(3)))
    assert.deepStrictEqual(bigRange.valueOf(), [bignumber(1), bignumber(2)])
    assert.deepStrictEqual(
      range(bignumber(3), bignumber(1), bignumber(-1)).valueOf(),
      [bignumber(3), bignumber(2)])
  })

  it('should throw an error from bignumbers when step==0', function () {
    assert.throws(function () { range(bignumber(0), bignumber(10), bignumber(0)) }, /No scalar/)
    assert.throws(function () { range(bignumber(0), bignumber(10), bignumber(0), true) }, /No scalar/)
  })

  it('should create a range with mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(
      range(bignumber(1), 3).valueOf(), [bignumber(1), bignumber(2)])
    assert.deepStrictEqual(range(1, bignumber(3)).valueOf(), [1, 2])

    assert.deepStrictEqual(
      range(1, bignumber(3), bignumber(1)).valueOf(),
      [bignumber(1), bignumber(2)])
    assert.deepStrictEqual(
      range(bignumber(1), 3, bignumber(1)).valueOf(),
      [bignumber(1), bignumber(2)])
    assert.deepStrictEqual(
      range(bignumber(1), bignumber(3), 1).valueOf(),
      [bignumber(1), bignumber(2)])

    assert.deepStrictEqual(
      range(bignumber(1), 3, 1).valueOf(), [bignumber(1), bignumber(2)])
    assert.deepStrictEqual(range(1, bignumber(3), 1).valueOf(), [1, 2])
    assert.deepStrictEqual(
      range(1, 3, bignumber(1)).valueOf(), [bignumber(1), bignumber(2)])
  })

  it('should interpret strings as numbers regardless', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    assert.deepStrictEqual(bigmath.range('1:3').valueOf(), [1, 2])
    assert.deepStrictEqual(bigmath.range('3:-1:0').valueOf(), [3, 2, 1])
  })

  it('should throw an error when parsing a an invalid string to a bignumber range', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    assert.throws(function () { bigmath.range('1:a') }, /Error: Cannot convert/)
  })

  it('should create a range with units', function () {
    assert.deepStrictEqual(
      range(unit(1, 'm'), unit(3, 'm'), unit(1, 'm')).valueOf(),
      [unit(1, 'm'), unit(2, 'm')])
    assert.deepStrictEqual(
      range(unit(3, 'm'), unit(1, 'm'), unit(-1, 'm')).valueOf(),
      [unit(3, 'm'), unit(2, 'm')])
  })

  it('should parse a range with units', function () {
    assert.deepStrictEqual(
      evaluate('1m:1m:3m').valueOf(),
      [unit(1, 'm'), unit(2, 'm'), unit(3, 'm')])
    assert.deepStrictEqual(
      evaluate('3m:-1m:0m').valueOf(),
      [unit(3, 'm'), unit(2, 'm'), unit(1, 'm'), unit(0, 'm')])
    assert.deepStrictEqual(
      evaluate('range(1m,3m,1m)').valueOf(),
      [unit(1, 'm'), unit(2, 'm'), unit(3, 'm')])
    assert.deepStrictEqual(
      evaluate('range(3m,0m,-1m)').valueOf(),
      [unit(3, 'm'), unit(2, 'm'), unit(1, 'm'), unit(0, 'm')])
  })

  it('should gracefully handle round-off errors', function () {
    assert.deepStrictEqual(range(1, 2, 0.1, true).size(), [11])
    assert.deepStrictEqual(range(0.1, 0.2, 0.01, true).size(), [11])
    assert.deepStrictEqual(range(1, 5, 0.1).size(), [40])
    assert.deepStrictEqual(range(2, 1, -0.1, true).size(), [11])
    assert.deepStrictEqual(range(5, 1, -0.1).size(), [40])
    assert.deepStrictEqual(range(
      -3.2909135802469143,
      3.2909135802469143,
      (3.2909135802469143 + 3.2909135802469143) / 10,
      true).size(), [11])
    assert.deepStrictEqual(range(
      -3.2909135802469143,
      3.2909135802469143,
      (3.2909135802469143 + 3.2909135802469143) / 9,
      true).size(), [10])
    assert.deepStrictEqual(range(
      -3.2909135802469143,
      3.2909135802469143,
      (3.2909135802469143 + 3.2909135802469143) / 10).size(), [10])
    assert.deepStrictEqual(range(
      -3.2909135802469143,
      3.2909135802469143,
      (3.2909135802469143 + 3.2909135802469143) / 9).size(), [9])
  })

  describe('option includeEnd', function () {
    it('should parse a string and include end', function () {
      assert.deepStrictEqual(range('1:6', false).valueOf(), [1, 2, 3, 4, 5])
      assert.deepStrictEqual(range('1:2:6', false).valueOf(), [1, 3, 5])
      assert.deepStrictEqual(range('1:6', true).valueOf(), [1, 2, 3, 4, 5, 6])
    })

    it('should create a range start:1:end and include end', function () {
      assert.deepStrictEqual(range(3, 6, false).valueOf(), [3, 4, 5])
      assert.deepStrictEqual(range(3, 6, true).valueOf(), [3, 4, 5, 6])
    })

    it('should create a range start:step:end and include end', function () {
      assert.deepStrictEqual(range(0, 10, 2, false).valueOf(), [0, 2, 4, 6, 8])
      assert.deepStrictEqual(
        range(0, 10, 2, true).valueOf(), [0, 2, 4, 6, 8, 10])
    })

    it('should create a range with bignumbers and include end', function () {
      assert.deepStrictEqual(
        range(bignumber(1), bignumber(3), true).valueOf(),
        [bignumber(1), bignumber(2), bignumber(3)])
      assert.deepStrictEqual(
        range(bignumber(3), bignumber(1), bignumber(-1), true).valueOf(),
        [bignumber(3), bignumber(2), bignumber(1)])
    })

    it('should handle Fractions', function () {
      const frac = math.fraction
      const fRange = range(frac(1, 3), frac(10, 3))
      assert.deepStrictEqual(fRange, new Range(frac(1, 3), frac(10, 3)))
      assert.deepStrictEqual(
        fRange.valueOf(), [frac(1, 3), frac(4, 3), frac(7, 3)])
      assert.deepStrictEqual(
        range(frac(1, 3), frac(7, 3), true).valueOf(),
        [frac(1, 3), frac(4, 3), frac(7, 3)])
      assert.deepStrictEqual(
        range(frac(1, 3), frac(4, 3), frac(1, 3)).valueOf(),
        [frac(1, 3), frac(2, 3), frac(1)])
      assert.deepStrictEqual(
        range(frac(1, 3), frac(4, 3), frac(1, 3), true).valueOf(),
        [frac(1, 3), frac(2, 3), frac(1), frac(4, 3)])
    })

    it('should allow mixed number and Fraction', function () {
      const frac = math.fraction
      assert.deepStrictEqual(range(1, frac(10, 3)).valueOf(), [1, 2, 3])
      assert.deepStrictEqual(
        range(frac(1, 3), 3, true).valueOf(),
        [frac(1, 3), frac(4, 3), frac(7, 3)])
      assert.deepStrictEqual(
        range(frac(1, 3), 2, frac(1, 3)).valueOf(),
        [frac(1, 3), frac(2, 3), frac(1), frac(4, 3), frac(5, 3)])
      assert.deepStrictEqual(
        range(0, frac(4, 3), frac(1, 3), true).valueOf(),
        [frac(0), frac(1, 3), frac(2, 3), frac(1), frac(4, 3)])
    })

    it('should throw an error in case of invalid type of include end', function () {
      assert.throws(function () { range(0, 10, 2, 0) }, /TypeError: Unexpected type of argument/)
      assert.throws(function () { range(0, 10, 2, 1) }, /TypeError: Unexpected type of argument/)
      assert.throws(function () { range(0, 10, 2, 'str') }, /TypeError: Unexpected type of argument/)
    })
  })

  it('should throw an error if called with an invalid string', function () {
    assert.throws(function () { range('invalid range') }, SyntaxError)
  })

  it('should throw an error if called with a single unit value', function () {
    assert.throws(function () { range(math.unit('5cm')) }, TypeError)
  })

  it('should throw an error if called with only two units value', function () {
    assert.throws(function () { range(math.unit('0cm'), math.unit('5cm')) }, TypeError)
  })

  it('should throw an error when called with mismatching units', function () {
    assert.throws(function () {
      range(math.unit('0cm'), math.unit('2kg'), math.unit('1cm'))
    }, Error, 'Cannot compare units with different base')
  })

  it('should throw an error if called with a complex number', function () {
    assert.throws(function () { range(math.complex(2, 3)) }, TypeError)
  })

  it('should throw an error if called with one invalid argument', function () {
    assert.throws(function () { range(math.unit('5cm'), 2) }, TypeError)
    assert.throws(function () { range(2, math.complex(2, 3)) }, TypeError)
    assert.throws(function () { range(2, new Date(), 3) }, TypeError)
    assert.throws(function () { range(2, 1, math.unit('5cm')) }, TypeError)
    assert.throws(function () { range(math.complex(2, 3), 1, 3) }, TypeError)
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { range() }, /TypeError: Too few arguments/)

    assert.throws(function () { range(1, 2, 3, true, 5) }, /TypeError: Too many arguments/)
  })

  it('should not cast a single number or boolean to range', function () {
    assert.throws(function () { range(2) }, /TypeError: Too few arguments/)
    assert.throws(function () { range(true) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX range', function () {
    const expression = math.parse('range(1,10)')
    assert.strictEqual(expression.toTex(), '\\mathrm{range}\\left(1,10\\right)')
  })
})
