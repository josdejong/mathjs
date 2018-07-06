const math = require('../../../index')

// import the new type MyType and the function `add` in math.js
math.import(require('./MyType'))
math.import(require('./myAdd'))

// create a shortcut to the new type.
const MyType = math.type.MyType

// use the new type
const ans = math.add(new MyType(2), new MyType(3)) // returns MyType(5)
console.log(ans.toString()) // outputs 'MyType:5'
