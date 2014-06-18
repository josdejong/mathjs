# Chained operations

Math.js supports chaining operations by wrapping a value into a `Selector`.
A selector can be created with the function `math.select(value)`.
All functions available in the math namespace can be executed via the selector.
The functions will be executed with the selectors value as first argument,
followed by extra arguments provided by the function call itself.

```js
math.select(3)
    .add(4)
    .subtract(2)
    .done(); // 5

math.select( [[1, 2], [3, 4]] )
    .subset(math.index(0, 0), 8)
    .multiply(3)
    .done(); // [[24, 6], [9, 12]]
```

### API

A `Selector` is constructed as:

```js
math.select()
math.select(value)
```

The `Selector` has all functions available in the `math` namespace, and has
a number of special functions:

 - `done()`
   Finalize the chained operation and return the selectors value.
 - `valueOf()`
   The same as `done()`, returns the selectors value.
 - `toString()`
   Executes `math.format(value)` onto the selectors value, returning
   a string representation of the value.

