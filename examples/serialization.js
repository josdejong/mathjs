// load math.js (using node.js)
const { complex, replacer, reviver, typeOf } = require('..')

// serialize a math.js data type into a JSON string
// the replacer function is needed to correctly stringify a value like Infinity
const x = complex('2+3i')
const str1 = JSON.stringify(x, replacer)
console.log(str1)
// outputs {"mathjs":"Complex","re":2,"im":3}

// deserialize a JSON string into a math.js data type
// note that the reviver of math.js is needed for this:
const str2 = '{"mathjs":"Unit","value":5,"unit":"cm"}'
const y = JSON.parse(str2, reviver)
console.log(typeOf(y)) // 'Unit'
console.log(y.toString()) // 5 cm
