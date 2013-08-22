// units

// load math.js
var math = require('../index');

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  console.log(math.format(value));
}

// units can be created by providing a value and plain unit, or by providing
// a string with a valued unit.
console.log('create units');
var a = math.unit(55, 'cm');
var b = math.unit('0.1m');
print(a);                           // 550 mm
print(b);                           // 100 mm
console.log();

// units can be added, subtracted, and multiplied or divided by numbers
console.log('perform operations');
print(math.add(a, b));              // 0.65 m
print(math.multiply(b, 2));         // 200 mm
console.log();

// units can be converted to a specific type, or to a number
console.log('convert to another type or to a number');
print(b.in('cm'));                  // 10 cm  Alternatively: math.in(b, 'cm')
print(b.in('inch'));                // 3.937 inch
print(b.toNumber('cm'));            // 10
console.log();

// the expression parser supports units too
console.log('parse expressions');
print(math.eval('2 inch in cm'));    // 5.08 cm
print(math.eval('cos(45 deg)'));     // 0.7071067811865476
console.log();
