/**
 * Benchmark
 * 
 * Compare performance of basic matrix operations of a number of math libraries. 
 */

var padLeft = require('pad-left')
var padRight = require('pad-right')

var iterations = 1000

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
]

// mathjs
{
  var math = require('../index')
  var A = math.matrix(fiedler)

  measure ('mathjs', 'A+A',    function () { res = math.add(A, A) })
  measure ('mathjs', 'A*A',    function () { res = math.multiply(A, A) })
  measure ('mathjs', 'A\'',    function () { res = math.transpose(A) })
  measure ('mathjs', 'det(A)', function () { res = math.det(A) })
}

// sylvester
{
  var sylvester = require('sylvester')
  var A = sylvester.Matrix.create(fiedler)

  measure ('sylvester', 'A+A',    function () { A.add(A) })
  measure ('sylvester', 'A*A',    function () { A.multiply(A) })
  measure ('sylvester', 'A\'',    function () { A.transpose() })
  measure ('sylvester', 'det(A)', function () { A.det() })
}

// numericjs
{
  var numeric = require('numericjs')
  var A = fiedler

  measure ('numericjs', 'A+A',    function () { numeric.add(A, A) })
  measure ('numericjs', 'A*A',    function () { numeric.dot(A, A) })
  measure ('numericjs', 'A\'',    function () { numeric.transpose(A) })
  measure ('numericjs', 'det(A)', function () { numeric.det(A) })
}

// ndarray
{
  var ndarray = require('ndarray')
  var gemm = require('ndarray-gemm')
  var zeros = require('zeros')
  var ops = require('ndarray-ops')
  var pack = require('ndarray-pack')
  var det  = require('ndarray-determinant')
  
  var A = pack(fiedler)
  var B = zeros([25, 25])

  measure('ndarray', 'A+A', function () { ops.add(B, A, A) })
  measure('ndarray', 'A*A', function () { gemm(B, A, A) })
  measure('ndarray', 'A\'', function () { ops.assign(B, A); B.transpose(1, 0); })
  measure('ndarray', 'det(A)', function () { det(A) })
}

/**
 * Repeatedly execute test and print the average duration
 * @param {string} library
 * @param {string} description
 * @param {function} test 
 */
function measure (library, description, test) {
  // warm up
  test() 

  var start = Date.now()
  for (var i = 0; i < iterations / 10; i++) {
    // ten times to minimize the impact of the duration of the for loop itself
    test()
    test()
    test()
    test()
    test()
    test()
    test()
    test()
    test()
    test()
  }
  var end = Date.now()
  var duration = Math.round((end - start) * 1000 / (iterations))  // in microseconds

  console.log(padRight(library, 12, ' ') + padRight(description, 8, ' ') + padLeft(duration, 6, ' ') + ' microseconds')
}

function flatten (arr) {
  return [].concat.apply([], arr)
}