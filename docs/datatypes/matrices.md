# Matrices

Math.js supports multidimensional matrices and arrays. Matrices can be
created, manipulated, and used in calculations. Both regular JavaScript
arrays and the matrix type implemented by math.js can be used
interchangeably in all relevant math.js functions. math.js supports both
dense and sparse matrices.


## Arrays and matrices

Math.js supports two types of matrices:

- `Array`, a regular JavaScript array. A multidimensional array can be created
  by nesting arrays.
- `Matrix`, a matrix implementation by math.js. A `Matrix` is an object wrapped
  around a regular JavaScript `Array`, providing utility functions for easy
  matrix manipulation such as `subset`, `size`, `resize`, `clone`, and more.

In most cases, the type of matrix output from functions is determined by the
function input: An `Array` as input will return an `Array`, a `Matrix` as input
will return a `Matrix`. In case of mixed input, a `Matrix` is returned.
For functions where the type of output cannot be determined from the
input, the output is determined by the configuration option `matrix`,
which can be a string `'Matrix'` (default) or `'Array'`. The function `size` is
an exception: `size` always returns an `Array` containing numbers. Having a 
consistent output type in this case is most practical since the size is often
used in JavaScript loops where the code can only use a flat Array with numbers.
This also makes the function `size` consistent with the matrix method 
`matrix.size()`.

```js
// create an array and a matrix
const array = [[2, 0], [-1, 3]]               // Array
const matrix = math.matrix([[7, 1], [-2, 3]]) // Matrix

// perform a calculation on an array and matrix
math.map(array, math.square)                  // Array,  [[4, 0], [1, 9]]
math.map(matrix, math.square)                 // Matrix, [[49, 1], [4, 9]]

// perform calculations with mixed array and matrix input
math.add(array, matrix)                       // Matrix, [[9, 1], [-3, 6]]
math.multiply(array, matrix)                  // Matrix, [[14, 2], [-13, 8]]

// create a matrix. Type of output of function ones is determined by the
// configuration option `matrix`
math.ones(2, 3)                               // Matrix, [[1, 1, 1], [1, 1, 1]]
```


## Creation

A matrix can be created from an array using the function `math.matrix`. The
provided array can contain nested arrays in order to create a multidimensional matrix. When called without arguments, an empty matrix will be
created.

```js
// create matrices
math.matrix()                           // Matrix, size [0]
math.matrix([0, 1, 2])                  // Matrix, size [3]
math.matrix([[0, 1], [2, 3], [4, 5]])   // Matrix, size [3, 2]
```

Math.js supports regular Arrays. Multiple dimensions can be created
by nesting Arrays in each other.

```js
// create arrays
[]                                      // Array, size [0]
[0, 1, 2]                               // Array, size [3]
[[0, 1], [2, 3], [4, 5]]                // Array, size [3, 2]
```

Matrices can contain different types of values: numbers, complex numbers,
units, or strings. Different types can be mixed together in a single matrix.

```js
// create a matrix with mixed types
const a = math.matrix([2.3, 'hello', math.complex(3, -4), math.unit('5.2 mm')]) 
a.subset(math.index(1))  // 'hello'
```


There are a number of functions to create a matrix with a specific size and
content: `ones`, `zeros`, `identity`.

```js
// zeros creates a matrix filled with zeros
math.zeros(3)           // Matrix, size [3],    [0, 0, 0]
math.zeros(3, 2)        // Matrix, size [3, 2], [[0, 0], [0, 0], [0, 0]]
math.zeros(2, 2, 2)     // Matrix, size [2, 2, 2],
                        //   [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]

// ones creates a matrix filled with ones
math.ones(3)                        // Matrix, size [3],    [1, 1, 1]
math.multiply(math.ones(2, 2), 5)   // Matrix, size [2, 2], [[5, 5], [5, 5]]

// identity creates an identity matrix
math.identity(3)      // Matrix, size [3, 3], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
math.identity(2, 3)   // Matrix, size [2, 3], [[1, 0, 0], [0, 1, 0]]
```


