// test performance of the expression parser in node.js

import { Bench } from 'tinybench'
import { derivative, simplify } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const simplifyExpr = '2 * 1 * x ^ (2 - 1)'
const derivativeExpr = '2x^2 + log(3x) + 2x + 3'

console.log('simplify ' + simplifyExpr)
console.log('    ' + simplify(simplifyExpr))
console.log('derivative ' + derivativeExpr)
console.log('    ' + derivative(derivativeExpr, 'x'))

const results = []

const bench = new Bench({ time: 100, iterations: 100 })
  .add('algebra simplify ', function () {
    const res = simplify(simplifyExpr)
    results.push(res)
  })
  .add('algebra derivative', function () {
    const res = derivative(derivativeExpr, 'x')
    results.push(res)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
