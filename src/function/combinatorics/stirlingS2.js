'use strict'

function factory (type, config, load, typed) {
  const add = load(require('../arithmetic/add'))
  const subtract = load(require('../arithmetic/subtract'))
  const multiply = load(require('../arithmetic/multiply'))
  const divide = load(require('../arithmetic/divide'))
  const pow = load(require('../arithmetic/pow'))
  const factorial = load(require('../probability/factorial'))
  const combinations = load(require('../probability/combinations'))
  const isNegative = load(require('../utils/isNegative'))
  const isInteger = load(require('../utils/isInteger'))
  const larger = load(require('../relational/larger'))

  /**
   * The Stirling numbers of the second kind, counts the number of ways to partition
   * a set of n labelled objects into k nonempty unlabelled subsets.
   * stirlingS2 only takes integer arguments.
   * The following condition must be enforced: k <= n.
   *
   *  If n = k or k = 1, then s(n,k) = 1
   *
   * Syntax:
   *
   *   math.stirlingS2(n, k)
   *
   * Examples:
   *
   *    math.stirlingS2(5, 3) //returns 25
   *
   * See also:
   *
   *    bellNumbers
   *
   * @param {Number | BigNumber} n    Total number of objects in the set
   * @param {Number | BigNumber} k    Number of objects in the subset
   * @return {Number | BigNumber}     S(n,k)
   */
  const stirlingS2 = typed('stirlingS2', {
    'number | BigNumber, number | BigNumber': function (n, k) {
      if (!isInteger(n) || isNegative(n) || !isInteger(k) || isNegative(k)) {
        throw new TypeError('Non-negative integer value expected in function stirlingS2')
      } else if (larger(k, n)) {
        throw new TypeError('k must be less than or equal to n in function stirlingS2')
      }

      // 1/k! Sum(i=0 -> k) [(-1)^(k-i)*C(k,j)* i^n]
      const kFactorial = factorial(k)
      let result = 0
      for (let i = 0; i <= k; i++) {
        const negativeOne = pow(-1, subtract(k, i))
        const kChooseI = combinations(k, i)
        const iPower = pow(i, n)

        result = add(result, multiply(multiply(kChooseI, iPower), negativeOne))
      }

      return divide(result, kFactorial)
    }
  })

  stirlingS2.toTex = { 2: `\\mathrm{S}\\left(\${args}\\right)` }

  return stirlingS2
}

exports.name = 'stirlingS2'
exports.factory = factory
