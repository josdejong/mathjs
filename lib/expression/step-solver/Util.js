'use strict';
/*
  Various utility functions used in the math stepper
 */
const math = require('../../../index');
const NodeType = require('./NodeType');
const NodeCreator = require('./NodeCreator');
const NodeStatus = require('./NodeStatus');
const MathChangeTypes = require('./MathChangeTypes');

const Util = {}

// Adds `value` to a list in `dict`, creating a new list if the key isn't in
// the dictionary yet. Returns the updated dictionary.
Util.appendToArrayInObject = function(dict, key, value) {
  if (dict[key]) {
    dict[key].push(value);
  }
  else {
    dict[key] = [value];
  }
  return dict;
}

// Returns if `node` is a constant node or a fraction of two constant nodes
// This is helpful for coefficients of polynomial terms
Util.isConstantOrConstantFraction = function(node) {
  if (NodeType.isConstant(node)) {
    return true;
  }
  else if (NodeType.isOperator(node) && node.op === '/') {
    return node.args.every(n => NodeType.isConstant(n));
  }
  else {
    return false;
  }
}

module.exports = Util;
