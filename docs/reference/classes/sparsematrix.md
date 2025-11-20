<a name="SparseMatrix"></a>
## SparseMatrix

This type implements a Compressed Column Storage format that provides greater
memory and speed efficiency for sparse matrices, i.e., matrices for which
a significant fraction of the entries are zero. (Note that when nearly all
entries are nonzero, this Storage format is less efficient than
[DenseMatrix](densematrix.md).)

Note that currently the SparseMatrix implementation can only handle
2-dimensional matrices. Therefore, some methods of the [Matrix API](matrix.md)
may throw errors if they would entail the creation of a SparseMatrix of
dimensionality other than two. Such exceptions are not otherwise documented
here.

This page documents all other differences and extensions to the basic
[Matrix](matrix.md) API.

### Constructing a SparseMatrix

#### new SparseMatrix(data, datatype?)

The _data_ should be a (nested, rectangular) Array or a Matrix. Creates a
SparseMatrix whose contents consist of a fresh copy of the provided _data_.
Any supplied _datatype_ is trusted without checking. If it is not supplied,
the datatype is copied from the _data_ argument if it is a Matrix, and
otherwise it is simply left as `undefined`. If _data_ is unspecified, a
2-dimensional DenseMatrix with 0 extent in each dimension is constructed.

### Instance methods of Matrix

#### .storage()

Always returns 'sparse'

#### .datatype()

May be undefined, even if the entries are of uniform type, if no datatype
was specified at construction time. See `.getDataType()` for determining
a datatype from the data of the matrix itself.

### New instance methods provided by DenseMatrix

#### .getDataType()

Examines the entries of the matrix to see if they are of uniform type, and
if so, returns the string mathjs name of that type. If not, returns "mixed".

#### .density()

Returns the fraction of entries that are nonzero, as a JavaScript number.

#### .diagonal(k?)

When _k_ is not specified, returns the main diagonal of this Matrix, as
as a SparseMatrix. When it is, returns the diagonal _k_ entries above the
main diagonal when _k_ is positive, and the absolut value of _k_ entries
below the main diagonal when _k_ is negative. Note that these diagonals do
_not_ "wrap around", so in a an n×n matrix, `.diagonal(k)` will have n - |k|
entries.

#### .toJSON()

Returns a JSON (plain object) representation of this Matrix. This
representation can be restored to a SparseMatrix using the static `.fromJson`
method.

#### swapRows(i, j)

Alters this Matrix in place by swapping rows _i_ and _j_.


### New static methods

#### DenseMatrix.diagonal(size, diagonalValue?, k?, offDiagValue?)

Constructs a fresh diagonal SparseMatrix of the given _size_. The diagonal
entries are along the main diagonal if _k_ is not specified or zero; otherwise
they are along an offset diagonal as per the _k_ parameter of the
`.diagonal` instance method. The diagonal entries are set to _diagonalValue_
if it is specified, or one otherwise. The off-diagonal entries are set to
_offDiagValue_ if it is specified, or zero otherwise. (Note that if both
the diagonal and off-diagonal values are nonzero, then SparseMatrix is likely
not a good storage format for the Matrix.) Thus `SparseMatrix.diagonal([3, 3])`
returns the usual 3×3 identity matrix.

#### SparseMatrix.fromJSON(json)

Constructs a fresh SparseMatrix from _json_, which should be the result of
a `.toJSON()` call on some SparseMatrix.
