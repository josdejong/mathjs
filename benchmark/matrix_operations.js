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

const Benchmark = require('benchmark')
const padRight = require('pad-right')
const suite = new Benchmark.Suite()

function pad (text) {
  return padRight(text, 40, ' ')
}

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

// mathjs
(function () {
  const math = require('../index')
  const A = math.matrix(fiedler, 'dense', 'number')

  suite.add(pad('matrix operations mathjs (number) A+A'), function () { return math.add(A, A) })
  suite.add(pad('matrix operations mathjs (number) A*A'), function () { return math.multiply(A, A) })
  suite.add(pad('matrix operations mathjs (number) A\''), function () { return math.transpose(A) })
  suite.add(pad('matrix operations mathjs (number) det(A)'), function () { return math.det(A) })
})();

// mathjs
(function () {
  const math = require('../index')
  const A = math.matrix(fiedler)

  suite.add(pad('matrix operations mathjs (generic) A+A'), function () { return math.add(A, A) })
  suite.add(pad('matrix operations mathjs (generic) A*A'), function () { return math.multiply(A, A) })
  suite.add(pad('matrix operations mathjs (generic) A\''), function () { return math.transpose(A) })
  suite.add(pad('matrix operations mathjs (generic) det(A)'), function () { return math.det(A) })
})();

// sylvester
(function () {
  const sylvester = require('sylvester')
  const A = sylvester.Matrix.create(fiedler)

  suite.add(pad('matrix operations sylvester A+A'), function () { return A.add(A) })
  suite.add(pad('matrix operations sylvester A*A'), function () { return A.multiply(A) })
  suite.add(pad('matrix operations sylvester A\''), function () { return A.transpose() })
  suite.add(pad('matrix operations sylvester det(A)'), function () { return A.det() })
})();

// numericjs
(function () {
  const numeric = require('numericjs')
  const A = fiedler

  suite.add(pad('matrix operations numericjs A+A'), function () { return numeric.add(A, A) })
  suite.add(pad('matrix operations numericjs A*A'), function () { return numeric.dot(A, A) })
  suite.add(pad('matrix operations numericjs A\''), function () { return numeric.transpose(A) })
  suite.add(pad('matrix operations numericjs det(A)'), function () { return numeric.det(A) })
})();

// ndarray
(function () {
  const gemm = require('ndarray-gemm')
  const zeros = require('zeros')
  const ops = require('ndarray-ops')
  const pack = require('ndarray-pack')
  const det = require('ndarray-determinant')

  const A = pack(fiedler)
  const B = zeros([25, 25])

  suite.add(pad('matrix operations ndarray A+A'), function () { return ops.add(B, A, A) })
  suite.add(pad('matrix operations ndarray A*A'), function () { return gemm(B, A, A) })
  suite.add(pad('matrix operations ndarray A\''), function () { ops.assign(B, A); return B.transpose(1, 0) })
  suite.add(pad('matrix operations ndarray det(A)'), function () { return det(A) })
})()

const durations = []

suite
  .on('cycle', function (event) {
    const benchmark = event.target
    console.log(String(event.target))
    durations.push(benchmark.name + ' avg duration per operation: ' + Math.round(benchmark.stats.mean * 1e6) + ' microseconds')
  })
  .run()

console.log()
console.log(durations.join('\n'))
