import { Bench } from 'tinybench'
import { abs, DenseMatrix, forEach, map, ones, random, round } from '../../lib/esm/index.js'
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
  .add('genericMatrix.forEach(abs)', () => {
    genericMatrix.forEach(abs)
  })
  .add('numberMatrix.forEach(abs)', () => {
    numberMatrix.forEach(abs)
  })
  .add('forEach(genericMatrix, abs)', () => {
    forEach(genericMatrix, abs)
  })
  .add('forEach(numberMatrix, abs)', () => {
    forEach(numberMatrix, abs)
  })
  .add('forEach(array, abs)', () => {
    forEach(array, abs)
  })
  .add('forEach(array, abs.signatures.number)', () => {
    forEach(array, abs.signatures.number)
  })
  .add('genericMatrix.forEach(abs.signatures.number)', () => {
    genericMatrix.forEach(abs.signatures.number)
  })
  .add('numberMatrix.forEach(abs.signatures.number)', () => {
    numberMatrix.forEach(abs.signatures.number)
  })
  .add('genericMatrix.forEach(abs+idx)', () => {
    genericMatrix.forEach((x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add('numberMatrix.forEach(abs+idx)', () => {
    numberMatrix.forEach((x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add('forEach(genericMatrix, abs+idx)', () => {
    forEach(genericMatrix, (x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add('genericMatrix.forEach(abs+idx+arr)', () => {
    genericMatrix.forEach((x, idx, X) => abs(x) + idx[0] - idx[1] + X.get([0, 0]))
  })
  .add('numberMatrix.forEach(abs+idx+arr)', () => {
    numberMatrix.forEach((x, idx, X) => abs(x) + idx[0] - idx[1] + X.get([0, 0]))
  })
  .add('forEach(genericMatrix, abs+idx+arr)', () => {
    forEach(genericMatrix, (x, idx, X) => abs(x) + idx[0] - idx[1] + X.get([0, 0]))
  })
  .add('forEach(array, abs+idx+arr)', () => {
    forEach(array, (x, idx, X) => abs(x) + idx[0] - idx[1] + X[0][0])
  })
  .add('genericMatrix iterate', () => {
    for (const v of genericMatrix) {
      abs(v.value)
    }
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
