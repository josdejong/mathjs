// load math.js (using node.js)
const { identity, multiply, transpose, complex } = require('..')

// create a sparse matrix
console.log('creating a 1000x1000 sparse matrix...')
const a = identity(1000, 1000, 'sparse')

// do operations with a sparse matrix
console.log('doing some operations on the sparse matrix...')
const b = multiply(a, a)
const c = multiply(b, complex(2, 2))
const d = transpose(c)
const e = multiply(d, a)
console.log('size(e)=', e.size())

// we will not print the output, but doing the same operations
// with a dense matrix are very slow, try it for yourself.
console.log('already done')
console.log('now try this with a dense matrix :)')
