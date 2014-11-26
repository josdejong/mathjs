// test rightArithShift
var assert = require('assert'),
    //approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    //bignumber = math.bignumber,
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

  it('should right arithmetically shift by values given by strings', function () {
    assert.equal(rightArithShift('0', '1000'), 0);
    assert.equal(rightArithShift('2', 0), 2);
    assert.equal(rightArithShift(22, '3'), 2);
    assert.equal(rightArithShift('-256', 2), -64);
  });

  it('should throw an error if string value is invalid', function () {
    assert.throws(function () {
      rightArithShift('This is not a number!', '12');
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      rightArithShift('This is still not a number!', 12);
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      rightArithShift(1, 'kung');
    }, /Parameter y contains a NaN value/);
    assert.throws(function () {
      rightArithShift('1', 'foo');
    }, /Parameter y contains a NaN value/);
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

});
