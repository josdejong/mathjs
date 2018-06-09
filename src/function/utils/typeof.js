'use strict';

function factory (type, config, load, typed) {
  /**
   * Determine the type of a variable.
   *
   * Function `typeof` recognizes the following types of objects:
   *
   * Object                 | Returns       | Example
   * ---------------------- | ------------- | ------------------------------------------
   * null                   | `'null'`      | `math.typeof(null)`
   * number                 | `'number'`    | `math.typeof(3.5)`
   * boolean                | `'boolean'`   | `math.typeof(true)`
   * string                 | `'string'`    | `math.typeof('hello world')`
   * Array                  | `'Array'`     | `math.typeof([1, 2, 3])`
   * Date                   | `'Date'`      | `math.typeof(new Date())`
   * Function               | `'Function'`  | `math.typeof(function () {})`
   * Object                 | `'Object'`    | `math.typeof({a: 2, b: 3})`
   * RegExp                 | `'RegExp'`    | `math.typeof(/a regexp/)`
   * undefined              | `'undefined'` | `math.typeof(undefined)`
   * math.type.BigNumber    | `'BigNumber'` | `math.typeof(math.bignumber('2.3e500'))`
   * math.type.Chain        | `'Chain'`     | `math.typeof(math.chain(2))`
   * math.type.Complex      | `'Complex'`   | `math.typeof(math.complex(2, 3))`
   * math.type.Fraction     | `'Fraction'`  | `math.typeof(math.fraction(1, 3))`
   * math.type.Help         | `'Help'`      | `math.typeof(math.help('sqrt'))`
   * math.type.Help         | `'Help'`      | `math.typeof(math.help('sqrt'))`
   * math.type.Index        | `'Index'`     | `math.typeof(math.index(1, 3))`
   * math.type.Matrix       | `'Matrix'`    | `math.typeof(math.matrix([[1,2], [3, 4]]))`
   * math.type.Range        | `'Range'`     | `math.typeof(math.range(0, 10))`
   * math.type.ResultSet    | `'ResultSet'` | `math.typeof(math.eval('a=2\nb=3'))`
   * math.type.Unit         | `'Unit'`      | `math.typeof(math.unit('45 deg'))`
   * math.expression.node.AccessorNode            | `'AccessorNode'`            | `math.typeof(math.parse('A[2]'))`
   * math.expression.node.ArrayNode               | `'ArrayNode'`               | `math.typeof(math.parse('[1,2,3]'))`
   * math.expression.node.AssignmentNode          | `'AssignmentNode'`          | `math.typeof(math.parse('x=2'))`
   * math.expression.node.BlockNode               | `'BlockNode'`               | `math.typeof(math.parse('a=2; b=3'))`
   * math.expression.node.ConditionalNode         | `'ConditionalNode'`         | `math.typeof(math.parse('x<0 ? -x : x'))`
   * math.expression.node.ConstantNode            | `'ConstantNode'`            | `math.typeof(math.parse('2.3'))`
   * math.expression.node.FunctionAssignmentNode  | `'FunctionAssignmentNode'`  | `math.typeof(math.parse('f(x)=x^2'))`
   * math.expression.node.FunctionNode            | `'FunctionNode'`            | `math.typeof(math.parse('sqrt(4)'))`
   * math.expression.node.IndexNode               | `'IndexNode'`               | `math.typeof(math.parse('A[2]').index)`
   * math.expression.node.ObjectNode              | `'ObjectNode'`              | `math.typeof(math.parse('{a:2}'))`
   * math.expression.node.ParenthesisNode         | `'ParenthesisNode'`         | `math.typeof(math.parse('(2+3)'))`
   * math.expression.node.RangeNode               | `'RangeNode'`               | `math.typeof(math.parse('1:10'))`
   * math.expression.node.SymbolNode              | `'SymbolNode'`              | `math.typeof(math.parse('x'))`
   *
   * Syntax:
   *
   *    math.typeof(x)
   *
   * Examples:
   *
   *    math.typeof(3.5);                     // returns 'number'
   *    math.typeof(math.complex('2-4i'));    // returns 'Complex'
   *    math.typeof(math.unit('45 deg'));     // returns 'Unit'
   *    math.typeof('hello world');           // returns 'string'
   *
   * @param {*} x     The variable for which to test the type.
   * @return {string} Returns the name of the type. Primitive types are lower case,
   *                  non-primitive types are upper-camel-case.
   *                  For example 'number', 'string', 'Array', 'Date'.
   */
  var _typeof = typed('_typeof', {
    'any': function (x) {
      var t = typeof x;

      if (t === 'object') {
        // JavaScript types
        if (x === null)           return 'null';
        if (Array.isArray(x))     return 'Array';
        if (x instanceof Date)    return 'Date';
        if (x instanceof RegExp)  return 'RegExp';
        if (x instanceof Boolean) return 'boolean';
        if (x instanceof Number)  return 'number';
        if (x instanceof String)  return 'string';

        // math.js types
        if (type.isBigNumber(x)) return 'BigNumber';
        if (type.isComplex(x))   return 'Complex';
        if (type.isFraction(x))  return 'Fraction';
        if (type.isMatrix(x))    return 'Matrix';
        if (type.isUnit(x))      return 'Unit';
        if (type.isIndex(x))     return 'Index';
        if (type.isRange(x))     return 'Range';
        if (type.isResultSet(x)) return 'ResultSet';
        if (type.isNode(x))      return x.type;
        if (type.isChain(x))     return 'Chain';
        if (type.isHelp(x))      return 'Help';

        return 'Object';
      }

      if (t === 'function') return 'Function';

      return t; // can be 'string', 'number', 'boolean', ...
    }
  });

  _typeof.toTex = undefined; // use default template

  return _typeof;
}

exports.name = 'typeof';
exports.factory = factory;
