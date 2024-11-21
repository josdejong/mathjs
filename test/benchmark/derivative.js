// test performance of derivative

import Benchmark from 'benchmark'
import { derivative, parse } from '../../lib/esm/index.js'

let expr = parse('0')
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= 5; j++) {
    expr = parse(`${expr} + sin(${i + j} * x ^ ${i} + ${i * j} * y ^ ${j})`)
  }
}

const results = []

Benchmark.options.minSamples = 100

const suite = new Benchmark.Suite()
suite
  .add('ddf', function () {
    const res = derivative(derivative(expr, parse('x'), { simplify: false }), parse('x'), { simplify: false })
    results.splice(0, 1, res)
  })
  .add('df ', function () {
    const res = derivative(expr, parse('x'), { simplify: false })
    results.splice(0, 1, res)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
