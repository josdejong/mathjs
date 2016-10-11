'use strict'

const math = require('../../../index');

const MathChangeTypes = require('./MathChangeTypes');
const NodeCreator = require('./NodeCreator');
const NodeStatus = require('./NodeStatus');
const NodeType = require('./NodeType');

// Note: division is represented in mathjs as an operator node with op '/'
// and two args, where arg[0] is the numerator and arg[1] is the denominator

// This module manipulates fractions.

class Fraction {};

// Returns true if `node` is a fraction of constant values
Fraction.isConstantFraction = function(node) {
  if (!NodeType.isOperator(node) || node.op !== '/') {
    return false;
  }
  return (NodeType.isConstant(node.args[0]) &&
        NodeType.isConstant(node.args[1]));
}

// If `node` is a sum of constant fractions, either finds the LCD and sets
// up all the denominators to equal the LCD, or adds the fractions together
// if they all have the same denominator.
// e.g. 2/3 + 4/6 --> (2*2)/(3*2) + 4/6
// e.g. 2/5 + 4/5 --> (2+4)/5
// returns a NodeStatus object.
Fraction.addConstantFractions = function(node) {
  if (!NodeType.isOperator(node) || node.op !== '+') {
    return new NodeStatus(node);
  }
  if (!node.args.every(Fraction.isConstantFraction)) {
    return new NodeStatus(node);
  }
  const numerators = node.args.map(fraction => {
    return parseFloat(fraction.args[0].value);
  });
  const denominators = node.args.map(fraction => {
    return parseFloat(fraction.args[1].value);
  });
  // If they all have the same denominator, we can add them together
  if (denominators.every(denominator => denominator === denominators[0])) {
    const newNode = addFractionsWithSameDenominator(node.args);
    return new NodeStatus(newNode, true, MathChangeTypes.ADD_FRACTIONS);
  }
  // Otherwise, this step is creating the common denominator
  else {
    const newNode = makeCommonDenominator(node);
    return new NodeStatus(newNode, true, MathChangeTypes.COMMON_DENOMINATOR);
  }
}

// If `node` is a product of constant numbers and fractions of constant
// numbers, multiplies them together.
// e.g. 3 * 1/5 * 5/9 = (3*1*5)/(5*9)
// TODO: add a step somewhere to remove common terms in numerator and
// denominator (so the 5s would cancel out on the next step after this)
// Returns a NodeStatus object.
Fraction.multiplyConstantsAndFractions = function(node) {
  if (!NodeType.isOperator(node) || node.op !== '*') {
    return new NodeStatus(node);
  }
  const argsAreConstantsAndFractions = node.args.every(arg => {
    return Fraction.isConstantFraction(arg) || NodeType.isConstant(arg);
  });
  const atLeastOneFraction = node.args.some(Fraction.isConstantFraction);
  if (!argsAreConstantsAndFractions || !atLeastOneFraction) {
    return new NodeStatus(node);
  }

  let numeratorArgs = [];
  let denominatorArgs = [];
  node.args.forEach(operand => {
    if (NodeType.isConstant(operand)) {
      numeratorArgs.push(operand);
    }
    else if (Fraction.isConstantFraction(operand)) {
      numeratorArgs.push(operand.args[0]);
      denominatorArgs.push(operand.args[1]);
    }
  });

  const newNumerator = NodeCreator.parenthesis(
    NodeCreator.operator('*', numeratorArgs));
  const newDeominator = denominatorArgs.length == 1
    ? denominatorArgs[0]
    : NodeCreator.parenthesis(NodeCreator.operator('*', denominatorArgs));

  const newNode = NodeCreator.operator('/', [newNumerator, newDeominator]);
  return new NodeStatus(newNode, true, MathChangeTypes.MULTIPLY_FRACTIONS);
}

// Given a list of nodes `fractionNodes` that all have the same denominator,
// add them together. e.g. 2/3 + 5/3 -> (2+5)/3
// Returns the new node.
function addFractionsWithSameDenominator(fractionNodes) {
  const commonDenominator = fractionNodes[0].args[1];
  let numeratorArgs = [];
  fractionNodes.forEach(fraction => {
    numeratorArgs.push(fraction.args[0]);
  });
  const newNumerator = NodeCreator.parenthesis(
    NodeCreator.operator('+', numeratorArgs));
  return NodeCreator.operator('/', [newNumerator, commonDenominator]);
}

// Takes `node`, a sum of fractions, and returns a node that's a sum of
// fractions with denominators that evaluate to the same common denominator
// e.g. 2/6 + 1/4 -> (2*2)/(6*2) + (1*3)/(4*3)
// Returns the new node.
function makeCommonDenominator(node) {
  const denominators = node.args.map(fraction => {
    return parseFloat(fraction.args[1].value);
  });
  const commonDenominator = math.lcm(...denominators);

  node.args.forEach((child, i) => {
    // missingFactor is what we need to multiply the top and bottom by
    // so that the denominator is the LCD
    const missingFactor = commonDenominator / denominators[i];
    if (missingFactor !== 1) {
      const missingFactorNode = NodeCreator.constant(missingFactor);
      const newNumerator = NodeCreator.parenthesis(
        NodeCreator.operator('*', [child.args[0], missingFactorNode]));
      const newDeominator = NodeCreator.parenthesis(
        NodeCreator.operator('*', [child.args[1], missingFactorNode]));
      node.args[i] = NodeCreator.operator('/', [newNumerator, newDeominator]);
    }
  });
  return node;
}

module.exports = Fraction;