The functions `ones`, `zeros`, and `identity` also accept a single array
or matrix containing the dimensions for the matrix. When the input is an Array,
the functions will output an Array. When the input is a Matrix, the output will
be a Matrix. Note that in case of numbers as arguments, the output is
determined by the option `matrix` as discussed in section
[Arrays and matrices](#arrays-and-matrices).

```js
// Array as input gives Array as output
math.ones([2, 3])               // Array,  size [3, 2], [[1, 1, 1], [1, 1, 1]]
math.ones(math.matrix([2, 3]))  // Matrix, size [3, 2], [[1, 1, 1], [1, 1, 1]]
```

Ranges can be created using the function `range`. The function `range` is
called with parameters start and end, and optionally a parameter step.
The start of the range is included, the end of the range is excluded.

```js
math.range(0, 4)        // [0, 1, 2, 3]
math.range(0, 8, 2)     // [0, 2, 4, 6]
math.range(3, -1, -1)   // [3, 2, 1, 0]
```


## Calculations

Most functions of math.js support matrices and arrays. Unary functions can be applied element-wise using via `math.map(matrix, function)`.

```js
// perform an element-wise operation on a matrix using math.map
const a = math.matrix([1, 4, 9, 16, 25])  // Matrix, [1, 4, 9, 16, 25]
math.map(a, math.sqrt)                    // Matrix, [1, 2, 3, 4, 5]

// use a function that has built-in matrix and array support
const b = [1, 2, 3, 4, 5] 
math.factorial(b)                         // Array,  [1, 2, 6, 24, 120]

// multiply an array with a matrix
const c = [[2, 0], [-1, 3]]               // Array
const d = math.matrix([[7, 1], [-2, 3]])  // Matrix
math.multiply(c, d)                       // Matrix, [[14, 2], [-13, 8]]

// add a number to a matrix (see broadcasting)
math.add(c, 2)                            // Array, [[4, 2], [1, 5]]

// calculate the determinant of a matrix
math.det(c)                               // 6
math.det(d)                               // 23
```
## Broadcasting

Functions that require two or more matrix like arguments that operate elementwise automatically operate as if the arguments were the same size.

```js
A = math.matrix([1, 2])       // Matrix, [1, 2]
math.add(A, 3)                // Matrix, [3, 4]

B = math.matrix([[3], [4]])   // Matrix, [[3], [4]]
math.add(A, B)                // Matrix, [[4, 5], [5, 6]]
```
Any index that is in one of the arguments, can be found as if it existed on the others when the size on that dimension is one or not existing. This is valid in N dimensions.

It's not possible to broadcast in cases where the size in that dimension is higher than one.

```js
math.add([1, 2], [3, 4, 5])
// Error: shape missmatch: missmatch is found in arg with shape (2) not possible to broadcast dimension 0 with size 2 to size 3

math.add([[1], [2], [3]], [[4], [5]])
// Error: shape missmatch: missmatch is found in arg with shape (2,1) not possible to broadcast dimension 0 with size 2 to size 3
```

## Size and Dimensions

Math.js uses geometric dimensions:

- A scalar is zero-dimensional.
- A vector is one-dimensional.
- A matrix is two or multidimensional.

The size of a matrix can be calculated with the function `size`. Function `size`
returns a `Matrix` or `Array`, depending on the configuration option `matrix`.
Furthermore, matrices have a function `size` as well, which always returns
an Array.

```js
// get the size of a scalar
math.size(2.4)                                // Matrix, []
math.size(math.complex(3, 2))                 // Matrix, []
math.size(math.unit('5.3 mm'))                // Matrix, []

// get the size of a one-dimensional matrix (a vector) and a string
math.size([0, 1, 2, 3])                       // Array, [4]
math.size('hello world')                      // Matrix, [11]

// get the size of a two-dimensional matrix
const a = [[0, 1, 2, 3]]                      // Array
const b = math.matrix([[0, 1, 2], [3, 4, 5]]) // Matrix
math.size(a)                                  // Array, [1, 4]
math.size(b)                                  // Matrix, [2, 3]

// matrices have a function size (always returns an Array)
b.size()                                      // Array, [2, 3]

// get the size of a multi-dimensional matrix
const c = [[[0, 1, 2], [3, 4, 5]], [[6, 7, 8], [9, 10, 11]]]
math.size(c)                                  // Array, [2, 2, 3]
```

Note that the dimensions themselves do not have a meaning attached. 
When creating and printing a two-dimensional matrix, the first dimension is 
normally rendered as the _column_, and the second dimension is rendered as 
the _row_. For example:

```js
console.table(math.zeros([2, 4]))
// 0 0 0 0
// 0 0 0 0
```

If you have a matrix where the first dimension means `x` and the second 
means `y`, this will look confusing since `x` is printed as _column_ 
(vertically) and `y` as _row_ (horizontally).


## Resizing

Matrices can be resized using their `resize` function. This function is called
with an Array with the new size as the first argument, and accepts an optional
default value. By default, new entries will be set to `0`, but it is possible
to pass a different default value like `null` to clearly indicate that
the entries haven't been explicitly set.

```js
const a = math.matrix() // Matrix, size [0],       []
a.resize([2, 3])        // Matrix, size [2, 3],    [[0, 0, 0], [0, 0, 0]]
a.resize([2, 2, 2])     // Matrix, size [2, 2, 2],
                        //   [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]

const b = math.matrix()
b.resize([3], 7)        // Matrix, size [3],    [7, 7, 7]
b.resize([5], 9)        // Matrix, size [5],    [7, 7, 7, 9, 9]
b.resize([2])           // Matrix, size [2],    [7, 7]
```


Outer dimensions of a matrix can be squeezed using the function `squeeze`. When
getting or setting a single value in a matrix using `subset`, the value is automatically squeezed
or unsqueezed too.

```js
// squeeze a matrix
const a = [[[0, 1, 2]]]
math.squeeze(a)             // [0, 1, 2]
math.squeeze([[3]])         // 3

// when getting/setting a single value in a matrix using subset, 
// it automatically squeeze/unsqueeze the value
const b = math.matrix([[0, 1], [2, 3]])
b.subset(math.index(1, 0))  // 2 and not [[2]]
```


## Getting or replacing subsets

Subsets of a matrix can be retrieved or replaced using the function `subset`.
Matrices have a `subset` function, which is applied to the matrix itself:
`Matrix.subset(index [, replacement])`. For both matrices and arrays,
the static function `subset(matrix, index [, replacement])` can be used.
When parameter `replacement` is provided, the function will replace a subset
in the matrix, and if not, a subset of the matrix will be returned.

A subset can be defined using an `Index`. An `Index` contains a single value
or a set of values for each dimension of a matrix. An `Index` can be
created using the function `index`. The way `subset` returns results depends on how you specify indices for each dimension:

- If you use a scalar (single number) as an index for a dimension, that dimension is removed from the result.
- If you use an array, matrix or range (even with just one element) as an index, that dimension is preserved in the result.

This means that scalar indices eliminate dimensions, while array, matrix or range indices retain them. See the section [Migrate to v15](#migrate-indexing-behavior-to-mathjs-v15) for more details and examples of this behavior.

For example:

```js
const m = [
  [10, 11, 12],
  [20, 21, 22]
]

// Scalar index eliminates the dimension:
math.subset(m, math.index(1, 2))           // 22 (both dimensions indexed by scalars, result is a value)
math.subset(m, math.index(1, [2]))         // [22] (row dimension eliminated, column dimension preserved as array)
math.subset(m, math.index([1], 2))         // [22] (column dimension eliminated, row dimension preserved as array)
math.subset(m, math.index([1], [2]))       // [[22]] (both dimensions preserved as arrays)

math.config({legacySubset: true}) // switch to legacy behavior
math.subset(m, math.index(1, 2))           // 22
math.subset(m, math.index(1, [2]))         // 22
math.subset(m, math.index([1], 2))         // 22
math.subset(m, math.index([1], [2]))       // 22

```

Matrix indexes in math.js are zero-based, like most programming languages
including JavaScript itself. Note that mathematical applications like Matlab 
and Octave work differently, as they use one-based indexes.

```js
// create some matrices
const a = [0, 1, 2, 3]
const b = [[0, 1], [2, 3]]
const c = math.zeros(2, 2)
const d = math.matrix([[0, 1, 2], [3, 4, 5], [6, 7, 8]])
const e = math.matrix()

// get a subset
math.subset(a, math.index(1))                 // 1
math.subset(a, math.index([2, 3]))            // Array, [2, 3]
math.subset(a, math.index(math.range(0,4)))   // Array, [0, 1, 2, 3]
math.subset(b, math.index(1, 0))              // 2
math.subset(b, math.index(1, [0, 1]))         // Array, [2, 3]
math.subset(b, math.index([0, 1], [0]))       // Matrix, [[0], [2]]

// get a subset
d.subset(math.index([1, 2], [0, 1]))          // Matrix, [[3, 4], [6, 7]]
d.subset(math.index(1, 2))                    // 5

// replace a subset. The subset will be applied to a clone of the matrix
math.subset(b, math.index(1, 0), 9)           // Array, [[0, 1], [9, 3]]
math.subset(b, math.index(2, [0, 1]), [4, 5]) // Array, [[0, 1], [2, 3], [4, 5]]

// replace a subset. The subset will be applied to the matrix itself
c.subset(math.index(0, 1),1)                  // Matrix, [[0, 1], [0, 0]]
c.subset(math.index(1, [0, 1]), [2, 3])       // Matrix, [[0, 1], [2, 3]]
e.resize([2, 3], 0)                           // Matrix, [[0, 0, 0], [0, 0, 0]]
e.subset(math.index(1, 2), 5)                 // Matrix, [[0, 0, 0], [0, 0, 5]]
```

## Migrate indexing behavior to mathjs v15

With the release of math.js v15, the behavior of `subset` when indexing matrices and arrays has changed. If your code relies on the previous behavior (where indexing with an array or matrix of size 1 would always return the value itself), you may need to update your code or enable legacy mode.

To maintain the old indexing behavior without need for any code changes, use the configuration option `legacySubset`:

```js
math.config({ legacySubset: true })
```

To migrate your code, you'll have to change all matrix indexes from the old index notation to the new index notation. Basically: scalar indexes have to be wrapped in array brackets if you want an array as output. Here some examples:

```js
const m = math.matrix([[1, 2, 3], [4, 5, 6]])
```

| v14 code                                     | v15 equivalent code                       | Result             |
|----------------------------------------------|-------------------------------------------|--------------------|
| `math.subset(m, math.index([0, 1], [1, 2]))` | No change needed                          | `[[2, 3], [5, 6]]` |
| `math.subset(m, math.index(1, [1, 2]))`      | `math.subset(m, math.index([1], [1, 2]))` | `[[5, 6]]`         |
| `math.subset(m, math.index([0, 1], 2))`      | `math.subset(m, math.index([0, 1], [2]))` | `[[3], [6]]`       |
| `math.subset(m, math.index(1, 2))`           | No change needed                          | 6                  |


> **Tip:**  
> If you want to get a scalar value, use scalar indices.  
> If you want to preserve dimensions, use array, matrix or range indices.

## Getting and setting a value in a matrix

There are two methods available on matrices that allow to get or set a single 
value inside a matrix. It is important to note that the `set` method will 
mutate the matrix.

```js
const p = math.matrix([[1, 2], [3, 4]])
p.set([0, 1], 5)
// p is now [[1, 5], [3, 4]]
p.get([1, 0]) // 3
```

When setting a value at a location outside the current matrix size using the
method `.set()`, the matrix will be resized. By default, new items will be 
initialized with zero, but it is possible to specify an alternative value using
the optional third argument `defaultValue`.

## Advanced Indexing

Boolean array indexing is a technique that allows you to filter, replace, and set values in an array based on logical conditions. This can be done by creating a boolean array that represents the desired conditions, and then using that array as an index to select the elements of the original array that meet those conditions.

For example, a boolean array can be created to represent all the even numbers in an array, and then used to filter the original array to only include the even numbers. Alternatively, a boolean array can be created to represent all the elements of an array that are greater than a certain value, and then used to replace all the elements of the original array that are greater than that value with a new value.


```js
const q = [1, 2, 3, 4]
math.subset(q, math.index([true, false, true, false]))      // Array [1, 3]

// filtering
math.subset(q, math.index(math.larger(q, 2)))               // Array [3, 4]

// filtering with no matches
math.subset(q, math.index(math.larger(q, 5)))               // Array []

// setting specific values, please note that the replacement value is broadcasted
q = math.subset(q, math.index(math.smaller(q, 3)), 0)       // q = [0, 0, 3, 4]

// replacing specific values
math.subset(q, math.index(math.equal(q, 0)), [1, 2])        // q = [1, 2, 3, 4]
```

The same can be accomplished in the parser in a much more compact manner. Please note that everything after `#` are comments.
```js
math.evaluate(`
q = [1, 2, 3, 4]
q[[true, false, true, false]] # Matrix [1, 3]
q[q>2]                        # Matrix [3, 4]
q[q>5]                        # Matrix []
q[q <3] = 0                   # q = [0, 0, 3, 4]
q[q==0] = [1, 2]              # q = [1, 2, 3, 4]
`)
```
The expression inside the index can be as complex as needed as long it evaluates to an array of booleans of the same size.
```js
math.evaluate(`
q = [1, 2, 3, 4]
r = [6, 5, 4, 3]
q[q > 3 and r < 4]     # [4]
`)
```

## Iterating

Matrices contain functions `map` and `forEach` to iterate over all elements of
the (multidimensional) matrix. The callback function of `map` and `forEach` has
three parameters: `value` (the value of the currently iterated element),
`index` (an array with the index value for each dimension), and `matrix` (the
matrix being iterated). This syntax is similar to the `map` and `forEach`
functions of native JavaScript Arrays, except that the index is no number but
an Array with numbers for each dimension.

```js
const a = math.matrix([[0, 1], [2, 3], [4, 5]])

// The iteration below will output the following in the console:
//    value: 0 index: [0, 0]
//    value: 1 index: [0, 1]
//    value: 2 index: [1, 0]
//    value: 3 index: [1, 1]
//    value: 4 index: [2, 0]
//    value: 5 index: [2, 1]
a.forEach(function (value, index, matrix) {
  console.log('value:', value, 'index:', index) 
}) 

// Apply a transformation on the matrix
const b = a.map(function (value, index, matrix) {
  return math.multiply(math.sin(value), math.exp(math.abs(value))) 
}) 
console.log(b.format(5))  // [[0, 2.2874], [6.7188, 2.8345], [-41.32, -142.32]]

// Create a matrix with the cumulative of all elements
let count = 0
const cum = a.map(function (value, index, matrix) {
  count += value 
  return count 
}) 
console.log(cum.toString())  // [[0, 1], [3, 6], [10, 15]]
```

### Iterating over multiple Matrices or Arrays

You can iterate over multiple matrices or arrays by using the `map` function. Mapping allows to perform element-wise operations on matrices by automatically adjusting their sizes to match each other.

To iterate over multiple matrices, you can use the `map` function. The `map` function applies a given function to each element of the matrices and returns a new matrix with the results.

Here's an example of iterating over two matrices and adding their corresponding elements:

```js
const a = math.matrix([[1, 2], [3, 4]]);
const b = math.matrix([[5, 6], [7, 8]]);

const result = math.map(a, b, (x, y) => x + y);

console.log(result); // [[6, 8], [10, 12]]
```

In this example, the `map` function takes matrices as the first two arguments and a callback function `(x, y) => x + y` as the third argument. The callback function is applied to each element of the matrices, where `x` represents the corresponding element from matrix `a` and `y` represents the corresponding element from matrix `b`. The result is a new matrix with the element-wise sum of the two matrices.

By using broadcasting and the `map` function, you can easily iterate over multiple matrices and perform element-wise operations.

```js
const a = math.matrix([10, 20])
const b = math.matrix([[3, 4], [5, 6]])

const result = math.map(a, b, (x, y) => x + y)
console.log(result); // [[13, 24], [15, 26]]
```

It's also possible to provide a callback with an index and the broadcasted arrays. Like `(valueA, valueB, index)` or even `(valueA, valueB, index, broadcastedMatrixA, broadcastedMatrixB)`. There is no specific limit for the number of matrices `N` that can be mapped. Thus, the callback can have `N` arguments, `N+1` arguments in the case of including the index, or `2N+1` arguments in the case of including the index and the broadcasted matrices in the callback. 

At this moment `forEach` doesn't include the same functionality.

## Storage types

Math.js supports both dense matrices and sparse matrices. Sparse matrices are efficient for matrices largely containing zeros. In that case they save a lot of memory, and calculations can be much faster than for dense matrices.

Math.js supports two type of matrices:

- Dense matrix (`'dense'`, `default`) A regular, dense matrix, supporting multidimensional matrices. This is the default matrix type.
- Sparse matrix (`'sparse'`): A two dimensional sparse matrix implementation.

The type of matrix can be selected when creating a matrix using the construction functions `matrix`, `diag`, `identity`, `ones`, and `zeros`.

```js
// create sparse matrices
const m1 = math.matrix([[0, 1], [0, 0]], 'sparse')
const m2 = math.identity(1000, 1000, 'sparse')
```

You can also coerce an array or matrix into sparse storage format with the
`sparse` function.
```js
const md = math.matrix([[0, 1], [0,0]])  // dense
const ms = math.sparse(md)               // sparse
```

Caution: `sparse` called on a JavaScript array of _n_ plain numbers produces
a matrix with one column and _n_ rows -- in contrast to `matrix`, which
produces a 1-dimensional matrix object with _n_ entries, i.e., a vector
(_not_ a 1 by _n_ "row vector" nor an _n_ by 1 "column vector", but just a plain
vector of length _n_).
```js
const mv = math.matrix([0, 0, 1])  // Has size [3]
const mc = math.sparse([0, 0, 1])  // A "column vector," has size [3, 1]
```

## API

All relevant functions in math.js support Matrices and Arrays. Functions like `math.add` and `math.subtract`, `math.sqrt` handle matrices element wise. There is a set of functions specifically for creating or manipulating matrices, such as:

- Functions like `math.matrix` and `math.sparse`, `math.ones`, `math.zeros`, and `math.identity` to create a matrix.
- Functions like `math.subset` and `math.index` to get or replace a part of a matrix
- Functions like `math.transpose` and `math.diag` to manipulate matrices.

A full list of matrix functions is available on the [functions reference page](../reference/functions.md#matrix-functions).

Two types of matrix classes are available in math.js, for storage of dense and sparse matrices. Although they contain public functions documented as follows, using the following API directly is *not* recommended. Prefer using the functions in the "math" namespace wherever possible.

- [DenseMatrix](../reference/classes/densematrix.md)
- [SparseMatrix](../reference/classes/sparsematrix.md)
