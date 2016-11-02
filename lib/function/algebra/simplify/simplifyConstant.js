'use strict';

function factory(type, config, load, typed, math) {
  var ConstantNode = math.expression.node.ConstantNode;
  var OperatorNode = math.expression.node.OperatorNode;

  function simplifyConstant(expr) {
    var res = foldFraction(expr);
    return res.isFraction ? _fractionToNode(res) : res;
  }

  function _canfold(args){
    for (var i=0, il=args.length; i < il; i++) {
      if (!args[i].isFraction) {
        return false;
      }
    }
    return true;
  }

  function _fractionToNode(f){
    var n = new ConstantNode(f.s*f.n);
    if (f.d === 1) {
      return n;
    }
    return new OperatorNode('/', 'divide', [n, new ConstantNode(f.d)]);
  }

  // destroys the original node and returns a folded one
  function foldFraction(node) {
    switch(node.type) {
      case 'SymbolNode':
        return node;
      case 'ConstantNode':
        return math.fraction(node.value);
      case 'FunctionNode':
        /* falls through */
      case 'OperatorNode':
        var fn = node.fn.toString();

        node.args = node.args.map(foldFraction);

        if (_canfold(node.args)) {
          try {
            // TODO check that function exists
            var res = math[fn].apply(null, node.args);
            if (res.isFraction) {
              return res;
            }
          } catch (error) {
            // ignore errors - it just means we can't fold this node
          }
        }

        // we can't fold any higher so change all remaining fractions back into nodes
        for (var i=0, il=node.args.length; i < il; i++) {
          if (node.args[i].isFraction) {
            node.args[i] = _fractionToNode(node.args[i]);
          }
        }
        return node;
      case 'ParenthesisNode':
        // remove the uneccessary parenthesis
        return foldFraction(node.content);
      case 'AccessorNode':
        /* falls through */
      case 'ArrayNode':
        /* falls through */
      case 'AssignmentNode':
        /* falls through */
      case 'BlockNode':
        /* falls through */
      case 'FunctionAssignmentNode':
        /* falls through */
      case 'IndexNode':
        /* falls through */
      case 'ObjectNode':
        /* falls through */
      case 'RangeNode':
        /* falls through */
      case 'UpdateNode':
        /* falls through */
      case 'ConditionalNode':
        /* falls through */
      default:
        throw 'Unimplemented node type in simplifyConstant: '+node.type;
    }
  }

  return simplifyConstant;
}

exports.math = true;
exports.name = 'constant';
exports.path = 'simplify';
exports.factory = factory;
