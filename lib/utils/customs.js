'use strict';

var hasOwnProperty = require('./object').hasOwnProperty;

/**
 * Get a property of a plain object
 * Throws an error in case the object is not a plain object or the
 * property is not defined on the object itself
 * @param {Object} object
 * @param {string} prop
 * @return {*} Returns the property value when safe
 */
function getSafeProperty (object, prop) {
  // only allow getting properties of a plain object
  if (isPlainObject(object)) {
    // only allow getting properties defined on the object itself,
    // not inherited from it's prototype.
    if (hasOwnProperty(object, prop)) {
      return object[prop];
    }

    if (!(prop in object)) {
      // this is a not existing property on a plain object
      return undefined;
    }
  }

  if (typeof object[prop] === 'function' && isSafeMethod(object, prop)) {
    throw new Error('Cannot access method "' + prop + '" as a property');
  }

  throw new Error('No access to property "' + prop + '"');
}

/**
 * Set a property on a plain object.
 * Throws an error in case the object is not a plain object or the
 * property would override an inherited property like .constructor or .toString
 * @param {Object} object
 * @param {string} prop
 * @param {*} value
 * @return {*} Returns the value
 */
// TODO: merge this function into access.js?
function setSafeProperty (object, prop, value) {
  // only allow setting properties of a plain object
  if (isPlainObject(object)) {
    // only allow setting properties defined on the object itself,
    // not inherited from it's prototype.
    if (prop in object) {
      // property already exists
      // override when the property is defined on the object itself.
      // don't allow overriding inherited properties like .constructor or .toString
      if (hasOwnProperty(object, prop)) {
        return object[prop] = value;
      }
    }
    else {
      // this is a new property, that's just ok
      return object[prop] = value;
    }
  }

  throw new Error('No access to property "' + prop + '"');
}

/**
 * Test whether a property is safe to use for an object.
 * For example .toString and .constructor are not safe
 * @param {string} prop
 * @return {boolean} Returns true when safe
 */
function isSafeProperty (prop) {
  return !(prop in {});
}

/**
 * Validate whether a method is safe.
 * Throws an error when that's not the case.
 * @param {Object} object
 * @param {string} method
 */
// TODO: merge this function into assign.js?
function validateSafeMethod (object, method) {
  if (!isSafeMethod(object, method)) {
    throw new Error('No access to method "' + method + '"');
  }
}

function isSafeMethod (object, method) {
  // TODO: remove this, replace with whitelist
  if (method === 'constructor') {
    return false;
  }

  // test for plain functions defined on the object (instead of a method)
  if (hasOwnProperty(object, method) && isPlainObject(object)) {
    return true;
  }

  // only allow methods from the whitelist
  // TODO: also check whether this method is supported on given object
  return hasOwnProperty(safeMethods, method);
}

function isPlainObject (object) {
  // TODO: improve this function
  return typeof object === 'object' && object && object.constructor === Object;
}

