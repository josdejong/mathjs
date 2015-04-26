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
      
      console.log(r);
        // indicate test has completed
        done();
      })
      .fail(function (error) {
        // indicate test has completed
        done(error);
      });
  });
});