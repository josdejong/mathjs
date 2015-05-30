var math = require('../index');

// create a sparse matrix
var a = math.eye(1000, 1000, 'sparse');

// do operations with a sparse matrix
var b = math.multiply(a, a);
var c = math.multiply(b, math.complex(2, 2));
var d = math.transpose(c);
var e = math.multiply(d, a);

// we will not print the output, but doing the same operations
// with a dense matrix are very slow, try it for yourself.
console.log('already done');
console.log('now try this with a dense matrix...');
