# Unit

Math.js supports units. Basic operations `add`, `subtract`, `multiply`,
and `divide` can be performed on units.
Trigonometric functions like `sin` support units with an angle as argument.
Units can be converted from one to another using function `in`,
an the value of a unit can be retrieved using `toNumber`.

```js
var a = math.unit(55, 'cm');    // 550 mm
var b = math.unit('0.1m');      // 100 mm
math.add(a, b);                 // 0.65 m
b.in('cm');                     // 10 cm  Alternatively: math.in(b, 'cm')
b.toNumber('cm');               // 10

math.eval('2 inch in cm');      // 5.08 cm
math.eval('cos(45 deg)');       // 0.7071067811865476
```
