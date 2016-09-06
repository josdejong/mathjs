const math = require('../../../index');
const MathResolveChecks = require('./MathResolveChecks');
const NodeCreator = require('./NodeCreator');

// Flattens the tree accross the same operation (just + and * for now)
// e.g. 2+2+2 is parsed by mathjs as 2+(2+2), but this would change that to
// 2+2+2, ie one + node that has three children.
// Input: an expression tree
// Ouptput: the expression tree updated with flattened operations
function flattenOps(node) {
  // TODO add support for function nodes like sqrt(x)
  switch (node.type) {
    case 'ConstantNode': // This is the base case
    case 'SymbolNode':
      break;
    case 'OperatorNode':
      // TODO: add support for - and /
      if (node.op === "+" || node.op === "*") {
        const operands = getOperands(node.op, node);
        // If there's only one operand (possible if 2*x was flattened to 2x)
        // then it's no longer an operation, so we should replace the node
        // with the one operand.
        if (operands.length === 1) {
          node = operands[0];
        } else {
          operands.forEach((operand, i) => {
            operands[i] = flattenOps(operand);
          });
          node.args = operands;
          // When we collect operands to flatten multiplication, the
          // multiplication of those operands should never be implicit
          if (node.op === "*") {
            node.implicit = false;
          }
        }
      }
      break;
    case 'ParenthesisNode':
      node.content = flattenOps(node.content);
      break;
    default:
      throw Error("Unsupported node type: " + node.type);
  }
  return node;
}

/* * * * Helper functions for flattenOps * * * * */

// Return true iff node is a candidate for simplifying to a polynomial
// term. This function is a helper function for getOperands.
// Context: Usually we'd flatten 2*2*x to a multiplication node with 3 children
// (2, 2, and x) but if we got 2*2x, we want to keep 2x together.
// 2*2*x (a tree stored in two levels because initially nodes only have two
// children) in the flattening process should be turned into 2*2x instead of
// 2*2*x (which has three children).
// So this function would return true for the input 2*2x, if it was stored as
// an expression tree with root node implicit * and children 2*2 and x
function isPolynomialTermMultiplication(node) {
  // This concept only applies when we're flattening multiplication operations
  if (node.op !== "*") {
    return false;
  }
  // We can tell that input was entered without a multiplication * with the
  // implicit parameter. 2x is implicit, 2*x is not. We will only make a
  // polynomial term if the multiplication is implicit.
  if (!node.implicit) {
    return false;
  }
  // This only makes sense when we're flattening two arguments
  if (node.args.length !== 2) {
    return false;
  }
  // The second node should be for the form x or x^2 (ie a polynomial term
  // with no coefficient)
  let secondOperand = node.args[1];
  if (secondOperand.type === 'SymbolNode') {
    return true;
  }
  if (secondOperand.type === 'OperatorNode') {
    return secondOperand.op === "^" && MathResolveChecks.resolvesToConstant(
      secondOperand.args[1]);
  }
  return false;
}

// Recursively finds the operands under `op` in the input tree `node`.
// The input tree `node` will always have a parent that is an operation
// of type `op`.
// Op is a string e.g. "+" or "*"
// returns a list of all the nodes operated on by `op`
function getOperands(op, node) {
  // We can only recurse on operations of type op.
  // If the node is not an operator node or of the right operation type,
  // we can't break up or flatten this tree any further, so we return just
  // the current node.
  if (node.type !== 'OperatorNode' || node.op !== op) {
    return [node];
  }

  // If we're flattening over *, check for a polynomial term (ie a
  // coefficient multiplied by a symbol such as 2x^2 or 3y)
  // This is true if there's an implicit multiplication and the right operand
  // is a symbol or a symbol to an exponent.
  if (isPolynomialTermMultiplication(node)) {
    // We recurse on the left side of the tree to find operands so far
    let operands = getOperands(op, node.args[0]);
    // If the last operand (so far) under * was a constant, then it's a
    // polynomial term.
    // e.g. 2*5*6x creates a tree where the top node is implicit multiplcation
    // and the left branch goes to the tree with 2*5*6, and the right operand
    // is the symbol x. We want to check that the last argument on the left (in
    // this example 6) is a constant.
    const lastOperand = operands.pop();
    // in the example, this would be the symbol x
    const nextOperand = node.args[1];
    if (lastOperand.type === 'ConstantNode') {
      // we replace the constant (which we popped) with constant*symbol
      operands.push(NodeCreator.operator('*',
        [lastOperand, nextOperand],
        /*mark as implicit*/true));
      return operands;
    }
    // Now we know it isn't a polynomial term
    else {
      operands.push(lastOperand);
      operands.push(nextOperand);
      return operands;
    }
  } else {
    let operands = [];
    node.args.forEach((child) => {
      // This will make an array of arrays
      operands.push(getOperands(op, child));
    });
    return [].concat.apply([], operands);
  }
}


module.exports = flattenOps;
