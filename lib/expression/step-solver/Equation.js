'use strict';

const math = require('../../../index');

const flatten = require('./flattenOperands.js');
const prettyPrintNode = require('./prettyPrint');

// This represents an equation, made up of the leftNode (LHS), the
// rightNode (RHS) and a comparator (=, <, >, <=, or >=)
class Equation {
  constructor(leftNode, rightNode, comparator) {
    this.leftNode = flatten(leftNode);
    this.rightNode = flatten(rightNode);
    this.comparator = comparator;
  }

  // Prints an Equation properly using the prettyPrint module
  prettyPrint(showPlusMinus=false) {
    let leftSide = prettyPrintNode(this.leftNode, showPlusMinus);
    let rightSide = prettyPrintNode(this.rightNode, showPlusMinus);
    return leftSide + ' ' + this.comparator + ' ' + rightSide;
  }
};

// Splits a string on the given comparator and returns a new Equation object
// from the left and right hand sides
Equation.createEquationFromString = function(str, comparator) {
  const sides = str.split(comparator);
  if (sides.length !== 2) {
    throw Error('Expected two sides of an equation using comparator: ' +
      comparator)
  }
  const leftNode = math.parse(sides[0]);
  const rightNode = math.parse(sides[1]);

  return new Equation(leftNode, rightNode, comparator);
}

module.exports = Equation;
