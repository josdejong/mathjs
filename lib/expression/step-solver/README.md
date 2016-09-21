## A step by step solver for math.

https://www.youtube.com/watch?v=ay6GjmiJTPM

### Using the stepper

- step(expr) should return exp reduced by one step
- simplify(expr) should return a fully simplified expression

### Things to know to navigate the code

Hi! If you're interested in working on this, that would be super cool!
Here are some things to know that will help make sense of the code:

- Expressions in mathJS are stored as trees. You can read more about that in
  [the related mathJS documentation page](http://mathjs.org/docs/expressions/expression_trees.html)
- There are a few different types of nodes that show up in the tree.
  This stepper uses OperationNode, ParenthesisNode, ConstantNode and SymbolNode. You can read about
  them [on the same documentation page as expressions](http://mathjs.org/docs/expressions/expression_trees.html)
  It will be pretty helpful to get an idea of how they all work.
- Keep in mind when dealing with the node expression that a parent node's child nodes are
  called different things depending on the parent node type. Operation nodes have `args` as
  their children, and parenthesis nodes have a single child called `content`.
- One thing that's especially helpful to know is that multiplication nodes can be implicit.
  If you do `n = math.parse('2\*x')` you'll get a multiplication node with `n.args` 2 and x.
  If you do `n = math.parse(2x)` you'll also get a multiplication node with `n.args` 2 and x,
  but `n.implicit` will be true - meaning there was no astrix between the operands in the input.
  This is used a lot for polynomial terms and keeping them grouped together (ie 2x \* 5 should just
  be two operands 2x and 5 instead of 3 operands 2, x, and 5)
- If you want to see the flow of how this code works, start in `stepper.js`. This is where `step` and
  `simplify` live. You can see what functions are called from `step` and follow the logic through other
  files if you're curious how any of those steps work.
- Note that polynomial terms right now are defiend by only having one symbol. So 2x is grouped together,
  but 2xy would be 2x \* y (two operands)
- To run just stepper tests: `./node_modules/mocha/bin/mocha ./test/expression/step-solver/`
- What else to add?

--------

## BIG DETAILED TODO (in approx this order)

SUBTRACTION SUPPORT

- at beginning 'resolve' all unary minuses after addition signs
 - (say it's a step, but don't change anything)
- then change all subtraction into unary minuses after addition signs
 - this is just internally - from now on always print "+ -" as "-"
- make sure that all switch statements on operations support unary minus
- make sure unary minus with a child that is symbol or constant is just treated
  like any other symbol or constant

REFACTOR #3

- make functions to check type of node
- abstract polynomial terms into its own class, shouldn't have to deal with any
  args or other node attributes outside of the class (coefficient, exponent,
  symbol, nodes, constants, etc)

FUTURE THINGS:

- distribution
- fraction support
- factoring
- add support for function nodes like sqrt(x)

------- done ---------

(starting at the time I made this list, which was after addition for like terms)

MULTIPLICATION

- there's an implicit param in the multiply node
 - 2\*x is not implicit
 - 2x is! so I can use that to find coefficients
- when flattening the tree, keep these as terms
 - so 4\*4y\*(2+x)\*2x should flatten to a mult with children: 4, 4y, (2+x), 2x
- when removing unnecessary parens, make sure I'm removing them around polynomial terms
- make sure multiplication with like terms works
 - here like terms will be by symbol and shouldn't be divided by power
 - and constants should be at the front instead of the end
 - note that this rule is kinda arbitrary (more than usual)
 - the way I'm doing it right now is similar to addition, and uses coefficients
 - e.g. 3\*4\*2x\*3y\*5x^2\*6 --> 3\*4\*6 \* (2x \* 5x^2) \* (3y)
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

ORGANIZE THE CODE / REFACTOR #1

- make a map of what calls what
- separate things into steps, probably
- see what can be private within a step, what needs to be accessible
- put things into classes or functions
- separate into lots of different files

DIVISION SUPPORT

- this can still be a tree with the parent as mult and stay human readable
 - (cymath does it)
- for division signs following division signs: the first argument in a chain
  becomes a numerator and the rest become the denominator
 - e.g. a / b / c / d \* e -> a/(b\*c\*d) \* e
- division signs following a multiplication sign becomes the denominator of
  only the very last thing before it
 - e.g. a \* b \* c / e \* d -> a \* b \* c/e \* d
- note that to have the numerator be > 1 terms before the devisor, the numerator
  would have had to be in parens e.g. a \* (b \* c) / e \* d -> a \* (b\*c)/e \* d
- add support for polynomial terms that have fraction coefficients (ie are divided by a constant)

BETTER RECURSION / REFACTOR #2

- replace context nodes with status nodes and better recursion
- more comments and clearer variable names
- add more tests

