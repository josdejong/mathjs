// complex numbers

// load math.js (using node.js)
const math = require('../index')

// create a complex number with a numeric real and complex part
console.log('create and manipulate complex numbers')
const a = math.complex(2, 3)
print(a) // 2 + 3i

// read the real and complex parts of the complex number
print(a.re) // 2
print(a.im) // 3

// clone a complex value
const clone = a.clone()
print(clone) // 2 + 3i

// adjust the complex value
a.re = 5
print(a) // 5 + 3i

// create a complex number by providing a string with real and complex parts
const b = math.complex('3-7i')
print(b) // 3 - 7i
console.log()

// perform operations with complex numbers
console.log('perform operations')
print(math.add(a, b)) // 8 - 4i
print(math.multiply(a, b)) // 36 - 26i
print(math.sin(a)) // -9.6541254768548 + 2.8416922956064i

// some operations will return a complex number depending on the arguments
print(math.sqrt(4)) // 2
print(math.sqrt(-4)) // 2i
console.log()

// create a complex number from polar coordinates
console.log('create complex numbers with polar coordinates')
const c = math.complex({ r: math.sqrt(2), phi: math.pi / 4 })
print(c) // 1 + i

// get polar coordinates of a complex number
const d = math.complex(3, 4)
console.log(d.abs(), d.arg()) // radius = 5, phi = 0.9272952180016122
console.log()

// comparision operations
// note that there is no mathematical ordering defined for complex numbers
// we can only check equality. To sort a list with complex numbers,
// the natural sorting can be used
console.log('\ncomparision and sorting operations')
console.log('equal', math.equal(a, b)) // returns false
const values = [a, b, c]
console.log('values:', math.format(values, 14)) // [5 + 3i, 3 - 7i, 1 + i]
math.sort(values, 'natural')
console.log('sorted:', math.format(values, 14)) // [1 + i, 3 - 7i, 5 + 3i]

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  const precision = 14
  console.log(math.format(value, precision))
}
