'use strict';

const PolynomialTermNode = require('./PolynomialTermNode');
const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');

// Prints an expression node properly.
// If showPlusMinus is true, print + - (e.g. 2 + -3)
// If it's false (the default) 2 + -3 would print as 2 - 3
// This supports the conversion of subtraction to addition of negative terms,
// which is needed to flatten operands.
function prettyPrint(node, showPlusMinus=false) {
  let string = prettyPrintDFS(node);
  if (showPlusMinus) {
    return string;
  }
  else {
    return string.replace(/\+ \-/g, '- ');
  }
}

function prettyPrintDFS(node, space=true) {
  if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    // This is so we don't print 2/3 x^2 as 2 / 3x^2
    if (polyTerm.hasFractionCoeff()) {
      let str = '';
      str += prettyPrintDFS(polyTerm.coeffNode(), false);
      str += ' ';
      const nonCoeffPart = NodeCreator.polynomialTerm(
        polyTerm.symbol, polyTerm.exponent, null);
      str += prettyPrintDFS(nonCoeffPart);
      return str;
    }
    // if it doesn't have a fraction coefficient, print node as usual
  }

  if (NodeType.isOperator(node)) {
    let str = prettyPrintDFS(node.args[0]);
    for (let i = 1; i < node.args.length; i++) {
      switch (node.op) {
        case '+':
        case '-':
        case '/':
          if (space) {
            str += ' ' + node.op + ' ';
          }
          else {
            str += node.op;
          }
          break;
        case '*':
          if (!node.implicit) {
            str += ' ' + node.op + ' ';
          }
          break;
        case '^':
          str += node.op;
      }
      str += prettyPrintDFS(node.args[i]);
    }
    return str;
  }
  else if (NodeType.isParenthesis(node)) {
    return '(' + prettyPrintDFS(node.content) + ')';
  }
  else {
    return node.toString();
  }
}

module.exports = prettyPrint;
