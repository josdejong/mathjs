// test rightArithShift
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    rightArithShift = math.rightArithShift;

describe('rightArithShift', function () {

  it('should right arithmetically shift a number by a given amount', function () {
    assert.equal(rightArithShift(0, 1000), 0);
    assert.equal(rightArithShift(2, 0), 2);
    assert.equal(rightArithShift(12, 3), 1);
    assert.equal(rightArithShift(32, 4), 2);
    assert.equal(rightArithShift(-1, 1000), -1);
    assert.equal(rightArithShift(-12, 2), -3);
    assert.equal(rightArithShift(122, 3), 15);
    assert.equal(rightArithShift(-13, 2), -4);
    assert.equal(rightArithShift(-13, 3), -2);
  });

  it('should right arithmetically shift booleans by a boolean amount', function () {
    assert.equal(rightArithShift(true, true), 0);
    assert.equal(rightArithShift(true, false), 1);
    assert.equal(rightArithShift(false, true), 0);
    assert.equal(rightArithShift(false, false), 0);
  });

  it('should right arithmetically shift with a mix of numbers and booleans', function () {
    assert.equal(rightArithShift(2, true), 1);
    assert.equal(rightArithShift(2, false), 2);
    assert.equal(rightArithShift(true, 0), 1);
    assert.equal(rightArithShift(true, 1), 0);
    assert.equal(rightArithShift(false, 2), 0);
  });

  it('should right arithmetically shift numbers and null', function () {
    assert.equal(rightArithShift(1, null), 1);
    assert.equal(rightArithShift(null, 1), 0);
  });

  it('should right arithmetically shift bignumbers', function () {
    assert.deepEqual(rightArithShift(bignumber(17), bignumber(3)), bignumber(2));
    assert.deepEqual(rightArithShift(bignumber('633825300114114700748351602688000'), bignumber(100)), bignumber(500));
    assert.deepEqual(rightArithShift(bignumber(-17), bignumber(3)), bignumber(-3));
    assert.equal(rightArithShift(bignumber(-17), bignumber(-3)).isNaN(), true);
    assert.equal(rightArithShift(bignumber(Infinity), bignumber(Infinity)).isNaN(), true);
    assert.deepEqual(rightArithShift(bignumber(-Infinity), bignumber(Infinity)), bignumber(-1));
  });

  it('should right arithmetically shift mixed numbers and bignumbers', function () {
    assert.deepEqual(rightArithShift(bignumber(17), 3), bignumber(2));
    assert.deepEqual(rightArithShift(bignumber('-633825300114114700748351602688000'), 100), bignumber(-500));
    assert.equal(rightArithShift(bignumber(-17), -3).isNaN(), true);
    assert.deepEqual(rightArithShift(17, bignumber(3)), bignumber(2));
    assert.deepEqual(rightArithShift(-17, bignumber(3)), bignumber(-3));
    assert.equal(rightArithShift(-3, bignumber(-17)).isNaN(), true);
    assert.deepEqual(rightArithShift(bignumber(-Infinity), Infinity), bignumber(-1));
    assert.equal(rightArithShift(bignumber(Infinity), Infinity).isNaN(), true);
    assert.equal(rightArithShift(Infinity, bignumber(Infinity)).isNaN(), true);
  });

  it('should right arithmetically shift mixed booleans and bignumbers', function () {
    assert.deepEqual(rightArithShift(true, bignumber(0)), bignumber(1));
    assert.deepEqual(rightArithShift(false, bignumber('1000000')), bignumber(0));
    assert.deepEqual(rightArithShift(bignumber(3), false), bignumber(3));
    assert.deepEqual(rightArithShift(bignumber(3), true), bignumber(1));
  });

  it('should throw an error if the parameters are not integers', function () {
    assert.throws(function () {
      rightArithShift(1.1, 1);
    }, /Parameters in function rightArithShift must be integer numbers/);
    assert.throws(function () {
      rightArithShift(1, 1.1);
    }, /Parameters in function rightArithShift must be integer numbers/);
    assert.throws(function () {
      rightArithShift(1.1, 1.1);
    }, /Parameters in function rightArithShift must be integer numbers/);
    assert.throws(function () {
      rightArithShift(bignumber(1.1), 1);
    }, /Parameters in function rightArithShift must be integer numbers/);
    assert.throws(function () {
      rightArithShift(1, bignumber(1.1));
    }, /Parameters in function rightArithShift must be integer numbers/);
    assert.throws(function () {
      rightArithShift(bignumber(1.1), bignumber(1));
    }, /Parameters in function rightArithShift must be integer numbers/);
    assert.throws(function () {
      rightArithShift(bignumber(1), bignumber(1.1));
    }, /Parameters in function rightArithShift must be integer numbers/);
  });

  it('should throw an error if used with a unit', function() {
    assert.throws(function () {rightArithShift(math.unit('5cm'), 2)}, error.UnsupportedTypeError);
    assert.throws(function () {rightArithShift(2, math.unit('5cm'))}, error.UnsupportedTypeError);
    assert.throws(function () {rightArithShift(math.unit('2cm'), math.unit('5cm'))}, error.UnsupportedTypeError);
  });

  it('should element-wise right arithmetically shift a matrix', function () {
    var a = math.matrix([4,8]);
    var b = rightArithShift(a, 2); 
    assert.ok(b instanceof math.type.Matrix);
    assert.deepEqual(b, math.matrix([1,2]));

    a = math.matrix([[4,8],[12,16]]);
    b = rightArithShift(a, 2); 
    assert.ok(b instanceof math.type.Matrix);
    assert.deepEqual(b, math.matrix([[1,2],[3,4]]));
  });

  it('should element-wise right arithmetically shift an array', function () {
    var a = [[4,8],[12,16]];
    assert.deepEqual(rightArithShift(a[0], 0), a[0]);
    assert.deepEqual(rightArithShift(a[0], 2), [1,2]);
    assert.deepEqual(rightArithShift(a, 0), a);
    assert.deepEqual(rightArithShift(a, 2), [[1,2],[3,4]]);
  });

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () {rightArithShift(1)}, error.ArgumentsError);
    assert.throws(function () {rightArithShift(1, 2, 3)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () {rightArithShift(new Date(), true)}, error.UnsupportedTypeError);
    assert.throws(function () {rightArithShift(true, new Date())}, error.UnsupportedTypeError);
    assert.throws(function () {rightArithShift(true, 'foo')}, error.UnsupportedTypeError);
    assert.throws(function () {rightArithShift('foo', true)}, error.UnsupportedTypeError);
    assert.throws(function () {rightArithShift(true, undefined)}, error.UnsupportedTypeError);
    assert.throws(function () {rightArithShift(undefined, true)}, error.UnsupportedTypeError);
  });

});
