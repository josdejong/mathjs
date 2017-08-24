**Philosophy of the test**
=========================

`isPolynomial` - it’s a very simple recursive function. I’ve tried with some nice expressions    
and all error types. I've run 12 tests.

`polyToCanonical` – it’s more complex recursive function. I've run 44 tests, to encompass all possible situations.

`Rationalize` – it uses **isPolynomial** and an auxiliary function (_expandPower_) to handle with    
polynomial powers and other auxiliary function (_rulesRationalize_) to gather the set of rules   
to simplify `Mathjs` function, and prepares the result for numerator and denominator functions. I've run 12 tests.    

Notice that one particular expression is very hard do simplify because there are many cycles to run until no
more changes. 

>  "x/(1-x)/(x-2)/(x-3)/(x-4) + 2x/ ( (1-2x)/(2-3x) )/ ((3-4x)/(4-5x) )"

Particularly hard is the combination of sucessive divisions with fraction sum / subtraction.

`solveEq` – It’s not part of package. It uses a NPM compatible package (`poly-roots`) to solve polynomials with   
one variable equation that needs to receive the coefficients in an array. To use this package,
**solveEq** prepares the   
polynomial using rationalize and poly to Canonical. It’s a simple mode to see that the original equation is    
equivalent to final equation, because **SolveEq** replaces variable with the found roots to check the method accuracy.  

I’ve run 10 different equations.    

One of equations it’s big:

>  "x^9-1000092x^8+92003682x^7-3682083720x^6+83721182769x^5-1182779630508x^4 +10630567354028x^3
>  -59354216204400x^2+1.882046594592e14x-2.594592e14"

It has demanded the use of _BigNumber_ from `Mathjs`, to check one of the roots.    
