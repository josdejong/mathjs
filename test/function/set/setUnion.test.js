// test setUnion
var assert = require('assert');
var math = require('../../../index');

describe('setUnion', function () {
  it('should return the union of two sets', function () {
    assert.deepEqual(math.setUnion([1, 2], [3, 4]), [1, 2, 3, 4]);
    assert.deepEqual(math.setUnion(["a", "b"], ["c", "d"]), ["a", "b", "c", "d"]);
    assert.deepEqual(math.setUnion([], [3, 4]), [3, 4]);
    assert.deepEqual(math.setUnion([], []), []);
  });

  it('should return the union of two multisets', function () {
    assert.deepEqual(math.setUnion([1, 1, 2, 3, 4, 4], [1, 2, 3, 4, 4, 4]), [1, 1, 2, 3, 4, 4, 4]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.setUnion();}, /TypeError: Too few arguments/);
    assert.throws(function () {math.setUnion([], [], []);}, /TypeError: Too many arguments/);
  });

});
