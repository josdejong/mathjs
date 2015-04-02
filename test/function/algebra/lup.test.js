// test abs
var assert = require('assert'),
    math = require('../../../index');

describe('lup', function () {
  
  it('should decompose matrix, n x n, no pivoting, ccs format', function () {
    
    var m = math.matrix([[2, 1], [1, 4]], 'ccs');

    var r = math.lup(m);
    // L
    assert.deepEqual(r[0], math.matrix([[1, 0], [0.5, 1]], 'ccs'));
    // U
    assert.deepEqual(r[1], math.matrix([[2, 1], [0, 3.5]], 'ccs'));
    // P
    assert.deepEqual(r[2], math.matrix([[1, 0], [0, 1]], 'ccs'));
    // verify
    assert.deepEqual(math.multiply(m, r[2]), math.multiply(r[0], r[1]));
  });
});