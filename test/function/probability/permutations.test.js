var assert = require('assert'),
    math = require('../../../index')(),
    permutations = math.permutations;

describe('permutations', function() {

  it('should calculate the permutations of a number', function() {
    assert.equal(permutations(0), 1);
    assert.equal(permutations(1), 1);
    assert.equal(permutations(2), 2);
    assert.equal(permutations(3), 6);
    assert.equal(permutations(4), 24);
    assert.equal(permutations(5), 120);
  });

  it('should calculate the permutations of a number, taking k at a time', function() {
    assert.equal(permutations(5, 4), 120);
    assert.equal(permutations(9, 8), 362880);
    assert.equal(permutations(7, 5), 2520);
  });

  it('should fail loudly when k is larger than x', function() {
      assert.throws(function(){permutations(5, 6);}, TypeError);
  });

  it('should not accept negative or non-integer arguments', function() {
      assert.throws(function(){permutations(12, -6);}, TypeError);
      assert.throws(function(){permutations(-12, -6);}, TypeError);
  });

});
