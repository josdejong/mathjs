<!-- Should there be some systematic relationship between this documentation
     and the comments in src/type/matrix/Matrix.js? Right now they are
     completely independent.
  -->
# Matrix API

The mathjs library provides a number of classes that implement the Matrix API
described here, so that they can be used (at least to a certain extent)
interchangeably to represent rectangular arrays of numeric values, which may
be 1-dimensional (a vector of numbers, for example), 2-dimensional (ordinary
matrices), or 3-dimensional (rectangular solid blocks of numbers, in which
each "slice" is a matrix), or even higher-dimensional.

Each of the implementing classes is subclass of the Matrix class, which
serves just to set the interface and generally speaking contains no
implementations of its own for the methods listed below.

Every Matrix implementation should define a string "storage format",
describing the concrete aspects of that particular implementation. For example,
the SparseMatrix implementation that stores only the nonzero entries has
its storage format equal to "sparse". Each implementation should corresponde
to a single unique storage format and vice-versa.

A Matrix can optionally have a datatype, which is the mathjs name of the
data type of every element stored in the Matrix. They are also allowed to
be heterogeneous, in which case the datatype should be "mixed", undefined, or
the empty string.

## Instance methods of all Matrix objects

### .storage()

Returns the storage format of the Matrix, as a string.

### .datatype()

Returns the data type of the Matrix, as a string, or possibly undefined if
the Matrix is heterogeneous or if the data type is not necessarily known.

### .clone()

Returns a fresh "deep copy" of this Matrix.

### .create(data, datatype?)

Generates a fresh Matrix of the same storage format, containing the given
_data_ (which may be an ordinary JavaScript Array, possibly nested to represent
a multidimensional matrix, or another Matrix), and having the given _datatype_,
which may be omitted to infer the datatype from the _data_.

### .size()

Returns the extent of this matrix in each of its dimensions, as an ordinary
JavaScript Array of nonnegative numbers.

Some examples:
```
math.matrix([1, 2, 3]).size() // [3]
math.matrix([[1, 2, 3], [4, 5, 6]]) // [3, 2]
```

### .resize(size, defaultValue?, copy?)

Changes the matrix size. If _copy_ is specified and true, leaves this Matrix
alone; otherwise alters it in place. In either case, the changed Matrix, of the
same storage type as this Matrix, is returned. If the new size is larger in any
dimension than the current size, new entries are filled in with the
_defaultValue_ or zero if it is not specified. If the new size is smaller
in any dimension, entries are dropped. (A combination is possible). Note that
if the new size has more entries than this Matrix has dimensions, this Matrix
is interpreted as lying along the **initial** dimensions of the resulting
matrix. (In the 1- to 2-dimensional case, that means this Matrix becomes
a **column**, not a row, of the result.)

Some examples:
```
math.matrix([[1, 4], [2, 5], [3, 6]]).resize([2, 3], -1)
   // [[1, 4, -1], [2, 5, -1]]
math.matrix([1, 2, 3]).resize([4, 2])
   // [[1, 0], [2, 0], [3, 0], [0, 0]]
```

### .subset(index, replacement?, defaultValue?)

Returns (and possibly replaces) a subarray of a Matrix. The _index_ must be
an instance of the mathjs [Index](matrixindex.md) type, specifying the extent
of the subarray in question along each dimension of the matrix. If none of
the optional arguments are specified, the corresponding subarray is simply
returned as a Matrix of the same storage format as this one. In this form, it
is an error if the index extends outside the bounds of this matrix.

If _replacement_ and possibly also _defaultValue_ are specified, it is allowed
(but by no means necessary) for the _index_ to extend outside the bounds of the
matrix. If so, this matrix is first resized to the smallest rectangle that will
accommodate the index, filling in any new entries by the _defaultValue_ or
zero if that argument is not supplied. (So if the specified _index_ is within
the current bounds of this matrix, the _defaultValue_ argument, if any, is
simply ignored.) Then the subarray designated by the index is overwritten by
the _replacement_, potentially broadcasting the entries of the _replacement_
if necessary to fill the entire designated subarray. Finally, this **entire**
matrix is returned (not just the replaced portion), unlike in the plain
access case.

