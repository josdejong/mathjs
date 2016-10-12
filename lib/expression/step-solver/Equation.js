'use strict';

// This represents an equation, made up of the leftNode (LHS), the rightNode (RHS)
// and a comparator (most often =)
class Equation {
  constructor(leftNode, rightNode, comparator) {
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.comparator = comparator;
  }
};

module.exports = Equation;
