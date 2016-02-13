# Unit reference

This page lists all available units, prefixes, and physical constants. 
How to use units is explained on the page [Units](../datatypes/units.md).

## Units

Math.js comes with the following built-in units.

Base                | Unit
------------------- | ---
Length              | meter (m), inch (in), foot (ft), yard (yd), mile (mi), link (li), rod (rd), chain (ch), angstrom, mil
Surface             | m2, sqin, sqft, sqyd, sqmi, sqrd, sqch, sqmil
Volume              | m3, litre (l, L, lt, liter), cc, cuin, cuft, cuyd, teaspoon, tablespoon
Liquid volume       | minim (min), fluiddram (fldr), fluidounce (floz), gill (gi), cup (cp), pint (pt), quart (qt), gallon (gal), beerbarrel (bbl), oilbarrel (obl), hogshead, drop (gtt)
Angles              | rad (radian), deg (degree), grad (gradian), cycle, arcsec (arcsecond), arcmin (arcminute) 
Time                | second (s, secs, seconds), minute (mins, minutes), hour (h, hr, hrs, hours), day (days), week (weeks), month (months), year (years), decade (decades), century (centuries), millennium (millennia)
Frequency           | hertz (Hz)
Mass                | gram(g), tonne, ton, grain (gr), dram(dr), ounce (oz), poundmass (lbm, lb, lbs), hundredweight (cwt), stick, stone
Electric current    | ampere (A)
Temperature         | kelvin (K), celsius (degC), fahrenheit (degF), rankine (degR)
Amount of substance | mole (mol)
Luminous intensity  | candela (cd)
Force               | newton (N), dyne (dyn), poundforce (lbf)
Energy              | joule (J), erg, Wh, BTU, electronvolt (eV)
Power               | watt (W), hp
Pressure            | Pa, psi, atm
Electricity and magnetism | ampere (A), coulomb (C), watt (W), volt (V), ohm, farad (F), weber (Wb), tesla (T), henry (H), siemens (S), electronvolt (eV)
Binary              | bit (b), byte (B)

Note: all time units are based on the Julian year, with one month being 1/12th of a Julian year, a year being one Julian year, a decade being 10 Julian years, a century being 100, and a millennium being 1000.

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


## Physical Constants

