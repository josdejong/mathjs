# API design

Starting points in the API design are:

- We want to embrace pure functions over a monolithic, stateful instance.
- We want a layered API: offer ready-made functions out of the box,
  but also allow using low level factory functions.
- We want the API to be easy to understand and remember.
- We want as little magic as possible, give the user full control.
- We want to be able to pick just the functions that you actually use.
- We want to be able to pick just the data types that you use.


## Concepts

The currently proposed API has the following concepts:

### A. Loading functions

There are three ways to load a function:

1.  Use ready made functions:

    ```js
    import { add, multiply } from 'mathjs'
    ```

2.  Create a function yourself using `create` and ready made collections of
    factory functions, one collection per function.

    A factory function (like `createAdd`) typically has a number of dependencies
    (like `typed`, `matrix`, ...).
    To make it easy to load a function and its dependencies, collections of
    factory functions are available like `addDependencies`. This collection is
    an object holding the factory function of the function that you want to
    create and all its dependencies.

    ```js
    import { create, divideDependencies, sinDependencies, piDependencies } from 'mathjs'

    const { divide, sin, pi } = create({ divideDependencies, sinDependencies, piDependencies })
    ```

3. Create a function yourself using a factory function, providing all dependencies yourself:

    ```js
    import { createHypot } from 'mathjs/factories'

    const hypot = createHypot({
      typed: ...,
      abs: ...,
      addScalar: ...,
      divideScalar: ...,
      multiplyScalar: ...,
      sqrt: ...,
      smaller: ...,
      isPositive: ...
    })
    ```

### B. Configuration

Configuration can be set in two ways:

1.  Specify configuration statically when creating functions:

    ```js
    import { create, divideDependencies, sinDependencies, piDependencies } from 'mathjs'

    const config = { ... }
    const { divide, sin, pi } = create({
      divideDependencies,
      sinDependencies,
      piDependencies
    }, config)
    ```

2.  Create a mathjs instance and change config there dynamically:

    ```js
    import { create, divideDependencies, sinDependencies, piDependencies } from 'mathjs'

    const mathjs = create({ divideDependencies, sinDependencies, piDependencies })
    mathjs.config({ ... })
    // use mathjs.divide, mathjs.sin, and mathjs.pi
    ```

### C. Data types

There are different pre-made versions of all functions.
Currently there are "full" functions support all data types
(number, BigNumber, Complex, Fraction, Unit, Matrix, etc), and "number"
functions just supporting plain numbers. In the future, it is possible to
create versions only supporting BigNumbers for example.

1.  Load "full" versions of the functions:

    ```js
    import { add, multiply } from 'mathjs'
    ```

2.  Load functions only supporting numbers:

    ```js
    import { add, multiply } from 'mathjs/number'
    ```


## Use cases

To bundle all example use cases and run and explore them (linux, unix), run:

```
sh bundle.sh
```

The following use cases are worked out as an example:

1. use a few functions

	```js
	import { divide, sin, pi } from 'mathjs'

    console.log(divide(sin(divide(pi, 2)), 3))
    // sin(pi / 2) / 3 =
    // number 0.3333333333333333
	```

2. use a few functions with config

	```js
    import { create, divideDependencies, sinDependencies, piDependencies } from 'mathjs'

    const config = { number: 'BigNumber' }

    const { divide, sin, pi } = create({
      divideDependencies,
      sinDependencies,
      piDependencies
    }, config)

    console.log(divide(sin(divide(pi, 2)), 3).toString())
    // sin(pi / 2) / 3 =
    // BigNumber 0.3333333333333333333333333333333333333333333333333333333333333333
	```

3. use all functions in the expression parser

	```js
    import { evaluate } from 'mathjs'

    console.log(evaluate('sin(pi / 2) / 3'))
    // number 0.3333333333333333
	```

4. use all functions in the expression parser with config

	```js
    import { create, allDependencies } from 'mathjs'

    const config = { number: 'BigNumber' }
    const { evaluate } = create(allDependencies, config)

    console.log(evaluate('sin(pi / 2) / 3').toString())
    // BigNumber 0.3333333333333333333333333333333333333333333333333333333333333333
	```

5. use a few functions with just number support

	```js
    import { divide, sin, pi } from 'mathjs/number'

    console.log(divide(sin(divide(pi, 2)), 3))
    // sin(pi / 2) / 3 =
    // number 0.3333333333333333
	```

6. Use all functions and dynamically change config

	```js
    import { create, allDependencies } from 'mathjs'

    const mathjs = create(allDependencies)
    console.log(mathjs.divide(mathjs.sin(mathjs.divide(mathjs.pi, 2)), 3))
    // sin(pi / 2) / 3 =
    // number 0.3333333333333333

    mathjs.config({ number: 'BigNumber' })
    console.log(mathjs.divide(mathjs.sin(mathjs.divide(mathjs.pi, 2)), 3).toString())
    // sin(pi / 2) / 3 =
    // BigNumber 0.3333333333333333333333333333333333333333333333333333333333333333
	```

7. create functions yourself

    ```js
    import { createHypot, createTyped } from 'mathjs/factories'

    // Create a hypot instance that only works with numbers:
    const typed = createTyped({})
    const hypot = createHypot({
      typed,
      abs: Math.abs,
      addScalar: (a, b) => a + b,
      divideScalar: (a, b) => a / b,
      multiplyScalar: (a, b) => a * b,
      sqrt: Math.sqrt,
      smaller: (a, b) => a < b,
      isPositive: a => a > 0
    })

    // Use the created function:
    console.log('hypot(3, 4) =', hypot(3, 4)) // 5
    ```


## Tree shaking results

To get an idea what the size of the bundles is after tree-shaking:

Use case     | Description                                            | Minified + Gzipped size
-------------|--------------------------------------------------------|------------------------
Full library | Just everything in a bundle                            | 138 KB
Use case 1   | Use a few functions                                    | 43 KB
Use case 2   | Use a few functions with config                        | 41 KB
Use case 3   | Use all functions in the expression parser             | 105 KB
Use case 4   | Use all functions in the expression parser with config | 131 KB
Use case 5   | Use a few functions with just number support           | 12 KB
Use case 6   | Use all functions and dynamically change config        | 131 KB
Use case 7   | Create functions yourself                              | 6 KB

Some observations:

- All "full" versions of most functions include support for numbers, BigNumbers, Complex numbers,
  Fractions, Units, and matrices, and require typed-function support. This causes a high "base"
  size in the order of 40 KB: the full libraries for data types like BigNumber and Complex.
- The selected "few" functions in use cases 1, 2, and 5 are `sin`, `divide`, and `pi`.
  Here, `divide` is a very large function since the matrix implementation involves
  calculating the inverse, the inverse requires calculating the determinant,
  the determinant requires calculating the LU decomposition, etc.
