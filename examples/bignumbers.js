// big numbers

// load math.js and create an instance
// the default type of numbers is configured as big numbers
var mathjs = require('../index'),
    math = mathjs({
      number: 'bignumber',  // Default type of number: 'number' (default) or 'bignumber'
      decimals: 20          // number decimal places behind the dot for big numbers
    });

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  console.log(math.format(value));
}

console.log('round-off errors with numbers');
print(math.add(0.1, 0.2));    // Number, 0.30000000000000004
print(math.divide(0.3, 0.2)); // Number, 1.4999999999999998
console.log();

console.log('no round-off errors with big numbers');
print(math.add(math.bignumber(0.1), math.bignumber(0.2)));     // BigNumber, 0.3
print(math.divide(math.bignumber(0.3), math.bignumber(0.2)));  // BigNumber, 1.5
console.log();

console.log('create big numbers from strings when exceeding the range of a number');
print(math.bignumber(1.2e+500));    // BigNumber, Infinity      WRONG
print(math.bignumber('1.2e+500'));  // BigNumber, 1.2e+500
console.log();

// one can work conveniently with big numbers using the expression parser.
// note though that big numbers are only supported in arithmetic functions
console.log('use big numbers in the expression parser');
print(math.eval('0.1 + 0.2'));  // BigNumber, 0.3
print(math.eval('0.3 / 0.2'));  // BigNumber, 1.5
console.log();
