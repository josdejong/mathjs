## A step by step solver for math

https://www.youtube.com/watch?v=ay6GjmiJTPM

### Using the stepper

The main module is `stepper.js` which exports the following functions:

- simplify(expr) returns a simplified expression node
- stepThrough(expr) goes through step by step to simplify an expression and
  returns a list of, for each step, what changed and the updated expression
  node for each step
- step(expr) performs a single step on an expression node

### Things to know to navigate the code

Hi! If you're interested in working on this, that would be super cool!
Here are some things to know that will help make sense of the code:

Expression trees

- Expressions in mathJS are stored as trees. You can read more about that in
  [the mathJS expresisons documentation
  page](http://mathjs.org/docs/expressions/expression_trees.html)
- There are a few different types of nodes that show up in the tree.
  This stepper uses OperationNode, ParenthesisNode, ConstantNode, and
  SymbolNode. You can read about them on [the mathJS expresisons documentation
  page](http://mathjs.org/docs/expressions/expression_trees.html). **Being
  familiar with these node types is essential for working in this code.**
  In the future, it would be nice to add support for FunctionNode.
- Keep in mind when dealing with node expressions that child nodes in the
  tree are called different things depending on the parent node type.
  Operation nodes have `args` as their children, and parenthesis nodes have a
  single child called `content`.
- One thing that's especially helpful to know is that operation nodes with op
  `*` can be implicit. If you do `n = math.parse('2*x')`, the resulting
  expression node is an operation node with `n.op` equal to `*`, and `n.args`
  equal to constant node 2 and symbol node x. Contrastingly,
  `n = math.parse(2x)` has the same `op` and `args`, but `n.implicit`
  will be true - meaning there was no astrix between the operands in the input.
  (This is used a lot for polynomial terms - ie 2x \* 5 should just be two
   operands 2x and 5 instead of 3 operands 2, x, and 5)

The code

- If you want to see the flow of how this code works, start in `stepper.js`.
  This is where `step` and `simplify` live. You can see what functions are
  called from `step` and follow the logic through other files if you're curious
  how any of those steps work.
- `NodeCreator` and `NodeType` are used to create nodes and check what type
  they are. Note that unaryMinus nodes (e.g. -x) are technically operator
  nodes, but we don't treat them as such, and always keep them as their own
  separate type.
- `NodeStatus` objects are used throughout the code. The stepper calls a bunch
  of functions that might make changes that are counted as a step, and each of
  these functions return a NodeStatus object which contains: the updated node
  after calling this function, if this function changed the expression in a way
  that counts as a step, and what the change type is.
- `MathChangeTypes` are used to describe different changes that count as steps.
- `flattenOperands` (sometimes shortened to `flatten`) changes the structure
  of the expression tree to be easier to work with. You probably will need to
  use this in your tests, but nowhere else.
  - TODO: write something that abstracts this away in the tests
- `PolynomialTermNode` describes and stores what counts as a polynomial term
  (e.g. x, x^2, -4/5 x^y) and `PolynomialTermOperations` define all operations
  that can happen with these polynomial terms
 - Note that polynomial terms right now are defiend by only having one symbol.
   So 2x is grouped together as a polynomial node, but 2xy would be
   2x \* y (two operands)

Testing

- There are test files for almost every file in the stepper code.
- To run just the stepper tests from the `/mathjs` folder:

  ```./node_modules/mocha/bin/mocha ./test/expression/step-solver/```

--------

--------

### BIG DETAILED TODO (in approx this order)

FUTURE THINGS:

- distribution
- equation support (e.g. x+3 = 3x-5, solve for x)
- fraction support
- factoring
- polynomial division
- collect like terms for 'other' terms (e.g. 2^x + 2^x -> 2*2^x)
- add support for function nodes like sqrt(x)
- log rules and polynomial exponents (e.g. 2*2^x -> 2^(x+1))

------- done ---------

(starting at the time I made this list, which was after addition for like terms)

MULTIPLICATION

- there's an implicit param in the multiply node
 - 2\*x is not implicit
 - 2x is! so I can use that to find coefficients
- when flattening the tree, keep these as terms
 - so 4\*4y\*(2+x)\*2x should flatten to a mult with children: 4, 4y, (2+x), 2x
- when removing unnecessary parens, make sure I'm removing them around
  polynomial terms
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
 - we've fully collected like terms within the parens and there's + before
   and + or - after
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
  would have had to be in parens
  e.g. a \* (b \* c) / e \* d -> a \* (b\*c)/e \* d
- add support for polynomial terms that have fraction coefficients
  (ie are divided by a constant)

BETTER RECURSION / REFACTOR #2

- replace context nodes with status nodes and better recursion
- more comments and clearer variable names
- add more tests

SUBTRACTION SUPPORT

- at beginning 'resolve' all unary minuses after addition signs
 - (say it's a step, but don't change anything)
- then change all subtraction into unary minuses after addition signs
 - this is just internally - from now on always print '+ -' as '-'
- make sure that all switch statements on operations support unary minus
- make sure unary minus with a child that is symbol or constant is just treated
  like any other symbol or constant

REFACTOR #3

- make functions to check type of node (done)
- abstract polynomial terms into its own class, shouldn't have to deal with any
  args or other node attributes outside of the class (coefficient, exponent,
  symbol, nodes, constants, etc)
