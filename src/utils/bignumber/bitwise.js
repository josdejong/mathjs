'use strict'
const bitNot = require('./bitNot')

/**
 * Applies bitwise function to numbers
 * @param {BigNumber} x
 * @param {BigNumber} y
 * @param {function (a, b)} func
 * @return {BigNumber}
 */
module.exports = function bitwise (x, y, func) {
  const BigNumber = x.constructor

  let xBits, yBits
  const xSign = +(x.s < 0)
  const ySign = +(y.s < 0)
  if (xSign) {
    xBits = decCoefficientToBinaryString(bitNot(x))
    for (let i = 0; i < xBits.length; ++i) {
      xBits[i] ^= 1
    }
  } else {
    xBits = decCoefficientToBinaryString(x)
  }
  if (ySign) {
    yBits = decCoefficientToBinaryString(bitNot(y))
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
