// Convert from Fraction to BigNumber
//
// In the configuration of math.js one can specify the default number type to
// be `number`, `BigNumber`, or `Fraction`. Not all functions support `Fraction`
// or `BigNumber`, and if not supported these input types will be converted to
// numbers.
//
// When `Fraction` is configured, one may want to fallback to `BigNumber`
// instead of `number`. Also, one may want to be able to mix `Fraction` and
// `BigNumber` in operations like summing them up. This can be achieved by
// adding an extra conversion to the list of conversions as demonstrated in
// this example.

// Create an empty math.js instance, with only typed
// (every instance contains `import` and `config` also out of the box)
const { create, typedDependencies, all } = require('../..')
const math = create({
  typedDependencies
})

// TODO: this should be much easier
const allExceptLoaded = Object.keys(all)
  .map(key => all[key])
  .filter(factory => math[factory.fn] === undefined)

// Configure to use fractions by default
math.config({ number: 'Fraction' })

// Add a conversion from Faction -> BigNumber
// this conversion:
// - must be inserted in the conversions list before the conversion Fraction -> number
// - must be added to the conversions before loading functions into math.js
math.typed.conversions.unshift({
  from: 'Fraction',
  to: 'BigNumber',
  convert: function (fraction) {
    return new math.BigNumber(fraction.n).div(fraction.d)
  }
})

// Import all data types, functions, constants, the expression parser, etc.
math.import(allExceptLoaded)

// Operators `add` and `divide` do have support for Fractions, so the result
// will simply be a Fraction (default behavior of math.js).
const ans1 = math.evaluate('1/3 + 1/4')
console.log(math.typeOf(ans1), math.format(ans1))
// outputs "Fraction 7/12"

// Function sqrt doesn't have Fraction support, will now fall back to BigNumber
// instead of number.
const ans2 = math.evaluate('sqrt(4)')
console.log(math.typeOf(ans2), math.format(ans2))
// outputs "BigNumber 2"

// We can now do operations with mixed Fractions and BigNumbers
const ans3 = math.add(math.fraction(2, 5), math.bignumber(3))
console.log(math.typeOf(ans3), math.format(ans3))
// outputs "BigNumber 3.4"
