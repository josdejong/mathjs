// test abs
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index');

describe('lup', function () {
  
  it('should decompose matrix, n x n, no pivoting, ccs format', function () {
    
    var m = math.matrix([[2, 1], [1, 4]], 'ccs');

    var r = math.lup(m);
    // L
    assert.deepEqual(r.L, math.matrix([[1, 0], [0.5, 1]], 'ccs'));
    // U
    assert.deepEqual(r.U, math.matrix([[2, 1], [0, 3.5]], 'ccs'));
    // P
    assert.deepEqual(r.P, math.matrix([[1, 0], [0, 1]], 'ccs'));
    // verify
    approx.deepEqual(r.P.multiply(m), r.L.multiply(r.U));
  });
});