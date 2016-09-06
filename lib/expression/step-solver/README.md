## A step by step solver for math.

https://www.youtube.com/watch?v=ay6GjmiJTPM

step(expr) should return exp reduced by one step

simplify(expr) should return a fully simplified expression

To run just stepper tests:

`./node_modules/mocha/bin/mocha ./test/expression/step-solver/`


--------

## BIG DETAILED TODO (in approx this order)

CLEANING THE CODE

- make functions to generate nodes
- make functions to check type of node
- add to this readme notes about things people should know to work on this
 - node types
 - what implicit means
 - to run the stepper tests `./node_modules/mocha/bin/mocha ./test/expression/step-solver/`
 - other stuff?
- note that a polynomial term is only defined as having one symbol 
 - (so 2x^2y would be 2x^2 * y)

SUBTRACTION SUPPORT

- at beginning 'resolve' all unary minuses after addition signs
 - (say it's a step, but don't change anything)
- then change all subtraction into unary minuses after addition signs
 - this is just internally - from now on always print "+ -" as "-"
- make sure that all switch statements on operations support unary minus
- make sure unary minus with a child that is symbol or constant is just treated
  like any other symbol or constant

DIVISION SUPPORT

- this can still be a tree with the parent as mult and stay human readable
 - (cymath does it)
- for division signs following division signs: the first argument in a chain
  becomes a numerator and the rest become the denominator
 - e.g. a / b / c / d * e -> a/(b*c*d) * e
- division signs following a multiplication sign becomes the denominator of
  only the very last thing before it
 - e.g. a * b * c / e * d -> a * b * c/e * d
- note that to have the numerator be > 1 terms before the devisor, the numerator
  would have had to be in parens e.g. a * (b * c) / e * d -> a * (b*c)/e * d
- add support for polynomial terms that have fraction coefficients (ie are divided by a constant)


various:

- make constants or functions to check node type (to avoid typos)
- add support for function nodes like sqrt(x)

ideas:

- in the object that stores the rootnode and hasChanged, also have a thing that
  stores the step?

will want to resolve any arithmetic at beginning

------- done ---------

(starting at the time I made this list, which was after addition for like terms)

MULTIPLICATION

- there's an implicit param in the multiply node
 - 2*x is not implicit
 - 2x is! so I can use that to find coefficients
- when flattening the tree, keep these as terms
 - so 4*4y*(2+x)*2x should flatten to a mult with children: 4, 4y, (2+x), 2x
- when removing uncessary parens, make sure I'm removing them around polynomial terms
- make sure multiplication with like terms works
 - here like terms will be by symbol and shouldn't be divided by power
 - and constants should be at the front instead of the end
 - note that this rule is kinda arbitrary (more than usual)
 - the way I'm doing it right now is similar to addition, and uses coefficients
 - e.g. 3*4*2x*3y*5x^2*6 --> 3*4*6 * (2x * 5x^2) * (3y)
 - then we can resolve the constants individually
 - and resolve the x terms individually too, multiplying their coefficients
   and combining their exponents

COLLECTING/RESOLVING

- just for addition and mult
- one step should be looking for collapse, then next step is collapsing
- for mult, use the power rule
- (combine the exponents, but let the simplify step resolve them)

LAST COLLECTING LIKE TERMS DETAIL

- we'll want to get rid of parens if
 - we've fully collected like terms within the parens and there's + before and + or - after
 - e.g. x + (x^2 + y+y) + x -> x + (x^2 + 2y) + x -> x + x^2 + 2y + x
 - this includes things like (2x^2)
- x^1 should be reduced to x if that ever shows up

ORGANIZE THE CODE

- make a map of what calls what
- separate things into steps, probably
- see what can be private within a step, what needs to be accessible
- put things into classes or functions
- hopefully separate into files too
