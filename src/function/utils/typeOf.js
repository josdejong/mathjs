import { factory } from '../../utils/factory.js'
import { typeOf as _typeOf } from '../../utils/is.js'

const name = 'typeOf'
const dependencies = ['typed']

export const createTypeOf = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Determine the type of an entity.
   *
   * Syntax:
   *
   *    math.typeOf(x)
   *
   * Examples:
   *
   *    // This list is intended to include all relevant types, for testing
   *    // purposes:
   *    math.typeOf(3.5)                      // returns 'number'
   *    math.typeOf(42n)                      // returns 'bigint'
   *    math.typeOf(math.complex('2-4i'))     // returns 'Complex'
   *    math.typeOf(math.unit('45 deg'))      // returns 'Unit'
   *    math.typeOf('hello world')            // returns 'string'
   *    math.typeOf(null)                     // returns 'null'
   *    math.typeOf(true)                     // returns 'boolean'
   *    math.typeOf([1, 2, 3])                // returns 'Array'
   *    math.typeOf(new Date())               // returns 'Date'
   *    math.typeOf(function () {})           // returns 'function'
   *    math.typeOf({a: 2, b: 3})             // returns 'Object'
   *    math.typeOf(/a regexp/)               // returns 'RegExp'
   *    math.typeOf(undefined)                // returns 'undefined'
   *    math.typeOf(math.bignumber('23e99'))  // returns 'BigNumber'
   *    math.typeOf(math.chain(2))            // returns 'Chain'
   *    math.typeOf(math.fraction(1, 3))      // returns 'Fraction'
   *    math.typeOf(math.help('sqrt'))        // returns 'Help'
   *    math.typeOf(math.index(1, 3))         // returns 'Index'
   *    math.typeOf(math.matrix([[1],[3]]))   // returns 'DenseMatrix'
   *    math.typeOf(math.matrix([],'sparse')) // returns 'SparseMatrix'
   *    math.typeOf(new math.Range(0, 10))    // returns 'Range'
   *    math.typeOf(math.evaluate('a=2\na'))  // returns 'ResultSet'
   *    math.typeOf(math.parse('A[2]'))       // returns 'AccessorNode'
   *    math.typeOf(math.parse('[1,2,3]'))    // returns 'ArrayNode'
   *    math.typeOf(math.parse('x=2'))        // returns 'AssignmentNode'
   *    math.typeOf(math.parse('a=2; b=3'))   // returns 'BlockNode'
   *    math.typeOf(math.parse('x<0?-1:1'))   // returns 'ConditionalNode'
   *    math.typeOf(math.parse('2.3'))        // returns 'ConstantNode'
   *    math.typeOf(math.parse('f(x)=x^2'))   // returns 'FunctionAssignmentNode'
   *    math.typeOf(math.parse('sqrt(4)'))    // returns 'FunctionNode'
   *    math.typeOf(math.parse('A[2]').index) // returns 'IndexNode'
   *    math.typeOf(math.parse('{a:2}'))      // returns 'ObjectNode'
   *    math.typeOf(math.parse('(2+3)'))      // returns 'ParenthesisNode'
   *    math.typeOf(math.parse('1:10'))       // returns 'RangeNode'
   *    math.typeOf(math.parse('a<b<c'))      // returns 'RelationalNode'
   *    math.typeOf(math.parse('x'))          // returns 'SymbolNode'
   *
   * @param {*} x     The variable for which to test the type.
   * @return {string} Returns the name of the type. Primitive types are lower case,
   *                  non-primitive types are upper-camel-case.
   *                  For example 'number', 'string', 'Array', 'Date'.
   */
  return typed(name, {
    any: _typeOf
  })
})
