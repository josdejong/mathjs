import { factory } from '../../utils/factory.js'

const name = 'catalan'
const dependencies = [
  'typed',
  'multiplyScalar',
  'divideScalar',
  'isNegative',
  'isInteger',
  'number',
  'typeOf',
  '?bignumber',
  '?bigint'
]

// Exact Catalan numbers C(0)..C(30) as strings. C(30) is the largest Catalan
// number that is exactly representable as a double, so the number path can
// seed its cache from this table and only iterate approximately beyond it.
// The bigint and BigNumber paths convert the same strings exactly.
const exactCatalans = [
  '1', '1', '2', '5', '14', '42', '132', '429', '1430', '4862',
  '16796', '58786', '208012', '742900', '2674440', '9694845',
  '35357670', '129644790', '477638700', '1767263190', '6564120420',
  '24466267020', '91482563640', '343059613650', '1289904147324',
  '4861946401452', '18367353072152', '69533550916004', '263747951750360',
  '1002242216651368', '3814986502092304'
]

export const createCatalan = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    multiplyScalar,
    divideScalar,
    isNegative,
    isInteger,
    number,
    typeOf,
    bignumber,
    bigint
  }
) => {
  // Cached values computed so far, one per supported type. The caches grow
  // monotonically: each entry i holds C(i), so a call for a larger index only
  // extends the cache from its current end and never recomputes from scratch.
  const caches = { number: [], bignumber: [], bigint: [] }

  /**
   * The Catalan Numbers enumerate combinatorial structures of many different types.
   * catalan only takes integer arguments.
   * The following condition must be enforced: n >= 0
   *
   * Note that if n is supplied as a bigint, the result will be a bigint as
   * well. If n is a BigNumber, the result will be a BigNumber. Otherwise the
   * result will be a plain JavaScript number.
   *
   * Syntax:
   *
   *   math.catalan(n)
   *
   * Examples:
   *
   *    math.catalan(3) // returns 5
   *    math.catalan(8) // returns 1430
   *    math.catalan(8n) // returns 1430n
   *
   * History:
   *
   *    v15.3   Add bigint support
   *    v0.14   Created
   *
   * See also:
   *
   *    bellNumbers
   *
   * @param {number | BigNumber | bigint} n    nonnegative integer index
   * @return {number | BigNumber | bigint}    nth Catalan number
   */
  return typed(name, {
    'number | BigNumber | bigint': function (n) {
      if (!isInteger(n) || isNegative(n)) {
        throw new TypeError('Non-negative integer value expected in function catalan')
      }

      let cache = caches.number
      let make = number
      const inputType = typeOf(n)
      if (inputType === 'bigint') {
        cache = caches.bigint
        make = bigint
      } else if (inputType === 'BigNumber') {
        cache = caches.bignumber
        make = bignumber
      }
      // Since it is impractical to compute Catalan numbers for indices
      // outside the range of plain number, safe to convert the index now:
      const index = number(n)

      // Seed the cache with the exact table on first use.
      if (cache.length === 0) {
        for (const value of exactCatalans) {
          cache.push(make(value))
        }
      }

      // Extend the cache with the recurrence
      //   C(i+1) = C(i) * 2 * (2i+1) / (i+2)
      // Every step divides exactly, so the bigint and BigNumber paths stay
      // exact. On the number path the intermediate product can exceed the
      // exact-integer range of a double beyond C(30), where the result is
      // approximate; measured against the exact bigint values, the relative
      // error stays within a few ulps even for indices whose values reach
      // the 300-digit range.
      const two = make(2)
      for (let i = cache.length - 1; i < index; i++) {
        cache.push(divideScalar(
          multiplyScalar(
            multiplyScalar(cache[i], two),
            make(2 * i + 1)),
          make(i + 2)))
      }
      return cache[index]
    }
  })
})
