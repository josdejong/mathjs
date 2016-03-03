# Function reference

## Core functions

Function | Description
---- | -----------
[math.config(config:&nbsp;Object):&nbsp;Object](config.md) | Set configuration options for math.
[math.import(object,&nbsp;override)](import.md) | Import functions from an object or a module.
[math.typed(name,&nbsp;signatures)&nbsp;:&nbsp;function](typed.md) | Create a typed-function which checks the types of the arguments and can match them against multiple provided signatures.

## Construction functions

Function | Description
---- | -----------
[math.bignumber(x)](bignumber.md) | Create a BigNumber, which can store numbers with arbitrary precision.
[math.boolean(x)](boolean.md) | Create a boolean or convert a string or number to a boolean.
[math.chain(value)](chain.md) | Wrap any value in a chain, allowing to perform chained operations on the value.
[math.complex(re,&nbsp;im)](complex.md) | Create a complex value or convert a value to a complex value.
[math.fraction(numerator,&nbsp;denominator)](fraction.md) | Create a fraction convert a value to a fraction.
[math.index(range1,&nbsp;range2,&nbsp;...)](index.md) | Create an index.
[math.matrix(x)](matrix.md) | Create a Matrix.
[math.number(value)](number.md) | Create a number or convert a string, boolean, or unit to a number.
[math.sparse(x)](sparse.md) | Create a Sparse Matrix.
[math.string(value)](string.md) | Create a string or convert any object into a string.
[math.unit(x)](unit.md) | Create a unit.

## Expression functions

Function | Description
---- | -----------
[math.compile(expr)](compile.md) | Parse and compile an expression.
[math.eval(expr&nbsp;[,&nbsp;scope])](eval.md) | Evaluate an expression.
[math.help(search)](help.md) | Retrieve help on a function or data type.
[math.parse(expr&nbsp;[,&nbsp;scope])](parse.md) | Parse an expression.
[math.parser()](parser.md) | Create a parser.

## Algebra functions

Function | Description
---- | -----------
[math.lsolve(L,&nbsp;b)](lsolve.md) | Solves the linear equation system by forwards substitution.
[math.lup(A)](lup.md) | Calculate the Matrix LU decomposition with partial pivoting.
[math.lusolve(A,&nbsp;b)](lusolve.md) | Solves the linear system `A * x = b` where `A` is an [n x n] matrix and `b` is a [n] column vector.
[math.slu(A,&nbsp;order,&nbsp;threshold)](slu.md) | Calculate the Sparse Matrix LU decomposition with full pivoting.
[math.usolve(U,&nbsp;b)](usolve.md) | Solves the linear equation system by backward substitution.

## Arithmetic functions

Function | Description
---- | -----------
[math.abs(x)](abs.md) | Calculate the absolute value of a number.
[math.add(x,&nbsp;y)](add.md) | Add two values, `x + y`.
[math.cbrt(x&nbsp;[,&nbsp;allRoots])](cbrt.md) | Calculate the cubic root of a value.
[math.ceil(x)](ceil.md) | Round a value towards plus infinity If `x` is complex, both real and imaginary part are rounded towards plus infinity.
[math.cube(x)](cube.md) | Compute the cube of a value, `x * x * x`.
[math.divide(x,&nbsp;y)](divide.md) | Divide two values, `x / y`.
[math.dotDivide(x,&nbsp;y)](dotDivide.md) | Divide two matrices element wise.
[math.dotMultiply(x,&nbsp;y)](dotMultiply.md) | Multiply two matrices element wise.
[math.dotPow(x,&nbsp;y)](dotPow.md) | Calculates the power of x to y element wise.
[math.exp(x)](exp.md) | Calculate the exponent of a value.
[math.fix(x)](fix.md) | Round a value towards zero.
[math.floor(x)](floor.md) | Round a value towards minus infinity.
[math.gcd(a,&nbsp;b)](gcd.md) | Calculate the greatest common divisor for two or more values or arrays.
[math.hypot(a,&nbsp;b,&nbsp;...)](hypot.md) | Calculate the hypotenusa of a list with values.
[math.lcm(a,&nbsp;b)](lcm.md) | Calculate the least common multiple for two or more values or arrays.
[math.log(x&nbsp;[,&nbsp;base])](log.md) | Calculate the logarithm of a value.
[math.log10(x)](log10.md) | Calculate the 10-base of a value.
[math.mod(x,&nbsp;y)](mod.md) | Calculates the modulus, the remainder of an integer division.
[math.multiply(x,&nbsp;y)](multiply.md) | Multiply two values, `x * y`.
[math.norm(x&nbsp;[,&nbsp;p])](norm.md) | Calculate the norm of a number, vector or matrix.
[math.nthRoot(a)](nthRoot.md) | Calculate the nth root of a value.
[math.pow(x,&nbsp;y)](pow.md) | Calculates the power of x to y, `x ^ y`.
[math.round(x&nbsp;[,&nbsp;n])](round.md) | Round a value towards the nearest integer.
[math.sign(x)](sign.md) | Compute the sign of a value.
[math.sqrt(x)](sqrt.md) | Calculate the square root of a value.
[math.square(x)](square.md) | Compute the square of a value, `x * x`.
[math.subtract(x,&nbsp;y)](subtract.md) | Subtract two values, `x - y`.
[math.unaryMinus(x)](unaryMinus.md) | Inverse the sign of a value, apply a unary minus operation.
[math.unaryPlus(x)](unaryPlus.md) | Unary plus operation.
[math.xgcd(a,&nbsp;b)](xgcd.md) | Calculate the extended greatest common divisor for two values.

