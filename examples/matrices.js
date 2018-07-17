// matrices

// load math.js (using node.js)
const math = require('../index')

// create matrices and arrays. a matrix is just a wrapper around an Array,
// providing some handy utilities.
console.log('create a matrix')
const a = math.matrix([1, 4, 9, 16, 25])
print(a) // [1, 4, 9, 16, 25]
const b = math.matrix(math.ones([2, 3]))
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
print(math.sqrt(a)) // [1, 2, 3, 4, 5]
const c = [1, 2, 3, 4, 5]
print(math.factorial(c)) // [1, 2, 6, 24, 120]
console.log()

// create and manipulate matrices. Arrays and Matrices can be used mixed.
console.log('manipulate matrices')
const d = [[1, 2], [3, 4]]
print(d) // [[1, 2], [3, 4]]
const e = math.matrix([[5, 6], [1, 1]])
print(e) // [[5, 6], [1, 1]]

// set a submatrix.
// Matrix indexes are zero-based.
e.subset(math.index(1, [0, 1]), [[7, 8]])
print(e) // [[5, 6], [7, 8]]
const f = math.multiply(d, e)
print(f) // [[19, 22], [43, 50]]
const g = f.subset(math.index(1, 0))
print(g) // 43
console.log()

// get a sub matrix
// Matrix indexes are zero-based.
console.log('get a sub matrix')
const h = math.diag(math.range(1, 4))
print(h) // [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
print(h.subset(math.index([1, 2], [1, 2]))) // [[2, 0], [0, 3]]
const i = math.range(1, 6)
print(i) // [1, 2, 3, 4, 5]
print(i.subset(math.index(math.range(1, 4)))) // [2, 3, 4]
console.log()

// resize a multi dimensional matrix
console.log('resizing a matrix')
const j = math.matrix()
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
const k = math.matrix()
k.subset(math.index(2), 6)
print(k) // [0, 0, 6]
console.log()

console.log('set a value outside a matrices range, setting other new entries to null')
const m = math.matrix()
defaultValue = null
m.subset(math.index(2), 6, defaultValue)
print(m) // [null, null, 6]
console.log()

// create ranges
console.log('create ranges')
print(math.range(1, 6)) // [1, 2, 3, 4, 5]
print(math.range(0, 18, 3)) // [0, 3, 6, 9, 12, 15]
print(math.range('2:-1:-3')) // [2, 1, 0, -1, -2]
print(math.factorial(math.range('1:6'))) // [1, 2, 6, 24, 120]
console.log()

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  const precision = 14
  console.log(math.format(value, precision))
}
