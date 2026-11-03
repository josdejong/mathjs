# Strings

Math.js uses JavaScript strings, written with single or double quotes. Use
[`math.string`](../reference/functions/string.md) to convert a value to a string.
Arrays and matrices are converted element by element.

```js
math.typeOf('hello')       // 'string'
math.string(2.3)           // '2.3'
math.string([2, true])     // ['2', 'true']
```

## Numeric conversion

Numeric functions such as `math.add` and `math.max` attempt to convert string
arguments to numbers. Conversion fails if a string cannot be parsed as a number.
For example, `math.add('hello ', 'world')` throws an error.

```js
math.add('2', '3')         // 5
math.max('3', '2', '7')    // 7
math.number('2.3')         // 2.3
```

Functions with string signatures can handle strings directly. In particular,
use [`math.concat`](../reference/functions/concat.md) to concatenate text:

```js
math.concat('hello ', 'world') // 'hello world'
math.concat('2', '3')          // '23'
```

The expression parser uses `+` for arithmetic, including numeric conversion of
strings. JavaScript's `+` operator concatenates strings instead:

```js
'2' + '3'                                  // '23'
math.evaluate('"2" + "3"')                 // 5
math.evaluate('concat("hello ", "world")')  // 'hello world'
```

## Other operations

Some functions listed under Matrix also accept strings:
[`math.count`](../reference/functions/count.md),
[`math.size`](../reference/functions/size.md),
[`math.subset`](../reference/functions/subset.md), and
[`math.resize`](../reference/functions/resize.md).
The JavaScript API uses zero-based indices in `math.index`.

```js
math.count('hello')                      // 5
math.size('hello')                       // [5]
math.subset('hello', math.index(1))       // 'e'
math.resize('hello', [8], '!')            // 'hello!!!'
```

## Comparing and formatting strings

[`math.compareText`](../reference/functions/compareText.md) compares text
lexicographically. [`math.compareNatural`](../reference/functions/compareNatural.md)
uses natural ordering, comparing numeric parts by their value:

```js
math.compareText('10', '2')     // -1
math.compareNatural('10', '2')  // 1
```

Use [`math.format`](../reference/functions/format.md) to format values, or
[`math.print`](../reference/functions/print.md) to interpolate values into a
string template. See the [String functions](../reference/functions.md#string-functions)
reference for more functions.
