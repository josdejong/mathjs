import { Bench } from 'tinybench'
import { matrix, add, subtract, random } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const array = random([500, 500], -10, 10)
const genericMatrix = matrix(array)
const numberMatrix = matrix(array, 'dense', 'number')

// console.log('data', array)
// console.log('abs(data)', abs(array))npm run

const bench = new Bench({ time: 100, iterations: 100 })
  .add('add(array, 1)', () => {
    add(array, 1)
  })
  .add('add(matrix, 1)', () => {
    add(genericMatrix, 1)
  })
  .add('add(numberMatrix, 1)', () => {
    add(numberMatrix, 1)
  })
  .add('subtract(array, 1)', () => {
    subtract(array, 1)
  })
  .add('subtract(matrix, 1)', () => {
    subtract(genericMatrix, 1)
  })
  .add('subtract(numberMatrix, 1)', () => {
    subtract(numberMatrix, 1)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
