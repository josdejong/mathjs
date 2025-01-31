import { factory } from '../utils/factory.js'
import { deepMap } from '../utils/collection.js'

const name = 'bigint'
const dependencies = ['typed', 'isInteger', 'typeOf', 'round', 'floor', 'ceil', 'fix', '?bignumber']

export const createBigint = /* #__PURE__ */ factory(name, dependencies, ({ typed, isInteger, typeOf, round, floor, ceil, fix, bignumber }) => {
  /**
   * Create a bigint or convert a string, boolean, or numeric type to a bigint.
   * When value is a matrix, all elements will be converted to bigint.
   *
   * Syntax:
   *
   *    math.bigint()
   *    math.bigint(value)
   *    math.bigint(value, options)
   *
   * Where:
   *
   *    - `value: *`
   *      The value to be converted to bigint. If omitted, defaults to 0.
   *    - `options: Object`
   *      A plain object with conversion options, including:
   *      - `safe: boolean`
   *        If true and _value_ is outside the range in which its type can
   *        uniquely represent each integer, the conversion throws an error.
   *        (Note that converting NaN or Infinity throws a RangeError in any
   *        case.) Defaults to false.
   *      - `round: string`
   *        How to handle non-integer _value_. Choose from:
   *        - `'throw'` -- if _value_ does not nominally represent an integer,
   *          throw a RangeError
   *        - `'round'` -- convert to the nearest bigint, rounding halves per
   *          the default behavior of `math.round`. This is the default value
   *          for `round`.
   *        - `'floor'` -- convert to the largest bigint less than _value_
   *        - `'ceil'` -- convert to the smallest bigint greater than _value_
   *        - `'fix'` -- convert to the nearest bigint closer to zero
   *          than _value_
   *
   * Examples:
   *
   *    math.bigint(2)                           // returns 2n
   *    math.bigint('123')                       // returns 123n
   *    math.bigint(true)                        // returns 1n
   *    math.bigint([true, false, true, true])   // returns [1n, 0n, 1n, 1n]
   *    math.bigint(3**50)                       // returns 717897987691852578422784n
   *        // note inexactness above from number precision; actual 3n**50n is
   *        // 717897987691852588770249n
   *    math.bigint(3**50, {safe: true})         // throws RangeError
   *    math.bigint(math.pow(math.bignumber(11), 64)) // returns 4457915684525902395869512133369841539490161434991526715513934826000n
   *        // similarly inaccurate; last three digits should be 241
   *    math.bigint(
   *      math.pow(math.bignumber(11), 64),
   *      {safe: true})                         // throws RangeError
   *    math.bigint(math.fraction(13, 2))       // returns 7n
   *    math.bigint(6.5, {round: 'throw'})      // throws RangeError
   *    math.bigint(6.5, {round: 'floor'})      // returns 6n
   *    math.bigint(-6.5, {round: 'ceil'})      // returns -6n
   *    math.bigint(6.5, {round: 'fix'})        // returns 6n
   *
   * See also:
   *
   *    number, bignumber, boolean, complex, index, matrix, string, unit
   *    round, floor, ceil, fix
   *
   * History:
   *
   *    v13      Created
   *    v14.2.1  Added conversion options
   *
   * @param {string | number | BigNumber | bigint | Fraction | boolean | Array | Matrix | null} [value]  Value to be converted
   * @param {Object} [options]  Conversion options with keys `safe` and/or `round`
   * @return {bigint | Array | Matrix} The created bigint
   */
  const bigint = typed('bigint', {
    '': function () {
      return 0n
    },

    null: function (x) {
      return 0n
    },
    'null, Object': function (x) {
      return 0n
    },

    bigint: function (x) {
      return x
    },
    'bigint, Object': function (x) {
      // Options irrelevant because always safe and no rounding needed
      return x
    },

    boolean: function (x) {
      return BigInt(x)
    },
    'boolean, Object': function (x) {
      return BigInt(x)
    },

    string: stringToBigint,
    'string, Object': stringToBigint,

    'number | BigNumber | Fraction': numericToBigint,
    'number | BigNumber | Fraction, Object': numericToBigint,

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })

  // reviver function to parse a JSON object like:
  //
  //     {"mathjs":"bigint","value":"123"}
  //
  // into a bigint 123n
  bigint.fromJSON = function (json) {
    return BigInt(json.value)
  }

  const rounders = { round, floor, ceil, fix }

  function numericToBigint (value, options = {}) {
    // fill in defaults
    options = Object.assign({ safe: false, round: 'round' }, options)
    const valType = typeOf(value)
    if (options.safe) {
      let upper = Number.MAX_SAFE_INTEGER
      let lower = Number.MIN_SAFE_INTEGER
      let unsafe = valType === 'number' && (value < lower || value > upper)
      if (bignumber && valType === 'BigNumber') {
        const digits = value.precision()
        upper = bignumber(`1e${digits}`)
        lower = bignumber(`-1e${digits}`)
        if (value.lessThan(lower) || value.greaterThan(upper)) unsafe = true
      }
      if (unsafe) {
        throw new RangeError(
          `${valType} ${value} outside of safe range [${lower}, ${upper}] ` +
          'for conversion to bigint.')
      }
    }
    if (!isInteger(value)) {
      if (options.round === 'throw') {
        throw new RangeError(`${value} is not an integer.`)
      }
      value = rounders[options.round](value)
    }
    // Now we have an integer that we are comfortable converting to bigint
    if (valType === 'number') return BigInt(value)
    if (valType === 'Fraction') return value.n * value.s
    // Currently only BigNumbers left
    return BigInt(value.toFixed())
  }

  function stringToBigint (value, options = {}) {
    // safe option is irrelevant for string:
    const round = options.round ?? 'round'
    value = value.trim()
    // Built in constructor works for integers in other bases:
    if (/^0[box]/.test(value)) return BigInt(value)

    // Otherwise, have to parse ourselves, because BigInt() doesn't allow
    // rounding; it throws on all decimals.
    const match = value.match(/^([+-])?(\d*)([.,]\d*)?([eE][+-]?\d+)?$/)
    if (!match) {
      throw new SyntaxError('invalid BigInt syntax')
    }
    const sgn = match[1] === '-' ? -1n : 1n
    let intPart = match[2]
    let fracPart = match[3] ? match[3].substr(1) : ''
    let expn = match[4] ? parseInt(match[4].substr(1)) : 0
    if (expn >= fracPart.length) {
      intPart += fracPart
      expn -= fracPart.length
      intPart += '0'.repeat(expn)
    } else if (expn > 0) {
      intPart += fracPart.substr(0, expn)
      fracPart = fracPart.substr(expn)
    } else if (-expn > intPart.length) {
      fracPart = intPart + fracPart
      expn += intPart.length
      fracPart = '0'.repeat(-expn) + fracPart
    } else { // negative exponent smaller in magnitude than length of intPart
      fracPart = intPart.substr(expn) + fracPart
      intPart = intPart.substr(0, intPart.length + expn)
    }
    // Now expn is irrelevant, number is intPart.fracPart
    if (/^0*$/.test(fracPart)) fracPart = ''
    if (round === 'throw' && fracPart) {
      throw new RangeError(`${value} is not an integer`)
    }
    const intVal = sgn * BigInt(intPart)
    if (round === 'fix' || !fracPart) return intVal
    const flr = sgn > 0 ? intVal : intVal - 1n
    if (round === 'floor') return flr
    if (round === 'ceil') return flr + 1n
    // OK, round is 'round'. We proceed by the first digit of fracPart.
    // 0-4 mean 'fix'; 5-9 'fix' + sgn. This is the half-round rule "away".
    if (/[0-4]/.test(fracPart[0])) return intVal
    return intVal + sgn
  }

  return bigint
})
