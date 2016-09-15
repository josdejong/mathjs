"use strict"

const math = require('../../../index');
const MathResolveChecks = require('./MathResolveChecks');
const NodeCreator = require('./NodeCreator');
const MathChangeTypes = require('./MathChangeTypes');

// For storing polynomial terms and performing operations on them.
// Has a name, an exponent, and a coefficient. Note that this doesn't include
// constants.
class PolynomialTerm {
  constructor(node) {
    if (!PolynomialTerm.isPolynomialTerm(node)) {
     throw Error("PolynomialTerm constructor called with a node that is not" +
                 " a polynomial term.");
    }

    // defaults
    this.numeratorCoeff = 0;
    this.denominatorCoeff = 0;
    this.coeff = 1;
    this.exp = 1;

    switch (node.type) {
      case 'OperatorNode':
        if (node.op === "^") {
          this.name = node.args[0].name;
          this.exp = parseFloat(node.args[1].value);
      }
        // it's "*" ie it has a coefficient
        else if (node.op === "*") {
          this.coeff = parseFloat(node.args[0].value);
          if (node.args[1].type === 'SymbolNode') {
              this.name = node.args[1].name;
          } else if (node.args[1].op === "^") {
            this.name = node.args[1].args[0].name;
            this.exp = parseFloat(node.args[1].args[1].value);
          } else {
            throw Error("polynomial term is not a symbol or an exponent node");
          }
        }
        // this means there's a fraction coefficient
        else if (node.op === "/") {
          this.denominatorCoeff = parseFloat(node.args[1].value);
          const numerator = new PolynomialTerm(node.args[0]);
          this.exp = numerator.exp;
          this.name = numerator.name;
          this.numeratorCoeff = numerator.coeff;
          this.coeff = this.numeratorCoeff/this.denominatorCoeff;
        } else {
          throw Error("Unsupported operatation for polynomial term: " + node.op);
        }
        break;
      case 'SymbolNode':
        this.name = node.name;
        this.exp = 1;
        this.coeff = 1;
        break;
      default:
        throw Error("Unsupported node type: " + node.type);
    }
  }
}

// Returns if the node represents an expression that can be considered a
// term. e.g. x^2, 2y, z are all terms. 2+x, 3*7, x-z are all not terms.
// If allowCoeff is false, 2y or 2z^2 would now return false
PolynomialTerm.isPolynomialTerm = function(node, allowCoeff = true) {
  switch (node.type) {
    case 'OperatorNode':
      if (node.op === "^") {
        return (node.args[0].type === 'SymbolNode' &&
                MathResolveChecks.resolvesToConstant(node.args[1]));
      }
      // NOTE: this means that x^2*2 won't be a polynomial term.
      // TODO: make sure the order is rearranged in an earlier step first.
      if (node.op === "*") {
        return (allowCoeff &&
                node.args[0].type === 'ConstantNode' &&
                PolynomialTerm.isPolynomialTerm(node.args[1], false));
      }
      else if (node.op === "/") {
        return (allowCoeff &&
                node.args[1].type === "ConstantNode" &&
                PolynomialTerm.isPolynomialTerm(node.args[0]));
      }
      return false;
    case 'ParenthesisNode':
      return false;
    case 'ConstantNode':
      return false;
    case 'SymbolNode':
      return true;
    default:
      throw Error("Unsupported node type: " + node.type);
  }
}

// Returns true if it's possible to add or multiply like terms
PolynomialTerm.canCombinePolynomialTerms = function(expr) {
  return ((expr.op === "+" && canAddPolynomialNodes(expr.args)) ||
          (expr.op === "*" && canMultiplyLikeTermPolynomialNodes(expr.args)));
}

