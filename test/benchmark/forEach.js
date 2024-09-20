import Benchmark from 'benchmark'
import padRight from 'pad-right'
import { ones, abs, DenseMatrix, map, forEach, random, round } from '../../lib/esm/index.js'

const genericMatrix = map(ones(10, 10, 'dense'), _ => round(random(-5, 5), 2))
const numberMatrix = new DenseMatrix(genericMatrix, 'number')
const array = genericMatrix.toArray()

// console.log('data', array)
// console.log('abs(data)', abs(array))npm run

new Benchmark.Suite()
  .add(pad('abs(genericMatrix)'), () => {
    abs(genericMatrix)
  })
  .add(pad('abs(array)'), () => {
    abs(array)
  })
  .add(pad('abs(numberMatrix)'), () => {
    abs(numberMatrix)
  })
  .add(pad('genericMatrix.forEach(abs)'), () => {
    genericMatrix.forEach(abs)
  })
  .add(pad('numberMatrix.forEach(abs)'), () => {
    numberMatrix.forEach(abs)
  })
  .add(pad('forEach(genericMatrix, abs)'), () => {
    forEach(genericMatrix, abs)
  })
  .add(pad('forEach(numberMatrix, abs)'), () => {
    forEach(numberMatrix, abs)
  })
  .add(pad('forEach(array, abs)'), () => {
    forEach(array, abs)
  })
  .add(pad('forEach(array, abs.signatures.number)'), () => {
    forEach(array, abs.signatures.number)
  })
  .add(pad('genericMatrix.forEach(abs.signatures.number)'), () => {
    genericMatrix.forEach(abs.signatures.number)
  })
  .add(pad('numberMatrix.forEach(abs.signatures.number)'), () => {
    numberMatrix.forEach(abs.signatures.number)
  })
  .add(pad('genericMatrix.forEach(abs+idx)'), () => {
    genericMatrix.forEach((x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add(pad('numberMatrix.forEach(abs+idx)'), () => {
    numberMatrix.forEach((x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add(pad('forEach(genericMatrix, abs+idx)'), () => {
    forEach(genericMatrix, (x, idx) => abs(x) + idx[0] - idx[1])
  })
  .add(pad('genericMatrix.forEach(abs+idx+arr)'), () => {
    genericMatrix.forEach((x, idx, X) => abs(x) + idx[0] - idx[1] + X.get([0, 0]))
  })
  .add(pad('numberMatrix.forEach(abs+idx+arr)'), () => {
    numberMatrix.forEach((x, idx, X) => abs(x) + idx[0] - idx[1] + X.get([0, 0]))
  })
  .add(pad('forEach(genericMatrix, abs+idx+arr)'), () => {
    forEach(genericMatrix, (x, idx, X) => abs(x) + idx[0] - idx[1] + X.get([0, 0]))
  })
  .add(pad('forEach(array, abs+idx+arr)'), () => {
    forEach(array, (x, idx, X) => abs(x) + idx[0] - idx[1] + X[0][0])
  })
  .add()
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()

function pad (text) {
  return padRight(text, 45, ' ')
}
