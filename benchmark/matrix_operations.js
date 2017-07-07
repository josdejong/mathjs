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

var Benchmark = require('benchmark');
var padRight = require('pad-right');
var suite = new Benchmark.Suite();

function pad (text) {
  return padRight(text, 40, ' ');
}

// fiedler matrix 25 x 25
var fiedler = [
  [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  [ 1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  [ 2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  [ 3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  [ 4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  [ 5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [ 6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  [ 7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17],
  [ 8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16],
  [ 9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15],
  [10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14],
  [11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13],
  [12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12],
  [13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11],
  [14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10],
  [15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9],
  [16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7,  8],
  [17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6,  7],
  [18, 17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5,  6],
  [19, 18, 17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4,  5],
  [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3,  4],
  [21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2,  3],
  [22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1,  2],
  [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0,  1],
  [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1,  0]
];

// mathjs
(function () {
  var math = require('../index');
  var A = math.matrix(fiedler);
  var res;

  suite.add(pad('matrix operations mathjs A+A'),    function () { res = math.add(A, A) });
  suite.add(pad('matrix operations mathjs A*A'),    function () { res = math.multiply(A, A) });
  suite.add(pad('matrix operations mathjs A\''),    function () { res = math.transpose(A) });
  suite.add(pad('matrix operations mathjs det(A)'), function () { res = math.det(A) });
})();

// sylvester
(function () {
  var sylvester = require('sylvester');
  var A = sylvester.Matrix.create(fiedler);

  suite.add(pad('matrix operations sylvester A+A'),    function () { A.add(A) });
  suite.add(pad('matrix operations sylvester A*A'),    function () { A.multiply(A) });
  suite.add(pad('matrix operations sylvester A\''),    function () { A.transpose() });
  suite.add(pad('matrix operations sylvester det(A)'), function () { A.det() });
})();

// numericjs
(function () {
  var numeric = require('numericjs');
  var A = fiedler;

  suite.add(pad('matrix operations numericjs A+A'),    function () { numeric.add(A, A) });
  suite.add(pad('matrix operations numericjs A*A'),    function () { numeric.dot(A, A) });
  suite.add(pad('matrix operations numericjs A\''),    function () { numeric.transpose(A) });
  suite.add(pad('matrix operations numericjs det(A)'), function () { numeric.det(A) });
})();

// ndarray
(function () {
  var ndarray = require('ndarray');
  var gemm = require('ndarray-gemm');
  var zeros = require('zeros');
  var ops = require('ndarray-ops');
  var pack = require('ndarray-pack');
  var det  = require('ndarray-determinant');
  
  var A = pack(fiedler);
  var B = zeros([25, 25]);

  suite.add(pad('matrix operations ndarray A+A'), function () { ops.add(B, A, A) });
  suite.add(pad('matrix operations ndarray A*A'), function () { gemm(B, A, A) });
  suite.add(pad('matrix operations ndarray A\''), function () { ops.assign(B, A); B.transpose(1, 0); });
  suite.add(pad('matrix operations ndarray det(A)'), function () { det(A) });
})();

suite
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .run();
