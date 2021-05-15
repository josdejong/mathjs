import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const isInfinite = math.isInfinite
const bignumber = math.bignumber
const fraction = math.fraction
const complex = math.complex
const unit = math.unit

describe('isInfinite', function () {
  it('should test whether a number is infinte', function () {
    assert.strictEqual(isInfinite(0), false)
    assert.strictEqual(isInfinite(-0), false)
    assert.strictEqual(isInfinite(2), false)
    assert.strictEqual(isInfinite(-3), false)
    assert.strictEqual(isInfinite(Infinity), true)
    assert.strictEqual(isInfinite(-Infinity), true)
    assert.strictEqual(isInfinite(NaN), false)
  })

  it('should test whether a BigNumber is infinte', function () {
    assert.strictEqual(isInfinite(bignumber(0)), false)
    assert.strictEqual(isInfinite(bignumber(-0)), false)
    assert.strictEqual(isInfinite(bignumber(2)), false)
    assert.strictEqual(isInfinite(bignumber(-3)), false)
    // assert.strictEqual(isInfinite(bignumber(Infinity)), true)
    // assert.strictEqual(isInfinite(bignumber(-Infinity)), true)
    assert.strictEqual(isInfinite(bignumber(NaN)), false)
  })

  it('should test whether a Fraction is infinte', function () {
    assert.strictEqual(isInfinite(fraction(0)), false)
    assert.strictEqual(isInfinite(fraction(-0)), false)
    assert.strictEqual(isInfinite(fraction(2)), false)
    assert.strictEqual(isInfinite(fraction(-3)), false)
    // assert.strictEqual(isInfinite(fraction(Infinity)), true)
    // assert.strictEqual(isInfinite(fraction(-Infinity)), true)
    // assert.strictEqual(isInfinite(fraction(NaN)), false)
  })

  it('should test whether a Unit is infinte', function () {
    assert.strictEqual(isInfinite(unit(0)), false)
    assert.strictEqual(isInfinite(unit(-0)), false)
    assert.strictEqual(isInfinite(unit(2)), false)
    assert.strictEqual(isInfinite(unit(-3)), false)
    // assert.strictEqual(isInfinite(unit(Infinity)), true)
    // assert.strictEqual(isInfinite(unit(-Infinity)), true)
    // assert.strictEqual(isInfinite(unit(NaN)), false)
  })

  it('should test whether a Complex is infinte', function () {
    assert.strictEqual(isInfinite(complex(0, 0)), false)
    assert.strictEqual(isInfinite(complex(0, -0)), false)
    assert.strictEqual(isInfinite(complex(0, 2)), false)
    assert.strictEqual(isInfinite(complex(0, -3)), false)
    assert.strictEqual(isInfinite(complex(0, Infinity)), true)
    assert.strictEqual(isInfinite(complex(0, -Infinity)), true)
    assert.strictEqual(isInfinite(complex(0, NaN)), false)

    assert.strictEqual(isInfinite(complex(-0, 0)), false)
    assert.strictEqual(isInfinite(complex(2, 0)), false)
    assert.strictEqual(isInfinite(complex(-3, 0)), false)
    assert.strictEqual(isInfinite(complex(Infinity, 0)), true)
    assert.strictEqual(isInfinite(complex(-Infinity, 0)), true)
    assert.strictEqual(isInfinite(complex(NaN, 0)), false)

    assert.strictEqual(isInfinite(complex(-0, -0)), false)
    assert.strictEqual(isInfinite(complex(2, 2)), false)
    assert.strictEqual(isInfinite(complex(-3, -3)), false)
    assert.strictEqual(isInfinite(complex(Infinity, Infinity)), true)
    assert.strictEqual(isInfinite(complex(-Infinity, -Infinity)), true)
    assert.strictEqual(isInfinite(complex(NaN, NaN)), false)
  })

  it('should test isInfinite element wise on an Array', function () {
    assert.deepStrictEqual(
      isInfinite([0, -0, 2, -3, Infinity, -Infinity, NaN]),
      [false, false, false, false, true, true, false]
    )
  })

  it('should throw an error in case of unsupported data types', function () {
    assert.throws(function () {
      isInfinite(new Date())
    }, /TypeError: Unexpected type of argument/)
    assert.throws(function () {
      isInfinite({})
    }, /TypeError: Unexpected type of argument/)
  })
})
