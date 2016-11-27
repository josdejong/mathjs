// test setCartesian
var assert = require('assert');
var math = require('../../../index');

describe('setCartesian', function () {
  it('should return the cartesian product of two sets', function () {
    assert.deepEqual(math.setCartesian([1], [3]), [[1, 3]]);
    assert.deepEqual(math.setCartesian([1, 2], [3]), [[1, 3], [2, 3]]);
    assert.deepEqual(math.setCartesian([1, 2], [3, 4]), [[1, 3], [1, 4], [2, 3], [2, 4]]);
    assert.deepEqual(math.setCartesian([], [3, 4]), []);
    assert.deepEqual(math.setCartesian([], []), []);
  });

  it('should return the cartesian product of two multisets', function () {
    assert.deepEqual(math.setCartesian([1, 1], [3, 3]), [[1,3], [1, 3], [1, 3], [1, 3]]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.setCartesian();}, /TypeError: Too few arguments/);
    assert.throws(function () {math.setCartesian([], [], []);}, /TypeError: Too many arguments/);
  });

});
