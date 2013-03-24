/**
 * @constructor math.parser.node.MatrixNode
 * Holds an n-dimensional array with nodes
 * @param {Array} nodes
 * @extends {Node}
 */
function MatrixNode(nodes) {
    this.nodes = nodes || [];
}

MatrixNode.prototype = new Node();

math.parser.node.MatrixNode = MatrixNode;

(function () {
    /**
     * Evaluate the array
     * @return {Matrix} results
     * @override
     */
    MatrixNode.prototype.eval = function() {
        // recursively evaluate the nodes in the array
        return new Matrix(evalArray(this.nodes));
    };

    /**
     * Recursively evaluate an array with nodes
     * @param {Array} array
     * @returns {Array} results
     */
    function evalArray(array) {
        return array.map(function (child) {
            if (child instanceof Array) {
                // evaluate a nested array
                return evalArray(child);
            }
            else {
                // evaluate a node (end point)
                return child.eval();
            }
        })
    }

    /**
     * Get string representation
     * @return {String} str
     * @override
     */
    MatrixNode.prototype.toString = function() {
        return formatArray(this.nodes);
    };

    /**
     * Recursively evaluate an array with nodes
     * @param {Array} array
     * @returns {String} str
     */
    function formatArray(array) {
        if (array instanceof Array) {
            var str = '[';
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (i != 0) {
                    str += ', ';
                }
                str += formatArray(array[i]);
            }
            str += ']';
            return str;
        }
        else {
            return array.toString();
        }
    }

})();