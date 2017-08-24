**isPolynomial**
================
**Syntax:**  _isPolynomial (expr [, obj] )_  
Function to check is expression is a polynomial expression

**Parameters**     
`expr` - string or expression tree  _(input)_   
`obj`  - input/output of parameters _(optional)_   
&nbsp;&nbsp;&nbsp;&nbsp;`.moreThanOne` - Default false. if true accepts expression with   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;more than one variable. _(input)_  
&nbsp;&nbsp;&nbsp;&nbsp;`.varName` - variable name _(output)_   
&nbsp;&nbsp;&nbsp;&nbsp;`.numVar` - number of variables. _(output)_   
**returns**   
   true or error message   

**rationalize**    
===============
     
**Syntax:**    rationalize(expr [, obj] )     
Transform a rationalizable expression in a division of two    
near canonical polynomials (fraction). A near canonical polynomial is a sum of
terms of the form   `c * x^n` onde **c** é uma constante real **x** é uma variável 
e **n** é um expoente inteiro positivo, it may contain terms with the same exponent and
any order. 
    
**Parameters**    
`node` - string or tree expression _(input)_   
`obj` _(optional)_    
&nbsp;&nbsp;&nbsp;&nbsp;`.scopeAdd` - Scope of expression _(input)_     
&nbsp;&nbsp;&nbsp;&nbsp;`.moreThanOne` - true if accepts more than one variable.     
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default = false _(input)_     
&nbsp;&nbsp;&nbsp;&nbsp;`.numerator` - numerator in a tree expression _(output)_      
&nbsp;&nbsp;&nbsp;&nbsp;`.denominator` - denominator in a tree expression _(output)_    
     
**Return**    
   Tree expression or error message     


**numerator**
=============
**Syntax:**   _numerator (expr [, obj] )_
    
Get a numerator with near canonical polynomial from a rationalizable expression. Uses     
directly the _rationalize_ function 
   
**Parameters**    
`expr` - string or tree expression  _(input)_   
`obj` - input/output of parameters _(optional)_   
&nbsp;&nbsp;&nbsp;&nbsp;`.scopeAdd` - Expression scope _(input)_   
&nbsp;&nbsp;&nbsp;&nbsp;`.moreThanOne` - true if accepts more than one variable.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default = false _(input)_   

**Return**   
   Tree expression or error message   
   
**denominator**  
=============== 
**Syntax:**    _denominator(expr [, obj] )_    
    
Get a denominator with near canonical polynomial from a rationalizable expression. Uses      
directly the _rationalize_ function 

**Parameters**    
`expr` - string or tree expression _(input)_    
`obj` _(optional)_     
&nbsp;&nbsp;&nbsp;&nbsp;`.scopeAdd` - Expression scope _(input)_     
&nbsp;&nbsp;&nbsp;&nbsp;`.moreThanOne` -TRUE if accepts more than one variable.    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default = false _(input)_    

**Return**    
   Tree expression or error message    
     

**PolyToCanonical**
===================
**Syntax:** PolyToCanonical(node  [, oExit ])     
Convert near canonical one variable polynomial in a canonical polynomial   
with one term for each exponentm in decreasing order.    

**Parameters**    
`node` - tre expression or string expression    
The string or tree expression needs to be at below syntax, with free spaces:   
(  (^(-)? | [+-]? )cte (*)? var (^expo)?  | cte )+    
Where `var` is one variable with any valid name   
&nbsp;&nbsp;&nbsp;&nbsp;`cte` are real numeric constants with any value.   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It can be omitted if equal than 1   
&nbsp;&nbsp;&nbsp;&nbsp;`expo` are integers greater than 0. It can be omitted if equal than 1.   

`oExit`    
&nbsp;&nbsp;&nbsp;&nbsp;`.reduce` -  true if cut lesser zeroed exponentes. Default false. _(input)_   
&nbsp;&nbsp;&nbsp;&nbsp;`.hasZero` - true if there is some exponent cut   _(output)_    
&nbsp;&nbsp;&nbsp;&nbsp;`.coef`    - Coefficients of polynomial sorter by increased exponent _(output)_   
    
**Return**   
    new tree expression or string error.    
