import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'isPrime'
const dependencies = ['typed']

function modPowBigInt (base, exponent, modulus) {
  let result = 1n
  base %= modulus
  while (exponent > 0n) {
    if (exponent & 1n) result = (result * base) % modulus
    exponent >>= 1n
    base = (base * base) % modulus
  }
  return result
}

export const createIsPrime = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Test whether a value is prime: has no divisors other than itself and one.
   * The function supports type `number`, `bignumber`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isPrime(x)
   *
   * Examples:
   *
   *    math.isPrime(3)                     // returns true
   *    math.isPrime(-2)                    // returns false
   *    math.isPrime(0)                     // returns false
   *    math.isPrime(-0)                    // returns false
   *    math.isPrime(0.5)                   // returns false
   *    math.isPrime('2')                   // returns true
   *    math.isPrime([2, 17, 100])           // returns [true, true, false]
   *
   * See also:
   *
   *    isNumeric, isZero, isNegative, isInteger
   *
   * @param {number | BigNumber | bigint | Array | Matrix} x  Value to be tested
   * @return {boolean}  Returns true when `x` is larger than zero.
   *                    Throws an error in case of an unknown data type.
   */
  return typed(name, {
    number: function (x) {
      if (x <= 3) {
        return x > 1
      }
      if (x % 2 === 0 || x % 3 === 0) {
        return false
      }
      for (let i = 5; i * i <= x; i += 6) {
        if (x % i === 0 || x % (i + 2) === 0) {
          return false
        }
      }
      return true
    },

    bigint: function (x) {
      if (x <= 3n) {
        return x > 1n
      }
      if (x % 2n === 0n || x % 3n === 0n) {
        return false
      }
      if (x < 4294967296n) {
        for (let i = 5n; i * i <= x; i += 6n) {
          if (x % i === 0n || x % (i + 2n) === 0n) {
            return false
          }
        }
        return true
      }

      // Deterministic Miller-Rabin, same bases as the BigNumber implementation
      let d = x - 1n
      let r = 0
      while ((d & 1n) === 0n) {
        d >>= 1n
        r += 1
      }
      let bases
      if (x < 3317044064679887385961981n) {
        bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n]
      } else {
        const digits = x.toString().length
        const max = Math.floor(2 * Math.pow(digits * Math.log(10), 2))
        bases = []
        for (let i = 2; i <= max; i += 1) {
          bases.push(BigInt(i))
        }
      }
      for (const a of bases) {
        let y = modPowBigInt(a, d, x)
        if (y === 1n || y === x - 1n) continue
        let composite = true
        for (let i = 1; i < r; i += 1) {
          y = (y * y) % x
          if (y === x - 1n) {
            composite = false
            break
          }
        }
        if (composite) return false
      }
      return true
    },

    BigNumber: function (n) {
      if (n.lte(3)) return n.gt(1)
      if (n.mod(2).eq(0) || n.mod(3).eq(0)) return false
      if (n.lt(Math.pow(2, 32))) {
        const x = n.toNumber()
        for (let i = 5; i * i <= x; i += 6) {
          if (x % i === 0 || x % (i + 2) === 0) {
            return false
          }
        }
        return true
      }

      function modPow (base, exponent, modulus) {
        // exponent can be huge, use non-recursive variant
        let accumulator = 1
        while (!exponent.eq(0)) {
          if (exponent.mod(2).eq(0)) {
            exponent = exponent.div(2)
            base = base.mul(base).mod(modulus)
          } else {
            exponent = exponent.sub(1)
            accumulator = base.mul(accumulator).mod(modulus)
          }
        }
        return accumulator
      }

      // https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test#Deterministic_variants
      const Decimal = n.constructor.clone({ precision: n.toFixed(0).length * 2 })
      n = new Decimal(n)
      let r = 0
      let d = n.sub(1)
      while (d.mod(2).eq(0)) {
        d = d.div(2)
        r += 1
      }
      let bases = null
      // https://en.wikipedia.org/wiki/Miller–Rabin_primality_test#Testing_against_small_sets_of_bases
      if (n.lt('3317044064679887385961981')) {
        bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41].filter(x => x < n)
      } else {
        const max = Math.min(n.toNumber() - 2, Math.floor(2 * Math.pow(n.toFixed(0).length * Math.log(10), 2)))
        bases = []
        for (let i = 2; i <= max; i += 1) {
          bases.push(max)
        }
      }
      for (let i = 0; i < bases.length; i += 1) {
        const a = bases[i]
        const adn = modPow(n.sub(n).add(a), d, n)
        if (!adn.eq(1)) {
          for (let i = 0, x = adn; !x.eq(n.sub(1)); i += 1, x = x.mul(x).mod(n)) {
            if (i === r - 1) {
              return false
            }
          }
        }
      }
      return true
    },

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
