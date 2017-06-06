# Benchmarks

This directory contains benchmarks which can be used when working on
performance improvements of math.js.

## How to run

To run all benchmarks:

```
node index.js
```

To run a single set of benchmarks:

```
node expression_parser.js
```

## Octave benchmarks

For matrix operations, there is a small benchmark for Octave.
Open Octave, run the script `matrix_operations_octave.m`

## To do

-   compare matrix operations with python
-   use larger matrix, like 250x250 instead of 25x25
-   Compare expression parsers
    - math.js
    - expr-eval
    - jsep
    - math-expression-evaluator
