// let's pollute the Object prototype...

/* eslint no-extend-native: ["error", { "exceptions": ["Object"] }] */
// loading mathjs should not crash
import { create, all } from '../../lib/esm/entry/mainAny.js'

Object.prototype.foo = () => {}
const math = create(all)

// outputs '2i'
console.log(math.format(math.sqrt(-4)))
