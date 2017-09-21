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
   *     polynomial(expr)
   *     polynomial(expr,scope)
   *     polynomial(expr,scope,variables)
   *     polynomial(expr,scope,variables,extended)
   *
   * Examples:
   *
   *     math.polynomial('2x^2');                         // 2x^2 
   *     math.polynomial('2x^2,{},variables);             // 2x^2 , variables = ["x"]
   *     math.polynomial('2x^2,{x:5});                    // 50
   *     math.polynomial('2x^2,variables);                // 50
   *     math.polynomial('x^2.5');                        // Exception error: non-integer exponent
   *     math.polynomial('x+2y',{},variables);            // x+2y, variable = ["x","y"]
   *     math.polynomial('sin(x)+y,{y:2}');               // Exception error: not solved function call
   *     math.polynomial('(x^2+5)/(x+2)');                // Exception error: division is not allowed 
   *     math.polynomial('(x^2+5)/(x+2)',{},variables,true);   // (x^2+5)/(x+2), variables = ["x"]
   *
   * See also:
   *
   *     rationalize, numerator, denominator
   *
   *
   * @param  {Node | string} expr     The expression to simplify and check if is polynomial expression
   * @param  {object} scope           Optional scope for expression simplification
   * @param  {array} variables        Optional array with variable names. 
   * @param  {boolean} extended       Optional. Default is false by default. When true allows divide operator.
   *
   *
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode|string}    node simplified expression
   */
   var polynomial = typed('polynomial', {
       'string': function (expr) {
         return polynomial(parse(expr), {}, [], false);
       },

       'string, Object': function (expr, scope) {
         return polynomial(parse(expr), scope, [], false);
       },

       'string, Object, Array': function (expr, scope, variables) {
         return polynomial(parse(expr), scope, variables, false);
       },

       'string, Object, Array, boolean': function(expr, scope, variables, extended) {
         return polynomial(parse(expr), scope, variables, extended);
       },

       'Node': function (expr) {
         return polynomial(expr, {}, [], false);
       },

       'Node, Object': function (expr, scope) {
         return polynomial(expr, scope, [], false);
       },

       'Node, Object, Array': function (expr, scope, variables) {
         return polynomial(expr, scope, variables, false);
       },

       'Node, Object, Array, boolean': function(expr, scope, variables, extended) {

          scopeLoc = scope.slice(0);   // clone scope in local array

          // Add 'e' and 'pi' in the evaluation scope
          scopeLoc.e = 2.718281828459045
          scopeLoc.E = scopeLoc.e
          scopeLoc.pi = 3.141592653589793
          scopeLoc.PI = scopeLoc.pi

          var node=simplify(node,scopeLoc);  // Resolves any variables and functions with all defined parameters    
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
               var pos = variables.indexOf(name); 
               if (pos===-1)    // new variable in expression
                 variables.push(name);        

            } else if (tp==='ParenthesisNode') 
               recPoly(node.content);

            else if (tp!=='ConstantNode')   
               throw new ArgumentsError('type ' + tp + ' is not allowed in polynomial expression')
               
          }  // end of recPoly

        }  // end of polynomial 
   });  // end of typed polynomial 

  return polynomial
  } // end of Factory

exports.name = 'polynomial';
exports.factory = factory;
