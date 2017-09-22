'use strict';

function factory (type, config, load, typed) {
  var rationalize = load(require('./rationalize'));
  var ConstantNode = load(require('../../expression/node/ConstantNode'));
  /**
   * Transform a rationalizable expression in a rational fraction 
   * and return the denominator part. More details in rationalize function
   *
   * Syntax:
   *
   *     denominator(expr)
   *     denominator(expr, true)
   *     denominator(expr, scope)
   *     denominator(expr, scope, variables)
   *
   * Examples:
   *
   *     math.denominator('2x/y - y/(x+1)') = x*y+y
   *     Se another example in numerator function. 
   *
   * See also:
   *
   *      rationalize, numerator, polynomial,
   *
   * @param  {Node|string} expr     The expression to check if is polynomial expression
   * @param  (Object|boolean} scope  optional scope of expression or true for already evaluated rational expression at input
   * @param  {Array} variables       optional return array of variable names 
   *
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode|string}    The denominator of 'expr' rational polynomial 
   */
    function denominator(node, scope, variables){

      if ((scope!==undefined) && (typeof(scope)!=='object')  && (scope!==true) ) 
         throw  new TypeError("Second parameter is optional variable scope or true for rational expression parameter");

      if (scope!==true) 
         node = rationalize(node,scope, variables);
      
      if (node.type==='OperatorNode'  &&  node.op==='/')    // Separate numerator from denominator
          return node.args[1];
      return new ConstantNode(1);
    } // end of denominator

    return denominator;
} // end of factory

exports.name = 'denominator';
exports.factory = factory;
