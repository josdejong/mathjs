// test performance of the expression parser in node.js

import { Bench } from 'tinybench'
import { polynomialRoot } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const maxCoeff = 5
function countRoots () {
  let polys = 0
  let roots = 0
  for (let d = 0; d <= maxCoeff; ++d) {
    for (let c = 0; c <= maxCoeff; ++c) {
      for (let b = 0; b <= maxCoeff; ++b) {
        for (let a = 1; a <= maxCoeff; ++a) {
          polys += 1
          roots += polynomialRoot(d, c, b, a).length
        }
      }
    }
  }
  return [polys, roots]
}

const test = countRoots()
console.log('There are', test[1], 'roots of the', test[0], 'integer cubic')
console.log('polynomials (with coefficients <=', maxCoeff, ')')

const results = []

const bench = new Bench({ time: 100, iterations: 100 })
  .add('count roots', function () {
    const res = countRoots()
    results.push(res)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
