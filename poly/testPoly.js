"use strict";
var p = require("./poly.js");
var m = require('mathjs'); 

testIsPoly()
testRatio();
testCanon();
testSolve();

/*************************************************************
                  testFunc 
 Function to test IsPolynomial/Rationalize function
**************************************************************/
function testFunc(func,expr,obj,stri) {
var i, ret
var print = typeof(expr)==="string" ? expr : "No " + expr.toString().replace(/ /g,'');
if (arguments.length<3)  {
   ret = func(expr);
   if (typeof ret!=="string")  ret = ret.toString().replace(/ /g,''); 
   console.log(func.name +'("' + print + '") = ' + ret);
} else {
  ret = func(expr,obj)
  if (typeof ret!=="string")  ret = ret.toString().replace(/ /g,''); 
  console.log(func.name  +'("' + print + '",' + stri + ") = " + ret);
}
}

/*************************************************
            testIsPoly
test "isPolynomial" function
*************************************************/
function testIsPoly() {
obj={};
testFunc(p.isPolynomial,"(x*/2)");
testFunc(p.isPolynomial,"1^2 + 20 + 3");
testFunc(p.isPolynomial,"sin(x)+x");
testFunc(p.isPolynomial,"x^2.5 - 2*x + 3");
testFunc(p.isPolynomial,"(x+2)/(x % 2)");
testFunc(p.isPolynomial,"x^2 + 2*x*y + 3");
obj.moreThanOne = false;
testFunc(p.isPolynomial,"x^2 + 2*x*y + 3",obj,"{moreThanOne:false}");
var obj={moreThanOne:true};
testFunc(p.isPolynomial,"x^2 + 2*x*y + 3",obj,"{moreThanOne:true}");
testFunc(p.isPolynomial,"a=2");
testFunc(p.isPolynomial,"x^2 + 2*x + 3",23,"23");
testFunc(p.isPolynomial,"2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3"); 
var no = m.parse("2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3");
testFunc(p.isPolynomial,no); 
}

/*************************************************
            testRatio
test "rationalize" function
*************************************************/
function testRatio() {
testFunc(p.rationalize,"a=2");
testFunc(p.rationalize,"sin(x)+x");
testFunc(p.rationalize,"x^2 + 2*x*y + 3");
testFunc(p.rationalize,"x^2.5 - 2*x + 3");
testFunc(p.rationalize,"1^2 + 20 + 3");
testFunc(p.rationalize,"x^2 + 2*x + 3",23,"23");
testFunc(p.rationalize,"(x+2)/(x % 2)");
testFunc(p.rationalize,"(x*/2)");
testFunc(p.rationalize,"2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3"); 
testFunc(p.rationalize,"x/(1-x)/(x-2)/(x-3)/(x-4) + 2x/ ( (1-2x)/(2-3x) )/ ((3-4x)/(4-5x) )"); 
testFunc(p.rationalize,"(2x+1)^6"); 
var no = m.parse("2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3");
testFunc(p.rationalize,no); 
}


/*************************************************
            testCanon
test "polyToCanonical" function
*************************************************/
function testCanon() {
testFunc(p.polyToCanonical,"-2");
testFunc(p.polyToCanonical,"2-3");
testFunc(p.polyToCanonical,"-2-3");
testFunc(p.polyToCanonical,"-2+3");
testFunc(p.polyToCanonical,"-2+3+32");
testFunc(p.polyToCanonical,"-2+3+32-32");
testFunc(p.polyToCanonical,"x");
testFunc(p.polyToCanonical,"-x");
testFunc(p.polyToCanonical,"2x");
testFunc(p.polyToCanonical,"-2x");
testFunc(p.polyToCanonical,"x^2");
testFunc(p.polyToCanonical,"2x^2");
testFunc(p.polyToCanonical,"-2x^2");
testFunc(p.polyToCanonical,"x+1");
testFunc(p.polyToCanonical,"2x+1");
testFunc(p.polyToCanonical,"-2x+1");
testFunc(p.polyToCanonical,"-2x-1");
testFunc(p.polyToCanonical,"x^2-2x-5");
testFunc(p.polyToCanonical,"3x^2-2x-5");
testFunc(p.polyToCanonical,"-3x^2-2x-5");
testFunc(p.polyToCanonical,"4x^4-3x^2-2x-5");
testFunc(p.polyToCanonical,"-4x^4+3x^2-2x-5");
testFunc(p.polyToCanonical,"-4x^4+3x^2-2x-1");
testFunc(p.polyToCanonical,"-4x^4+3x^2-2x");
testFunc(p.polyToCanonical,"x+x+x");
testFunc(p.polyToCanonical,"x-x");
testFunc(p.polyToCanonical,"5x^2-5x^2");
testFunc(p.polyToCanonical,"2-3x");
testFunc(p.polyToCanonical,"5x^2-3x-5x^2");
testFunc(p.polyToCanonical,"-5x^2-3x+5x^2");
testFunc(p.polyToCanonical,"-5 -2x^2 + 4x^4");
testFunc(p.polyToCanonical,"-5 -2x^2 + 4x^4+5+2x^2-2x^4");
testFunc(p.polyToCanonical,"-5 -2x^2 + 4x^4+5+2x^2-4x^4");
testFunc(p.polyToCanonical,"2+-3");
testFunc(p.polyToCanonical,"-5 -2x^3 + 5*x^2 + 3*x^6 - 17x^4 + 2 x^5");
testFunc(p.polyToCanonical,"x^2^2"); 
testFunc(p.polyToCanonical,"x*2*2");
testFunc(p.polyToCanonical,"x+y");
testFunc(p.polyToCanonical,"x^x");
testFunc(p.polyToCanonical,"x*5");
testFunc(p.polyToCanonical,"2^2");
testFunc(p.polyToCanonical,"x^2.5");
testFunc(p.polyToCanonical,"5 % 2");
testFunc(p.polyToCanonical,"5 2");
}


/*************************************************
            testSolve
test "solve" function
*************************************************/
function testSolve() {
var expr;
funcSolve('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3'); 
funcSolve("(2x-1)^6");
funcSolve("x^3 - 6x^2 + 11x^2 -6 = 0");
funcSolve("x^5 - 11x^4 + 43x^3 - 73x^2 + 56x - 16");
funcSolve("5x^4 - 44x^3 + 129x^2 - 146x + 56"); 
funcSolve("x^5-113x^4+1333x^3-3331x^2+3110*x-1000");
funcSolve("x^9-1000092x^8+92003682x^7-3682083720x^6+83721182769x^5-1182779630508x^4 +10630567354028x^3-59354216204400x^2+1.882046594592e14x-2.594592e14",true)
funcSolve("x^7+8.638x^6+31.977876x^5+65.76783164x^4+81.15750424376x^3+60.0890161420799x^2+24.7166153064422x+4.3571861840213822");
funcSolve("x/(1-x)/(x-2)/(x-3)/(x-4) + 2x/ ( (1-2x)/(2-3x) )/ ((3-4x)/(4-5x) )");
funcSolve("(x - 4)*(x - 3)*(x - 2)*(x - 1)*(2 x - 1)*(4 x - 3)");
}

/*************************************************
          funcSolve (aux)
Helps test "solve" function
*************************************************/
function funcSolve(expr,param) {
  var ret;
  if (arguments.length===2)
    ret = p.solveEq(expr,param)
  else 
    ret = p.solveEq(expr);
  if (typeof ret === "string") l(ret);
}

/*************************************************
// l - abreviatura do console.log();
//*************************************************/
function l()
{ return console.log.apply(null, arguments); }
