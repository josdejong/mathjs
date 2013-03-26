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
 * Evaluate the constant
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
    return this.value ? math.format(this.value) : '';
};
