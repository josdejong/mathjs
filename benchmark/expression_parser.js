// test performance of the expression parser in node.js

// browserify benchmark/expression_parser.js -o ./benchmark_expression_parser.js

const assert = require('assert')
const Benchmark = require('benchmark')
const padRight = require('pad-right')
const math = require('../index')
const getSafeProperty = require('../lib/utils/customs').getSafeProperty

// expose on window when using bundled in a browser
if (typeof window !== 'undefined') {
  window['Benchmark'] = Benchmark
}

function pad (text) {
  return padRight(text, 40, ' ')
}

const expr = '2 + 3 * sin(pi / 4) - 4x'
let scope = {x: 2}
const compiled = math.parse(expr).compile(math, {})

const sin = getSafeProperty(math, 'sin')
const pi = getSafeProperty(math, 'pi')
const compiledPlainJs = {
  eval: function (scope) {
    return 2 + 3 * ('sin' in scope ? getSafeProperty(scope, 'sin') : sin)(('pi' in scope ? getSafeProperty(scope, 'pi') : pi) / 4) - 4 * scope['x']
  }
}

const correctResult = -3.878679656440358

console.log('expression:', expr)
console.log('scope:', scope)
console.log('result:', correctResult)

assertApproxEqual(compiled.eval(scope), correctResult, 1e-7)
assertApproxEqual(compiledPlainJs.eval(scope), correctResult, 1e-7)

let total = 0
let nodes = []

const suite = new Benchmark.Suite()
suite
  .add(pad('(plain js) evaluate'), function () {
    total += compiledPlainJs.eval(scope)
  })

  .add(pad('(mathjs) evaluate'), function () {
    total += compiled.eval(scope)
  })
  .add(pad('(mathjs) parse, compile, evaluate'), function () {
    total += math.parse(expr).compile().eval(scope)
  })
  .add(pad('(mathjs) parse, compile'), function () {
    const node = math.parse(expr).compile()
    nodes.push(node)
  })
  .add(pad('(mathjs) parse'), function () {
    const node = math.parse(expr)
    nodes.push(node)
  })

  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    // we count at total to prevent the browsers from not executing
    // the benchmarks ("dead code") when the results would not be used.
    if (total > 1e6) {
      console.log('')
    } else {
      console.log('')
    }
  })
  .run()

function assertApproxEqual (actual, expected, tolerance) {
  const diff = Math.abs(expected - actual)
  if (diff > tolerance) assert.equal(actual, expected)
  else assert.ok(diff <= tolerance, actual + ' === ' + expected)
}