## Bitwise functions

Function | Description
---- | -----------
[math.bitAnd(x,&nbsp;y)](bitAnd.md) | Bitwise AND two values, `x & y`.
[math.bitNot(x)](bitNot.md) | Bitwise NOT value, `~x`.
[math.bitOr(x,&nbsp;y)](bitOr.md) | Bitwise OR two values, `x | y`.
[math.bitXor(x,&nbsp;y)](bitXor.md) | Bitwise XOR two values, `x ^ y`.
[math.leftShift(x,&nbsp;y)](leftShift.md) | Bitwise left logical shift of a value x by y number of bits, `x << y`.
[math.rightArithShift(x,&nbsp;y)](rightArithShift.md) | Bitwise right arithmetic shift of a value x by y number of bits, `x >> y`.
[math.rightLogShift(x,&nbsp;y)](rightLogShift.md) | Bitwise right logical shift of value x by y number of bits, `x >>> y`.

## Combinatorics functions

Function | Description
---- | -----------
[math.bellNumbers(n)](bellNumbers.md) | The Bell Numbers count the number of partitions of a set.
[math.catalan(n)](catalan.md) | The Catalan Numbers enumerate combinatorial structures of many different types.
[math.composition(n,&nbsp;k)](composition.md) | The composition counts of n into k parts.
[math.stirlingS2(n,&nbsp;k)](stirlingS2.md) | The Stirling numbers of the second kind, counts the number of ways to partition a set of n labelled objects into k nonempty unlabelled subsets.

## Complex functions

Function | Description
---- | -----------
[math.arg(x)](arg.md) | Compute the argument of a complex value.
[math.conj(x)](conj.md) | Compute the complex conjugate of a complex value.
[math.im(x)](im.md) | Get the imaginary part of a complex number.
[math.re(x)](re.md) | Get the real part of a complex number.

## Geometry functions

Function | Description
---- | -----------
[math.distance([x1,&nbsp;y1],&nbsp;[x2,&nbsp;y2])](distance.md) | Calculates:    The eucledian distance between two points in 2 and 3 dimensional spaces.
[math.intersect(endPoint1Line1, endPoint2Line1, endPoint1Line2, endPoint2Line2)](intersect.md) | Calculates the point of intersection of two lines in two or three dimensions and of a line and a plane in three dimensions.

## Logical functions

Function | Description
---- | -----------
[math.and(x,&nbsp;y)](and.md) | Logical `and`.
[math.not(x)](not.md) | Logical `not`.
[math.or(x,&nbsp;y)](or.md) | Logical `or`.
[math.xor(x,&nbsp;y)](xor.md) | Logical `xor`.

## Matrix functions

