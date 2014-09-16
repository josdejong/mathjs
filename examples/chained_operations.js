// chained operations

// load math.js
var math = require('../index');

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  var precision = 14;
  console.log(math.format(value, precision));
}

// create a chained operation using the function select
// end a chain using done().
var a = math.select(3)
    .add(4)
    .multiply(2)
    .done();
print(a);                       // 14

// all functions and variables available in the math namespace can be used
// from a selector
var b = math.select()
    .pi
    .divide(4)
    .sin()
    .square()
    .done();
print(b);                       // 0.5

// A selector has a few special methods: done, toString, valueOf, get, and set.
// these are demonstrated in the following examples

// toString will return a string representation of the selectors value
var selector = math.select(2).divide(3);
var str = selector.toString();
print(str);                     // "0.6666666666666666"

// a selector has a .valueOf(), which returns the value hold by the selector.
// This allows using it in regular operations. The function valueOf() acts the
// same as function done().
print(selector.valueOf());      // 0.66667
print(selector + 2);            // 2.66667

// the function subset can be used to get or replace sub matrices
var array = [[1, 2], [3, 4]];
var v = math.select(array)
    .subset(math.index(1, 0))
    .done();
print(v);                       // 3

var m = math.select(array)
    .subset(math.index(0, 0), 8)
    .multiply(3)
    .done();
print(m);                       // [[24, 6], [9, 12]]
