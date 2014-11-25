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

print(math.not(1));               // returns Number -2

print(math.not([2, -3, 4]));       // returns Array [-3, 2, 5]

var c = math.unit('-12 m');
var d = math.unit('52 mm');
print(math.not(c));               // returns Unit 11 m
print(math.not(d));               // returns Unit -53 mm
