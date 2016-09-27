"use strict"

const math = require('../../../index');

const collectLikeTerms = require('./LikeTermCollector').collectLikeTermsDFS;
const flattenOperands = require('./flattenOperands');
const MathChangeTypes = require('./MathChangeTypes');
const NodeStatus = require('./NodeStatus');
const removeUnnecessaryParens = require('./removeUnnecessaryParens');
const simplifyDivision = require('./simplifyDivision');
const simplifyOperations = require('./simplifyOperations');
const Util = require('./Util');

// Returns a NodeStatus object with a possibly-updated expression tree
function step(node) {
  let nodeStatus;

  // start by removing unnecessary parens, but don't count it as a step
  node = removeUnnecessaryParens(node).node;

  // We assume from hereon out that the root node is an operator node with args
  // If this is not the case, return early so other stuff doesn't break.
  if (!node.args || node.type !== "OperatorNode") {
    return new NodeStatus(node);
  }

  // Start with flattening the tree so we can change it more easily
  node = flattenOperands(node);
  const simplificationFunctions = [
    // Simplify any division chains into a single division operation.
    simplifyDivision,
    // Try combining terms (e.g. 2+2->4 or 2x*6x->12x^2)
    simplifyOperations,
    // Then see if any like terms can be collected at the top level
    collectLikeTerms,
  ];

  for (let i = 0; i < simplificationFunctions.length; i++) {
    nodeStatus = simplificationFunctions[i](node);
    if (nodeStatus.hasChanged) {
      // Remove unnecessary parens before returning, in case one of the steps
      // results in more parens than needed.
      nodeStatus.node = removeUnnecessaryParens(nodeStatus.node).node;
      return nodeStatus;
    }
  }
  return new NodeStatus(node);
}

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

function stepThrough(node, debug=false) {
  if (debug) {
    console.log("\n\nSimplifying: " + Util.prettyPrint(node, true));
  }

  let nodeStatus;
  let iter = 1;
  let steps = [];

  // Before simplifying, check for any instances of + - that can be simplified
  // e.g. 2 + (-3) -> 2 - 3
  // changing this will count as a step, but we won't actually change the tree
  // (secretly to the user, before all steps we convert subtraction into adding
  //  unary minus)
  // To check this, first we have to remove uncessary parens.
  nodeStatus = removeUnnecessaryParens(node);

  // Then look for + -
  const exprString = Util.prettyPrint(nodeStatus.node, true);
  if (exprString.match(/\+ \-/g)) {
    let stepExplanation =  "Step " + iter + ": " + MathChangeTypes.RESOLVE_ADD_UNARY_MINUS;
    let exprString = Util.prettyPrint(nodeStatus.node);
    steps.push({
      "explanation": stepExplanation,
      "expression": exprString,
      "node": nodeStatus.node,
    });
    if (debug) {
          console.log("\n" + stepExplanation);
          console.log(exprString);
        }
    iter++;
  }

  // Now, step through the math expression until nothing changes
  nodeStatus = step(nodeStatus.node);
  while (nodeStatus.hasChanged) {
    let stepExplanation = "Step " + iter + ": " + nodeStatus.changeType;
    let exprString = Util.prettyPrint(nodeStatus.node);
    steps.push({
      "explanation": stepExplanation,
      "expression": exprString,
      "node": nodeStatus.node,
    });
    if (debug) {
      console.log("\n" + stepExplanation);
      console.log(exprString);
    }
    iter++;
    nodeStatus = step(nodeStatus.node);
  };

  if (debug) {
    console.log("\nDone\n\n");
  }
  return steps;
}

// Adds a new step to the array, given details of a change that just happened.
// Returns the new steps array.
function addStep(steps, iter, changeType, node, debug) {
  let stepExplanation = "Step " + iter + ": " + nchangeType;
  let exprString = Util.prettyPrint(node);
  steps.push({
    "explanation": stepExplanation,
    "expression": exprString,
    "node": node,
  });
  if (debug) {
    console.log("\n" + stepExplanation);
    console.log(exprString);
  }
  return steps;
}

module.exports = {
  step: step,
  simplify: simplify,
  stepThrough: stepThrough,
}
