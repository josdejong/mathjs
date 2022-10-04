// test performance of the expression parser in node.js

const Benchmark = require('benchmark')
const padRight = require('pad-right')
const math = require('../..')

function pad (text) {
  return padRight(text, 40, ' ')
}

const maxCoeff = 5
function countRoots () {
  let polys = 0
  let roots = 0
  for (let d = 0; d <= maxCoeff; ++d) {
    for (let c = 0; c <= maxCoeff; ++c) {
      for (let b = 0; b <= maxCoeff; ++b) {
        for (let a = 1; a <= maxCoeff; ++a) {
          polys += 1
          roots += math.polynomialRoot(d, c, b, a).length
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

const suite = new Benchmark.Suite()
suite
  .add(pad('count roots'), function () {
    const res = countRoots()
    results.push(res)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
