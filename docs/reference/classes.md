---
layout: default
---


<h1 id="class-reference">Class Reference <a href="#class-reference" title="Permalink">#</a></h1>

This page lists all the various class types in Math.js. Every top-level function is listed here and links to its detailed reference to other parts of the documentation.

<h2 id="mathfunctionshtml">["math"](functions.html) <a href="#mathfunctionshtml" title="Permalink">#</a></h2>

The "math" namespace contains the entire math.js functionality. All of the mathematical functions are available in the "math" namespace, and allow for inputs of various types.

<h2 id="unitdatatypesunitshtml">[Unit](../datatypes/units.html) <a href="#unitdatatypesunitshtml" title="Permalink">#</a></h2>
Stores values for a scalar unit and its postfix. (eg `100 mm` or `100 kg`). Although the `Unit` class contains public functions documented as follows, using the following API directly is *not* recommended. Prefer using the functions in the "math" namespace wherever possible.

- [Unit](classes/unit.html)

<h2 id="fractiondatatypesfractionshtml">[Fraction](../datatypes/fractions.html) <a href="#fractiondatatypesfractionshtml" title="Permalink">#</a></h2>
Stores values for a fractional number.

<h2 id="bignumberdatatypesbignumbershtml">[BigNumber](../datatypes/bignumbers.html) <a href="#bignumberdatatypesbignumbershtml" title="Permalink">#</a></h2>
Stores values for a arbitrary-precision floating point number.

<h2 id="matrixdatatypesmatriceshtml">[Matrix](../datatypes/matrices.html) <a href="#matrixdatatypesmatriceshtml" title="Permalink">#</a></h2>
Two types of matrix classes are available in math.js, for storage of dense and sparse matrices. Although they contain public functions documented as follows, using the following API directly is *not* recommended. Prefer using the functions in the "math" namespace wherever possible.

- [DenseMatrix](classes/densematrix.html)
- [SparseMatrix](classes/sparsematrix.html)

Classes used internally that may be of use to developers:

- [Index](classes/matrixindex.html)
- [Range](classes/matrixrange.html)
- [ResultSet](classes/matrixrange.html)
- [FibonacciHeap](classes/fibonacciheap.html)

<h2 id="complexdatatypescomplex_numbershtml">[Complex](../datatypes/complex_numbers.html) <a href="#complexdatatypescomplex_numbershtml" title="Permalink">#</a></h2>
Stores values for a complex number.

<h2 id="parserexpressionsparsinghtml">[Parser](../expressions/parsing.html) <a href="#parserexpressionsparsinghtml" title="Permalink">#</a></h2>
The Parser object returned by `math.parser()`.

<h2 id="nodeexpressionsexpression_treeshtml">[Node](expressions/expression_trees.html) <a href="#nodeexpressionsexpression_treeshtml" title="Permalink">#</a></h2>
A node in an expression-tree, which can be used to analyze, manipulate, and evaluate expressions.

`Node` is the base class of all other node classes:

- [AccessorNode](../expressions/expression_trees.md#accessornode)
- [ArrayNode](../expressions/expression_trees.md#arraynode)
- [AssignmentNode](../expressions/expression_trees.md#assignmentnode)
- [BlockNode](../expressions/expression_trees.md#blocknode)
- [ConditionalNode](../expressions/expression_trees.md#conditionalnode)
- [ConstantNode](../expressions/expression_trees.md#constantnode)
- [FunctionAssignmentNode](../expressions/expression_trees.md#functionassignmentnode)
- [FunctionNode](../expressions/expression_trees.md#functionnode)
- [IndexNode](../expressions/expression_trees.md#indexnode)
- [ObjectNode](../expressions/expression_trees.md#objectnode)
- [OperatorNode](../expressions/expression_trees.md#operatornode)
- [ParenthesisNode](../expressions/expression_trees.md#parenthesisnode)
- [RangeNode](../expressions/expression_trees.md#rangenode)
- [SymbolNode](../expressions/expression_trees.md#symbolnode)
- [UpdateNode](../expressions/expression_trees.md#updatenode)
