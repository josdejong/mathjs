"use strict"

const math = require('../../../index');
const collectLikeTermsDFS = require('./LikeTermCollector').collectLikeTermsDFS;
const flattenOps = require('./flattenOps');
const NodeStatus = require('./NodeStatus');
const removeUnnecessaryParens = require('./removeUnnecessaryParens');
const simplifyOperationsDFS = require('./simplifyOperations');

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

  const simplificationFunctions = [
    // Start with flattening the tree so we can change it more easily
    flattenOps,
    // First, try combining terms (e.g. 2+2->4 or 2x*6x->12x^2)
    simplifyOperationsDFS,
    // Then see if any like terms can be collected at the top level
    collectLikeTermsDFS,
  ];

  for (let i = 0; i < simplificationFunctions.length; i++) {
    nodeStatus = simplificationFunctions[i](node);
    if (nodeStatus.hasChanged) {
      return nodeStatus;
    }
    // We want to keep the tree flattening, even if it's not counted as a step
    else if (i === 0) {
      node = nodeStatus.node;
    }

  }

  return new NodeStatus(node);
}

// Given a mathjs expression node, steps through simplifying the expression.
// Returns the simplified expression node.
function simplify(node, debug=false) {
  if (debug) {
    console.log("\n\nSimplifying: " + prettyPrint(node));
  }

  let iter = 1;

  let nodeStatus = step(node);
  while(nodeStatus.hasChanged) {
    if (debug) {
      console.log("\nStep " + iter + ": " + nodeStatus.changeType);
      console.log(prettyPrint(nodeStatus.node));
    }
    iter++;
    nodeStatus = step(nodeStatus.node);
  };
  if (debug) {
    console.log("\nDone\n\n");
  }
  return nodeStatus.node;
}

// Prints an expression properly (hopefully mathjs will do this itself soon)
function prettyPrint(expr) {
  switch (expr.type) {
    case 'OperatorNode':
      let str = prettyPrint(expr.args[0]);
      for (let i = 1; i < expr.args.length; i++) {
        switch (expr.op) {
          case '+':
          case '-':
          case '/':
            str += ' ' + expr.op + ' ';
            break;
          case '*':
            if (!expr.implicit) {
              str += ' ' + expr.op + ' ';
            }
            break;
          case '^':
            str += expr.op;
        }

        str += prettyPrint(expr.args[i]);
      }
      return str;
    case 'ParenthesisNode':
      return "(" + prettyPrint(expr.content) + ")";
    case 'ConstantNode':
    case 'SymbolNode':
      return expr.toString();

  }
}

module.exports = {
  step: step,
  simplify: simplify,
  prettyPrint: prettyPrint,
}
