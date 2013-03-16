/**
 * @constructor math.parser.node.ArrayNode
 * Holds an n-dimensional array with nodes
 * @param {Array} nodes
 * @extends {Node}
 */
function ArrayNode(nodes) {
    this.nodes = nodes || [];
}

ArrayNode.prototype = new Node();

math.parser.node.ArrayNode = ArrayNode;

(function () {
    /**
     * Evaluate the array
     * @return {*[]} results
     * @override
     */
    ArrayNode.prototype.eval = function() {
        // recursively evaluate the nodes in the array
        return evalArray(this.nodes);
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
    ArrayNode.prototype.toString = function() {
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