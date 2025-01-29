/**
 * Benchmark
 *
 * Compare performance of basic matrix operations of a number of math libraries.
 *
 * These are some rough benchmarks to get an idea of the performance of math.js
 * compared to other JavaScript libraries and to Octave (C++). They only give an
 * _indication_ of the order of magnitude difference meant to see were math.js
 * has room for improvements, it's not a fully fletched benchmark suite.
 */

import { Bench } from 'tinybench'
import det from 'ndarray-determinant'
import gemm from 'ndarray-gemm'
import ops from 'ndarray-ops'
import pack from 'ndarray-pack'
import numeric from 'numericjs'
import sylvester from 'sylvester'
import eig from 'eigen'
import zeros from 'zeros'
import { all, create } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const bench = new Bench({ time: 10, iterations: 100 })
const math = create(all)

// fiedler matrix 25 x 25
const fiedler = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  [1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  [2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  [3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  [4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  [5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  [7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  [8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8],
  [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7],
  [18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6],
  [19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5],
  [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4],
  [21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3],
  [22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2],
  [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1],
  [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

(async function () {
  // mathjs
  (function () {
    const A = math.matrix(fiedler, 'dense', 'number')

    bench.add('matrix operations mathjs (number) A+A', function () { return math.add(A, A) })
    bench.add('matrix operations mathjs (number) A*A', function () { return math.multiply(A, A) })
    bench.add('matrix operations mathjs (number) A\'', function () { return math.transpose(A) })
    bench.add('matrix operations mathjs (number) det(A)', function () { return math.det(A) })
  })();

  // mathjs
  (function () {
    const A = math.matrix(fiedler)

    bench.add('matrix operations mathjs (generic) A+A', function () { return math.add(A, A) })
    bench.add('matrix operations mathjs (generic) A*A', function () { return math.multiply(A, A) })
    bench.add('matrix operations mathjs (generic) A\'', function () { return math.transpose(A) })
    bench.add('matrix operations mathjs (generic) det(A)', function () { return math.det(A) })
  })();

  // sylvester
  (function () {
    const A = sylvester.Matrix.create(fiedler)

    bench.add('matrix operations sylvester A+A', function () { return A.add(A) })
    bench.add('matrix operations sylvester A*A', function () { return A.multiply(A) })
    bench.add('matrix operations sylvester A\'', function () { return A.transpose() })
    bench.add('matrix operations sylvester det(A)', function () { return A.det() })
  })();

  // numericjs
  (function () {
    const A = fiedler

    bench.add('matrix operations numericjs A+A', function () { return numeric.add(A, A) })
    bench.add('matrix operations numericjs A*A', function () { return numeric.dot(A, A) })
    bench.add('matrix operations numericjs A\'', function () { return numeric.transpose(A) })
    bench.add('matrix operations numericjs det(A)', function () { return numeric.det(A) })
  })();

  // ndarray
  (function () {
    const A = pack(fiedler)
    const B = zeros([25, 25])

    bench.add('matrix operations ndarray A+A', function () { return ops.add(B, A, A) })
    bench.add('matrix operations ndarray A*A', function () { return gemm(B, A, A) })
    bench.add('matrix operations ndarray A\'', function () { ops.assign(B, A); return B.transpose(1, 0) })
    bench.add('matrix operations ndarray det(A)', function () { return det(A) })
  })()

  // eigen-js
  await eig.ready
  await (function () {
    const A = new eig.Matrix(fiedler)

    bench.add('matrix operations eigen-js A+A', function () { return A.matAdd(A) })
    bench.add('matrix operations eigen-js A*A', function () { return A.matMul(A) })
    bench.add('matrix operations eigen-js A\'', function () { return A.transpose() })
    bench.add('matrix operations eigen-js det(A)', function () { return A.det() })
  })()

  bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
  await bench.run()
})().catch(console.error)
