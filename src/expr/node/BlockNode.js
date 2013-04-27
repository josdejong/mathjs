/**
 * @constructor BlockNode
 * Holds a set with nodes
 * @extends {Node}
 */
function BlockNode() {
    this.params = [];
    this.visible = [];
}

BlockNode.prototype = new Node();

math.expr.node.BlockNode = BlockNode;

/**
 * Add a parameter
 * @param {Node} param
 * @param {Boolean} [visible]   true by default
 */
BlockNode.prototype.add = function (param, visible) {
    var index = this.params.length;
    this.params[index] = param;
    this.visible[index] = (visible != undefined) ? visible : true;
};

/**
 * Evaluate the set
 * @return {*[]} results
 * @override
 */
BlockNode.prototype.eval = function() {
    // evaluate the parameters
    var results = [];
    for (var i = 0, iMax = this.params.length; i < iMax; i++) {
        var result = this.params[i].eval();
        if (this.visible[i]) {
            results.push(result);
        }
    }

    return results;
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
BlockNode.prototype.toString = function() {
    var strings = [];

    for (var i = 0, iMax = this.params.length; i < iMax; i++) {
        if (this.visible[i]) {
            strings.push('\n  ' + this.params[i].toString());
        }
    }

    return '[' + strings.join(',') + '\n]';
};
