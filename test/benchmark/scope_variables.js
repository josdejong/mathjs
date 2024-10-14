// test performance of resolving scope variables in the expression parser

import Benchmark from 'benchmark'
import { evaluate } from '../../lib/esm/index.js'

const scope = { a: 2, b: 3, c: 4 }
const f = evaluate('f(x, y) = a + b + c + x + y', scope)

console.log('f(5, 6) = ' + f(5, 6))

const suite = new Benchmark.Suite()
let res = 0
suite
  .add('evaluate f(x, y)', function () {
    res = f(-res, res) // make it dynamic, using res as argument
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()
