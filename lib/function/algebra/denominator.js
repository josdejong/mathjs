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
function denominator(node,obj){
 if (arguments.length<2) obj={};
 node = rationalize(node,obj);
 if (typeof node==='string') return node;
 return obj.denominator;
}

return denominator;

}

exports.name = 'denominator';
exports.factory = factory;