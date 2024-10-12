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

import { ObjectWrappingMap } from './map.js'

export function isNumber (x) {
  return typeof x === 'number'
}

export function isBigNumber (x) {
  if (
    !x || typeof x !== 'object' ||
    typeof x.constructor !== 'function'
  ) {
    return false
  }

  if (
    x.isBigNumber === true &&
    typeof x.constructor.prototype === 'object' &&
    x.constructor.prototype.isBigNumber === true
  ) {
    return true
  }

  if (
    typeof x.constructor.isDecimal === 'function' &&
    x.constructor.isDecimal(x) === true
  ) {
    return true
  }

  return false
}

export function isBigInt (x) {
  return typeof x === 'bigint'
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

/**
 * Returns `true` if the passed object appears to be a Map (i.e. duck typing).
 *
 * Methods looked for are `get`, `set`, `keys` and `has`.
 *
 * @param {Map | object} object
 * @returns
 */
export function isMap (object) {
  // We can use the fast instanceof, or a slower duck typing check.
  // The duck typing method needs to cover enough methods to not be confused with DenseMatrix.
  if (!object) {
    return false
  }
  return object instanceof Map ||
    object instanceof ObjectWrappingMap ||
    (
      typeof object.set === 'function' &&
      typeof object.get === 'function' &&
      typeof object.keys === 'function' &&
      typeof object.has === 'function'
    )
}

export function isPartitionedMap (object) {
  return isMap(object) && isMap(object.a) && isMap(object.b)
}

export function isObjectWrappingMap (object) {
  return isMap(object) && isObject(object.wrappedObject)
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

/* Very specialized: returns true for those nodes which in the numerator of
   a fraction means that the division in that fraction has precedence over implicit
   multiplication, e.g. -2/3 x parses as (-2/3) x and 3/4 x parses as (3/4) x but
   6!/8 x parses as 6! / (8x). It is located here because it is shared between
   parse.js and OperatorNode.js (for parsing and printing, respectively).

   This should *not* be exported from mathjs, unlike most of the tests here.
   Its name does not start with 'is' to prevent utils/snapshot.js from thinking
   it should be exported.
*/
export function rule2Node (node) {
  return isConstantNode(node) ||
    (isOperatorNode(node) &&
     node.args.length === 1 &&
     isConstantNode(node.args[0]) &&
     '-+~'.includes(node.op))
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

export function isRelationalNode (x) {
  return (x && x.isRelationalNode === true && x.constructor.prototype.isNode === true) || false
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
    if (x === null) return 'null'
    if (isBigNumber(x)) return 'BigNumber' // Special: weird mashup with Decimal
    if (x.constructor && x.constructor.name) return x.constructor.name

    return 'Object' // just in case
  }

  return t // can be 'string', 'number', 'boolean', 'function', 'bigint', ...
}
