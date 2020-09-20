// TODO: would be nice to call '../../' so we know for sure ESM is correctly exported
import { sqrt, format } from '../../lib/esm/number.js'

console.log(format(sqrt(4)))
console.log(format(sqrt(-4)))
