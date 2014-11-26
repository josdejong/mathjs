// test leftShift
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    //bignumber = math.bignumber,
    leftShift = math.leftShift;

describe('leftShift', function () {

  it('should left shift a number by a given amount', function () {
    assert.equal(leftShift(0, 1000), 0);
    assert.equal(leftShift(2, 0), 2);
    assert.equal(leftShift(2, 3), 16);
    assert.equal(leftShift(2, 4), 32);
    assert.equal(leftShift(-2, 2), -8);
    assert.equal(leftShift(3, 3), 24);
    assert.equal(leftShift(-3, 2), -12);
    assert.equal(leftShift(-3, 3), -24);
  });

  it('should left shift booleans by a boolean amount', function () {
    assert.equal(leftShift(true, true), 2);
    assert.equal(leftShift(true, false), 1);
    assert.equal(leftShift(false, true), 0);
    assert.equal(leftShift(false, false), 0);
  });

  it('should left shift with a mix of numbers and booleans', function () {
    assert.equal(leftShift(2, true), 4);
    assert.equal(leftShift(2, false), 2);
    assert.equal(leftShift(true, 2), 4);
    assert.equal(leftShift(false, 2), 0);
  });

  it('should left shift numbers and null', function () {
    assert.equal(leftShift(1, null), 1);
    assert.equal(leftShift(null, 1), 0);
  });

  /*it('should left shift bignumbers', function () {
    assert.deepEqual(leftShift(bignumber(2), bignumber(3)), bignumber(16));
    assert.deepEqual(leftShift(bignumber(500), bignumber(100)), bignumber('633825300114114700748351602688000'));
    assert.deepEqual(leftShift(bignumber(-1), bignumber(2)), bignumber('-1'));
  });

  it('should left shift mixed numbers and bignumbers', function () {
    assert.deepEqual(leftShift(bignumber(2), 3), bignumber(16));
    assert.deepEqual(leftShift(2, bignumber(3)), bignumber(16));

    approx.equal(leftShift(-1, bignumber(2)), bignumber(-4));
    approx.equal(leftShift(bignumber(-1), 2), bignumber(-4));
  });

  it('should left shift mixed booleans and bignumbers', function () {
    assert.deepEqual(leftShift(true, bignumber(3)), bignumber(8));
    assert.deepEqual(leftShift(false, bignumber(3)), bignumber(0));
    assert.deepEqual(leftShift(bignumber(3), false), bignumber(3));
    assert.deepEqual(leftShift(bignumber(3), true), bignumber(6));
  });*/

  it('should left shift by values given by strings', function () {
    assert.equal(leftShift('0', '1000'), 0);
    assert.equal(leftShift('2', 0), 2);
    assert.equal(leftShift(2, '3'), 16);
    assert.equal(leftShift('-2', 2), -8);
  });

  it('should throw an error if string value is invalid', function () {
    assert.throws(function () {
      leftShift('This is not a number!', '12');
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      leftShift('This is still not a number!', 12);
    }, /Parameter x contains a NaN value/);
    assert.throws(function () {
      leftShift(1, 'kung');
    }, /Parameter y contains a NaN value/);
    assert.throws(function () {
      leftShift('1', 'foo');
    }, /Parameter y contains a NaN value/);
  });

  it('should element-wise left shift a matrix', function () {
    var a = math.matrix([1,2]);
    var b = leftShift(a, 2); 
    assert.ok(b instanceof math.type.Matrix);
    assert.deepEqual(b, math.matrix([4,8]));

    a = math.matrix([[1,2],[3,4]]);
    b = leftShift(a, 2);
    assert.ok(b instanceof math.type.Matrix);
    assert.deepEqual(b, math.matrix([[4,8],[12,16]]));
  });

  it('should element-wise left shift an array', function () {
    var a = [[1,2],[3,4]];
    assert.deepEqual(leftShift(a[0], 0), a[0]);
    assert.deepEqual(leftShift(a[0], 2), [4,8]);
    assert.deepEqual(leftShift(a, 0), a);
    assert.deepEqual(leftShift(a, 2), [[4,8],[12,16]]);
  });

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () {leftShift(1)}, error.ArgumentsError);
    assert.throws(function () {leftShift(1, 2, 3)}, error.ArgumentsError);
  });

});
