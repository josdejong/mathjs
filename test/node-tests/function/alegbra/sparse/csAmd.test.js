// Only use native node.js API's and references to ./lib here, this file is not transpiled!
import assert from 'node:assert'
import { create, all } from '../../../../../lib/esm/index.js'
import { approxDeepEqual } from '../../../../../tools/approx.js'
import { marketImport } from '../../../../../tools/matrixmarket.js'
import { createCsAmd } from '../../../../../lib/esm/function/algebra/sparse/csAmd.js'

const { add, multiply, transpose } = create(all)
const csAmd = createCsAmd({ add, multiply, transpose })

describe('csAmd', function () {
  it('should approximate minimum degree ordering, 48 x 48, natural ordering (order=0), matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 0
        const q = csAmd(0, m)

        // verify
        assert(q === null)

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should approximate minimum degree ordering, 48 x 48, amd(A+A\') (order=1), matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 1
        const q = csAmd(1, m)

        // verify
        approxDeepEqual(q, [10, 28, 29, 24, 0, 11, 30, 6, 23, 22, 40, 46, 42, 18, 4, 16, 34, 5, 9, 39, 21, 44, 45, 43, 15, 25, 26, 27, 3, 33, 41, 19, 20, 2, 38, 32, 1, 14, 8, 13, 37, 31, 12, 36, 17, 47, 35, 7])

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should approximate minimum degree ordering, 48 x 48, amd(A\'*A) (order=2), matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 2
        const q = csAmd(2, m, false)

        // verify
        approxDeepEqual(q, [26, 27, 25, 44, 9, 15, 21, 33, 39, 43, 45, 3, 29, 24, 28, 47, 6, 18, 36, 0, 1, 4, 20, 2, 10, 11, 12, 8, 14, 16, 7, 13, 17, 23, 30, 34, 38, 32, 31, 41, 35, 22, 19, 37, 40, 42, 46, 5])

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should approximate minimum degree ordering, 48 x 48, amd(A\'*A) (order=3), matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 3
        const q = csAmd(3, m, false)

        // verify
        approxDeepEqual(q, [26, 27, 25, 44, 9, 15, 21, 33, 39, 43, 45, 3, 29, 24, 28, 47, 6, 18, 36, 0, 1, 4, 20, 2, 10, 11, 12, 8, 14, 16, 7, 13, 17, 23, 30, 34, 38, 32, 31, 41, 35, 22, 19, 37, 40, 42, 46, 5])

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })
})
