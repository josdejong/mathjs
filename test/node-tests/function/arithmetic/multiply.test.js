// Only use native node.js API's and references to ./lib here, this file is not transpiled!
import { create, all } from '../../../../lib/esm/index.js'
import { marketImport } from '../../../../tools/matrixmarket.js'

const math = create(all)

describe('multiply', function () {
  describe('Matrix Market', function () {
    it('should multiply matrix x matrix 1220 x 1220, Matrix Market, sparse x sparse', function (done) {
      // import matrix
      marketImport('tools/matrices/fpga_dcop_01.mtx')
        .then(function (matrices) {
          // matrix
          const m = matrices
          // multiply matrices, used to compare performance in different implementations
          math.multiply(m, m)
          // indicate test has completed
          done()
        })
        .catch(function (error) {
          // indicate test has completed
          done(error)
        })
    })
  })
})
