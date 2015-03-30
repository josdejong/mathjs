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
rawFunction(args: Node[], math: Object, scope: Object)
```

Where :

- `args` is an Array with nodes of the parsed arguments.
- `math` is the math namespace against which the expression was compiled.
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

## Custom LaTeX conversion

You can provide the `toTex` function of an expression tree with your own LaTeX converters.
This can be used to override the builtin LaTeX conversion or provide LaTeX output for your own custom functions.

You can pass your own callback(s) to `toTex`. If it returns nothing, the standard LaTeX conversion will be use.
If your callback returns a string, this string will be used.

There's two ways of passing callbacks:
1. Pass an object that maps function names to callbacks. Those callbacks will be used for FunctionNodes with 
functions of that name.
2. Pass a function to `toTex`. This function will then be used for every node.


**Examples for option 2**

```js
var customFunctions = {
  binomial: function (n, k) {
    //calculate n choose k
    // (do some stuff)
    return result;
  }
};

var customLaTeX = {
  'binomial': function (node, callbacks) { //provide toTex for your own custom function
    return '\\binom{' + node.args[0].toTex(callbacks) + '}{' + node.args[1].toTex(callbacks) + '}';
  },
  'factorial': function (node, callbacks) { //override toTex for builtin functions
  	return 'factorial\\left(' + node.args[0] + '\\right)';
  }
};
```

You can simply use your custom toTex functions by passing them to `toTex`:

```js
math.import(customFunctions);
var expression = math.parse('binomial(factorial(2),1)');
var latex = expression.toTex(customLaTeX);
//latex now contains "\binom{factorial\\left(2\\right)}{1}"
```

**Examples for option 2:**

```js
var customLaTeX = function (node, callback) {
  if ((node.type === 'OperatorNode') && (node.fn === 'add')) {
    //don't forget to pass the callback to the toTex functions
    return node.args[0].toTex(callback) + ' plus ' + node.args[1].toTex(callback);
  }
  else if (node.type === 'ConstantNode') {
    if (node.value == 0) {
        return '\\mbox{zero}';
    }
    else if (node.value == 1) {
        return '\\mbox{one}';
    }
    else if (node.value == 2) {
        return '\\mbox{two}';
    }
    else {
        return node.value;
    }
  }
};

var expression = math.parse('1+2');
var latex = expression.toTex(customLaTeX);
//latex now contains '\mbox{one} plus \mbox{two}'
```

Another example in conjunction with custom functions:

```js
var customFunctions = {
  binomial: function (n, k) {
    //calculate n choose k
    // (do some stuff)
    return result;
  }
};

var customLaTeX = function (node, callback) {
  if ((node.type === 'FunctionNode') && (node.name === 'binomial')) {
      return '\\binom{' + node.args[0].toTex(callback) + '}{' + node.args[1].toTex(callback) + '}';
  }
};

math.import(customFunctions);
var expression = math.parse('binomial(2,1)');
var latex = expression.toTex(customLaTeX);
//latex now contains "\binom{2}{1}"
```
