// matrices
import { diag, factorial, format, index, map, matrix, multiply, ones, range, sqrt } from '../lib/esm/index.js'

// create matrices and arrays. a matrix is just a wrapper around an Array,
// providing some handy utilities.
console.log('create a matrix')
const a = matrix([1, 4, 9, 16, 25])
print(a) // [1, 4, 9, 16, 25]
const b = matrix(ones([2, 3]))
print(b) // [[1, 1, 1], [1, 1, 1]]
print(b.size()) // [2, 3]

// the Array data of a Matrix can be retrieved using valueOf()
const array = a.valueOf()
print(array) // [1, 4, 9, 16, 25]

// Matrices can be cloned
const clone = a.clone()
print(clone) // [1, 4, 9, 16, 25]
console.log()

// perform operations with matrices
console.log('perform operations')
print(map(a, sqrt)) // [1, 2, 3, 4, 5]
const c = [1, 2, 3, 4, 5]
print(factorial(c)) // [1, 2, 6, 24, 120]
console.log()

// create and manipulate matrices. Arrays and Matrices can be used mixed.
console.log('manipulate matrices')
const d = [[1, 2], [3, 4]]
print(d) // [[1, 2], [3, 4]]
const e = matrix([[5, 6], [1, 1]])
print(e) // [[5, 6], [1, 1]]

// set a submatrix
// Matrix indexes are zero-based.
e.subset(index(1, [0, 1]), [[7, 8]])
print(e) // [[5, 6], [7, 8]]
const f = multiply(d, e)
print(f) // [[19, 22], [43, 50]]
const g = f.subset(index(1, 0))
print(g) // 43
console.log()

// get a sub matrix
// Matrix indexes are zero-based.
console.log('get a sub matrix')
const h = diag(range(1, 4))
print(h) // [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
print(h.subset(index([1, 2], [1, 2]))) // [[2, 0], [0, 3]]
const i = range(1, 6)
print(i) // [1, 2, 3, 4, 5]
print(i.subset(index(range(1, 4)))) // [2, 3, 4]
console.log()

// replace a single value in a matrix
// this will mutate the matrix
console.log('set and get a value')
const p = matrix([[1, 2], [3, 4]])
p.set([0, 1], 5)
print(p) // [[1, 5], [3, 4]]
const p21 = p.get([1, 0])
print(p21) // 3
console.log()

// resize a multi dimensional matrix
console.log('resizing a matrix')
const j = matrix()
let defaultValue = 0
j.resize([2, 2, 2], defaultValue)
print(j) // [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]
print(j.size()) // [2, 2, 2]
j.resize([2, 2])
print(j) // [[0, 0], [0, 0]]
print(j.size()) // [2, 2]
console.log()

// setting a value outside the matrices range will resize the matrix.
// new elements will be initialized with zero.
console.log('set a value outside a matrices range')
const k = matrix()
k.subset(index(2), 6)
print(k) // [0, 0, 6]
console.log()

console.log('set a value outside a matrices range, setting other new entries to null')
const m = matrix()
defaultValue = null
m.subset(index(2), 6, defaultValue)
print(m) // [null, null, 6]
console.log()

// create ranges
console.log('create ranges')
print(range(1, 6)) // [1, 2, 3, 4, 5]
print(range(0, 18, 3)) // [0, 3, 6, 9, 12, 15]
print(range('2:-1:-3')) // [2, 1, 0, -1, -2]
print(factorial(range('1:6'))) // [1, 2, 6, 24, 120]
console.log()

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  const precision = 14
  console.log(format(value, precision))
}
