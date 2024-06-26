// generates a whitelist of safe methods and functions
import { hasOwnProperty } from './utils.js'
import { create, all } from '../lib/esm/index.js'

// math.js functions (can be used when chaining
const math = create(all)
const chain = {
  done: true,
  valueOf: true,
  toString: true
}
for (const name in math) {
  if (hasOwnProperty(math, name) && typeof math[name] === 'function') {
    chain[name] = true
  }
}

const groups = [
  chain,

  // Unit
  {
    valueOf: true,
    clone: true,
    hasBase: true,
    equalBase: true,
    equals: true,
    multiply: true,
    divide: true,
    pow: true,
    abs: true,
    to: true,
    toNumber: true,
    toNumeric: true,
    format: true,
    formatUnits: true,
    toString: true
  },

  // Complex
  {
    sign: true,
    add: true,
    sub: true,
    mul: true,
    div: true,
    pow: true,
    sqrt: true,
    exp: true,
    log: true,
    abs: true,
    arg: true,
    inverse: true,
    conjugate: true,
    neg: true,
    floor: true,
    ceil: true,
    round: true,
    equals: true,
    isNaN: true,
    clone: true,
    toVector: true,
    toString: true,
    sin: true,
    cos: true,
    tan: true,
    cot: true,
    sec: true,
    csc: true,
    asin: true,
    acos: true,
    atan: true,
    acot: true,
    asec: true,
    acsc: true,
    sinh: true,
    cosh: true,
    tanh: true,
    coth: true,
    sech: true,
    csch: true,
    asinh: true,
    acosh: true,
    atanh: true,
    acoth: true,
    asech: true,
    acsch: true
  },

  // BigNumber
  {
    // 'abs': true,
    // 'acos': true,
    // 'acosh': true,
    // 'add': true,
    // 'asin': true,
    // 'asinh': true,
    // 'atan': true,
    // 'atanh': true,
    atan2: true,
    // 'cbrt': true,
    // 'ceil': true,
    clone: true,
    // 'cos': true,
    // 'cosh': true,
    // 'div': true,
    // 'exp': true,
    // 'floor': true,
    hypot: true,
    // 'ln': true,
    // 'log': true,
    log2: true,
    log10: true,
    max: true,
    min: true,
    // 'mod': true,
    // 'mul': true,
    noConflict: true,
    // 'pow': true,
    random: true,
    // 'round': true,
    set: true,
    sign: true,
    // 'sin': true,
    // 'sinh': true,
    // 'sqrt': true,
    // 'sub': true,
    // 'tan': true,
    // 'tanh': true,
    // 'trunc': true,

    absoluteValue: true,
    abs: true,
    ceil: true,
    comparedTo: true,
    cmp: true,
    cosine: true,
    cos: true,
    cubeRoot: true,
    cbrt: true,
    decimalPlaces: true,
    dp: true,
    dividedBy: true,
    div: true,
    dividedToIntegerBy: true,
    divToInt: true,
    equals: true,
    eq: true,
    floor: true,
    greaterThan: true,
    gt: true,
    greaterThanOrEqualTo: true,
    gte: true,
    hyperbolicCosine: true,
    cosh: true,
    hyperbolicSine: true,
    sinh: true,
    hyperbolicTangent: true,
    tanh: true,
    inverseCosine: true,
    acos: true,
    inverseHyperbolicCosine: true,
    acosh: true,
    inverseHyperbolicSine: true,
    asinh: true,
    inverseHyperbolicTangent: true,
    atanh: true,
    inverseSine: true,
    asin: true,
    inverseTangent: true,
    atan: true,
    isFinite: true,
    isInteger: true,
    isInt: true,
    isNaN: true,
    isNegative: true,
    isNeg: true,
    isPositive: true,
    isPos: true,
    isZero: true,
    lessThan: true,
    lt: true,
    lessThanOrEqualTo: true,
    lte: true,
    logarithm: true,
    log: true,
    minus: true,
    sub: true,
    modulo: true,
    mod: true,
    naturalExponential: true,
    exp: true,
    naturalLogarithm: true,
    ln: true,
    negated: true,
    neg: true,
    plus: true,
    add: true,
    precision: true,
    sd: true,
    round: true,
    sine: true,
    sin: true,
    squareRoot: true,
    sqrt: true,
    tangent: true,
    tan: true,
    times: true,
    mul: true,
    toBinary: true,
    toDecimalPlaces: true,
    toDP: true,
    toExponential: true,
    toFixed: true,
    toFraction: true,
    toHexadecimal: true,
    toHex: true,
    toJSON: true,
    toNearest: true,
    toNumber: true,
    toOctal: true,
    toPower: true,
    pow: true,
    toPrecision: true,
    toSignificantDigits: true,
    toSD: true,
    toString: true,
    truncated: true,
    trunc: true,
    valueOf: true
  },

  // Fraction
  {
    abs: true,
    neg: true,
    add: true,
    sub: true,
    mul: true,
    div: true,
    pow: true,
    mod: true,
    gcd: true,
    lcm: true,
    ceil: true,
    floor: true,
    round: true,
    inverse: true,
    equals: true,
    compare: true,
    valueOf: true,
    toString: true,
    toLatex: true,
    toFraction: true,
    toContinued: true,
    clone: true
  },

  // Array, DenseMatrix, SparseMatrix
  {
    clone: true,
    subset: true,
    resize: true,
    size: true,
    map: true,
    forEach: true,
    toArray: true,
    toJSON: true,
    diagonal: true,
    swapRows: true,
    toString: true,
    valueOf: true,
    format: true
  },

  // Node
  {
    clone: true,
    cloneDeep: true,
    compile: true,
    evaluate: true,
    equals: true,
    filter: true,
    forEach: true,
    map: true,
    toString: true,
    toTex: true,
    transform: true,
    traverse: true
  }
]

// merge all groups into a single whitelist
const whitelist = groups.reduce(function (whitelist, group) {
  return Object.assign(whitelist, group)
}, {})

const keys = Object.keys(whitelist).sort()
const orderedWhitelist = keys.reduce(function (whitelist, key) {
  whitelist[key] = true
  return whitelist
}, {})

console.log(orderedWhitelist)
console.log('number of methods/functions:', keys.length)
console.log('copy this object with safe methods into the file customs.js.')
