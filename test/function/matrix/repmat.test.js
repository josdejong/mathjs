var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    repmat = math.repmat,
    matrix = math.matrix;

describe('repmat', function() {

  var a = [[1,2], [3,4]];
  var b = math.matrix(a);

  it('should creates a large array or matrix consisting of an m-by-n tiling of copies of a', function() {
    assert.deepEqual(repmat(a, 2), [[1,2,1,2], [3,4,3,4], [1,2,1,2], [3,4,3,4]]);
    assert.deepEqual(repmat(b, 3, 1), new matrix([[1,2], [3,4], [1,2], [3,4], [1,2], [3,4]]));
  });

  it('should throw an arguments error', function() {
    assert.throws(function () {repmat(a)}, error.ArgumentsError);
  });

});
