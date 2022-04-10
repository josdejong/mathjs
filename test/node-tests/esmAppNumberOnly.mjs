// TODO: would be nice to call '../../' so we know for sure ESM is correctly exported
import { e, sqrt, format, log } from '../../lib/esm/number.js'

console.log(format(sqrt(4)))
console.log(format(sqrt(-4)))
console.log(format(log(e * e)))
console.log(format(log(625, 5)))
