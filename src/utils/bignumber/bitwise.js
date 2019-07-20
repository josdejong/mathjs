/**
 * Bitwise and for Bignumbers
 *
 * Special Cases:
 *   N &  n =  N
 *   n &  0 =  0
 *   n & -1 =  n
 *   n &  n =  n
 *   I &  I =  I
 *  -I & -I = -I
 *   I & -I =  0
 *   I &  n =  n
 *   I & -n =  I
 *  -I &  n =  0
 *  -I & -n = -I
 *
 * @param {BigNumber} x
 * @param {BigNumber} y
 * @return {BigNumber} Result of `x` & `y`, is fully precise
 * @private
 */
export function bitAndBigNumber (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Integers expected in function bitAnd')
  }

  const BigNumber = x.constructor
  if (x.isNaN() || y.isNaN()) {
    return new BigNumber(NaN)
  }

  if (x.isZero() || y.eq(-1) || x.eq(y)) {
    return x
  }
  if (y.isZero() || x.eq(-1)) {
    return y
  }

  if (!x.isFinite() || !y.isFinite()) {
    if (!x.isFinite() && !y.isFinite()) {
      if (x.isNegative() === y.isNegative()) {
        return x
      }
      return new BigNumber(0)
    }
    if (!x.isFinite()) {
      if (y.isNegative()) {
        return x
      }
      if (x.isNegative()) {
        return new BigNumber(0)
      }
      return y
    }
    if (!y.isFinite()) {
      if (x.isNegative()) {
        return y
      }
      if (y.isNegative()) {
        return new BigNumber(0)
      }
      return x
    }
  }
  return bitwise(x, y, function (a, b) { return a & b })
}

/**
 * Bitwise not
 * @param {BigNumber} x
 * @return {BigNumber} Result of ~`x`, fully precise
 *
 */
export function bitNotBigNumber (x) {
  if (x.isFinite() && !x.isInteger()) {
    throw new Error('Integer expected in function bitNot')
  }

  const BigNumber = x.constructor
  const prevPrec = BigNumber.precision
  BigNumber.config({ precision: 1E9 })

  const result = x.plus(new BigNumber(1))
  result.s = -result.s || null

  BigNumber.config({ precision: prevPrec })
  return result
}

/**
 * Bitwise OR for BigNumbers
 *
 * Special Cases:
 *   N |  n =  N
 *   n |  0 =  n
 *   n | -1 = -1
 *   n |  n =  n
 *   I |  I =  I
 *  -I | -I = -I
 *   I | -n = -1
 *   I | -I = -1
 *   I |  n =  I
 *  -I |  n = -I
 *  -I | -n = -n
 *
 * @param {BigNumber} x
 * @param {BigNumber} y
 * @return {BigNumber} Result of `x` | `y`, fully precise
 */
export function bitOrBigNumber (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Integers expected in function bitOr')
  }

  const BigNumber = x.constructor
  if (x.isNaN() || y.isNaN()) {
    return new BigNumber(NaN)
  }

  const negOne = new BigNumber(-1)
  if (x.isZero() || y.eq(negOne) || x.eq(y)) {
    return y
  }
  if (y.isZero() || x.eq(negOne)) {
    return x
  }

  if (!x.isFinite() || !y.isFinite()) {
    if ((!x.isFinite() && !x.isNegative() && y.isNegative()) ||
      (x.isNegative() && !y.isNegative() && !y.isFinite())) {
      return negOne
    }
    if (x.isNegative() && y.isNegative()) {
      return x.isFinite() ? x : y
    }
    return x.isFinite() ? y : x
  }

  return bitwise(x, y, function (a, b) { return a | b })
}

/**
 * Applies bitwise function to numbers
 * @param {BigNumber} x
 * @param {BigNumber} y
 * @param {function (a, b)} func
 * @return {BigNumber}
 */
export function bitwise (x, y, func) {
  const BigNumber = x.constructor

  let xBits, yBits
  const xSign = +(x.s < 0)
  const ySign = +(y.s < 0)
  if (xSign) {
    xBits = decCoefficientToBinaryString(bitNotBigNumber(x))
    for (let i = 0; i < xBits.length; ++i) {
      xBits[i] ^= 1
    }
  } else {
    xBits = decCoefficientToBinaryString(x)
  }
  if (ySign) {
    yBits = decCoefficientToBinaryString(bitNotBigNumber(y))
    for (let i = 0; i < yBits.length; ++i) {
      yBits[i] ^= 1
    }
  } else {
    yBits = decCoefficientToBinaryString(y)
  }

  let minBits, maxBits, minSign
  if (xBits.length <= yBits.length) {
    minBits = xBits
    maxBits = yBits
    minSign = xSign
  } else {
    minBits = yBits
    maxBits = xBits
    minSign = ySign
  }

  let shortLen = minBits.length
  let longLen = maxBits.length
  const expFuncVal = func(xSign, ySign) ^ 1
  let outVal = new BigNumber(expFuncVal ^ 1)
  let twoPower = new BigNumber(1)
  const two = new BigNumber(2)

  const prevPrec = BigNumber.precision
  BigNumber.config({ precision: 1E9 })

  while (shortLen > 0) {
    if (func(minBits[--shortLen], maxBits[--longLen]) === expFuncVal) {
      outVal = outVal.plus(twoPower)
    }
    twoPower = twoPower.times(two)
  }
  while (longLen > 0) {
    if (func(minSign, maxBits[--longLen]) === expFuncVal) {
      outVal = outVal.plus(twoPower)
    }
    twoPower = twoPower.times(two)
  }

  BigNumber.config({ precision: prevPrec })

  if (expFuncVal === 0) {
    outVal.s = -outVal.s
  }
  return outVal
}

