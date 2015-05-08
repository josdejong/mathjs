var assert = require('assert'),
    approx = require('../../../../tools/approx'),
    math = require('../../../../index'),
    market = require('../../../../tools/matrixmarket');

var cs_permute = math.import(require('../../../../lib/function/algebra/sparse/cs_permute'));

describe('slu', function () {

  it('should decompose matrix, 4 x 4, natural ordering (order=0), partial pivoting', function () {

    var m = math.sparse(
      [
        [4.5,   0, 3.2,   0],
        [3.1, 2.9,   0, 0.9],
        [0,   1.7,   3,   0],
        [3.5, 0.4,   0,   1]
      ]);

    // partial pivoting
    var r = math.slu(m, 0, 1);

    // verify
    approx.deepEqual(cs_permute(m, r.pinv, r.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());
  });

  it('should decompose matrix, 4 x 4, amd(A+A\') (order=1), partial pivoting', function () {

    var m = math.sparse(
      [
        [4.5,   0, 3.2,   0],
        [3.1, 2.9,   0, 0.9],
        [0,   1.7,   3,   0],
        [3.5, 0.4,   0,   1]
      ]);

    // partial pivoting
    var r = math.slu(m, 1, 1);

    // verify
    approx.deepEqual(cs_permute(m, r.pinv, r.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());
  });

  it('should decompose matrix, 4 x 4, amd(A\'*A) (order=2), partial pivoting', function () {

    var m = math.sparse(
      [
        [4.5,   0, 3.2,   0],
        [3.1, 2.9,   0, 0.9],
        [0,   1.7,   3,   0],
        [3.5, 0.4,   0,   1]
      ]);

    // partial pivoting
    var r = math.slu(m, 2, 1);

    // verify
    approx.deepEqual(cs_permute(m, r.pinv, r.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());
  });

  it('should decompose matrix, 4 x 4, amd(A\'*A) (order=3), partial pivoting', function () {

    var m = math.sparse(
      [
        [4.5,   0, 3.2,   0],
        [3.1, 2.9,   0, 0.9],
        [0,   1.7,   3,   0],
        [3.5, 0.4,   0,   1]
      ]);

    // partial pivoting
    var r = math.slu(m, 3, 1);

    // verify
    approx.deepEqual(cs_permute(m, r.pinv, r.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());
  });

  it('should decompose matrix, 48 x 48, natural ordering (order=0), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        var m = matrices[0];

        // full pivoting
        var r = math.slu(m, 0, 0.001);

        // verify
        approx.deepEqual(cs_permute(m, r.pinv, r.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());

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

        // full pivoting
        var r = math.slu(m, 1, 0.001);

        // verify
        approx.deepEqual(cs_permute(m, r.pinv, r.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());

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

        // full pivoting
        var r = math.slu(m, 2, 0.001);

        // verify
        approx.deepEqual(cs_permute(m, r.pinv, r.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());

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

        // full pivoting
        var r = math.slu(m, 3, 0.001);

        // verify
        approx.deepEqual(cs_permute(m, r.pinv, r.q, true).valueOf(), math.multiply(r.L, r.U).valueOf());

        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });
});