# Functions

Math.js contains the following functions. The functions support all available
data types (Number, BigNumber, Complex, Unit, String, Matrix, and Array) where
applicable.

Example usage:

```js
math.sqrt(25);                    // Number  5
math.add(3, 4);                   // Number  7
math.add(3, math.multiply(2, 3)); // Number  9
math.log(10000, 10);              // Number  4

math.add([2, 1, 5], 3);           // Matrix  [5, 4, 8]
var a1 = math.complex(2, 3),      // Complex 2 + 3i
    a2 = math.complex(-1, 4);     // Complex -1 + 4i
math.multiply(a, b);              // Complex -14 + 5i
math.sin(math.unit(45, 'deg'));   // Number  0.70711
math.add('hello ', 'world!');     // String  'hello world!'
```


## Arithmetic

- math.abs(x)
- math.add(x, y)
- math.ceil(x)
- math.cube(x)
- math.divide(x, y)
- math.dotDivide(x, y)
- math.dotMultiply(x, y)
- math.dotPow(x, y)
- math.exp(x)
- math.fix(x)
- math.floor(x)
- math.gcd(a, b, c, ...)
- math.lcm(a, b, c, ...)
- math.log(x [, base])
- math.log10(x)
- math.mod(x, y)
- math.multiply(x, y)
- math.norm(x [, p])
- math.pow(x, y)
- math.round(x [, n])
- math.sign()
- math.subtract(x, y)
- math.sqrt(x)
- math.square(x)
- math.unaryMinus(x)
- math.xgcd(a, b)

## Comparison

- math.compare(x, y)
- math.deepEqual(x, y)
- math.equal(x, y)
- math.larger(x, y)
- math.largerEq(x, y)
- math.smaller(x, y)
- math.smallerEq(x, y)
- math.unequal(x)

## Complex

- math.re(x)
- math.im(x)
- math.arg(x)
- math.conj(x)

## Construction

- math.bignumber(x)
- math.boolean(x)
- math.complex(re, im)
- math.index(a, b, c, ...)
- math.matrix(x)
- math.number(x)
- math.parser()
- math.select([x])
- math.string(x)
- math.unit(x)

## Expression

- math.compile(expr)
- math.eval(expr [, scope])
- math.help(text)
- math.parse(expr [, scope])

## Matrix

- math.concat(a, b, c, ... [, dim])
- math.det(x)
- math.diag(x)
- math.eye(m, n, p, ...)
- math.inv(x)
- math.ones(m, n, p, ...)
- math.range(start, end [, step])
- math.resize(x, size [, defaultValue])
- math.size(x)
- math.squeeze(x)
- math.subset(x, index [, replacement])
- math.transpose(x)
- math.zeros(m, n, p, ...)

## Probability

- math.combinations(n, k)
- math.factorial(n)
- math.distribution(name)
- math.permutations(n [, k])
- math.pickRandom(array)
- math.random([min, max])
- math.randomInt([min, max])

## Statistics

- math.max(a, b, c, ...)
- math.mean(a, b, c, ...)
- math.median(a, b, c, ...)
- math.min(a, b, c, ...)
- math.prod(a, b, c, ...)
- math.std(a, b, c, ...)
- math.sum(a, b, c, ...)
- math.var(a, b, c, ...)

## Trigonometry

- math.acos(x)
- math.asin(x)
- math.atan(x)
- math.atan2(y, x)
- math.cos(x)
- math.cosh(x)
- math.cot(x)
- math.coth(x)
- math.csc(x)
- math.csch(x)
- math.sec(x)
- math.sech(x)
- math.sin(x)
- math.sinh(x)
- math.tan(x)
- math.tanh(x)

## Units

- math.to(x, unit)

## Utils

- math.config(options)
- math.clone(x)
- math.forEach(x, callback)
- math.format(value [, precision])
- math.ifElse(condition, trueExpr, falseExpr)
- math.import(filename | object, override)
- math.map(x, callback)
- math.print(template, values [, precision])
- math.typeof(x)
