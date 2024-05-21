// test approx itself...
import assert from 'assert'

import { approxEqual, approxDeepEqual } from '../../tools/approx.js'

describe('approx', function () {
  it('should test equality of positive values', function () {
    approxEqual(1 / 3, 0.33333333)
    approxEqual(2, 2.000001)
    approxEqual(2, 1.999999)
    assert.throws(function () { approxEqual(2, 2.001) }, assert.AssertionError)
    assert.throws(function () { approxEqual(2, 1.999) }, assert.AssertionError)

    approxEqual(2, 2.0000000001, 1e-10)
    approxEqual(2, 1.9999999999, 1e-10)
    assert.throws(() => approxEqual(2, 2.0000000001, 1e-11), assert.AssertionError)
    assert.throws(() => approxEqual(2, 1.9999999999, 1e-11), assert.AssertionError)
  })

  it('should test equality of negative values', function () {
    approxEqual(-2, -2.000001)
    approxEqual(-2, -1.999999)
    assert.throws(function () { approxEqual(-2, -2.001) }, assert.AssertionError)
    assert.throws(function () { approxEqual(-2, -1.999) }, assert.AssertionError)

    approxEqual(-2, -2.0000000001, 1e-10)
    approxEqual(-2, -1.9999999999, 1e-10)
    assert.throws(() => approxEqual(-2, -2.0000000001, 1e-11), assert.AssertionError)
    assert.throws(() => approxEqual(-2, -1.9999999999, 1e-11), assert.AssertionError)
  })

  it('should test equality of very large values', function () {
    approxEqual(2e100, 2.000001e100)
    approxEqual(2e100, 1.999999e100)
    assert.throws(function () { approxEqual(2e100, 2.001e100) }, assert.AssertionError)
    assert.throws(function () { approxEqual(2e100, 1.999e100) }, assert.AssertionError)

    approxEqual(2e100, 2.0000000001e100, 1e-10)
    approxEqual(2e100, 1.9999999999e100, 1e-10)
    assert.throws(() => approxEqual(2e100, 2.0000000001e100, 1e-11), assert.AssertionError)
    assert.throws(() => approxEqual(2e100, 1.9999999999e100, 1e-11), assert.AssertionError)
  })

  it('should test equality of very small values', function () {
    approxEqual(2e-100, 2.000001e-100)
    approxEqual(2e-100, 1.999999e-100)
    assert.throws(function () { approxEqual(2e-100, 2.001e-100) }, assert.AssertionError)
    assert.throws(function () { approxEqual(2e-100, 1.999e-100) }, assert.AssertionError)

    approxEqual(2e-100, 2.0000000001e-100, 1e-10)
    approxEqual(2e-100, 1.9999999999e-100, 1e-10)
    assert.throws(() => approxEqual(2e-100, 2.0000000001e-100, 1e-11), assert.AssertionError)
    assert.throws(() => approxEqual(2e-100, 1.9999999999e-100, 1e-11), assert.AssertionError)
  })

  it('should test equality of NaN numbers', function () {
    // NaN values
    const a = NaN
    const b = NaN
    approxEqual(a, b)
    assert.throws(function () { approxEqual(NaN, 3) }, assert.AssertionError)
    assert.throws(function () { approxEqual(NaN, 'nonumber') }, assert.AssertionError)
  })

  it('should test equality when one of the values is zero', function () {
    // zero as one of the two values
    approxEqual(0, 1e-15)
    approxEqual(1e-15, 0)
    assert.throws(function () { approxEqual(0, 0.001) }, assert.AssertionError)

    approxEqual(0, 0.00000000009, 1e-10)
    assert.throws(() => approxEqual(0, 0.00000000009, 1e-11), assert.AssertionError)
  })

  // TODO: test approx.equal for (mixed) numbers, BigNumbers, Fractions, Complex numbers

  it('should test deep equality of arrays and objects', function () {
    approxDeepEqual({
      a: [1, 2, 3],
      b: [{ c: 4, d: 5 }]
    }, {
      a: [1.000001, 1.99999999, 3.000005],
      b: [{ c: 3.999999981, d: 5.0000023 }]
    })

    assert.throws(function () {
      approxDeepEqual({
        a: [1, 2, 3],
        b: [{ c: 4, d: 5 }]
      }, {
        a: [1.000001, 1.99999999, 3.000005],
        b: [{ c: 3.1, d: 5.0000023 }]
      })
    }, assert.AssertionError)

    assert.throws(function () {
      approxDeepEqual({
        a: [1, 2, 3],
        b: [{ c: 4, d: 5 }]
      }, {
        a: [1.001, 1.99999999, 3.000005],
        b: [{ c: 3, d: 5.0000023 }]
      })
    }, assert.AssertionError)

    approxDeepEqual(
      {
        a: [1, 2, 3],
        b: [{ c: 4.123456789123, d: 5.987654321987 }]
      },
      {
        a: [1.00000000001, 1.9999999999, 3.0000000002],
        b: [{ c: 4.12345678913, d: 5.98765432197 }]
      },
      1e-10
    )
    assert.throws(() => {
      approxDeepEqual(
        {
          a: [1, 2, 3],
          b: [{ c: 4.123456789123, d: 5.987654321987 }]
        },
        {
          a: [1.00000000001, 1.9999999999, 3.0000000002],
          b: [{ c: 4.12345678913, d: 5.98765432197 }]
        },
        1e-11
      )
    }, assert.AssertionError)
  })
})
