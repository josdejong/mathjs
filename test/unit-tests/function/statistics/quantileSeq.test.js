import assert from 'assert'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const quantileSeq = math.quantileSeq

describe('quantileSeq', function () {
  it('should return the quantileSeq from an array with number probability', function () {
    const lst = [3.7, 2.7, 3.3, 1.3, 2.2, 3.1]
    assert.strictEqual(quantileSeq(lst, 0), 1.3)
    assert.strictEqual(quantileSeq(lst, 0.1), 1.75)
    assert.strictEqual(quantileSeq(lst, 0.2), 2.2)
    assert.strictEqual(quantileSeq(lst, 0.25), 2.325)
    assert.strictEqual(quantileSeq(lst, 0.25, false), 2.325)
    assert.strictEqual(quantileSeq(lst, 0.3), 2.45)
    assert.strictEqual(quantileSeq(lst, 0.4), 2.7)
    approxEqual(quantileSeq(lst, 0.5), 2.9)
    assert.strictEqual(quantileSeq(lst, 0.6), 3.1)
    assert.strictEqual(quantileSeq(lst, 0.7), 3.2)
    approxEqual(quantileSeq(lst, 0.75), 3.25)
    assert.strictEqual(quantileSeq(lst, 0.8), 3.3)
    assert.strictEqual(quantileSeq(lst, 0.9), 3.5)
    assert.strictEqual(quantileSeq(lst, 1), 3.7)
  })

  it('should return the quantileSeq from a multidimensional array in the specified dimension', function () {
    const arr = [
      [3.7, 2.7, 3.3, 1.3, 2.2, 3.1],
      [3.8, 2.5, 3.2, 1.2, 3.2, 4.1]
    ]
    assert.deepStrictEqual(quantileSeq(arr, 0, 1), [1.3, 1.2])
    assert.deepStrictEqual(quantileSeq(arr, 0.25, 1), [2.325, 2.675])
    assert.deepStrictEqual(quantileSeq(arr, 0.5, 1), [2.9000000000000004, 3.2])
    assert.deepStrictEqual(quantileSeq(arr, 0.75, 1), [3.2499999999999996, 3.6499999999999995])
    assert.deepStrictEqual(quantileSeq(arr, 1, 1), [3.7, 4.1])
    assert.deepStrictEqual(quantileSeq(arr, 0, false, 1), [1.3, 1.2])
    assert.deepStrictEqual(quantileSeq(arr, 0.25, false, 1), [2.325, 2.675])
    assert.deepStrictEqual(quantileSeq(arr, 0.5, false, 1), [2.9000000000000004, 3.2])
    assert.deepStrictEqual(quantileSeq(arr, 0.75, false, 1), [3.2499999999999996, 3.6499999999999995])
    assert.deepStrictEqual(quantileSeq(arr, 1, false, 1), [3.7, 4.1])
  })

  it('should return the quantileSeq from a multidimensional array in the specified dimension in the parser', function () {
    const arr = [
      [3.7, 2.7, 3.3, 1.3, 2.2, 3.1],
      [3.8, 2.5, 3.2, 1.2, 3.2, 4.1]
    ]
    assert.deepStrictEqual(math.evaluate('quantileSeq(arr, 0, 2)', { arr }), [1.3, 1.2])
    assert.deepStrictEqual(quantileSeq(arr, 0.25, 1), [2.325, 2.675])
    assert.deepStrictEqual(quantileSeq(arr, 0.5, 1), [2.9000000000000004, 3.2])
    assert.deepStrictEqual(quantileSeq(arr, 0.75, 1), [3.2499999999999996, 3.6499999999999995])
    assert.deepStrictEqual(quantileSeq(arr, 1, 1), [3.7, 4.1])
    assert.deepStrictEqual(quantileSeq(arr, 0, false, 1), [1.3, 1.2])
    assert.deepStrictEqual(quantileSeq(arr, 0.25, false, 1), [2.325, 2.675])
    assert.deepStrictEqual(quantileSeq(arr, 0.5, false, 1), [2.9000000000000004, 3.2])
    assert.deepStrictEqual(quantileSeq(arr, 0.75, false, 1), [3.2499999999999996, 3.6499999999999995])
    assert.deepStrictEqual(quantileSeq(arr, 1, false, 1), [3.7, 4.1])
  })

  it('should return the quantileSeq from an ascending array with number probability', function () {
    const lst = [1.3, 2.2, 2.7, 3.1, 3.3, 3.7]
    assert.strictEqual(quantileSeq(lst, 0, true), 1.3)
    assert.strictEqual(quantileSeq(lst, 0.1, true), 1.75)
    assert.strictEqual(quantileSeq(lst, 0.2, true), 2.2)
    assert.strictEqual(quantileSeq(lst, 0.25, true), 2.325)
    assert.strictEqual(quantileSeq(lst, 0.3, true), 2.45)
    assert.strictEqual(quantileSeq(lst, 0.4, true), 2.7)
    approxEqual(quantileSeq(lst, 0.5, true), 2.9)
    assert.strictEqual(quantileSeq(lst, 0.6, true), 3.1)
    assert.strictEqual(quantileSeq(lst, 0.7, true), 3.2)
    approxEqual(quantileSeq(lst, 0.75, true), 3.25)
    assert.strictEqual(quantileSeq(lst, 0.8, true), 3.3)
    assert.strictEqual(quantileSeq(lst, 0.9, true), 3.5)
    assert.strictEqual(quantileSeq(lst, 1, true), 3.7)
  })

  it('should return the quantileSeq from an array with BigNumber probability', function () {
    // FIXME: why does quantileSeq sometimes return bignumber and sometimes not?
    const lst = [3.7, 2.7, 3.3, 1.3, 2.2, 3.1]
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0)), bignumber(1.3))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.1)), bignumber(1.75))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.2)), bignumber(2.2))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.25)), bignumber(2.325))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.3)), bignumber(2.45))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.4)), bignumber(2.7))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.5)), bignumber(2.9))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.6)), bignumber(3.1))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.7)), bignumber(3.2))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.75)), bignumber(3.25))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.8)), bignumber(3.3))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(0.9)), bignumber(3.5))
    assert.deepStrictEqual(quantileSeq(lst, bignumber(1)), bignumber(3.7))
  })

  // FIXME: should return the quantileSeq of an array of bignumbers with number probability
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should return the quantileSeq of an array of bignumbers with number probability', function () {
    approxEqual(quantileSeq([bignumber(0.5377), bignumber(1.8339), bignumber(-2.2588), bignumber(0.8622),
      bignumber(0.3188), bignumber(-1.3077), bignumber(-0.4336), bignumber(0.3426),
      bignumber(3.5784), bignumber(2.7694)], 0.3),
    0.09308)
  })

  it('should return the quantileSeq of an array of bignumbers with BigNumber probability', function () {
    assert.deepStrictEqual(quantileSeq([bignumber(0.5377), bignumber(1.8339), bignumber(-2.2588), bignumber(0.8622),
      bignumber(0.3188), bignumber(-1.3077), bignumber(-0.4336), bignumber(0.3426),
      bignumber(3.5784), bignumber(2.7694)], bignumber(0.3)),
    bignumber(0.09308))
  })

  it('should return the quantileSeq of units', function () {
    assert.deepStrictEqual(quantileSeq([math.unit('5mm'), math.unit('15mm'), math.unit('10mm')], 0.5), math.unit('10mm'))
  })

  it('should return the quantileSeq from a 1d matrix', function () {
    assert.strictEqual(quantileSeq(math.matrix([2, 4, 6, 8, 10, 12, 14]), 0.25), 5)
  })

  it('should return the quantileSeq from a 2d array', function () {
    approxEqual(quantileSeq([
      [3.7, 2.7, 3.3],
      [1.3, 2.2, 3.1]
    ], 0.75), 3.25)
  })

  it('should return the quantileSeq from an ascending 2d array', function () {
    approxEqual(quantileSeq([
      [1.3, 2.2, 2.7],
      [3.1, 3.3, 3.7]
    ], 0.75, true), 3.25)
  })

  it('should return the quantileSeq from a 2d matrix', function () {
    approxEqual(quantileSeq(math.matrix([
      [3.7, 2.7, 3.3],
      [1.3, 2.2, 3.1]
    ]), 0.75), 3.25)
  })

  it('should return the quantileSeq from an ascending 2d matrix', function () {
    approxEqual(quantileSeq(math.matrix([
      [1.3, 2.2, 2.7],
      [3.1, 3.3, 3.7]
    ]), 0.75, true), 3.25)
  })

  it('should return list quantiles for list of number probabilities', function () {
    const lst = [3.7, 2.7, 3.3, 1.3, 2.2, 3.1]
    approxDeepEqual(quantileSeq(lst, [0.25, 0.5, 0.75]), [2.325, 2.9, 3.25])
    approxDeepEqual(quantileSeq(lst, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]),
      [1.75, 2.2, 2.45, 2.7, 2.9, 3.1, 3.2, 3.3, 3.5])
  })

  it('should return list quantiles for list of number probabilities being a matrix', function () {
    approxDeepEqual(quantileSeq(math.matrix([3, -1, 5, 7]), math.matrix([1 / 3, 2 / 3])), [3, 5])
    // FIXME: should return a matrix as output when the input is a matrix
  })

  it('should return list quantiles for list of BigNumber probabilities', function () {
    const lst = [3.7, 2.7, 3.3, 1.3, 2.2, 3.1]
    assert.deepStrictEqual(quantileSeq(lst, [bignumber(0.25), bignumber(0.5), bignumber(0.75)]),
      [bignumber(2.325), bignumber(2.9), bignumber(3.25)])
    assert.strictEqual(quantileSeq(lst, [bignumber(0.1), bignumber(0.2), bignumber(0.3), bignumber(0.4),
      bignumber(0.5), bignumber(0.6), bignumber(0.7), bignumber(0.8),
      bignumber(0.9)]).toString(), '1.75,2.2,2.45,2.7,2.9,3.1,3.2,3.3,3.5')
  })

  it('should return list quantiles for list of number and BigNumber probabilities', function () {
    const lst = [3.7, 2.7, 3.3, 1.3, 2.2, 3.1]
    approxDeepEqual(quantileSeq(lst, [0.25, bignumber(0.5), 0.75]), [2.325, 2.9, 3.25])
    approxDeepEqual(quantileSeq(lst, [0.1, 0.2, bignumber(0.3), 0.4, 0.5, 0.6, 0.7, bignumber(0.8), 0.9]),
      [1.75, 2.2, 2.45, 2.7, 2.9, 3.1, 3.2, 3.3, 3.5])
  })

  it('should return the evenly number spaced quantiles of an array', function () {
    const lst = [3.7, 2.7, 3.3, 1.3, 2.2, 3.1]
    approxDeepEqual(quantileSeq(lst, 3), [2.325, 2.9, 3.25])
    approxDeepEqual(quantileSeq(lst, 9), [1.75, 2.2, 2.45, 2.7, 2.9, 3.1, 3.2, 3.3, 3.5])
  })

  it('should return the evenly BigNumber spaced quantiles of an array', function () {
    const lst = [3.7, 2.7, 3.3, 1.3, 2.2, 3.1]
    assert.deepStrictEqual(quantileSeq(lst, bignumber(3)), [bignumber(2.325), bignumber(2.9), bignumber(3.25)])
    assert.strictEqual(quantileSeq(lst, bignumber(9)).toString(), '1.75,2.2,2.45,2.7,2.9,3.1,3.2,3.3,3.5')
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { quantileSeq() }, TypeError)
    assert.throws(function () { quantileSeq(2) }, TypeError)
    assert.throws(function () { quantileSeq([], 2, 3, 1) }, TypeError)
  })

  it('should throw an error if called with unsupported type of arguments', function () {
    assert.throws(function () { quantileSeq([2, 4, 6, 8, 10, 12, 14], 0.25, 10) }, math.UnsupportedTypeError)
    assert.throws(function () { quantileSeq([2, 4, 6, 8, 10, 12, 14], [0.25, 2]) }, math.UnsuppoError)
    assert.throws(function () { quantileSeq('A', 'C', 'B') }, math.UnsupportedTypeError)
    assert.throws(function () { quantileSeq(true, false, true) }, math.UnsupportedTypeError)
    assert.throws(function () { quantileSeq(0, 'B') }, math.UnsupportedTypeError)

    assert.throws(function () { quantileSeq(math.complex(2, 3), math.complex(-1, 2)) }, /TypeError: Unexpected type of argument in function quantileSeq/)
    assert.throws(function () { quantileSeq(2, null) }, /TypeError: Unexpected type of argument in function quantileSeq/)

    // TODO: improve error messages of quantileSeq
    assert.throws(function () { quantileSeq([2, null], 2) }, /TypeError: Unexpected type of argument in function compare/)
  })

  it('should throw error for bad probabilities and splits', function () {
    assert.throws(function () { quantileSeq([2, 4, 6, 8, 10, 12, 14], [0.23, 2, 0.2]) }, Error)
    assert.throws(function () { quantileSeq([2, 4, 6, 8, 10, 12, 14], [0.23, bignumber(2), 0.2]) }, Error)
    assert.throws(function () { quantileSeq([2, 4, 6, 8, 10, 12, 14], -2) }, Error)
    assert.throws(function () { quantileSeq([2, 4, 6, 8, 10, 12, 14], bignumber(-2)) }, Error)
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { quantileSeq([]) })
  })

  it('should not mutate the input', function () {
    const a = [3, 2, 1]
    quantileSeq(a, 0.2)
    quantileSeq(a, 2)
    quantileSeq(a, [0.1, 0.3])
    assert.deepStrictEqual(a, [3, 2, 1])
  })

  /*
  it('should LaTeX quantileSeq', function () {
    const expression = math.parse('quantileSeq(1,2,3,4,0.3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{quantile}\\left(1,2,3,4,0.3\\right)')
  })
  */
})
