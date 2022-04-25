const { e, floor, format, log, sqrt } = require('../../lib/cjs/number.js')

console.log(format(sqrt(4)))
console.log(format(sqrt(-4)))
console.log(format(log(e * e)))
console.log(format(log(625, 5)))
console.log(format(floor(7 - 1e-13)))
