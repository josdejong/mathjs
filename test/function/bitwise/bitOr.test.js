// test bitOr
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    //bignumber = math.bignumber,
    bitOr = math.bitOr;

describe('bitOr', function () {

  it('should bitwise or two numbers', function () {
    assert.equal(bitOr(53, 131), 183);
    assert.equal(bitOr(2, 3), 3);
    assert.equal(bitOr(-2, 3), -1);
    assert.equal(bitOr(2, -3), -1);
    assert.equal(bitOr(-5, -3), -1);
  });

  it('should bitwise or booleans', function () {
    assert.equal(bitOr(true, true), 1);
    assert.equal(bitOr(true, false), 1);
    assert.equal(bitOr(false, true), 1);
    assert.equal(bitOr(false, false), 0);
  });

  it('should bitwise or numbers and null', function () {
    assert.equal(math.bitOr(null, null), 0);
    assert.equal(math.bitOr(null, 1), 1);
    assert.equal(math.bitOr(1, null), 1);
  });

  it('should bitwise or mixed numbers and booleans', function () {
    assert.equal(bitOr(0, true), 1);
    assert.equal(bitOr(0, false), 0);
    assert.equal(bitOr(true, 0), 1);
    assert.equal(bitOr(false, 0), 0);
  });

  it('should bitwise or two measures of the same unit', function () {
    approx.deepEqual(bitOr(math.unit(33, 'km'), math.unit(100, 'mile')), math.unit(193.774, 'km'));

    var b = math.unit('12 m');
    var c = math.unit('12 cm');
    var d = math.unit('52 mm');
    approx.deepEqual(bitOr(b, d), math.unit(12.02, 'm'));
    approx.deepEqual(bitOr(c, d), math.unit(12.4, 'cm'));
  });

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () {
      bitOr(math.unit(5, 'km'), math.unit(100, 'gram'));
    });
  });

  it('should throw an error when one of the two units has undefined value', function () {
    assert.throws(function () {
      bitOr(math.unit('km'), math.unit('5gram'));
    }, /Parameter x contains a unit with undefined value/);
    assert.throws(function () {
      bitOr(math.unit('5 km'), math.unit('gram'));
    }, /Parameter y contains a unit with undefined value/);
  });

  it('should throw an error in case of a unit and non-unit argument', function () {
    assert.throws(function () {bitOr(math.unit('5cm'), 2)}, math.error.UnsupportedTypeError);
    assert.throws(function () {bitOr(math.unit('5cm'), new Date())}, math.error.UnsupportedTypeError);
    assert.throws(function () {bitOr(new Date(), math.unit('5cm'))}, math.error.UnsupportedTypeError);
  });

  it('should bitwise or two ints, even in string format', function () {
    assert.equal(bitOr('120', '86'), 126);
    assert.equal(bitOr('86', 120), 126);
    assert.equal(bitOr('-120', '-86'), -86);
    assert.equal(bitOr(-120, '-86'), -86);
  });

  it('should throw an error in case of NaN argument', function () {
    assert.throws(function () {
      bitOr(NaN, 10);
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      bitOr('10', NaN);
    }, /Parameter y contains a NaN value/);
    assert.throws(function () {
      bitOr('This is not a number!', '12');
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      bitOr(12, '');
    }, /Parameter y contains a NaN value/);
  });

  it('should bitwise or strings and matrices element wise', function () {
    assert.deepEqual(bitOr('42', ['1', 12, '31']), [43, 46, 63]);
    assert.deepEqual(bitOr(['1', 12, '31'], '42'), [43, 46, 63]);

    assert.deepEqual(bitOr('42', math.matrix(['1', 12, '31'])), math.matrix([43, 46, 63]));
    assert.deepEqual(bitOr(math.matrix(['1', 12, '31']), '42'), math.matrix([43, 46, 63]));
  });

  it('should bitwise or matrices correctly', function () {
    var a2 = math.matrix([[1,2],[3,4]]);
    var a3 = math.matrix([[5,6],[7,8]]);
    var a4 = bitOr(a2, a3);
    assert.ok(a4 instanceof math.type.Matrix);
    assert.deepEqual(a4.size(), [2,2]);
    assert.deepEqual(a4.valueOf(), [[5,6],[7,12]]);
    var a5 = math.pow(a2, 2);
    assert.ok(a5 instanceof math.type.Matrix);
    assert.deepEqual(a5.size(), [2,2]);
    assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);
  });

  it('should bitwise or a scalar and a matrix correctly', function () {
    assert.deepEqual(bitOr(12, math.matrix([3,9])), math.matrix([15,13]));
    assert.deepEqual(bitOr(math.matrix([3,9]), 12), math.matrix([15,13]));
  });

  it('should bitwise or a scalar and an array correctly', function () {
    assert.deepEqual(bitOr(12, [3,9]), [15,13]);
    assert.deepEqual(bitOr([3,9], 12), [15,13]);
  });

  it('should bitwise or a matrix and an array correctly', function () {
    var a = [6,4,28];
    var b = math.matrix([13,92,101]);
    var c = bitOr(a, b);

    assert.ok(c instanceof math.type.Matrix);
    assert.deepEqual(c, math.matrix([15,92,125]));
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {bitOr(1)}, error.ArgumentsError);
    assert.throws(function () {bitOr(1, 2, 3)}, error.ArgumentsError);
  });

});
