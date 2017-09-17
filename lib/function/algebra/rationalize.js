'use strict';

function factory (type, config, load, typed) {
  var getPolynomial = load(require('./getPolynomial'));
  var simplify = load(require('./simplify'));
  var ArgumentsError = require('../../error/ArgumentsError');
  var parse = load(require('../../expression/function/parse'));
  var ConstantNode = load(require('../../expression/node/ConstantNode'));
  var OperatorNode = load(require('../../expression/node/OperatorNode'));
  var SymbolNode = load(require('../../expression/node/SymbolNode'));
 
  /**
   * Transform a rationalizable expression in a rational fraction. 
   * If rational fraction is one variable polynomial then converts
   * the numerator and denominator in canonical form, with decreasing
   * exponents, returning the coefficients of numrator. 
   *
   * Syntax:
   *
   *     rationalize(expr)
   *     rationalize(expr, options)
   *
   * Examples:
   *
   *     math.rationalize('sin(x)+y') = Error: There is an unsolved function call
   *     math.rationalize('2x/y - y/(x+1)') = (2*x^2-y^2+2*x)/(x*y+y)
   *     math.rationalize('(2x+1)^6') = 
   *                        64*x^6+192*x^5+240*x^4+160*x^3+60*x^2+12*x+1
   *     math.rationalize('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3') =
   *                       '-20*x^4+28*x^3+104*x^2+6*x-12)/(6*x^2+5*x-4)
   *     math.rationalize('x/(1-x)/(x-2)/(x-3)/(x-4) + 2x/ ( (1-2x)/(2-3x) )/ ((3-4x)/(4-5x) )') =
   *                      (-30*x^7+344*x^6-1506*x^5+3200*x^4-3472*x^3+1846*x^2-381*x)/
   *                      (-8*x^6+90*x^5-383*x^4+780*x^3-797*x^2+390*x-72)
   * See also:
   *
   *     getPolynomial, numerator, denominator
   *
   * @param  {Node|string} expr  The expression to check if is a polynomial expression
   * @param  (Object}  scopeAdd  optional scope of expression or true for rational expression simplify
   * @param  {Array}   varNames  optional return array of variable names 
   * @param  {Array}   coef      optional return of coefficients sorted by increased exponent 
   *
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode | string}     The rational polynomial of `expr` or string error message
   * @throws {Error}
   */
  function rationalize(node, scopeAdd, varNames, coef) {
    var t1 = Date.now(); // timestamp

    if (typeof node==='string') node = parse(node);

    if (scopeAdd ===undefined)
      scopeAdd={}
    else  
      if (typeof scopeAdd !=='object') throw new TypeError('Second optional parameter should be a Scope object');

    if (varNames === undefined)
       varNames=[];
    else  
      if (! Array.isArray(varNames)) throw new TypeError('Thrid optional parameter should be a variable names array');

    coef =[];  // array of coefficients

    var node = getPolynomial(node, scopeAdd, varNames, true)  // Check if expression is a rationalizable polynomial

    var nVars =  varNames.length;
    if (nVars>=1) {   // If expression in not a constant
      var setRules = rulesRationalize();   // Rules for change polynomial in near canonical form
      node = expandPower(node);              // First expand power of polynomials (cannot be made from rules!)
      var firstLoop = true;
      var s =- "";            // New expression
      var sBefore;           // previous expression
      var eSucc = true;
      var rules = setRules.firstRules;

       // Apply alternately  successive division rules and 
       // sum of fraction rules until no more changes
       // Start adding first rules to succ division rules. 
      while (true) {        
         node = simplify(node,
                     (eSucc ? rules : setRules.distrDivRules ));       
         sBefore = s;
         var s = node.toString();
         if (s===sBefore) break            // No changes : break (except first running)
         if (firstLoop) rules = setRules.sucDivRules;
         if (! eSucc) firstLoop = false;
         eSucc = ! eSucc;
      }  

      if (! firstLoop) 
                // Apply first rules again (if there are changes)
          node = simplify(node,setRules.firstRulesAgain);   

      node = simplify(node,setRules.finalRules);  // Aplly final rules
    }  

    if (nVars==1)
      if (node.type==='OperatorNode'  &&  node.op==='/')  {   // Separate numerator from denominator
         node.args[0] = polyToCanonical(node.args[0],coef);
         node.args[1] = polyToCanonical(node.args[1]);
      } else 
         node = polyToCanonical(node,coef);
      
    return node;
  } // ^^^^^^^ end of rationalize ^^^^^^^^

   //---------------------------------------------------------------------------------------
      /**
       * Return a rule set to rationalize an polynomial expression in rationalize
       *
       * Syntax:
       *
       *     rulesRationalize()
       *
       * @return {array}        rule set to rationalize an polynomial expression 
       */
  function rulesRationalize() {
    var defRules = simplify.rules; // Standard simplify rules
    var oldRules = defRules.slice() // clone default rules to change

        // Delete the default rules that don't match with rationalize polynomials
    oldRules.splice(23,1); 
    oldRules.splice(15,4);         
    oldRules.splice(12,2); 
    oldRules.splice(1,9);  
         
    var rulesFirst = [
       { l: '(-n1)/(-n2)', r: 'n1/n2' },  // Unary division
       { l: '(-n1)*(-n2)', r: 'n1*n2' },  // Unary multiplication
       { l: 'n1--n2', r:'n1+n2'},        // '--' elimination
       { l: 'n1-n2', r:'n1+(-n2)'} ,      // Subtraction turn into add with unáry minus    
       { l:'(n1+n2)*n3', r:'(n1*n3 + n2*n3)' },     // Distributive 1 
       { l:'n1*(n2+n3)', r:'(n1*n2+n1*n3)' },       // Distributive 2 
       { l: 'c1*n + c2*n', r:'(c1+c2)*n'} ,       // Joining constants
       { l: '-v*-c', r:'c*v'} ,          // Inversion constant and variable 1
       { l: '-v*c', r:'-c*v'} ,          // Inversion constant and variable 2
       { l: 'v*-c', r:'-c*v'} ,          // Inversion constant and variable 3
       { l: 'v*c', r:'c*v'} ,            // Inversion constant and variable 4
       { l: '-(-n1*n2)', r:'(n1*n2)'} ,  // Unary propagation
       { l: '-(n1*n2)', r:'(-n1*n2)'} ,  // Unary propagation
       { l: '-(-n1+n2)', r:'(n1-n2)'} ,  // Unary propagation
       { l: '-(n1+n2)', r:'(-n1-n2)'} ,  // Unary propagation
       { l: '(n1^n2)^n3', r:'(n1^(n2*n3))'} ,  // Power to Power
       { l: '-(-n1/n2)', r:'(n1/n2)'} ,   // Division and Unary
       { l: '-(n1/n2)', r:'(-n1/n2)'} ];   // Divisao and Unary

    var rulesDistrDiv=[
       { l:'(n1/n2 + n3/n4)', r:'((n1*n4 + n3*n2)/(n2*n4))' },  // Sum of fractions
       { l:'(n1/n2 + n3)', r:'((n1 + n3*n2)/n2)' }, // Sum fraction with number 1
       { l:'(n1 + n2/n3)', r:'((n1*n3 + n2)/n3)' }  ];  // Sum fraction with number 1

    var rulesSucDiv=[
       { l:'(n1/(n2/n3))', r:'((n1*n3)/n2)'} , // Division simplification
       { l:'(n1/n2/n3)', r:'(n1/(n2*n3))' } ]

    var setRules={};   // rules set in 4 steps. 

        // All rules => infinite loop
        // setRules.allRules =oldRules.concat(rulesFirst,rulesDistrDiv,rulesSucDiv);  

    setRules.firstRules =oldRules.concat(rulesFirst,rulesSucDiv);  // First rule set
    setRules.distrDivRules = rulesDistrDiv;
    setRules.sucDivRules = rulesSucDiv;
    setRules.firstRulesAgain = oldRules.concat(rulesFirst);

           // Division simplification
          
         // Second rule set. 
          // There is no aggregate expression with parentesis, but the only variable can be scattered. 
    setRules.finalRules=[ defRules[0],
       { l: 'n*-n', r: '-n^2' },                // Joining multiply with power 1
       { l: 'n*n', r: 'n^2' },                  // Joining multiply with power 2
       { l: 'n*-n^n1', r: '-n^(n1+1)' },        // Joining multiply with power 3
       { l: 'n*n^n1', r: 'n^(n1+1)' },          // Joining multiply with power 4
       { l: 'n^n1*-n^n2', r: '-n^(n1+n2)' },    // Joining multiply with power 5
       { l: 'n^n1*n^n2', r: 'n^(n1+n2)' },      // Joining multiply with power 6
       { l: 'n^n1*-n', r: '-n^(n1+1)' },        // Joining multiply with power 7
       { l: 'n^n1*n', r: 'n^(n1+1)' },          // Joining multiply with power 8
       { l: 'n^n1/-n', r: '-n^(n1-1)' },        // Joining multiply with power 8
       { l: 'n^n1/n', r: 'n^(n1-1)' },          // Joining division with power 1
       { l: 'n/-n^n1', r: '-n^(1-n1)' },        // Joining division with power 2
       { l: 'n/n^n1', r: 'n^(1-n1)' },          // Joining division with power 3
       { l: 'n^n1/-n^n2', r: 'n^(n1-n2)' },     // Joining division with power 4
       { l: 'n^n1/n^n2', r: 'n^(n1-n2)' },      // Joining division with power 5
       { l: 'n1+(-n2*n3)', r: 'n1-n2*n3' },     // Solving useless parenthesis 1 
       { l: 'v*(-c)', r: '-c*v' },              // Solving useless unary 2 
       { l: 'n1+-n2', r: 'n1-n2' },             // Solving +- together (new!)
       { l: 'v*c', r: 'c*v' },                  // inversion constant with variable
       { l: '(n1^n2)^n3', r:'(n1^(n2*n3))'},    // Power to Power
       defRules[14]
    ];                    
    return setRules;
  } // End rulesRationalize

    //---------------------------------------------------------------------------------------
      /**
       *  Expand recursively a tree node for handling with expressions with exponents
       *  (it's not for constants, symbols or functions with exponents)
       *  PS: The other parameters are internal for recursion
       *
       * Syntax:
       *
       *     expandPower(node)
       *
       * @param  {Node} node         Current expression node
       * @param  {node} parent       Parent current node inside the recursion
       * @param  (int}               Parent number of chid inside the rercursion 
       *
       * @return {node}        node expression with all powers expanded. 
       */
  function expandPower(node,parent,indParent) {
    var tp = node.type; 
    var internal = (arguments.length>1)   // TRUE in internal calls

    if (tp==='OperatorNode') { 
      var does = false;
      if (node.op==='^')  {   // First operator: Parenthesis or UnaryMinus
        if ( ( node.args[0].type==='ParenthesisNode' ||  
            node.args[0].type==='OperatorNode' ) 
            && (node.args[1].type==='ConstantNode') )  {   // Second operator: Constant
          var val = parseFloat(node.args[1].value);
          does = (val>=2 && Number.isInteger(val));  
        }
      } 

      if (does)  {  // Exponent >= 2 
          //Before:
          //            operator A --> Subtree
          // parent pow 
          //            constant
          //
        if (val>2)     {  // Exponent > 2, 
          //AFTER:  (exponent > 2)
          //             operator A --> Subtree
          // parent  * 
          //                 deep clone (operator A --> Subtree
          //             pow     
          //                 constant - 1
          //
           var nEsqTopo = node.args[0];  
           var nDirTopo = new OperatorNode('^', 'pow', [node.args[0].cloneDeep(),new ConstantNode(val-1)]);
           node = new OperatorNode('*', 'multiply', [nEsqTopo, nDirTopo]);
        } else   // Expo = 2 - no power

            //AFTER:  (exponent =  2)
            //             operator A --> Subtree
            // parent   oper 
            //            deep clone (operator A --> Subtree)    
            //                            
           node = new OperatorNode('*', 'multiply', [node.args[0], node.args[0].cloneDeep()]);
        
        if (internal)       // Change parent references in internal recursive calls
          if (indParent==='content')
            parent.content = node;
          else
            parent.args[indParent] = node
      } // does
    } // Operator Node

    if (tp==='ParenthesisNode' )  // Recursion 
           expandPower(node.content,node,'content');  
    else if (tp!=='ConstantNode' && tp!=='SymbolNode')  
      for (var i=0;i<node.args.length;i++)  
         expandPower(node.args[i],node,i);
        
      
    if (! internal ) return node   // return the root node

  }  // End expandPower

    //---------------------------------------------------------------------------------------
      /**
       * Auxilary function for rationalize
       * Convert near canonical polynomial in one variable in a canonical polynomial
       * with one term for each exponent in decreasing order
       *
       * Syntax:
       *
       *     polyToCanonical(node [, coef])
       *
       * @param  {Node | string} expr       The near canonical polynomial expression to convert in a a canonical polynomial expression
       * 
       *        The string or tree expression needs to be at below syntax, with free spaces:
       *         (  (^(-)? | [+-]? )cte (*)? var (^expo)?  | cte )+
       *       Where 'var' is one variable with any valid name
       *             'cte' are real numeric constants with any value. It can be omitted if equal than 1
       *             'expo' are integers greater than 0. It can be omitted if equal than 1.
       *
       * @param  {array}   coef             Optional returns coefficients sorted by increased exponent 
       *
       *
       * @return {node}        new node tree with one variable polynomial or string error. 
       */
  function polyToCanonical(node,coef) {
    var i;

    if (typeof node==='string') node = parse(node);
  
    if (coef===undefined)
       coef = []; // coefficients.

    coef[0] = 0; 
    var o = {};
    o.cte=1; 
    o.oper='+'; 
    o.fire='';   // o.noFil,  noPai

    var maxExpo=0;   // maximum exponent
    var varname='';  // var name 

    recurPol(node,null,o);    
    maxExpo = coef.length-1;
    var first=true;

    for (i=maxExpo;i>=0 ;i--)  {
      if (coef[i]===0)  continue;
      var n1  = new ConstantNode(
                      first ? coef[i] : Math.abs(coef[i]));
      var op = coef[i]<0  ? '-' : '+';

      if (i>0)   {  // Is not a constant without variable 
        var n2 = new SymbolNode(varname);    
        if (i>1)  {
          var n3 =  new ConstantNode(i);     
          n2 = new OperatorNode('^', 'pow', [n2, n3]); 
        }
        if (coef[i]===-1  && first) 
          n1 = new OperatorNode('-', 'unaryMinus', [n2]);          
        else if (Math.abs(coef[i])===1)  
          n1 = n2;
        else
          n1 = new OperatorNode('*', 'multiply', [n1, n2]); 
      }

      var no;
      if (first)   
        no = n1;
      else if (op==='+')
        no = new OperatorNode('+', 'add', [no, n1]);
      else
        no = new OperatorNode('-', 'subtract', [no, n1]);

      first = false;
    }  // for 

    if (first) 
      return new ConstantNode(0);
    else
      return no;

      /**
       * Recursive auxilary function inside polyToCanonical for
       * converting expression in canonical form
       *
       * Syntax:
       *
       *     recurPol(node, noPai, obj)
       *
       * @param  {Node} node        The current subpolynomial expression 
       * @param  {Node | Null}  noPai   The current parent node
       * @param  {object}    obj        Object with many internal flags
       *
       * @return {}                    No return. If error, throws an exception
       */
    function recurPol(node,noPai,o) {

      var tp = node.type; 
      if (tp==='FunctionNode')            // ***** FunctionName *****
                // No function call in polynomial expression
        throw new ArgumentsError('There is an unsolved function call')

      else if (tp==='OperatorNode')  {    // ***** OperatorName *****
        if ('+-*^'.indexOf(node.op) === -1) throw new ArgumentsError('Operator ' + node.op + ' invalid');
        if (noPai!==null)  {
            // -(unary),^  : children of *,+,-
          if ( (node.fn==='unaryMinus' || node.fn==='pow') && noPai.fn!=='add' &&  
                                noPai.fn!=='subtract'  &&  noPai.fn!=='multiply' )
            throw new ArgumentsError('Invalid ' + node.op +  ' placing')
            // -,+,* : children of +,- 
          if ((node.fn==='subtract' || node.fn==='add' || node.fn==='multiply')  && 
              noPai.fn!=='add' &&  noPai.fn!=='subtract' )
            throw new ArgumentsError('Invalid ' + node.op +  ' placing')
           // -,+ : first child
          if ((node.fn==='subtract' || node.fn==='add' || 
              node.fn==='unaryMinus' )  && o.noFil!==0 )
            throw new ArgumentsError('Invalid ' + node.op +  ' placing')
        } // Has parent    

        // ^,&,-(unary): firers
        if (node.op==='^' || node.op==='*') o.fire = node.op;

        for (var i=0;i<node.args.length;i++)  {
           // +,-: reset fire
          if (node.fn==='unaryMinus') o.oper='-';
          if (node.op==='+' || node.fn==='subtract' ) { 
            o.fire = '';  
            o.cte = 1; 
            o.oper = (i===0 ? '+' : node.op);
          }
          o.noFil = i;
          recurPol(node.args[i],node,o);
        } // for in children

      } else if (tp==='SymbolNode') {      // ***** SymbolName *****
        if (node.name !== varname && varname!=='')
          throw new ArgumentsError('There is more than one variable')
        varname = node.name;   
        if (noPai === null)  {
            coef[1] = 1; 
            return;
        }   

          // ^: Symbol is First child
        if (noPai.op==='^' && o.noFil!==0 ) 
           throw new ArgumentsError('In power the variable should be the first parameter')

          // *: Symbol is Second child 
        if (noPai.op==='*' && o.noFil!==1 ) 
           throw new ArgumentsError('In multiply the variable should be the second parameter')

          // Symbol: firers '',*
        if (o.fire==='' || o.fire==='*' )   {
          if (maxExpo<1) coef[1]=0;
            coef[1] += o.cte* (o.oper==='+'  ? 1 : -1);
          maxExpo = Math.max(1,maxExpo);
        }

      } else if (tp==='ConstantNode') {
        var valor =  parseFloat(node.value);
        if (noPai === null)  {
          coef[0] = valor;
          return;
        }   
        if (noPai.op==='^')  {
           // cte: second  child of power
          if (o.noFil!==1) throw new ArgumentsError('Constant cannot be powered')

          if (! Number.isInteger(valor) || valor<=0 )
            throw new ArgumentsError('Non-integer exponent is not allowed');

          for (var i=maxExpo+1;i<valor;i++) coef[i]=0;
          if (valor>maxExpo) coef[valor]=0;
          coef[valor] += o.cte * (o.oper==='+' ? 1 : -1) 
          maxExpo = Math.max(valor,maxExpo);
          return;
        }
        o.cte = valor;

        // Cte: firer ''
        if (o.fire==='')  
          coef[0] += o.cte * (o.oper==='+'? 1 : -1);


      } else 
         throw new ArgumentsError('Type ' + tp + ' is not allowed');
      return;
    } // End of recurPol
 
  } // End of polyToCanonical

  return rationalize;
} // end of factory

exports.name = 'rationalize';
exports.factory = factory;
