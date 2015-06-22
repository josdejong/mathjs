'use strict';

var types = require('../../util/types');

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
   * boolean                | `'boolean'`   | `math.typeof (true)`
   * string                 | `'string'`    | `math.typeof ('hello world')`
   * Array                  | `'Array'`     | `math.typeof ([1, 2, 3])`
   * Date                   | `'Date'`      | `math.typeof (new Date())`
   * Function               | `'Function'`  | `math.typeof (function () {})`
   * Object                 | `'Object'`    | `math.typeof ({a: 2, b: 3})`
   * RegExp                 | `'RegExp'`    | `math.typeof (/a regexp/)`
   * undefined              | `'undefined'` | `math.typeof(undefined)`
   * math.type.BigNumber    | `'BigNumber'` | `math.typeof (math.bignumber('2.3e500'))`
   * math.type.Chain        | `'Chain'`     | `math.typeof (math.chain(2))`
   * math.type.Complex      | `'Complex'`   | `math.typeof (math.complex(2, 3))`
   * math.type.Fraction     | `'Fraction'`  | `math.typeof (math.fraction(1, 3))`
   * math.type.Help         | `'Help'`      | `math.typeof (math.help('sqrt'))`
   * math.type.Index        | `'Index'`     | `math.typeof (math.index(1, 3))`
   * math.type.Matrix       | `'Matrix'`    | `math.typeof (math.matrix([[1,2], [3, 4]]))`
   * math.type.Range        | `'Range'`     | `math.typeof (math.range(0, 10))`
   * math.type.Unit         | `'Unit'`      | `math.typeof (math.unit('45 deg'))`
   *
   * Syntax:
   *
   *    math.typeof(x)
   *
   * Examples:
   *
   *    math.typeof(3.5);                     // returns 'number'
   *    math.typeof(math.complex('2 - 4i'));  // returns 'Complex'
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
      // JavaScript types
      var t = types.type(x);

      // math.js types
      if (t === 'Object') {
        if (x.isBigNumber === true) return 'BigNumber';
        if (x.isComplex === true)   return 'Complex';
        if (x.isFraction === true)  return 'Fraction';
        if (x.isMatrix === true)    return 'Matrix';
        if (x.isUnit === true)      return 'Unit';
        if (x.isIndex === true)     return 'Index';
        if (x.isRange === true)     return 'Range';
        if (x.isChain === true)     return 'Chain';
        if (x.isHelp === true)      return 'Help';
      }

      return t;
    }
  });

  _typeof.toTex = '\\mathrm{${name}}\\left(${args}\\right)';

  return _typeof;
}

exports.name = 'typeof';
exports.factory = factory;
