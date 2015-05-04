var assert = require('assert'),
    approx = require('../../../../tools/approx'),
    math = require('../../../../index'),
    market = require('../../../../tools/matrixmarket');

var cs_lu = math.import(require('../../../../lib/function/algebra/sparse/cs_lu'));
var cs_sqr = math.import(require('../../../../lib/function/algebra/sparse/cs_sqr'));

describe('cs_lu', function () {

  it('should decompose matrix, 2 x 2, no symbolic ordering, array', function () {
    
    var m = math.sparse([[2, 1], [1, 4]]);

    var r = cs_lu(m, null, 1);
    // L
    assert.deepEqual(r.L.valueOf(), [[1, 0], [0.5, 1]]);
    // U
    assert.deepEqual(r.U.valueOf(), [[2, 1], [0, 3.5]]);
    // P
    assert.deepEqual(r.P.valueOf(), [[1, 0], [0, 1]]);
    // verify
    approx.deepEqual(math.multiply(r.P, m), math.multiply(r.L, r.U));
  });
  
  it('should decompose matrix, 130 x 130, order = 1, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/arc130.tar.gz', ['arc130/arc130.mtx'])
      .then(function (matrices) {
        // matrix
        var m = matrices[0];

        // symbolic analysis
        var s = cs_sqr(1, m, false);
      
        var r = cs_lu(m, s, 1);
        // L
        // assert.deepEqual(r.L.valueOf(), [[1, 0], [0.5, 1]]);
        // U
        // assert.deepEqual(r.U.valueOf(), [[2, 1], [0, 3.5]]);
        // P
        // assert.deepEqual(r.P.valueOf(), [[1, 0], [0, 1]]);
        // verify
        //approx.deepEqual(math.multiply(r.P, m).valueOf(), math.multiply(r.L, r.U).valueOf());
        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });
});