Function | Description
---- | -----------
[math.concat(a,&nbsp;b,&nbsp;c,&nbsp;...&nbsp;[,&nbsp;dim])](concat.md) | Concatenate two or more matrices.
[math.cross(x,&nbsp;y)](cross.md) | Calculate the cross product for two vectors in three dimensional space.
[math.det(x)](det.md) | Calculate the determinant of a matrix.
[math.diag(X)](diag.md) | Create a diagonal matrix or retrieve the diagonal of a matrix  When `x` is a vector, a matrix with vector `x` on the diagonal will be returned.
[math.dot(x,&nbsp;y)](dot.md) | Calculate the dot product of two vectors.
[math.eye(n)](eye.md) | Create a 2-dimensional identity matrix with size m x n or n x n.
[math.filter(x,&nbsp;test)](filter.md) | Filter the items in an array or one dimensional matrix.
[math.flatten(x)](flatten.md) | Flatten a multi dimensional matrix into a single dimensional matrix.
[math.forEach(x,&nbsp;callback)](forEach.md) | Iterate over all elements of a matrix/array, and executes the given callback function.
[math.inv(x)](inv.md) | Calculate the inverse of a square matrix.
[math.map(x,&nbsp;callback)](map.md) | Create a new matrix or array with the results of the callback function executed on each entry of the matrix/array.
[math.ones(m,&nbsp;n,&nbsp;p,&nbsp;...)](ones.md) | Create a matrix filled with ones.
[math.partitionSelect(x,&nbsp;k)](partitionSelect.md) | Partition-based selection of an array or 1D matrix.
[math.range(start,&nbsp;end&nbsp;[,&nbsp;step])](range.md) | Create an array from a range.
[math.resize(x,&nbsp;size&nbsp;[,&nbsp;defaultValue])](resize.md) | Resize a matrix.
[math.size(x)](size.md) | Calculate the size of a matrix or scalar.
[math.sort(x)](sort.md) | Sort the items in a matrix.
[math.squeeze(x)](squeeze.md) | Squeeze a matrix, remove inner and outer singleton dimensions from a matrix.
[math.subset(x,&nbsp;index&nbsp;[,&nbsp;replacement])](subset.md) | Get or set a subset of a matrix or string.
[math.trace(x)](trace.md) | Calculate the trace of a matrix: the sum of the elements on the main diagonal of a square matrix.
[math.transpose(x)](transpose.md) | Transpose a matrix.
[math.zeros(m,&nbsp;n,&nbsp;p,&nbsp;...)](zeros.md) | Create a matrix filled with zeros.

## Probability functions

Function | Description
---- | -----------
[math.combinations(n,&nbsp;k)](combinations.md) | Compute the number of ways of picking `k` unordered outcomes from `n` possibilities.
[math.factorial(n)](factorial.md) | Compute the factorial of a value  Factorial only supports an integer value as argument.
[math.gamma(n)](gamma.md) | Compute the gamma function of a value using Lanczos approximation for small values, and an extended Stirling approximation for large values.
[math.kldivergence(x,&nbsp;y)](kldivergence.md) | Calculate the Kullback-Leibler (KL) divergence  between two distributions.
[math.multinomial(a)](multinomial.md) | Multinomial Coefficients compute the number of ways of picking a1, a2, .
[math.permutations(n&nbsp;[,&nbsp;k])](permutations.md) | Compute the number of ways of obtaining an ordered subset of `k` elements from a set of `n` elements.
[math.pickRandom(array)](pickRandom.md) | Random pick a value from a one dimensional array.
[math.random([min,&nbsp;max])](random.md) | Return a random number larger or equal to `min` and smaller than `max` using a uniform distribution.
[math.randomInt([min,&nbsp;max])](randomInt.md) | Return a random integer number larger or equal to `min` and smaller than `max` using a uniform distribution.

## Relational functions

Function | Description
---- | -----------
[math.compare(x,&nbsp;y)](compare.md) | Compare two values.
[math.deepEqual(x,&nbsp;y)](deepEqual.md) | Test element wise whether two matrices are equal.
[math.equal(x,&nbsp;y)](equal.md) | Test whether two values are equal.
[math.larger(x,&nbsp;y)](larger.md) | Test whether value x is larger than y.
[math.largerEq(x,&nbsp;y)](largerEq.md) | Test whether value x is larger or equal to y.
[math.smaller(x,&nbsp;y)](smaller.md) | Test whether value x is smaller than y.
[math.smallerEq(x,&nbsp;y)](smallerEq.md) | Test whether value x is smaller or equal to y.
[math.unequal(x,&nbsp;y)](unequal.md) | Test whether two values are unequal.

## Statistics functions

