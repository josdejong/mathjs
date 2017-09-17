'use strict';

function factory (type, config, load, typed) {
  var simplify = load(require('./simplify'));
  var ArgumentsError = require('../../error/ArgumentsError');
  var parse = load(require('../../expression/function/parse'));
  /**
   *  Function to simplify an expression using an optional scope and
   *  return it if the expression is a polynomial expression, i.e. 
   *  an expression with one or more variables and the operators
   *  +, -, *, and ^, where the exponent can only be a positive integer. 
   *
   * Syntax:
   *
   *     getPolynomial(expr)
   *     getPolynomial(expr, options)
   *
   * Examples:
   *
   *     math.getPolynomial('2x^2');                         // true
   *     math.getPolynomial('x^2.5');                        // false
   *     math.getPolynomial('x+2y'));                        // true
   *     math.getPolynomial('sin(x)+y');                     // false
   *     math.getPolynomial('(x^2+5)/(x+2)');                // false
   *
   * See also:
   *
   *     rationalize, numerator, denominator
   *
   *
   * @param  {Node | string} expr       The expression to simplify and check if is polynomial expression
   * @param  {object} scopeAdd          Optional scope for expression simplification
   * @param  {array} varNames           Optional array with variable names. 
   * @param  {boolean} extended         Optional. Default is false by default. When true allows divide operator.
   *
   *
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode|string}      string mesage if error, node simplified expression otherwise
   */
  function getPolynomial(node, scopeAdd, varNames, extended) {

    if (typeof node==='string') 
         node = parse(node);

    if (scopeAdd === undefined)
      scopeAdd = {}
    else 
      if (typeof(scopeAdd) !== 'object') 
         throw  new TypeError('Second optional parameter shoud be an scope object');

    if (varNames===undefined)
      varNames = []
    else 
      if (! Array.isArray(varNames)) 
         throw  new TypeError('Third optional parameter shoud be an array of variable names');


    // Add 'e' and 'pi' in the evaluation scope
    scopeAdd.e = 2.718281828459045
    scopeAdd.E = scopeAdd.e
    scopeAdd.pi = 3.141592653589793
    scopeAdd.PI = scopeAdd.pi

    var node=simplify(node,scopeAdd);  // Resolves any variables and functions with all defined parameters    
    extended = !! extended

    var oper = '+-*' + (extended ? '/' : '');
    recPoly(node) 
    return node;

  //-------------------------------------------------------------------------------------------------------
    /**
     *  Function to simplify an expression using an optional scope and
     *  return it if the expression is a polynomial expression, i.e. 
     *  an expression with one or more variables and the operators
     *  +, -, *, and ^, where the exponent can only be a positive integer. 
     *
     * Syntax:
     *
     *     recPoly(node)
     *
     *
     * @param  {Node} node               The current sub tree expression in recursion
     *
     * @return {}                        nothing, throw an exception if error
     */
    function recPoly(node) {
      var tp = node.type;  // node type
      if (tp==='FunctionNode') 
        throw new ArgumentsError('There is an unsolved function call')   // No function call in polynomial expression
      else if (tp==='OperatorNode')  {
        if (node.op==='^')  {
          if (node.args[1].type!=='ConstantNode' ||  ! Number.isInteger(parseFloat(node.args[1].value)))
            throw new ArgumentsError('There is a non-integer exponent');
          else
            recPoly(node.args[0]);      
        } else  { 
            if (oper.indexOf(node.op) === -1) throw new ArgumentsError('Operator ' + node.op + ' invalid in polynomial expression');
            for (var i=0;i<node.args.length;i++) { 
              recPoly(node.args[i]);
            }
        } // type of operator

      } else if (tp==='SymbolNode')  {
         var name = node.name;   // variable name
         var pos = varNames.indexOf(name); 
         if (pos===-1)    // new variable in expression
           varNames.push(name);        

      } else if (tp==='ParenthesisNode') 
         recPoly(node.content);

      else if (tp!=='ConstantNode')   
         throw new ArgumentsError('type ' + tp + ' is not allowed in polynomial expression)'
         
    }  // end of recPoly

  }  // end of getPolynomial 

  return getPolynomial
  } // end of Factory

exports.name = 'getPolynomial';
exports.factory = factory;
