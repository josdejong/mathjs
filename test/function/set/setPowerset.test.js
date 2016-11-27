// test setPowerset
var assert = require('assert');
var math = require('../../../index');

describe('setPowerset', function () {
  it('should return the powerset of a set', function () {
    assert.deepEqual(math.setPowerset([1, 2]), [[], [1], [2], [1, 2]]);
    assert.deepEqual(math.setPowerset([]), []);
  });

  it('should return the powerset of a multiset', function () {
    assert.deepEqual(math.setPowerset([1, 1]), [[], [1], [1], [1, 1]]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.setPowerset();}, /TypeError: Too few arguments/);
    assert.throws(function () {math.setPowerset([], []);}, /TypeError: Too many arguments/);
  });

});
