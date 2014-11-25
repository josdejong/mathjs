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

print(math.or(1, 2));               // returns Number 3
print(math.or([1, 2, 3], 4));       // returns Array [5, 6, 7]
var c = math.unit('12 cm');
var d = math.unit('52 mm');
print(c);
print(d);
print(math.or(c, d));               // returns Unit 124 mm
