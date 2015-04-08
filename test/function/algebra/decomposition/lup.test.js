// test abs
var assert = require('assert'),
    approx = require('../../../../tools/approx'),
    math = require('../../../../index');

describe('lup', function () {
  
  it('should decompose matrix, n x n, no pivoting, array', function () {

    var a = [[2, 1], [1, 4]];

    var r = math.lup(a);
    // L
    assert.deepEqual(r.L.valueOf(), [[1, 0], [0.5, 1]]);
    // U
    assert.deepEqual(r.U.valueOf(), [[2, 1], [0, 3.5]]);
    // P
    assert.deepEqual(r.P.valueOf(), [[1, 0], [0, 1]]);
    // verify
    approx.deepEqual(math.multiply(r.P, a), math.multiply(r.L, r.U));
  });
  
  it('should decompose matrix, n x n, no pivoting, ccs format', function () {
    
    var m = math.matrix([[2, 1], [1, 4]], 'ccs');

    var r = math.lup(m);
    // L
    assert.deepEqual(r.L.valueOf(), [[1, 0], [0.5, 1]]);
    // U
    assert.deepEqual(r.U.valueOf(), [[2, 1], [0, 3.5]]);
    // P
    assert.deepEqual(r.P.valueOf(), [[1, 0], [0, 1]]);
    // verify
    approx.deepEqual(r.P.multiply(m), r.L.multiply(r.U));
  });
  
  it('should decompose matrix, n x n, no pivoting, crs format', function () {

    var m = math.matrix([[2, 1], [1, 4]], 'crs');

    var r = math.lup(m);
    // L
    assert.deepEqual(r.L.valueOf(), [[1, 0], [0.5, 1]]);
    // U
    assert.deepEqual(r.U.valueOf(), [[2, 1], [0, 3.5]]);
    // P
    assert.deepEqual(r.P.valueOf(), [[1, 0], [0, 1]]);
    // verify
    approx.deepEqual(r.P.multiply(m), r.L.multiply(r.U));
  });
  
  it('should decompose matrix, n x n, no pivoting, dense format', function () {

    var m = math.matrix([[2, 1], [1, 4]], 'dense');

    var r = math.lup(m);
    // L
    assert.deepEqual(r.L.valueOf(), [[1, 0], [0.5, 1]]);
    // U
    assert.deepEqual(r.U.valueOf(), [[2, 1], [0, 3.5]]);
    // P
    assert.deepEqual(r.P.valueOf(), [[1, 0], [0, 1]]);
    // verify
    approx.deepEqual(r.P.multiply(m), r.L.multiply(r.U));
  });
});