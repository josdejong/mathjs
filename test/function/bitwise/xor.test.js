// test xor
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    //bignumber = math.bignumber,
    xor = math.xor;

describe('xor', function () {

  it('should xor two numbers', function () {
    assert.equal(xor(53, 131), 182);
    assert.equal(xor(2, 3), 1);
    assert.equal(xor(-2, 3), -3);
    assert.equal(xor(2, -3), -1);
    assert.equal(xor(-5, -3), 6);
  });

  it('should xor booleans', function () {
    assert.equal(xor(true, true), 0);
    assert.equal(xor(true, false), 1);
    assert.equal(xor(false, true), 1);
    assert.equal(xor(false, false), 0);
  });

  it('should xor numbers and null', function () {
    assert.equal(math.xor(null, null), 0);
    assert.equal(math.xor(null, 1), 1);
    assert.equal(math.xor(1, null), 1);
  });

  it('should xor mixed numbers and booleans', function () {
    assert.equal(xor(0, true), 1);
    assert.equal(xor(0, false), 0);
    assert.equal(xor(true, 0), 1);
    assert.equal(xor(false, 0), 0);
    assert.equal(xor(true, 1), 0);
    assert.equal(xor(false, 1), 1);
  });

  it('should xor two measures of the same unit', function () {
    approx.deepEqual(xor(math.unit(33, 'km'), math.unit(100, 'mile')), math.unit(193.614, 'km'));

    var b = math.unit('12 m');
    var c = math.unit('12 cm');
    var d = math.unit('52 mm');
    approx.deepEqual(xor(b, d), math.unit(11.988, 'm'));
    approx.deepEqual(xor(c, d), math.unit(7.6, 'cm'));
  });

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () {
      xor(math.unit(5, 'km'), math.unit(100, 'gram'));
    });
  });

  it('should throw an error when one of the two units has undefined value', function () {
    assert.throws(function () {
      xor(math.unit('km'), math.unit('5gram'));
    }, /Parameter x contains a unit with undefined value/);
    assert.throws(function () {
      xor(math.unit('5 km'), math.unit('gram'));
    }, /Parameter y contains a unit with undefined value/);
  });

  it('should throw an error in case of a unit and non-unit argument', function () {
    assert.throws(function () {xor(math.unit('5cm'), 2)}, math.error.UnsupportedTypeError);
    assert.throws(function () {xor(math.unit('5cm'), new Date())}, math.error.UnsupportedTypeError);
    assert.throws(function () {xor(new Date(), math.unit('5cm'))}, math.error.UnsupportedTypeError);
  });

  it('should xor two ints, even in string format', function () {
    assert.equal(xor('120', '86'), 46);
    assert.equal(xor('86', 120), 46);
    assert.equal(xor('-120', '-86'), 34);
    assert.equal(xor(-120, '-86'), 34);
  });

  it('should throw an error in case of NaN argument', function () {
    assert.throws(function () {
      xor(NaN, 10);
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      xor('10', NaN);
    }, /Parameter y contains a NaN value/);
    assert.throws(function () {
      xor('This is not a number!', '12');
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      xor(12, '');
    }, /Parameter y contains a NaN value/);
  });

  it('should xor strings and matrices element wise', function () {
    assert.deepEqual(xor('42', ['1', 12, '31']), [43, 38, 53]);
    assert.deepEqual(xor(['1', 12, '31'], '42'), [43, 38, 53]);

    assert.deepEqual(xor('42', math.matrix(['1', 12, '31'])), math.matrix([43, 38, 53]));
    assert.deepEqual(xor(math.matrix(['1', 12, '31']), '42'), math.matrix([43, 38, 53]));
  });

  it('should xor matrices correctly', function () {
    var a2 = math.matrix([[1,2],[3,4]]);
    var a3 = math.matrix([[5,6],[7,8]]);
    var a4 = xor(a2, a3);
    assert.ok(a4 instanceof math.type.Matrix);
    assert.deepEqual(a4.size(), [2,2]);
    assert.deepEqual(a4.valueOf(), [[4,4],[4,12]]);
    var a5 = math.pow(a2, 2);
    assert.ok(a5 instanceof math.type.Matrix);
    assert.deepEqual(a5.size(), [2,2]);
    assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);
  });

  it('should xor a scalar and a matrix correctly', function () {
    assert.deepEqual(xor(12, math.matrix([3,9])), math.matrix([15,5]));
    assert.deepEqual(xor(math.matrix([3,9]), 12), math.matrix([15,5]));
  });

  it('should xor a scalar and an array correctly', function () {
    assert.deepEqual(xor(12, [3,9]), [15,5]);
    assert.deepEqual(xor([3,9], 12), [15,5]);
  });

  it('should xor a matrix and an array correctly', function () {
    var a = [6,4,28];
    var b = math.matrix([13,92,101]);
    var c = xor(a, b);

    assert.ok(c instanceof math.type.Matrix);
    assert.deepEqual(c, math.matrix([11,88,121]));
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {xor(1)}, error.ArgumentsError);
    assert.throws(function () {xor(1, 2, 3)}, error.ArgumentsError);
  });

});