// Combines polynomial terms (+ and * supported only right now) and returns the
// updated root node object.
PolynomialTerm.combinePolynomialTerms = function(nodeContext, expr, rootNodeObj) {
  if (!PolynomialTerm.canCombinePolynomialTerms) {
    throw Error ("can't combine polynomial terms");
  }
  if (expr.op === "+") {
    nodeContext.replaceNode(addPolynomialNodes(expr.args), rootNodeObj);
    rootNodeObj.changeType = MathChangeTypes.ADD_POLYNOMIAL_TERMS;
  }
  else if (expr.op === "*") {
    nodeContext.replaceNode(multiplyLikePolynomialNodes(expr.args), rootNodeObj);
    rootNodeObj.changeType = MathChangeTypes.MULT_POLYNOMIAL_TERMS;
  }
  else throw Error("can't support " + expr.op + " to combine these terms");
  rootNodeObj.hasChanged = true;
  return rootNodeObj;
}

// Returns true if the nodes are like terms for multiplication
function canMultiplyLikeTermPolynomialNodes(nodes) {
  if (!nodes.every(n => PolynomialTerm.isPolynomialTerm(n))) {
    return false;
  }
  if (nodes.length === 1) {
    return false;
  }

  const firstTerm = new PolynomialTerm(nodes[0]);
  const restTerms = nodes.slice(1).map(n => new PolynomialTerm(n));
  // they're considered like terms if they have the same symbol name
  return restTerms.every(t => firstTerm.name === t.name);
}

// Returns true if the nodes are polynomial terms that can be added together
function canAddPolynomialNodes(nodes) {
  if (!nodes.every(n => PolynomialTerm.isPolynomialTerm(n))) {
    return false;
  }
  if (nodes.length === 1) {
    return false;
  }

  const firstTerm = new PolynomialTerm(nodes[0]);
  const restTerms = nodes.slice(1).map(n => new PolynomialTerm(n));
  // to add terms, they must have the same symbol name *and* exponent degree
  return restTerms.every(
    t => firstTerm.name === t.name && firstTerm.exp === t.exp);
}

// Adds a list of nodes that are polynomial terms. Returns a node.
function addPolynomialNodes(nodes) {
  if (!canAddPolynomialNodes(nodes)) {
    throw Error("Can't add two polynomial terms of different types");
  }

  // add up the coefficients
  const newCoefficient = nodes.map(n => {
    let p = new PolynomialTerm(n);
    return p.coeff;
  }).reduce((a,b) => a+b, 0);

  // use this to get the exponent and name they all share
  const firstTerm = new PolynomialTerm(nodes[0]);
  const exponent = firstTerm.exp;
  const name = firstTerm.name;

  // no exponent
  if (exponent === 1) {
    return NodeCreator.operator("*",
      [NodeCreator.constant(newCoefficient), math.parse(name)],
      true /* implicit, since it's a term */);
  } else {
    return NodeCreator.operator("*", [
      NodeCreator.constant(newCoefficient),
      math.parse(name + "^" + exponent.toString())
    ], true /* implicit, since it's a term */);
  }
}

// multiplies a list of nodes that are polynomial like terms. Returns a node.
function multiplyLikePolynomialNodes(nodes) {
  if (!canMultiplyLikeTermPolynomialNodes(nodes)) {
    throw Error("Can't multiply like terms - terms are not alike");
  }

  // multiply up the coefficients
  const newCoefficient = nodes.map(n => {
    let p = new PolynomialTerm(n);
    return p.coeff;
  }).reduce((a,b) => a*b, 1);

  // get the name they all share
  const termName = new PolynomialTerm(nodes[0]).name;

  // The new exponent will be a sum of exponents (an operation, wrapped in
  // parens)
  const newExponent = NodeCreator.parenthesis(NodeCreator.operator("+",
    nodes.map(n => { // map exponents to constant nodes
      let p = new PolynomialTerm(n);
      return math.parse(p.exp);
    })));

  // 1x^3 would just be stored as x^3
  if (newCoefficient === 1) {
    return NodeCreator.operator("^", [math.parse(termName), newExponent]);
  } else {
    return NodeCreator.operator("*", [
        NodeCreator.constant(newCoefficient),
        NodeCreator.operator("^", [math.parse(termName), newExponent])
      ], true /* implicit because it's a term */);
  }
}

