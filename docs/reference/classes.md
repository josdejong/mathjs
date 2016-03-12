---
layout: default
---


<h1 id="class-reference">Class Reference <a href="#class-reference" title="Permalink">#</a></h1>

This page lists all the various class types in Math.js. Every top-level function is listed here and links to its detailed reference to other parts of the documentation.

<h2 id="math">math <a href="#math" title="Permalink">#</a></h2>

The "math" namespace contains the entire math.js functionality. All of the mathematical functions are available in the "math" namespace, and allow for inputs of various types.

- [Function reference](functions.html)
- [Constant reference](constants.html)


<h2 id="unit">Unit <a href="#unit" title="Permalink">#</a></h2>

Stores values for a scalar unit and its postfix. (eg `100 mm` or `100 kg`). Although the `Unit` class contains public functions documented as follows, using the following API directly is *not* recommended. Prefer using the functions in the "math" namespace wherever possible.

- [Overview](../datatypes/units.html)
- [Class API](classes/unit.html)


<h2 id="fraction">Fraction <a href="#fraction" title="Permalink">#</a></h2>

Stores values for a fractional number.

- [Overview](../datatypes/fractions.html)
- [Class API](https://github.com/infusion/Fraction.js/)

<h2 id="bignumber">BigNumber <a href="#bignumber" title="Permalink">#</a></h2>

Stores values for a arbitrary-precision floating point number.

- [Overview](../datatypes/bignumbers.html)
- [Class API](http://mikemcl.github.io/decimal.js/)


<h2 id="matrix">Matrix <a href="#matrix" title="Permalink">#</a></h2>

Two types of matrix classes are available in math.js, for storage of dense and sparse matrices. Although they contain public functions documented as follows, using the following API directly is *not* recommended. Prefer using the functions in the "math" namespace wherever possible.

- [Overview](../datatypes/matrices.html)
- [DenseMatrix](classes/densematrix.html)
- [SparseMatrix](classes/sparsematrix.html)

Classes used internally that may be of use to developers:

- [Index](classes/matrixindex.html)
- [Range](classes/matrixrange.html)
- [ResultSet](classes/matrixrange.html)
- [FibonacciHeap](classes/fibonacciheap.html)

<h2 id="complex">Complex <a href="#complex" title="Permalink">#</a></h2>

Stores values for a complex number.

- [Overview](../datatypes/complex_numbers.html)
- [Class API](https://github.com/infusion/Complex.js/)

<h2 id="parser">Parser <a href="#parser" title="Permalink">#</a></h2>

The Parser object returned by `math.parser()`.

- [Overview](../expressions/parsing.html)

<h2 id="node">Node <a href="#node" title="Permalink">#</a></h2>

A node in an expression-tree, which can be used to analyze, manipulate, and evaluate expressions.

- [Overview](expressions/expression_trees.html)

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
