// test rightLogShift
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    rightLogShift = math.rightLogShift;

describe('rightLogShift', function () {

  it('should right logically shift a number by a given amount', function () {
    assert.equal(rightLogShift(0, 1000), 0);
    assert.equal(rightLogShift(2, 0), 2);
    assert.equal(rightLogShift(12, 3), 1);
    assert.equal(rightLogShift(32, 4), 2);
    assert.equal(rightLogShift(-1, 1000), 16777215);
    assert.equal(rightLogShift(-12, 2), 1073741821);
    assert.equal(rightLogShift(122, 3), 15);
    assert.equal(rightLogShift(-13, 2), 1073741820);
    assert.equal(rightLogShift(-13, 3), 536870910);
  });

  it('should right logically shift booleans by a boolean amount', function () {
    assert.equal(rightLogShift(true, true), 0);
    assert.equal(rightLogShift(true, false), 1);
    assert.equal(rightLogShift(false, true), 0);
    assert.equal(rightLogShift(false, false), 0);
  });

  it('should right logically shift with a mix of numbers and booleans', function () {
    assert.equal(rightLogShift(2, true), 1);
    assert.equal(rightLogShift(2, false), 2);
    assert.equal(rightLogShift(true, 0), 1);
    assert.equal(rightLogShift(true, 1), 0);
    assert.equal(rightLogShift(false, 2), 0);
  });

  it('should right logically shift numbers and null', function () {
    assert.equal(rightLogShift(1, null), 1);
    assert.equal(rightLogShift(null, 1), 0);
  });

  it('should throw an error if the parameters are not integers', function () {
    assert.throws(function () {
      rightLogShift(1.1, 1);
    }, /Parameters in function rightLogShift must be integer numbers/);
    assert.throws(function () {
      rightLogShift(1, 1.1);
    }, /Parameters in function rightLogShift must be integer numbers/);
    assert.throws(function () {
      rightLogShift(1.1, 1.1);
    }, /Parameters in function rightLogShift must be integer numbers/);
  });

  it('should throw an error if used with a unit', function() {
    assert.throws(function () {rightLogShift(math.unit('5cm'), 2)}, error.UnsupportedTypeError);
    assert.throws(function () {rightLogShift(2, math.unit('5cm'))}, error.UnsupportedTypeError);
    assert.throws(function () {rightLogShift(math.unit('2cm'), math.unit('5cm'))}, error.UnsupportedTypeError);
  });

  it('should element-wise right logically shift a matrix', function () {
    var a = math.matrix([4,8]);
    var b = rightLogShift(a, 2); 
    assert.ok(b instanceof math.type.Matrix);
    assert.deepEqual(b, math.matrix([1,2]));

    a = math.matrix([[4,8],[12,16]]);
    b = rightLogShift(a, 2); 
    assert.ok(b instanceof math.type.Matrix);
    assert.deepEqual(b, math.matrix([[1,2],[3,4]]));
  });

  it('should element-wise right logically shift an array', function () {
    var a = [[4,8],[12,16]];
    assert.deepEqual(rightLogShift(a[0], 0), a[0]);
    assert.deepEqual(rightLogShift(a[0], 2), [1,2]);
    assert.deepEqual(rightLogShift(a, 0), a);
    assert.deepEqual(rightLogShift(a, 2), [[1,2],[3,4]]);
  });

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () {rightLogShift(1)}, error.ArgumentsError);
    assert.throws(function () {rightLogShift(1, 2, 3)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () {rightLogShift(new Date(), true)}, error.UnsupportedTypeError);
    assert.throws(function () {rightLogShift(true, new Date())}, error.UnsupportedTypeError);
    assert.throws(function () {rightLogShift(true, 'foo')}, error.UnsupportedTypeError);
    assert.throws(function () {rightLogShift('foo', true)}, error.UnsupportedTypeError);
    assert.throws(function () {rightLogShift(true, undefined)}, error.UnsupportedTypeError);
    assert.throws(function () {rightLogShift(undefined, true)}, error.UnsupportedTypeError);
  });

});
