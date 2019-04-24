// units

// load math.js (using node.js)
const math = require('..')

// units can be created by providing a value and unit name, or by providing
// a string with a valued unit.
console.log('create units')
const a = math.unit(45, 'cm')
const b = math.unit('0.1m')
print(a) // 45 cm
print(b) // 0.1 m
console.log()

// units can be added, subtracted, and multiplied or divided by numbers and by other units
console.log('perform operations')
print(math.add(a, b)) // 55 cm
print(math.multiply(b, 2)) // 0.2 m
print(math.divide(math.unit('1 m'), math.unit('1 s'))) // 1 m / s
print(math.pow(math.unit('12 in'), 3)) // 1728 in^3
console.log()

// units can be converted to a specific type, or to a number
console.log('convert to another type or to a number')
print(b.to('cm')) // 10 cm  Alternatively: math.to(b, 'cm')
print(math.to(b, 'inch')) // 3.9370078740157 inch
print(b.toNumber('cm')) // 10
print(math.number(b, 'cm')) // 10
console.log()

// the expression parser supports units too
console.log('parse expressions')
print(math.evaluate('2 inch to cm')) // 5.08 cm
print(math.evaluate('cos(45 deg)')) // 0.70710678118655
print(math.evaluate('90 km/h to m/s')) // 25 m / s
console.log()

// convert a unit to a number
// A second parameter with the unit for the exported number must be provided
print(math.evaluate('number(5 cm, mm)')) // number, 50
console.log()

// simplify units
console.log('simplify units')
print(math.evaluate('100000 N / m^2')) // 100 kPa
print(math.evaluate('9.81 m/s^2 * 100 kg * 40 m')) // 39.24 kJ
console.log()

// example engineering calculations
console.log('compute molar volume of ideal gas at 65 Fahrenheit, 14.7 psi in L/mol')
const Rg = math.unit('8.314 N m / (mol K)')
const T = math.unit('65 degF')
const P = math.unit('14.7 psi')
const v = math.divide(math.multiply(Rg, T), P)
console.log('gas constant (Rg) = ', format(Rg))
console.log('P = ' + format(P))
console.log('T = ' + format(T))
console.log('v = Rg * T / P = ' + format(math.to(v, 'L/mol')))
// 23.910432393453 L / mol
console.log()

console.log('compute speed of fluid flowing out of hole in a container')
const g = math.unit('9.81 m / s^2')
const h = math.unit('1 m')
const v2 = math.pow(math.multiply(2, math.multiply(g, h)), 0.5) // Can also use math.sqrt
console.log('g = ' + format(g))
console.log('h = ' + format(h))
console.log('v = (2 g h) ^ 0.5 = ' + format(v2))
// 4.42944691807 m / s
console.log()

console.log('electrical power consumption:')
const expr1 = '460 V * 20 A * 30 days to kWh'
console.log(expr1 + ' = ' + math.evaluate(expr1)) // 6624 kWh
console.log()

console.log('circuit design:')
const expr2 = '24 V / (6 mA)'
console.log(expr2 + ' = ' + math.evaluate(expr2)) // 4 kohm
console.log()

console.log('operations on arrays:')
const B = math.evaluate('[1, 0, 0] T')
const v3 = math.evaluate('[0, 1, 0] m/s')
const q = math.evaluate('1 C')
const F = math.multiply(q, math.cross(v3, B))
console.log('B (magnetic field strength) = ' + format(B)) // [1 T, 0 T, 0 T]
console.log('v (particle velocity) = ' + format(v3)) // [0 m / s, 1 m / s, 0 m / s]
console.log('q (particle charge) = ' + format(q)) // 1 C
console.log('F (force) = q (v cross B) = ' + format(F)) // [0 N, 0 N, -1 N]

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  console.log(format(value))
}

/**
 * Helper function to format an output a value.
 * @param {*} value
 * @return {string} Returns the formatted value
 */
function format (value) {
  const precision = 14
  return math.format(value, precision)
}
