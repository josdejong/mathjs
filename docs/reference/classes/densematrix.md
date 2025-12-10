<a name="DenseMatrix"></a>
## DenseMatrix

Implementation of the [Matrix](matrix.md) API as a wrapper around ordinary
(nested) JavaScript Arrays to hold the content. This representation is
reasonably efficient for "dense" matrices in which most entries are nonzero,
which may contain arbitrary data in any entry.

This page documents only the differences and extensions to the basic Matrix
API. Any methods of that API not mentioned here operate exactly as documented
under [Matrix](matrix.md)

### Constructing a DenseMatrix

#### new DenseMatrix(data? datatype?)

The _data_ should be a (nested, rectangular) Array or a Matrix. Creates a
DenseMatrix whose contents consist of a deep copy of the provided _data_.
Any supplied _datatype_ is trusted without checking. If it is not supplied,
the datatype is copied from the _data_ argument if it is a Matrix, and
otherwise it is simply left as `undefined`. If _data_ is unspecified, a
0-dimensional DenseMatrix is constructed.

### Instance methods of Matrix

#### .storage()

Always returns 'dense'

#### .datatype()

May be undefined, even if the entries are of uniform type, if no datatype
was specified at construction time. See `.getDataType()` for determining
a datatype from the data of the matrix itself.

### New instance methods provided by DenseMatrix

#### .getDataType()

Examines the entries of the matrix to see if they are of uniform type, and
if so, returns the string mathjs name of that type. If not, returns "mixed".

#### .rows()

Returns a JavaScript Array of the rows of this Matrix, each as a 1-D
DenseMatrix. Throws an error if this Matrix is not 2-dimensional.

#### .columns()

Returns a JavaScript Array of the columns of this Matrix, each as a 1-D
DenseMatrix. Throws an error if this Matrix is not 2-dimensional.

#### .diagonal(k?)

When _k_ is not specified, returns the main diagonal of this Matrix, as
as a DenseMatrix. When it is, returns the diagonal _k_ entries above the
main diagonal when _k_ is positive, and the absolut value of _k_ entries
below the main diagonal when _k_ is negative. Note that these diagonals do
_not_ "wrap around", so in a an n×n matrix, `.diagonal(k)` will have n - |k|
entries.

#### swapRows(i, j)

Alters this Matrix in place by swapping rows _i_ and _j_.

#### .toJSON()

Returns a JSON (plain object) representation of this Matrix. This
representation can be restored to a DenseMatrix using the static `.fromJson`
method.

### New static methods

#### DenseMatrix.diagonal(size, diagonalValue?, k?, offDiagValue?)

Constructs a fresh diagonal DenseMatrix of the given _size_. The diagonal
entries are along the main diagonal if _k_ is not specified or zero; otherwise
they are along an offset diagonal as per the _k_ parameter of the
`.diagonal` instance method. The diagonal entries are set to _diagonalValue_
if it is specified, or one otherwise. The off-diagonal entries are set to
_offDiagValue_ if it is specified, or zero otherwise. Thus
`DenseMatrix.diagonal([3, 3])` returns the usual 3×3 identity matrix.

#### DenseMatrix.fromJSON(json)

Constructs a fresh DenseMatrix from _json_, which should be the result of
a `.toJSON()` call on some DenseMatrix.
