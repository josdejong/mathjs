# Customization

Besides parsing and evaluating expressions, the expression parser supports
a number of features to customize processing and evaluation of expressions.

## Function transforms

It is possible to preprocess function arguments and post process a functions
return value by writing a *transform* for the function. A transform is a
function wrapping around a function to be transformed or completely replaces
a function.

For example, the functions or math.js use zero-based matrix indices (as is
common in programing languages), but the expression parser uses one-based
indices. To enable this, all functions dealing with indices have a transform,
which changes input from one-based to zero-based, and transforms output (and
error message) from zero-based to one-based.

```js
// using plain JavaScript, indices are zero-based:
var a = [[1, 2], [3, 4]]; // a 2x2 matrix
math.subset(a, math.index(0, 1)); // returns 2

// using the expression parser, indices are transformed to one-based:
var a = [[1, 2], [3, 4]]; // a 2x2 matrix
var scope = {
  a: a
};
math.eval('subset(a, index(1, 2))', scope); // returns 2
```

To create a transform for a function, the transform function must be attached
to the function as property `transform`:

```js
var math = require('../index');

// create a function
function addIt(a, b) {
  return a + b;
}

// attach a transform function to the function addIt
addIt.transform = function (a, b) {
  console.log('input: a=' + a + ', b=' + b);
  // we can manipulate input here before executing addIt

  var res = addIt(a, b);

  console.log('result: ' + res);
  // we can manipulate result here before returning

  return res;
};

// import the function into math.js
math.import({
  addIt: addIt
});

// use the function via the expression parser
console.log('Using expression parser:');
console.log('2+4=' + math.eval('addIt(2, 4)'));
// This will output:
//
//     input: a=2, b=4
//     result: 6
//     2+4=6

// when used via plain JavaScript, the transform is not invoked
console.log('');
console.log('Using plain JavaScript:');
console.log('2+4=' + math.addIt(2, 4));
// This will output:
//
//     6
```

Functions with a transform must be imported in the `math` namespace, as they
need to be processed at compile time. They are not supported when passed via a
scope at evaluation time.


## Custom argument parsing

The expression parser of math.js has support for letting functions
parse and evaluate arguments themselves, instead of calling them with
evaluated arguments. This is useful for example when creating a function
like `plot(f(x), x)` or `integrate(f(x), x, start, end)`, where some of the
arguments need to be processed in a special way. In these cases, the expression
`f(x)` will be evaluated repeatedly by the function, and `x` is not evaluated
but used to specify the variable looping over the function `f(x)`.

Functions having a property `rawArgs` with value `true` are treated in a special
way by the expression parser: they will be invoked with unevaluated arguments,
allowing the function to process the arguments in a customized way. Raw
functions are called as:

```
rawFunction(args : Node[], math: Object, scope: Object)
```

Where :

- `args` is an Array with nodes of the parsed arguments.
- `math` is the math namespace with which the expression was compiled.
- `scope` is the scope provided when evaluating the expression.

Raw functions must be imported in the `math` namespace, as they need to be
processed at compile time. They are not supported when passed via a scope
at evaluation time.

A simple example:

```js
function myFunction(args, math, scope) {
  // get string representation of the arguments
  var str = args.map(function (arg) {
    return arg.toString();
  })

  // evaluate the arguments
  var res = args.map(function (arg) {
    return arg.compile(math).eval(scope);
  });

  return 'arguments: ' + str.join(',') + ', evaluated: ' + res.join(',');
}

// mark the function as "rawArgs", so it will be called with unevaluated arguments
myFunction.rawArgs = true;

// import the new function in the math namespace
math.import({
  myFunction: myFunction
})

// use the function
math.eval('myFunction(2 + 3, sqrt(4))');
// returns 'arguments: 2 + 3, sqrt(4), evaluated: 5, 2'
```
