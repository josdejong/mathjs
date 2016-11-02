/*
 * Flatten multiplication, addition, exponentiation
 */

var nameOpFunc = function(node){
  return node.isOperator ? node.fn || node.name;
}

var inverses = {
  'add': 'subtract',
  'multiply': 'divide',
  'pow': 'nthRoot'
}

function flatten(expr) {
  return expr.transform(function(node, path, parent){
    var name = nameOpFunc(node);

    switch (name) {
      case 'add':
        break;
      case 'minus':
        break;
      case 'multiply':
        break;
      case 'divide':
        break;
      default:
        return node;
    }
  });
}
module.exports = flatten