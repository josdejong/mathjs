// let's pollute the Object prototype...

/* eslint no-extend-native: ["error", { "exceptions": ["Object"] }] */
Object.prototype.foo = () => {}

// loading mathjs should not crash
const math = require('../../lib/cjs/entry/mainAny')

// outputs '2i'
console.log(math.format(math.sqrt(-4)))
