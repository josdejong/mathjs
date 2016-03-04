
# Class Reference

This page lists all the various class types in Math.js. Every top-level function is listed here and links to its detailed reference to other parts of the documentation.

## ["math"](functions.md)

The "math" namespace contains the entire math.js functionality. All of the mathematical functions are available in the "math" namespace, and allow for inputs of various types.

## [Unit](../datatypes/units.md)
Stores values for a scalar unit and its postfix. (eg `100 mm` or `100 kg`). Although the `Unit` class contains public functions documented as follows, using the following API directly is *not* recommended. Prefer using the functions in the "math" namespace wherever possible.

- [Unit](classes/unit.md)

## [Fraction](../datatypes/fractions.md)
Stores values for a fractional number.

## [BigNumber](../datatypes/bignumbers.md)
Stores values for a arbitrary-precision floating point number.

## [Matrix](../datatypes/matrices.md)
Two types of matrix classes are available in math.js, for storage of dense and sparse matrices. Although they contain public functions documented as follows, using the following API directly is *not* recommended. Prefer using the functions in the "math" namespace wherever possible.

- [DenseMatrix](classes/densematrix.md)
- [SparseMatrix](classes/sparsematrix.md)

Classes used internally that may be of use to developers:

- [Index](classes/matrixindex.md)
- [Range](classes/matrixrange.md)
- [ResultSet](classes/matrixrange.md)
- [FibonacciHeap](classes/fibonacciheap.md)

## [Complex](../datatypes/complex_numbers.md)
Stores values for a complex number.

## [Parser](../expressions/parsing.md)
The Parser object returned by `math.parser()`.

## [Node](expressions/expression_trees.md)
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
