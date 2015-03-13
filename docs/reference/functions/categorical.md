# Function reference (categorical)

## arithmetic

- [abs(x)](abs.md)
- [add(x, y)](add.md)
- [ceil(x)](ceil.md)
- [cube(x)](cube.md)
- [divide(x, y)](divide.md)
- [dotDivide(x, y)](dotDivide.md)
- [dotMultiply(x, y)](dotMultiply.md)
- [dotPow(x, y)](dotPow.md)
- [exp(x)](exp.md)
- [fix(x)](fix.md)
- [floor(x)](floor.md)
- [gcd(a, b)](gcd.md)
- [lcm(a, b)](lcm.md)
- [log(x [, base])](log.md)
- [log10(x)](log10.md)
- [mod(x, y)](mod.md)
- [multiply(x, y)](multiply.md)
- [norm(x [, p])](norm.md)
- [nthRoot(a, root)](nthRoot.md)
- [pow(x, y)](pow.md)
- [round(x [, n])](round.md)
- [sign(x)](sign.md)
- [sqrt(x)](sqrt.md)
- [square(x)](square.md)
- [subtract(x, y)](subtract.md)
- [unaryMinus(x)](unaryMinus.md)
- [unaryPlus(x)](unaryPlus.md)
- [xgcd(a, b)](xgcd.md)

## bitwise

- [bitAnd(x, y)](bitAnd.md)
- [bitNot(x)](bitNot.md)
- [bitOr(x, y)](bitOr.md)
- [bitXor(x, y)](bitXor.md)
- [leftShift(x, y)](leftShift.md)
- [rightArithShift(x, y)](rightArithShift.md)
- [rightLogShift(x, y)](rightLogShift.md)

## complex

- [arg(x)](arg.md)
- [conj(x)](conj.md)
- [im(x)](im.md)
- [re(x)](re.md)

## construction

- [bignumber(x)](bignumber.md)
- [boolean(x)](boolean.md)
- [chain(value)](chain.md)
- [complex(re, im)](complex.md)
- [index(range1, range2, ...)](index.md)
- [matrix(x)](matrix.md)
- [number(value)](number.md)
- [parser()](parser.md)
- [string(value)](string.md)
- [unit(x)](unit.md)

## expression

- [compile(expr)](compile.md)
- [eval(expr [, scope])](eval.md)
- [help(search)](help.md)
- [parse(expr [, scope])](parse.md)

## logical

- [and(x, y)](and.md)
- [not(x)](not.md)
- [or(x, y)](or.md)
- [xor(x, y)](xor.md)

## matrix

- [concat(a, b, c, ... [, dim])](concat.md)
- [cross(x, y)](cross.md)
- [det(x)](det.md)
- [diag(X)](diag.md)
- [dot(x, y)](dot.md)
- [eye(n)](eye.md)
- [flatten(x)](flatten.md)
- [inv(x)](inv.md)
- [ones(m, n, p, ...)](ones.md)
- [range(start, end [, step])](range.md)
- [resize(x, size [, defaultValue])](resize.md)
- [size(x)](size.md)
- [squeeze(x)](squeeze.md)
- [subset(x, index [, replacement])](subset.md)
- [trace(x)](trace.md)
- [transpose(x)](transpose.md)
- [zeros(m, n, p, ...)](zeros.md)

## probability

- [combinations(n, k)](combinations.md)
- [distribution(name)](distribution.md)
- [factorial(n)](factorial.md)
- [gamma(n)](gamma.md)
- [permutations(n)](permutations.md)
- [pickRandom(array)](pickRandom.md)
- [random([min, max])](random.md)
- [randomInt([min, max])](randomInt.md)

## relational

- [compare(x, y)](compare.md)
- [deepEqual(x, y)](deepEqual.md)
- [equal(x, y)](equal.md)
- [larger(x, y)](larger.md)
- [largerEq(x, y)](largerEq.md)
- [smaller(x, y)](smaller.md)
- [smallerEq(x, y)](smallerEq.md)
- [unequal(x, y)](unequal.md)

## statistics

- [max(a, b, c, ...)](max.md)
- [mean(a, b, c, ...)](mean.md)
- [median(a, b, c, ...)](median.md)
- [min(a, b, c, ...)](min.md)
- [prod(a, b, c, ...)](prod.md)
- [std(a, b, c, ...)](std.md)
- [sum(a, b, c, ...)](sum.md)
- [var(a, b, c, ...)](var.md)

## trigonometry

- [acos(x)](acos.md)
- [acosh(x)](acosh.md)
- [acot(x)](acot.md)
- [acoth(x)](acoth.md)
- [acsc(x)](acsc.md)
- [acsch(x)](acsch.md)
- [asec(x)](asec.md)
- [asech(x)](asech.md)
- [asin(x)](asin.md)
- [asinh(x)](asinh.md)
- [atan(x)](atan.md)
- [atan2(y, x)](atan2.md)
- [atanh(x)](atanh.md)
- [cos(x)](cos.md)
- [cosh(x)](cosh.md)
- [cot(x)](cot.md)
- [coth(x)](coth.md)
- [csc(x)](csc.md)
- [csch(x)](csch.md)
- [sec(x)](sec.md)
- [sech(x)](sech.md)
- [sin(x)](sin.md)
- [sinh(x)](sinh.md)
- [tan(x)](tan.md)
- [tanh(x)](tanh.md)

## units

- [to(x, unit)](to.md)

## utils

- [clone(x)](clone.md)
- [filter(x, test)](filter.md)
- [forEach(x, callback)](forEach.md)
- [format(value [, precision])](format.md)
- [import(filename | object, override)](import.md)
- [map(x, callback)](map.md)
- [print(template, values [, precision])](print.md)
- [sort(x)](sort.md)
- [typeof(x)](typeof.md)
