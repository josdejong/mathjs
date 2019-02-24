# API design

Starting points in the API design are:

- We want to embrace pure functions over a monolithic, stateful instance.
- Layered API: Open up low level factory functions,
  but also offer ready-made functions out of the box.
- As little magic as possible, give the user full control.
- Allow picking just the functions that you actually use.
- Allow picking just the data types that you use.


# Use cases

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
    import { create, divideRecipe, sinRecipe, piRecipe } from '../src/mainFull'

    const config = { number: 'BigNumber' }

    const { divide, sin, pi } = create({
      ...divideRecipe,
      ...sinRecipe,
      ...piRecipe
    }, config)

    console.log(divide(sin(divide(pi, 2)), 3).toString())
    // sin(pi / 2) / 3 =
    // BigNumber 0.3333333333333333333333333333333333333333333333333333333333333333
	```

3. use all functions in the expression parser

	```js
    import { evaluate } from '../src/mainFull'

    console.log(evaluate('sin(pi / 2) / 3'))
    // number 0.3333333333333333
	```

4. use all functions in the expression parser with config

	```js
    import { create, allRecipe } from '../src/mainFull'

    const config = { number: 'BigNumber' }
    const { evaluate } = create(allRecipe, config)

    console.log(evaluate('sin(pi / 2) / 3').toString())
    // BigNumber 0.3333333333333333333333333333333333333333333333333333333333333333
	```

5. use a few functions with just number support

	```js
    import { divide, sin, pi } from '../src/mainNumber'

    console.log(divide(sin(divide(pi, 2)), 3))
    // sin(pi / 2) / 3 =
    // number 0.3333333333333333
	```

6. Use all functions and dynamically change config

	```js
    import { create, allRecipe } from '../src/mainFull'

    const mathjs = create(allRecipe)
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

# Tree shaking results

To get an idea what the size of the bundles is after tree-shaking:

Use case     | Description                                            | Minified + Gzipped size
-------------|--------------------------------------------------------|------------------------
Full library | Just everything in a bundle                            | 138 KB
Use case 1   | Use a few functions                                    | 43 KB
Use case 2   | Use a few functions with config                        | 41 KB
Use case 3   | Use all functions in the expression parser             | 105 KB
Use case 4   | Use all functions in the expression parser with config | 131 KB
Use case 5   | Use a few functions with just number support           | 4 KB
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
