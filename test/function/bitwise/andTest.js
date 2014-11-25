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

print(math.and(53, 131));               // returns Number 1
print(math.and([1, 12, 31], 42));       // returns Array [0, 8, 10]

var b = math.unit('12 m');
var c = math.unit('12 cm');
var d = math.unit('52 mm');
print(c);
print(d);
print(math.and(c, d));               // returns Unit 48 mm
print(math.and(b, d));               // returns Unit 48 mm
