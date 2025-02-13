import { Bench } from 'tinybench'
import { abs, DenseMatrix, map, ones, random, round } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const genericMatrix = map(ones(10, 10, 'dense'), _ => round(random(-5, 5), 2))
const numberMatrix = new DenseMatrix(genericMatrix, 'number')
const array = genericMatrix.toArray()

// console.log('data', array)
// console.log('abs(data)', abs(array))npm run

const bench = new Bench({ time: 100, iterations: 100 })
  .add('abs(genericMatrix)', () => {
    abs(genericMatrix)
  })
  .add('abs(array)', () => {
    abs(array)
  })
  .add('abs(numberMatrix)', () => {
    abs(numberMatrix)
  })
  .add('genericMatrix.map(abs)', () => {
    genericMatrix.map(abs)
  })
  .add('numberMatrix.map(abs)', () => {
    numberMatrix.map(abs)
  })
  .add('map(genericMatrix, abs)', () => {
    map(genericMatrix, abs)
  })
  .add('map(numberMatrix, abs)', () => {
    map(numberMatrix, abs)
  })
  .add('map(array, abs)', () => {
    map(array, abs)
  })
  .add('map(array, abs.signatures.number)', () => {
    map(array, abs.signatures.number)
  })
  .add('genericMatrix.map(abs.signatures.number)', () => {
    genericMatrix.map(abs.signatures.number)
  })
  .add('numberMatrix.map(abs.signatures.number)', () => {
    numberMatrix.map(abs.signatures.number)
  })
  .add('map(array, abs + idx)', () => {
    map(array, (x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add('genericMatrix.map(abs + idx)', () => {
    genericMatrix.map((x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add('numberMatrix.map(abs + idx)', () => {
    numberMatrix.map((x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add('map(array, abs + idx + arr)', () => {
    map(array, (x, idx, X) => abs(x) + idx[0] - idx[1] + X[0][0])
  })
  .add('genericMatrix.map(abs + idx + matrix)', () => {
    genericMatrix.map((x, idx, X) => abs(x) + idx[0] - idx[1] + X.get([0, 0]))
  })
  .add('numberMatrix.map(abs + idx + matrix)', () => {
    numberMatrix.map((x, idx, X) => abs(x) + idx[0] - idx[1] + X.get([0, 0]))
  })
  .add('genericMatrix iterate', () => {
    const result = genericMatrix.clone()
    for (const v of genericMatrix) {
      result.set(v.index, abs(v.value))
    }
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
