const math = require('../../../index');
const MathResolveChecks = require('./MathResolveChecks');

// Return true iff node is maybe a candidate for simplifying to a polynomial
// term. This function is a helper function for expandOp.
// Context: Usually we'd flatten 2*2*x to a multiplication node with 3 children
// (2, 2, and x) but if we got 2*2x, we want to keep 2x together.
// (2*y*2)*x in the flattening process should be turned into (2*y*2x) instead of
// (2*y*2*x). So this function would return true for the input (2*y*2)*x.
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
  let second = node.args[1];
  if (second.type === 'SymbolNode') {
    return true;
  }
  if (second.type === 'OperatorNode') {
    return second.op === "^" && MathResolveChecks.resolvesToConstant(second.args[1]);
  }
  return false;
}

function expandOp(op, node) {
  if (node.type === 'OperatorNode' && node.op === op) {
    // If we're flattening over *, check for a polynomial term (ie a
    // coefficient multiplied by a symbol such as 2x^2 or 3y)
    if (isPolynomialTermMultiplication(node)) {
      let nodesUnderOp = expandOp(op, node.args[0]);
      // If the last node under * was a constant, then it's a polynomial term
      // e.g. 2*5*6x will have 2*5*6 on the left side with a constant (6) last
      const last = nodesUnderOp.pop();
      if (last.type === 'ConstantNode') {
        // we replace the constant (which we popped) with constant*symbol
        nodesUnderOp.push(new math.expression.node.OperatorNode(
          '*', 'multiply', [last, node.args[1]], /*mark as implicit*/true));
        return nodesUnderOp;
      } else {  // Now we know it isn't a polynomial term
        nodesUnderOp.push(last);
        nodesUnderOp.push(node.args[1]);
        return nodesUnderOp;
      }
    }

    let nodesUnderOp = [];
    node.args.forEach((child) => {
      // This will make an array of arrays
      nodesUnderOp.push(expandOp(op, child));
    });
    return [].concat.apply([], nodesUnderOp);
  }

  return [node];
}

// Flattens the tree accross the same operation (just + and * for now)
// e.g. 2+2+2 is parsed by mathjs as 2+(2+2), but this would change that to
// 2+2+2, ie one + node that has three children.
function flattenOps(node) {
  // TODO add support for function nodes like sqrt(x)
  switch (node.type) {
    case 'ConstantNode': // This is the base case
    case 'SymbolNode':
      break;
    case 'OperatorNode':
      let newChildren = [];
      // TODO: add -, and also add / if it makes sense
      if (node.op === "+" || node.op === "*") {
        const newArgs = expandOp(node.op, node);
        if (newArgs.length === 1) {
          node = newArgs[0];
        } else {
          // When collecting multiplication terms, individual args might be
          // implicit, but the top level multiplication of them should never be
          // left implicit.
          if (node.op === "*") {
            node.implicit = false;
          }
          node.args = newArgs;
          node.args.forEach((child, i) => {
            node.args[i] = flattenOps(child);
          });
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

module.exports = flattenOps;
