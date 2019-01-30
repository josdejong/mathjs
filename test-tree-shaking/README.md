# Use cases

To bundle all example use cases and run them (linux, unix), run:

```
sh bundle_and_run.sh
```

To explore the source code to see what modules are packed in the bundle, run:

```
sh explore.sh
```

The following use cases are worked out:

1. just pick a few full functions (supporting all data types), using a default config:
    ```js
    import { add, multiply } from '../src/mainFull'
    console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
    ```

2. just pick a few functions for use with one data type, using a default config:
    ```js
    import { add, multiply } from './mathjs/number'
    console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
    ```

3. just pick a few plain functions:
    ```js
    import { add, multiply } from '../src/plain/number'
    console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
    ```

4. create functions yourself using factory functions:
    ```js
    import { createTyped, createHypot } from '../src/factory'

    // Create a hypot instance that only works with numbers:
    const typed = createTyped({ })
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

5. mix and match typed functions
    ```js
    import { createTyped, createBigNumberClass } from '../src/factory'
    import { addNumber, multiplyNumber } from '../src/plain/number'
    import { addBigNumber, multiplyBigNumber, bignumber } from '../src/plain/bignumber'
    import { DEFAULT_CONFIG } from '../src/core/config'

    const BigNumber = createBigNumberClass({ config: DEFAULT_CONFIG })
    const typed = createTyped({ BigNumber })

    const add = typed('add', addNumber, addBigNumber)
    const multiply = typed('multiply', multiplyNumber, multiplyBigNumber)

    console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
    console.log('2 * bignumber(3) + 4 = ' + add(multiply(2, bignumber(3)), 4))
    ```
