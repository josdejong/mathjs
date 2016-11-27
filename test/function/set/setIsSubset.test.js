// test setIsSubset
var assert = require('assert');
var math = require('../../../index');

describe('setIsSubset', function () {
  it('should return true or false', function () {
    assert.strictEqual(math.setIsSubset([1, 2], [1, 2, 3, 4]), true);
    assert.strictEqual(math.setIsSubset([1, 2, 3, 4], [1, 2]), false);
    assert.strictEqual(math.setIsSubset([], [1, 2]), true);
    assert.strictEqual(math.setIsSubset([], []), true);
  });

  it('should return true or false', function () {
    assert.strictEqual(math.setIsSubset([1, 1, 2, 3, 4, 4], [1, 2, 3, 4, 4, 4]), false);
    assert.strictEqual(math.setIsSubset([1, 2, 3, 4, 4], [1, 2, 3, 4, 4, 4]), true);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.setIsSubset();}, /TypeError: Too few arguments/);
    assert.throws(function () {math.setIsSubset([], [], []);}, /TypeError: Too many arguments/);
  });

});
