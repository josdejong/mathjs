const Benchmark = require('benchmark')
const BigNumber = require('decimal.js')
const padRight = require('pad-right')
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

function betterFactorial(n) {
  if(n % 2 === 1) {
    return n.times(betterFactorial(new BigNumber(n - 1)));
  }

  let p = n;
  let prod = n;
  let sum = n.toNumber();

  while(p > 2) {
    p -= 2;
    sum += p;
    prod = prod.times(sum);
  }

  return prod;
}

console.log('factorial 5 ' + bigFactorial(new BigNumber(6)))
console.log('new factorial 5 ' + betterFactorial(new BigNumber(6)))

const suite = new Benchmark.Suite()
suite
  .add(pad('bigFactorial for small numbers'), function () {
    const res = bigFactorial(new BigNumber(8))
    results.push(res)
  })
  .add(pad('new bigFactorial'), function () {
    const res = betterFactorial(new BigNumber(8));
    results.push(res)
  })
  .add(pad('bigFactorial for big numbers'), function () {
    const res = bigFactorial(new BigNumber(600))
    results.push(res)
  })
  .add(pad('new bigFactorial for big numbers'), function () {
    const res = betterFactorial(new BigNumber(600));
    results.push(res)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
