var assert = require('assert');
var math = require('../../../index');

describe('diag', function() {

  it('should return a diagonal matrix on the default diagonal', function() {
    assert.deepEqual(math.diag([1,2,3]).valueOf(), [[1,0,0],[0,2,0],[0,0,3]]);
    assert.deepEqual(math.diag([[1,2,3],[4,5,6]]).valueOf(), [1,5]);
  });

  it('should return a diagonal matrix on the given diagonal', function() {
    assert.deepEqual(math.diag([1,2,3], 1).valueOf(), [[0,1,0,0],[0,0,2,0],[0,0,0,3]]);
    assert.deepEqual(math.diag([1,2,3], -1).valueOf(), [[0,0,0],[1,0,0],[0,2,0],[0,0,3]]);
    assert.deepEqual(math.diag([[1,2,3],[4,5,6]], 1).valueOf(), [2,6]);
    assert.deepEqual(math.diag([[1,2,3],[4,5,6]],-1).valueOf(), [4]);
    assert.deepEqual(math.diag([[1,2,3],[4,5,6]],-2).valueOf(), []);
  });

  it('should throw an error of the input matrix is not valid', function() {
    assert.throws(function () {math.diag([[[1],[2]],[[3],[4]]])});
    // TODO: test diag for all types of input (also scalar)
  });

});