Some examples:
```
const M = math.matrix([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 9, 8]])
M.subset(math.index('1:2', '0:1')) // [[4, 5], [8, 9]]
M.subset(math.index('1:2', '0:1'), [[1, 2], [3, 4]])
    // [[0, 1, 2, 3], [1, 2, 6, 7], [3, 4, 9, 8]]
M.subset(math.index('0:1', '3:4'), [[9, 8], [7, 6]], -99)
    // [[0, 1, 2, 9, 8], [1, 2, 6, 7, 6], [3, 4, 9, 8, -99]]
M.subset(math.index('1:2', '2:4'), 5)
    // [[0, 1, 2, 9, 8], [1, 2, 5, 5, 5], [3, 4, 5, 5, 5]]
M.subset(math.index('1:2', '2:4'), [0, 1, 2])
    // [[0, 1, 2, 9, 8], [1, 2, 0, 1, 2], [3, 4, 0, 1, 2]]
M.subset(math.index('1:2', '2:4'), [[7], [6]])
    // [[0, 1, 2, 9, 8], [1, 2, 7, 7, 7], [3, 4, 6, 6, 6]]
```

### .layer(n)

Returns the _n_ th "top-level" slice of this matrix as a Matrix of the same
type, or as the entry itself if this matrix is 1-dimensional. The argument _n_
must be an integer number at least 0 and less than the extent of this matrix
in the first dimension.

Some examples:
```
math.matrix([1, 2, 3]).layer(1) // 2
math.matrix([[1, 2], [3, 4], [6, 7]]).layer(1) // [3, 4]
math.matrix([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]).layer(1) // [[5, 6], [7, 8]]
```

### .get(position)

Returns a single entry of this matrix at a specific _position_ given as
an array of numbers, each one the (0-based) index along the corresponding
dimension. An error will be thrown if the _position_ lies outside the bounds
of this matrix.

Some examples:
```
math.matrix([1, 2, 3]).get([2]) // 3
math.matrix([[1, 2], [3, 4], [6, 7]]).get([1, 0]) // 3
math.matrix([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]).get([0, 1, 0]) // 3
```

### .set(position, value, defaultValue?)

Replaces a single entry of this matrix and returns the entire matrix. In this
method, it is permissible for the position to lie outside the current bounds
of the matrix, in which case the matrix is first resized to the smallest
rectangular array including the position, using the _defaultValue_ or zero if
not specified for new entrues.

Some examples:
```
const M = math.matrix([1, 2, 3])
M.set([2], 4) // [1, 2, 4]
M.set([0, 1], 8, -1) // [[1, 8], [2, -1], [4, -1]]
```

### .reshape(size, copy?)

The entries of this Matrix in row-major order are inserted into
a changed Matrix having the specified _size_ in row-major order. Unlike with
`.resize`, the resulting Matrix is required to have exactly the same number
of entries as this Matrix. But like `.resize`, the current Matrix is altered
in place unless the the _copy_ argument is specified and true, in which
case this Matrix is left alone and the changed Matrix (of the same storage
format) is returned.

Note that because of the rule on the number of entries, it is allowed to
specify (no more than) one of the extents of the new _size_ as -1, in which
case that extent is calculated from the others so that the number of entries
will match.

Some examples:
```
math.matrix([[1, 4], [2, 5], [3, 6]]).reshape([2, 3])
   // [[1, 4, 2], [5, 3, 6]]
math.matrix([1, 2, 3, 4, 5, 6, 7, 8]).reshape([2, -1])
   // [[1, 2, 3, 4], [5, 6, 7, 8]]
```

### .map(callback, skipZeros?)

Returns a fresh matrix of the same size and storage type as this Matrix, in
which each entry has been replaced by the result of executing the _callback_
with three arguments: the value of the entry, the position of the element as a
plain JavaScript Array of nonnegative numbers, and this Matrix being traversed.

If the _skipZeros_ argument is specified and true, zero entries of this Matrix
are left alone (and the _callback_ is not executed for them).

### .forEach(callback)

Executes the _callback_ (with the same arguments as in `.map` for each
entry of this Matrix.

### [Symbol.iterator]

Implementations define a function on the special JavaScript iterator Symbol
so that the following syntax is supported:
```
const M = math.matrix([[1, 2, 3], [4, 5, 6]])
for (const {value, position} of M) {
  console.log(`M[${position[0]}, ${position[1]}] = ${value}`)
}
```
This example code will print out a listing of all of the entries of `M` in
row-major order (so in numerical order in this case).

### .toArray(), .valueOf()

These synonymous methods return the content of this Matrix as a JavaScript
Array, with nesting depth equal to the number of dimensions of this Matrix.

### .format(options)

Obtain a string representation of this Matrix. It accepts the same options as
the mathjs [`format` function](../functions/format.js).

### .toString()

Converts this Matrix to a string in a vanilla fashion (similar to the way
the corresponding nested Array would look).

## Implementations

The current concrete implementations of this interface are listed below,
with links to their specific documentation.

* [DenseMatrix](densematrix.md)
* [SparseMatrix](sparsematrix.md)
* [Range](range.md)
