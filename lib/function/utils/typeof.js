'use strict';

module.exports = function (math) {
  var types = require('../../util/types'),

      Complex = require('../../type/Complex'),
      Matrix = math.type.Matrix,
      Unit = require('../../type/Unit'),
      Index = require('../../type/Index'),
      Range = require('../../type/Range'),
      Help = require('../../type/Help');

  /**
   * Determine the type of a variable.
   *
   * Function `typeof` recognizes the following types of objects:
   *
   * Object                 | Returns       | Example
   * ---------------------- | ------------- | ------------------------------------------
   * Array                  | `'array'`     | `math.typeof ([1, 2, 3])`
   * boolean                | `'boolean'`   | `math.typeof (true)`
   * Date                   | `'date'`      | `math.typeof (new Date())`
   * null                   | `'null'`      | `math.typeof(null)`
   * number                 | `'number'`    | `math.typeof(3.5)`
   * Object                 | `'object'`    | `math.typeof ({a: 2, b: 3})`
   * RegExp                 | `'regexp'`    | `math.typeof (/a regexp/)`
   * string                 | `'string'`    | `math.typeof ('hello world')`
   * undefined              | `'undefined'` | `math.typeof(undefined)`
   * math.chaining.Chain    | `'chain'`     | `math.typeof (math.chain(2))`
   * math.type.BigNumber    | `'bignumber'` | `math.typeof (math.bignumber('2.3e500'))`
   * math.type.Complex      | `'complex'`   | `math.typeof (math.complex(2, 3))`
   * math.type.Help         | `'help'`      | `math.typeof (math.help('sqrt'))`
   * math.type.Index        | `'index'`     | `math.typeof (math.index(1, 3))`
   * math.type.Matrix       | `'matrix'`    | `math.typeof (math.matrix([[1,2], [3, 4]]))`
   * math.type.Range        | `'range'`     | `math.typeof (math.range(0, 10))`
   * math.type.Unit         | `'unit'`      | `math.typeof (math.unit('45 deg'))`
   *
   * Syntax:
   *
   *    math.typeof(x)
   *
   * Examples:
   *
   *    math.typeof(3.5);                     // returns 'number'
   *    math.typeof(math.complex('2 - 4i'));  // returns 'complex'
   *    math.typeof(math.unit('45 deg'));     // returns 'unit'
   *    math.typeof('hello world');           // returns 'string'
   *
   * @param {*} x  The variable for which to test the type.
   * @return {String} Lower case type, for example 'number', 'string', 'array'.
   */
  math['typeof'] = function _typeof (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('typeof', arguments.length, 1);
    }

    // JavaScript types
    var type = types.type(x);

    // math.js types
    if (type === 'object') {
      if (x instanceof Complex) return 'complex';
      if (x instanceof Matrix) return 'matrix';
      if (x instanceof Unit) return 'unit';
      if (x instanceof Index) return 'index';
      if (x instanceof Range) return 'range';
      if (x instanceof Help) return 'help';

      // the following types are different instances per math.js instance
      if (x instanceof math.type.BigNumber) return 'bignumber';
      if (x instanceof math.chaining.Chain) return 'chain';
    }

    return type;
  };
};
