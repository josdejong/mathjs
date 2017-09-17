'use strict';

function factory (type, config, load, typed) {
  var rationalize = load(require('./rationalize'));

  /**
   * Transform a rationalizable expression in a rational fraction 
   * and return the numerator part. More details in rationalize function
   *
   * Syntax:
   *
   *     numerator(expr)
   *     numerator(expr, options)
   *
   * Examples:
   *
   *     math.numerator('2x/y - y/(x+1)') = 2*x^2-y^2+2*x
   *
   * See also:
   *
   *      rationalize, denominator, getPolynomial
   *
   * @param  {Node|string} expr   The expression to check if is polynomial expression
   * @param  (Object}  scopeAdd   optional scope of expression or true for already rational expression at input
   * @param  {Array}  varNames    optional return array of variable names 
   * @param  {Array}  coef     optional return of coefficients sorted by increased exponent 
   *
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode|string}   The numerator of 'expr' rational polynomial 
   */
  function numerator(node, scopeAdd, varNames, coef){
    if ( (scopeAdd!==undefined) && (typeof(scopeAdd) !=='object')  && (scopeAdd!==true))
      throw new TypeError("Second parameter is optional variable scope or true for rational expression parameter");

    if (scopeAdd!==true) 
      node = rationalize(node,scopeAdd, varNames, coef);
     
    if (node.type==='OperatorNode'  &&  node.op==='/')    // Separate numerator from denominator
      return node.args[0];
    return node;
  } //^^^^^^ end of Numerator ^^^^^^^^

  return numerator;

} // end of Factory

exports.name = 'numerator';
exports.factory = factory;
