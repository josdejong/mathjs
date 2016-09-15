"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const NodeContext = require('./NodeContext');
const NodeCreator = require('./NodeCreator');
const MathChangeTypes = require('./MathChangeTypes');

// TEMPORARY (hopefully) because apparently operations can only be evaluated
// if they have two arguments?? :(
function manualEval(exp) {
  if (exp.type === 'ParenthesisNode') {
    exp = exp.content;
  }
  switch (exp.op) {
    case '*':
      return exp.args.map(x => parseFloat(x.value)).reduce(
        (prev, curr) => prev * curr);
    case '+':
      return exp.args.map(x => parseFloat(x.value)).reduce(
        (prev, curr) => prev + curr);
    // these operations should only be done with two arguments
    default:
      return exp.eval();
  }
}

function simplifyOperations(context, expr, rootNodeObj) {
  // Check if we can perform arithmetic on the operands
  if (expr.args.every(child => child.type === 'ConstantNode')) {
    context.replaceNode(math.parse(manualEval(expr)), rootNodeObj);
    rootNodeObj.hasChanged = true;
    rootNodeObj.changeType = MathChangeTypes.SIMPLIFY_ARITHMETIC;
    return rootNodeObj;
  }

  // If this is a * node and one of the operands is 1, get rid of the 1
  if (expr.op === "*") {
    const i = expr.args.findIndex(
      arg => arg.type === 'ConstantNode' && arg.value === "1");
    if (i >= 0) {
      // remove the 1 node
      expr.args.splice(i, 1);
      // if there's only one argument left, move it up the tree
      if (expr.args.length === 1) {
        expr = expr.args[0];
      }
      context.replaceNode(expr, rootNodeObj);
      rootNodeObj.hasChanged = true;
      rootNodeObj.changeType = MathChangeTypes.SIMPLIFY_ARITHMETIC;
      return rootNodeObj;
    }
  }

  if (PolynomialTerm.canCombinePolynomialTerms(expr)) {
    rootNodeObj = PolynomialTerm.combinePolynomialTerms(
      context, expr, rootNodeObj);
    return rootNodeObj;
  }

  // If we have a constant times a polynomial term we can multiply them
  // together e.g. y * 3 -> 3y
  if (PolynomialTerm.canMultiplyConstantByPolynomial(expr)) {
    if (expr.args[0].type === 'ConstantNode') {
      context.replaceNode(
        PolynomialTerm.multiplyConstantByPolynomialTerm(expr.args[0], expr.args[1]),
        rootNodeObj);
    } else {
      context.replaceNode(
        PolynomialTerm.multiplyConstantByPolynomialTerm(expr.args[1], expr.args[0]),
        rootNodeObj);
    }
    rootNodeObj.hasChanged = true;
    rootNodeObj.changeType = MathChangeTypes.MULT_POLY_BY_CONST;
    return rootNodeObj;
  }

  // Check if we can simplify division in a polynomial term e.g. 2x/4 -> x/2
  if (PolynomialTerm.canSimplifyPolynomialFraction(expr)) {
    context.replaceNode(
      PolynomialTerm.simplifyPolynomialFraction(expr),
      rootNodeObj);
    rootNodeObj.hasChanged = true;
    rootNodeObj.changeType = MathChangeTypes.DIVIDE_POLY_TERM;
    return rootNodeObj;
  }


  // Check for x^1 which should be reduced to x
  if (expr.op === "^" &&
      expr.args[0].type === 'SymbolNode' &&
      expr.args[1].type === 'ConstantNode' &&
      expr.args[1].value === "1") {
    context.replaceNode(expr.args[0], rootNodeObj);
    rootNodeObj.hasChanged = true;
    // Note: this is the only change type that gives insight into the exact
    // thing that changed instead of a general rule.
    // TODO: consider doing this for more of them.
    rootNodeObj.changeType = expr.args[0].name + "^1 -> " + expr.args[0].name;
    return rootNodeObj;
  }

  rootNodeObj.hasChanged = false;
  return rootNodeObj;
}

// If we can do a simplify step (e.g. adding two terms, performing some
// arithmetic). Always returns the updated expression tree and if it was
// updated.
function simplifyOperationsDFS(rootNodeObj) {
  // An array of expressions to check for reduction, starting with the root.
  let expressions = [NodeContext.makeRootNodeContext(rootNodeObj)];

  // Run DFS with iteration, so the search stops once something is reduced.
  while (expressions.length !== 0) {
    let current = expressions.shift();
    let expr = current.expr;
    switch (expr.type) {
        case 'ParenthesisNode':
          // The content has to have content that is an OperatorNode
          // (because of removeUncessaryParens)
          rootNodeObj = simplifyOperations(
            current, expr.content, rootNodeObj);
          if (rootNodeObj.hasChanged) {
            return rootNodeObj;
          }
          // since this is a DFS, children are put at the front of the queue
          expressions = current.getContextsForChildren().concat(expressions);
          break;
        case 'OperatorNode':
          rootNodeObj = simplifyOperations(current, expr, rootNodeObj);
          if (rootNodeObj.hasChanged) {
            return rootNodeObj;
          }
          // since this is a DFS, children are put at the front of the queue
          expressions = current.getContextsForChildren().concat(expressions);
          break;
        case 'SymbolNode':
        case 'ConstantNode':
          // we can't simplify this any further
          continue;
        default:
          throw Error("Unsupported node type: " + expr.type);
    }
  }

  rootNodeObj.hasChanged = false;
  return rootNodeObj;
}

module.exports = simplifyOperationsDFS;
