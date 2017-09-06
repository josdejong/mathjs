'use strict';

var assert = require('assert');
var math = require('../../../index');  // for local test: require('./poly.js')
var m=math;                            // for local test:  require('mathjs')

describe('rationalize', function() {
  this.timeout(15000);

  function rationalizeAndCompareError(left, right, adic) {
    try {
        adic = !! adic
        if (! adic)
          assert.equal(math.rationalize(left).toString(),right)
        else
          assert.equal(math.rationalize(left,adic).toString(),right)
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log(new Error(err));
        }
        throw err;
    }
  } // rationalizeAndCompareError


  function rationalizeAndCompareExpr(left, right) {
  try {
      assert.equal(math.rationalize(left).toString().replace(/ /g,''),right);
   } catch (err) {
       if (err instanceof Error) {
           console.log(err.stack);
        } else {
           console.log(new Error(err));
        }
        throw err;
   }
  } // rationalizeAndCompareExpr


  it('invalid expression', function() {
    rationalizeAndCompareError('(x*/2)','Value expected (char 4)');
  });

  it('valid expression but not appropriate', function() {
      rationalizeAndCompareError('a=2','Invalid polynomial expression');  
      rationalizeAndCompareError('sin(x)+x','There is an unsolved function call'); 
      rationalizeAndCompareError('(x+2)/(x % 2)','Operator % invalid in polynomial expression'); 
  });

  it('non-integer exponent', function() {
    rationalizeAndCompareError('x^2.5 - 2*x + 3','There is a non-integer exponent');  
    rationalizeAndCompareError('x^x','There is a non-integer exponent'); 
    rationalizeAndCompareError('x^2.5','There is a non-integer exponent'); 
  });

  it('calling error', function() {
    rationalizeAndCompareError('x^2 + 2*x + 3','Second optional parameter should be a Scope object',23);   
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

  it('processing power expressions', function() {
    rationalizeAndCompareExpr('2x/(x+2) - x/(x+1)','x^2/(x^2+3*x+2)');
    rationalizeAndCompareExpr('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3','(-20*x^4+28*x^3+104*x^2+6*x-12)/(6*x^2+5*x-4)');
    rationalizeAndCompareExpr('x/(1-x)/(x-2)/(x-3)/(x-4) + 2x/ ( (1-2x)/(2-3x) )/ ((3-4x)/(4-5x) )',
          '(-30*x^7+344*x^6-1506*x^5+3200*x^4-3472*x^3+1846*x^2-381*x)/(-8*x^6+90*x^5-383*x^4+780*x^3-797*x^2+390*x-72)');
    var no = m.parse('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3'); 
    rationalizeAndCompareExpr(no,'(-20*x^4+28*x^3+104*x^2+6*x-12)/(6*x^2+5*x-4)');
  });


describe('getPolynomial', function() {

  function getPolynomialAndCompareError(left, right, extension) {
    try {
        extension = !! extension;
        assert.equal(math.getPolynomial(left,{},[],extension).toString(),right)
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log(new Error(err));
        }
        throw err;
    }
  } // getPolynomialAndCompareError


  function getPolynomialAndCompareCte(left, right, extension) {
    try {
        extension = !! extension;
        assert.equal(math.getPolynomial(left,{},[],extension).toString().replace(/ /g,''),right)
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log(new Error(err));
        }
        throw err;
    }
  } // getPolynomialAndCompareCte


  function getPolynomialAndCompareExpr(left, right, extension, checkVars, scope) {
  var varNames = [];
  if (scope===undefined) scope={};
  try {
      assert.equal(math.getPolynomial(left,scope,varNames,extension).toString().replace(/ /g,''),right);
      assert.equal(varNames.join(","),checkVars);
   } catch (err) {
       if (err instanceof Error) {
           console.log(err.stack);
        } else {
           console.log(new Error(err));
        }
        throw err;
   }
  } // getPolynomialAndCompareExpr


  it('Invalid expression', function() {
    getPolynomialAndCompareError('(x*/2)','Invalid expression: Value expected (char 4)');   
  });
  
  it('Valid expression but not appropriate', function() {
    getPolynomialAndCompareError('sin(x)+x','There is an unsolved function call');     
    getPolynomialAndCompareError('x^2.5 - 2*x + 3','There is a non-integer exponent'); 
    getPolynomialAndCompareError('a=2','Invalid polynomial expression');  
  });

  it('Divide in expression can be accept or not', function() {
    getPolynomialAndCompareError('(x+2)/(x % 2)','Operator / invalid in polynomial expression');
    getPolynomialAndCompareError('(x+2)/(x % 2)','Operator % invalid in polynomial expression',true);
  });

  it('Constant expression', function() {
    getPolynomialAndCompareCte('1^2 + 20 + 3','24');
  });


  it('2 variable expression', function() {
      getPolynomialAndCompareExpr('x^2 + 2*x*y + 3','x^2+2*x*y+3',false,'x,y');   
  });

  it('2 variable expression with scope', function() {
    getPolynomialAndCompareExpr('x^2 + 2*x*y + 3','x^2+10*x+3',false,'x',{y:5});
    getPolynomialAndCompareExpr('sin(y)+x','x+0.49999999999999994',false,'x',{y:m.PI/6})     
  });

  it('Miscelaneous  expressions', function() {
    getPolynomialAndCompareExpr('x^2 + 2*x + 3','x^2+2*x+3',false,'x');
    getPolynomialAndCompareExpr('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3',
      'x*2/((2*x-1)/(3*x+2))-x*5/((3*x+4)/(2*x^2-5))+3',true,'x');
    var no = m.parse('2x/( (2x-1) / (3x+2) ) - 5x/ ( (3x+4) / (2x^2-5) ) + 3');
    getPolynomialAndCompareExpr(no,'x*2/((2*x-1)/(3*x+2))-x*5/((3*x+4)/(2*x^2-5))+3',true,'x');
  });


 })  // Describe getPolynomial


describe('numerator and denominator', function() {

  function fractionPartAndCompareExpr(func, left, right) {
    try {
        assert.equal(func(left).toString().replace(/ /g,''),right)
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log(new Error(err));
        }
        throw err;
    }
  } // fractionPartAndCompareExpr
   

  it('numerator', function() {
    fractionPartAndCompareExpr(math.numerator,'2x/y - y/(x+1)','2*x^2-y^2+2*x')
  });


  it('denominator', function() {
     fractionPartAndCompareExpr(math.denominator,'2x/y - y/(x+1)','x*y+y')
  });

})  // Describe numerator and denominator

})  // Describe rationalize
