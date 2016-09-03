"use strict"

const math = require('../../../index');

// For storing polynomial terms and performing operations on them.
// Has a name, an exponent, and a coefficient. Note that this doesn't include
// constants.
class PolynomialTerm {
  constructor(node) {
    if (!PolynomialTerm.isPolynomialTerm(node)) {
     throw Error("PolynomialTerm constructor called with a node that is not" +
                 " a polynomial term.");
    }
    switch (node.type) {
      case 'OperatorNode':
        if (node.op === "^") {
          this.name = node.args[0].name;
          this.exp = parseInt(node.args[1].value);
          this.coeff = 1;
        } else { // it's "*" ie it has a coefficient
          this.coeff = parseInt(node.args[0].value);
          if (node.args[1].type === 'SymbolNode') {
              this.name = node.args[1].name;
              this.exp = 1;
          } else { // it's a "^" node
            this.name = node.args[1].args[0].name;
            this.exp = parseInt(node.args[1].args[1].value);
          }
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
                node.args[1].type === 'ConstantNode');
      }
      // NOTE: this means that x^2*2 won't be a polynomial term.
      // TODO: make sure the order is rearranged in an earlier step first.
      if (node.op === "*") {
        return (allowCoeff &&
                node.args[0].type === 'ConstantNode' &&
                PolynomialTerm.isPolynomialTerm(node.args[1]));
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
  return false;
}

PolynomialTerm.canCombinePolynomialTerms = function(expr) {
	return ((expr.op === "+" && canAddPolynomialNodes(expr.args)) ||
				  (expr.op === "*" && canMultiplyLikeTermPolynomialNodes(expr.args)));
}

PolynomialTerm.combinePolynomialTerms = function(nodeContext, expr, rootNodeObj) {
	if (!PolynomialTerm.canCombinePolynomialTerms) {
		throw Error ("can't combine polynomial terms");
	}
  if (expr.op === "+") {
    nodeContext.replaceNode(addPolynomialNodes(expr.args), rootNodeObj);
    rootNodeObj.rule = "added polynomial terms";
  }
  else if (expr.op === "*") {
    nodeContext.replaceNode(multiplyLikePolynomialNodes(expr.args), rootNodeObj);
    rootNodeObj.rule = "multiplied polynomial terms";
  }
  else throw Error("can't support " + expr.op + " to combine these terms");
  rootNodeObj.hasChanged = true;
  return rootNodeObj;
}

// Returns true if the nodes are like terms and can be multiplied together.
function canMultiplyLikeTermPolynomialNodes(nodes) {
  if (!nodes.every(n => PolynomialTerm.isPolynomialTerm(n))) {
    return false;
  }

  if (nodes.length === 1) {
    return false;
  }
  const first = new PolynomialTerm(nodes[0]);
  const rest = nodes.slice(1).map(n => new PolynomialTerm(n));
  return rest.every(n => first.name === n.name);
}

// Returns true if the nodes are polynomial terms that can be added together
function canAddPolynomialNodes(nodes) {
  if (!nodes.every(n => PolynomialTerm.isPolynomialTerm(n))) {
    return false;
  }

  if (nodes.length === 1) {
    return false;
  }
  const first = new PolynomialTerm(nodes[0]);
  const rest = nodes.slice(1).map(n => new PolynomialTerm(n));
  return rest.every(n => first.name === n.name && first.exp === n.exp);
}

// Adds a list of nodes that are polynomial terms. Returns a node.
function addPolynomialNodes(nodes) {
  if (!canAddPolynomialNodes(nodes)) {
    throw Error("Can't add two polynomial terms of different types");
  }

  const newCoefficient = nodes.map(n => {
    let p = new PolynomialTerm(n);
    return p.coeff;
  }).reduce((a,b) => a+b, 0);

  // use this to get the exponent and name they all share
  let first = new PolynomialTerm(nodes[0]);

  // no exponent
  if (first.exp === 1) {
    return new math.expression.node.OperatorNode("*", "multiply", [
      math.parse(newCoefficient), math.parse(first.name)
    ], true /* implicit, since it's a term */);
  }
  return new math.expression.node.OperatorNode("*", "multiply", [
    math.parse(newCoefficient), math.parse(
      first.name + "^" + first.exp.toString())
  ], true /* implicit, since it's a term */);
}

// multiplies a list of nodes that are polynomial like terms. Returns a node.
function multiplyLikePolynomialNodes(nodes) {
  if (!canMultiplyLikeTermPolynomialNodes(nodes)) {
    throw Error("Can't multiply like terms - terms are not alike");
  }

  const newCoefficient = nodes.map(n => {
    let p = new PolynomialTerm(n);
    return p.coeff;
  }).reduce((a,b) => a*b, 1);

  // use this to get the name they all share
  let first = new PolynomialTerm(nodes[0]);

  const newExponent = new math.expression.node.ParenthesisNode(
    new math.expression.node.OperatorNode(
      "+", "add", nodes.map(n => { // map exponents to constant nodes
        let p = new PolynomialTerm(n);
        return math.parse(p.exp);
      }
    )
  ));

  if (newCoefficient === 1) {
    return new math.expression.node.OperatorNode(
      "^", "pow", [math.parse(first.name), newExponent]);
  }
  return new math.expression.node.OperatorNode("*", "multiply", [
      math.parse(newCoefficient),
      new math.expression.node.OperatorNode(
        "^", "pow", [math.parse(first.name), newExponent]
    )], true /*implicit*/);
}

PolynomialTerm.canMultiplyConstantByPolynomial = function(expr) {
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

// Multiplies a constant node by a polynomial node and returns the result.
// The constant and polynomial
PolynomialTerm.multiplyConstantByPolynomialTerm = function(constNode, polyNode) {
  if (!PolynomialTerm.isPolynomialTerm(polyNode) || constNode.type !== 'ConstantNode') {
    throw Error('bad arguments');
  }
  // check if it already has a coefficient
  if (polyNode.type === 'OperatorNode' && polyNode.op === '*') {
    const newCoeff = new math.expression.node.ConstantNode(
      parseInt(polyNode.args[0].value) * parseInt(constNode.value));
    return new math.expression.node.OperatorNode("*", "multiply", [
          newCoeff, polyNode.args[1]], true /* implicit */);
  } else {
    return new math.expression.node.OperatorNode("*", "multiply", [
      constNode, polyNode], true /* implicit */);
  }
}

module.exports = PolynomialTerm;
