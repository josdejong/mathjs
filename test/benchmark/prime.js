const assert = require('assert')
const { isPrime } = require('../../')
const { Suite } = require('benchmark')

const primes = [2147483647, 87178291199, 4398042316799]
const notPrimes = [2199023255551, 8796093022207, 140737488355327]
const carmichaels = [41041, 825265, 321197185] // more challenging numbers

function isPrimeTest (x) {
  if (x * 0 !== 0) {
    return false
  }
  if (x <= 3) {
    return x > 1
  }
  if (x % 2 === 0 || x % 3 === 0) {
    return false
  }
  const sqrt = Math.sqrt(x);

  for (let i = 5; i <= sqrt; i += 6) {
    if (x % i === 0 || x % (i + 2) === 0) {
      return false
    }
  }

  return true
}

// validate that the function does what we think it does
const primesResults = primes.map(num => isPrime(num))
const notPrimesResults = notPrimes.map(num => isPrime(num))
const carmichaelsResults = carmichaels.map(num => isPrime(num))

const primesResultsTest = primes.map(num => isPrimeTest(num))
const notPrimesResultsTest = notPrimes.map(num => isPrimeTest(num))
const carmichaelsResultsTest = carmichaels.map(num => isPrimeTest(num))

assert(primesResults.every(result => result === true))
assert(notPrimesResults.every(result => result === false))
assert(carmichaelsResults.every(result => result === false))

assert(primesResultsTest.every(result => result === true))
assert(notPrimesResultsTest.every(result => result === false))
assert(carmichaelsResultsTest.every(result => result === false))

new Suite()
  .add('primes', () => {
    primes.forEach(num => isPrime(num))
  })
  .add('not primes', () => {
    notPrimes.forEach(num => isPrime(num))
  })
  .add('carmichaels', () => {
    carmichaels.forEach(num => isPrime(num))
  })
  .add('primes', () => {
    primes.forEach(num => isPrimeTest(num))
  })
  .add('not primes', () => {
    notPrimes.forEach(num => isPrimeTest(num))
  })
  .add('carmichaels', () => {
    carmichaels.forEach(num => isPrimeTest(num))
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
