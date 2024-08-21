import Benchmark from 'benchmark'
import { ones } from '../../lib/esm/index.js'

const denseMatrix = ones(100, 100, 'dense')

new Benchmark.Suite()
  .add('DenseMatrix.map(...)', () => {
    denseMatrix.map(value => value)
  })
  .add('DenseMatrix.forEach(...)', () => {
    denseMatrix.forEach(() => { /* noop */ })
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
