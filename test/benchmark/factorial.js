import BigNumber from 'decimal.js'
import { Bench } from 'tinybench'
import { formatTaskResult } from './utils/formatTaskResult.js'

const results = []

function bigFactorial (n) {
  if (n.isZero()) {
    return new BigNumber(1) // 0! is per definition 1
  }

  let res = new BigNumber(n)
  let value = n.toNumber() - 1 // number
  while (value > 1) {
    res = res.times(value)
    value--
  }

  return new BigNumber(res)
}

function betterFactorial (n) {
  if (n < 8) {
    return new BigNumber([1, 1, 2, 6, 24, 120, 720, 5040][n])
  }

  if (n % 2 === 1) {
    return n.times(betterFactorial(new BigNumber(n - 1)))
  }

  let p = n
  let prod = n
  let sum = n.toNumber()

  while (p > 2) {
    p -= 2
    sum += p
    prod = prod.times(sum)
  }

  return prod
}

const bench = new Bench({ time: 100, iterations: 100 })
  .add('bigFactorial for small numbers', function () {
    const res = bigFactorial(new BigNumber(8))
    results.push(res)
  })
  .add('new bigFactorial for small numbers', function () {
    const res = betterFactorial(new BigNumber(8))
    results.push(res)
  })

  .add('bigFactorial for small numbers 2', function () {
    const res = bigFactorial(new BigNumber(20))
    results.push(res)
  })
  .add('new bigFactorial for small numbers 2', function () {
    const res = betterFactorial(new BigNumber(20))
    results.push(res)
  })

  .add('bigFactorial for big numbers', function () {
    const res = bigFactorial(new BigNumber(600))
    results.push(res)
  })
  .add('new bigFactorial for big numbers', function () {
    const res = betterFactorial(new BigNumber(600))
    results.push(res)
  })

  .add('bigFactorial for HUGE numbers', function () {
    const res = bigFactorial(new BigNumber(1500))
    results.push(res)
  })
  .add('new bigFactorial for HUGE numbers', function () {
    const res = betterFactorial(new BigNumber(1500))
    results.push(res)
  })

  .add('bigFactorial for "HUGER" numbers', function () {
    const res = bigFactorial(new BigNumber(10000))
    results.push(res)
  })
  .add('new bigFactorial for "HUGER" numbers', function () {
    const res = betterFactorial(new BigNumber(10000))
    results.push(res)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
