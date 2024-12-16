// test performance of resolving scope variables in the expression parser

import { Bench } from 'tinybench'
import { evaluate } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const scope = { a: 2, b: 3, c: 4 }
const f = evaluate('f(x, y) = a + b + c + x + y', scope)

console.log('f(5, 6) = ' + f(5, 6))

const bench = new Bench({ time: 100, iterations: 100 })
let res = 0
bench
  .add('evaluate f(x, y)', function () {
    res = f(-res, res) // make it dynamic, using res as argument
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