Math.js includes the following physical constants. See [Wikipedia](http://en.wikipedia.org/wiki/Physical_constants) for more information.


### Universal constants

Name                  | Symbol                                                 | Value             | Unit
----------------------|--------------------------------------------------------|-------------------|-------------------------------------------------------
speedOfLight          | <i>c</i>                                               | 299792458         | m &#183; s<sup>-1</sup>
gravitationConstant   | <i>G</i>                                               | 6.6738480e-11     | m<sup>3</sup> &#183; kg<sup>-1</sup> &#183; s<sup>-2</sup>
planckConstant        | <i>h</i>                                               | 6.626069311e-34   | J &#183; s
reducedPlanckConstant | <i><span style="text-decoration:overline">h</span></i> | 1.05457172647e-34 | J &#183; s 


### Electromagnetic

Name                      | Symbol                                           | Value                 | Unit
--------------------------|--------------------------------------------------|-----------------------|----------------------------------------
magneticConstant          | <i>&mu;<sub>0</sub></i>                          | 1.2566370614e-6       | N &#183; A<sup>-2</sup>
electricConstant          | <i>&epsilon;<sub>0</sub></i>                     | 8.854187817e-12       | F &#183; m<sup>-1</sup>
vacuumImpedance           | <i>Z<sub>0</sub></i>                             | 376.730313461         | &ohm;
coulomb                   | <i>&kappa;</i>                                   | 8.9875517873681764e9  | N &#183; m<sup>2</sup> &#183; C<sup>-2</sup>
elementaryCharge          | <i>e</i>                                         | 1.60217656535e-19     | C
bohrMagneton              | <i>&mu;<sub>B</sub></i>                          | 9.2740096820e-24      | J &#183; T<sup>-1</sup>
conductanceQuantum        | <i>G<sub>0</sub></i>                             | 7.748091734625e-5     | S
inverseConductanceQuantum | <i>G<sub>0</sub><sup>-1</sup></i>                | 12906.403721742       | &ohm;
magneticFluxQuantum       | <i><font face="Symbol">f</font><sub>0</sub></i>  | 2.06783375846e-15     | Wb
nuclearMagneton           | <i>&mu;<sub>N</sub></i>                          | 5.0507835311e-27      | J &#183; T<sup>-1</sup>
klitzing                  | <i>R<sub>K</sub></i>                             | 25812.807443484       | &ohm;

<!-- TODO: implement josephson
josephson                 | <i>K<sub>J</sub></i>                             | 4.8359787011e-14    | Hz &#183; V<sup>-1</sup> 
-->


### Atomic and nuclear constants

Name                    | Symbol                | Value                 | Unit
------------------------|------------------------------|-----------------------|----------------------------------
bohrRadius              | <i>a<sub>0</sub></i>         | 5.291772109217e-11    | m
classicalElectronRadius | <i>r<sub>e</sub></i>         | 2.817940326727e-15    | m
electronMass            | <i>m<sub>e</sub></i>         | 9.1093829140e-31      | kg
fermiCoupling           | <i>G<sub>F</sub></i>         | 1.1663645e-5          | GeV<sup>-2</sup>
fineStructure           | <i>&alpha;</i>               | 7.297352569824e-3     | -
hartreeEnergy           | <i>E<abbr>h</abbr> </i>      | 4.3597443419e-18      | J
protonMass              | <i>m<sub>p</sub></i>         | 1.67262177774e-27     | kg
deuteronMass            | <i>m<sub>d</sub></i>         | 3.3435830926e-27      | kg
neutronMass             | <i>m<sub>n</sub></i>         | 1.6749271613e-27      | kg
quantumOfCirculation    | <i>h / (2m<sub>e</sub>)</i>  | 3.636947552024e-4     | m<sup>2</sup> &#183; s<sup>-1</sup>
rydberg                 | <i>R<sub>&infin;</sub></i>   | 10973731.56853955     | m<sup>-1</sup>
thomsonCrossSection     |                              | 6.65245873413e-29     | m<sup>2</sup>
weakMixingAngle         |                              | 0.222321              | -
efimovFactor            |                              | 22.7                  | -


### Physico-chemical constants

Name                | Symbol                       | Value               | Unit
--------------------|------------------------------|---------------------|--------------------------------------------
atomicMass          | <i>m<sub>u</sub></i>         | 1.66053892173e-27   | kg
avogadro            | <i>N<sub>A</sub></i>         | 6.0221412927e23     | mol<sup>-1</sup>
boltzmann           | <i>k</i>                     | 1.380648813e-23     | J &#183; K<sup>-1</sup>
faraday             | <i>F</i>                     | 96485.336521        | C &#183; mol<sup>-1</sup>
firstRadiation      | <i>c<sub>1</sub></i>         | 3.7417715317e-16    | W &#183; m<sup>2</sup>
loschmidt           | <i>n<sub>0</sub></i>         | 2.686780524e25      | m<sup>-3</sup>
gasConstant         | <i>R</i>                     | 8.314462175         | J &#183; K<sup>-1</sup> &#183; mol<sup>-1</sup>
molarPlanckConstant | <i>N<sub>A</sub> &#183; h</i>| 3.990312717628e-10| J &#183; s &#183; mol<sup>-1</sup>
molarVolume         | <i>V<sub>m</sub></i>         | 2.241396820e-10     | m<sup>3</sup> &#183; mol<sup>-1</sup>
sackurTetrode       |                              | -1.164870823        | -
secondRadiation     | <i>c<sub>2</sub></i>         | 1.438777013e-2      | m &#183; K
stefanBoltzmann     | <i>&sigma;</i>               | 5.67037321e-8       | W &#183; m<sup>-2</sup> &#183; K<sup>-4</sup>
wienDisplacement    | <i>b</i>                     | 2.897772126e-3      | m &#183; K

<!-- TODO: implement spectralRadiance 
spectralRadiance    | <i>c<sub>1L</sub></i>        | 1.19104286953e-16  | W &#183; m<sup>2</sup> &#183; sr<sup>-1</sup>
-->

Note that the values of `loschmidt` and `molarVolume` are at `T = 273.15 K` and `p = 101.325 kPa`. 
The value of `sackurTetrode` is at `T = 1 K` and `p = 101.325 kPa`.


### Adopted values

Name          | Symbol                       | Value   | Unit
--------------|------------------------------|---------|-------------------------
molarMass     | <i>M<sub>u</sub></i>         | 1e-3    | kg &#183; mol<sup>-1</sup>
molarMassC12  | <i>M(<sub>12</sub>C)</i>     | 1.2e-2  | kg &#183; mol<sup>-1</sup>
gravity       | <i>g<sub>n</sub></i>         | 9.80665 | m &#183; s<sup>-2</sup>
atm           | <i>atm</i>                   | 101325  | Pa


### Natural units

Name              | Symbol                | Value              | Unit
------------------|-----------------------|--------------------|-----
planckLength      | <i>l<sub>P</sub></i>  | 1.61619997e-35     | m
planckMass        | <i>m<sub>P</sub></i>  | 2.1765113e-8       | kg 
planckTime        | <i>t<sub>P</sub></i>  | 5.3910632e-44      | s
planckCharge      | <i>q<sub>P</sub></i>  | 1.87554595641e-18  | C
planckTemperature | <i>T<sub>P</sub></i>  | 1.41683385e+32     | K 
