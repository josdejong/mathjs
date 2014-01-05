var assert = require('assert'),
    math = require('../../../index')(),
    combinations = math.combinations;

describe('combinations', function() {

  it('should calculate the combinations of a number taking k at a time', function() {
    assert.equal(combinations(0, 0), 1);
    assert.equal(combinations(7, 5), 21);
    assert.equal(combinations(20, 15), 15504);
    assert.equal(combinations(63, 7), 553270671);
  });

  it('should not work with non-integer and negative input', function() {
      assert.throws(function() {combinations(0.5, 3)});
  });

  it('should not work with the wrong number or type of arguments', function() {
      assert.throws(function() {combinations(5, 3, 2)});
      assert.throws(function() {combinations(true, "hello world")});
  });


});
