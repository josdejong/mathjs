---
layout: default
---

<h1 id="function-reference">Function reference <a href="#function-reference" title="Permalink">#</a></h1>

<h2 id="core-functions">Core functions <a href="#core-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.config(config:&nbsp;Object):&nbsp;Object](functions/config.html) | Set configuration options for math.
[math.import(object,&nbsp;override)](functions/import.html) | Import functions from an object or a module.
[math.typed(name,&nbsp;signatures)&nbsp;:&nbsp;function](functions/typed.html) | Create a typed-function which checks the types of the arguments and can match them against multiple provided signatures.

<h2 id="construction-functions">Construction functions <a href="#construction-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.bigint(value)](functions/bigint.html) | Create a bigint or convert a string, boolean, or unit to a bigint.
[math.bignumber(x)](functions/bignumber.html) | Create a BigNumber, which can store numbers with arbitrary precision.
[math.boolean(x)](functions/boolean.html) | Create a boolean or convert a string or number to a boolean.
[math.chain(value)](functions/chain.html) | Wrap any value in a chain, allowing to perform chained operations on the value.
[math.complex(re,&nbsp;im)](functions/complex.html) | Create a complex value or convert a value to a complex value.
[math.createUnit(units)](functions/createUnit.html) | Create a user-defined unit and register it with the Unit type.
[math.fraction(value)](functions/fraction.html) | Create a fraction or convert a value to a fraction.
[math.index(range1,&nbsp;range2,&nbsp;...)](functions/index.html) | Create an index.
[math.matrix(x)](functions/matrix.html) | Create a Matrix.
[math.number(value)](functions/number.html) | Create a number or convert a string, boolean, or unit to a number.
[math.sparse(x)](functions/sparse.html) | Create a Sparse Matrix.
[math.splitUnit(unit,&nbsp;parts)](functions/splitUnit.html) | Split a unit in an array of units whose sum is equal to the original unit.
[math.string(value)](functions/string.html) | Create a string or convert any object into a string.
[math.unit(x)](functions/unit.html) | Create a unit.

