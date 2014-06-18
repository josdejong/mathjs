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


## Reference

### Units

Math.js comes with the following built-in units.

Base                | Unit
------------------- | ---
Length              | meter (m), inch (in), foot (ft), yard (yd), mile (mi), link (li), rod (rd), chain (ch), angstrom, mil
Surface             | m2, sqin, sqft, sqyd, sqmi, sqrd, sqch, sqmil
Volume              | m3, litre (l, L), cc, cuin, cuft, cuyd, teaspoon, tablespoon
Liquid              | volume	minim (min), fluiddram (fldr), fluidounce (fldz), gill (gi), cup (cp), pint (pt), quart (qt), gallon (gal), beerbarrel (bbl), oilbarrel (obl), hogshead, drop (gtt)
Angles              | rad, deg, grad, cycle
Time                | second (s), seconds, minute, minutes, hour (h), hours, day, days
Mass                | gram(g), tonne, ton, grain (gr), dram(dr), ounce (oz), poundmass (lbm), hundredweight (cwt), stick
Electric current    | ampere (A)
Temperature         | kelvin (K), celsius (degC), fahrenheit (degF), rankine (degR)
Amount of substance | mole (mol)
Luminous            | intensity	candela (cd)
Force               | newton (N), poundforce (lbf)
Binary              | bit (b), byte (B)


### Prefixes

The following decimal prefixes are available.

Name    | Abbreviation  | Value
------- | ------------- | -----
deca    | da            | 1e1
hecto   | h             | 1e2
kilo    | k             | 1e3
mega    | M             | 1e6
giga    | G             | 1e9
tera    | T             | 1e12
peta    | P             | 1e15
exa     | E             | 1e18
zetta   | Z             | 1e21
yotta   | Y             | 1e24

Name    | Abbreviation  | Value
------  | ------------- | -----
deci    | d             | 1e-1
centi   | c             | 1e-2
milli   | m             | 1e-3
micro   | u             | 1e-6
nano    | n             | 1e-9
pico    | p             | 1e-12
femto   | f             | 1e-15
atto    | a             | 1e-18
zepto   | z             | 1e-21
yocto   | y             | 1e-24

The following binary prefixes are available.
They can be used with units `bit` (`b`) and `byte` (`B`).

Name        | Abbreviation  | Value
----------- | ------------- | -----
kilo, kibi  | k, Ki         | 1024
mega, mebi  | M, Mi         | 1024^2
giga, gibi  | G, Gi         | 1024^3
tera, tebi  | T, Ti         | 1024^4
peta, pebi  | P, Pi         | 1024^5
exa, exi    | E, Ei         | 1024^6
zetta, zebi | Z, Zi         | 1024^7
yotta, yobi | Y, Yi         | 1024^8