Function | Description
---- | -----------
[math.max(a,&nbsp;b,&nbsp;c,&nbsp;...)](max.md) | Compute the maximum value of a matrix or a  list with values.
[math.mean(a,&nbsp;b,&nbsp;c,&nbsp;...)](mean.md) | Compute the mean value of matrix or a list with values.
[math.median(a,&nbsp;b,&nbsp;c,&nbsp;...)](median.md) | Compute the median of a matrix or a list with values.
[math.min(a,&nbsp;b,&nbsp;c,&nbsp;...)](min.md) | Compute the maximum value of a matrix or a  list of values.
[math.mode(a,&nbsp;b,&nbsp;c,&nbsp;...)](mode.md) | Computes the mode of a set of numbers or a list with values(numbers or characters).
[math.prod(a,&nbsp;b,&nbsp;c,&nbsp;...)](prod.md) | Compute the product of a matrix or a list with values.
[math.quantileSeq(A,&nbsp;prob[,&nbsp;sorted])](quantileSeq.md) | Compute the prob order quantile of a matrix or a list with values.
[math.std(a,&nbsp;b,&nbsp;c,&nbsp;...)](std.md) | Compute the standard deviation of a matrix or a  list with values.
[math.sum(a,&nbsp;b,&nbsp;c,&nbsp;...)](sum.md) | Compute the sum of a matrix or a list with values.
[math.var(a,&nbsp;b,&nbsp;c,&nbsp;...)](var.md) | Compute the variance of a matrix or a  list with values.

## String functions

Function | Description
---- | -----------
[math.format(value&nbsp;[,&nbsp;precision])](format.md) | Format a value of any type into a string.
[math.print(template, values [, precision])](print.md) | Interpolate values into a string template.

## Trigonometry functions

Function | Description
---- | -----------
[math.acos(x)](acos.md) | Calculate the inverse cosine of a value.
[math.acosh(x)](acosh.md) | Calculate the hyperbolic arccos of a value, defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`.
[math.acot(x)](acot.md) | Calculate the inverse cotangent of a value, defined as `acot(x) = atan(1/x)`.
[math.acoth(x)](acoth.md) | Calculate the hyperbolic arccotangent of a value, defined as `acoth(x) = atanh(1/x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.
[math.acsc(x)](acsc.md) | Calculate the inverse cosecant of a value, defined as `acsc(x) = asin(1/x)`.
[math.acsch(x)](acsch.md) | Calculate the hyperbolic arccosecant of a value, defined as `acsch(x) = asinh(1/x) = ln(1/x + sqrt(1/x^2 + 1))`.
[math.asec(x)](asec.md) | Calculate the inverse secant of a value.
[math.asech(x)](asech.md) | Calculate the hyperbolic arcsecant of a value, defined as `asech(x) = acosh(1/x) = ln(sqrt(1/x^2 - 1) + 1/x)`.
[math.asin(x)](asin.md) | Calculate the inverse sine of a value.
[math.asinh(x)](asinh.md) | Calculate the hyperbolic arcsine of a value, defined as `asinh(x) = ln(x + sqrt(x^2 + 1))`.
[math.atan(x)](atan.md) | Calculate the inverse tangent of a value.
[math.atan2(y,&nbsp;x)](atan2.md) | Calculate the inverse tangent function with two arguments, y/x.
[math.atanh(x)](atanh.md) | Calculate the hyperbolic arctangent of a value, defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.
[math.cos(x)](cos.md) | Calculate the cosine of a value.
[math.cosh(x)](cosh.md) | Calculate the hyperbolic cosine of a value, defined as `cosh(x) = 1/2 * (exp(x) + exp(-x))`.
[math.cot(x)](cot.md) | Calculate the cotangent of a value.
[math.coth(x)](coth.md) | Calculate the hyperbolic cotangent of a value, defined as `coth(x) = 1 / tanh(x)`.
[math.csc(x)](csc.md) | Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`.
[math.csch(x)](csch.md) | Calculate the hyperbolic cosecant of a value, defined as `csch(x) = 1 / sinh(x)`.
[math.sec(x)](sec.md) | Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
[math.sech(x)](sech.md) | Calculate the hyperbolic secant of a value, defined as `sech(x) = 1 / cosh(x)`.
[math.sin(x)](sin.md) | Calculate the sine of a value.
[math.sinh(x)](sinh.md) | Calculate the hyperbolic sine of a value, defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`.
[math.tan(x)](tan.md) | Calculate the tangent of a value.
[math.tanh(x)](tanh.md) | Calculate the hyperbolic tangent of a value, defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.

## Units functions

Function | Description
---- | -----------
[math.to(x,&nbsp;unit)](to.md) | Change the unit of a value.

## Utils functions

Function | Description
---- | -----------
[math.clone(x)](clone.md) | Clone an object.
[math.isInteger(x)](isInteger.md) | Test whether a value is an integer number.
[math.isNegative(x)](isNegative.md) | Test whether a value is negative: smaller than zero.
[math.isNumeric(x)](isNumeric.md) | Test whether a value is an numeric value.
[math.isPositive(x)](isPositive.md) | Test whether a value is positive: larger than zero.
[math.isZero(x)](isZero.md) | Test whether a value is zero.
[math.typeof(x)](typeof.md) | Determine the type of a variable.



<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->
