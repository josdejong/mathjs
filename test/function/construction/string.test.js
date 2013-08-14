var assert = require('assert'),
    math = require('../../../index.js'),
    string = math.string;

describe('string', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('string(123)'), '123');
    assert.equal(math.eval('string(2+3i)'), '2 + 3i');
    assert.equal(math.eval('string(1:6)'), '[1, 2, 3, 4, 5]');
    assert.equal(math.eval('string(2 inch)'), '2 inch');
    assert.equal(math.eval('string([1,2;3,4])'), '[[1, 2], [3, 4]]');
  });

  it('should be \'\' if called with no argument', function() {
    assert.equal(string(), '');
  });

  it('should be \'true\' if called with true, \'false\' if called with false', function() {
    assert.equal(string(true), 'true');
    assert.equal(string(false), 'false');
  });

  it('should be the identity if called with a string', function() {
    assert.equal(string('hello'), 'hello');
    assert.equal(string(''), '');
    assert.equal(string(' '), ' ');
  });

  it('should convert a number to string', function() {
    assert.equal(string(1/8), '0.125');
    assert.equal(string(2.1e-3), '0.0021');
    assert.equal(string(123456789), '1.2346e8'); // TODO: is it desirable that value is rounded?
    assert.equal(string(2000000), '2e6');
  });

  it('should convert a complex number to string', function() {
    assert.equal(string(math.complex(2,3)), '2 + 3i');
  });

  it('should convert a unit to string', function() {
    assert.equal(string(math.unit('5cm')), '50 mm');
  });

  it('should convert a matrix/range/array to string', function() {
    assert.equal(string([[1,2],[3,4]]), '[[1, 2], [3, 4]]');
    assert.equal(string(math.matrix([[1,2],[3,4]])), '[[1, 2], [3, 4]]');
    assert.equal(string(math.range(1,6)), '[1, 2, 3, 4, 5]');
  });

  it('should throw an error if called with wrong number of arguments', function() {
    assert.throws(function () {string(1,2)}, SyntaxError);
    assert.throws(function () {string(1,2,3)}, SyntaxError);
  });
});
