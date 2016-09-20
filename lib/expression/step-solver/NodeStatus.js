"use strict"

const math = require('../../../index');
const MathChangeTypes = require('./MathChangeTypes');

// This represents the current (sub)expression we're simplifying.
// As we move step by step, the node might be updated, and then
// the change fields will be updated.
class NodeStatus {
  constructor(node, hasChanged=false, changeType=MathChangeTypes.NO_CHANGE) {
    this.node = node;
    this.hasChanged = hasChanged;
    this.changeType = changeType;
  }
}

module.exports = NodeStatus
