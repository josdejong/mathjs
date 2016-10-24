'use strict';

const math = require('../../../index');

const collectLikeTerms = require('./LikeTermCollector').collectLikeTermsDFS;
const distribute = require('./distribute');
const flattenOperands = require('./flattenOperands');
const hasUnsupportedNodes = require('./hasUnsupportedNodes');
const MathChangeTypes = require('./MathChangeTypes');
const NodeStatus = require('./NodeStatus');
const NodeType = require('./NodeType');
const prettyPrint = require('./prettyPrint');
const removeUnnecessaryParens = require('./removeUnnecessaryParens');
const simplifyDivision = require('./simplifyDivision');
const simplifyOperations = require('./simplifyOperations');

// Given a mathjs expression node, steps through simplifying the expression.
// Returns the simplified expression node.
function simplify(node, debug=false) {
  const steps = stepThrough(node, debug);
  if (steps.length > 0) {
    return steps.pop().node;
  }
  else {
    // this will do any necessary flattening/removing parens (which aren't
    // counted as a step)
    return step(node).node;
  }
}

// Given a mathjs expression node, steps through simplifying the expression.
// Returns a list of details about each step.
// If firstTime=false, then the simplification is part of a larger change
// and the node is probably flattened therefore we can't know for sure if
// +- was the actual user input and it will not be converted to -
function stepThrough(node, debug=false, firstTime=true) {
  if (debug) {
    console.log('\n\nSimplifying: ' + prettyPrint(node, false, true));
  }

  // TODO: support function nodes (and possibly other types too)
  if(hasUnsupportedNodes(node)) {
    return [];
  }

  let nodeStatus;
  let steps = [];

  // Before simplifying, check for any instances of + - that can be simplified
  // e.g. 2 + (-3) -> 2 - 3
  if (firstTime) {
    nodeStatus = plusMinusToMinus(node);
    if (nodeStatus.hasChanged) {
      steps = addStep(steps, nodeStatus, debug);
    }
    node = nodeStatus.node;
  }

  const originalExpressionStr = prettyPrint(node);
  const MAX_STEP_COUNT = 100;
  let iters = 0

  // Now, step through the math expression until nothing changes
  nodeStatus = step(node);
  while (nodeStatus.hasChanged) {
    steps = addStep(steps, nodeStatus, debug);
    nodeStatus = step(nodeStatus.node);
    if (iters++ === MAX_STEP_COUNT) {
      throw Error('Potential infinite loop for equation: ' +
                  originalExpressionStr);
    }
  }

  // Update the last step, in case we returned something simplified the last
  // time that didn't count as a step.
  if (steps.length > 0) {
    steps[steps.length - 1].asciimath = prettyPrint(nodeStatus.node);
    steps[steps.length - 1].latex = prettyPrint(nodeStatus.node, true);
    steps[steps.length - 1].node = nodeStatus.node;
  }

  return steps;
}

// Given a mathjs expression node, performs a single step to simplify the
// expression. Returns a NodeStatus object.
function step(node) {
  let nodeStatus;

  // Every simplification function assumes it receives a flattened node,
  // so always flatten first.
  node = flattenOperands(node);

  // Remove unnecessary parens, but don't count it as a step
  // TODO: count this as a change that isn't a step.
  node = removeUnnecessaryParens(node, true);

  // We assume from hereon out that the root node is an operator node with args
  // (or a unary minus)
  // If this is not the case, return early so other stuff doesn't break.
  if (!NodeType.isOperator(node) && !NodeType.isUnaryMinus(node)) {
    return new NodeStatus(node);
  }

  const simplificationFunctions = [
    // Simplify any division chains into a single division operation.
    simplifyDivision,
    // Try combining terms (e.g. 2+2->4 or 2x*6x->12x^2)
    simplifyOperations,
    // Then see if any like terms can be collected at the top level
    collectLikeTerms,
    // Try distributing into parentheses (e.g. 2x*(x+3) -> 2x*x + 2x*3)
    distribute,
  ];

  for (let i = 0; i < simplificationFunctions.length; i++) {
    nodeStatus = simplificationFunctions[i](node);
    // Always update node, since there might be changes that didn't count as
    // a step. Remove unnecessary parens, in case one a step results in more
    // parens than needed.
    node = removeUnnecessaryParens(nodeStatus.node, true);
    if (nodeStatus.hasChanged) {
      nodeStatus.node = node;
      return nodeStatus;
    }
  }
  return new NodeStatus(node);
}

// Adds a new step to the array, given details of a change that just happened.
// Returns the new steps array.
function addStep(steps, nodeStatus, debug) {
  let explanation = nodeStatus.changeType;
  let asciimath = prettyPrint(nodeStatus.node);
  let latex = prettyPrint(nodeStatus.node, true);

  steps.push({
    'explanation': explanation,
    'asciimath': asciimath,
    'latex': latex
  });
  if (debug) {
    console.log('\n' + explanation);
    console.log(asciimath);
  }
  return steps;
}

// Check for any instances of + - that can be simplified e.g. 2 + (-3) -> 2 - 3
// changing this will count as a step, but we won't actually change the tree
// (because secretly to the user, before all steps we convert subtraction into
// adding unary minus)
function plusMinusToMinus(node) {
  // First we have to remove uncessary parens.
  node = removeUnnecessaryParens(node, true);
  // Then look for + -
  const exprString = prettyPrint(node, true);
  if (exprString.match(/\+ \-/g)) {
    return new NodeStatus(node, true, MathChangeTypes.RESOLVE_ADD_UNARY_MINUS);
  }
  else {
    return new NodeStatus(node);
  }
}

module.exports = {
  step: step,
  simplify: simplify,
  stepThrough: stepThrough,
}
