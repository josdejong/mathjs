'use strict'

const math = require('../../../index');
const MathChangeTypes = require('./MathChangeTypes');

// This represents the current (sub)expression we're simplifying.
// As we move step by step, a node might be updated. Functions return this
// status object to pass on the updated node and information on if/how it was
// changed.
// NodeStatus(node) creates a NodeStatus object that signals no change
class NodeStatus {
  constructor(node, hasChanged=false, changeType=MathChangeTypes.NO_CHANGE) {
    this.node = node;
    this.hasChanged = hasChanged;
    this.changeType = changeType;
  }
}

module.exports = NodeStatus