/* Extracted from decimal.js, and edited to specialize. */
function decCoefficientToBinaryString (x) {
  // Convert to string
  const a = x.d // array with digits
  let r = a[0] + ''

  for (let i = 1; i < a.length; ++i) {
    let s = a[i] + ''
    for (let z = 7 - s.length; z--;) {
      s = '0' + s
    }

    r += s
  }

  let j = r.length
  while (r.charAt(j) === '0') {
    j--
  }

  let xe = x.e
  let str = r.slice(0, j + 1 || 1)
  const strL = str.length
  if (xe > 0) {
    if (++xe > strL) {
      // Append zeros.
      xe -= strL
      while (xe--) {
        str += '0'
      }
    } else if (xe < strL) {
      str = str.slice(0, xe) + '.' + str.slice(xe)
    }
  }

  // Convert from base 10 (decimal) to base 2
  const arr = [0]
  for (let i = 0; i < str.length;) {
    let arrL = arr.length
    while (arrL--) {
      arr[arrL] *= 10
    }

    arr[0] += parseInt(str.charAt(i++)) // convert to int
    for (let j = 0; j < arr.length; ++j) {
      if (arr[j] > 1) {
        if (arr[j + 1] === null || arr[j + 1] === undefined) {
          arr[j + 1] = 0
        }

        arr[j + 1] += arr[j] >> 1
        arr[j] &= 1
      }
    }
  }

  return arr.reverse()
}

/**
 * Bitwise XOR for BigNumbers
 *
 * Special Cases:
 *   N ^  n =  N
 *   n ^  0 =  n
 *   n ^  n =  0
 *   n ^ -1 = ~n
 *   I ^  n =  I
 *   I ^ -n = -I
 *   I ^ -I = -1
 *  -I ^  n = -I
 *  -I ^ -n =  I
 *
 * @param {BigNumber} x
 * @param {BigNumber} y
 * @return {BigNumber} Result of `x` ^ `y`, fully precise
 *
 */
export function bitXor (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Integers expected in function bitXor')
  }

  const BigNumber = x.constructor
  if (x.isNaN() || y.isNaN()) {
    return new BigNumber(NaN)
  }
  if (x.isZero()) {
    return y
  }
  if (y.isZero()) {
    return x
  }

  if (x.eq(y)) {
    return new BigNumber(0)
  }

  const negOne = new BigNumber(-1)
  if (x.eq(negOne)) {
    return bitNotBigNumber(y)
  }
  if (y.eq(negOne)) {
    return bitNotBigNumber(x)
  }

  if (!x.isFinite() || !y.isFinite()) {
    if (!x.isFinite() && !y.isFinite()) {
      return negOne
    }
    return new BigNumber(x.isNegative() === y.isNegative()
      ? Infinity
      : -Infinity)
  }
  return bitwise(x, y, function (a, b) { return a ^ b })
}

/**
 * Bitwise left shift
 *
 * Special Cases:
 *  n << -n = N
 *  n <<  N = N
 *  N <<  n = N
 *  n <<  0 = n
 *  0 <<  n = 0
 *  I <<  I = N
 *  I <<  n = I
 *  n <<  I = I
 *
 * @param {BigNumber} x
 * @param {BigNumber} y
 * @return {BigNumber} Result of `x` << `y`
 *
 */
export function leftShiftBigNumber (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Integers expected in function leftShift')
  }

  const BigNumber = x.constructor
  if (x.isNaN() || y.isNaN() || (y.isNegative() && !y.isZero())) {
    return new BigNumber(NaN)
  }
  if (x.isZero() || y.isZero()) {
    return x
  }
  if (!x.isFinite() && !y.isFinite()) {
    return new BigNumber(NaN)
  }

  // Math.pow(2, y) is fully precise for y < 55, and fast
  if (y.lt(55)) {
    return x.times(Math.pow(2, y.toNumber()) + '')
  }
  return x.times(new BigNumber(2).pow(y))
}

/*
 * Special Cases:
 *   n >> -n =  N
 *   n >>  N =  N
 *   N >>  n =  N
 *   I >>  I =  N
 *   n >>  0 =  n
 *   I >>  n =  I
 *  -I >>  n = -I
 *  -I >>  I = -I
 *   n >>  I =  I
 *  -n >>  I = -1
 *   0 >>  n =  0
 *
 * @param {BigNumber} value
 * @param {BigNumber} value
 * @return {BigNumber} Result of `x` >> `y`
 *
 */
export function rightArithShiftBigNumber (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Integers expected in function rightArithShift')
  }

  const BigNumber = x.constructor
  if (x.isNaN() || y.isNaN() || (y.isNegative() && !y.isZero())) {
    return new BigNumber(NaN)
  }
  if (x.isZero() || y.isZero()) {
    return x
  }
  if (!y.isFinite()) {
    if (x.isNegative()) {
      return new BigNumber(-1)
    }
    if (!x.isFinite()) {
      return new BigNumber(NaN)
    }
    return new BigNumber(0)
  }

  // Math.pow(2, y) is fully precise for y < 55, and fast
  if (y.lt(55)) {
    return x.div(Math.pow(2, y.toNumber()) + '').floor()
  }
  return x.div(new BigNumber(2).pow(y)).floor()
}
