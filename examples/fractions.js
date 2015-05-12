// Fractions

// load math.js
var math = require('../index');

// configure the default type of numbers as Fractions
math.config({
  number: 'fraction'   // Default type of number:
                       // 'number' (default), 'bignumber', or 'fraction'
});

console.log('round-off errors with numbers');
print(math.add(0.1, 0.2));    // Number, 0.30000000000000004
print(math.divide(0.3, 0.2)); // Number, 1.4999999999999998
console.log();

console.log('no round-off errors with Fractions');
print(math.add(math.fraction(0.1), math.fraction(0.2)));     // Fraction, 0.3
print(math.divide(math.fraction(0.3), math.fraction(0.2)));  // Fraction, 1.5
console.log();

console.log('Represent an infinite number of repeating digits');
print(math.fraction('1/3'));    // Fraction, 0.(3)
print(math.fraction('2/7'));    // Fraction, 0.(285714)
print(math.fraction('23/11'));  // Fraction, 2.(09)
console.log();

// one can work conveniently with fractions using the expression parser.
// note though that Fractions are only supported by basic arithmetic functions
console.log('use fractions in the expression parser');
print(math.eval('0.1 + 0.2'));  // Fraction, 0.3
print(math.eval('0.3 / 0.2'));  // Fraction, 1.5
print(math.eval('23 / 11'));    // Fraction, 2.(09)
console.log();

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  console.log(math.format(value));
}
