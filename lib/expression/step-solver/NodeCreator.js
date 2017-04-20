const math = require('../../../index');

const NodeCreator = {
  operator: function(op, args, implicit=false) {
    switch (op) {
      case '+':
        return new math.expression.node.OperatorNode('+', 'add', args);
      case '/':
        return new math.expression.node.OperatorNode('/', 'divide', args);
      case '*':
        return new math.expression.node.OperatorNode('*', 'multiply', args, implicit);
      case '^':
        return new math.expression.node.OperatorNode('^', 'pow', args);
      default:
        throw Error("Unsupported operation: " + op);
    }
  },

  constant: function(val) {
    return new math.expression.node.ConstantNode(val);
  },

  symbol: function(name) {
    return new math.expression.node.SymbolNode(name);
  },

  parenthesis: function(content) {
    return new math.expression.node.ParenthesisNode(content);
  }
}

module.exports = NodeCreator;
