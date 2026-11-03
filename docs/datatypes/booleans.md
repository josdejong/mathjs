# Booleans

Math.js uses the JavaScript boolean values `true` and `false`. For scalar inputs,
relational functions such as `math.larger` and `math.equal` return booleans:

```js
math.typeOf(true)     // 'boolean'
math.larger(3, 2)     // true
math.equal(2, 3)      // false
```

## Conversion

Use [`math.boolean`](../reference/functions/boolean.md) to convert a value.
For numbers, zero and `NaN` become `false`; other numbers become `true`.
Strings can be `true` or `false` (case-insensitive), or contain a number.
An empty string or an unrecognized string throws an error.
Arrays and matrices are converted element by element.

```js
math.boolean(0)            // false
math.boolean(-3)           // true
math.boolean('false')      // false
math.boolean('TRUE')       // true
math.boolean('0')          // false
math.boolean([1, 0, -3])   // [true, false, true]
```

This string conversion differs from JavaScript's `Boolean('false')`, which
returns `true`. Use [`math.number`](../reference/functions/number.md) for the
reverse conversion to a number:

```js
math.number(true)     // 1
math.number(false)    // 0
```

## Logical operations

Use [`math.and`](../reference/functions/and.md),
[`math.or`](../reference/functions/or.md),
[`math.xor`](../reference/functions/xor.md), and
[`math.not`](../reference/functions/not.md) for logical operations.
The expression parser uses the operators `and`, `or`, `xor`, and `not`:

```js
math.and(true, false)              // false
math.or(true, false)               // true
math.xor(true, true)               // false
math.not(false)                   // true
math.evaluate('true and false')    // false
math.evaluate('true or false')     // true
math.evaluate('true xor true')     // false
math.evaluate('not false')         // true
```
