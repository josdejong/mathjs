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
 * @returns {function}
 */
exports.create = function create(type) {
  // TODO: typed-function must be able to silently ignore signatures with unknown data types

  // get a new instance of typed-function
  var typed = createTyped();

  // configure typed functions
  typed.types['Complex']      = function (x) { return x && x.isComplex };
  typed.types['Range']        = function (x) { return x && x.isRange };
  typed.types['Index']        = function (x) { return x && x.isIndex };
  typed.types['Matrix']       = function (x) { return x && x.isMatrix };
  typed.types['DenseMatrix']  = function (x) { return x && x.isDenseMatrix };
  typed.types['SparseMatrix'] = function (x) { return x && x.isSparseMatrix };
  typed.types['Unit']         = function (x) { return x && x.isUnit };
  typed.types['Help']         = function (x) { return x && x.isHelp };
  typed.types['ResultSet']    = function (x) { return x && x.isResultSet };
  typed.types['BigNumber']    = function (x) { return x && x.isBigNumber };
  typed.types['Fraction']     = function (x) { return x && x.isFraction };

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
    }, {
      from: 'Fraction',
      to: 'number',
      convert: function (x) {
        return x.valueOf();
      }
    }
  ];

  return typed;
};
