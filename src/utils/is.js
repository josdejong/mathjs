// type checks for all known types
//
// note that:
//
// - check by duck-typing on a property like `isUnit`, instead of checking instanceof.
//   instanceof cannot be used because that would not allow to pass data from
//   one instance of math.js to another since each has it's own instance of Unit.
// - check the `isUnit` property via the constructor, so there will be no
//   matches for "fake" instances like plain objects with a property `isUnit`.
//   That is important for security reasons.
// - It must not be possible to override the type checks used internally,
//   for security reasons, so these functions are not exposed in the expression
//   parser.

export function isNumber (x) {
  return typeof x === 'number'
}

export function isBigNumber (x) {
  return (x && x.constructor.prototype.isBigNumber === true) || false
}

export function isComplex (x) {
  return (x && typeof x === 'object' && Object.getPrototypeOf(x).isComplex === true) || false
}

export function isFraction (x) {
  return (x && typeof x === 'object' && Object.getPrototypeOf(x).isFraction === true) || false
}

export function isUnit (x) {
  return (x && x.constructor.prototype.isUnit === true) || false
}

export function isString (x) {
  return typeof x === 'string'
}

export const isArray = Array.isArray

export function isMatrix (x) {
  return (x && x.constructor.prototype.isMatrix === true) || false
}

/**
 * Test whether a value is a collection: an Array or Matrix
 * @param {*} x
 * @returns {boolean} isCollection
 */
export function isCollection (x) {
  return Array.isArray(x) || isMatrix(x)
}

export function isDenseMatrix (x) {
  return (x && x.isDenseMatrix && x.constructor.prototype.isMatrix === true) || false
}

export function isSparseMatrix (x) {
  return (x && x.isSparseMatrix && x.constructor.prototype.isMatrix === true) || false
}

export function isRange (x) {
  return (x && x.constructor.prototype.isRange === true) || false
}

export function isIndex (x) {
  return (x && x.constructor.prototype.isIndex === true) || false
}

export function isBoolean (x) {
  return typeof x === 'boolean'
}

export function isResultSet (x) {
  return (x && x.constructor.prototype.isResultSet === true) || false
}

export function isHelp (x) {
  return (x && x.constructor.prototype.isHelp === true) || false
}

export function isFunction (x) {
  return typeof x === 'function'
}

export function isDate (x) {
  return x instanceof Date
}

export function isRegExp (x) {
  return x instanceof RegExp
}

export function isObject (x) {
  return !!(x &&
    typeof x === 'object' &&
    x.constructor === Object &&
    !isComplex(x) &&
    !isFraction(x))
}

export function isNull (x) {
  return x === null
}

export function isUndefined (x) {
  return x === undefined
}

export function isAccessorNode (x) {
  return (x && x.isAccessorNode === true && x.constructor.prototype.isNode === true) || false
}

export function isArrayNode (x) {
  return (x && x.isArrayNode === true && x.constructor.prototype.isNode === true) || false
}

export function isAssignmentNode (x) {
  return (x && x.isAssignmentNode === true && x.constructor.prototype.isNode === true) || false
}

export function isBlockNode (x) {
  return (x && x.isBlockNode === true && x.constructor.prototype.isNode === true) || false
}

export function isConditionalNode (x) {
  return (x && x.isConditionalNode === true && x.constructor.prototype.isNode === true) || false
}

export function isConstantNode (x) {
  return (x && x.isConstantNode === true && x.constructor.prototype.isNode === true) || false
}

export function isFunctionAssignmentNode (x) {
  return (x && x.isFunctionAssignmentNode === true && x.constructor.prototype.isNode === true) || false
}

export function isFunctionNode (x) {
  return (x && x.isFunctionNode === true && x.constructor.prototype.isNode === true) || false
}

export function isIndexNode (x) {
  return (x && x.isIndexNode === true && x.constructor.prototype.isNode === true) || false
}

export function isNode (x) {
  return (x && x.isNode === true && x.constructor.prototype.isNode === true) || false
}

export function isObjectNode (x) {
  return (x && x.isObjectNode === true && x.constructor.prototype.isNode === true) || false
}

export function isOperatorNode (x) {
  return (x && x.isOperatorNode === true && x.constructor.prototype.isNode === true) || false
}

export function isParenthesisNode (x) {
  return (x && x.isParenthesisNode === true && x.constructor.prototype.isNode === true) || false
}

export function isRangeNode (x) {
  return (x && x.isRangeNode === true && x.constructor.prototype.isNode === true) || false
}

export function isSymbolNode (x) {
  return (x && x.isSymbolNode === true && x.constructor.prototype.isNode === true) || false
}

export function isChain (x) {
  return (x && x.constructor.prototype.isChain === true) || false
}

export function typeOf (x) {
  const t = typeof x

  if (t === 'object') {
    // JavaScript types
    if (x === null) return 'null'
    if (Array.isArray(x)) return 'Array'
    if (x instanceof Date) return 'Date'
    if (x instanceof RegExp) return 'RegExp'

    // math.js types
    if (isBigNumber(x)) return 'BigNumber'
    if (isComplex(x)) return 'Complex'
    if (isFraction(x)) return 'Fraction'
    if (isMatrix(x)) return 'Matrix'
    if (isUnit(x)) return 'Unit'
    if (isIndex(x)) return 'Index'
    if (isRange(x)) return 'Range'
    if (isResultSet(x)) return 'ResultSet'
    if (isNode(x)) return x.type
    if (isChain(x)) return 'Chain'
    if (isHelp(x)) return 'Help'

    return 'Object'
  }

  if (t === 'function') return 'Function'

  return t // can be 'string', 'number', 'boolean', ...
}
