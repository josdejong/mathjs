var approx = require('../../../../tools/approx'),
  math = require('../../../../index'),
  market = require('../../../../tools/matrixmarket');

describe('slu - matrix market', function () {
  it('should decompose matrix, 48 x 48, natural ordering (order=0), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        var m = matrices[0];

        // full pivoting
        var r = math.slu(m, 0, 0.001);

        // verify M[p,q]=L*U
        approx.deepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf());

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

        // verify M[p,q]=L*U
        approx.deepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf());

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

        // verify M[p,q]=L*U
        approx.deepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf());

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

        // verify M[p,q]=L*U
        approx.deepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf());

        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });

  /**
   * C = A(p,q) where p is the row permutation vector and q the column permutation vector.
   */
  var _permute = function (A, pinv, q) {
    // matrix arrays
    var values = A._values;
    var index = A._index;
    var ptr = A._ptr;
    var size = A._size;
    // columns
    var n = size[1];
    // c arrays
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // loop columns
    for (var k = 0 ; k < n ; k++) {
      cptr[k] = cindex.length;
      // column in C
      var j = q ? (q[k]) : k;
      // values in column j
      for (var t = ptr[j]; t < ptr[j + 1]; t++) {
        cvalues.push(values[t]);
        cindex.push(pinv ? (pinv[index[t]]) : index[t]);
      }
    }
    cptr[n] = cindex.length;
    // return matrix
    return new math.type.SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: size,
      datatype: A._datatype
    });
  };
});
