# Extension

The library can easily be extended with functions and variables using the
`import` function. The function `import` accepts a filename or an object with
functions and variables.

Function `import` has the following syntax:

```js
    math.import(object: Object [, options: Object])
```

The first argument is object containing the functions and/or values to be
imported. The optional second argument can be an object with options. The 
following options are available:

- `{boolean} override`
  If true, existing functions will be overwritten. False by default.
- `{boolean} silent`
  If true, the function will not throw errors on duplicates or invalid
  types. Default value is `false`.
- `{boolean} wrap`
  If true, the functions will be wrapped in a wrapper function which
  converts data types like Matrix to primitive data types like Array.
  The wrapper is needed when extending math.js with libraries which do not
  support the math.js data types. The default value is `false`.

Math.js can be extended with functions and variables:

```js
// define new functions and variables
math.import({
    myvalue: 42,
    hello: function (name) {
        return 'hello, ' + name + '!';
    }
});

// defined functions can be used in both JavaScript as well as the parser
math.myvalue * 2;               // 84
math.hello('user');             // 'hello, user!'

var parser = math.parser();
parser.eval('myvalue + 10');    // 52
parser.eval('hello("user")');   // 'hello, user!'
```

External libraries like
[numbers.js](https://github.com/sjkaliski/numbers.js) and
[numeric.js](http://numericjs.com/) can be imported as follows.
The libraries must be installed using npm:

    npm install numbers
    npm install numeric

The libraries can be easily imported into math.js using `import`. 
In order to convert math.js specific data types like `Matrix` to primitive types 
like `Array`, the imported functions can be wrapped by enabling `{wrap: true}`.

```js
// import the numbers.js and numeric.js libraries into math.js
math.import(require('numbers'), {wrap: true, silent: true});
math.import(require('numeric'), {wrap: true, silent: true});

// use functions from numbers.js
math.fibonacci(7);                          // 13
math.eval('fibonacci(7)');                  // 13

// use functions from numeric.js
math.eval('eig([1, 2; 4, 3])').lambda.x;    // [5, -1]
```
