var assert = require('assert'),
error = require('../../../lib/error/index'),
math = require('../../../index'),
composition = math.composition;

describe('composition', function() {

  it('should calculate the number of ways to compose a set of n objects into k non-empty subsets', function() {
    assert.equal(composition(5,3), 6);
    assert.equal(composition(1,1), 1);
    assert.equal(composition(8,3), 21);
  });

  it('should calculate the composition of n items taken k at a time with BigNumbers', function(){
    assert.equal(composition(math.bignumber(7), math.bignumber(5)), math.bignumber(15));
    assert.equal(composition(math.bignumber(70), math.bignumber(3)), math.bignumber(2346));
    assert.equal(composition(math.bignumber(56), math.bignumber(11)), math.bignumber(29248649430));
  });

  it('should not work with non-integer and negative input', function() {
    assert.throws(function() {composition(0.5, 3)}, TypeError);
    assert.throws(function() {composition(3, 5)}, TypeError);
    assert.throws(function() {composition(math.bignumber(3), math.bignumber(5))}, TypeError);
    assert.throws(function() {composition(math.bignumber(3.5), math.bignumber(-3))}, TypeError);
    assert.throws(function() {composition(math.bignumber(3.5), 1/3)}, TypeError);
  });

  it('should not work with the wrong number or type of arguments', function() {
    assert.throws(function() {composition(5, 3, 2)});
    assert.throws(function() {composition(true, "hello world")});
  });
});
