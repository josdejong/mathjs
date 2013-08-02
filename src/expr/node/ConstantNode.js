/**
 * @constructor ConstantNode
 * @param {*} value
 * @extends {Node}
 */
function ConstantNode(value) {
    this.value = value;
}

ConstantNode.prototype = new Node();

math.expr.node.ConstantNode = ConstantNode;

/**
 * Evaluate the constant (just return it)
 * @return {*} value
 */
ConstantNode.prototype.eval = function () {
    return this.value;
};

/**
 * Get string representation
 * @return {String} str
 */
ConstantNode.prototype.toString = function() {
    return math.format(this.value);
};
