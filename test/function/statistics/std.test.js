var assert = require('assert'),
    math = require('../../../index')(),
    bignumber = math.bignumber,
    std = math.std;

describe('std', function() {
  it('should return the standard deviation of some numbers', function() {
    assert.throws(function() {std()});
    assert.throws(function() {std(5)});
    assert.deepEqual(std([1,2,3,4]), 1.118033988749894848204587);
    assert.deepEqual(std([ [1,5], [2,6], [3,7]], 1), [2, 2, 2]);
  });

});
