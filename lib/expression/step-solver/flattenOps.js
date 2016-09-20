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
      // TODO: add support for -
      if (node.op === "+" || node.op === "*" || node.op === "/") {
        let op = node.op;
        // Division is flattened in partner with multiplication
        if (op === "/") {
          op = "*";
        }
        const operands = getOperands(node, op);

        // If there's only one operand (possible if 2*x was flattened to 2x)
        // then it's no longer an operation, so we should replace the node
        // with the one operand.
        if (operands.length === 1) {
          node = operands[0];
        } else {
          operands.forEach((operand, i) => {
            operands[i] = flattenOps(operand);
          });
          // When we are dealing with flattening division, and there's also
          // multiplication involved, we might end up with a top level * instead.
          // e.g. 2*4/5 is parsed with / at the top, but in the end we want 2 * (4/5)
          // division nodes should never have division as the numerator or denominator
          if (node.op === "/" && operands.some(node => node.op && node.op === "/")) {
            node = NodeCreator.operator("*", operands)
          } else {
            node.args = operands;
          }
          // When we collect operands to flatten multiplication, the
          // multiplication of those operands should never be implicit
          if (node.op === "*") {
            node.implicit = false;
          }
        }
      }
      // If the op is not supported, just recurse on the children
      else {
        node.args.forEach((child, i) => {
          node.args[i] = flattenOps(child);
        });
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

// Recursively finds the operands under `op` in the input tree `node`.
// The input tree `node` will always have a parent that is an operation
// of type `op`.
// Op is a string e.g. "+" or "*"
// returns a list of all the nodes operated on by `op`
function getOperands(node, op) {
  // We can only recurse on operations of type op.
  // If the node is not an operator node or of the right operation type,
  // we can't break up or flatten this tree any further, so we return just
  // the current node, and check if we can flatten it.
  if (node.type !== 'OperatorNode') {
    return [flattenOps(node)];
  }
  switch (node.op) {
    // division is part of flattening multiplication
    case '*':
    case '/':
      if (op !== '*') {
        return [flattenOps(node)];
      }
      break;
    case '+':
      if (op !== '+') {
        return [flattenOps(node)];
      }
      break;
    default:
      return [flattenOps(node)];
  }

  // If we're flattening over *, check for a polynomial term (ie a
  // coefficient multiplied by a symbol such as 2x^2 or 3y)
  // This is true if there's an implicit multiplication and the right operand
  // is a symbol or a symbol to an exponent.
  if (op === '*' && isPolynomialTermMultiplication(node)) {
    return maybeFlattenPolynomialTerm(node);
  }
  else if (op === "*" && node.op === '/') {
    return flattenDivision(node);
  }
  else {
    let operands = [];
    node.args.forEach((child) => {
      // This will make an array of arrays
      operands.push(getOperands(child, op));
    });
    return [].concat.apply([], operands);
  }
}

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

// Takes a node that might represent a multiplication with a polynomial term
// and flattens it appropriately so the coefficient and symbol are grouped together.
// Returns a new list of operands from this node that should be multiplied together
function maybeFlattenPolynomialTerm(node) {
  // We recurse on the left side of the tree to find operands so far
  let operands = getOperands(node.args[0], "*");
  // If the last operand (so far) under * was a constant, then it's a
  // polynomial term.
  // e.g. 2*5*6x creates a tree where the top node is implicit multiplcation
  // and the left branch goes to the tree with 2*5*6, and the right operand
  // is the symbol x. We want to check that the last argument on the left (in
  // this example 6) is a constant.
  const lastOperand = operands.pop();
  // in the example, this would be the symbol x
  const nextOperand = flattenOps(node.args[1]);
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
}

// Takes a divsion node and returns a list of operands.
// If there is multiplication in the numerator, the operands returned
// are to be multiplied together. Otherwise, a list of length one with
// just the division node is returned. getOperands might change the
// operator accordingly.
function flattenDivision(node) {
  // We recurse on the left side of the tree to find operands so far
  // Flattening division is always considered part of a bigger picture
  // of multiplication, so we get operands with '*'
  let operands = getOperands(node.args[0], "*");
  // This is the term we'll want to add our division to
  const lastOperand = operands.pop();
  // This is the denominator of the current division node we're recursing on
  const nextOperand = flattenOps(node.args[1]);
  // if the last term before the '/' was also division, we can move the denominator
  // into the previous division's denominator.
  // e.g. 2/3 / 4 --> 2/(3*4)
  let numerator = lastOperand;
  let denominator = nextOperand;
  if (lastOperand.type === "OperatorNode" && lastOperand.op === '/') {
    numerator = lastOperand.args[0];
    // flattenOps makes sure that if there was already * on the old
    // denominator, it stays flat
    denominator = flattenOps(
      NodeCreator.operator('*', [lastOperand.args[1], nextOperand])); // TODO: this should really be a step, so I should be returning a hasChanged flag throughout here now (I will wait until the pure recursion refactor which should make this easier)
  }

  const division_node = NodeCreator.operator('/', [numerator, denominator]);
  operands.push(division_node);
  return operands;
}

module.exports = flattenOps;
