// units

// load math.js
var math = require('../index');

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  var precision = 14;
  console.log(math.format(value, precision));
}

// units can be created by providing a value and unit name, or by providing
// a string with a valued unit.
console.log('create units');
var a = math.unit(45, 'cm');
var b = math.unit('0.1m');
print(a);                             // 450 mm
print(b);                             // 100 mm
console.log();

// units can be added, subtracted, and multiplied or divided by numbers and by other units
console.log('perform operations');
print(math.add(a, b));                // 0.55 m
print(math.multiply(b, 2));           // 200 mm
print(math.divide(math.unit('1 m'), math.unit('1 s')));
                    // 1 m / s
print(math.pow(math.unit('12 in'), 3));
                                      // 1728 in^3                   
console.log();

// units can be converted to a specific type, or to a number
console.log('convert to another type or to a number');
print(b.to('cm'));                    // 10 cm  Alternatively: math.to(b, 'cm')
print(math.to(b, 'inch'));            // 3.937 inch
print(b.toNumber('cm'));              // 10
print(math.number(b, 'cm'));          // 10
console.log();

// the expression parser supports units too
console.log('parse expressions');
print(math.eval('2 inch to cm'));     // 5.08 cm
print(math.eval('cos(45 deg)'));      // 0.70711
print(math.eval('90 km/h to m/s'));  // 25 m / s
console.log();

// convert a unit to a number
// A second parameter with the unit for the exported number must be provided
print(math.eval('number(5 cm, mm)')); // number, 50
console.log();

// simplify units
console.log('simplify units');
print(math.eval('100000 N / m^2'));    // 100 kPa
print(math.eval('9.81 m/s^2 * 100 kg * 40 m')); // 39.24 kJ
console.log();

// example engineering calculations
console.log('compute molar volume of ideal gas at 65 C, 14.7 psi in L/mol');
var Rg = math.unit('8.314 N m / mol K');
var P = math.unit('14.7 psi');
var T = math.unit('65 degF');
var v = math.divide(math.multiply(Rg, T), P);
console.log('gas constant (Rg) = ');
print(Rg);
console.log('P = ');
print(P);
console.log('T = ');
print(T);
console.log('v = Rg * T / P =');
print(math.to(v, 'L/mol'));
console.log();

console.log('compute speed of fluid flowing out of hole in a container');
var g = math.unit('9.81 m / s^2');
var h = math.unit('1 m');
console.log('g = ');
var v = math.pow(math.multiply(2, math.multiply(g, h)), 0.5);
print(g);
console.log('h = ');
print(h);
console.log('v = (2 g h) ^ 0.5 =');
print(v);
console.log();

console.log('electrical power consumption:');
print(math.eval('460 V * 20 A * 30 days to kWh'));    // 6624 kWh
console.log();

console.log('circuit design:');
print(math.eval('24 V / (6 mA)'));                    // 4 kohm
console.log();

console.log('operations on arrays:');
var B = math.eval('[1, 0, 0] T');
var v = math.eval('[0, 1, 0] m/s');
var q = math.eval('1 C');
var F = math.multiply(q, math.cross(v, B));
console.log('B (magnetic field strength) = ');
print(B);
console.log('v (particle velocity) = ');
print(v);
console.log('q (particle charge) = ');
print(q);
console.log('F (force) = q (v cross B) = ');
print(F);
