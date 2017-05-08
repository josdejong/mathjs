var typedFunction = require('typed-function');
var digits = require('./../utils/number').digits;

// returns a new instance of typed-function
var createTyped = function () {
  // initially, return the original instance of typed-function
  // consecutively, return a new instance from typed.create.
  createTyped = typedFunction.create;
  return typedFunction;
};

/**
 * Factory function for creating a new typed instance
 * @param {Object} type   Object with data types like Complex and BigNumber
 * @returns {Function}
 */
exports.create = function create(type) {
  // TODO: typed-function must be able to silently ignore signatures with unknown data types

  // get a new instance of typed-function
  var typed = createTyped();

  // define all types. The order of the types determines in which order function
  // arguments are type-checked (so for performance it's important to put the
  // most used types first).
  typed.types = [
    { name: 'number',          test: function (x) { return typeof x === 'number' } },
    { name: 'Complex',         test: function (x) { return x && x.isComplex } },
    { name: 'BigNumber',       test: function (x) { return x && x.isBigNumber } },
    { name: 'Fraction',        test: function (x) { return x && x.isFraction } },
    { name: 'Unit',            test: function (x) { return x && x.isUnit } },
    { name: 'string',          test: function (x) { return typeof x === 'string' } },
    { name: 'Array',           test: Array.isArray },
    { name: 'Matrix',          test: function (x) { return x && x.isMatrix } },
    { name: 'DenseMatrix',     test: function (x) { return x && x.isDenseMatrix } },
    { name: 'SparseMatrix',    test: function (x) { return x && x.isSparseMatrix } },
    { name: 'Range',           test: function (x) { return x && x.isRange } },
    { name: 'Index',           test: function (x) { return x && x.isIndex } },
    { name: 'boolean',         test: function (x) { return typeof x === 'boolean' } },
    { name: 'ResultSet',       test: function (x) { return x && x.isResultSet } },
    { name: 'Help',            test: function (x) { return x && x.isHelp } },
    { name: 'function',        test: function (x) { return typeof x === 'function'} },
    { name: 'Date',            test: function (x) { return x instanceof Date } },
    { name: 'RegExp',          test: function (x) { return x instanceof RegExp } },
    { name: 'Object',          test: function (x) { return typeof x === 'object' } },
    { name: 'null',            test: function (x) { return x === null } },
    { name: 'undefined',       test: function (x) { return x === undefined } },
    
    { name: 'OperatorNode',    test: function (x) { return x && x.isOperatorNode } },
    { name: 'ConstantNode',    test: function (x) { return x && x.isConstantNode } },
    { name: 'SymbolNode',      test: function (x) { return x && x.isSymbolNode } },
    { name: 'ParenthesisNode', test: function (x) { return x && x.isParenthesisNode } },
    { name: 'FunctionNode',    test: function (x) { return x && x.isFunctionNode } },
    { name: 'FunctionAssignmentNode',    test: function (x) { return x && x.isFunctionAssignmentNode } },
    { name: 'ArrayNode',                 test: function (x) { return x && x.isArrayNode } },
    { name: 'AssignmentNode',            test: function (x) { return x && x.isAssignmentNode } },
    { name: 'BlockNode',                 test: function (x) { return x && x.isBlockNode } },
    { name: 'ConditionalNode',           test: function (x) { return x && x.isConditionalNode } },
    { name: 'IndexNode',                 test: function (x) { return x && x.isIndexNode } },
    { name: 'RangeNode',                 test: function (x) { return x && x.isRangeNode } },
    { name: 'UpdateNode',                test: function (x) { return x && x.isUpdateNode } },
    { name: 'Node',                      test: function (x) { return x && x.isNode } }
  ];

  // TODO: add conversion from BigNumber to number?
  typed.conversions = [
    {
      from: 'number',
      to: 'BigNumber',
      convert: function (x) {
        // note: conversion from number to BigNumber can fail if x has >15 digits
        if (digits(x) > 15) {
          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' +
          '(value: ' + x + '). ' +
          'Use function bignumber(x) to convert to BigNumber.');
        }
        return new type.BigNumber(x);
      }
    }, {
      from: 'number',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x, 0);
      }
    }, {
      from: 'number',
      to: 'string',
      convert: function (x) {
        return x + '';
      }
    }, {
      from: 'BigNumber',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x.toNumber(), 0);
      }
    }, {
      from: 'Fraction',
      to: 'BigNumber',
      convert: function (x) {
        throw new TypeError('Cannot implicitly convert a Fraction to BigNumber or vice versa. ' +
            'Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.');
      }
    }, {
      from: 'Fraction',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x.valueOf(), 0);
      }
    }, {
      from: 'number',
      to: 'Fraction',
      convert: function (x) {
        if (digits(x) > 15) {
          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to Fraction ' +
              '(value: ' + x + '). ' +
              'Use function fraction(x) to convert to Fraction.');
        }
        return new type.Fraction(x);
      }
    }, {
    // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
    //  from: 'Fraction',
    //  to: 'number',
    //  convert: function (x) {
    //    return x.valueOf();
    //  }
    //}, {
      from: 'string',
      to: 'number',
      convert: function (x) {
        var n = Number(x);
        if (isNaN(n)) {
          throw new Error('Cannot convert "' + x + '" to a number');
        }
        return n;
      }
    }, {
      from: 'string',
      to: 'BigNumber',
      convert: function (x) {
        try {
          return new type.BigNumber(x);
        }
        catch (err) {
          throw new Error('Cannot convert "' + x + '" to BigNumber');
        }
      }
    }, {
      from: 'string',
      to: 'Fraction',
      convert: function (x) {
        try {
          return new type.Fraction(x);
        }
        catch (err) {
          throw new Error('Cannot convert "' + x + '" to Fraction');
        }
      }
    }, {
      from: 'string',
      to: 'Complex',
      convert: function (x) {
        try {
          return new type.Complex(x);
        }
        catch (err) {
          throw new Error('Cannot convert "' + x + '" to Complex');
        }
      }
    }, {
      from: 'boolean',
      to: 'number',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'boolean',
      to: 'BigNumber',
      convert: function (x) {
        return new type.BigNumber(+x);
      }
    }, {
      from: 'boolean',
      to: 'Fraction',
      convert: function (x) {
        return new type.Fraction(+x);
      }
    }, {
      from: 'boolean',
      to: 'string',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'null',
      to: 'number',
      convert: function () {
        return 0;
      }
    }, {
      from: 'null',
      to: 'string',
      convert: function () {
        return 'null';
      }
    }, {
      from: 'null',
      to: 'BigNumber',
      convert: function () {
        return new type.BigNumber(0);
      }
    }, {
      from: 'null',
      to: 'Fraction',
      convert: function () {
        return new type.Fraction(0);
      }
    }, {
      from: 'Array',
      to: 'Matrix',
      convert: function (array) {
        // TODO: how to decide on the right type of matrix to create?
        return new type.DenseMatrix(array);
      }
    }, {
      from: 'Matrix',
      to: 'Array',
      convert: function (matrix) {
        return matrix.valueOf();
      }
    }
  ];

  return typed;
};
