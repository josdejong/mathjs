// test setDistinct
var assert = require('assert');
var math = require('../../../index');

describe('setDistinct', function () {
  it('should return the elements of a set', function () {
    assert.deepEqual(math.setDistinct([1, 2]), [1, 2]);
    assert.deepEqual(math.setDistinct([]), []);
  });

  it('should return the distinct elements of a multiset', function () {
    assert.deepEqual(math.setDistinct([1, 1, 2, 2]), [1, 2]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.setDistinct();}, /TypeError: Too few arguments/);
    assert.throws(function () {math.setDistinct([], []);}, /TypeError: Too many arguments/);
  });

});
