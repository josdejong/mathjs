// test multiply
const math = require('../../../src/main')
const market = require('../../../tools/matrixmarket')

describe('multiply', function () {
  describe('Matrix Market', function () {
    it('should multiply matrix x matrix 1220 x 1220, Matrix Market, sparse x sparse', function (done) {
      // import matrix
      market.import('tools/matrices/fpga_dcop_01.tar.gz', ['fpga_dcop_01/fpga_dcop_01.mtx'])
        .then(function (matrices) {
          // matrix
          const m = matrices[0]
          // multiply matrices, used to compare performance in different implementations
          math.multiply(m, m)
          // indicate test has completed
          done()
        })
        .fail(function (error) {
          // indicate test has completed
          done(error)
        })
    })
  })
})
