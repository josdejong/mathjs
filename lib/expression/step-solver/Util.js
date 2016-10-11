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

// Simplifies a fraction with common factors, if possible.
// e.g. 2x/4 --> x/2    10x/5 --> 2x
// Also simplified negative signs
// e.g. -y/-3 --> y/3   4x/-5 --> -4x/5
// Note that -4/5 doesn't need to be simplified.
// Note that our goal is for the denominator to always be positive. If it
// isn't, we can simplify signs.
// Returns a NodeStatus object
Util.simplifyFraction = function(fraction) {
  if (!NodeType.isOperator(fraction) || fraction.op !== '/') {
    return new NodeStatus(fraction);
  }
  const numeratorValue = parseFloat(fraction.args[0].value);
  const denominatorValue = parseFloat(fraction.args[1].value);
  // Check that they're both integers
  if (!Number.isInteger(numeratorValue) ||
      !Number.isInteger(denominatorValue)) {
    return new NodeStatus(fraction);
  }

  // The gcd is what we're dividing the numerator and denominator by.
  let gcd = math.gcd(numeratorValue, denominatorValue);
  // A greatest common denominator is technically defined as always positive,
  // but since our goal is to reduce negative signs or move them to the
  // numerator, a negative denominator always means we want to flip signs
  // of both numerator and denominator.
  // e.g. -1/-3 --> 1/3   4/-5 --> -4/5
  if (denominatorValue < 0) {
    gcd *= -1;
  }

  if (gcd === 1) {
    return new NodeStatus(fraction);
  }

  const newNumeratorNode = NodeCreator.constant(numeratorValue/gcd);
  const newDenominatorNode = NodeCreator.constant(denominatorValue/gcd);
  let newFraction;
  if (parseFloat(newDenominatorNode.value) === 1) {
    newFraction = newNumeratorNode;
  }
  else {
    newFraction = NodeCreator.operator(
      '/', [newNumeratorNode, newDenominatorNode]);
  }

  return new NodeStatus(newFraction, true, MathChangeTypes.DIVIDE_POLY_TERM);
}

module.exports = Util;
