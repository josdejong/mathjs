"use strict";
var m = require('mathjs');  // Carrega biblioteca matematica

/***********************************************
              isPolynomial (expr, [obj] )
 Function to check is expression is a polynomial expression. 

Parameters
  expr - string or expression tree
  obj  - input/output of parameters
       .moreThanOne - Default FALSE. if TRUE accepts expression with
                   more than one variable. (INPUT)
       .varName - variable name  (OUTPUT)
       .numVar - number of variables. (OUTPUT)

Return
   true or error message
***********************************************/
function isPolynomial(node,obj) {

if (typeof node==="string") node = stringToNode(node);
if (typeof node==="string") return "Invalid expression: " + node;
if (arguments.length<2)
   obj={}
else 
   if (typeof obj!=="object") return "Second optional parameter shoud be an object"

obj.varName = "";
obj.numVar = 0;
var moreThanOne = obj.moreThanOne ? true : false;

try {
   recPoly(node,obj) 
   if (obj.numVar===0)  return "Expression doesn't contains any variable."
   return true;
} catch (e) {
  return e
}
/*---------------------------------------------------------
                         recPoly
   Recursive function to check polynomial expression
/*---------------------------------------------------------*/
function recPoly(node,obj) {
var i, name, no, tp;
tp = node.type; 
if (tp==='FunctionNode') 
   throw "There is an unsolved function call"   // No function call in polynomial expression
else if (tp==='OperatorNode')  {
  if (node.op==="^")  {
    if (node.args[1].type!=='ConstantNode' ||  ! Number.isInteger(parseFloat(node.args[1].value)))
      throw "There is a non-integer exponent";
    else
      recPoly(node.args[0],obj);      
  } else  { 
      if ("+-/*".indexOf(node.op) === -1) throw "Operator " + node.op + " invalid in polynomial expression";
      for (i=0;i<node.args.length;i++) { 
        no = node.args[i];
        recPoly(no,obj);
      }
  }

} else if (tp==='SymbolNode')  {
      if (obj.numVar<2) { 
          name = node.name;   // variable name
          if (obj.varName==="") {  
            obj.varName = name;
            obj.numVar ++;
          } else if (obj.varName!==name) {
            obj.numVar++
            if (! moreThanOne) throw("There is more than 1 variable in expression");
          } 
      }   
} else if (tp==='ParenthesisNode') // "ParenthesisNode" 
    recPoly(node.content,obj);

else if (tp!=='ConstantNode')   
     throw "type " + tp + " is not allowed in polynomial expression"
   
}  // recPoly end

}  // isPolynomial 


/*******************************************************
                    numerator (expr, [obj] )
Get a numerator with near canonical polynomial 
from a rationalizable expression

Parameters
   expr - string or tree expression
   obj
     .scopeAdd - Expression scope
     .moreThanOne -TRUE if accepts more than one variable.
                   Default = FALSE
Return 
   Tree expression or error message
********************************************************/
function numerator(node,obj){
 node = rationalize(node,obj);
 if (typeof node==="string") return node;
 return obj.denominator;
}

/*******************************************************
                    denominator(expr, [obj] )
Get a denominator with near canonical polynomial 
from a rationalizable expression

Parameters
   expr - string or tree expression
   obj
     .scopeAdd - Expression scope
     .moreThanOne -TRUE if accepts more than one variable.
                   Default = FALSE
Return 
   Tree expression or error message
********************************************************/
function denominator(node,obj){
 node = rationalize(node,obj);
 if (typeof node==="string") return node;
 return obj.denominator;
}

