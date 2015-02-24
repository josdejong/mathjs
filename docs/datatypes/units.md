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
var a = math.unit(45, 'cm');        // Unit 450 mm
var b = math.unit('0.1 kilogram');  // Unit 100 gram
var c = math.unit('2 inch');        // Unit 2 inch
```

A `Unit` contains the following functions:

- `clone()`. Clone the unit, returns a new unit with the same parameters.
- `equalBase(unit)`. Test whether a unit has the same base as an other unit:
  length, mass, etc.
- `equals(unit)`. Test whether a unit equals an other unit. Units are equal
  when they have the same base and same value when normalized to SI units.
- `to(unitName)`. Convert the unit to a specific unit name. Returns a clone of
  the unit with a fixed prefix and unit.
- `toNumber(unitName)`. Get the value of a unit when converted to the
  specified unit (a unit with optional prefix but without value).
- `format([precision])`. Get a string representation of the unit. The function
  will determine the best fitting prefix for the unit. If precision is defined,
  the units value will be rounded to the provided number of digits.
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


## Calculations

Basic operations `add`, `subtract`, `multiply`, and `divide` can be performed
on units. Trigonometric functions like `sin` support units with an angle as
argument.

```js
var a = math.unit(45, 'cm');        // Unit 450 mm
var b = math.unit('0.1m');          // Unit 100 mm
math.add(a, b);                     // Unit 0.65 m
math.multiply(b, 2);                // Unit 200 mm

var c = math.unit(45, 'deg');       // Unit 45 deg
math.cos(c);                        // Number 0.7071067811865476
```

The expression parser supports units too. This is described in the section about
units on the page [Syntax](../expressions/syntax.md#units).


## Reference

All available units and prefixes are listed on the page [Unit reference](../reference/units.md).
