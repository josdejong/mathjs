'use strict';

var assert = require('assert');
var math = require('../../../index'); 

// **********************************
//         throwAssertionError
// Throw error if is an assertion error
// ***********************************
function throwAssertionError(err) {
  if (typeof err==="string")
     return;
  if (err.message.slice(0,9)==="Assertion") {
     if (err instanceof Error) {
       console.log(err.stack);
     } else {
       console.log(new Error(err));
     }
     throw err;
  }
} // throw assertion error


///////////////////// rationalize ///////////////////////
describe('rationalize', function() {
  this.timeout(15000);
  
  function rationalizeAndCompareError(left, right, scope) {
    try {
      if (scope===undefined) scope={};
      var ret = math.rationalize(left,adic).toString()
      assert.equal(ret,right);
    } catch (err) {
        throwAssertionError(err)
        try  {
          var mess=typeof err==="string"  ? err : err.message; 
          assert.equal(mess,right); 
        } catch (err) {   
          throwAssertionError(err)
        }
    } // external catch
  } // rationalizeAndCompareError


  function rationalizeAndCompareExpr(left, right, scope, varRight, coeffRight) {
    try {
      if (scope===undefined) scope={};
      var retRationalize = math.rationalize(left,scope,true)
      var expr = retRationalize.expression.toString().replace(/ /g,'');
      assert.equal(expr,right);
      if (arguments.length>=4)
         assert.equal(retRationalize.variables.join(",")===varRight);
      if (arguments.length===5)
         assert.equal(retRationalize.coefficients.join(",")===coeffRight);
    } catch (err) {
      throwAssertionError(err)
      try  {
        var mess=typeof err==="string"  ? err : err.message; 
        if ( (typeof err==="object") && (err instanceof TypeError) )
          assert.equal("TypeError",right); 
        else 
          assert.equal(mess,right); 
      } catch (err) {   
        throwAssertionError(err)
      }
    }
  } // rationalizeAndCompareExpr
  

  it('invalid expression', function() {
    rationalizeAndCompareError('(x*/2)','Value expected (char 4)');
  });

  it('valid expression but not appropriate', function() {
    rationalizeAndCompareError('a=2','Unimplemented node type in simplifyConstant: AssignmentNode');  
    rationalizeAndCompareError('sin(x)+x','There is an unsolved function call'); 
    rationalizeAndCompareError('(x+2)/(x % 2)','Operator % invalid in polynomial expression'); 
  });

  it('non-integer exponent', function() {
    rationalizeAndCompareError('x^2.5 - 2*x + 3','There is a non-integer exponent');  
    rationalizeAndCompareError('x^x','There is a non-integer exponent'); 
    rationalizeAndCompareError('x^2.5','There is a non-integer exponent'); 
  });

  it('calling error', function() {
    rationalizeAndCompareError('x^2 + 2*x + 3','Type Error: Second optional parameter should be a Scope object',23);   
  });
 
  it('processing constant expressions', function() {
    rationalizeAndCompareExpr('-2+3+32-32','1');     
    rationalizeAndCompareExpr('1^2 + 20 + 3','24');  
  });

  it('processing simple expressions', function() {
    rationalizeAndCompareExpr('x','x'); 
    rationalizeAndCompareExpr('-x','-x');
    rationalizeAndCompareExpr('2x','2*x');
    rationalizeAndCompareExpr('-2x','-2*x');
    rationalizeAndCompareExpr('x^2','x^2');
    rationalizeAndCompareExpr('2x^2','2*x^2');
    rationalizeAndCompareExpr('-2x^2','-2*x^2');
    rationalizeAndCompareExpr('x+1','x+1');
    rationalizeAndCompareExpr('2x+1','2*x+1');
    rationalizeAndCompareExpr('-2x+1','-2*x+1');
    rationalizeAndCompareExpr('-2x-1','-2*x-1');
    rationalizeAndCompareExpr('x^2-2x-5','x^2-2*x-5');
    rationalizeAndCompareExpr('3x^2-2x-5','3*x^2-2*x-5');
    rationalizeAndCompareExpr('-3x^2-2x-5','-3*x^2-2*x-5');
    rationalizeAndCompareExpr('4x^4-3x^2-2x-5','4*x^4-3*x^2-2*x-5');
    rationalizeAndCompareExpr('-4x^4+3x^2-2x-5','-4*x^4+3*x^2-2*x-5');
    rationalizeAndCompareExpr('-4x^4+3x^2-2x-1','-4*x^4+3*x^2-2*x-1');
    rationalizeAndCompareExpr('-4x^4+3x^2-2x','-4*x^4+3*x^2-2*x');
  });

  it('testing additional parameters', function() {
    var variables = [];
    var coefficients= [];
    rationalizeAndCompareExpr('x+x+x+y','3*x+1',{y:1});
    rationalizeAndCompareExpr('x+x+x+y','3*x+y',{});
    rationalizeAndCompareExpr('x+x+x+y','3*x+y',{},'x,y');
    rationalizeAndCompareExpr('-2+5x^2','5*x^2-2',{},'x','-2,0,5');
  });


  it('processing simple and reducible expressions', function() {
    rationalizeAndCompareExpr('x+x+x','3*x');
    rationalizeAndCompareExpr('x-x','0');
    rationalizeAndCompareExpr('5x^2-5x^2','0');
    rationalizeAndCompareExpr('2-3x','-3*x+2');
    rationalizeAndCompareExpr('5x^2-3x-5x^2','-3*x');
    rationalizeAndCompareExpr('-5x^2-3x+5x^2','-3*x'); 
    rationalizeAndCompareExpr('-5 -2x^2 + 4x^4','4*x^4-2*x^2-5');
    rationalizeAndCompareExpr('-5 -2x^2 + 4x^4+5+2x^2-2x^4','2*x^4');
    rationalizeAndCompareExpr('-5 -2x^2 + 4x^4+5+2x^2-4x^4','0');
    rationalizeAndCompareExpr('-5 -2x^3 + 5*x^2 + 3*x^6 - 17x^4 + 2 x^5','3*x^6+2*x^5-17*x^4-2*x^3+5*x^2-5');
    rationalizeAndCompareExpr('x^2^2','x^4');
    rationalizeAndCompareExpr('x*2*2','4*x');
    rationalizeAndCompareExpr('x*5','5*x');
  });

  it('processing 2 variable expressions', function() {
    rationalizeAndCompareExpr('x+y','x+y');
    rationalizeAndCompareExpr('x^2 + 2*x*y + 3','x^2+2*x*y+3');
    rationalizeAndCompareExpr('2x/y - y/(x+1)','(2*x^2-y^2+2*x)/(x*y+y)');
  });

  it('processing power expressions', function() {
    rationalizeAndCompareExpr('(2x+1)^6','64*x^6+192*x^5+240*x^4+160*x^3+60*x^2+12*x+1');
    rationalizeAndCompareExpr('(2x+1)^3/(x-2)^3','(8*x^3+12*x^2+6*x+1)/(x^3-6*x^2+12*x-8)');
  });

  it('processing tougher expressions', function() {
    rationalizeAndCompareExpr('2x/(x+2) - x/(x+1)','x^2/(x^2+3*x+2)');
    rationalizeAndCompareExpr('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3','(-20*x^4+28*x^3+104*x^2+6*x-12)/(6*x^2+5*x-4)');
    rationalizeAndCompareExpr('x/(1-x)/(x-2)/(x-3)/(x-4) + 2x/ ( (1-2x)/(2-3x) )/ ((3-4x)/(4-5x) )',
          '(-30*x^7+344*x^6-1506*x^5+3200*x^4-3472*x^3+1846*x^2-381*x)/(-8*x^6+90*x^5-383*x^4+780*x^3-797*x^2+390*x-72)');
    var no = math.parse('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3'); 
    rationalizeAndCompareExpr(no,'(-20*x^4+28*x^3+104*x^2+6*x-12)/(6*x^2+5*x-4)');
  });


///////////////////// polynomial ///////////////////////
  describe('polynomial', function() {

    function polynomialAndCompareError(left, right, extension) {
      try {
        extension = !! extension;
        var retPoly = math.polynomial(left,{},extension);
        var expr = retPoly.expression.toString(); 
        assert.equal(expr,right)
      } catch (err) {
        throwAssertionError(err)
        try  {
          var mess=typeof err==="string"  ? err : err.message; 
          assert.equal(mess,right); 
        } catch (err) {   
          throwAssertionError(err)
        }
      }
    } // polynomialAndCompareError


    function polynomialAndCompareCte(left, right, extension) {
      try {
        extension = !! extension;
        var retPoly = math.polynomial(left,{},extension)
        var expr = retPoly.expression.toString().replace(/ /g,''); 
        assert.equal(expr,right)
      } catch (err) {
        throwAssertionError(err);
        try  {
          var mess=typeof err==="string"  ? err : err.message; 
          assert.equal(mess,right); 
        } catch (err) {   
          throwAssertionError(err);
        } 
      }
    } // PolynomialAndCompareCte


    function polynomialAndCompareExpr(left, right, extension, checkVars, scope) {
      if (scope===undefined) scope={};
      try {
        var retPoly = math.polynomial(left,scope,extension)
        var expr = retPoly.expression.toString().replace(/ /g,''); 
        assert.equal(expr,right);
        assert.equal(retPoly.variables.join(","),checkVars);
      } catch (err) {
        throwAssertionError(err);
        try  {
          var mess=typeof err==="string"  ? err : err.message; 
          assert.equal(mess,right); 
        } catch (err) {   
          throwAssertionError(err);
        }
      }
    } // polynomialAndCompareExpr


    it('Invalid expression', function() {
      polynomialAndCompareError('(x*/2)','Value expected (char 4)');   
    });
    
    it('Valid expression but not appropriate', function() {
      polynomialAndCompareError('sin(x)+x','There is an unsolved function call');     
      polynomialAndCompareError('x^2.5 - 2*x + 3','There is a non-integer exponent'); 
      polynomialAndCompareError('a=2','Invalid polynomial expression');  
    });

    it('Divide in expression can be accept or not', function() {
      polynomialAndCompareError('(x+2)/(x % 2)','Operator / invalid in polynomial expression');
      polynomialAndCompareError('(x+2)/(x % 2)','Operator % invalid in polynomial expression',true);
    });

    it('Constant expression', function() {
      polynomialAndCompareCte('1^2 + 20 + 3','24');
    });


    it('2 variable expression', function() {
      polynomialAndCompareExpr('x^2 + 2*x*y + 3','x^2+2*x*y+3',false,'x,y');   
    });

    it('2 variable expression with scope', function() {
      polynomialAndCompareExpr('x^2 + 2*x*y + 3','x^2+10*x+3',false,'x',{y:5});
      polynomialAndCompareExpr('sin(y)+x','x+0.49999999999999994',false,'x',{y:math.PI/6})     
    });

    it('Miscelaneous  expressions', function() {
      polynomialAndCompareExpr('x^2 + 2*x + 3','x^2+2*x+3',false,'x');
      polynomialAndCompareExpr('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3',
        'x*2/((2*x-1)/(3*x+2))-x*5/((3*x+4)/(2*x^2-5))+3',true,'x');
      var no = math.parse('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3');
      polynomialAndCompareExpr(no,'x*2/((2*x-1)/(3*x+2))-x*5/((3*x+4)/(2*x^2-5))+3',true,'x');
    });


  })  // Describe polynomial


})  // Describe rationalize

