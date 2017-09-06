'use strict'
var parse = load(require('../../../expression/parse'));

  /**
   * Convert string to node
   *
   * Syntax:
   *
   *     stringToNode(expr)
   *
   * Examples:
   *
   *     stringToNode('sin(x)+y') = Node expression
   *
   * @param  {Node | string} expr      The expression to convert
   *
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}       The node expression unchanged or derived from a string
   */

function stringToNode(expr) {
var node;
try   {
  node = parse(expr);    
  return node;
}
catch (e)   {
   return e.message 
}
}

module.exports = {stringToNode:stringToNode}