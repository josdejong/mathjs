const math = require('../../../index')

// import the new type MyType and the function `add` in math.js
math.import(require('./MyType'))
math.import(require('./myAdd'))

// create a shortcut to the new type.
const MyType = math.type.MyType

// use the new type
const ans1 = math.add(new MyType(2), new MyType(3)) // returns MyType(5)
console.log(ans1.toString()) // outputs 'MyType:5'

// numbers will be converted to MyType
const ans2 = math.add(new MyType(4), 7) // returns MyType(11)
console.log(ans2.toString()) // outputs 'MyType:11'