// whitelist of safe methods
var safeMethods = {
  abs: true,
  absoluteValue: true,
  acos: true,
  acosh: true,
  acot: true,
  acoth: true,
  acsc: true,
  acsch: true,
  add: true,
  and: true,
  arg: true,
  asec: true,
  asech: true,
  asin: true,
  asinh: true,
  atan: true,
  atan2: true,
  atanh: true,
  bellNumbers: true,
  bignumber: true,
  bitAnd: true,
  bitNot: true,
  bitOr: true,
  bitXor: true,
  boolean: true,
  catalan: true,
  cbrt: true,
  ceil: true,
  chain: true,
  clone: true,
  cloneDeep: true,
  cmp: true,
  combinations: true,
  compare: true,
  comparedTo: true,
  compile: true,
  complex: true,
  composition: true,
  concat: true,
  config: true,
  conj: true,
  conjugate: true,
  cos: true,
  cosh: true,
  cosine: true,
  cot: true,
  coth: true,
  create: true,
  createUnit: true,
  cross: true,
  csc: true,
  csch: true,
  cube: true,
  cubeRoot: true,
  decimalPlaces: true,
  deepEqual: true,
  derivative: true,
  det: true,
  diag: true,
  diagonal: true,
  distance: true,
  div: true,
  divToInt: true,
  divide: true,
  dividedBy: true,
  dividedToIntegerBy: true,
  done: true,
  dot: true,
  dotDivide: true,
  dotMultiply: true,
  dotPow: true,
  dp: true,
  emit: true,
  eq: true,
  equal: true,
  equalBase: true,
  equals: true,
  erf: true,
  eval: true,
  exp: true,
  eye: true,
  factorial: true,
  filter: true,
  fix: true,
  flatten: true,
  floor: true,
  forEach: true,
  format: true,
  formatUnits: true,
  fraction: true,
  gamma: true,
  gcd: true,
  greaterThan: true,
  greaterThanOrEqualTo: true,
  gt: true,
  gte: true,
  hasBase: true,
  help: true,
  hyperbolicCosine: true,
  hyperbolicSine: true,
  hyperbolicTangent: true,
  hypot: true,
  im: true,
  import: true,
  index: true,
  intersect: true,
  inv: true,
  inverse: true,
  inverseCosine: true,
  inverseHyperbolicCosine: true,
  inverseHyperbolicSine: true,
  inverseHyperbolicTangent: true,
  inverseSine: true,
  inverseTangent: true,
  isFinite: true,
  isInt: true,
  isInteger: true,
  isNaN: true,
  isNeg: true,
  isNegative: true,
  isNumeric: true,
  isPos: true,
  isPositive: true,
  isPrime: true,
  isZero: true,
  kldivergence: true,
  kron: true,
  larger: true,
  largerEq: true,
  lcm: true,
  leftShift: true,
  lessThan: true,
  lessThanOrEqualTo: true,
  ln: true,
  log: true,
  log10: true,
  log2: true,
  logarithm: true,
  lsolve: true,
  lt: true,
  lte: true,
  lup: true,
  lusolve: true,
  mad: true,
  map: true,
  matrix: true,
  max: true,
  mean: true,
  median: true,
  min: true,
  minus: true,
  mod: true,
  mode: true,
  modulo: true,
  mul: true,
  multinomial: true,
  multiply: true,
  naturalExponential: true,
  naturalLogarithm: true,
  neg: true,
  negated: true,
  noConflict: true,
  norm: true,
  not: true,
  nthRoot: true,
  number: true,
  off: true,
  on: true,
  once: true,
  ones: true,
  or: true,
  parse: true,
  parser: true,
  partitionSelect: true,
  permutations: true,
  pickRandom: true,
  plus: true,
  pow: true,
  precision: true,
  print: true,
  prod: true,
  quantileSeq: true,
  random: true,
  randomInt: true,
  range: true,
  re: true,
  reshape: true,
  resize: true,
  rightArithShift: true,
  rightLogShift: true,
  round: true,
  sd: true,
  sec: true,
  sech: true,
  set: true,
  sign: true,
  simplify: true,
  sin: true,
  sine: true,
  sinh: true,
  size: true,
  slu: true,
  smaller: true,
  smallerEq: true,
  sort: true,
  sparse: true,
  splitUnit: true,
  sqrt: true,
  square: true,
  squareRoot: true,
  squeeze: true,
  std: true,
  stirlingS2: true,
  string: true,
  sub: true,
  subset: true,
  subtract: true,
  sum: true,
  swapRows: true,
  tan: true,
  tangent: true,
  tanh: true,
  times: true,
  to: true,
  toArray: true,
  toBinary: true,
  toContinued: true,
  toDP: true,
  toDecimalPlaces: true,
  toExponential: true,
  toFixed: true,
  toFraction: true,
  toHex: true,
  toHexadecimal: true,
  toJSON: true,
  toLatex: true,
  toNearest: true,
  toNumber: true,
  toNumeric: true,
  toOctal: true,
  toPower: true,
  toPrecision: true,
  toSD: true,
  toSignificantDigits: true,
  toString: true,
  toTex: true,
  toVector: true,
  trace: true,
  transform: true,
  transpose: true,
  traverse: true,
  trunc: true,
  truncated: true,
  typed: true,
  typeof: true,
  unaryMinus: true,
  unaryPlus: true,
  unequal: true,
  unit: true,
  usolve: true,
  valueOf: true,
  var: true,
  xgcd: true,
  xor: true,
  zeros: true
}

exports.getSafeProperty = getSafeProperty;
exports.setSafeProperty = setSafeProperty;
exports.isSafeProperty = isSafeProperty;
exports.validateSafeMethod = validateSafeMethod;
exports.isSafeMethod = isSafeMethod;
