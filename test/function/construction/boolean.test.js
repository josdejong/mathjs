var assert = require('assert'),
    math = require('../../../lib/index.js'),
    bool = math.boolean;

describe('boolean', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('boolean("true")'), true);
    assert.equal(math.eval('boolean("false")'), false);
    assert.equal(math.eval('boolean(true)'), true);
    assert.equal(math.eval('boolean(false)'), false);
    assert.equal(math.eval('boolean(1)'), true);
    assert.equal(math.eval('boolean(2)'), true);
    assert.equal(math.eval('boolean(0)'), false);
  });

  it('should be the identity with a boolean', function() {
    assert.equal(bool(true), true);
    assert.equal(bool(false), false);
  });

  it('should return false for 0, true for any other number', function() {
    assert.equal(bool(-2), true);
    assert.equal(bool(-1), true);
    assert.equal(bool(0), false);
    assert.equal(bool(1), true);
    assert.equal(bool(2), true);
  });

  it('should return false for \'0\', true for any other valid number string', function() {
    assert.equal(bool('2'), true);
    assert.equal(bool(' 4e2 '), true);
    assert.equal(bool(' -4e2 '), true);
    assert.equal(bool('0'), false);
    assert.equal(bool(' 0 '), false);
  });

  it('should throw an error if the string is not a valid number', function() {
    assert.throws(function () {bool('')}, SyntaxError);
    assert.throws(function () {bool('23a')}, SyntaxError);
  });

  it('should throw an error if there\'s a wrong number of arguments', function() {
    assert.throws(function () {bool(1,2)}, SyntaxError);
    assert.throws(function () {bool(1,2,3)}, SyntaxError);
  });

  it('should throw an error if used with a complex', function() {
    assert.throws(function () {bool(math.complex(2,3))}, SyntaxError);
  });

  it('should throw an error if used with a unit', function() {  
    assert.throws(function () {bool(math.unit('5cm'))}, SyntaxError);
  });

  it('should throw an error if used with a range, matrix or array', function() {
    assert.throws(function () {bool(math.range(1,3))}, SyntaxError);
    assert.throws(function () {bool(math.matrix([1,3]))}, SyntaxError);
    assert.throws(function () {bool([1,3])}, SyntaxError);
  });

});