// Fallback from Fraction to BigNumber
//
// In the configuration of math.js one can specify the default number type to
// be `number`, `BigNumber`, or `Fraction`. Not all functions support `Fraction`
// or `BigNumber`, and if not supported these input types will be converted to
// numbers.
//
// When `Fraction` is configured, instead of falling back to `number`, one may
// want to fallback to BigNumber first, and if that's not supported too,
// fallback to `number`. This can be achieved by adding an extra conversion to
// the list of conversions as demonstrated in this example.

// Load the math.js core (contains only `import` and `config`)
var core = require('../../core');
var math = core.create();

// Configure to use fractions by default
math.config({number: 'fraction'});

// Add a conversion from Faction -> BigNumber
// this conversion:
// - must be inserted in the conversions list before the conversion Fraction -> number
// - must be added to the conversions before loading functions into math.js
math.typed.conversions.unshift({
  from: 'Fraction',
  to: 'BigNumber',
  convert: function (value) {
    return new math.type.BigNumber(value);
  }
});

// Import all data types, functions, constants, the expression parser, etc.
math.import(require('../../lib'));

// Operators `add` and `divide` have support for Fractions. The result will be a Fraction
var ans1 = math.eval('1/3 + 1/4');
console.log(math.typeof(ans1), math.format(ans1));
    // outputs "Fraction 7/12"

// function sqrt doesn't have Fraction support, will fall back to BigNumber
var ans2 = math.eval('sqrt(4)');
console.log(math.typeof(ans2), math.format(ans2));
    // outputs "BigNumber 2"
