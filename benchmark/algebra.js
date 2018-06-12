// test performance of the expression parser in node.js

const Benchmark = require('benchmark')
const padRight = require('pad-right')
const math = require('../index')

function pad (text) {
  return padRight(text, 40, ' ')
}

const simplifyExpr = '2 * 1 * x ^ (2 - 1)'
const derivativeExpr = '2x^2 + log(3x) + 2x + 3'

console.log('simplify ' + simplifyExpr)
console.log('    ' + math.simplify(simplifyExpr))
console.log('derivative ' + derivativeExpr)
console.log('    ' + math.derivative(derivativeExpr, 'x'))

let results = []

const suite = new Benchmark.Suite()
suite
  .add(pad('algebra simplify '), function () {
    const res = math.simplify(simplifyExpr)
    results.push(res)
  })
  .add(pad('algebra derivative'), function () {
    const res = math.derivative(derivativeExpr, 'x')
    results.push(res)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