/*******************************************************
                    rationalize (expr, [obj] )
Transform a rationalizable expression in a rational fraction of
near canonical polynomials 

Parameters
   node - string or tree expression
   obj
     .scopeAdd - Scope of expression (INPÙT)
     .moreThanOne -TRUE if accepts more than one variable.
                   Default = FALSE (INPUT)
     .numerator - numerator in a tree expression (OUTPUT)
     .denominator - denominator in a tree expression (OUTPUT)

Return 
   Tree expression or error message
********************************************************/
function rationalize(node, obj) {
var s, sBefore;
var t1 = Date.now(); // timestamp

if (typeof node==="string") node = stringToNode(node);
if (typeof node==="string") return node;

if (arguments.length<2)
   obj={}
else  
   if (typeof obj!=="object") return "Second parameter invalid in isPolynomial"

var moreThanOne = obj.moreThanOne ? true : false;
var scopeAdd = obj.scopeAdd ? obj.scopeAdd : {};

var ret = isPolynomial(node,obj)  // Check if expression is a rationalizable polynomial
if (typeof ret==="string") return ret;  // return string is error. 

// Add e and pi in the scope
scopeAdd.e = 2.718281828459045
scopeAdd.E = scopeAdd.e
scopeAdd.pi = 3.141592653589793
scopeAdd.PI = scopeAdd.pi

var node=m.simplify(node,scopeAdd);  // Resolves any variables and functions with all defined parameters
var setRules = rulesRationalize();   // Rules for change polynomial in near canonical form

node=expandPower(node);              // First expand power of polynomials (cannot be made from rules!)

var firstLoop = true;
while (true) {
           // Apply first rules + successive division rules
   node = m.simplify(node,(firstLoop? setRules.firstRules : setRules.sucDivRules));       
   var sBefore = node.toString();
   if (! firstLoop && s===sBefore) break            // No changes : break (except first running)
   node = m.simplify(node,setRules.distrDivRules);  // Apply sum of Fractions rules
   var s = node.toString();                         
   if (s===sBefore) break;                          //  No changes: break
   firstLoop = false;  
}

if (! firstLoop) 
        // Apply first rules again (if there are changes)
    node = m.simplify(node,setRules.firstRulesAgain);   

node = m.simplify(node,setRules.finalRules);  // Aplly final rules

var hasDivide = (node.type==='OperatorNode'  &&  node.op==="/");  // Has divide operator

if (hasDivide)  {  // Separate numerator from denominator
    obj.numerator = node.args[0];
    obj.denominator = node.args[1];
} else {
    obj.numerator = node;
    obj.denominator =  new m.expression.node.ConstantNode(1);
}
return node;
} // ^^^^^^^ end of rationalize ^^^^^^^^

/*******************************************************
                    rulesRationalize  (AUX)
Return a rule set to rationalize an polynomial expression 
********************************************************/
function rulesRationalize() {
var rules;  // auxiliar
var rulesPrim, rulesDistrDiv, rulesSucDiv
var defRules = m.simplify.rules; // Standard simplify rules
var oldRules = defRules.slice() // clone default rules to change
var setRules={};   // rules set in 2 steps. 

// Delete the default rules that don't match with rationalize polynomials
 oldRules.splice(23,1); 
 oldRules.splice(15,4);         
 oldRules.splice(12,2); 
 oldRules.splice(1,9);  
 
var rulesFirst = [
  { l: '(-n1)/(-n2)', r: 'n1/n2' },  // Unary division
  { l: '(-n1)*(-n2)', r: 'n1*n2' },  // Unary multiplication
  { l: "n1--n2", r:"n1+n2"},        // "--" elimination
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

setRules.allRules =oldRules.concat(rulesFirst,rulesDistrDiv,rulesSucDiv);  // First rule set
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
 { l: 'n+(-c)', r: 'n-c' },               // Solving useless unary 1 
 { l: 'v*(-c)', r: '-c*v' },              // Solving useless unary 2 
 { l: 'v*c', r: 'c*v' },                  // inversion constant with variable
 { l: '(n1^n2)^n3', r:'(n1^(n2*n3))'},    // Power to Power
 defRules[14]
 ];                    
 return setRules;
} // End rulesRationalize


