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

  // Parens that wrap everything are redundant
  if (node.type === 'ParenthesisNode') {
    while (node.type === 'ParenthesisNode') {
      node = node.content;
    }
  }

  nodeStatus = removeUnnecessaryParens(node);
  if (nodeStatus.hasChanged) {
    return nodeStatus;
  }

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
      node = removeUnnecessaryParens(node).node;
      return nodeStatus;
    }
  }
  return new NodeStatus(node);
}

// Given a mathjs expression node, steps through simplifying the expression.
// Returns the simplified expression node.
function simplify(node, debug=false) {
  if (debug) {
    console.log("\n\nSimplifying: " + Util.prettyPrint(node, true));
  }

  let nodeStatus;
  let iter = 1;

  // Before simplifying, check for any instances of + - that can be simplified
  // e.g. 2 + (-3) -> 2 - 3
  // changing this will count as a step, but we won't actually change the tree
  // (secretly to the user, before all steps we convert subtraction into adding
  //  unary minus)
  // To check this, first we have to remove uncessary parens.
  nodeStatus = removeUnnecessaryParens(node);
  if (nodeStatus.hasChanged) {
    if (debug) {
      console.log("\nStep " + iter + ": " + nodeStatus.changeType);
      console.log(Util.prettyPrint(nodeStatus.node, true));
    }
    iter++;
  }
  // Then look for + -
  const exprString = Util.prettyPrint(nodeStatus.node, true);
  if (exprString.match(/\+ \-/g)) {
    if (debug) {
      console.log(
        "\nStep " + iter + ": " + MathChangeTypes.RESOLVE_ADD_UNARY_MINUS);
      console.log(Util.prettyPrint(nodeStatus.node));
    }
    iter++;
  }

  // Now, loop until nothing changes.
  nodeStatus = step(nodeStatus.node);
  while (nodeStatus.hasChanged) {
    if (debug) {
      console.log("\nStep " + iter + ": " + nodeStatus.changeType);
      console.log(Util.prettyPrint(nodeStatus.node));
    }
    iter++;
    nodeStatus = step(nodeStatus.node);
  };

  if (debug) {
    console.log("\nDone\n\n");
  }
  return nodeStatus.node;
}

module.exports = {
  step: step,
  simplify: simplify,
}
