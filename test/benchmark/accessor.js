// test the accessor-node performance in node.js

// browserify benchmark/expression_parser.js -o ./benchmark_expression_parser.js

import assert from 'node:assert'
import { Bench } from 'tinybench'
import { all, create } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const math = create(all)

const scope = {
  obj: { foo: { bar: { baz: 2 } } }
}

const expr = 'obj?.foo?.["bar"]?.baz'
const compiled = math.parse(expr).compile(math)

const compiledPlainJs = {
  evaluate: function (scope) {
    // eslint-disable-next-line
    return scope.obj.foo['bar'].baz
  }
}

const exprOptionalChaining = 'obj?.foo?.["bar"]?.baz'
const compiledOptionalChaining = math.parse(exprOptionalChaining).compile(math)

const compiledChainingPlainJs = {
  evaluate: function (scope) {
    // eslint-disable-next-line
    return scope.obj?.foo?.['bar']?.baz
  }
}

const correctResult = 2

console.log('scope:', scope)
console.log('result:', correctResult)

console.log('expression:', expr)
assertEqual(compiled.evaluate(scope), correctResult)
assertEqual(compiledPlainJs.evaluate(scope), correctResult)

console.log('expression optional chaining:', exprOptionalChaining)
assertEqual(compiledOptionalChaining.evaluate(scope), correctResult)
assertEqual(compiledChainingPlainJs.evaluate(scope), correctResult)

let total = 0

const bench = new Bench({ time: 100, iterations: 100 })
  .add('(plain js) evaluate', function () {
    total += compiledPlainJs.evaluate(scope)
  })
  .add('(mathjs) evaluate', function () {
    total += compiled.evaluate(scope)
  })
  .add('(plain js optional chaining) evaluate', function () {
    total += compiledChainingPlainJs.evaluate(scope)
  })
  .add('(mathjs optional chaining) evaluate', function () {
    total += compiledOptionalChaining.evaluate(scope)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()

// we count at total to prevent the browsers from not executing
// the benchmarks ("dead code") when the results would not be used.
if (total > 1e6) {
  console.log('')
}

function assertEqual (actual, expected) {
  assert.equal(actual, expected)
}
