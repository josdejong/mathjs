**Philosophy of the test**
=========================

`isPolynomial` - it’s a very simple recursive function. I’ve tried with some nice expressions    
and all error types. 12 runs.
      
`Rationalize` – it uses **isPolynomial** and an auxiliary function (_expandPower_) to handle with    
polynomial powers and other auxiliary function (_rulesRationalize_) to gather the set of rules   
to simplify `Mathjs` function, and prepares the result for numerator and denominator functions.    

`polyToCanonical` – it’s more complex recursive function with 44 runs of test, to encompass all possible situations.

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
