var typedFunction = require('typed-function');
var digits = require('./../util/number').digits;

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
    { type: 'number',       test: function (x) { return typeof x === 'number' } },
    { type: 'Complex',      test: function (x) { return x && x.isComplex } },
    { type: 'BigNumber',    test: function (x) { return x && x.isBigNumber } },
    { type: 'Fraction',     test: function (x) { return x && x.isFraction } },
    { type: 'Unit',         test: function (x) { return x && x.isUnit } },
    { type: 'string',       test: function (x) { return typeof x === 'string' } },
    { type: 'Array',        test: Array.isArray },
    { type: 'Matrix',       test: function (x) { return x && x.isMatrix } },
    { type: 'DenseMatrix',  test: function (x) { return x && x.isDenseMatrix } },
    { type: 'SparseMatrix', test: function (x) { return x && x.isSparseMatrix } },
    { type: 'Range',        test: function (x) { return x && x.isRange } },
    { type: 'Index',        test: function (x) { return x && x.isIndex } },
    { type: 'boolean',      test: function (x) { return typeof x === 'boolean' } },
    { type: 'ResultSet',    test: function (x) { return x && x.isResultSet } },
    { type: 'Help',         test: function (x) { return x && x.isHelp } },
    { type: 'function',     test: function (x) { return typeof x === 'function'} },
    { type: 'Date',         test: function (x) { return x instanceof Date } },
    { type: 'RegExp',       test: function (x) { return x instanceof RegExp } },
    { type: 'Object',       test: function (x) { return typeof x === 'object' } },
    { type: 'null',         test: function (x) { return x === null } },
    { type: 'undefined',    test: function (x) { return x === undefined } }
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
      to: 'number',
      convert: function (x) {
        return x.valueOf();
      }
    }, {
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
      from: 'Array',
      to: 'Matrix',
      convert: function (array) {
        return new type.Matrix(array);
      }
    }
  ];

  return typed;
};
