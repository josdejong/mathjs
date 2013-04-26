/**
 * @constructor Constant
 * @param {*} value
 * @extends {Node}
 */
function Constant(value) {
    this.value = value;
}

Constant.prototype = new Node();

math.expr.node.Constant = Constant;

/**
 * Evaluate the constant (just return it)
 * @return {*} value
 */
Constant.prototype.eval = function () {
    return this.value;
};

/**
 * Get string representation
 * @return {String} str
 */
Constant.prototype.toString = function() {
    return math.format(this.value || null);
};
