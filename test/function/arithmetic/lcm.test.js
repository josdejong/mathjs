var assert = require('assert');
var math = require('../../../lib/index.js');

describe('lcm', function() {

  it('should find the lowest common multiple of tow or more numbers', function() {
    assert.equal(math.lcm(4, 6), 12);
    assert.equal(math.lcm(4, -6), 12);
    assert.equal(math.lcm(6, 4), 12);
    assert.equal(math.lcm(-6, 4), 12);
    assert.equal(math.lcm(-6, -4), 12);
    assert.equal(math.lcm(21, 6), 42);
    assert.equal(math.lcm(3, -4, 24), 24);
    assert.throws(function () {math.lcm(1); }, SyntaxError, 'Wrong number of arguments in function lcm (3 provided, 1-2 expected)');
  });

  it('should throw an error with complex numbers', function() {
    assert.throws(function () {math.lcm(math.complex(1,3),2); }, TypeError, 'Function lcm(complex, number) not supported');
  });

  it('should throw an error with strings', function() {
    assert.throws(function () {math.lcm('a', 2); }, TypeError, 'Function lcm(string, number) not supported');
    assert.throws(function () {math.lcm(2, 'a'); }, TypeError, 'Function lcm(number, string) not supported');
  });

  it('should throw an error with units', function() {
    assert.throws(function () { math.lcm(math.unit('5cm'), 2); }, TypeError, 'Function lcm(unit, number) not supported');
  });

  it('should perform element-wise lcm on two or more matrices of the same size', function() {
    assert.deepEqual(math.lcm([5,2,3], [25,3,6]), [25, 6, 6]);
  });

});