'use strict';

const MathChangeTypes = require('./MathChangeTypes');

// This represents the current equation we're solving.
// As we move step by step, an equation might be updated. Functions return this
// status object to pass on the updated equation and information on if/how it was
// changed.
// EquationStatus(leftNode, rightNode, comparator) creates a EquationStatus
// object that signals no change
class EquationStatus {
  constructor(leftNode, rightNode, comparator, hasChanged=false, changeType=MathChangeTypes.NO_CHANGE) {
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.comparator = comparator;
    this.hasChanged = hasChanged;
    this.changeType = changeType;
  }
};

module.exports = EquationStatus;
