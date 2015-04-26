var assert = require('assert'),
    approx = require('../../../../tools/approx'),
    math = require('../../../../index'),
    market = require('../../../../tools/matrixmarket');

var cs_amd = math.import(require('../../../../lib/function/algebra/sparse/cs_amd'));

describe('cs_amd', function () {

  it('test', function (done) {
    // import matrix
    market.import('tools/matrices/can_24.tar.gz', ['can_24/can_24.mtx'])
      .then(function (matrices) {
        // matrix
        var m = matrices[0];
        
        var r = cs_amd(1, m);
        // verify permutation vector
        // assert.deepEqual(r, [22, 20, 10, 23, 12, 5, 16, 8, 14, 4, 15, 7, 1, 9, 13, 17, 0, 2, 3, 6, 11, 18, 21, 19]);
        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });
  
  it('test2', function () {
    var m = new math.type.SparseMatrix({
      values: undefined,
      index: [0, 1, 0, 1, 2, 4, 1, 2, 3, 4, 2, 3, 1, 4],
      ptr: [0, 2, 6, 10, 12, 14],
      size: [5, 5]
    });
    var r = cs_amd(1, m);
    console.log(r);
  });
});