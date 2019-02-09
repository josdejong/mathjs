'use strict'

/**
 * Create a typed-function which checks the types of the arguments and
 * can match them against multiple provided signatures. The typed-function
 * automatically converts inputs in order to find a matching signature.
 * Typed functions throw informative errors in case of wrong input arguments.
 *
 * See the library [typed-function](https://github.com/josdejong/typed-function)
 * for detailed documentation.
 *
 * Syntax:
 *
 *     math.typed(name, signatures) : function
 *     math.typed(signatures) : function
 *
 * Examples:
 *
 *     // create a typed function with multiple types per argument (type union)
 *     const fn2 = typed({
 *       'number | boolean': function (b) {
 *         return 'b is a number or boolean'
 *       },
 *       'string, number | boolean': function (a, b) {
 *         return 'a is a string, b is a number or boolean'
 *       }
 *     })
 *
 *     // create a typed function with an any type argument
 *     const log = typed({
 *       'string, any': function (event, data) {
 *         console.log('event: ' + event + ', data: ' + JSON.stringify(data))
 *       }
 *     })
 *
 * @param {string} [name]                          Optional name for the typed-function
 * @param {Object<string, function>} signatures   Object with one or multiple function signatures
 * @returns {function} The created typed-function.
 */

import {
  isAccessorNode,
  isArray,
  isArrayNode,
  isAssignmentNode,
  isBigNumber,
  isBlockNode,
  isBoolean,
  isChain,
  isComplex,
  isConditionalNode,
  isConstantNode,
  isDate,
  isDenseMatrix,
  isFraction,
  isFunction,
  isFunctionAssignmentNode,
  isFunctionNode,
  isHelp,
  isIndex,
  isIndexNode,
  isMatrix,
  isNode,
  isNull,
  isNumber,
  isObject,
  isObjectNode,
  isOperatorNode,
  isParenthesisNode,
  isRange,
  isRangeNode,
  isRegExp,
  isResultSet,
  isSparseMatrix,
  isString,
  isSymbolNode,
  isUndefined,
  isUnit
} from '../../utils/is'
import typedFunction from 'typed-function'
import { digits } from '../../utils/number'
import { factory } from '../../utils/factory'

// returns a new instance of typed-function
let _createTyped = function () {
  // initially, return the original instance of typed-function
  // consecutively, return a new instance from typed.create.
  _createTyped = typedFunction.create
  return typedFunction
}

const dependencies = [
  '?bignumber',
  '?complex',
  '?matrix',
  '?fraction'
]

/**
 * Factory function for creating a new typed instance
 * @param {Object} type   Object with data types like Complex and BigNumber
 * @returns {Function}
 */
