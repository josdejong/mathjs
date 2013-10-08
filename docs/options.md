# Options

Math.js contains a number of global options. The options are defined in
`math.options`.

- `precision`. The precision used when formatting numbers.
  A number, default value is `5`. The precision is used by the function
  `math.format` and by the `toString` functions of units, complex numbers,
  and matrices.

- `matrix.default`. The default type of matrix output for functions. Available
  values are: `"array"` or `"matrix"` (default).

  The type of matrix output from functions is when possible determined from the
  input: An array as input will return an Array, a Matrix as input will return
  a Matrix. In case of mixed input or no matrix as input, the type of output is
  determined by the option `math.matrix.default`.
