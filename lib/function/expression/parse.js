module.exports = function (math, config) {
  var _parse = require('../../expression/parse');

  /**
   * Parse an expression.
   * Returns a node tree which can be compiled and evaluated.
   *
   * Syntax:
   *
   *     math.parse(expr)
   *     math.parse(expr, nodes)
   *     math.parse([expr1, expr2, expr3, ...])
   *     math.parse([expr1, expr2, expr3, ...], nodes)
   *
   * Example:
   *
   *     var node = math.parse('sqrt(3^2 + 4^2)');
   *     node.compile(math).eval(); // 5
   *
   *     var scope = {a: 3, b: 4}
   *     var node = math.parse('a * b'); // 12
   *     var code = node.compile(math);
   *     code.eval(scope); // 12
   *     scope.a = 5;
   *     code.eval(scope); // 20
   *
   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
   *     var scope2 = {};
   *     nodes.map(function(node) {
   *       return node.compile(math).eval(scope2);
   *     });  // returns [3, 4, 12]
   *
   * @param {String | String[] | Matrix} expr   Expression to be parsed
   * @param {Object<String, Node>} [nodes]      Optional custom nodes
   * @return {Node | Node[]} A node tree
   * @throws {Error}
   */
  math.parse = function parse (expr, nodes) {
    return _parse.apply(_parse, arguments);
  }

};
