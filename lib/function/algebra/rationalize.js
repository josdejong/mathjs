//'use strict';

////////////////// Debug Code ///////////////////////////

// Source: https://stackoverflow.com/questions/14172455/get-name-and-line-of-calling-function-in-node-js
Object.defineProperty(global, '__stack', {
get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
get: function() {
        return __stack[2].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
get: function() {
        return __stack[2].getFunctionName();
    }
});
////////////////// Debug Code ///////////////////////////

function retStr(expr) { //XXX 
  return expr.toString({parenthesis: 'all'}).replace(/ /g,'');   // st + "> " + 
}

var count=0    //XXX counter of calls that changes an expression
var prev="";   //XXX previous expression before calls parse or simplify
var glob="";   //XXX global string for print in the error

function factory (type, config, load, typed) {
  var simplify = load(require('./simplify'));
  var ArgumentsError = require('../../error/ArgumentsError');
  var parse = load(require('../../expression/function/parse'));
  var number = require('../../utils/number')
  var ConstantNode = load(require('../../expression/node/ConstantNode'));
  var OperatorNode = load(require('../../expression/node/OperatorNode'));
  var SymbolNode = load(require('../../expression/node/SymbolNode'));

  /**
   * Transform a rationalizable expression in a rational fraction. 
   * If rational fraction is one variable polynomial then converts
   * the numerator and denominator in canonical form, with decreasing
   * exponents, returning the coefficients of numerator. 
   *
   * Syntax:
   *
   *     rationalize(expr)
   *     rationalize(expr,scope)
   *     rationalize(expr,scope,detailed)
   *
   * Examples:
   *
   *     math.rationalize('sin(x)+y')  //  Error: There is an unsolved function call
   *     math.rationalize('2x/y - y/(x+1)')  // (2*x^2-y^2+2*x)/(x*y+y)
   *     math.rationalize('(2x+1)^6')  
   *                   //     64*x^6+192*x^5+240*x^4+160*x^3+60*x^2+12*x+1
   *     math.rationalize('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3') 
   *                   //    -20*x^4+28*x^3+104*x^2+6*x-12)/(6*x^2+5*x-4)
   *     math.rationalize('x/(1-x)/(x-2)/(x-3)/(x-4) + 2x/ ( (1-2x)/(2-3x) )/ ((3-4x)/(4-5x) )') =
   *                   //  (-30*x^7+344*x^6-1506*x^5+3200*x^4-3472*x^3+1846*x^2-381*x)/
   *                   //   (-8*x^6+90*x^5-383*x^4+780*x^3-797*x^2+390*x-72)
   *
   *     math.rationalize('x+x+x+y',{y:1}) // 3*x+1
   *     math.rationalize('x+x+x+y',{})    // 3*x+y
   *     ret = math.rationalize('x+x+x+y',{},true) 
   *                          // ret.expression=3*x+y,  ret.variables = ["x","y"]
   *     ret = math.rationalize('-2+5x^2',{},true) 
   *                          // ret.expression=5*x^2-2,  ret.variables = ["x"], ret.coefficients=[-2,0,5]
   *
   * @param  {Node|string} expr    The expression to check if is a polynomial expression
   * @param  (Object|boolean}      optional scope of expression or true for already evaluated rational expression at input
   * @param  {Boolean}  detailed   optional True if return an object, false if return expression node (default) 
   *
   * @return {Object | Expression Node}    The rational polynomial of `expr` or na object
   *            {Object}
   *              {Expression Node} expression: node simplified expression
   *              {Expression Node} numerator: simplified numerator of expression
   *              {Expression Node | boolean} denominator: simplified denominator or false (if there is no denominator)
   *              {Array}           variables:  variable names
   *              {Array}           coefficients: coefficients of numerator sorted by increased exponent 
   *           {Expression Node}  node simplified expression
   *   
   */
  var rationalize = typed('rationalize', {
    'string': function (expr) {
       return rationalize(parseDeb(expr), {}, false);  //XXX
    },

    'string, boolean': function (expr, detailed) {
       return rationalize(parseDeb(expr), {} , detailed);   //XXX
    },


    'string, Object': function (expr, scope) {
       return rationalize(parseDeb(expr), scope, false);   //XXX
    },

    'string, Object, boolean': function (expr, scope, detailed) {
       return rationalize(parseDeb(expr), scope, detailed);   //XXX
    },

    'Node': function (expr) {
       return rationalize(expr, {}, false);
    },

    'Node, boolean': function (expr, detailed) {
      return rationalize(expr, {}, detailed);
    },

    'Node, Object': function (expr, scope) {
      return rationalize(expr, scope, false);
    },

    'Node, Object, boolean': function (expr, scope, detailed) {

      var polyRet = polynomial(expr, scope, true)  // Check if expression is a rationalizable polynomial
      var nVars =  polyRet.variables.length;
      var expr = polyRet.expression;         
           
      if (nVars>=1) {   // If expression in not a constant
        var setRules = rulesRationalize();   // Rules for change polynomial in near canonical form
        expr = expandPower(expr);              // First expand power of polynomials (cannot be made from rules!)
        var redoInic = true;   // If has change after start, redo the beginning
        var s = "";            // New expression
        var sBefore;           // Previous expression
        var rules;  
        var eDistrDiv = true  

        expr = simplifyDeb(expr, setRules.firstRules);  // Apply the initial rules, including succ div rules //XXX
        s = expr.toString();


        while (true) {                  // Apply alternately  successive division rules and distr.div.rules
          rules = eDistrDiv ? setRules.distrDivRules : setRules.sucDivRules
          expr = simplifyDeb(expr,rules);         // until no more changes
          eDistrDiv = ! eDistrDiv;    // Swap between Distr.Div and Succ. Div. Rules
          
          s = expr.toString();
          if (s===sBefore) break   // No changes : end of the loop
          
          redoInic = true;
          sBefore = s;
        }  
       
        if (redoInic)  {         // Apply first rules again without succ div rules (if there are changes)
          expr = simplifyDeb(expr,setRules.firstRulesAgain);   //XXX
        }
        expr = simplifyDeb(expr,setRules.finalRules);  // Aplly final rules //XXX

      }  // NVars >= 1

      var coefficients=[];
      var retRationalize = {};

      if (nVars==1)  {
        if (expr.type==='OperatorNode'  &&  expr.op==='/')  {   // Separate numerator from denominator
          //console.log(retStr('N',expr.args[0]))  //XXX
          //console.log(retStr('D',expr.args[1]))  //XXX 
          // glob = retStr("N",expr.args[0]);
          expr.args[0] = polyToCanonical(expr.args[0],coefficients);
          expr.args[1] = polyToCanonical(expr.args[1]);
          if (detailed) {
            retRationalize.numerator = expr.args[0];
            retRationalize.denominator = expr.args[1];
          }
        } else {
          expr = polyToCanonical(expr,coefficients);
          if (detailed) { 
            retRationalize.numerator = expr;
            retRationalize.denominator = null // new ConstantNode(1);
          }
        }
      } else {
        retRationalize.numerator = null;
        retRationalize.denominator = null;
      } // nVars

      // console.log(glob);  //XXX
      count = 0;
      prev = ""
      glob = "";

      if (! detailed) return expr;
      retRationalize.coefficients = coefficients;
      retRationalize.variables = polyRet.variables;
      retRationalize.expression = expr;
      return retRationalize;
    }  // ^^^^^^^ end of rationalize ^^^^^^^^
  });  // end of typed rationalize

////////////////// Debug Code ///////////////////////////

  //---------------------  procMidTok ------------------------------
  // break s in position p (next char).
  // return new position backwards without
  // break a number or identifier. 
  //--------------------------------------------------------------
  function procMidTok(s, pos)  {
    if (pos>=s.length) return pos;

    var ch;  // current character
    var pBack; 
    var digs = "0123456789";
    var lets = "abcdefghilklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";

    var isDig; // Status of current character
    var isLet;
    var isExpo;
    var isSign;
    var isDot;
    
    var pBack = pos;    // backward cursor
    var inic = true;
    var canNumber = true; 
    var canId = true;
    
    var pastExpo = false;  // Already occurs "e" or "E"
    var pastDot = false;   // Already occurs "."
    var pastSign = false;  // Already occurs "-" or "+"

    var succExpo = false;  // Previous character backwards is +,-,digit
    var succSign = false;
    var succDot = true;
    
    var prevExpo = false;
    var prevSign = false;
    var prevNumber= false;
    var prevDot= false;

    var triggerSign=false;

    if (pos+1<s.length) {
        // expo just before  digit / signal
      var ch=s[pos+1];
      succExpo = digs.indexOf(ch)!==-1  ||  ch==="+" || ch==="-";

         // sign just before digit / dot
      succSign = digs.indexOf(ch)!==-1  ||  ch==="." ;

         // dot never just before letter, signal or dot
      succDot = lets.indexOf(ch)===-1 && ch!=="+" && ch!=="-"  && ch!=="."
    }

    var pSave = pos;   // if does not occurs digit or point, uses the initial position

    while (pBack>=0) {  // loop
    
      ch = s[pBack];   // current character
      isDig = digs.indexOf(ch)!==-1;  // is digit
      isLet = lets.indexOf(ch)!==-1;  // is letter
      isDot = ch==="." && canNumber ;   // is dot             
      isExpo = ( ch==="e" || ch==="E")  && canNumber ;   // is expo
      isSign = ( ch==="+" || ch==="-" ) && canNumber ;  // is sign

      if (prevSign)   {  // if previous is signal 
        triggerSign = ! isExpo;   // wait for "e" or it's the end.  Get piece after sign
        canNumber = isExpo;
      } else if (prevExpo && ! isDig && ! isDot )  {   // before "e" needs a digit or dot
        prevExpo = false;
        pastExpo = false
        triggerSign = pastSign   // Is not a number, get token after sign   te23
        canNumber = ! triggerSign
      // There is a situation that don't trigger, but it is catched below.
      // Ex: d23232323e+23, the piece is 23. 
      }

        // number: digit, signal, dot (just once), expo (just once)
      if (canNumber) canNumber = isDig || isDot ||  isExpo || isSign;   

        // id: letter, digit 
      if (canId) canId = isLet || isDig

        // expo just before "+","-",digit. Never two "e" in number. Nuver before "."
      if (isExpo  && canNumber)    
         canNumber = succExpo && ! pastDot && ! pastExpo;   
      
          // Signal just before digit/dot and ends before "e" or "." 
      if (isSign  && canNumber)    
         canNumber = succSign && ! pastExpo && ! pastDot;

          // Dot not after letter,dot or signal. Never 2 dots. 
      if (isDot && canNumber) {   
         canNumber = succDot && ! pastDot;
      } 
      
        // Invalid character in an identifier or decimal number
      if (! canNumber && ! canId ) {
        if (triggerSign  || (pastSign && ! canNumber))   // Sign not immediately after "NUMBER e" (exponential notation)
          pBack = pSave;
        else 
          pBack = Math.min(pBack+1,pos);   // index of first character from id or number without the sign
        return pBack  
      }
       
      pastSign = isSign || pastSign
      pastExpo = isExpo || pastExpo;
      pastDot  = isDot || pastDot;
          
      succExpo = isDig || isSign;
      succSign  = isDig || isDot;
      succDot = ! isLet && ! isSign && ! isDot  

      prevNumber = canNumber;

      prevExpo = isExpo;  // Previous character is expo?
      prevDot = isDot;
      prevSign = isSign;
      
      if (isDig || isDot) pSave = pBack;   // Save last digit or dot position
      pBack --
    } // while

    return 0;
  }


  //---------------------  breakStr ------------------------------
  // break string "s" in pieces of length "len"
  // if type empty no handling
  // if type="#" includes "// " in each line (javascript comment)
  // if type = '"' is character that needs occurs even times
  //    break line in the middle of a quoted string
  //--------------------------------------------------------------
  function breakStr(s, len, type="") {  
    var isComm = (type==="#"); // Is comment?
    var piece;   // piece of string
    var n = s.length;  // total length
    var x = "";        // exit
    var pNew;          // changed index
    var ok;
    if (type!=="") 
       var patt = new RegExp(type,"g");

    if (n < len) return (isComm ? "// ":"") + s + "\n";
    var pos = 0;
    while (pos <= n-1) {
      piece = (isComm ? "// ": "") + s.slice(pos,pos+len)

      pos += len;
      pNew = pos;
      ok = isComm;

      if (! isComm && (type!=="")) {    // Has quota delimiter
        var k = (piece.match(patt) || []).length;  // count characters 
        if (k % 2 ===1) {                          // Odd number of quotes?
          pNew = s.lastIndexOf(type,pos-1)-1;  // Search next even quote and skip back   
          ok = true;
        } // odd quote
      } // search even quote  

      if (! isComm && ! ok)              // Can be in the middle of token (id/number)  
        var pNew = procMidTok(s,pos);
      
      if (pos !== pNew) {
        piece = piece.slice(0,len-(pos-pNew)); 
        pos = pNew;  
      }
      x += piece + "\n";    // If nothing special 
    } // while
    return x 
  }


  // ----------------------- funcCommon ----------------------
  // Common piece for "simplifyDeb" and "parseDeb" functions
  // ----------------------------------------------------------
  function funcCommon(func,expr,rules,lin) {
    var actual; 
    var len = 70;
    count += 1;
    if (prev === "") {
      prev = expr;
      glob += breakStr(count + "> Initial Expression: " + expr + "  before " + func.name +" call(" + lin + ")",len,"#") ;
      glob += breakStr("var expr = " + expr + ";",len);   // Expressão inicial 
    } else {
      actual = retStr(expr);  
      if (prev === actual) 
        glob += "// " + count + "> No expression change before " + func.name +" call(" + lin + ")\n" ;
      else
        glob += breakStr(count + "> Expression in " + func.name +" call [" + prev + "] changes to " + actual,len,"#");
    }

    strRules = JSON.stringify(rules);
    if (func.name==="simplify") { // Simplify
       var strRules;
       if (Array.isArray(rules))  {  // Simplify call with rules 
         var erro=false; 
         if  (typeof(rules[0])==="function") {  // Simplify call include old rules. 
           erro = (typeof(rules[3]) !=="function");
           if (erro) glob += "// " + count + '> Error in rules. Function expected in index 3\n';
           if (! erro) {
             erro = (rules[0].name !== "simplifyCore");
             if (erro) glob += "// " + count + '> Error in rules. simplifyCore function expected in index 0\n';            
           }
           if (! erro) {
             erro = (rules[3].name !== "simplifyConstant"); 
             if (erro) glob += "// " + count + '> Error in rules. simplifyConstant function expected in index 14\n';
           }
           if (! erro) {
              strRules = strRules.replace("[null,","[simplifyCore,");
              strRules = strRules.replace(",null,",",simplifyConstant,"); 
           }
         } 
         glob += breakStr("var rules = " + strRules + ";",len,'"');         // rule assignment in generated source
       }  
       glob += "expr = simplify(expr,rules);\n";   // simplify call in generated source
       var node = func(expr,rules);   // real execution
    } // end of simplify part

    else {   // parse part
       glob += "expr = parse(expr);\n"   // parse call in generated source
       var node = func(expr);   // real execution
    } // end of parse part

    prev = retStr(node);
    glob +=   breakStr(count + "> Expression in " + func.name +" call (" + lin + ") changes to " + prev,len,"#");
    glob +=   "// ==========================\n";
    return node;
  }

  // ----------------------- simplifyDeb ----------------------
  // "simplify" encapsulated for debug action
  // ----------------------------------------------------------

  function simplifyDeb(expr,rules) {  ///XXX
    var lin = __line;
    node = funcCommon(simplify,expr,rules,lin);
    return node;
  }


  // ----------------------- parseDeb ----------------------
  // "parse" encapsulated for debug action
  // ----------------------------------------------------------
  function parseDeb(expr) {  ///XXX
    var lin=__line;
    node = funcCommon(parse,expr,undefined,lin);
    return node;
  }
////////////////// End of Debug Code ///////////////////////////


/**
 *  Function to simplify an expression using an optional scope and
 *  return it if the expression is a polynomial expression, i.e. 
 *  an expression with one or more variables and the operators
 *  +, -, *, and ^, where the exponent can only be a positive integer. 
 *
 * Syntax:
 *
 *     polynomial(expr,scope,extended)
 *
 * @param  {Node | string} expr     The expression to simplify and check if is polynomial expression
 * @param  {object} scope           Optional scope for expression simplification
 * @param  {boolean} extended       Optional. Default is false. When true allows divide operator.
 *
 *
 * @return {Object} 
 *            {Object} node:   node simplified expression
 *            {Array}  variables:  variable names
 */             

  function polynomial (expr, scope, extended) {
    var variables = [];
    var node = simplifyDeb(expr,scope);  // Resolves any variables and functions with all defined parameters    //XXX
    extended = !! extended

    var oper = '+-*' + (extended ? '/' : '');
    recPoly(node) 
    var retFunc ={};
    retFunc.expression = node;
    retFunc.variables = variables;
    return retFunc; 

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
          if (node.args[1].type!=='ConstantNode' ||  ! number.isInteger(parseFloat(node.args[1].value)))
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
    setRules.distrDivRules = rulesDistrDiv;                  // Just distr. div. rules  
    setRules.sucDivRules = rulesSucDiv;                      // Jus succ. div. rules
    setRules.firstRulesAgain = oldRules.concat(rulesFirst);  // Last rules set without succ. div. 

           // Division simplification
          
         // Second rule set. 
          // There is no aggregate expression with parentesis, but the only variable can be scattered. 
    setRules.finalRules=[ defRules[0],
       { l: 'n*-n', r: '-n^2' },                // Joining multiply with power 1
       { l: 'n*n', r: 'n^2' },                  // Joining multiply with power 2
        defRules[14],                           // 3rd index 
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
          does = (val>=2 && number.isInteger(val));  
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
       *     polyToCanonical(node [, coefficients])
       *
       * @param  {Node | string} expr       The near canonical polynomial expression to convert in a a canonical polynomial expression
       * 
       *        The string or tree expression needs to be at below syntax, with free spaces:
       *         (  (^(-)? | [+-]? )cte (*)? var (^expo)?  | cte )+
       *       Where 'var' is one variable with any valid name
       *             'cte' are real numeric constants with any value. It can be omitted if equal than 1
       *             'expo' are integers greater than 0. It can be omitted if equal than 1.
       *
       * @param  {array}   coefficients             Optional returns coefficients sorted by increased exponent 
       *
       *
       * @return {node}        new node tree with one variable polynomial or string error. 
       */
  function polyToCanonical(node,coefficients) {
    var i;

    if (coefficients===undefined)
       coefficients = []; // coefficients.

    coefficients[0] = 0;   // index is the exponent
    var o = {};
    o.cte=1; 
    o.oper='+'; 

     // fire: mark with * or ^ when finds * or ^ down tree, reset to "" with + and -. 
     //       It is used to deduce the exponent: 1 for *, 0 for "". 
    o.fire='';  

    var maxExpo=0;   // maximum exponent
    var varname='';  // var name 

    recurPol(node,null,o);    
    maxExpo = coefficients.length-1;
    var first=true;

    for (i=maxExpo;i>=0 ;i--)  {
      if (coefficients[i]===0)  continue;
      var n1  = new ConstantNode(
                      first ? coefficients[i] : Math.abs(coefficients[i]));
      var op = coefficients[i]<0  ? '-' : '+';

      if (i>0)   {  // Is not a constant without variable 
        var n2 = new SymbolNode(varname);    
        if (i>1)  {
          var n3 =  new ConstantNode(i);     
          n2 = new OperatorNode('^', 'pow', [n2, n3]); 
        }
        if (coefficients[i]===-1  && first) 
          n1 = new OperatorNode('-', 'unaryMinus', [n2]);          
        else if (Math.abs(coefficients[i])===1)  
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
          if ( (node.fn==='unaryMinus' || node.fn==='pow') && noPai.fn !=='add' &&  
                                noPai.fn!=='subtract'  &&  noPai.fn!=='multiply' )
            throw new ArgumentsError('Invalid ' + node.op +  ' placing')

            // -,+,* : children of +,- 
          if ((node.fn==='subtract' || node.fn==='add' || node.fn==='multiply')  && 
              noPai.fn!=='add' &&  noPai.fn!=='subtract' )
            throw new ArgumentsError('Invalid ' + node.op +  ' placing: [' + glob + ']')
        
           // -,+ : first child
//        if ((node.fn==='subtract' || node.fn==='add' ||                //TTT
//            node.fn==='unaryMinus' )  && o.noFil!==0 )                  
//          throw new ArgumentsError('Invalid ' + node.op +  ' placing')

         } // Has parent    

        // Firers: ^,*       Old:   ^,&,-(unary): firers
        if (node.op==='^' || node.op==='*') o.fire = node.op;

        for (var i=0;i<node.args.length;i++)  {
           // +,-: reset fire
          if (node.fn==='unaryMinus') o.oper='-';
          if (node.op==='+' || node.fn==='subtract' ) {    
            o.fire = '';  
            o.cte = 1;   // default if there is no constant
            o.oper = (i===0 ? '+' : node.op);
          }
          o.noFil = i;  // number of son
          recurPol(node.args[i],node,o);
        } // for in children

      } else if (tp==='SymbolNode') {      // ***** SymbolName *****
        if (node.name !== varname && varname!=='')
          throw new ArgumentsError('There is more than one variable')
        varname = node.name;   
        if (noPai === null)  {
            coefficients[1] = 1; 
            return;
        }   

          // ^: Symbol is First child
        if (noPai.op==='^' && o.noFil!==0 ) 
           throw new ArgumentsError('In power the variable should be the first parameter')

          // *: Symbol is Second child 
        if (noPai.op==='*' && o.noFil!==1 ) 
           throw new ArgumentsError('In multiply the variable should be the second parameter')

          // Symbol: firers '',* => it means there is no exponent above, so it's 1 (cte * var) 
        if (o.fire==='' || o.fire==='*' )   {
          if (maxExpo<1) coefficients[1]=0;
          coefficients[1] += o.cte* (o.oper==='+'  ? 1 : -1);
          maxExpo = Math.max(1,maxExpo);
        }

      } else if (tp==='ConstantNode') {
        var valor =  parseFloat(node.value);
        if (noPai === null)  {
          coefficients[0] = valor;
          return;
        }   
        if (noPai.op==='^')  {
           // cte: second  child of power
          if (o.noFil!==1) throw new ArgumentsError('Constant cannot be powered')

          if (! number.isInteger(valor) || valor<=0 )
            throw new ArgumentsError('Non-integer exponent is not allowed');

          for (var i=maxExpo+1;i<valor;i++) coefficients[i]=0;
          if (valor>maxExpo) coefficients[valor]=0;
          coefficients[valor] += o.cte * (o.oper==='+' ? 1 : -1) 
          maxExpo = Math.max(valor,maxExpo);
          return;
        }
        o.cte = valor;

        // Cte: firer '' => There is no exponent and no multiplication, so the exponent is 0. 
        if (o.fire==='')  
          coefficients[0] += o.cte * (o.oper==='+'? 1 : -1);


      } else 
         throw new ArgumentsError('Type ' + tp + ' is not allowed');
      return;
    } // End of recurPol
 
  } // End of polyToCanonical

  return rationalize;
} // end of factory

exports.name = 'rationalize';
exports.factory = factory;
