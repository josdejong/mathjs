var assert = require('assert');
var approx = require('../../../../tools/approx');
var market = require('../../../../tools/matrixmarket');
var math = require('../../../../index').create();

math.import(require('../../../../lib/function/algebra/sparse/cs_permute'));
math.import(require('../../../../lib/function/algebra/sparse/cs_lu'));
math.import(require('../../../../lib/function/algebra/sparse/cs_sqr'));

var cs_permute = math.sparse.cs_permute;
var cs_lu = math.sparse.cs_lu;
var cs_sqr = math.sparse.cs_sqr;

describe('cs_lu', function () {

  it('should decompose matrix, 48 x 48, natural ordering (order=0), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        var m = matrices[0];

        // symbolic ordering and analysis, order = 0
        var s = cs_sqr(0, m, false);

        // full pivoting
        var r = cs_lu(m, s, 0.001);

        // verify
        approx.deepEqual(cs_permute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());

        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });

  it('should decompose matrix, 48 x 48, amd(A+A\') (order=1), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        var m = matrices[0];

        // symbolic ordering and analysis, order = 1
        var s = cs_sqr(1, m, false);

        // full pivoting
        var r = cs_lu(m, s, 0.001);

        // verify
        approx.deepEqual(cs_permute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());

        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });

  it('should decompose matrix, 48 x 48, amd(A\'*A) (order=2), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        var m = matrices[0];

        // symbolic ordering and analysis, order = 2
        var s = cs_sqr(2, m, false);

        // full pivoting
        var r = cs_lu(m, s, 0.001);

        // verify
        approx.deepEqual(cs_permute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());

        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });

  it('should decompose matrix, 48 x 48, amd(A\'*A) (order=3), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        var m = matrices[0];

        // symbolic ordering and analysis, order = 3
        var s = cs_sqr(3, m, false);

        // full pivoting
        var r = cs_lu(m, s, 0.001);

        // verify
        approx.deepEqual(cs_permute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());

        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });
});
