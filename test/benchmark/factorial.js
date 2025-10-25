import BigNumber from 'decimal.js'
import { Bench } from 'tinybench'
import { prod, Range } from '../../lib/esm/index.js'
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

function splitFactorial (m, n) {
  if (n - m < 9) {
    let product = new BigNumber(m)
    while (++m <= n) product = product.mul(new BigNumber(m))
    return product
  }
  const split = Math.floor((m + n) / 2)
  return splitFactorial(m, split).mul(splitFactorial(split + 1, n))
}

function prodFactorial (n) {
  return prod(new Range({ from: new BigNumber(1), for: n }))
}

const bench = new Bench({ time: 100, iterations: 100 })
  .add('bigFactorial for 8', function () {
    const res = bigFactorial(new BigNumber(8))
    results.push(res)
  })
  .add('new bigFactorial for 8', function () {
    const res = betterFactorial(new BigNumber(8))
    results.push(res)
  })
  .add('split factorial for 8', function () {
    const res = splitFactorial(1, 8)
    results.push(res)
  })
  .add('prod range for 8', function () {
    const res = prodFactorial(8)
    results.push(res)
  })

  .add('bigFactorial for 20', function () {
    const res = bigFactorial(new BigNumber(20))
    results.push(res)
  })
  .add('new bigFactorial for 20', function () {
    const res = betterFactorial(new BigNumber(20))
    results.push(res)
  })
  .add('split factorial for 20', function () {
    const res = splitFactorial(1, 20)
    results.push(res)
  })
  .add('prod range for 20', function () {
    const res = prodFactorial(20)
    results.push(res)
  })

  .add('bigFactorial for 600', function () {
    const res = bigFactorial(new BigNumber(600))
    results.push(res)
  })
  .add('new bigFactorial for 600', function () {
    const res = betterFactorial(new BigNumber(600))
    results.push(res)
  })
  .add('split factorial for 600', function () {
    const res = splitFactorial(1, 600)
    results.push(res)
  })
  .add('prod range for 600', function () {
    const res = prodFactorial(600)
    results.push(res)
  })

  .add('bigFactorial for 1.5K', function () {
    const res = bigFactorial(new BigNumber(1500))
    results.push(res)
  })
  .add('new bigFactorial for 1.5K', function () {
    const res = betterFactorial(new BigNumber(1500))
    results.push(res)
  })
  .add('split factorial for 1.5K', function () {
    const res = splitFactorial(1, 1500)
    results.push(res)
  })
  .add('prod range for 1.5K', function () {
    const res = prodFactorial(1500)
    results.push(res)
  })

  .add('bigFactorial for 10K', function () {
    const res = bigFactorial(new BigNumber(10000))
    results.push(res)
  })
  .add('new bigFactorial for 10K', function () {
    const res = betterFactorial(new BigNumber(10000))
    results.push(res)
  })
  .add('split factorial for 10K', function () {
    const res = splitFactorial(1, 10000)
    results.push(res)
  })
  .add('prod range for 10K', function () {
    const res = prodFactorial(10000)
    results.push(res)
  })

  .add('bigFactorial for 30K', function () {
    const res = bigFactorial(new BigNumber(30000))
    results.push(res)
  })
  .add('new bigFactorial for 30K', function () {
    const res = betterFactorial(new BigNumber(30000))
    results.push(res)
  })
  .add('split factorial for 30K', function () {
    const res = splitFactorial(1, 30000)
    results.push(res)
  })
  .add('prod range for 30K', function () {
    const res = prodFactorial(30000)
    results.push(res)
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
