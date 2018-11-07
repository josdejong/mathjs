# Use cases

1. just pick a few full functions (supporting all data types), using a default config:
  ```
  import { add, multiply } from './mathjs'
  console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
  ```

2. just pick a few functions for use with one data type, using a default config:
  ```
  import { add, multiply } from './mathjs/number'
  console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
  ```

3. just pick a few plain functions:
  ```
  import { add, multiply } from '../src/plain/number'
  console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
  ```

4. create your own mathjs instance with custom config:
  ```
  import { create, add, multiply } from '../src/mainAll'

  const math = create([add, multiply])
  math.config({ number: 'BigNumber' })

  console.log('2 * 3 + 4 = ' + math.add(math.multiply(2, 3), 4))
  ```

5. create functions yourself using factory functions:
  ```
  import typed from 'typed-function'
  import { createHypot } from '../src/factory'

  // Create a hypot instance that only works with numbers:
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

6. mix and match typed functions
  ```
  import { create } from '../src/mainAll'
  import { add as addNumber, multiply as multiplyNumber } from '../src/plain/number'
  import { add as addBigNumber, multiply as multiplyBigNumber, bignumber } from '../src/plain/bignumber'

  const math = create()

  const add = math.typed(addNumber, addBigNumber)
  const multiply = math.typed(multiplyNumber, multiplyBigNumber)

  console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
  console.log('2 * bignumber(3) + 4 = ' + add(multiply(2, bignumber(3)), 4))
  ```
