/**
 * @constructor MatrixNode
 * Holds an n-dimensional array with nodes
 * @param {Array} nodes
 * @extends {Node}
 */
function MatrixNode(nodes) {
    this.nodes = nodes || [];
}

MatrixNode.prototype = new Node();

math.expr.node.MatrixNode = MatrixNode;

(function () {
    /**
     * Evaluate the array
     * @return {Matrix} results
     * @override
     */
    MatrixNode.prototype.eval = function() {
        // recursively evaluate the nodes in the array, and merge the result
        var array = evalArray(this.nodes);
        if (containsMatrix(array)) {
            array = merge(array);
        }
        return new Matrix(array);
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
     * Merge nested Matrices in an Array.
     * @param {Array} array    Two-dimensional array containing Matrices
     * @return {Array} merged  The merged array (two-dimensional)
     */
    function merge (array) {
        var merged = [];
        var rows = array.length;
        for (var r = 0; r < rows; r++) {
            var row = array[r];
            var cols = row.length;
            var submatrix = null;
            for (var c = 0; c < cols; c++) {
                var entry = math.clone(row[c]);
                var size;
                if (entry instanceof Matrix || entry instanceof Range) {
                    size = entry.size();
                    entry = entry.valueOf();
                }
                else {
                    size = [1, 1];
                    entry = [[entry]];
                }

                // check the height of this row
                if (submatrix == null) {
                    // first entry
                    submatrix = entry;
                }
                else if (size[0] == submatrix.length) {
                    // merge
                    for (var i = 0; i < submatrix.length; i++) {
                        submatrix[i] = submatrix[i].concat(entry[i]);
                    }
                }
                else {
                    // no good
                    throw new Error('Dimension mismatch ' +
                        '(' + size[0] + ' != ' + submatrix.length + ')');
                }
            }

            // merge the submatrix
            if (merged[0] && merged[0][0] &&
                submatrix[0] && submatrix[0][0] &&
                merged[0][0].length != submatrix[0][0].length) {
                throw new Error('Dimension mismatch ' +
                    '(' + merged[0][0].length + ' != ' + submatrix[0][0].length + ')')
            }
            merged = merged.concat(submatrix);
        }

        return merged;
    }

    /**
     * Recursively test whether a multidimensional array contains at least one
     * Matrix or Range.
     * @param {Array} array
     * @return {Boolean} containsMatrix
     */
    function containsMatrix(array) {
        return array.some(function (child) {
            if (child instanceof Matrix || child instanceof Range) {
                return true;
            }
            else if (child instanceof Array) {
                return containsMatrix(child);
            }
            else {
                return false;
            }
        });
    }

    /**
     * Get string representation
     * @return {String} str
     * @override
     */
    MatrixNode.prototype.toString = function() {
        return util.formatArray(this.nodes);
    };
})();