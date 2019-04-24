// Load the functions that we want to use
import {
  create,
  fractionDependencies,
  addDependencies,
  divideDependencies,
  formatDependencies
} from '../..'

// Create a math.js instance with just the functions we want
const { fraction, add, divide, format } = create({
  fractionDependencies,
  addDependencies,
  divideDependencies,
  formatDependencies
})

// Use the created functions
const a = fraction(1, 3)
const b = fraction(3, 7)
const c = add(a, b)
const d = divide(a, b)
console.log('c =', format(c)) // outputs "c = 16/21"
console.log('d =', format(d)) // outputs "d = 7/9"

// Now, when bundling your application for use in the browser, only the used
// parts of math.js will be bundled. For example to create a bundle using Webpack:
//
//     npx webpack custom_loading.js -o custom_loading.bundle.js --mode=production
//