// Returns true if the expression is a multiplication between a constant
// and polynomial.
PolynomialTerm.canMultiplyConstantByPolynomial = function(expr) {
  // implicit multiplication doesn't count as multiplication here, since it
  // represents a single term.
  if (expr.op !== '*' || expr.implicit) {
    return false;
  }
  if (expr.args.length !== 2) {
    return false;
  }
  return ((PolynomialTerm.isPolynomialTerm(expr.args[0]) &&
            expr.args[1].type === 'ConstantNode') ||
          (PolynomialTerm.isPolynomialTerm(expr.args[1]) &&
            expr.args[0].type === 'ConstantNode'));
}

// returns true if polyNode is a polynomial term with a coefficent
function polynomialTermHasCoefficient(polyNode) {
  return PolynomialTerm.isPolynomialTerm(polyNode) &&
    polyNode.type === 'OperatorNode' &&
    polyNode.op === '*';
}

// Multiplies a constant node by a polynomial node and returns the result.
PolynomialTerm.multiplyConstantByPolynomialTerm = function(constNode, polyNode) {
  if (!PolynomialTerm.isPolynomialTerm(polyNode) ||
      constNode.type !== 'ConstantNode') {
    throw Error('bad arguments');
  }
  // If it already has a coefficient, multiply that by the constant
  if (polynomialTermHasCoefficient(polyNode)) {
    const newCoeff = NodeCreator.constant(
      parseFloat(polyNode.args[0].value) * parseFloat(constNode.value));
    return NodeCreator.operator("*", [newCoeff, polyNode.args[1]],
      true /* implicit */);
  } else {
    return NodeCreator.operator("*", [constNode, polyNode], true /* implicit */);
  }
}

// Some polynomial terms have a fraction coefficient e.g. 2x/4
// This returns true if we can simplify that fraction.
// e.g. 2x/4 and 10x/5 return true, 4x/7 would return false
PolynomialTerm.canSimplifyPolynomialFraction = function(node) {
  if (!PolynomialTerm.isPolynomialTerm(node)) {
    return false;
  }
  const polyTerm = new PolynomialTerm(node);
  if (!(polyTerm.numeratorCoeff && polyTerm.denominatorCoeff)) {
    return false;
  }
  return math.gcd(polyTerm.numeratorCoeff, polyTerm.denominatorCoeff) !== 1;
}

// Simplifies a polynomial term with a fraction as its coefficients.
// e.g. 2x/4 --> x/2    10x/5 --> 2x
// returns the new simplified node
PolynomialTerm.simplifyPolynomialFraction = function(node) {
  if (!PolynomialTerm.canSimplifyPolynomialFraction(node)) {
    throw Error("can't simplify");
  }
  const polyTerm = new PolynomialTerm(node);
  const gcd = math.gcd(polyTerm.numeratorCoeff, polyTerm.denominatorCoeff);
  // the first operand of a division node (e.g. for 2x/4 the numeratorTerm is 2x)
  let numeratorTerm = node.args[0];
  // update the constant in the numerator term
  const newNumeratorCoeff = polyTerm.numeratorCoeff/gcd;
  if (newNumeratorCoeff === 1) {
    // The operands of this node are the coefficient and the rest of the term
    // This will get rid of the coefficient constant, since it's 1 now.
    numeratorTerm = numeratorTerm.args[1];
  } else {
    numeratorTerm.args[0] = NodeCreator.constant(newNumeratorCoeff);
  }

  const newDenominatorCoeff = polyTerm.denominatorCoeff/gcd;
  if (newDenominatorCoeff === 1) {
    return numeratorTerm;
  } else {
    return NodeCreator.operator('/', [
      numeratorTerm,
      NodeCreator.constant(newDenominatorCoeff)]);
  }
}

module.exports = PolynomialTerm;
