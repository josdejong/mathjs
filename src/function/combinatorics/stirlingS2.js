import { factory } from '../../utils/factory.js'

const name = 'stirlingS2'
const dependencies = [
  'typed',
  'addScalar',
  'subtractScalar',
  'multiplyScalar',
  'divideScalar',
  'pow',
  'factorial',
  'combinations',
  'isNegative',
  'isInteger',
  'number',
  '?bignumber',
  '?bigint',
  'larger',
  'typeOf'
]

export const createStirlingS2 = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    addScalar,
    subtractScalar,
    multiplyScalar,
    divideScalar,
    pow,
    factorial,
    combinations,
    isNegative,
    isInteger,
    number,
    bignumber,
    bigint,
    larger,
    typeOf
  }
) => {
  const caches = { number: [], bignumber: [], bigint: [] }
  /**
   * The Stirling numbers of the second kind, counts the number of ways to
   * partition a set of n labelled objects into k nonempty unlabelled subsets.
   * stirlingS2 only takes integer arguments.
   * The following condition must be enforced: k <= n.
   *
   *  If n = k or k = 1 <= n, then s(n,k) = 1
   *  If k = 0 < n, then s(n,k) = 0
   *
   * Note that if either n or k is supplied as a bigint, the result will be as
   * well. If not, and if either is a BigNumber, the result will be a BigNumber.
   * Otherwise, the result will be a plain JavaScript number.
   *
   * Syntax:
   *
   *   math.stirlingS2(n, k)
   *
   * Examples:
   *
   *    math.stirlingS2(5, 3) // returns 25
   *    math.stirlingS2(math.bignumber(8), 3) // returns BigNumber 966
   *    math.stirlingS2(18n, 3) // returns 64439010n
   *
   * See also:
   *
   *    bellNumbers
   *
   * History:
   *
   *    v15.3  added bigint support
   *    v1.7   created
   *
   * @param {Number | BigNumber | bigint} n    Total number of objects in the set
   * @param {Number | BigNumber | bigint} k    Number of subsets
   * @return {Number | BigNumber}     S2(n,k)
   */
  return typed(name, {
    'number | BigNumber | bigint, number | BigNumber | bigint': function (n, k) {
      if (!isInteger(n) || isNegative(n) || !isInteger(k) || isNegative(k)) {
        throw new TypeError(
          'Non-negative integer value expected in function stirlingS2')
      } else if (larger(k, n)) {
        throw new TypeError(
          'k must be less than or equal to n in function stirlingS2')
      }

      let cache = caches.number
      let make = number
      if (typeOf(n) === 'bigint' || typeOf(k) === 'bigint') {
        cache = caches.bigint
        make = bigint
      } else if (typeOf(n) === 'BigNumber' || typeOf(k) === 'BigNumber') {
        cache = caches.bignumber
        make = bignumber
      }
      // Since it is impractical to compute stirling numbers for indices
      // outside the range of plain number, safe now to convert:
      n = number(n)
      k = number(k)

      /* See if we already have the value: */
      if (cache[n] && cache[n].length > k) {
        return cache[n][k]
      }
      /* Fill the cache */
      if (n >= cache.length || k >= cache[n].length) {
        for (let m = 0; m <= n; ++m) {
          if (!cache[m]) {
            cache[m] = [m === 0 ? make(1) : make(0)]
          }
          if (m === 0) continue
          const row = cache[m]
          const prev = cache[m - 1]
          for (let i = row.length; i <= m && i <= k; ++i) {
            if (i === m) {
              row[i] = make(1)
            } else {
              row[i] = addScalar(multiplyScalar(make(i), prev[i]), prev[i - 1])
            }
          }
        }
      }
      return cache[n][k]
    }
  })
})
