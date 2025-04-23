import { Bench } from 'tinybench'
import { DenseMatrix, map, ones, random, round, flatten } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'
import { flatten as flattenArray } from '../../src/utils/array.js'

const genericMatrix = map(ones(10, 10, 'dense'), _ => round(random(-5, 5), 2))
const numberMatrix = new DenseMatrix(genericMatrix, 'number')
const array = genericMatrix.toArray()

// console.log('data', array)
// console.log('abs(data)', abs(array))npm run

const bench = new Bench({ time: 100, iterations: 100 })
  .add('flatten(array)', () => {
    flatten(array)
  })
  .add('flattenArray(array)', () => {
    flattenArray(array)
  })
  .add('flattenArray(array, false)', () => {
    flattenArray(array, false)
  })
  .add('flattenArray(array, true)', () => {
    flattenArray(array, true)
  })
  .add('flatten(genericMatrix)', () => {
    flatten(genericMatrix)
  })
  .add('flatten(numberMatrix)', () => {
    flatten(numberMatrix)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
