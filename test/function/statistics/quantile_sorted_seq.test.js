var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    quantile_sorted_seq = math.quantile_sorted_seq;

describe('quantile_sorted_seq', function() {

  it('should return the quantile_sorted_seq of a sequence of numbers with number probability', function() {
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0), 1.3);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.1), 1.75);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.2), 2.2);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.25), 2.325);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.3), 2.45);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.4), 2.7);
    approx.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.5), 2.9);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.6), 3.1);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.7), 3.2);
    approx.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.75), 3.25);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.8), 3.3);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 0.9), 3.5);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, 1), 3.7);
  });

  it('should return the quantile_sorted_seq of a sequence of numbers with BigNumber probability', function() {
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0)), 1.3);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.1)), 1.75);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.2)), 2.2);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.25)), 2.325);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.3)), 2.45);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.4)), 2.7);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.5)), 2.9);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.6)), 3.1);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.7)), 3.2);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.75)), 3.25);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.8)), 3.3);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(0.9)), 3.5);
    assert.equal(quantile_sorted_seq(1.3, 2.2, 2.7, 3.1, 3.3, 3.7, bignumber(1)), 3.7);
  });

  it('should return the quantile_sorted_seq of a sequence of bignumbers with number probability', function() {
    approx.equal(quantile_sorted_seq(bignumber(-2.2588), bignumber(-1.3077), bignumber(-0.4336),
                                     bignumber(0.3188), bignumber(0.3426), bignumber(0.5377),
                                     bignumber(0.8622), bignumber(1.8339), bignumber(2.7694),
                                     bignumber(3.5784), 0.3),
                                     0.09308);
  });

  it('should return the quantile_sorted_seq of a sequence of bignumbers with BigNumber probability', function() {
    assert.deepEqual(quantile_sorted_seq(bignumber(-2.2588), bignumber(-1.3077), bignumber(-0.4336),
                                         bignumber(0.3188), bignumber(0.3426), bignumber(0.5377),
                                         bignumber(0.8622), bignumber(1.8339), bignumber(2.7694),
                                         bignumber(3.5784), bignumber(0.3)),
                                         bignumber(0.09308));
  });

  it('should return the quantile_sorted_seq from an array', function() {
    assert.equal(quantile_sorted_seq([2,4,6,8,10,12,14], 0.25), 5);
  });

  it('should return the quantile_sorted_seq of units', function() {
    assert.deepEqual(quantile_sorted_seq([math.unit('5mm'), math.unit('10mm'), math.unit('15mm')], 0.5), math.unit('10mm'));
    assert.deepEqual(quantile_sorted_seq([math.unit('5mm'), math.unit('10mm'), math.unit('12mm'), math.unit('15mm')], 0.5), math.unit('11mm'));
  });

  it('should return the quantile_sorted_seq from an 1d matrix', function() {
    assert.equal(quantile_sorted_seq(math.matrix([2,4,6,8,10,12,14]), 0.25), 5);
  });

  it('should return the quantile_sorted_seq from a 2d array', function() {
    approx.equal(quantile_sorted_seq([
      [1.3, 2.2, 2.7],
      [3.1, 3.3, 3.7]
    ], 0.75), 3.25);
  });

  it('should return the quantile_sorted_seq from a 2d matrix', function() {
    approx.equal(quantile_sorted_seq(math.matrix([
      [1.3, 2.2, 2.7],
      [3.1, 3.3, 3.7]
    ]), 0.75), 3.25);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {quantile_sorted_seq()});
    assert.throws(function() {quantile_sorted_seq(2)});
    assert.throws(function() {quantile_sorted_seq([], 2, 3)});
  });

  it('should throw an error if called with unsupported type of arguments', function() {
    assert.throws(function () {quantile_sorted_seq('A', 'C', 'D', 'B')}, math.error.UnsupportedTypeError);
    assert.throws(function () {quantile_sorted_seq('A', 'C', 'B')}, math.error.UnsupportedTypeError);
    assert.throws(function () {quantile_sorted_seq(true, false, true)}, math.error.UnsupportedTypeError);
    assert.throws(function () {quantile_sorted_seq(0, 'B')}, math.error.UnsupportedTypeError);
    assert.throws(function () {quantile_sorted_seq(math.complex(2,3), math.complex(-1,2))}, TypeError);
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {quantile_sorted_seq([])});
  });

  it('should not mutate the input', function () {
    var a = [1,2,3];
    var b = quantile_sorted_seq(a, 0.2);
    assert.deepEqual(a,[1,2,3]);
  });

  /*
  it('should LaTeX quantile_sorted_seq', function () {
    var expression = math.parse('quantile_sorted_seq(1,2,3,4)');
    assert.equal(expression.toTex(), '\\mathrm{quantile}\\left(1,2,3,4\\right)');
  });
  */
});
