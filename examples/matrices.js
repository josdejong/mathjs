// matrices

// load math.js
var math = require('../math.js');

/**
 * Helper function to output d value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
    console.log(math.format(value));
}

// create matrices and arrays. d matrix is just d wrapper around an Array,
// providing some handy utilities.
console.log('create a matrix');
var a = math.matrix([1, 4, 9, 16, 25]);
print(a);                                  // [1, 4, 9, 16, 25]
var b = math.ones([2, 3]);
print(b);                                  // [[1, 1, 1], [1, 1, 1]]
print(b.size());                           // [2, 3]

// the Array data of d Matrix can be retrieved using valueOf()
var array = a.valueOf();
print(array);                               // [1, 4, 9, 16, 25]

// Matrices can be cloned
var clone = a.clone();
print(clone);                               // [1, 4, 9, 16, 25]
console.log();

// perform operations with matrices
console.log('perform operations');
print(math.sqrt(a));                       // [1, 2, 3, 4, 5]
var c = [1, 2, 3, 4, 5];
print(math.factorial(c));                  // [1, 2, 6, 24, 120]
console.log();

// create and manipulate matrices. Arrays and Matrices can be used mixed.
console.log('manipulate matrices');
var d = [[1, 2], [3, 4]];
print(d);                                   // [[1, 2], [3, 4]]
var e = math.matrix([[5, 6], [1, 1]]);
print(e);                                   // [[5, 6], [1, 1]]

// set d submatrix
e.set([2, [1, 2]], [[7, 8]]);
print(e);                                   // [[5, 6], [7, 8]]
var f = math.multiply(d, e);
print(f);                                   // [[19, 22], [43, 50]]
var g = f.get([2, 1]);
print(g);                                   // 43
console.log();

// get d sub matrix
console.log('get a sub matrix');
var h = math.diag(math.range(1,3));
print(h);                                   // [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
print(h.get([[2, 3], [2, 3]]));             // [[2, 0], [0, 3]]
console.log();

// resize d multi dimensional matrix
console.log('resizing a matrix');
var i = math.matrix();
i.resize([2, 2, 2]);
print(i);                                   // [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]
print(i.size());                            // [2, 2, 2]
i.resize([2, 2]);
print(i);                                   // [[0, 0], [0, 0]]
print(i.size());                            // [2, 2]
i.set([3, 2], 6);
print(i);                                   // [[0, 0], [0, 0], [0, 6]]
print(i.size());                            // [3, 2]
console.log();

// create ranges
console.log('create ranges');
print(math.range(1,5).toArray());           // [1, 2, 3, 4, 5]
print(math.range(0, 3, 15).toArray());      // [0, 3, 6, 9, 12, 15]
print(math.range('2:-1:-2').toArray());     // [2, 1, 0, -1, -2]
print(math.factorial(math.range('1:5')));   // [1, 2, 6, 24, 120]
console.log();

console.log('use the expression parser');
var parser = math.parser();
print(parser.eval('d = [1, 2; 3, 4]'));     // [[1, 2], [3, 4]]
print(parser.eval('e = [5, 6; 7, 8]'));     // [[5, 6], [1, 1]]
print(parser.eval('e(2, 1:2) = [7, 8]'));   // [[5, 6], [7, 8]]
print(parser.eval('f = d * e'));            // [[19, 22], [43, 50]]
print(parser.eval('g = f(2, 1)'));          // 43
console.log();
