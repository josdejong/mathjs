var assert = require('assert');
var math = require('../../../index.js');

describe('factorial', function() {

  it('should calculate the factorial of an integer', function() {
    assert.equal(math.factorial(0), 1);
    assert.equal(math.factorial(1), 1);
    assert.equal(math.factorial(2), 2);
    assert.equal(math.factorial(3), 6);
    assert.equal(math.factorial(4), 24);
    assert.equal(math.factorial(5), 120);
  });

  it('should calculate the factorial of each element in an array', function() {
    assert.deepEqual(math.factorial(math.range(0,6)), [1,1,2,6,24,120]);
  });

  it('should throw an error if called with negative number', function() {
    assert.throws(function() { math.factorial(-1); });
  });

  it('should throw an error if called with non-integer number', function() {  
    assert.throws(function() { math.factorial(1.5); });
  });

  it('should throw en error if called with invalid number of arguments', function() {
    assert.throws(function() { math.factorial(); });
    assert.throws(function() { math.factorial(1,3); });
  });


});