<h2 id="expression-functions">Expression functions <a href="#expression-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.compile(expr)](functions/compile.html) | Parse and compile an expression.
[math.evaluate(expr&nbsp;[,&nbsp;scope])](functions/evaluate.html) | Evaluate an expression.
[math.help(search)](functions/help.html) | Retrieve help on a function or data type.
[math.parse(expr&nbsp;[,&nbsp;scope])](functions/parse.html) | Parse an expression.
[math.parser()](functions/parser.html) | Create a `math.

<h2 id="algebra-functions">Algebra functions <a href="#algebra-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.derivative(expr,&nbsp;variable)](functions/derivative.html) | Takes the derivative of an expression expressed in parser Nodes.
[math.leafCount(expr)](functions/leafCount.html) | Gives the number of "leaf nodes" in the parse tree of the given expression A leaf node is one that has no subexpressions, essentially either a symbol or a constant.
[math.lsolve(L,&nbsp;b)](functions/lsolve.html) | Finds one solution of a linear equation system by forwards substitution.
[math.lsolveAll(L,&nbsp;b)](functions/lsolveAll.html) | Finds all solutions of a linear equation system by forwards substitution.
[math.lup(A)](functions/lup.html) | Calculate the Matrix LU decomposition with partial pivoting.
[math.lusolve(A,&nbsp;b)](functions/lusolve.html) | Solves the linear system `A * x = b` where `A` is an [n x n] matrix and `b` is a [n] column vector.
[math.lyap(A,&nbsp;Q)](functions/lyap.html) | Solves the Continuous-time Lyapunov equation AP+PA'+Q=0 for P, where Q is an input matrix.
[math.polynomialRoot(constant, linearCoeff, quadraticCoeff, cubicCoeff)](functions/polynomialRoot.html) | Finds the numerical values of the distinct roots of a polynomial with real or complex coefficients.
[math.qr(A)](functions/qr.html) | Calculate the Matrix QR decomposition.
[math.rationalize(expr)](functions/rationalize.html) | Transform a rationalizable expression in a rational fraction.
[math.resolve(expr,&nbsp;scope)](functions/resolve.html) | resolve(expr, scope) replaces variable nodes with their scoped values.
[math.schur(A)](functions/schur.html) | Performs a real Schur decomposition of the real matrix A = UTU' where U is orthogonal and T is upper quasi-triangular.
[math.simplify(expr)](functions/simplify.html) | Simplify an expression tree.
[math.simplifyConstant(expr)](functions/simplifyConstant.html) | simplifyConstant() takes a mathjs expression (either a Node representing a parse tree or a string which it parses to produce a node), and replaces any subexpression of it consisting entirely of constants with the computed value of that subexpression.
[math.simplifyCore(expr)](functions/simplifyCore.html) | simplifyCore() performs single pass simplification suitable for applications requiring ultimate performance.
[math.slu(A,&nbsp;order,&nbsp;threshold)](functions/slu.html) | Calculate the Sparse Matrix LU decomposition with full pivoting.
[math.sylvester(A,&nbsp;B,&nbsp;C)](functions/sylvester.html) | Solves the real-valued Sylvester equation AX+XB=C for X, where A, B and C are matrices of appropriate dimensions, being A and B squared.
[math.symbolicEqual(expr1,&nbsp;expr2)](functions/symbolicEqual.html) | Attempts to determine if two expressions are symbolically equal, i.
[math.usolve(U,&nbsp;b)](functions/usolve.html) | Finds one solution of a linear equation system by backward substitution.
[math.usolveAll(U,&nbsp;b)](functions/usolveAll.html) | Finds all solutions of a linear equation system by backward substitution.

<h2 id="arithmetic-functions">Arithmetic functions <a href="#arithmetic-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.abs(x)](functions/abs.html) | Calculate the absolute value of a number.
[math.add(x,&nbsp;y)](functions/add.html) | Add two or more values, `x + y`.
[math.cbrt(x&nbsp;[,&nbsp;allRoots])](functions/cbrt.html) | Calculate the cubic root of a value.
[math.ceil(x)](functions/ceil.html) | Round a value towards plus infinity If `x` is complex, both real and imaginary part are rounded towards plus infinity.
[math.cube(x)](functions/cube.html) | Compute the cube of a value, `x * x * x`.
[math.divide(x,&nbsp;y)](functions/divide.html) | Divide two values, `x / y`.
[math.dotDivide(x,&nbsp;y)](functions/dotDivide.html) | Divide two matrices element wise.
[math.dotMultiply(x,&nbsp;y)](functions/dotMultiply.html) | Multiply two matrices element wise.
[math.dotPow(x,&nbsp;y)](functions/dotPow.html) | Calculates the power of x to y element wise.
[math.exp(x)](functions/exp.html) | Calculate the exponential of a value.
[math.expm1(x)](functions/expm1.html) | Calculate the value of subtracting 1 from the exponential value.
[math.fix(x)](functions/fix.html) | Round a value towards zero.
[math.floor(x)](functions/floor.html) | Round a value towards minus infinity.
[math.gcd(a,&nbsp;b)](functions/gcd.html) | Calculate the greatest common divisor for two or more values or arrays.
[math.hypot(a,&nbsp;b,&nbsp;...)](functions/hypot.html) | Calculate the hypotenuse of a list with values.
[math.invmod(a,&nbsp;b)](functions/invmod.html) | Calculate the (modular) multiplicative inverse of a modulo b.
[math.lcm(a,&nbsp;b)](functions/lcm.html) | Calculate the least common multiple for two or more values or arrays.
[math.log(x&nbsp;[,&nbsp;base])](functions/log.html) | Calculate the logarithm of a value.
[math.log10(x)](functions/log10.html) | Calculate the 10-base logarithm of a value.
[math.log1p(x)](functions/log1p.html) | Calculate the logarithm of a `value+1`.
[math.log2(x)](functions/log2.html) | Calculate the 2-base of a value.
[math.mod(x,&nbsp;y)](functions/mod.html) | Calculates the modulus, the remainder of an integer division.
[math.multiply(x,&nbsp;y)](functions/multiply.html) | Multiply two or more values, `x * y`.
[math.norm(x&nbsp;[,&nbsp;p])](functions/norm.html) | Calculate the norm of a number, vector or matrix.
[math.nthRoot(a)](functions/nthRoot.html) | Calculate the nth root of a value.
[math.nthRoots(x)](functions/nthRoots.html) | Calculate the nth roots of a value.
[math.pow(x,&nbsp;y)](functions/pow.html) | Calculates the power of x to y, `x ^ y`.
[math.round(x&nbsp;[,&nbsp;n])](functions/round.html) | Round a value towards the nearest rounded value.
[math.sign(x)](functions/sign.html) | Compute the sign of a value.
[math.sqrt(x)](functions/sqrt.html) | Calculate the square root of a value.
[math.square(x)](functions/square.html) | Compute the square of a value, `x * x`.
[math.subtract(x,&nbsp;y)](functions/subtract.html) | Subtract two values, `x - y`.
[math.unaryMinus(x)](functions/unaryMinus.html) | Inverse the sign of a value, apply a unary minus operation.
[math.unaryPlus(x)](functions/unaryPlus.html) | Unary plus operation.
[math.xgcd(a,&nbsp;b)](functions/xgcd.html) | Calculate the extended greatest common divisor for two values.

<h2 id="bitwise-functions">Bitwise functions <a href="#bitwise-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.bitAnd(x,&nbsp;y)](functions/bitAnd.html) | Bitwise AND two values, `x & y`.
[math.bitNot(x)](functions/bitNot.html) | Bitwise NOT value, `~x`.
[math.bitOr(x,&nbsp;y)](functions/bitOr.html) | Bitwise OR two values, `x | y`.
[math.bitXor(x,&nbsp;y)](functions/bitXor.html) | Bitwise XOR two values, `x ^ y`.
[math.leftShift(x,&nbsp;y)](functions/leftShift.html) | Bitwise left logical shift of a value x by y number of bits, `x << y`.
[math.rightArithShift(x,&nbsp;y)](functions/rightArithShift.html) | Bitwise right arithmetic shift of a value x by y number of bits, `x >> y`.
[math.rightLogShift(x,&nbsp;y)](functions/rightLogShift.html) | Bitwise right logical shift of value x by y number of bits, `x >>> y`.

<h2 id="combinatorics-functions">Combinatorics functions <a href="#combinatorics-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.bellNumbers(n)](functions/bellNumbers.html) | The Bell Numbers count the number of partitions of a set.
[math.catalan(n)](functions/catalan.html) | The Catalan Numbers enumerate combinatorial structures of many different types.
[math.composition(n,&nbsp;k)](functions/composition.html) | The composition counts of n into k parts.
[math.stirlingS2(n,&nbsp;k)](functions/stirlingS2.html) | The Stirling numbers of the second kind, counts the number of ways to partition a set of n labelled objects into k nonempty unlabelled subsets.

<h2 id="complex-functions">Complex functions <a href="#complex-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.arg(x)](functions/arg.html) | Compute the argument of a complex value.
[math.conj(x)](functions/conj.html) | Compute the complex conjugate of a complex value.
[math.im(x)](functions/im.html) | Get the imaginary part of a complex number.
[math.re(x)](functions/re.html) | Get the real part of a complex number.

<h2 id="geometry-functions">Geometry functions <a href="#geometry-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.distance([x1,y1],&nbsp;[x2,y2])](functions/distance.html) | Calculates:    The eucledian distance between two points in N-dimensional spaces.
[math.intersect(endPoint1Line1, endPoint2Line1, endPoint1Line2, endPoint2Line2)](functions/intersect.html) | Calculates the point of intersection of two lines in two or three dimensions and of a line and a plane in three dimensions.

<h2 id="logical-functions">Logical functions <a href="#logical-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.and(x,&nbsp;y)](functions/and.html) | Logical `and`.
[math.not(x)](functions/not.html) | Logical `not`.
[math.nullish(x,&nbsp;y)](functions/nullish.html) | Nullish coalescing operator (??).
[math.or(x,&nbsp;y)](functions/or.html) | Logical `or`.
[math.xor(x,&nbsp;y)](functions/xor.html) | Logical `xor`.

<h2 id="matrix-functions">Matrix functions <a href="#matrix-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.column(value,&nbsp;index)](functions/column.html) | Return a column from a Matrix.
[math.concat(a,&nbsp;b,&nbsp;c,&nbsp;...&nbsp;[,&nbsp;dim])](functions/concat.html) | Concatenate two or more matrices.
[math.count(x)](functions/count.html) | Count the number of elements of a matrix, array or string.
[math.cross(x,&nbsp;y)](functions/cross.html) | Calculate the cross product for two vectors in three dimensional space.
[math.ctranspose(x)](functions/ctranspose.html) | Transpose and complex conjugate a matrix.
[math.det(x)](functions/det.html) | Calculate the determinant of a matrix.
[math.diag(X)](functions/diag.html) | Create a diagonal matrix or retrieve the diagonal of a matrix  When `x` is a vector, a matrix with vector `x` on the diagonal will be returned.
[math.diff(arr)](functions/diff.html) | Create a new matrix or array of the difference between elements of the given array The optional dim parameter lets you specify the dimension to evaluate the difference of If no dimension parameter is passed it is assumed as dimension 0  Dimension is zero-based in javascript and one-based in the parser and can be a number or bignumber Arrays must be 'rectangular' meaning arrays like [1, 2] If something is passed as a matrix it will be returned as a matrix but other than that all matrices are converted to arrays.
[math.dot(x,&nbsp;y)](functions/dot.html) | Calculate the dot product of two vectors.
[math.eigs(x,&nbsp;[prec])](functions/eigs.html) | Compute eigenvalues and optionally eigenvectors of a square matrix.
[math.expm(x)](functions/expm.html) | Compute the matrix exponential, expm(A) = e^A.
[math.fft(arr)](functions/fft.html) | Calculate N-dimensional Fourier transform.
[math.filter(x,&nbsp;test)](functions/filter.html) | Filter the items in an array or one dimensional matrix.
[math.flatten(x)](functions/flatten.html) | Flatten a multidimensional matrix into a single dimensional matrix.
[math.forEach(x,&nbsp;callback)](functions/forEach.html) | Iterate over all elements of a matrix/array, and executes the given callback function.
[math.getMatrixDataType(x)](functions/getMatrixDataType.html) | Find the data type of all elements in a matrix or array, for example 'number' if all items are a number and 'Complex' if all values are complex numbers.
[math.identity(n)](functions/identity.html) | Create a 2-dimensional identity matrix with size m x n or n x n.
[math.ifft(arr)](functions/ifft.html) | Calculate N-dimensional inverse Fourier transform.
[math.inv(x)](functions/inv.html) | Calculate the inverse of a square matrix.
[math.kron(x,&nbsp;y)](functions/kron.html) | Calculates the Kronecker product of 2 matrices or vectors.
[math.map(x,&nbsp;callback)](functions/map.html) | Create a new matrix or array with the results of a callback function executed on each entry of a given matrix/array.
[math.mapSlices(A,&nbsp;dim,&nbsp;callback)](functions/mapSlices.html) | Apply a function that maps an array to a scalar along a given axis of a matrix or array.
[math.matrixFromColumns(...arr)](functions/matrixFromColumns.html) | Create a dense matrix from vectors as individual columns.
[math.matrixFromFunction(size,&nbsp;fn)](functions/matrixFromFunction.html) | Create a matrix by evaluating a generating function at each index.
[math.matrixFromRows(...arr)](functions/matrixFromRows.html) | Create a dense matrix from vectors as individual rows.
[math.ones(m,&nbsp;n,&nbsp;p,&nbsp;...)](functions/ones.html) | Create a matrix filled with ones.
[math.partitionSelect(x,&nbsp;k)](functions/partitionSelect.html) | Partition-based selection of an array or 1D matrix.
[math.pinv(x)](functions/pinv.html) | Calculate the Moore–Penrose inverse of a matrix.
[math.range(start,&nbsp;end&nbsp;[,&nbsp;step])](functions/range.html) | Create a matrix or array containing a range of values.
[math.reshape(x,&nbsp;sizes)](functions/reshape.html) | Reshape a multi dimensional array to fit the specified dimensions.
[math.resize(x,&nbsp;size&nbsp;[,&nbsp;defaultValue])](functions/resize.html) | Resize a matrix.
[math.rotate(w,&nbsp;theta)](functions/rotate.html) | Rotate a vector of size 1x2 counter-clockwise by a given angle Rotate a vector of size 1x3 counter-clockwise by a given angle around the given axis.
[math.rotationMatrix(theta)](functions/rotationMatrix.html) | Create a 2-dimensional counter-clockwise rotation matrix (2x2) for a given angle (expressed in radians).
[math.row(value,&nbsp;index)](functions/row.html) | Return a row from a Matrix.
[math.size(x)](functions/size.html) | Calculate the size of a matrix or scalar.
[math.sort(x)](functions/sort.html) | Sort the items in a matrix.
[math.sqrtm(A)](functions/sqrtm.html) | Calculate the principal square root of a square matrix.
[math.squeeze(x)](functions/squeeze.html) | Squeeze a matrix, remove inner and outer singleton dimensions from a matrix.
[math.subset(x,&nbsp;index&nbsp;[,&nbsp;replacement])](functions/subset.html) | Get or set a subset of a matrix or string.
[math.trace(x)](functions/trace.html) | Calculate the trace of a matrix: the sum of the elements on the main diagonal of a square matrix.
[math.transpose(x)](functions/transpose.html) | Transpose a matrix.
[math.zeros(m,&nbsp;n,&nbsp;p,&nbsp;...)](functions/zeros.html) | Create a matrix filled with zeros.

<h2 id="numeric-functions">Numeric functions <a href="#numeric-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.solveODE(func,&nbsp;tspan,&nbsp;y0)](functions/solveODE.html) | Numerical Integration of Ordinary Differential Equations  Two variable step methods are provided: - "RK23": Bogacki–Shampine method - "RK45": Dormand-Prince method RK5(4)7M (default)  The arguments are expected as follows.

<h2 id="probability-functions">Probability functions <a href="#probability-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.bernoulli(n)](functions/bernoulli.html) | Return the `n`th Bernoulli number, for positive integers `n`.
[math.combinations(n,&nbsp;k)](functions/combinations.html) | Compute the number of ways of picking `k` unordered outcomes from `n` possibilities.
[math.combinationsWithRep(n,&nbsp;k)](functions/combinationsWithRep.html) | Compute the number of ways of picking `k` unordered outcomes from `n` possibilities, allowing individual outcomes to be repeated more than once.
[math.factorial(n)](functions/factorial.html) | Compute the factorial of a value  Factorial only supports an integer value as argument.
[math.gamma(n)](functions/gamma.html) | Compute the gamma function of a value using Lanczos approximation for small values, and an extended Stirling approximation for large values.
[math.kldivergence(x,&nbsp;y)](functions/kldivergence.html) | Calculate the Kullback-Leibler (KL) divergence  between two distributions.
[math.lgamma(n)](functions/lgamma.html) | Logarithm of the gamma function for real, positive numbers and complex numbers, using Lanczos approximation for numbers and Stirling series for complex numbers.
[math.multinomial(a)](functions/multinomial.html) | Multinomial Coefficients compute the number of ways of picking a1, a2, .
[math.permutations(n&nbsp;[,&nbsp;k])](functions/permutations.html) | Compute the number of ways of obtaining an ordered subset of `k` elements from a set of `n` elements.
[math.pickRandom(array)](functions/pickRandom.html) | Random pick one or more values from a one dimensional array.
[math.random([min,&nbsp;max])](functions/random.html) | Return a random number larger or equal to `min` and smaller than `max` using a uniform distribution.
[math.randomInt([min,&nbsp;max])](functions/randomInt.html) | Return a random integer number larger or equal to `min` and smaller than `max` using a uniform distribution.

<h2 id="relational-functions">Relational functions <a href="#relational-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.compare(x,&nbsp;y)](functions/compare.html) | Compare two values.
[math.compareNatural(x,&nbsp;y)](functions/compareNatural.html) | Compare two values of any type in a deterministic, natural way.
[math.compareText(x,&nbsp;y)](functions/compareText.html) | Compare two strings lexically.
[math.deepEqual(x,&nbsp;y)](functions/deepEqual.html) | Test element wise whether two matrices are equal.
[math.equal(x,&nbsp;y)](functions/equal.html) | Test whether two values are equal.
[math.equalText(x,&nbsp;y)](functions/equalText.html) | Check equality of two strings.
[math.larger(x,&nbsp;y)](functions/larger.html) | Test whether value x is larger than y.
[math.largerEq(x,&nbsp;y)](functions/largerEq.html) | Test whether value x is larger or equal to y.
[math.smaller(x,&nbsp;y)](functions/smaller.html) | Test whether value x is smaller than y.
[math.smallerEq(x,&nbsp;y)](functions/smallerEq.html) | Test whether value x is smaller or equal to y.
[math.unequal(x,&nbsp;y)](functions/unequal.html) | Test whether two values are unequal.

<h2 id="set-functions">Set functions <a href="#set-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.setCartesian(set1,&nbsp;set2)](functions/setCartesian.html) | Create the cartesian product of two (multi)sets.
[math.setDifference(set1,&nbsp;set2)](functions/setDifference.html) | Create the difference of two (multi)sets: every element of set1, that is not the element of set2.
[math.setDistinct(set)](functions/setDistinct.html) | Collect the distinct elements of a multiset.
[math.setIntersect(set1,&nbsp;set2)](functions/setIntersect.html) | Create the intersection of two (multi)sets.
[math.setIsSubset(set1,&nbsp;set2)](functions/setIsSubset.html) | Check whether a (multi)set is a subset of another (multi)set.
[math.setMultiplicity(element,&nbsp;set)](functions/setMultiplicity.html) | Count the multiplicity of an element in a multiset.
[math.setPowerset(set)](functions/setPowerset.html) | Create the powerset of a (multi)set.
[math.setSize(set)](functions/setSize.html) | Count the number of elements of a (multi)set.
[math.setSymDifference(set1,&nbsp;set2)](functions/setSymDifference.html) | Create the symmetric difference of two (multi)sets.
[math.setUnion(set1,&nbsp;set2)](functions/setUnion.html) | Create the union of two (multi)sets.

<h2 id="signal-functions">Signal functions <a href="#signal-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.freqz(b,&nbsp;a)](functions/freqz.html) | Calculates the frequency response of a filter given its numerator and denominator coefficients.
[math.zpk2tf(z,&nbsp;p,&nbsp;k)](functions/zpk2tf.html) | Compute the transfer function of a zero-pole-gain model.

<h2 id="special-functions">Special functions <a href="#special-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.erf(x)](functions/erf.html) | Compute the erf function of a value using a rational Chebyshev approximations for different intervals of x.
[math.zeta(n)](functions/zeta.html) | Compute the Riemann Zeta function of a value using an infinite series for all of the complex plane using Riemann's Functional equation.

<h2 id="statistics-functions">Statistics functions <a href="#statistics-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.corr(A,&nbsp;B)](functions/corr.html) | Compute the correlation coefficient of a two list with values, For matrices, the matrix correlation coefficient is calculated.
[math.cumsum(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/cumsum.html) | Compute the cumulative sum of a matrix or a list with values.
[math.mad(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/mad.html) | Compute the median absolute deviation of a matrix or a list with values.
[math.max(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/max.html) | Compute the maximum value of a matrix or a  list with values.
[math.mean(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/mean.html) | Compute the mean value of matrix or a list with values.
[math.median(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/median.html) | Compute the median of a matrix or a list with values.
[math.min(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/min.html) | Compute the minimum value of a matrix or a  list of values.
[math.mode(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/mode.html) | Computes the mode of a set of numbers or a list with values(numbers or characters).
[math.prod(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/prod.html) | Compute the product of a matrix or a list with values.
[math.quantileSeq(A,&nbsp;prob[,&nbsp;sorted])](functions/quantileSeq.html) | Compute the prob order quantile of a matrix or a list with values.
[math.std(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/std.html) | Compute the standard deviation of a matrix or a  list with values.
[math.sum(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/sum.html) | Compute the sum of a matrix or a list with values.
[math.variance(a,&nbsp;b,&nbsp;c,&nbsp;...)](functions/variance.html) | Compute the variance of a matrix or a  list with values.

<h2 id="string-functions">String functions <a href="#string-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.bin(value)](functions/bin.html) | Format a number as binary.
[math.format(value&nbsp;[,&nbsp;precision])](functions/format.html) | Format a value of any type into a string.
[math.hex(value)](functions/hex.html) | Format a number as hexadecimal.
[math.oct(value)](functions/oct.html) | Format a number as octal.
[math.print(template, values [, precision])](functions/print.html) | Interpolate values into a string template.

<h2 id="trigonometry-functions">Trigonometry functions <a href="#trigonometry-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.acos(x)](functions/acos.html) | Calculate the inverse cosine of a value.
[math.acosh(x)](functions/acosh.html) | Calculate the hyperbolic arccos of a value, defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`.
[math.acot(x)](functions/acot.html) | Calculate the inverse cotangent of a value, defined as `acot(x) = atan(1/x)`.
[math.acoth(x)](functions/acoth.html) | Calculate the inverse hyperbolic tangent of a value, defined as `acoth(x) = atanh(1/x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.
[math.acsc(x)](functions/acsc.html) | Calculate the inverse cosecant of a value, defined as `acsc(x) = asin(1/x)`.
[math.acsch(x)](functions/acsch.html) | Calculate the inverse hyperbolic cosecant of a value, defined as `acsch(x) = asinh(1/x) = ln(1/x + sqrt(1/x^2 + 1))`.
[math.asec(x)](functions/asec.html) | Calculate the inverse secant of a value.
[math.asech(x)](functions/asech.html) | Calculate the hyperbolic arcsecant of a value, defined as `asech(x) = acosh(1/x) = ln(sqrt(1/x^2 - 1) + 1/x)`.
[math.asin(x)](functions/asin.html) | Calculate the inverse sine of a value.
[math.asinh(x)](functions/asinh.html) | Calculate the hyperbolic arcsine of a value, defined as `asinh(x) = ln(x + sqrt(x^2 + 1))`.
[math.atan(x)](functions/atan.html) | Calculate the inverse tangent of a value.
[math.atan2(y,&nbsp;x)](functions/atan2.html) | Calculate the inverse tangent function with two arguments, y/x.
[math.atanh(x)](functions/atanh.html) | Calculate the hyperbolic arctangent of a value, defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.
[math.cos(x)](functions/cos.html) | Calculate the cosine of a value.
[math.cosh(x)](functions/cosh.html) | Calculate the hyperbolic cosine of a value, defined as `cosh(x) = 1/2 * (exp(x) + exp(-x))`.
[math.cot(x)](functions/cot.html) | Calculate the cotangent of a value.
[math.coth(x)](functions/coth.html) | Calculate the hyperbolic cotangent of a value, defined as `coth(x) = 1 / tanh(x)`.
[math.csc(x)](functions/csc.html) | Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`.
[math.csch(x)](functions/csch.html) | Calculate the hyperbolic cosecant of a value, defined as `csch(x) = 1 / sinh(x)`.
[math.sec(x)](functions/sec.html) | Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
[math.sech(x)](functions/sech.html) | Calculate the hyperbolic secant of a value, defined as `sech(x) = 1 / cosh(x)`.
[math.sin(x)](functions/sin.html) | Calculate the sine of a value.
[math.sinh(x)](functions/sinh.html) | Calculate the hyperbolic sine of a value, defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`.
[math.tan(x)](functions/tan.html) | Calculate the tangent of a value.
[math.tanh(x)](functions/tanh.html) | Calculate the hyperbolic tangent of a value, defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.

<h2 id="unit-functions">Unit functions <a href="#unit-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.to(x,&nbsp;unit)](functions/to.html) | Change the unit of a value.
[math.toBest(unit)](functions/toBest.html) | Converts a unit to the most appropriate display unit.

<h2 id="utils-functions">Utils functions <a href="#utils-functions" title="Permalink">#</a></h2>

Function | Description
---- | -----------
[math.clone(x)](functions/clone.html) | Clone an object.
[math.hasNumericValue(x)](functions/hasNumericValue.html) | Test whether a value is an numeric value.
[math.isBounded(x)](functions/isBounded.html) | Test whether a value is bounded.
[math.isFinite(x)](functions/isFinite.html) | Test whether a value is finite.
[math.isInteger(x)](functions/isInteger.html) | Test whether a value is an integer number.
[math.isNaN(x)](functions/isNaN.html) | Test whether a value is NaN (not a number).
[math.isNegative(x)](functions/isNegative.html) | Test whether a value is negative: smaller than zero.
[math.isNumeric(x)](functions/isNumeric.html) | Test whether a value is an numeric value.
[math.isPositive(x)](functions/isPositive.html) | Test whether a value is positive: larger than zero.
[math.isPrime(x)](functions/isPrime.html) | Test whether a value is prime: has no divisors other than itself and one.
[math.isZero(x)](functions/isZero.html) | Test whether a value is zero.
[math.numeric(x)](functions/numeric.html) | Convert a numeric input to a specific numeric type: number, BigNumber, bigint, or Fraction.
[math.typeOf(x)](functions/typeOf.html) | Determine the type of an entity.



<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->
