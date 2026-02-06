// test performance of plain JS functions vs custom functions defined via the expression parser

import assert from 'node:assert'
import { Bench } from 'tinybench'
import { all, create } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const math = create(all)

const cubeJsPlain = (x) => x * x * x
const cubeJsWithMathjs = (x) => math.multiply(x, math.multiply(x, x))
const cubeMathjsExpr = math.evaluate('f(x) = x * x * x')

assert.strictEqual(cubeJsPlain(3), 27)
assert.strictEqual(cubeJsWithMathjs(3), 27)
assert.strictEqual(cubeMathjsExpr(3), 27)

const bench = new Bench({ time: 100, iterations: 1000 })
  .add('cubeJsPlain', function () {
    cubeJsPlain(3)
  })
  .add('cubeJsWithMathjs', function () {
    cubeJsWithMathjs(3)
  })
  .add('cubeMathjsExpr', function () {
    cubeMathjsExpr(3)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task, 3)))
await bench.run()
