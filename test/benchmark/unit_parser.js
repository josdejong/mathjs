// test performance of the unit expression parser in node.js

// browserify benchmark/unit_parser.js -o ./benchmark_unit_parser.js

const Benchmark = require('benchmark')
const math = require('../..')

// expose on window when using bundled in a browser
if (typeof window !== 'undefined') {
  window.Benchmark = Benchmark
}

const expr = '[1mm, 2mm, 3mm, 4mm, 5mm, 6mm, 7mm, 8mm, 9mm, 10mm]'

console.log('Unit.parse expression: mm')
console.log('evaluate expression:', expr)

let total = 0

const suite = new Benchmark.Suite()
suite
  .add('Unit.parse', function () {
    total += math.Unit.parse('mm').dimensions[0]
  })
  .add('evaluate', function () {
    total += math.evaluate(expr).size()[0]
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    // we count at total to prevent the browsers from not executing
    // the benchmarks ("dead code") when the results would not be used.
    if (total > 5) {
      console.log('')
    } else {
      console.log('')
    }
  })
  .run()
