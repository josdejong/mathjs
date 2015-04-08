var typed = require('typed-function');
var digits = require('./number').digits;

/**
 * Factory function for creating a new typed instance
 * @param {Object} math
 * @returns {function}
 */
exports.create = function create(math) {
  // TODO: must create a separate instance of typed, with custom config.
  // TODO: typed-function must be able to silently ignore signatures with unknown data types

  // configure typed functions
  typed.types['Complex']    = function (x) { return x instanceof math.type.Complex; };
  typed.types['Range']      = function (x) { return x instanceof math.type.Range; };
  typed.types['Index']      = function (x) { return x instanceof math.type.Index; };
  typed.types['Matrix']     = function (x) { return x instanceof math.type.Matrix; };
  typed.types['Unit']       = function (x) { return x instanceof math.type.Unit; };
  typed.types['Help']       = function (x) { return x instanceof math.type.Help; };
  typed.types['ResultSet']  = function (x) { return x instanceof math.type.ResultSet; };
  typed.types['BigNumber']  = function (x) { return x instanceof math.type.BigNumber; };
  typed.types['Vector']     = function (x) { return x instanceof math.type.Vector; };
  
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
        return new math.type.BigNumber(x);
      }
    }, {
      from: 'number',
      to: 'Complex',
      convert: function (x) {
        return new math.type.Complex(x, 0);
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
        return new math.type.Complex(x.toNumber(), 0);
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
        return new math.type.BigNumber(+x);
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
        return new math.type.BigNumber(0);
      }
    }, {
      from: 'Array',
      to: 'Matrix',
      convert: function (array) {
        return new math.type.Matrix(array);
      }
    }
  ];

  return typed;
};
