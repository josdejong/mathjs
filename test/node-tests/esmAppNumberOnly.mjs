// TODO: would be nice to call '../../' so we know for sure ESM is correctly exported
import { e, floor, format, log, sqrt } from '../../lib/esm/number.js'

console.log(format(sqrt(4)))
console.log(format(sqrt(-4)))
console.log(format(log(e * e)))
console.log(format(log(625, 5)))
console.log(format(floor(7 - 1e-13)))
