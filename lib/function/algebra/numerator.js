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
   *     numerator(expr, scope)
   *     numerator(expr, scope, variables)
   *     numerator(expr, scope, variable, coefficients)
   *
   * Examples:
   *
   *     math.numerator('(x-2)/(x-2) + (-x-2)/(2x+1)') = x^2  -3 x + 2,  coefficients: [2, -3, 1]
   *     math.denominator('(x-2)/(x-2) + (-x-2)/(2x+1)') = 2 x^2 - 3 x - 2
   *        PS: solve equation (x-2)/(x-2) + (-x-2)/(2x+1) = 0  it is equvalent to 
   *            solving the numerator (x^2  -3 x + 2) that gives the roots 1 and 2 
   *            (One can use PolyRoots module in GitHub, that solves general polynomial equations
   *            The array of coefficient helps to use that module or another one)  
   *            However that roots cannot zero the denominator (2 x^2 - 3 x - 2)
   *            so, in this case, left just the root 1. 
   *
   * See also:
   *
   *      rationalize, denominator, polynomial
   *
   * @param  {Node|string} expr   The expression to check if is polynomial expression
   * @param  (Object}  scope   optional scope of expression or true for already rational expression at input
   * @param  {Array}  variables    optional return array of variable names 
   * @param  {Array}  coefficients optional return of coefficients sorted by increased exponent 
   *
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode|string}   The numerator of 'expr' rational polynomial 
   */
  function numerator(node, scope, variables, coefficients){
    if ( (scope!==undefined) && (typeof(scope) !=='object')  && (scope!==true))
      throw new TypeError("Second parameter is optional variable scope or true for rational expression parameter");

    if (scope!==true) 
      node = rationalize(node,scope, variables, coefficients);
     
    if (node.type==='OperatorNode'  &&  node.op==='/')    // Separate numerator from denominator
      return node.args[0];
    return node;
  } //^^^^^^ end of Numerator ^^^^^^^^

  return numerator;

} // end of Factory

exports.name = 'numerator';
exports.factory = factory;
