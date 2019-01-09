'use strict'

import { factory } from '../../utils/factory'
import { typeOf as _typeOf } from '../../utils/is'

const name = 'typeOf'
const dependencies = ['typed']

export const createTypeOf = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Determine the type of a variable.
   *
   * Function `typeOf` recognizes the following types of objects:
   *
   * Object                 | Returns       | Example
   * ---------------------- | ------------- | ------------------------------------------
   * null                   | `'null'`      | `math.typeOf(null)`
   * number                 | `'number'`    | `math.typeOf(3.5)`
   * boolean                | `'boolean'`   | `math.typeOf(true)`
   * string                 | `'string'`    | `math.typeOf('hello world')`
   * Array                  | `'Array'`     | `math.typeOf([1, 2, 3])`
   * Date                   | `'Date'`      | `math.typeOf(new Date())`
   * Function               | `'Function'`  | `math.typeOf(function () {})`
   * Object                 | `'Object'`    | `math.typeOf({a: 2, b: 3})`
   * RegExp                 | `'RegExp'`    | `math.typeOf(/a regexp/)`
   * undefined              | `'undefined'` | `math.typeOf(undefined)`
   * math.type.BigNumber    | `'BigNumber'` | `math.typeOf(math.bignumber('2.3e500'))`
   * math.type.Chain        | `'Chain'`     | `math.typeOf(math.chain(2))`
   * math.type.Complex      | `'Complex'`   | `math.typeOf(math.complex(2, 3))`
   * math.type.Fraction     | `'Fraction'`  | `math.typeOf(math.fraction(1, 3))`
   * math.type.Help         | `'Help'`      | `math.typeOf(math.help('sqrt'))`
   * math.type.Help         | `'Help'`      | `math.typeOf(math.help('sqrt'))`
   * math.type.Index        | `'Index'`     | `math.typeOf(math.index(1, 3))`
   * math.type.Matrix       | `'Matrix'`    | `math.typeOf(math.matrix([[1,2], [3, 4]]))`
   * math.type.Range        | `'Range'`     | `math.typeOf(math.range(0, 10))`
   * math.type.ResultSet    | `'ResultSet'` | `math.typeOf(math.evaluate('a=2\nb=3'))`
   * math.type.Unit         | `'Unit'`      | `math.typeOf(math.unit('45 deg'))`
   * math.expression.node&#8203;.AccessorNode            | `'AccessorNode'`            | `math.typeOf(math.parse('A[2]'))`
   * math.expression.node&#8203;.ArrayNode               | `'ArrayNode'`               | `math.typeOf(math.parse('[1,2,3]'))`
   * math.expression.node&#8203;.AssignmentNode          | `'AssignmentNode'`          | `math.typeOf(math.parse('x=2'))`
   * math.expression.node&#8203;.BlockNode               | `'BlockNode'`               | `math.typeOf(math.parse('a=2; b=3'))`
   * math.expression.node&#8203;.ConditionalNode         | `'ConditionalNode'`         | `math.typeOf(math.parse('x<0 ? -x : x'))`
   * math.expression.node&#8203;.ConstantNode            | `'ConstantNode'`            | `math.typeOf(math.parse('2.3'))`
   * math.expression.node&#8203;.FunctionAssignmentNode  | `'FunctionAssignmentNode'`  | `math.typeOf(math.parse('f(x)=x^2'))`
   * math.expression.node&#8203;.FunctionNode            | `'FunctionNode'`            | `math.typeOf(math.parse('sqrt(4)'))`
   * math.expression.node&#8203;.IndexNode               | `'IndexNode'`               | `math.typeOf(math.parse('A[2]').index)`
   * math.expression.node&#8203;.ObjectNode              | `'ObjectNode'`              | `math.typeOf(math.parse('{a:2}'))`
   * math.expression.node&#8203;.ParenthesisNode         | `'ParenthesisNode'`         | `math.typeOf(math.parse('(2+3)'))`
   * math.expression.node&#8203;.RangeNode               | `'RangeNode'`               | `math.typeOf(math.parse('1:10'))`
   * math.expression.node&#8203;.SymbolNode              | `'SymbolNode'`              | `math.typeOf(math.parse('x'))`
   *
   * Syntax:
   *
   *    math.typeOf(x)
   *
   * Examples:
   *
   *    math.typeOf(3.5)                     // returns 'number'
   *    math.typeOf(math.complex('2-4i'))    // returns 'Complex'
   *    math.typeOf(math.unit('45 deg'))     // returns 'Unit'
   *    math.typeOf('hello world')           // returns 'string'
   *
   * @param {*} x     The variable for which to test the type.
   * @return {string} Returns the name of the type. Primitive types are lower case,
   *                  non-primitive types are upper-camel-case.
   *                  For example 'number', 'string', 'Array', 'Date'.
   */
  return typed(name, {
    'any': _typeOf
  })
})

// For backward compatibility, deprecated since version 6.0.0. Date: 2018-11-06
export const createDeprecatedTypeof = /* #__PURE__ */ factory('typeof', [], () => {
  let warned = false

  return function (...args) {
    if (!warned) {
      warned = true
      console.warn('Function "typeof" has been renamed to "typeOf", please use the new function instead.')
    }

    return _typeOf.apply(_typeOf, args)
  }
})
