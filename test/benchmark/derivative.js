// test performance of derivative

import { Bench } from 'tinybench'
import { derivative, parse } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

let expr = parse('0')
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= 5; j++) {
    expr = parse(`${expr} + sin(${i + j} * x ^ ${i} + ${i * j} * y ^ ${j})`)
  }
}

const results = []

const bench = new Bench({ time: 100, iterations: 100 })
  .add('ddf', function () {
    const res = derivative(derivative(expr, parse('x'), { simplify: false }), parse('x'), { simplify: false })
    results.splice(0, 1, res)
  })
  .add('df ', function () {
    const res = derivative(expr, parse('x'), { simplify: false })
    results.splice(0, 1, res)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
