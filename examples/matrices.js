// matrices

// load math.js
var math = require('../math.js');

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
    console.log(math.format(value));
}

// create matrices and arrays. A matrix is just a wrapper around an Array,
// providing some handy utilities.
console.log('create a matrix');
var m1 = math.matrix([1, 4, 9, 16, 25]);
print(m1);                                  // [1, 4, 9, 16, 25]
var m2 = math.ones([2, 3]);
print(m2);                                  // [[1, 1, 1], [1, 1, 1]]
print(m2.size());                           // [2, 3]

// the Array data of a Matrix can be retrieved using valueOf()
var array = m1.valueOf();
print(array);                               // [1, 4, 9, 16, 25]

// Matrices can be cloned
var clone = m1.clone();
print(clone);                               // [1, 4, 9, 16, 25]
console.log();

// perform operations with matrices
console.log('perform operations');
print(math.sqrt(m1));                       // [1, 2, 3, 4, 5]
var m3 = [1, 2, 3, 4, 5];
print(math.factorial(m3));                  // [1, 2, 6, 24, 120]
console.log();

// create and manipulate matrices. Arrays and Matrices can be used mixed.
console.log('manipulate matrices');
var a = [[1, 2], [3, 4]];
print(a);                                   // [[1, 2], [3, 4]]
var b = math.matrix([[5, 6], [1, 1]]);
print(b);                                   // [[5, 6], [1, 1]]
b.set([2, [1, 2]], [[7, 8]]);
print(b);                                   // [[5, 6], [7, 8]]
var c = math.multiply(a, b);
print(c);                                   // [[19, 22], [43, 50]]
var d = c.get([2, 1]);
print(d);                                   // 43
console.log();

// get a sub matrix
console.log('get a sub matrix');
var e = math.diag(math.range(1,3));
print(e);                                   // [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
print(e.get([[2, 3], [2, 3]]));             // [[2, 0], [0, 3]]
console.log();

// resize a multi dimensional matrix
console.log('resizing a matrix');
var f = math.matrix();
f.resize([2, 2, 2]);
print(f);                                   // [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]
print(f.size());                            // [2, 2, 2]
f.resize([2, 2]);
print(f);                                   // [[0, 0], [0, 0]]
print(f.size());                            // [2, 2]
f.set([3, 2], 6);
print(f);                                   // [[0, 0], [0, 0], [0, 6]]
print(f.size());                            // [3, 2]
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
print(parser.eval('a = [1, 2; 3, 4]'));     // [[1, 2], [3, 4]]
print(parser.eval('b = [5, 6; 7, 8]'));     // [[5, 6], [1, 1]]
print(parser.eval('b(2, 1:2) = [7, 8]'));   // [[5, 6], [7, 8]]
print(parser.eval('c = a * b'));            // [[19, 22], [43, 50]]
print(parser.eval('d = c(2, 1)'));          // 43
console.log();
