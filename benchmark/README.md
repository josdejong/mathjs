# Benchmarks

These are some rough benchmarks to get an idea of the performance of math.js compared to other JavaScript libraries and to Octave (C++). They only give an _indication_ of the order of magnitude difference meant to see were math.js has room for improvements, it's not a fully fletched benchmark suite.


## How to run

### JavaScript library benchmarks

Install the dependencies once:

```
npm install
```

run the tests:

```
node benchmark.js
```

### Octave benchmarks

Open Octave, run the script `benchmark_octave.m`

## To do

-   compare with python and Octave

-   use larger matrix, like 250x250 instead of 25x25

-   Compare expression parsers

    evaluate the following function thousand times

        f(x) = (sin(x) + cos(x/2)) * 5

    Libraries:
    - math.js
    - expr-eval
    - jsep
    - math-expression-evaluator