//*******************************************************
//                       expandPower  (AUX)
// Expand recursively a tree "node" for handling with expressions with exponents
//  (it's not for constants, symbols or functions with exponents)
//
// Uses expandPower just with NODE parameter. It's an additional procedure 
// in simplify rational polynomials 
//
//*******************************************************
function expandPower(node,parent,indParent) {
var i, val, no, tp, does;
tp = node.type; 
var internal = (arguments.length>1)   // TRUE in internal calls

if (tp==='OperatorNode') { 
  does = false;
  if (node.op==="^")  {   // First operator: Parenthesis or UnaryMinus
    if ( ( node.args[0].type==="ParenthesisNode" ||  
           node.args[0].type==="OperatorNode" ) 
            && (node.args[1].type==="ConstantNode") )  {   // Second operator: Constant
        val = parseFloat(node.args[1].value);
        does = (val>=2 && Number.isInteger(val));  // Just for integer exponent > 2
    }
  } 

  if (does)  {

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
       var nDirTopo = new m.expression.node.OperatorNode('^', 'pow', [node.args[0].cloneDeep(),new m.expression.node.ConstantNode(val-1)]);
       node = new m.expression.node.OperatorNode("*", "multiply", [nEsqTopo, nDirTopo]);
     } else   // Expo = 2 - no power

//AFTER:  (exponent =  2)
//             operator A --> Subtree
// parent   oper 
//            deep clone (operator A --> Subtree)    
//                            
       node = new m.expression.node.OperatorNode("*", "multiply", [node.args[0], node.args[0].cloneDeep()]);

       // Change parent references in internal recursive calls
     if (internal) 
        if (indParent==="content")
           parent.content = node;
        else
           parent.args[indParent] = node
  }
}
// Recursion in chidren
  if (tp==="ParenthesisNode" ) {
     if (!! node.content)
       expandPower(node.content,node,"content");  
     for (i=0;i<node.args.length;i++)  
       expandPower(node.args[i],node,i);
  } else if (tp!=='ConstantNode' && tp!=='SymbolNode')  
    for (i=0;i<node.args.length;i++)  
      expandPower(node.args[i],node,i);
    
  
 if (! internal )   // return the root node
     return node
}  // End expandPower

/*******************************************************
                   solveEq (expr [,double] ) (EXTRA for testing)

Verify if input is a rationalizable polynomial 
and tranform to an near canonical polýnomials in a single fraction
Get the numerator and denominator from this fraction
Transform the polynomial in the numerator for canonical form 
Solve the equation in the numerator with Durand Kerner method. (require('poly-roots'));
Separate the real solutions. 
Exclude real solutions where denominator get value 0.
Return an array with real solutions or an empty array 

Parameter:
    Expr - expression string
    double (Opt) - if true uses bignumber to check the roots. Default FALSE. 
Returns
    Array with real solutions or empty array
********************************************************/
function solveEq(expr, doub) {
var i;
doub = !! doub;
var jRoots=require('poly-roots');
l('Original Expression: ' + expr);

// Verify if input is a rationalizable polynomial 
// and tranform to an near canonical polýnomials in a single fraction
var obj={scopeAdd:{}, moreThanOne:false}
var node=rationalize(expr,obj);      
if (typeof node==="string") return node;  // return error message

var nume = obj.numerator  
var deno = obj.denominator.toString().replace(/ /g,'');
var hasDivide = (deno!=="1");

//l('Numerator: ' + nume.toString().replace(/ /g,''));
//l('Denominator: ' + (hasDivide ? deno : "1"));

var oSimpl = {reduce:true};  // reduce = true for factoring the lower exponent. 
var eq = polyToCanonical(nume,oSimpl);  // near canonical form to canonical form
var zeroRaiz = oSimpl.hasZero;           // 0 can be a zero root

l('Simplified Expression: ', eq.toString().replace(/ /g,''));

var arrR, arrC, solutions;

var incrExpo = oSimpl.coef        // Coefficients with increasing exponents (for Durand-Kerner)
var decrExpo = incrExpo.slice().reverse();   // Clone and reverte for Jenkins Traub method. 

var vRaizes = jRoots(decrExpo);   
//solutions = fRoots(incrExpo);   // Solving polynomial with Durand-Kerner method

arrR = vRaizes[0,0]; 
arrC = vRaizes[0,1];
var realRoots = [], nCasas;

 // Scanning the roots, excluding those that has a complex part
var nRoots = 0
for (i=0; i < arrR.length;i++)
  if (m.round(arrC[i],5)===0)  {
    nCasas = 5 - Math.round(Math.log10(Math.abs(arrR[i])));
    nCasas = Math.max(0,Math.min(10,nCasas))
    realRoots.push(m.round(arrR[i],nCasas) )
  }
if (hasDivide && zeroRaiz) realRoots.push(0);

// Delete the roots where the denominator get the value 0.
nRoots = realRoots.length;
var scope = {}
if (hasDivide) {
  i=0;
  scope[obj.varName] = realRoots[i]
  while (i<nRoots)  {
    if (m.round(m.eval(deno,scope),8)===0)  {
       realRoots.splice(i,1);
       nRoots --
     } else
       i++ 
  }
}

// showing the roots and evalation the original equation for testing

if (doub) m.config({  number: 'BigNumber',  precision: 64 });


if (nRoots===0)
   l('There is no real root in equation')
else 
    for (i=0;i<realRoots.length ;i++) {
      scope[obj.varName] = realRoots[i]     
      l((i+1)+"a. Root: " + realRoots[i]  + " = " + m.eval(expr, scope).toString() );
    }

if (doub) m.config({  number: 'number'});

l("----------------------------------------------");
return realRoots;
}  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Function solveEq^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


