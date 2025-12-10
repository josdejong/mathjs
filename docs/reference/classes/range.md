<!-- This documentation has a great deal of overlap with the comments in
     src/type/matrix/Range.js, from which some of it is copied wholesale.
     That's not an ideal situation for maintenance; should this be generated
     from the source file in some way, as the function reference pages are?
 -->
 ## Range

This type implements Matrix objects whose entries are given by arithmetic
sequences. Only the constants in the definition of the sequence are kept in
memory; the actual entries are generated on the fly as needed. This design
makes Range the most efficient in memory usage and often speed, for matrices
that happen to have entries in this form. Among Matrix implementations, only
Ranges can represent entities that are infinite in extent, with more
entries always available to be generated on demand.

Note that the term "arithmetic sequence" does not imply that Ranges are
only (1-dimensional) vectors. If the a Range starts with, say [1, 2, 3],
and its step is 3 and its length is 4, then it represents the 2-dimensional
matrix `[[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]`.

Note that a Range matrix object is immutable, in the sense that its definition
and therefore its entries cannot be changed once the Range has been constructed.
Therefore, some methods of the [Matrix API](matrix.md) may throw errors if
they would entail in-place changes of a Range. Such exceptions are not
otherwise listed here.

This page documents all other differeces and extensions to the basic Matrix
interface.

### Constructing a Range

Ranges have the most options for construction, representing the many possible
ways to define an arithmetic sequence.

#### new Range(start?, end?, step?, options?)

First, note that the options argument, which is distinguished as a plain
object with some of the keys listed below as "attributes" of a Range, may
appear at any point among the other constructor arguments. The other arguments
are convenience positional arguments, corresponding to the start, end, and
step attributes; they can be used instead of the equivalent options, but
the same attribute may not be specified in two different ways. Thus,
`new Range({end: 10}, 1)` and `new Range(1, {end: 10})` is OK, but
`new Range(1, {start: 1, end: 10})` is not.

Every Range has several attributes that determine its entries. Once
constructed, these attributes cannot be changed; they are read-only.
Moreover, to allow different terminology that may be clearer in
different uses of this class, each attribute can be specified (at
construction time) or read (at any later time) via either of two
synonymous property names, separated by a vertical bar in the lists below.
Note that it is perfectly OK to specify an attribute using one of its
two names and read it later using the other; but the same attribute cannot
be specified in two different ways, even if the values match.

Every Range has these attributes:
  * start|from: the first element of the Range
  * step|by: the step or common difference of the Range
  * length|for: the number of elements in the Range. Note that this attribute
    may be Infinity, so that a Range can represent an unending arithmetic
    progression.

In addition, a Range may have one or both of the following attributes:
  * last|to: the inclusive final limit of the Range. This value must be
    of the form `start + t * step` for some number `t`, in which case the
    Range consists of `start + s * step` for all nonnegative integers `s ≤ t`.
  * end|til: an exclusive limit of the Range. This value must be of the
    form `start + u * step` for some number `u`, in which case the Range
    consists of `start + s * step` for all nonnegative integers `s < u`.

There is a consistency relation, in that if the last value is the start
value plus `t` times the step value, then the length must be the floor
of `t`, plus one. Similarly, if the end value is the start value plus `u`
times the step, then the length must be the ceiling of u. If the step
of a Range is zero, then it generally does not have an end or last value
to avoid breaking this consistency relation.

A Range can be constructed from a plain object with any of the above
attributes, presuming they are consistent. Other positional arguments, if any,
are interprete as described above.

Because of the consistency relation and defaults provided for convenience,
some or even all of the attributes may be missing in the constructor.
If any are missing, they are deduced for you in the following order:
 * step|by: filled in via consistency if start, length, and at least
   one of last and end are specified; otherwise set to the "one" value of
   the type of last, end, or start if specified, or the number 1 if not.
 * start|from: filled in via consistency with the step if length and at
   least one of last and end are specified; otherwise set to the "zero"
   value of the type of last or end if specified, or the number 0 if not.
 * length|for: filled in via consistency with start and step if at least
   one of last and end are specified; otherwise, set to 0.

In addition, if the length value is finite and the step is nonzero, the
following are set whether or not they were specified, to canonicalize
the attributes of the Range (which makes it easier to use and interpret):
 * last|to: Set to the start value plus the step times the length minus one.
 * end|til: Set to the start value plus the step times the length.

Note that the endpoints and increment may be specified with any type
handled by mathjs, but they must support the operations needed by Range
(addition, multiplication by an integer ordinary number, comparison).
The data type of the range is the data type of `start + n*step`, where `n`
is an integer number; the Range class assumes that this data type does not
depend on the value of `n`.

#### [DEPRECATED] Range.parse(str)

This static function generates Range objects from strings using the syntax
(`from:last` or `from:by:last`) of the mathjs expression language. It has
been deprecated in favor of calling `math.evaluate()` directly.

### Instance methods of Matrix

#### .storage()

Always returns 'range'.

#### .datatype()

Always deduced via `math.typeOf` on the expression `start + 1 * step`.

#### .create()

Note that this function can be given a data array, and will attempt
to find attributes that will regenerate the array. It will throw an
error if the entries of the input do not form an arithmetic sequence.

#### .layer(s)

Note that this is the `s`-th element of the arithmetic sequnce, and it
has a simple formula: it is `start` plus `s * step`.

### New instance methods of Range

#### .getDataType()

Purely for conssistency with the other Matrix implmentations, this method
is just a synonym for `.datatype`

#### .createRange()

A companion to the `.create()` method that takes exactly the parameters of
the constructor, rather than the specific parameters enforced on the
`.create()` method by virtue of the Matrix API.

#### .min()

Returns the smallest element of the sequence. If there is none because
the sequence has zero length or is infinite and decreasing, returns undefined.
If the elements of the sequence are not comparable, throws an error.

#### .max()

Returns the largest element of the sequence. If there is none because
the sequence has zero length or is infinite and increasing, returns undefined.
If the elements of the sequence are not comparable, throws an error.

#### .rows()

Returns a JavaScript Array of the rows of this Matrix, each as a 1-D
DenseMatrix. Throws an error if this Matrix is not 2-dimensional.

#### .columns()

Returns a JavaScript Array of the columns of this Matrix, each as a 1-D
DenseMatrix. Throws an error if this Matrix is not 2-dimensional.

#### .toNumber()

Returns this Matrix itself if the entries of the matrix are JavaScriot
`number` type. Otherwise (if possible) it returns a fresh Range consisting
of all of the entries of this Range converted to `number`. Throws an
error if such conversion is not possible.

#### .toJSON()

Returns a JSON (plain object) representation of this Range. This
representation can be restored to a Range using the static `.fromJson`
method.

### New static methods

#### DenseMatrix.fromJSON(json)

Constructs a fresh Range from _json_, which should be the result of
a `.toJSON()` call on some Range.
