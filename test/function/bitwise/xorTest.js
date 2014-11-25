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

print(math.xor(1, 2));               // returns Number 3
print(math.xor([2, 3, 4], 4));       // returns Array [6, 7, 0]

var b = math.unit('12 m');
var c = math.unit('12 cm');
var d = math.unit('52 mm');
print(c);
print(d);
print(math.xor(c, d));               // returns Unit 76 mm
print(math.xor(b, d));               // returns Unit 48 mm
