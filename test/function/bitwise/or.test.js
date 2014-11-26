// test and
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    //bignumber = math.bignumber,
    or = math.or;

describe('or', function () {

  it('should or two numbers', function () {
    assert.equal(or(53, 131), 183);
    assert.equal(or(2, 3), 3);
    assert.equal(or(-2, 3), -1);
    assert.equal(or(2, -3), -1);
    assert.equal(or(-5, -3), -1);
  });

  it('should or booleans', function () {
    assert.equal(or(true, true), 1);
    assert.equal(or(true, false), 1);
    assert.equal(or(false, true), 1);
    assert.equal(or(false, false), 0);
  });

  it('should or numbers and null', function () {
    assert.equal(math.or(null, null), 0);
    assert.equal(math.or(null, 1), 1);
    assert.equal(math.or(1, null), 1);
  });

  it('should or mixed numbers and booleans', function () {
    assert.equal(or(0, true), 1);
    assert.equal(or(0, false), 0);
    assert.equal(or(true, 0), 1);
    assert.equal(or(false, 0), 0);
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

  it('should or two measures of the same unit', function () {
    approx.deepEqual(or(math.unit(33, 'km'), math.unit(100, 'mile')), math.unit(193.774, 'km'));

    var b = math.unit('12 m');
    var c = math.unit('12 cm');
    var d = math.unit('52 mm');
    approx.deepEqual(or(b, d), math.unit(12.02, 'm'));
    approx.deepEqual(or(c, d), math.unit(12.4, 'cm'));
  });

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () {
      or(math.unit(5, 'km'), math.unit(100, 'gram'));
    });
  });

  it('should throw an error when one of the two units has undefined value', function () {
    assert.throws(function () {
      or(math.unit('km'), math.unit('5gram'));
    }, /Parameter x contains a unit with undefined value/);
    assert.throws(function () {
      or(math.unit('5 km'), math.unit('gram'));
    }, /Parameter y contains a unit with undefined value/);
  });

  it('should throw an error in case of a unit and non-unit argument', function () {
    assert.throws(function () {or(math.unit('5cm'), 2)}, math.error.UnsupportedTypeError);
    assert.throws(function () {or(math.unit('5cm'), new Date())}, math.error.UnsupportedTypeError);
    assert.throws(function () {or(new Date(), math.unit('5cm'))}, math.error.UnsupportedTypeError);
  });

  it('should or two ints, even in string format', function () {
    assert.equal(or('120', '86'), 126);
    assert.equal(or('86', 120), 126);
    assert.equal(or('-120', '-86'), -86);
    assert.equal(or(-120, '-86'), -86);
  });

  it('should throw an error in case of NaN argument', function () {
    assert.throws(function () {
      or(NaN, 10);
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      or('10', NaN);
    }, /Parameter y contains a NaN value/);
    assert.throws(function () {
      or('This is not a number!', '12');
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      or(12, '');
    }, /Parameter y contains a NaN value/);
  });

  it('should or strings and matrices element wise', function () {
    assert.deepEqual(or('42', ['1', 12, '31']), [43, 46, 63]);
    assert.deepEqual(or(['1', 12, '31'], '42'), [43, 46, 63]);

    assert.deepEqual(or('42', math.matrix(['1', 12, '31'])), math.matrix([43, 46, 63]));
    assert.deepEqual(or(math.matrix(['1', 12, '31']), '42'), math.matrix([43, 46, 63]));
  });

  it('should or matrices correctly', function () {
    var a2 = math.matrix([[1,2],[3,4]]);
    var a3 = math.matrix([[5,6],[7,8]]);
    var a4 = or(a2, a3);
    assert.ok(a4 instanceof math.type.Matrix);
    assert.deepEqual(a4.size(), [2,2]);
    assert.deepEqual(a4.valueOf(), [[5,6],[7,12]]);
    var a5 = math.pow(a2, 2);
    assert.ok(a5 instanceof math.type.Matrix);
    assert.deepEqual(a5.size(), [2,2]);
    assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);
  });

  it('should or a scalar and a matrix correctly', function () {
    assert.deepEqual(or(12, math.matrix([3,9])), math.matrix([15,13]));
    assert.deepEqual(or(math.matrix([3,9]), 12), math.matrix([15,13]));
  });

  it('should or a scalar and an array correctly', function () {
    assert.deepEqual(or(12, [3,9]), [15,13]);
    assert.deepEqual(or([3,9], 12), [15,13]);
  });

  it('should or a matrix and an array correctly', function () {
    var a = [6,4,28];
    var b = math.matrix([13,92,101]);
    var c = or(a, b);

    assert.ok(c instanceof math.type.Matrix);
    assert.deepEqual(c, math.matrix([15,92,125]));
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {or(1)}, error.ArgumentsError);
    assert.throws(function () {or(1, 2, 3)}, error.ArgumentsError);
  });

});
