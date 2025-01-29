import assert from 'node:assert'
import { Bench } from 'tinybench'
import { isPrime } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const primes = [2147483647, 87178291199, 4398042316799]
const notPrimes = [2199023255551, 8796093022207, 140737488355327]
const carmichaels = [41041, 825265, 321197185] // more challenging numbers

// validate that the function does what we think it does
const primesResults = primes.map(num => isPrime(num))
const notPrimesResults = notPrimes.map(num => isPrime(num))
const carmichaelsResults = carmichaels.map(num => isPrime(num))
assert(primesResults.every(result => result === true))
assert(notPrimesResults.every(result => result === false))
assert(carmichaelsResults.every(result => result === false))

const bench = new Bench({ time: 100, iterations: 100 })
  .add('primes', () => {
    primes.forEach(num => isPrime(num))
  })
  .add('not primes', () => {
    notPrimes.forEach(num => isPrime(num))
  })
  .add('carmichaels', () => {
    carmichaels.forEach(num => isPrime(num))
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
