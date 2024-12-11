// test performance of the expression parser in node.js

// browserify benchmark/expression_parser.js -o ./benchmark_expression_parser.js

import assert from 'node:assert'
import { Bench } from 'tinybench'
import { all, create } from '../../lib/esm/index.js'
import { getSafeProperty } from '../../lib/esm/utils/customs.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const math = create(all)

const expr = '2 + 3 * sin(pi / 4) - 4x'
const scope = new Map([
  ['x', 2]
])
const compiled = math.parse(expr).compile(math)

function undefinedSymbol (name) {
  throw new Error('Undefined symbol "' + name + '"')
}

const sin = getSafeProperty(math, 'sin')
const pi = getSafeProperty(math, 'pi')
const compiledPlainJs = {
  evaluate: function (scope) {
    return 2 + 3 * (scope.has('sin') ? scope.get('sin') : sin)((scope.has('pi') ? scope.get('pi') : pi) / 4) - 4 * (scope.has('x') ? scope.get('x') : undefinedSymbol('x'))
  }
}

const correctResult = -3.878679656440358

console.log('expression:', expr)
console.log('scope:', scope)
console.log('result:', correctResult)

assertApproxEqual(compiled.evaluate(scope), correctResult, 1e-7)
assertApproxEqual(compiledPlainJs.evaluate(scope), correctResult, 1e-7)

let total = 0
const nodes = []

const bench = new Bench({ time: 100, iterations: 100 })
  .add('(plain js) evaluate', function () {
    total += compiledPlainJs.evaluate(scope)
  })

  .add('(mathjs) evaluate', function () {
    total += compiled.evaluate(scope)
  })
  .add('(mathjs) parse, compile, evaluate', function () {
    total += math.parse(expr).compile().evaluate(scope)
  })
  .add('(mathjs) parse, compile', function () {
    const node = math.parse(expr).compile()
    nodes.push(node)
  })
  .add('(mathjs) parse', function () {
    const node = math.parse(expr)
    nodes.push(node)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()

// we count at total to prevent the browsers from not executing
// the benchmarks ("dead code") when the results would not be used.
if (total > 1e6) {
  console.log('')
}

function assertApproxEqual (actual, expected, tolerance) {
  const diff = Math.abs(expected - actual)
  if (diff > tolerance) assert.strictEqual(actual, expected)
  else assert.ok(diff <= tolerance, actual + ' === ' + expected)
}
