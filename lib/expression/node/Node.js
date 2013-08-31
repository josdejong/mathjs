/**
 * Node
 */
function Node() {}

/**
 * Evaluate the node
 * @return {*} result
 */
Node.prototype.eval = function () {
  throw new Error('Cannot evaluate a Node interface');
};

/**
 * Find any node in the node tree matching given filter. For example, to
 * find all nodes of type SymbolNode having name 'x':
 *
 *     var results = Node.find({
 *         type: SymbolNode,
 *         properties: {
 *             name: 'x'
 *         }
 *     });
 *
 * @param {Object} filter       Available parameters:
 *                                  {Function} type
 *                                  {Object<String, String>} properties
 * @return {Node[]} nodes       An array with nodes matching given filter criteria
 */
Node.prototype.find = function (filter) {
  return this.match(filter) ? [this] : [];
};

/**
 * Test if this object matches given filter
 * @param {Object} filter       Available parameters:
 *                              {Function} type
 *                              {Object<String, String>} properties
 * @return {Boolean} matches    True if there is a match
 */
Node.prototype.match = function (filter) {
  var match = true;

  if (filter) {
    if (filter.type && !(this instanceof filter.type)) {
      match = false;
    }
    if (match && filter.properties) {
      for (var prop in filter.properties) {
        if (filter.properties.hasOwnProperty(prop)) {
          if (this[prop] != filter.properties[prop]) {
            match = false;
            break;
          }
        }
      }
    }
  }

  return match;
};

/**
 * Get string representation
 * @return {String}
 */
Node.prototype.toString = function() {
  return '';
};

module.exports = Node;
