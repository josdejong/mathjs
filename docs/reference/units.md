# Unit reference

This page lists all available units and prefixes. How to use units is explained on the page [Units](../datatypes/units.md).

## Units

Math.js comes with the following built-in units.

Base                | Unit
------------------- | ---
Length              | meter (m), inch (in), foot (ft), yard (yd), mile (mi), link (li), rod (rd), chain (ch), angstrom, mil
Surface             | m2, sqin, sqft, sqyd, sqmi, sqrd, sqch, sqmil
Volume              | m3, litre (l, L, lt, liter), cc, cuin, cuft, cuyd, teaspoon, tablespoon
Liquid volume       | minim (min), fluiddram (fldr), fluidounce (floz), gill (gi), cup (cp), pint (pt), quart (qt), gallon (gal), beerbarrel (bbl), oilbarrel (obl), hogshead, drop (gtt)
Angles              | rad, deg, grad, cycle
Time                | second (s), seconds, minute (minutes), hour (h, hours), day (days)
Mass                | gram(g), tonne, ton, grain (gr), dram(dr), ounce (oz), poundmass (lbm, lb, lbs), hundredweight (cwt), stick, stone
Electric current    | ampere (A)
Temperature         | kelvin (K), celsius (degC), fahrenheit (degF), rankine (degR)
Amount of substance | mole (mol)
Luminous intensity  | candela (cd)
Force               | newton (N), dyne (dyn), poundforce (lbf)
Energy              | joule (J), erg, Wh, BTU, electronvolt (eV)
Power               | watt (W), hp
Pressure            | Pa, psi, atm
Electricity and Magnetism | ampere (A), coulomb (C), watt (W), volt (V), ohm, farad (F), weber (Wb), tesla (T), henry (H), siemens (S), electronvolt (eV)
Binary              | bit (b), byte (B)

Note that all relevant units can also be written in plural form, for example `5 meters` instead of `5 meter` or `10 seconds` instead of `10 second`. 

Surface and volume units can alternatively be expressed in terms of length units raised to a power, for example `100 in^2` instead of `100 sqin`.

## Prefixes

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

Name | Abbreviation | Value
---- | ------------ | -----
kibi | Ki           | 1024
mebi | Mi           | 1024^2
gibi | Gi           | 1024^3
tebi | Ti           | 1024^4
pebi | Pi           | 1024^5
exi  | Ei           | 1024^6
zebi | Zi           | 1024^7
yobi | Yi           | 1024^8

Name  | Abbreviation | Value
----- | ------------ | -----
kilo  | k            | 1e3
mega  | M            | 1e6
giga  | G            | 1e9
tera  | T            | 1e12
peta  | P            | 1e15
exa   | E            | 1e18
zetta | Z            | 1e21
yotta | Y            | 1e24
