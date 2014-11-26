// test and
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    //bignumber = math.bignumber,
    and = math.and;

describe('and', function () {

  it('should and two numbers', function () {
    assert.equal(and(53, 131), 1);
    assert.equal(and(2, 3), 2);
    assert.equal(and(-2, 3), 2);
    assert.equal(and(2, -3), 0);
    assert.equal(and(-5, -3), -7);
  });

  it('should and booleans', function () {
    assert.equal(and(true, true), 1);
    assert.equal(and(true, false), 0);
    assert.equal(and(false, true), 0);
    assert.equal(and(false, false), 0);
  });

  it('should and numbers and null', function () {
    assert.equal(math.and(null, null), 0);
    assert.equal(math.and(null, 1), 0);
    assert.equal(math.and(1, null), 0);
  });

  it('should and mixed numbers and booleans', function () {
    assert.equal(and(1, true), 1);
    assert.equal(and(1, false), 0);
    assert.equal(and(true, 1), 1);
    assert.equal(and(false, 1), 0);
  });

/*it('should add bignumbers', function () {
    assert.deepEqual(add(bignumber(0.1), bignumber(0.2)), bignumber(0.3));
    assert.deepEqual(add(bignumber('2e5001'), bignumber('3e5000')), bignumber('2.3e5001'));
    assert.deepEqual(add(bignumber('9999999999999999999'), bignumber('1')), bignumber('1e19'));
  });

  it('should add mixed numbers and bignumbers', function () {
    assert.deepEqual(add(bignumber(0.1), 0.2), bignumber(0.3));
    assert.deepEqual(add(0.1, bignumber(0.2)), bignumber(0.3));

    approx.equal(add(1/3, bignumber(1)), 1.333333333333333);
    approx.equal(add(bignumber(1), 1/3), 1.333333333333333);
  });

  it('should add mixed booleans and bignumbers', function () {
    assert.deepEqual(add(bignumber(0.1), true), bignumber(1.1));
    assert.deepEqual(add(bignumber(0.1), false), bignumber(0.1));
    assert.deepEqual(add(false, bignumber(0.2)), bignumber(0.2));
    assert.deepEqual(add(true, bignumber(0.2)), bignumber(1.2));
  });

  it('should add mixed complex numbers and bignumbers', function () {
    assert.deepEqual(add(math.complex(3, -4), bignumber(2)), math.complex(5, -4));
    assert.deepEqual(add(bignumber(2), math.complex(3, -4)), math.complex(5, -4));
  });*/

  it('should and two measures of the same unit', function () {
    approx.deepEqual(and(math.unit(33, 'km'), math.unit(100, 'mile')), math.unit(.16, 'km'));

    var b = math.unit('12 m');
    var c = math.unit('12 cm');
    var d = math.unit('52 mm');
    approx.deepEqual(and(b, d), math.unit(.032, 'm'));
    approx.deepEqual(and(c, d), math.unit(4.8, 'cm'));
  });

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () {
      and(math.unit(5, 'km'), math.unit(100, 'gram'));
    });
  });

  it('should throw an error when one of the two units has undefined value', function () {
    assert.throws(function () {
      and(math.unit('km'), math.unit('5gram'));
    }, /Parameter x contains a unit with undefined value/);
    assert.throws(function () {
      and(math.unit('5 km'), math.unit('gram'));
    }, /Parameter y contains a unit with undefined value/);
  });

  it('should throw an error in case of a unit and non-unit argument', function () {
    assert.throws(function () {and(math.unit('5cm'), 2)}, math.error.UnsupportedTypeError);
    assert.throws(function () {and(math.unit('5cm'), new Date())}, math.error.UnsupportedTypeError);
    assert.throws(function () {and(new Date(), math.unit('5cm'))}, math.error.UnsupportedTypeError);
  });

  it('should and two ints, even in string format', function () {
    assert.equal(and('120', '86'), 80);
    assert.equal(and('86', 120), 80);
    assert.equal(and('-120', '-86'), -120);
    assert.equal(and(-120, '-86'), -120);
  });

  it('should throw an error in case of NaN argument', function () {
    assert.throws(function () {
      and(NaN, 10);
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      and('10', NaN);
    }, /Parameter y contains a NaN value/);
    assert.throws(function () {
      and('This is not a number!', '12');
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      and(12, '');
    }, /Parameter y contains a NaN value/);
  });

  it('should and strings and matrices element wise', function () {
    assert.deepEqual(and('42', ['1', 12, '31']), [0, 8, 10]);
    assert.deepEqual(and(['1', 12, '31'], '42'), [0, 8, 10]);

    assert.deepEqual(and('42', math.matrix(['1', 12, '31'])), math.matrix([0, 8, 10]));
    assert.deepEqual(and(math.matrix(['1', 12, '31']), '42'), math.matrix([0, 8, 10]));
  });

  it('should add matrices correctly', function () {
    var a2 = math.matrix([[1,2],[3,4]]);
    var a3 = math.matrix([[5,6],[7,8]]);
    var a4 = and(a2, a3);
    assert.ok(a4 instanceof math.type.Matrix);
    assert.deepEqual(a4.size(), [2,2]);
    assert.deepEqual(a4.valueOf(), [[1,2],[3,0]]);
    var a5 = math.pow(a2, 2);
    assert.ok(a5 instanceof math.type.Matrix);
    assert.deepEqual(a5.size(), [2,2]);
    assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);
  });

  it('should and a scalar and a matrix correctly', function () {
    assert.deepEqual(and(12, math.matrix([3,9])), math.matrix([0,8]));
    assert.deepEqual(and(math.matrix([3,9]), 12), math.matrix([0,8]));
  });

  it('should and a scalar and an array correctly', function () {
    assert.deepEqual(and(12, [3,9]), [0,8]);
    assert.deepEqual(and([3,9], 12), [0,8]);
  });

  it('should and a matrix and an array correctly', function () {
    var a = [6,4,28];
    var b = math.matrix([13,92,101]);
    var c = and(a, b);

    assert.ok(c instanceof math.type.Matrix);
    assert.deepEqual(c, math.matrix([4,4,4]));
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {and(1)}, error.ArgumentsError);
    assert.throws(function () {and(1, 2, 3)}, error.ArgumentsError);
  });

});
