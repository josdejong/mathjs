var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bool = math['boolean'];

describe('boolean', function() {

  it('should convert a boolean to a boolean', function() {
    assert.equal(bool(true), true);
    assert.equal(bool(false), false);
  });

  it('should convert null to a boolean', function() {
    assert.equal(bool(null), false);
  });

  it('should convert a number into a boolean', function() {
    assert.equal(bool(-2), true);
    assert.equal(bool(-1), true);
    assert.equal(bool(0), false);
    assert.equal(bool(1), true);
    assert.equal(bool(2), true);
  });

  it('should convert a bignumber into a boolean', function() {
    assert.equal(bool(math.bignumber(-2)), true);
    assert.equal(bool(math.bignumber(-1)), true);
    assert.equal(bool(math.bignumber(0)), false);
    assert.equal(bool(math.bignumber(1)), true);
    assert.equal(bool(math.bignumber(2)), true);
  });

  it('should convert the elements of a matrix or array to booleans', function() {
    assert.deepEqual(bool(math.matrix([1,0,1,1])), math.matrix([true, false, true, true]));
    assert.deepEqual(bool([1,0,1,1]), [true, false, true, true]);
  });

  it('should convert a string into a boolean', function() {
    assert.equal(bool('true'), true);
    assert.equal(bool('false'), false);

    assert.equal(bool('True'), true);
    assert.equal(bool('False'), false);

    assert.equal(bool('1'), true);
    assert.equal(bool('0'), false);
    assert.equal(bool(' 0 '), false);

    assert.equal(bool('2'), true);
    assert.equal(bool(' 4e2 '), true);
    assert.equal(bool(' -4e2 '), true);
  });

  it('should convert a Boolean into a boolean', function() {
    assert.equal(bool(new Boolean(true)), true);
    assert.equal(bool(new Boolean(false)), false);
  });

  it('should throw an error if the string is not a valid number', function() {
    assert.throws(function () {bool('')}, SyntaxError);
    assert.throws(function () {bool('23a')}, SyntaxError);
  });

  it('should throw an error if there\'s a wrong number of arguments', function() {
    assert.throws(function () {bool(1,2)}, error.ArgumentsError);
    assert.throws(function () {bool(1,2,3)}, error.ArgumentsError);
  });

  it('should throw an error if used with a complex', function() {
    assert.throws(function () {bool(math.complex(2,3))}, SyntaxError);
  });

  it('should throw an error if used with a unit', function() {  
    assert.throws(function () {bool(math.unit('5cm'))}, SyntaxError);
  });

  it('should LaTeX boolean', function () {
    var expression = math.parse('boolean(1)');
    assert.equal(expression.toTex(), '\\mathrm{boolean}\\left(1\\right)');
  });

});
