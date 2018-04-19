// test sqrtm
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math   = require('../../../index');

describe('sqrtm', function () {

  it('should return the principal square root of a matrix', function() {
    approx.deepEqual(
      math.sqrtm(
        [[33, 24],
         [48, 57]]),
      math.matrix(
        [[5, 2],
         [4, 7]]));

    approx.deepEqual(
      math.sqrtm(
        [[ 7, 10],
         [15, 22]]),
      math.matrix(
        [[1.5667, 1.7408],
         [2.6112, 4.1779]]));

    approx.deepEqual(
      math.sqrtm(
        [[ 5, -4,  1,  0,  0],
         [-4,  6, -4,  1,  0],
         [ 1, -4,  6, -4,  1],
         [ 0,  1, -4,  6, -4],
         [ 0,  0,  1, -4,  6]]),
      math.matrix(
        [[ 2.001450032980806, -0.997069854672086,  0.004226841220338,  0.004648098208404,  0.003162179891248],
         [-0.997069854672086,  2.006191486385745, -0.990363307725271,  0.011838782789231,  0.009369460553432],
         [ 0.004226841220338, -0.990363307725271,  2.017072849046023, -0.974622709753106,  0.026274470491696],
         [ 0.004648098208404,  0.011838782789231, -0.974622709753106,  2.050268428894304, -0.919971837350421],
         [ 0.003162179891248,  0.009369460553432,  0.026274470491696, -0.919971837350421,  2.269992000979243]]));
  });

  it('should return the principal square root of a matrix with just one value', function() {
    assert.deepEqual(math.sqrtm([4]), math.matrix([2]));
    assert.deepEqual(math.sqrtm([16]), math.matrix([4]));
    assert.deepEqual(math.sqrtm([20.25]), math.matrix([4.5]));
  });

});
