// test lup
var assert = require('assert'),
    approx = require('../../../../tools/approx'),
    math = require('../../../../index');

var sparse_lu = math.import(require('../../../../lib/function/algebra/sparse/sparse_lu'));

describe('sparse_lu', function () {

  it('should decompose matrix, 2 x 2, no permutations, array', function () {
    
    var m = math.matrix([[2, 1], [1, 4]], 'ccs');

    var r = sparse_lu(m, null, 1);
    // L
    assert.deepEqual(r.L.valueOf(), [[1, 0], [0.5, 1]]);
    // U
    assert.deepEqual(r.U.valueOf(), [[2, 1], [0, 3.5]]);
    // P
    assert.deepEqual(r.P.valueOf(), [[1, 0], [0, 1]]);
    // verify
    approx.deepEqual(math.multiply(r.P, m), math.multiply(r.L, r.U));
  });
});