// test performance of the unit expression parser in node.js

// browserify benchmark/unit_parser.js -o ./benchmark_unit_parser.js

import { Bench } from 'tinybench'
import { evaluate, Unit } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const expr = '[1mm, 2mm, 3mm, 4mm, 5mm, 6mm, 7mm, 8mm, 9mm, 10mm]'

console.log('Unit.parse expression: mm')
console.log('evaluate expression:', expr)

let total = 0

const bench = new Bench({ time: 100, iterations: 100 })
  .add('Unit.parse', function () {
    total += Unit.parse('mm').dimensions[0]
  })
  .add('evaluate', function () {
    total += evaluate(expr).size()[0]
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()

// we count at total to prevent the browsers from not executing
// the benchmarks ("dead code") when the results would not be used.
if (total > 5) {
  console.log('')
}
