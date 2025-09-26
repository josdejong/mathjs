import { Bench } from 'tinybench'
import { abs, DenseMatrix, map, ones, random, round } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const genericMatrix = map(ones(10, 10, 'dense'), _ => round(random(-5, 5), 2))
const numberMatrix = new DenseMatrix(genericMatrix, 'number')
const array = genericMatrix.toArray()

const rowMatrix = map(ones(1, 10, 'dense'), _ => round(random(-5, 5), 2))
const columnMatrix = map(ones(10, 1, 'dense'), _ => round(random(-5, 5), 2))
const rowArray = rowMatrix.toArray()
const columnArray = columnMatrix.toArray()
const multiCallback = (value1, value2) => abs(value1 - value2)
const multiCallback1 = (value1, value2, index) => abs(value1 - value2)
const multiCallback2 = (value1, value2, index, array1, array2) => abs(value1 - value2)
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
  .add('genericMatrix iterate', () => {
    const result = genericMatrix.clone()
    for (const v of genericMatrix) {
      result.set(v.index, abs(v.value))
    }
  })
  .add('map(rowMatrix, columnMatrix, multiCallback)', () => {
    map(rowMatrix, columnMatrix, multiCallback)
  })
  .add('map(rowArray, columnArray, multiCallback)', () => {
    map(rowArray, columnArray, multiCallback)
  })
  .add('map(rowMatrix, columnMatrix, multiCallback1)', () => {
    map(rowMatrix, columnMatrix, multiCallback1)
  })
  .add('map(rowArray, columnArray, multiCallback1)', () => {
    map(rowArray, columnArray, multiCallback1)
  })
  .add('map(rowMatrix, columnMatrix, multiCallback2)', () => {
    map(rowMatrix, columnMatrix, multiCallback2)
  })
  .add('map(rowArray, columnArray, multiCallback2)', () => {
    map(rowArray, columnArray, multiCallback2)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
