const { e, sqrt, format, log } = require('../../lib/cjs/number.js')

console.log(format(sqrt(4)))
console.log(format(sqrt(-4)))
console.log(format(log(e * e)))
console.log(format(log(625, 5)))