/***********************************************************************************
            PolyToCanonical(node, oExit)    (INTERFACE)
Convert near canonical polynomial in one variable in a canonical polynomial
with one term for each exponentm in decreasing order

Parameters
  node - tre expression or string expression
      The string or tree expression needs to be at below syntax, with free spaces:

         (  (^(-)? | [+-]? )cte (*)? var (^expo)?  | cte )+

       Where "var" is one variable with any valid name
             "cte" are real numeric constants with any value.
                   It can be omitted if equal than 1
             "expo" are integers greater than 0. It can be omitted if equal than 1.
  oExit (Opt)
      reduce -  TRUE if cut lesser zeroed exponents (default false) (INPUT)
      hasZero - TRUE if there is some exponent cut                 (OUTPUT)
      coef    - Coefficients of polynomial sorter by increased exponent (OUTPUT)

Return
    new node tree with one variable polynomial or string error. 
*************************************************************************************/
function polyToCanonical(node,oExit) {
var i;
var coef = []; // coefficients.
if (typeof node==="string") node = stringToNode(node);
if (typeof node==="string") return "Invalid expression: " + node;
var reduce = false;
var hasObj = arguments.length===2;
if (hasObj) {
   if (typeof oExit !== "object")  return "Second optional parameter needs to be an object"
   oExit.coef = coef;
   reduce = !!oExit.reduce
}

var maxExpo=0;   // maximum exponent
var varname="";  // var name

var op,no,n1,n2,n3;

coef[0] = 0; 
var o = {};
o.cte=1; o.oper="+"; o.fire="";   // o.noFil,  noPai

try {
recurPol(node,null,o);    
// l(coef, maxExpo);
maxExpo = coef.length-1;
var first=true;

var nRed = 0;   // Calculates the lesser exponent, that in polynominal with all coefficients is 0.
if (reduce) {
  for (i=0;i<maxExpo;i++)  {
    if (coef[i]!==0) break
    nRed++;
  }
}

if (hasObj) oExit.hasZero = (nRed>0);
if (nRed>0) { 
    coef.splice(0,nRed);
    maxExpo -= nRed;
}
for (i=maxExpo;i>=0 ;i--)  {
   if (coef[i]===0)  continue;

//  x^2 - 5x + 3
//
//                 +
//             -       3 
//          ^      *
//         x 2    5 x
   
   
   n1  = new m.expression.node.ConstantNode(first ? coef[i] : Math.abs(coef[i]));
   op = coef[i]<0 ? "-" : "+";
   if (i>0)   {  // Is not a constant without variable 
     n2 = new m.expression.node.SymbolNode(varname);    
     if (i>1)    {
       n3 =  new m.expression.node.ConstantNode(i);     
       n2 = new m.expression.node.OperatorNode('^', 'pow', [n2, n3]); 
     }
     if (coef[i]===-1  && first) 
       n1 = new m.expression.node.OperatorNode('-', 'unaryMinus', [n2]);          
     else if (Math.abs(coef[i])===1)  
       n1 = n2;
     else
       n1 = new m.expression.node.OperatorNode('*', 'multiply', [n1, n2]); 
   }
   if (first)   
     no = n1;
   else if (op==="+")
     no = new m.expression.node.OperatorNode('+', 'add', [no, n1]);
   else
     no = new m.expression.node.OperatorNode('-', 'subtract', [no, n1]);

   first = false;
 }
 if (first) 
    return new m.expression.node.ConstantNode(0);
 else
    return no;
}
catch (e) {
 return e;
}

/*---------------------------------------------------------
                         recurPol
   Recursive function preparing to convert polynomial expression
   in canonical form
/*---------------------------------------------------------*/
function recurPol(node,noPai,o) {

var i, valor, no, tp;
tp = node.type; 
if (tp==='FunctionNode')            // ***** FunctionName *****
   throw "There is an unsolved function call"   // No function call in polynomial expression

else if (tp==='OperatorNode')  {    // ***** OperatorName *****
  if ("+-*^".indexOf(node.op) === -1) throw "Operator " + node.op + " invalid";
  if (noPai!==null)  {
      // -(unary),^  : children of *,+,-
    if ( (node.fn==="unaryMinus" || node.fn==="pow") && noPai.fn!=="add" &&  noPai.fn!=="subtract"  &&  noPai.fn!=="multiply" )
         throw "Invalid " + node.op +  " placing"
      // -,+,* : children of +,- 
    if ((node.fn==="subtract" || node.fn==="add" || node.fn==="multiply")  && noPai.fn!=="add" &&  noPai.fn!=="subtract" )
          throw "Invalid " + node.op +  " placing"
     // -,+ : first child
    if ((node.fn==="subtract" || node.fn==="add" || node.fn==="unaryMinus" ) && o.noFil!==0 )
          throw "Invalid " + node.op +  " placing"
  }     
  // ^,&,-(unary): firers
  if (node.op==="^" || node.op==="*") o.fire = node.op;

      
  for (i=0;i<node.args.length;i++)  {
     // +,-: reset fire
     if (node.fn==="unaryMinus") o.oper="-";
     if (node.op==="+" || node.fn==="subtract" ) { 
         o.fire = "";  o.cte = 1; o.oper = (i===0 ? "+" : node.op);
     }
     o.noFil = i;
     recurPol(node.args[i],node,o);
  }

} else if (tp==='SymbolNode') {      // ***** SymbolName *****
   if (node.name !== varname && varname!=="")
      throw "There is more than one variable"
   varname = node.name;   
   if (noPai === null)  {
      coef[1] = 1; 
      return true;
    }   

    // ^: Symbol is First child
   if (noPai.op==="^" && o.noFil!==0 ) 
        throw "In power the variable should be the first parameter"

    // *: Symbol is Second child 
   if (noPai.op==="*" && o.noFil!==1 ) 
        throw "In multiply the variable should be the second parameter"

    // Symbol: firers "",*
   if (o.fire==="" || o.fire==="*" )   {
      if (maxExpo<1) coef[1]=0;
      coef[1] += (o.oper==="+" ? 1 : -1) * o.cte;
      maxExpo = Math.max(1,maxExpo);
   }

} else if (tp==='ConstantNode') {
  valor =  parseFloat(node.value);
  if (noPai === null)  {
    coef[0] = valor;
    return true;
  }   
  if (noPai.op==="^")  {
     // cte: second  child of power
     if (o.noFil!==1) throw  "Constant cannot be powered"

     if (! Number.isInteger(valor) || valor<=0 )
       throw "Non-integer exponent is not allowed";

     for (i=maxExpo+1;i<valor;i++) coef[i]=0;
     if (valor>maxExpo) coef[valor]=0;
     coef[valor] += (o.oper==="+"? 1 : -1) * o.cte; 
     maxExpo = Math.max(valor,maxExpo);
     return true
  }
  o.cte = valor;

  // Cte: firer ""
  if (o.fire==="")  
    coef[0] += (o.oper==="+"? 1 : -1) * o.cte;


} else 

   throw "Type " + tp + " is not allowed";
return true;
} // End recurPol
 
} // End polyToCanonical


/*********************************
            stringtoNode (AUX)
Convert string to node
**********************************/
function stringToNode(expr) {
var node;
try   {
  node = m.parse(expr);    
  return node;
}
catch (e)   {
   return e.message 
}
}

/*************************************************
// l - abreviatura do console.log();
//*************************************************/
function l()
{ return console.log.apply(null, arguments); }


module.exports = {
  isPolynomial: isPolynomial,
  rationalize: rationalize,
  denominator: denominator,
  numerator: numerator,
  polyToCanonical: polyToCanonical,
  solveEq: solveEq
}