export const createTyped = /* #__PURE__ */ factory('typed', dependencies, function createTyped ({ bignumber, complex, matrix, fraction }) {
  // TODO: typed-function must be able to silently ignore signatures with unknown data types

  // get a new instance of typed-function
  const typed = _createTyped()

  // define all types. The order of the types determines in which order function
  // arguments are type-checked (so for performance it's important to put the
  // most used types first).
  typed.types = [
    { name: 'number', test: isNumber },
    { name: 'Complex', test: isComplex },
    { name: 'BigNumber', test: isBigNumber },
    { name: 'Fraction', test: isFraction },
    { name: 'Unit', test: isUnit },
    { name: 'string', test: isString },
    { name: 'Chain', test: isChain },
    { name: 'Array', test: isArray },
    { name: 'Matrix', test: isMatrix },
    { name: 'DenseMatrix', test: isDenseMatrix },
    { name: 'SparseMatrix', test: isSparseMatrix },
    { name: 'Range', test: isRange },
    { name: 'Index', test: isIndex },
    { name: 'boolean', test: isBoolean },
    { name: 'ResultSet', test: isResultSet },
    { name: 'Help', test: isHelp },
    { name: 'function', test: isFunction },
    { name: 'Date', test: isDate },
    { name: 'RegExp', test: isRegExp },
    { name: 'null', test: isNull },
    { name: 'undefined', test: isUndefined },

    { name: 'AccessorNode', test: isAccessorNode },
    { name: 'ArrayNode', test: isArrayNode },
    { name: 'AssignmentNode', test: isAssignmentNode },
    { name: 'BlockNode', test: isBlockNode },
    { name: 'ConditionalNode', test: isConditionalNode },
    { name: 'ConstantNode', test: isConstantNode },
    { name: 'FunctionNode', test: isFunctionNode },
    { name: 'FunctionAssignmentNode', test: isFunctionAssignmentNode },
    { name: 'IndexNode', test: isIndexNode },
    { name: 'Node', test: isNode },
    { name: 'ObjectNode', test: isObjectNode },
    { name: 'OperatorNode', test: isOperatorNode },
    { name: 'ParenthesisNode', test: isParenthesisNode },
    { name: 'RangeNode', test: isRangeNode },
    { name: 'SymbolNode', test: isSymbolNode },

    { name: 'Object', test: isObject } // order 'Object' last, it matches on other classes too
  ]

  typed.conversions = [
    {
      from: 'number',
      to: 'BigNumber',
      convert: function (x) {
        if (!bignumber) {
          throwNoBignumber(x)
        }

        // note: conversion from number to BigNumber can fail if x has >15 digits
        if (digits(x) > 15) {
          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' +
            '(value: ' + x + '). ' +
            'Use function bignumber(x) to convert to BigNumber.')
        }
        return bignumber(x)
      }
    }, {
      from: 'number',
      to: 'Complex',
      convert: function (x) {
        if (!complex) {
          throwNoComplex(x)
        }

        return complex(x, 0)
      }
    }, {
      from: 'number',
      to: 'string',
      convert: function (x) {
        return x + ''
      }
    }, {
      from: 'BigNumber',
      to: 'Complex',
      convert: function (x) {
        if (!complex) {
          throwNoComplex(x)
        }

        return complex(x.toNumber(), 0)
      }
    }, {
      from: 'Fraction',
      to: 'BigNumber',
      convert: function (x) {
        throw new TypeError('Cannot implicitly convert a Fraction to BigNumber or vice versa. ' +
          'Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.')
      }
    }, {
      from: 'Fraction',
      to: 'Complex',
      convert: function (x) {
        if (!complex) {
          throwNoComplex(x)
        }

        return complex(x.valueOf(), 0)
      }
    }, {
      from: 'number',
      to: 'Fraction',
      convert: function (x) {
        if (!fraction) {
          throwNoFraction(x)
        }

        const f = fraction(x)
        if (f.valueOf() !== x) {
          throw new TypeError('Cannot implicitly convert a number to a Fraction when there will be a loss of precision ' +
            '(value: ' + x + '). ' +
            'Use function fraction(x) to convert to Fraction.')
        }
        return f
      }
    }, {
      // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
      //  from: 'Fraction',
      //  to: 'number',
      //  convert: function (x) {
      //    return x.valueOf()
      //  }
      // }, {
      from: 'string',
      to: 'number',
      convert: function (x) {
        const n = Number(x)
        if (isNaN(n)) {
          throw new Error('Cannot convert "' + x + '" to a number')
        }
        return n
      }
    }, {
      from: 'string',
      to: 'BigNumber',
      convert: function (x) {
        if (!bignumber) {
          throwNoBignumber(x)
        }

        try {
          return bignumber(x)
        } catch (err) {
          throw new Error('Cannot convert "' + x + '" to BigNumber')
        }
      }
    }, {
      from: 'string',
      to: 'Fraction',
      convert: function (x) {
        if (!fraction) {
          throwNoFraction(x)
        }

        try {
          return fraction(x)
        } catch (err) {
          throw new Error('Cannot convert "' + x + '" to Fraction')
        }
      }
    }, {
      from: 'string',
      to: 'Complex',
      convert: function (x) {
        if (!complex) {
          throwNoComplex(x)
        }

        try {
          return complex(x)
        } catch (err) {
          throw new Error('Cannot convert "' + x + '" to Complex')
        }
      }
    }, {
      from: 'boolean',
      to: 'number',
      convert: function (x) {
        return +x
      }
    }, {
      from: 'boolean',
      to: 'BigNumber',
      convert: function (x) {
        if (!bignumber) {
          throwNoBignumber(x)
        }

        return bignumber(+x)
      }
    }, {
      from: 'boolean',
      to: 'Fraction',
      convert: function (x) {
        if (!fraction) {
          throwNoFraction(x)
        }

        return fraction(+x)
      }
    }, {
      from: 'boolean',
      to: 'string',
      convert: function (x) {
        return String(x)
      }
    }, {
      from: 'Array',
      to: 'Matrix',
      convert: function (array) {
        if (!matrix) {
          throwNoMatrix()
        }

        return matrix(array)
      }
    }, {
      from: 'Matrix',
      to: 'Array',
      convert: function (matrix) {
        return matrix.valueOf()
      }
    }
  ]

  return typed
})

function throwNoBignumber (x) {
  throw new Error(`Cannot convert value ${x} into a BigNumber: no factory function 'bignumber' provided`)
}

function throwNoComplex (x) {
  throw new Error(`Cannot convert value ${x} into a Complex number: no factory function 'complex' provided`)
}

function throwNoMatrix () {
  throw new Error(`Cannot convert array into a Matrix: no factory function 'matrix' provided`)
}

function throwNoFraction (x) {
  throw new Error(`Cannot convert value ${x} into a Fraction, no factory function 'fraction' provided.`)
}
