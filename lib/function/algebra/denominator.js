'use strict';

function factory (type, config, load, typed) {
  var rationalize = load(require('./rationalize'));

  /**
   * Transform a rationalizable expression in a rational fraction 
   * and return the denominator part. More details in rationalize function
   *
   * Syntax:
   *
   *     denominator(expr)
   *     denominator(expr, options)
   *
   * Examples:
   *
   *     math.denominator('2x/y - y/(x+1)') = x*y+y
   *
   * See also:
   *
   *      rationalize, numerator, isPolynomial,
   *
   * @param  {Node|string} expr    The expression to check if is polynomial expression
   * @param  (Object} scopeAdd     optional scope of expression or true for rational expression simplify
   * @param  {Array} varNames      optional return array of variable names 
   *
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode|string}    The denominator of 'expr' rational polynomial 
   */
function denominator(node,scopeAdd, varNames){
if ((scopeAdd!==undefined) && (typeof(scopeAdd)!=='object')  && (scopeAdd!==true) ) 
   return "Second parameter is optional variable scope or true for rational expression parameter"

if (scopeAdd!==true) {
   node = rationalize(node,scopeAdd, varNames);
   if (typeof node==='string') return node;
}

if (node.type==='OperatorNode'  &&  node.op==='/')    // Separate numerator from denominator
    return node.args[1];
 return new ConstantNode(1);
} // end of denominator

return denominator;

} // end of factory
exports.name = 'denominator';
exports.factory = factory;
