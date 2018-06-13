// load math.js (using node.js)
const math = require('../index')

// create a sparse matrix
console.log('creating a 1000x1000 sparse matrix...')
const a = math.identity(1000, 1000, 'sparse')

// do operations with a sparse matrix
console.log('doing some operations on the sparse matrix...')
const b = math.multiply(a, a)
const c = math.multiply(b, math.complex(2, 2))
const d = math.transpose(c)
const e = math.multiply(d, a)
console.log('size(e)=', e.size())

// we will not print the output, but doing the same operations
// with a dense matrix are very slow, try it for yourself.
console.log('already done')
console.log('now try this with a dense matrix :)')
