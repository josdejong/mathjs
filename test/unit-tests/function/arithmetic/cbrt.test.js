// test cbrt
import assert from 'assert'

import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const cbrt = math.cbrt
const bignumber = math.bignumber
const complex = math.complex

describe('cbrt', function () {
  it('should return the cubic root of a boolean', function () {
    assert.strictEqual(cbrt(true), 1)
    assert.strictEqual(cbrt(false), 0)
  })

  it('should return the cubic root of a positive number', function () {
    assert.strictEqual(cbrt(0), 0)
    assert.strictEqual(cbrt(1), 1)
    assert.strictEqual(cbrt(8), 2)
    assert.strictEqual(cbrt(27), 3)
    assert.strictEqual(cbrt(64), 4)
    assert.strictEqual(cbrt(125), 5)

    approxEqual(cbrt(10), 2.1544346900318834)
  })

  it('should return the cubic root of a negative number', function () {
    assert.strictEqual(cbrt(-8), -2)
    assert.strictEqual(cbrt(-64), -4)
  })

  it('should return the cubic root of infinity', function () {
    assert.strictEqual(cbrt(Infinity), Infinity)
    assert.strictEqual(cbrt(-Infinity), -Infinity)
  })

  it('should return all cubic roots of a number', function () {
    approxDeepEqual(cbrt(8, true), math.matrix([
      complex('2'),
      complex('-1 + 1.7321i'),
      complex('-1 - 1.7321i')
    ]))

    approxDeepEqual(cbrt(-8, true), math.matrix([
      complex('1 + 1.7321i'),
      complex('-2'),
      complex('1 - 1.7321i')
    ]))
  })

  it('should return the cubic root of a positive bignumber', function () {
    assert.deepStrictEqual(cbrt(bignumber(0)), bignumber(0))
    assert.deepStrictEqual(cbrt(bignumber(1)), bignumber(1))
    assert.deepStrictEqual(cbrt(bignumber(8)), bignumber(2))
    assert.deepStrictEqual(cbrt(bignumber(27)), bignumber(3))
    assert.deepStrictEqual(cbrt(bignumber(64)), bignumber(4))
    assert.deepStrictEqual(cbrt(bignumber(125)), bignumber(5))

    assert.deepStrictEqual(cbrt(bignumber(10)), bignumber('2.154434690031883721759293566519350495259344942192108582489235506'))
  })

  it('should return the cubic root of a negative bignumber', function () {
    assert.deepStrictEqual(cbrt(bignumber(-8)), bignumber(-2))
    assert.deepStrictEqual(cbrt(bignumber(-64)), bignumber(-4))
  })

  it('should return the cubic root of a complex number', function () {
    approxDeepEqual(cbrt(complex('2 + 3i')), complex('1.451856618352664928164697 + 0.493403534104004716735578i'))
    approxDeepEqual(cbrt(complex('-2 + 3i')), complex('1.15322830402742 + 1.01064294709397i'))
    approxDeepEqual(cbrt(complex('8i')), complex('1.73205080756888 + i'))
  })

  it('should return all three roots of a complex number', function () {
    approxDeepEqual(cbrt(complex('2 + 3i'), true), math.matrix([
      complex('1.4519 + 0.4934i'),
      complex('-1.1532 + 1.0106i'),
      complex('-0.2986 - 1.5040i')
    ]))

    approxDeepEqual(cbrt(complex('8i'), true), math.matrix([
      complex(' 1.7321 + i'),
      complex('-1.7321 + i'),
      complex('-2i')
    ]))

    const math2 = math.create({ matrix: 'Array' })

    approxDeepEqual(math2.cbrt(complex('8i'), true), [
      complex(' 1.7321 + i'),
      complex('-1.7321 + i'),
      complex('-2i')
    ])
  })

  it('should return the cubic root of a unit', function () {
    assert.strictEqual(cbrt(math.unit('27 m^3')).toString(), math.unit('3 m').toString())
    assert.strictEqual(cbrt(math.unit('-27 m^3')).toString(), math.unit('-3 m').toString())

    assert(math.isBigNumber(cbrt(math.unit(math.bignumber(27), 'm^3')).value))
    assert.deepStrictEqual(cbrt(math.unit(math.bignumber(27), 'm^3')).value, math.bignumber(3))
    assert(math.isBigNumber(cbrt(math.unit(math.bignumber(-27), 'm^3')).value))
    assert.deepStrictEqual(cbrt(math.unit(math.bignumber(-27), 'm^3')).value, math.bignumber(-3))

    assert(math.isComplex(cbrt(math.unit(math.complex(-46, 9), 's^3')).value))
    approxDeepEqual(cbrt(math.unit(math.complex(-46, 9), 's^3')).value, math.complex(2, 3))
  })

  it('should throw an error when used with a string', function () {
    assert.throws(function () {
      cbrt('a string')
    })
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => cbrt([8, 27, 64, 125]), TypeError)
    assert.throws(() => cbrt(math.matrix([8, 27])), TypeError)
    assert.deepStrictEqual(math.map([8, 27, 64, 125], x => cbrt(x)), [2, 3, 4, 5])
    assert.deepStrictEqual(math.map([[8, 27], [64, 125]], x => cbrt(x)), [[2, 3], [4, 5]])
    assert.deepStrictEqual(math.map(math.matrix([[8, 27], [64, 125]]), x => cbrt(x)), math.matrix([[2, 3], [4, 5]]))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { cbrt() }, /TypeError: Too few arguments/)
    assert.throws(function () { cbrt(1, true, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { cbrt(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX cbrt', function () {
    const expression = math.parse('cbrt(2)')
    assert.strictEqual(expression.toTex(), '\\sqrt[3]{2}')
  })
})
