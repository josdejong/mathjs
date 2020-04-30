const Benchmark = require('benchmark')
const BigNumber = require('decimal.js')
const padRight = require('pad-right')

BigNumber.set({ precision: 500, toExpPos: 3000 })

function pad (text) {
  return padRight(text, 40, ' ')
}

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

function xFactorial(n) {
  if (n < 7n) {
    return {
      comma: 0,
      number: [1n, 1n, 2n, 6n, 24n, 120n, 720n][+`${n}`],
      sign: false
    };
  }

  let nostart = false;
  const h = n / 2n;
  let s = h + 1n;
  let k = s + h;
  let f = (n & 1n) === 1n ? k : 1n;

  if ((h & 1n) === 1n) f = -f;
  k += 4n;

  function HyperFact(l) {
    if (l > 1n) {
      const m = l >> 1n;
      return HyperFact(m) * HyperFact(l - m);
    }

    if (nostart) {
      s -= k -= 4n;
      return s;
    }
    nostart = true;

    return f;
  }

  return HyperFact(h + 1n) << h;
};

console.log(xFactorial(300n));

const suite = new Benchmark.Suite()
suite
  .add(pad('bigFactorial for small numbers'), function () {
    const res = bigFactorial(new BigNumber(8))
    results.push(res)
  })
  .add(pad('new bigFactorial for small numbers'), function () {
    const res = betterFactorial(new BigNumber(8))
    results.push(res)
  })
  .add(pad('xFactorial for small numbers'), function () {
    const res = xFactorial(8n)
    results.push(res)
  })

  .add(pad('bigFactorial for small numbers 2'), function () {
    const res = bigFactorial(new BigNumber(20))
    results.push(res)
  })
  .add(pad('new bigFactorial for small numbers 2'), function () {
    const res = betterFactorial(new BigNumber(20))
    results.push(res)
  })
  .add(pad('xFactorial for small numbers 2'), function () {
    const res = xFactorial(20n)
    results.push(res)
  })

  .add(pad('bigFactorial for big numbers'), function () {
    const res = bigFactorial(new BigNumber(600))
    results.push(res)
  })
  .add(pad('new bigFactorial for big numbers'), function () {
    const res = betterFactorial(new BigNumber(600))
    results.push(res)
  })
  .add(pad('xFactorial for big numbers'), function () {
    const res = xFactorial(600n)
    results.push(res)
  })

  .add(pad('bigFactorial for HUGE numbers'), function () {
    const res = bigFactorial(new BigNumber(1500))
    results.push(res)
  })
  .add(pad('new bigFactorial for HUGE numbers'), function () {
    const res = betterFactorial(new BigNumber(1500))
    results.push(res)
  })
  .add(pad('xFactorial for HUGE numbers'), function () {
    const res = xFactorial(1500n)
    results.push(res)
  })

  .add(pad('bigFactorial for "HUGER" numbers'), function () {
    const res = bigFactorial(new BigNumber(10000))
    results.push(res)
  })
  .add(pad('new bigFactorial for "HUGER" numbers'), function () {
    const res = betterFactorial(new BigNumber(10000))
    results.push(res)
  })
  .add(pad('xFactorial for "HUGER" numbers'), function () {
    const res = xFactorial(10000n)
    results.push(res)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
