// test sqrtm
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math   = require('../../../index');

describe('sqrtm', function () {

  it('should return the principal square root of a matrix', function() {
    approx.deepEqual(math.sqrtm([[33, 24], [48, 57]]), math.matrix([[5, 2], [4, 7]]));
    approx.deepEqual(math.sqrtm([[2, 4], [4, 1]]), math.matrix([[4, -1], [-1, 4]]));
  });

  it('should return the principal square root of a matrix with just one value', function() {
    assert.deepEqual(math.sqrtm([4]), math.matrix([2]));
    assert.deepEqual(math.sqrtm([16]), math.matrix([4]));
    assert.deepEqual(math.sqrtm([20.25]), math.matrix([4.5]));
  });

});
