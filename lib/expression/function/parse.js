'use strict';

function factory (type, config, load, typed) {
  var parse = load(require('../parse'));

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.eval();
   *
   * Syntax:
   *
   *     parse(expr)
   *     parse(expr, options)
   *     parse([expr1, expr2, expr3, ...])
   *     parse([expr1, expr2, expr3, ...], options)
   *
   * Example:
   *
   *     var node = parse('sqrt(3^2 + 4^2)');
   *     node.compile().eval(); // 5
   *
   *     var scope = {a:3, b:4}
   *     var node = parse('a * b'); // 12
   *     var code = node.compile();
   *     code.eval(scope); // 12
   *     scope.a = 5;
   *     code.eval(scope); // 20
   *
   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].compile().eval(); // 12
   *
   * See also:
   *
   *     eval, compile
   *
   * @param {string | string[] | Matrix} expr          Expression to be parsed
   * @param {{nodes: Object<string, Node>}} [options]  Available options:
   *                                                   - `nodes` a set of custom nodes
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  return typed('parse', {
    'string | Array | Matrix': parse,
    'string | Array | Matrix, Object': parse
  });
}

exports.name = 'parse';
exports.factory = factory;
