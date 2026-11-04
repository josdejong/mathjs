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

```js
math.boolean(0)       // false
math.boolean(-3)      // true
```

For strings, `math.boolean` first compares the whole string with `true` and
`false`, ignoring case. Other nonempty strings are converted to a number first,
then to a boolean using the numeric rules above. An empty string or a string
that cannot be converted to a number throws an error.

```js
math.boolean('false')   // false
math.boolean('TRUE')    // true
math.boolean('0')       // false
math.boolean('')        // throws an error
math.boolean('yes')     // throws an error
```

**Note:** This string conversion differs from JavaScript's `Boolean('false')`,
which returns `true`.

Arrays and matrices are converted element by element, including mixed types:

```js
math.boolean([true, 'false', 0, '2']) // [true, false, false, true]
```

To convert booleans to other types, use [`math.number`](../reference/functions/number.md)
or [`math.string`](../reference/functions/string.md):

```js
math.number(true)     // 1
math.number(false)    // 0
math.string(false)    // 'false'
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
