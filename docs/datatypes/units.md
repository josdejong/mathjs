# Units

Math.js supports units. Units can be used to do calculations and to perform
conversions.


## API

Units can be created using the function `math.unit`. This function accepts
either a single string argument containing a value and unit, or two arguments,
the first being a numeric value and the second a string containing a unit.
Most units support prefixes like `k` or `kilo`, and many units have both a
full name and an abbreviation. The returned object is a `Unit`.

Syntax:

```js
math.unit(value: number, name: string) : Unit
math.unit(unit: string) : Unit
math.unit(unit: Unit) : Unit
```

Example usage:

```js
var a = math.unit(45, 'cm');            // Unit 450 mm
var b = math.unit('0.1 kilogram');      // Unit 100 gram
var c = math.unit('2 inch');            // Unit 2 inch
var d = math.unit('90 km/h');           // Unit 90 km/h
var e = math.unit('101325 kg/(m s^2)'); // Unit 101325 kg / (m s^2)
```

A `Unit` contains the following functions:

- `clone()`. Clone the unit, returns a new unit with the same parameters.
- `equalBase(unit)`. Test whether a unit has the same base as an other unit:
  length, mass, etc.
- `equals(unit)`. Test whether a unit equals an other unit. Units are equal
  when they have the same base and same value when normalized to SI units.
- `format([precision])`. Get a string representation of the unit. The function
  will determine the best fitting prefix for the unit. If precision is defined,
  the units value will be rounded to the provided number of digits.
- `fromJSON(json)`. Revive a unit from a JSON object. Accepts
  An object `{mathjs: 'Unit', value: number, unit: string, fixPrefix: boolean}`,
  where the property `mathjs` and `fixPrefix` are optional.
  Used when deserializing a unit, see [Serialization](../serialization.md).
- `to(unitName)`. Convert the unit to a specific unit name. Returns a clone of
  the unit with a fixed prefix and unit.
- `toJSON()`. Returns a JSON representation of the unit, with signature
  `{mathjs: 'Unit', value: number, unit: string, fixPrefix: boolean}`.
  Used when serializing a unit, see [Serialization](../serialization.md).
- `toNumber(unitName)`. Get the value of a unit when converted to the
  specified unit (a unit with optional prefix but without value).
  The type of the returned value is always `number`.
- `toNumeric(unitName)`. Get the value of a unit when converted to the
  specified unit (a unit with optional prefix but without value).
  The type of the returned value depends on how the unit was created and 
  can be `number`, `Fraction`, or `BigNumber`.
- `toString()`. Get a string representation of the unit. The function will
  determine the best fitting prefix for the unit.

```js
var a = math.unit(55, 'cm');        // Unit 550 mm
var b = math.unit('0.1 kilogram');  // Unit 100 gram
var c = math.unit('2 inch');        // Unit 100 millimeter

var d = c.to('cm');                 // Unit 5.08 cm
b.toNumber('gram');                 // Number 100
math.number(b, 'gram');             // Number 100

c.equals(a);                        // false
c.equals(d);                        // true
c.equalBase(a);                     // true
c.equalBase(b);                     // false

d.toString();                       // String "5.08 cm"
```

Use care when creating a unit with multiple terms in the denominator. Implicit multiplication has the same operator precedence as explicit multiplication and division, which means these three expressions are identical:

```js
// These three are identical
var correct1 = math.unit('8.314 m^3 Pa / mol / K');         // Unit 8.314 (m^3 Pa) / (mol K)
var correct2 = math.unit('8.314 (m^3 Pa) / (mol K)');       // Unit 8.314 (m^3 Pa) / (mol K)
var correct3 = math.unit('8.314 (m^3 * Pa) / (mol * K)');   // Unit 8.314 (m^3 Pa) / (mol K)
```
But this expression, which omits the second `/` between `mol` and `K`, results in the wrong value:

```js
// Missing the second '/' between 'mol' and 'K'
var incorrect = math.unit('8.314 m^3 Pa / mol K');          // Unit 8.314 (m^3 Pa K) / mol
```

## Calculations

The operations that support units are `add`, `subtract`, `multiply`, `divide`, `pow`, `abs`, `sqrt`, `square`, `cube`, and `sign`.
Trigonometric functions like `cos` are also supported when the argument is an angle.

```js
var a = math.unit(45, 'cm');        // Unit 450 mm
var b = math.unit('0.1m');          // Unit 100 mm
math.add(a, b);                     // Unit 0.65 m
math.multiply(b, 2);                // Unit 200 mm

var c = math.unit(45, 'deg');       // Unit 45 deg
math.cos(c);                        // Number 0.7071067811865476

// Kinetic energy of average sedan on highway
var d = math.unit('80 mi/h')        // Unit 80 mi/h
var e = math.unit('2 tonne')        // Unit 2 tonne
var f = math.multiply(0.5, math.multipy(math.pow(d, 2), e));
                                    // 1.2790064742399996 MJ
```

Operations with arrays are supported too:

```js
// Force on a charged particle moving through a magnetic field
var B = math.eval('[1, 0, 0] T');            // [1 T, 0 T, 0 T]
var v = math.eval('[0, 1, 0] m/s');          // [0 m / s, 1 m / s, 0 m / s]
var q = math.eval('1 C');                    // 1 C

var F = math.multiply(q, math.cross(v, B));  // [0 N, 0 N, -1 N]
```

All arithmetic operators act on the value of the unit as it is represented in SI units.
This may lead to surprising behavior when working with temperature scales like `celsius` (or `degC`) and `fahrenheit` (or `degF`).
In general you should avoid calculations using `celsius` and `fahrenheit`. Rather, use `kelvin` (or `K`) and `rankine` (or `R`) instead.
This example highlights some problems when using `celsius` and `fahrenheit` in calculations:

```js
var T_14F = math.unit('14 degF');          // Unit 14 degF (263.15 K)
var T_28F = math.multiply(T1, 2);          // Unit 487.67 degF (526.3 K), not 28 degF

var Tnegative = math.unit(-13, 'degF');    // Unit -13 degF (248.15 K)
var Tpositive = math.abs(T1);              // Unit -13 degF (248.15 K), not 13 degF

var Trate1 = math.eval('5 (degC/hour)');   // Unit 5 degC/hour
var Trate2 = math.eval('(5 degC)/hour');   // Unit 278.15 degC/hour
```

The expression parser supports units too. This is described in the section about
units on the page [Syntax](../expressions/syntax.md#units).


## Reference

All available units and prefixes are listed on the page [Unit reference](../reference/units.md).
