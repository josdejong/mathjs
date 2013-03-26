/**
 * Node
 */
function Node() {}

math.expr.node.Node = Node;

/**
 * Evaluate the node
 * @return {*} result
 */
Node.prototype.eval = function () {
    throw new Error('Cannot evaluate a Node interface');
};

/**
 * Get string representation
 * @return {String}
 */
Node.prototype.toString = function() {
    return '';
};
