var assert = require('assert');
var math = require('../../../src/index.js');

describe('re', function() {

  it('should return the real part of a complex number', function() {
    assert.equal(math.re(math.complex(2,3)), 2);
    assert.equal(math.re(math.complex(-2,-3)), -2);
    assert.equal(math.re(math.i), 0);
  });

  it('should be the identity for a real number', function() {
    assert.equal(math.re(2), 2);
  });

  it('should be the identity for a string', function() {
    assert.equal(math.re('string'), 'string');
  });

  it('should be the identity for a boolean', function() {
    assert.equal(math.re(true), true);
  });

  it('should return the real part for each element in a matrix', function() {
    assert.deepEqual(math.re([2, math.complex('3-6i')]), [2, 3]);
    assert.deepEqual(math.re(math.matrix([2, math.complex('3-6i')])).valueOf(), [2, 3]);
  });

});