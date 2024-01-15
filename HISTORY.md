# History


# 2024-01-12, 12.3.0

- Implement support new metric prefixes: `ronna` (`R`), `quetta` (`Q`), 
  `ronto` (`r`), and `quecto` (`q`) (#3113, #3112). Thanks @AlexEdgcomb.
- Fix a bug converting a unitless unit (#3117). Thanks @costerwi.
- Fix: #3097 `toSI()` wrongly converting `degC` (#3118). Thanks @costerwi.


# 2023-12-20, 12.2.1

- Fix #3109: method `Node.toHTML` not accepting a custom `handler`.


# 2023-12-08, 12.2.0

- Feat: lazy evaluation of operators `and`, `or`, `&`, `|` (#3090, #3101, 
  #2766). Thanks @smith120bh.
- Fix: passing a 4th argument with a scope to raw functions.
- Fix: #3096 embedded docs of eigs throwing an error.


# 2023-11-17, 12.1.0

- Feat: Extend function `round` with support for units (#2761, #3095). 
- Feat: Extend function `mod` with support for negative divisors in when
  using `BigNumber` or `Fraction` (#3087).
- Fix: #3092 a typo in an error message when converting a string into a number.
- Fix: #3094 function `derivative` mutates the input expression when it fails.


# 2023-10-26, 12.0.0

Breaking changes:

- Fix #2879, #2927, #3014: change the confusing interface of `eigs` (#3037),
  thanks @gwhitney.
  Before, functions `eigs` returned an object:
  ```
  { values: MathCollection; vectors: MathCollection }
  ```
  where `vectors` was a 2d matrix of which the columns contained the vectors.
  This is changed to `eigs` returning an object:
  ```
  { 
    values: MathCollection
    eigenvectors: Array<{
      value: number | BigNumber
      vector: MathCollection
    }>
  }
  ```
  Where `eigenvectors` is an array containing an object with the corresponding
  eigenvalue and vector.
- Refactored the TypeScript type definitions to make them work with a `NodeNext`
  module resolution (#3079, #2919). 
  - Type `MathJsStatic` is renamed to `MathJsInstance`.
  - Type `FactoryDependencies` is deprecated, use `MathJsFactory` instead, and 
    import dependency maps directly from the library.
- Change the assignment operator of `.toTex()` output from `:=` to `=` (see 
  #2980, #2987).
- Drop official support for Node.js 14 and 16.

Features:

- Function `eigs` now has an option to turn off calculation of eigenvectors 
  (#3057, #2180). Thanks @gwhitney.

Fixes:

- Find eigenvectors of defective matrices (#3037). Thanks @gwhitney.


# 2023-10-26, 11.12.0

- Implemented function `subtractScalar` (#3081, #2643), thanks @vrushaket.
- Fix #3073: function format not escaping control characters and double
  quotes (#3082).
- Fix: function `clone` not throwing an error when passing an unsupported
  type like a function.
- Fix: #2960 add type definition of function `symbolicEqual` (#3035),
  thanks @juancodeaudio.


# 2023-10-11, 11.11.2

- Fix #3025: improve handling of matrices and error handling 
  in function `corr` (#3030). Thanks @vrushaket.
- Fix #3074: improve error message when using function `max` in `derivative`.
- Fix #3073: fix parsing quotes inside a string.
- Fix #2027: cannot use named operators like `to` or `mod` as property name. 


# 2023-09-20, 11.11.1

- Fix #2989: use one-based indices in `print` in the parser (#3009). 
  Thanks @dvd101x. 
- Fix #2936: `mod` sometimes giving wrong results due to internal round-off
  errors (#3011). Thanks @praisennamonu1.
- Internal refactor of `quantileSeq`, and fixed the embedded help (#3003). 
  Thanks @dvd101x.
- Updated dependencies and devDependencies.


# 2023-09-05, 11.11.0

- Implement function `corr` to calculate the correlation between two matrices
  (#3015, #2624). Thanks @vrushaket. 
- Lock `fraction.js` at version `4.3.4` for now, see #3024, 3022, 
  https://github.com/rawify/Fraction.js/issues/68.


# 2023-08-31, 11.10.1

- Upgrade to `fraction.js@4.3.4`, see #3022.
- Fix #3020: `lruQueue` using the global `hasOwnProperty` which may be 
  polluted.
- Add support for prefixes for the unit `erg`, and restrict prefixes of the
  unit `joule` to only long prefixes like `kilo` and no short prefixes 
  like `k` (#3019). Thanks @costerwi.
- Add a new browser example `examples/browser/lorenz.html` that uses `solveODE`
  and plots the result in a chart (#3018). Thanks @dvd101x.


# 2023-08-23, 11.10.0

- Extend function `quantileSeq` with support for a `dimension` (#3002).
  Thanks @dvd101x.
- Implement #2735: Support indexing with an array of booleans, for 
  example `a[[true, false, true]]` and `a[a > 2]` (#2994). Thanks @dvd101x.
- Implement function `zeta` (#2950, #2975, #2904). Thanks @Bobingstern.
- Fix #2990: `DenseMatrix` can mutate input arrays (#2991).


# 2023-07-24, 11.9.1

- Fix a security vulnerability in `FunctionNode` and `SymbolNode` allowing
  arbitrary code execution via `math.evaluate`. Thanks Harry Chen.
- Fix #3001: mathjs bundle containing `new Function(...)` (CSP issue).


# 2023-07-19, 11.9.0

- Implement function `solveODE` (#2958). Thanks @dvd101x.
- Implement functions `zpk2tf` and `freqz` (#2988, #2969). Thanks @alykhaled.
- Implement support for units in function `range` (#2997). Thanks @dvd101x.
- Fix #2974: `simplify` puts plus and minus signs next to each other (#2981).
  Thanks @MaybePixem.
- Fix #2973: fixes and improvements in the embedded docs (#2976). 
  Thanks @dvd101x.
- Fix #2996: two errors in the examples in the documentation about Expression 
  trees.
- Fix round-off errors near zero when converting temperatures (#2962). 
  Thanks @costerwi.
- Refactored function `range`, reducing the amount of code (#2995).
  Thanks @dvd101x.


# 2023-06-20, 11.8.2

- Fix #2971: improve typings of statistics functions `min`, `max`, `mean`, 
  `median`, `mode`, `std`, `sum`, `prod`, `variance`. Fixes a regression 
  introduced in v11.8.1.
- Fix #2972: type definitions of `Unit.divide(Unit)` have a wrong return type.


# 2023-06-13, 11.8.1

- Fix #2964: issue in function ` distance` when calculate the distance from 
  a point to a line (#2965). Thanks @Kiku-CN. 
- Fix `math.format` not working correctly for `engineering` notation when using
  BigNumbers and for `fixed` notation with `precision: 0` configured (#2956). 
  Thanks @mgreminger.
- Fix #2880: not possible to map cube root `cbrt`.
- Fix #2938: make the syntax description of all functions consistent in the
  docs (#2941). Thanks @dvd101x.
- Fix #2954: improve the TypeScript definitions the return type of functions
  `min` and `max` (#2955). Thanks @Maxim-Mazurok.
- Fix #2959: typo in an example in the docs. Thanks @kunalagrwl.
- Drop official support for Node.js 14, has reached end of life.


# 2023-04-03, 11.8.0

- Extended functions `fraction`, `bignumber`, and `number` with support for 
  units, see #2918 (#2926).
- Implemented aliases `amp` and `amps` for unit `ampere` (#2917). 
  Thanks @veggiesaurus.
- Improve TypeScript definitions of function `gcd` (#2922). Thanks @brunoSnoww.
- Fix #2923: improve docs of the function `distance` (#2924). Thanks @tmtron.


# 2023-03-15, 11.7.0

- Implement #2567: accept array as parameter for function `gcd` (#2878). 
  Thanks @jakubriegel.
- Fix #2908: improvements in the docs and examples of functions 
  `partitionSelect`, `diff`, `expm1`, `round`, `nthRoots`, `sign`, 
  `rigthArithShift`, `setIsSubset`, `setSize`, and the docs about units.
  Thanks @tmtron.
- Fix #2907: determinant of empty matrix should be 1.
- Refactor index.d.ts by writing function declarations using a generic, 
  reducing a lot of repetition (#2913). Thanks @brunoSnoww.


# 2023-02-24, 11.6.0

- Implement broadcasting for the following functions and their corresponding
  operator: `add`, `dotDivide`, `dotMultiply`, `dotPow`, `gcd`, `lcm`, `mod`, 
  `nthRoot`, `subtract`, `bitAnd`, `bitOr`, `bitXor`, `leftShift`, 
  `rightArithShift`, `rightLogShift`, `and`, `or`, `xor`, `compare`, 
  `compareText`, `equal`, `larger`, `largerEq`, `smaller`, `smallerEq`, 
  `unequal`, `atan2` and `to` (#2895, #2753). Thanks @dvd101x.
- Implement support for non-power-of-2 fft (#2900, #2577). Thanks @cyavictor88.
- Fix #2888: update type definitions of function `unit` to allow creating a 
  unit from a fraction or complex number.
- Fix #2892: an error in the examples of the embedded help of function `sort`.
- Fix #2891: functions `column` and `row` sometimes returning a scalar number. 
- Fix #2896: define the fourth argument of function `intersect` as optional 
  in the TypeScript definitions. Thanks @wodndb.
- Fix: quantileSeq not accepting a matrix as second argument `prob` (see #2902).
- Fix broken examples in functions `to`, `distance`, `getMatrixDataType`, 
  `subset`, and `max` (see #2902).


# 2023-01-31, 11.5.1

- Add type definitions for function `rotationMatrix` (#2860). 
  Thanks @brunoSnoww.
- Add type signature for `lusolve(LUDecomposition, ...)` (#2864). 
  Thanks @evanmiller.
- Fix #2873: the rocket_trajectory_optimization.html example being partly 
  broken. Thanks @dvd101x.
- Fix #2871: coverage report broken (#2877). Thanks @bornova.
- Fix #2883: update documentation for stat functions, describe missing syntax.
- Fix #2884: fix examples in the embedded docs of function `pow` and some other
  functions.
- Fix type definition of function `complex` for one numeric input (#2886), 
  thanks @ariymarkowitz.
- Fix type definitions of `map()` and `forEach()` (#2887), thanks @xiaohk.
- Fix #2606: improve type definitions of `dotMultiply`, `dotPow` and 
  `dotDivide` (#2890). Thanks @brunoSnoww.


# 2022-12-05, 11.5.0

- Improve `simplify` rule matches in non-commutative contexts (#2841). 
  Thanks @samueltlg.
- Simplify: add rules and restructure tests for non-commutative contexts
  (#2847). Thanks @samueltlg.
- Fix function `reshape` mutating the input in case of a matrix (see #2854).
- Fix TypeScript types for `multiply()` with `number[]` and `number[][]`
  (#2852). Thanks @hfhchan.


# 2022-11-18, 11.4.0

- Implemented more wildcards to describe rules for `simplify`, making it easier
  for example to describe unary minus (#1915). Thanks @thatcomputerguy0101.
- Implemented functions `schur`, `sylvester`, and `lyap` (#2646). 
  Thanks @egidioln.
- Implemented function `polynomialRoot`, and use it in a benchmark (#2839). 
  Thanks @gwhitney.
- Fix #2825 partly: improve simplifying operations on constants in 
  non-commutative contexts (#2827). Thanks @samueltlg.
- Fix #2840: a bug in the docs and type definitions of `Node.traverse` and 
  `Node.forEach`, they do return `void`.


# 2022-11-07, 11.3.3

- Fix #2830: Prevent inserting zero values when creating a `SparseMatrix` from a 
  `DenseMatrix` (#2836). Thanks @AlexandreAlvesDB.
- Fix #2835: a regression in the type definitions of `FunctionNode`, introduced
  in `v11.3.2`. See #2733. Thanks @dsteve.


# 2022-10-25, 11.3.2

- Add generics to remaining Node type definitions (#2733). Thanks @mattvague. 
- Allow unit prefixes for (absolute) temperatures `kelvin`, `rankine`, 
  `celsius`, and `fahrenheit` (#2824). Thanks @jfeist


# 2022-10-19, 11.3.1

- Fix #2809: code completion issues in some IDE's (#2812).
- Fix #2818: throw an error when a function assignment has duplicate 
  parameter names (#2819).
- Update `decimal.js` to version `10.4.2`.


# 2022-10-11, 11.3.0

- Allow creating new subclasses of `Node` in TypeScript (#2772). 
  Note that this disables being able to narrow MathNodes by using the `.type`
  property. Use typeguards like `isOperatorNode(...)` instead (see #2810).
  Thanks @mattvague.
- Fix #2793: `flatten()` cloning entries of array/Matrix (#2799).
- Fix #2627: TypeScript definitions of `pinv` missing (#2804). 
  Thanks @HanchaiN.
- Update dependencies to `decimal.js@10.4.1`.


# 2022-09-13, 11.2.1

- Fix doc generator being broken, not generating a function reference.


# 2022-09-12, 11.2.0

- Implement function `isRelationalNode` (#2731). Thanks @isaacbyr.
- Added missing types `'largerEq'` and `'or'` in `OperatorNodeMap` in the
  TypeScript definitions. Thanks @ajinkyac03.
- Fixed typos in min func type defs (#2768). Thanks @mabdullahadeel.
- Improved the TypeScript definitions for `pickRandom`. Thanks @mattvague.
- Fixed documentation of unit `min` which means `minutes`, not `minim` (#2773).
  Thanks @jasonhornsby.


# 2022-08-23, 11.1.0

- Add Unit constructor from value and pure (valueless) Unit (#2628).
  Thanks @costerwi
- Fix #2144: `examples/advanced/custom_loading.js` was broken.
- Fix JSON `replacer` function missing in the TypeScript definitions. 
  Thanks @mattvague.
- Update dependencies to `typed-function@4.1.0` and `decimal.js@10.4.0`. 


# 2022-07-25, version 11.0.1

- Fix #2632: TypeScript issue of `simplifyConstant` and `simplifyCore`
  not having a return type defined.


# 2022-07-23, version 11.0.0

!!! BE CAREFUL: BREAKING CHANGES !!!

Breaking changes:

- Dropped official support for IE11. 
- Upgraded to `typed-function@3`, see [josdejong/typed-function/HISTORY.md](https://github.com/josdejong/typed-function/blob/develop/HISTORY.md#2022-05-12-version-300). Thanks @gwhitney. Most importantly: 
    - Conversions now have preference over `any`.
    - The `this` variable is no longer bound to the typed function itself.
    - The properties `typed.types`, `typed.conversions`, and `typed.ignore` 
      have been removed.
    - There are new static functions available like `typed.referTo`, 
      `typed.referToSelf`, `typed.addTypes`, `typed.addConversions`.
- Implement amended "Rule 2" for implicit multiplication (#2370, #2460):
  when having a division followed by an implicit multiplication, the division 
  gets higher precedence over the implicit multiplication when (a) the 
  numerator is a constant with optionally a prefix operator (`-`, `+`, `~`), 
  and (b) the denominator is a constant. For example: formerly `-1 / 2 x` was 
  interpreted as `-1 / (2 * x)` and now it is interpreted as `(-1 / 2) * x`.
  Thanks @gwhitney.
- Drop elementwise matrix support for trigonometric functions, exp, log, gamma,
  square, sqrt, cube, and cbrt to prevent confusion with standard matrix 
  functions (#2440, #2465). Instead, use `math.map(matrix, fn)`. 
  Thanks @gwhitney.
- Simplify: convert equivalent function calls into operators, for example, 
  `add(2, x)` will now be simplified into `2 + x` (#2415, #2466).
  Thanks @gwhitney.
- Removed the automatic conversion from `number` to `string` (#2482).
  Thanks @gwhitney.
- Fix #2412: let function `diff` return an empty matrix when the input contains
  only one element (#2422).
- Internal refactoring in the `simplifyCore` logic (#2490, #2484, #2459).
  The function `simplifyCore` will no longer (partially) merge constants, that 
  behavior has been moved to `simplifyConstant`. The combination of 
  `simplifyConstant` and `simplifyCore` is still close to the old behavior 
  of `simplifyCore`, but there are some differences. To reproduce the same 
  behavior as the old `simplifyCore`, you can use 
  `math.simplify(expr, [math.simplifyCore, math.simplifyConstant])`. 
  Thanks to the refactoring, `simplify` is more thorough in reducing constants. 
  Thanks @gwhitney.
- Disable support for splitting rest parameters in chained calculations 
  (#2485, #2474). For example: `math.chain(3).max(4, 2).done()` will now throw
  an error rather than return `4`, because the rest parameter of 
  `math.max(...number)` has been split between the contents of the chain and 
  the arguments to the max call. Thanks @gwhitney.
- Function `typeOf` now returns `function` (lowercase) for a function instead 
  of `Function` (#2560). Thanks @gwhitney.

Non-breaking changes:

- Fix #2600: improve the TypeScript definitions of `simplify`. 
  Thanks @laureen-m and @mattvague.
- Fix #2607: improve type definition of `createUnit`. Thanks @egziko.
- Fix #2608: clarify the docs on the need to configure a smaller `epsilon`
  when using BigNumbers.
- Fix #2613: describe matrix methods `get` and `set` in the docs.
- Fix link to `math.rationalize` in the docs (#2616). Thanks @nukisman.
- Fix #2621: add TypeScript definitions for `count` (#2622). Thanks @Hansuku.
- Improved TypeScript definitions of `multiply` (#2623). Thanks @Windrill.


# 2022-06-28, version 10.6.4

- Improve TypeScript definitions of the `factory` function, thanks @mattvague.


# 2022-06-24, version 10.6.3

- Revert the TypeScript definition fixes for `factory` applied in `v10.6.2`, 
  they give some complications.


# 2022-06-24, version 10.6.2

- Improve TypeScript definitions of `ParenthesisNode`. Thanks @mattvague.
- Change the TypeScript definition of `MathNodeCommon['type']` into a less 
  strict string, so it is possible to extend with new Node classes. 
  Thanks @mattvague.
- Improve TypeScript definitions of the `factory` function, thanks @mattvague.


# 2022-05-31, version 10.6.1

- Improve the  TypeScript types For `OperatorNode`: you can now define generic 
  types like `OperatorNode<'+', 'add'>`. Thanks @mattvague.


# 2022-05-24, version 10.6.0

- Implementation of fourier transform functions `fft` and `ifft` (#2540).
  Thanks @HanchaiN.
- Fix TypeScript types not being listed in the exported fields (#2569).
  Thanks @mattvague. 
- Large improvements in TypeScript definitions for chained expressions (#2537).
  Thanks @mattvague.
- Fix #2571: improve TypeScript definition of functions `clone` and `cloneDeep` 
  (#2572). Thanks @mattvague.
- Fix the first argument of `derivative` holding the expression not correctly
  being converted when using `.toTex()` (#2564). Thanks @mattvague.


# 2022-05-11, version 10.5.3

- Fix #2337: npm package containing examples and docs to solve security 
  vulnerabilities being reported on the examples and their dependencies.
- Fix core, construction, and some other functions missing in docs.
- Drop official support for Node.js 12 which has reached its end of life.


# 2022-05-09, version 10.5.2

- Fix #2553: `@types/mocha` defined in `dependencies` instead of 
  `devDependencies`, causing problems in projects that use a different version
  of this dependency. Thanks @Kolahzary.
- Fix #2550: remove `examples/node_modules` folder from the npm package.
- Fix #2528: improve contribution guidelines (#2548).
- Document `SymbolNode.onUndefinedSymbol` and 
  `FunctionNode.onUndefinedFunction`.


# 2022-05-02, version 10.5.1

- Fix #2526, #2529: improve TypeScript definitions of function `round`, `fix`,
  `floor`, `ceil`, and `nthRoot`, and improved the number only implementations 
  of those functions  (#2531, #2539). Thanks @simlaticak and @gwhitney.
- Fix #2532: matrix index symbol `end` not working when used inside
  a sub-expression.
- Fix #2524: In generating AUTHORS list, ignore a list of specific commits
  (e.g., to avoid spurious duplicates in list). (#2543)
- Add type definitions of function `resolve` (#2536). Thanks @mattvague.


# 2022-04-19, version 10.5.0

- Implement #1563: function `pinv`, Moore–Penrose inverse (#2521). 
  Thanks @HanchaiN.
- Optimize function `det` for integers by switching to the Bareiss algorithm: 
  no more round-off errors for integer input (#2516). Thanks @HanchaiN.
- Implement #2463: allow negative integer powers of invertible square matrices
  (#2517). Thanks @HanchaiN.
- Implement the `lgamma` function (defined as log(gamma(z))) for number and
  Complex types. Supersedes #320. (#2417). Thanks @yifanwww.
- Fix #2523: update to the latest complex.js to improve `sin(z)` for small
  `im(z)` (#2525). Thanks @gwhitney.
- Fix #2526: update TypeScript definition of `ceil` (#2531). Thanks @simlaticak
- Change mocha reporter to 'dot' to avoid excessively long log files. (#2520)


# 2022-04-08, version 10.4.3

- Fix #2508: improve the precision of stirlingS2 (#2509). Thanks @gwhitney.
- Fix #2514: implement optional argument `base` in the number implementation
  of function `log` (#2515). Thanks @gwhitney.
- Improve the documentation on operator `;` (#2512). Thanks @gwhitney.


# 2022-03-29, version 10.4.2

- Fix #2499: different behavior for unit conversion "degC" and "K" (#2501).
  Also disables getting the sign for units with an offset, which is ambiguous. 
  Thanks @gwhitney.
- Fix #2503: fix an issue in `log()` for complex numbers in which the imaginary
  part is much larger in absolute value than the real part, fixed in 
  `complex.js@2.1.0` (#2505), thanks @gwhitney, @infusion.
- Fix #2493: unclear error message when an entity that is not a function
  is being called as a function (#2494). Thanks @gwhitney.
- Some fixes in the docs on units (#2498). Thanks @dvd101x.
- Add `forEach` example in embedded docs (#2507). Thanks @dvd101x.
- Correct approx.deepEqual() to accept an epsilon argument giving the
  comparison tolerance. It was already being called this way, but was
  silently ignoring the tolerance. Thanks @yifanwww.


# 2022-03-23, version 10.4.1

- Improve TypeScript definitions for function `unit` (#2479). 
  Thanks @SinanAkkoyun.
- Add tests for type declarations (#2448). Thanks @samestep.
- Further improvement to TypeScript definitions of `std` and `variance`
  (make dimension parameter optional, #2474). Thanks @NattapongSiri.
- Next step (as per #2431) for full publication of "is" functions like
  `isMatrix` etc: Provide TypeScript definitions of "is" functions and
  make them type guards. (#2432). Thanks @ChristopherChudzicki.
- Fix #2491: Multi line object expressions don't work with comments (#2492).
  Thanks @gwhitney.
- Fix #2478: a bug in calculating the eigenvectors when dealing with complex
  numbers (#2496). Thanks @gwhitney.
- Update project dependencies and devDependencies.


# 2022-03-07, version 10.4.0

- Fix #2461: make sure `simplifyCore` recurses over all binary nodes (#2462).
  Thanks @gwhitney.
- Fix #2429: fix the TypeScript definitions of functions `std` and `variance`
  (#2455). Thanks @NattapongSiri.
- Fix #1633: implement a `cumsum` function generating cumulative sums of a list
  of values or a matrix. (#1870). Thanks @hjonasson.
- Upgrade to the latest version of `Fraction.js`, having more strict input, 
  only accepting an integer numerator and denominator. See #2427.
- Fix typo in documentation example for `format`. (#2468) Thanks @abranhe.
- Write unit tests for all jsdoc examples. See #2452. Thanks @gwhitney. 


# 2021-03-02, version 10.3.0

- Fix #1260: implement function `symbolicEqual` (#2424). Thanks @gwhitney.
- Fix #2441, #2442: support passing a function as argument to functions created
  in the expression parser (#2443). Thanks @gwhitney.
- Fix #2325: improve documentation of subset indices (#2446). Thanks @gwhitney.
- Fix #2439: fix a bug in `complexEigs` in which real-valued norms were 
  inadvertently being typed as complex numbers (#2445). Thanks @gwhitney.
- Fix #2436: improve documentation and error message of function `map` (#2457).
  Thanks @gwhitney.


# 2022-03-01, version 10.2.0

- Implemented context options to control simplifications allowed in `simplify`, 
  see #2399, #2391. Thanks @gwhitney.
- Implemented function `leafCount` as a first simple measure of the complexity 
  of an expression, see #2411, #2389. Thanks @gwhitney.
- Fix #2413: improve `combinations` to return an integer result without rounding
  errors for larger values, see #2414. Thanks @gwhitney.
- Fix #2385: function `rotate` missing in TypeScript definitions. 
  Thanks @DIVYA-19.
- Fix #2450: Add BigNumber to parameter type in `math.unit` and add TypeScript
  types for `Unit.simplify` and `Unit.units` (#2353). Thanks @joshhansen.
- Fix #2383: detect infinite loops in `simplify` (#2405). Thanks @gwhitney.
- Fix #1423: collect like factors and cancel like terms in sums (#2388). 
  Thanks @gwhitney.


# 2022-02-02, version 10.1.1

- Improvements and fixes in function `simplify`, thanks @gwhitney:
  - Fix #2393: regression bug in `simplify('2-(x+1)')`.
  - Ad option `consoleDebug` to `simplify` to see what is going on.
- Fix TypeScript definition of `ConfigOptions`, which was missing option 
  `predictable`.


# 2022-01-15, version 10.1.0

- Implemented function `invmod`, see #2368, #1744. Thanks @thetazero.
- Improvements and fixes in function `simplify`, thanks @gwhitney:
  - Fix #1179, #1290: improve collection of non-constant like terms (#2384).
  - Fix #2152: do not transform strings into numbers (#2372).
  - Fix #1913: implement support for array and object simplification (#2382).
- Fix #2379: add embedded documentation for function `print`.
- Remove broken example from the embedded documentation of function `forEach`.


# 2021-12-29, version 10.0.2

- Fix #2156: simplify expressions like `-1 / (-x)` to `1/x`. Thanks @ony3000.
- Fix #2363: remove a redundant part of the regex to split a number.
- Fix #2291: add support for fractions in function `intersect`. 
  Thanks @thetazero.
- Fix #2358: bug in `SparseMatrix` when replacing a subset of a matrix with
  a non-consecutive index. Thanks @Al-0.


# 2021-12-22, version 10.0.1

- Fix #1681: function `gamma` giving inaccurate complex results in some cases.
  Thanks @kmdrGroch.
- Fixed a typo in an example, see #2366. Thanks @blackwindforce.


# 2021-11-03, version 10.0.0

!!! BE CAREFUL: BREAKING CHANGES IN THE TYPESCRIPT DEFINITIONS !!!

- Improvements to the Typescript typings (commit fc5c202e). 
  Thanks @joshhansen. First introduced in v9.5.1, but reverted because
  it contains breaking changes.
  
  Breaking changes: interface `MathNode` is now renamed to `MathNodeCommon`
  and the related interfaces are structured in a different way.

- Fixed a typo in the TypeScript definition of toHTML. Thanks @TheToto.


# 2021-11-03, version 9.5.2`

- Revert the improvements to the Typescript typings because they contain
  breaking changes. The improvements will be published in v10.0.0. See #2339.


# 2021-10-13, version 9.5.1

- Various improvements to the Typescript typings. 
  Thanks @joshhansen and @DianaTdr.


# 2021-09-22, version 9.5.0

- Implemented support for calculations with percentage, see #2303. 
  Thanks @rvramesh.
- Fix #2319: make the API of `Parser.evaluate` consistent with `math.evaluate`: 
  support a list with expressions as input.
- Improved documentation of function `setCartesian`. Thanks @fieldfoxWim.


# 2021-09-15, version 9.4.5

- Improved the performance of `Node.equals` by improving the internal 
  function `deepStrictEqual`. Thanks @tomlarkworthy.
- Fixes in the TypeScript definitions:
  - Define `hasNumericValue`. Thanks @write2kcl. 
  - Define `MathNode.isRelationalNode`. Thanks @m93a.
  - Fix typo in `MathNode.isConditionalNode`. Thanks @m93a.


# 2021-07-07, version 9.4.4

- Fixed `ArrayNode.toTex()`: remove the row delimiter on the last row, 
  see #2267. Thanks @davidtranhq.
- Fix #2269: `intersect`  not returning `null` for matrix input. Thanks @m93a.
- Fix #2245: mathjs not working in IE11 anymore due to a missing polyfill for
  `Symbol`. The browser bundle now includes the necessary polyfills (it is 
  larger now because of that, see also #2266). Thanks @m93a.
- Update dependencies (`complex.js@2.0.15`, `decimal.js@10.3.1`)
- Drop official support for node.js 10, which has reached end of life. 
  See #2258.


# 2021-06-23, version 9.4.3

- Fix #2222: mathjs polluting the `Decimal` prototype. Thanks @m93a.
- Fix #2253: expression parser throwing an error when accessing nested object
  properties named `e`.
- Fixes in the TypeScript definitions:
  - function `floor`, #2159, #2246. Thanks @write2kcl.
  - function `simplify`, see #2252. Thanks @nitroin. 
- Upgraded to `decimal.js@10.3.0`


# 2021-06-05, version 9.4.2

- Implemented iterative eigenvalue finder for `eigs`, making it much more 
  robust. See #2179, #2237. Thanks @m93a.
- Improved TypeScript definitions of function `parse`. Thanks @OpportunityLiu.


# 2021-05-24, version 9.4.1

- Fix #2100: add TypeScript declaration for `eigs`. Thanks @andrebianchessi.
- Fix #2220: add TypeScript files to published npm package. Thanks @dhritzkiv.
- Update readme regarding TypeScript definition files. Thanks @dhritzkiv.
- Update to `fraction.js@4.1.1`


# 2021-05-16, version 9.4.0

- Implemented support to use objects with a `Map` interface as scope, 
  see #2143, #2166. Thanks @jhugman.
- Extend `eigs` to support general complex matrices, see #1741. Thanks @m93a.
- DenseMatrix and SparseMatrix are now iterable, see #1184. Thanks @m93a.
- Implemented utility functions `matrixFromRows`, `matrixFromColumns`, and 
  `matrixFromFunction`, see #2155, #2153. Thanks @m93a.
- Added TypeScript definitions to the project, making it redundant to install
  `@types/mathjs`, and making it easier to improve the definitions. See #2187, 
  #2192. Thanks @CatsMiaow.
- Upgraded dependencies
  - `complex.js@2.0.13` (fixing #2211). Thanks @infusion
  - `fraction.js@4.1.0` (`pow` now supporting rational exponents).
- Fix #2174: function `pickRandom` having no name. Thanks @HK-SHAO.
- Fix #2019: VSCode auto import keeps adding import { null } from 'mathjs'.
- Fix #2185: Fix TypeScript definition of unit division, which can also return 
  a number.
- Fix #2123: add type definitions for functions `row` and `column`.
- Fix some files not exposed in the package, see #2213. Thanks @javiermarinros.


# 2021-04-12, version 9.3.2

- Fix #2169: mathjs requesting `@babel/runtime` dependency. 
  Regression introduced in `v9.3.1`.


# 2021-04-10, version 9.3.1

- Fix #2133: strongly improved the performance of `isPrime`, see #2139. 
  Thanks @Yaffle.
- Fix #2150: give a clear error "Error: Undefined function ..." instead when
  evaluating a non-existing function.
- Fix #660: expose internal functions `FunctionNode.onUndefinedFunction(name)` 
  and `SymbolNode.onUndefinedSymbol(name)`, allowing to override the behavior.
  By default, an Error is thrown.


# 2021-03-10, version 9.3.0

- Implemented support for parsing non decimal numbers with radix point,
  see #2122, #2121. Thanks @clnhlzmn.
- Fix #2128: typo in docs of `luSolveAll` and `usolveAll`.


# 2021-02-03, version 9.2.0

- Implemented function `count` to count the total elements in a matrix, 
  see #2085. Thanks @Josef37.
- Fix #2096: cleanup old reference to external dependency `crypto`.
- Some refactoring in the code to remove duplications, see #2093. 
  Thanks @Josef37.


# 2021-01-27, version 9.1.0

- Extended function `reshape` with support for a wildcard `-1` to automatically
  calculate the remaining size, like `reshape([1, 2, 3, 4, 5, 6], [-1, 2])` 
  which will output `[[0, 1], [2, 3], [4, 5]]`. See #2075. Thanks @Josef37.
- Fix #2087: function `simplify` ignores second argument of `log`, for example
  in `simplify('log(e, 9)')` . Thanks @quentintruong.


# 2021-01-16, version 9.0.0

- Improved support for bin, hex, and oct literals. See #1996. Thanks @clnhlzmn.
  - **Breaking change**: parse literals with prefixes `0b`, `0c`, and `0x` are  
    now unsigned by default. To parse them as signed, you have to specify a
    suffix specifying the word size such as `i16` or `i32`.
  - Function `format` now supports more notations: `bin`, 'hex', and `oct`,
    for example `format(255, {notation: "hex"})`.
  - The functions `format`, `bin`, `hex`, `oct` now allow specifying a wordSize, 
    like `bin(10, 32)` and `format(10, {notation: "bin", wordSize: 32})`.
  - BigNumber support for the bin, hex, and oct literals. 
- Extended and improved the example rocket_trajectory_optimization.html.
  Thanks @Josef37.


# 2020-12-30, version 8.1.1

- Improved the performance of parsing and evaluating units a lot, see #2065. 
  Thanks @flaviut.
- Upgraded dependency `fraction.js` to `v4.0.13`. 
- Moved continuous integration testing from Travis CI to Github Workflow, 
  see #2024, #2041. Thanks @harrysarson.


# 2020-12-04, version 8.1.0

- Implemented units `kilogramforce` (`kgf`). Thanks @rnd-debug.
- Fix #2026: Implement a new option `fractionsLimit` for function `simplify`, 
  defaulting to `Infinity`.
- Improved the documentation of function `clone`. Thanks @redbar0n.


# 2020-11-09, version 8.0.1

- Fix #1979: missing "subset" dependency when using "mathjs/number" entry point.
- Fix #2022: update pretty printing with MathJax example to the latest version 
  of MathJax. Thanks @pkra.


# 2020-11-06, version 8.0.0

!!! BE CAREFUL: BREAKING CHANGES !!!

- You can now use mathjs directly in node.js using ES modules without need for 
  a transpiler (see #1928, #1941, #1962). 
  Automatically loading either commonjs code or ES modules code is improved.
  All generated code is moved under `/lib`: the browser bundle is moved from 
  `/dist` to `/lib/browser`, ES module files are moved to `/lib/esm`, 
  and commonjs files are moved to `/lib/cjs`. Thanks @GreenImp.
- Non-minified bundle `dist/math.js` is no longer provided. Either use the
  minified bundle, or create a bundle yourself.
- Replaced random library `seed-random` with `seedrandom`, see #1955. 
  Thanks @poppinlp.
- Breaking changes in `pickRandom`, see #1990, #1976.
  - Will no longer return the input matrix when the given number is greater 
    than the length of the provided possibles. Instead, the function always
    returns results with the requested number of picks.
  - Will now return a `Matrix` as output when input was a `Matrix`.
  - Introduced a new syntax:
    
    ```
    math.pickRandom(array, { weights, number, elementWise })
    ```
  - Introduced a new option `elementWise`, which is `true` by default. 
    When setting `elementWise` to false, an array containing arrays will return
    random pick of arrays instead of the elements inside of the nested arrays.


# 2020-11-02, version 7.6.0

- Implemented function `rotate(w, theta)`. See #1992, #1160. Thanks @rnd-debug. 
- Implemented support for custom characters in Units via `Unit.isValidAlpha`. 
  See #1663, #2000. Thanks @rnd-debug.


# 2020-10-10, version 7.5.1

- Fix object pollution vulnerability in `math.config`. Thanks Snyk.


# 2020-10-07, version 7.5.0

- Function `pickRandom` now allows randomly picking elements from matrices 
  with 2 or more dimensions instead of only from a vector, see #1974.
  Thanks @KonradLinkowski.


# 2020-10-07, version 7.4.0

- Implemented support for passing a precision in functions `ceil`, `floor`, 
  and `fix`, similar to `round`, see #1967, #1901. Thanks @rnd-debug.
- Implemented function `rotationMatrix`, see #1160, #1984. Thanks @rnd-debug.
- Implement a clear error message when using `sqrtm` with a matrix having 
  more than two dimensions. Thanks @KonradLinkowski.
- Update dependency `decimal.js` to `10.2.1`.


# 2020-09-26, version 7.3.0

- Implemented functions `usolveAll` and `lsolveAll`, see #1916. Thanks @m93a.
- Implemented support for units in functions `std` and `variance`, see #1950. 
  Thanks @rnd-debug.
- Implemented support for binary, octal, and hexadecimal notation in the 
  expression parser, and implemented functions `bin`, `oct`, and `hex` for 
  formatting. Thanks @clnhlzmn.
- Fix #1964: inconsistent calculation of negative dividend modulo for 
  `BigNumber` and `Fraction`. Thanks @ovk.


# 2020-08-24, version 7.2.0

- Implemented new function `diff`, see #1634, #1920. Thanks @Veeloxfire. 
- Implemented support for norm 2 for matrices in function `norm`. 
  Thanks @rnd-debug. 


# 2020-07-13, version 7.1.0

- Implement support for recursion (self-referencing) of typed-functions, 
  new in `typed-function@2.0.0`. This fixes #1885: functions which where 
  extended with a new data type did not always work. Thanks @nickewing.
- Fix #1899: documentation on expression trees still using old namespace 
  `math.expression.node.*` instead of `math.*`.


# 2020-06-24, version 7.0.2

- Fix #1882: have `DenseMatrix.resize` and `SparseMatrix.resize` accept 
  `DenseMatrix` and `SparseMatrix` as inputs too, not only `Array`.
- Fix functions `sum`, `prod`, `min`, and `max` not throwing a conversion error
  when passing a single string, like `sum("abc")`.


# 2020-05-30, version 7.0.1

- Fix #1844: clarify the documentation of function `eigs`. Thanks @Lazersmoke.
- Fix #1855: Fix error in the documentation for `math.nthRoots(x)`.  
- Fix #1856: make the library robust against Object prototype pollution.


# 2020-05-07, version 7.0.0

Breaking changes:

- Improvements in calculation of the `dot` product of complex values. 
  The first argument is now conjugated. See #1761. Thanks @m93a.  
- Dropped official support for Node.js v8 which has reached end of life.
- Removed all deprecation warnings introduced in v6. 
  To upgrade smoothly from v5 to v7 or higher, upgrade to v6 first
  and resolve all deprecation warnings.


# 2020-05-04, version 6.6.5

- Fix #1834: value `Infinity` cannot be serialized and deserialized. 
  This is solved now with a new `math.replacer` function used as 
  `JSON.stringify(value, math.replacer)`.
- Fix #1842: value `Infinity` not turned into the latex symbol `\\infty`.


# 2020-04-15, version 6.6.4

- Fix published files containing Windows line endings (CRLF instead of LF).  


# 2020-04-10, version 6.6.3

- Fix #1813: bug in engineering notation for numbers of function `format`,
  sometimes resulting in needless trailing zeros.
- Fix #1808: methods `.toNumber()` and `.toNumeric()` not working on a 
  unitless unit.
- Fix #1645: not being able to use named operators `mod`, `and`, `not`, `or`,
  `xor`, `to`, `in` as object keys. Thanks @Veeloxfire.
- Fix `eigs` not using `config.epsilon`.


# 2020-03-29, version 6.6.2

- Fix #1789: Function `eigs` not calculating with BigNumber precision 
  when input contains BigNumbers.
- Run the build script during npm `prepare`, so you can use the library
  directly when installing directly from git. See #1751. Thanks @cinderblock.


# 2020-02-26, version 6.6.1

- Fix #1725: simplify `a/(b/c)`. Thanks @dbramwell.
- Fix examples in documentation of `row` and `column`.


# 2020-02-01, version 6.6.0

- Implemented function `eigs`, see #1705, #542 #1175. Thanks @arkajitmandal.
- Fixed #1727: validate matrix size when creating a `DenseMatrix` using
  `fromJSON`.
- Fixed `DenseMatrix.map` copying the size and datatype from the original
  matrix instead of checking the returned dimensions and type of the callback.
- Add a caret to dependencies (like) `^1.2.3`) to allow downstream updates
  without having to await a new release of mathjs.


# 2020-01-08, version 6.5.0

- Implemented `baseName` option for `createUnit`, see #1707.
  Thanks @ericman314.


# 2020-01-06, version 6.4.0

- Extended function `dimension` with support for n-dimensional points.
  Thanks @Veeloxfire.


# 2019-12-31, version 6.3.0

- Improved performance of `factorial` for `BigNumber` up to a factor two,
  see #1687. Thanks @kmdrGroch.


# 2019-11-20, version 6.2.5

- Fixed `IndexNode` using a hardcoded, one-based implementation of `index`,
  making it impossible to instantiate a zero-based version of the expression
  parser. See #782.


# 2019-11-20, version 6.2.4

- Fixed #1669: function 'qr' threw an error if the pivot was zero,
  thanks @kevinkelleher12 and @harrysarson.
- Resolves #942: remove misleading assert in 'qr'. Thanks @harrysarson.
- Work around a bug in complex.js where `sign(0)` returns complex NaN.
  Thanks @harrysarson.


# 2019-10-06, version 6.2.3

- Fixed #1640: function `mean` not working for units. Thanks @clintonc.
- Fixed #1639: function `min` listed twice in the "See also" section of the
  embedded docs of function `std`.
- Improved performance of `isPrime`, see #1641. Thanks @arguiot.


# 2019-09-23, version 6.2.2

- Fixed methods `map` and `clone` not copying the `dotNotation` property of
  `IndexNode`. Thanks @rianmcguire.
- Fixed a typo in the documentation of `toHTML`. Thanks @maytanthegeek.
- Fixed #1615: error in the docs of `isNumeric`.
- Fixed #1628: Cannot call methods on empty strings or numbers with value `0`.


# 2019-08-31, version 6.2.1

- Fixed #1606: function `format` not working for expressions.


# 2019-08-28, version 6.2.0

- Improved performance of `combinationsWithRep`. Thanks @waseemyusuf.
- Add unit aliases `bit` and `byte`.
- Fix docs referring to `bit` and `byte` instead of `bits` and `bytes`.
- Updated dependency `typed-function@1.1.1`.


# 2019-08-17, version 6.1.0

- Implemented function `combinationsWithRep` (see #1329). Thanks @waseemyusuf.


# 2019-08-05, version 6.0.4

- Fixed #1554, #1565: ES Modules where not transpiled to ES5, giving issues on
  old browsers. Thanks @mockdeep for helping to find a solution.


# 2019-07-07, version 6.0.3

- Add `unpkg` and `jsdelivr` fields in package.json pointing to UMD build.
  Thanks @tmcw.
- Fix #1550: nested user defined function not receiving variables of an
  outer user defined function.


# 2019-06-11, version 6.0.2

- Fix not being able to set configuration after disabling function `import`
  (regression since v6.0.0).


# 2019-06-09, version 6.0.1

- Fix function reference not published in npm library.
- Fix function `evaluate` and `parse` missing in generated docs.


# 2019-06-08, version 6.0.0

!!! BE CAREFUL: BREAKING CHANGES !!!

### Most notable changes

1.  Full support for **ES modules**. Support for tree-shaking out of the box.

    Load all functions:

    ```js
    import * as math from 'mathjs'
    ```

    Use a few functions:

    ```js
    import { add, multiply } from 'mathjs'
    ```

    Load all functions with custom configuration:

    ```js
    import { create, all } from 'mathjs'
    const config = { number: 'BigNumber' }
    const math = create(all, config)
    ```

    Load a few functions with custom configuration:

    ```js
    import { create, addDependencies, multiplyDependencies } from 'mathjs'
    const config = { number: 'BigNumber' }
    const { add, multiply } = create({
      addDependencies,
      multiplyDependencies
    }, config)
    ```

2.  Support for **lightweight, number-only** implementations of all functions:

    ```
    import { add, multiply } from 'mathjs/number'
    ```

3.  New **dependency injection** solution used under the hood.


### Breaking changes

- Node 6 is no longer supported.

- Functions `config` and `import` are not available anymore in the global
  context:

  ```js
  // v5
  import * as mathjs from 'mathjs'
  mathjs.config(...) // error in v6.0.0
  mathjs.import(...) // error in v6.0.0
  ```

  Instead, create your own mathjs instance and pass config and imports
  there:

  ```js
  // v6
  import { create, all } from 'mathjs'
  const config = { number: 'BigNumber' }
  const mathjs = create(all, config)
  mathjs.import(...)
  ```

- Renamed function `typeof` to `typeOf`, `var` to `variance`,
  and `eval` to `evaluate`. (the old function names are reserved keywords
  which can not be used as a variable name).
- Deprecated the `Matrix.storage` function. Use `math.matrix` instead to create
  a matrix.
- Deprecated function `math.expression.parse`, use `math.parse` instead.
  Was used before for example to customize supported characters by replacing
  `math.parse.isAlpha`.
- Moved all classes like `math.type.Unit` and `math.expression.Parser` to
  `math.Unit` and `math.Parser` respectively.
- Fixed #1428: transform iterating over replaced nodes. New behavior
  is that it stops iterating when a node is replaced.
- Dropped support for renaming factory functions when importing them.
- Dropped fake BigNumber support of function `erf`.
- Removed all index.js files used to load specific functions instead of all, like:

  ```
  // v5
  // ... set up empty instance of mathjs, then load a set of functions:
  math.import(require('mathjs/lib/function/arithmetic'))
  ```

  Individual functions are now loaded simply like:

  ```js
  // v6
  import { add, multiply } from 'mathjs'
  ```

  To set a specific configuration on the functions:

  ```js
  // v6
  import { create, addDependencies, multiplyDependencies } from 'mathjs'
  const config = { number: 'BigNumber' }
  const math = create({ addDependencies, multiplyDependencies }, config)
  ```

  See example `advanced/custom_loading.js`.

- Updated the values of all physical units to their latest official values.
  See #1529. Thanks @ericman314.

### Non breaking changes

- Implemented units `t`, `tonne`, `bel`, `decibel`, `dB`, and prefixes
  for `candela`. Thanks @mcvladthegoat.
- Fixed `epsilon` setting being applied globally to Complex numbers.
- Fix `math.simplify('add(2, 3)')` throwing an error.
- Fix #1530: number formatting first applied `lowerExp` and `upperExp`
  and after that rounded the value instead of the other way around.
- Fix #1473: remove `'use strict'` in every file, not needed anymore.


# 2019-05-18, version 5.10.3

- Fixed dependency `del` being a dependency instead of devDependency.


# 2019-05-18, version 5.10.2

- Fix #1515, #1516, #1517: broken package due to a naming conflict in
  the build folder of a util file `typeOf.js` and `typeof.js`.
  Solved by properly cleaning all build folders before building.


# 2019-05-17, version 5.10.1

- Fix #1512: format using notation `engineering` can give wrong results
  when the value has less significant digits than the number of digits in
  the output.


# 2019-05-08, version 5.10.0

- Fix `lib/header.js` not having filled in date and version. Thanks @kevjin.
- Upgraded dependency `decimal.js@10.2.0`, fixing an issue on node.js 12.


# 2019-04-08, version 5.9.0

- Implemented functions `row` and `column` (see #1413). Thanks @SzechuanSage.
- Fixed #1459: `engineering` notation of function `format` not available
  for `BigNumber`.
- Fixed #1465: `node.toHTML()` not correct for unary operators like
  `factorial`.


# 2019-03-20, version 5.8.0

- Implemented new function `apply`. Thanks @bnlcas.
- Implemented passing an optional `dimension` argument to `std` and `var`.
  Thanks @bnlcas.


# 2019-03-10, version 5.7.0

- Implemented support for `pow()` in `derivative`. Thanks @sam-19.
- Gracefully handle round-off errors in fix, ceil, floor, and range
  (Fixes #1429, see also #1434, #1432). Thanks @ericman314.


# 2019-03-02, version 5.6.0

- Upgrade decimal.js to v10.1.1 (#1421).
- Fixed #1418: missing whitespace when stringifying an expression
  containing "not".


# 2019-02-20, version 5.5.0

- Fixed #1401: methods `map` and `forEach` of `SparseMatrix` not working
  correctly when indexes are unordered.
- Fixed #1404: inconsistent rounding of negative numbers.
- Upgrade tiny-emitter to v2.1.0 (#1397).


# 2019-01-25, version 5.4.2

- Fixed `math.format` not working for BigNumbers with a precision above
  1025 digits (see #1385). Thanks @ericman314.
- Fixed incorrect LaTeX output of `RelationalNode`. Thanks @rianmcguire.
- Fixed a bug the methods `map`, `forEach`, `traverse`, and `transform`
  of `FunctionNode`.


# 2019-01-10, version 5.4.1

- Fix #1378: negative bignumbers not formatted correctly.
- Upgrade fraction.js to version 4.0.12 (#1369).


# 2018-12-09, version 5.4.0

- Extended sum.js to accept a dimension input to calculate the sum over a
  specific axis. Thanks @bnlcas.
- Fix #1328: objects can't be written multi-line. Thanks @GHolk.
- Remove side effects caused by `Unit.format` and `Unit.toString`,
  making changes to the unit on execution. Thanks @ericman314.


# 2018-12-03, version 5.3.1

- Fixed #1336: Unit.toSI() returning units with prefix like `mm` instead
  of `m`. Thanks @ericman314.


# 2018-11-29, version 5.3.0

- Implemented function `hasNumericValue`. Thanks @Sathish-kumar-Subramani.
- Fix #1326: non-ascii character in print.js.
- Fix #1337: `math.format` not working correctly with `{ precision: 0 }`.
  Thanks @dkenul.


# 2018-10-30, version 5.2.3

- Fixed #1293: non-unicode characters in `escape-latex` giving issues in some
  specific cases. Thanks @dangmai.
- Fixed incorrect LaTeX output of function `bitNot`, see #1299. Thanks @FSMaxB.
- Fixed #1304: function `pow` not supporting inputs `pow(Unit, BigNumber)`.
- Upgraded dependencies (`escape-latex@1.2.0`)


# 2018-10-23, version 5.2.2

- Fixed #1286: Fixed unit base recognition and formatting for
  user-defined units. Thanks @ericman314.


# 2018-10-18, version 5.2.1

- Fixed unit `rod` being defined as `5.02921` instead of `5.0292`.
  Thanks @ericman314.
- Upgraded dependencies (`fraction.js@4.0.10`)
- Upgraded devDependencies (`@babel/core@7.1.2`, `nyc@13.1.0`,
  `webpack@4.21.0`).


# 2018-10-05, version 5.2.0

- Implemented support for chained conditionals like `10 < x <= 50`.
  Thanks @ericman314.
- Add an example showing a proof of concept of using `BigInt` in mathjs.
- Fixed #1269: Bugfix for BigNumber divided by unit. Thanks @ericman314.
- Fixed #1240: allow units having just a value and no unit.
  Thanks @ericman314.


## 2018-09-09, version 5.1.2

- Fixed a typo in the docs of `parse`. Thanks @mathiasvr.
- Fixed #1222: a typo in the docs of `subset`.
- Fixed #1236: `quantileSeq` has inconsistent return.
- Fixed #1237: norm sometimes returning a complex number instead of
  number.
- Upgraded dependencies (`fraction.js@4.0.9`)
- Upgraded devDependencies (`babel@7`, `karma-webpack@3.0.4`,
  `nyc@13.0.1`, `standard@12.0.0`, `uglify-js@3.4.9`, `webpack@4.17.2`)


## 2018-08-21, version 5.1.1

- Function `isNumeric` now recognizes more types.
- Fixed #1214: functions `sqrt`, `max`, `min`, `var`, `std`, `mode`, `mad`,
  `median`, and `partitionSelect` not neatly handling `NaN` inputs. In some
  cases (`median`, `mad`, and `partitionSelect`) this resulted in an infinite
  loop.
- Upgraded dependencies (`escape-latex@1.1.1`)
- Upgraded devDependencies (`webpack@4.17.0`)


## 2018-08-12, version 5.1.0

- Implemented support for strings enclosed in single quotes.
  Thanks @jean-emmanuel.
- Implemented function `getMatrixDataType`. Thanks @JasonShin.
- Implemented new `options` argument in `simplify`. Thanks @paulobuchsbaum.
- Bug fixes in `rationalize`, see #1173. Thanks @paulobuchsbaum.


## 2018-07-22, version 5.0.4

- Strongly improved the performance of functions `factorial` for numbers.
  This improves performance of functions `gamma`, `permutation`, and
  `combination` too. See #1170. Thanks @honeybar.
- Strongly improved the performance of function `reshape`, thanks to a
  friend of @honeybar.


## 2018-07-14, version 5.0.3

- Fixed many functions (for example `add` and `subtract`) not working
  with matrices having a `datatype` defined.
- Fixed #1147: bug in `format` with `engineering` notation in outputting
  the correct number of significant figures. Thanks @ericman314.
- Fixed #1162: transform functions not being cleaned up when overriding
  it by importing a factory function with the same name.
- Fixed broken links in the documentation. Thanks @stropitek.
- Refactored the code of `parse` into a functional approach.
  Thanks @harrysarson.
- Changed `decimal.js` import to ES6. Thanks @weinshel.


## 2018-07-07, version 5.0.2

- Fixed #1136: rocket trajectory example broken (since v4.0.0).
- Fixed #1137: `simplify` unnecessarily replacing implicit multiplication with
  explicit multiplication.
- Fixed #1146: `rationalize` throwing exceptions for some input with decimals.
  Thanks @maruta.
- Fixed #1088: function arguments not being passed to `rawArgs` functions.
- Fixed advanced example `add_new_datatypes`.
- Fixed mathjs core constants not working without complex numbers.
  Thanks @ChristopherChudzicki.
- Fixed a broken link in the documentation on units. Thanks @stropitek.
- Upgraded dependencies (`typed-function@1.0.4`, `complex.js@2.0.11`).
- Upgraded devDependencies (`babel-loader@7.1.5 `, `uglify-js@3.4.3`,
  `expr-eval@1.2.2`, `webpack@4.15.1`).


## 2018-07-01, version 5.0.1

- Improved error messaging when converting units. Thanks @gap777.
- Upgraded devDependencies (`kerma`, `uglify-js`, `webpack`).


## 2018-06-16, version 5.0.0

!!! BE CAREFUL: BREAKING CHANGES !!!

- Implemented complex conjugate transpose `math.ctranspose`. See #1097.
  Thanks @jackschmidt.
- Changed the behavior of `A'` (transpose) in the expression parser to
  calculate the complex conjugate transpose. See #1097. Thanks @jackschmidt.
- Added support for `complex({abs: 1, arg: 1})`, and improved the docs on
  complex numbers. Thanks @ssaket.
- Renamed `eye` to `identity`, see #1054.
- Math.js code can now contain ES6. The ES6 source code is moved from `lib`
  to `src`, and `lib` now contains the compiled ES5 code.
- Upgraded dependencies:
  - `decimal.js` from `9.0.1` to `10.0.1`
  - Upgraded dev dependencies
- Changed code style to https://standardjs.com/, run linter on `npm test`.
  See #1110.
- Dropped support for bower. Use npm or an other package manages instead.
- Dropped support for (non-primitive) instances of `Number`, `Boolean`, and
  `String` from functions `clone` and `typeof`.
- Dropped official support for IE9 (probably still works, but it's not tested).
- Fixed #851: More consistent behavior of sqrt, nthRoot, and pow.
  Thanks @dakotablair.
- Fixed #1103: Calling `toTex` on node that contains `derivative` causing
  an exception. Thanks @joelhoover.


## 2018-06-02, version 4.4.2

- Drastically improved the performance of `det`. Thanks @ericman314.
- Fixed #1065, #1121: Fixed wrong documentation of function
  `compareNatural` and clarified the behavior for strings.
- Fixed #1122 a regression in function `inv` (since `v4.4.1`).
  Thanks @ericman314.


## 2018-05-29, version 4.4.1

- Fixed #1109: a bug in `inv` when dealing with values close to zero.
  Thanks @ericman314.


## 2018-05-28, version 4.4.0

- Implemented functions `equalText` and `compareText`. See #1085.


## 2018-05-21, version 4.3.0

- Implemented matrix exponential `math.expm`. Thanks @ericman314.
- Fixed #1101: math.js bundle not working when loading in a WebWorker.
- Upgraded dependencies
  - `complex.js` from `v2.0.2` to `v2.0.10`.
  - `fraction.js` from `v4.0.4` to `v4.0.8`.
- Upgraded devDependencies (`mocha`, `uglify-js`, `webpack`).


## 2018-05-05, version 4.2.2

- Fixed calculating the Frobenius norm of complex matrices correctly,
  see #1098. Thanks @jackschmidt.
- Fixed #1076: cannot use mathjs in React VR by updating to
  `escape-latex@1.0.3`.


## 2018-05-02, version 4.2.1

- Fixed `dist/math.js` being minified.


## 2018-05-02, version 4.2.0

- Implemented function `math.sqrtm`. Thanks @ferrolho.
- Implemented functions `math.log2`, `math.log1p`, and `math.expm1`.
  Thanks @BigFav and @harrysarson.
- Fixed some unit tests broken on nodejs v10.
- Upgraded development dependencies.
- Dropped integration testing on nodejs v4.


## 2018-04-18, version 4.1.2

- Fixed #1082: implemented support for unit plurals `decades`, `centuries`,
  and `millennia`.
- Fixed #1083: units `decade` and `watt` having a wrong name when stringifying.
  Thanks @ericman314.


## 2018-04-11, version 4.1.1

- Fixed #1063: derivative not working when resolving a variable with unary
  minus like `math.derivative('-x', 'x')`.


## 2018-04-08, version 4.1.0

- Extended function `math.print` with support for arrays and matrices.
  Thanks @jean-emmanuel.
- Fixed #1077: Serialization/deserialization to JSON with reviver not being
  supported by nodes.
- Fixed #1016: Extended `math.typeof` with support for `ResultSet` and nodes
  like `SymbolNode`.
- Fixed #1072: Added support for long and short prefixes for the unit `bar`
  (i.e. `millibar` and `mbar`).


## 2018-03-17, version 4.0.1

- Fixed #1062: mathjs not working on ES5 browsers like IE11 and Safari 9.3.
- Fixed #1061: `math.unit` not accepting input like `1/s`.


## 2018-02-25, version 4.0.0

!!! BE CAREFUL: BREAKING CHANGES !!!

Breaking changes (see also #682):

- **New expression compiler**

    The compiler of the expression parser is replaced with one that doesn't use
    `eval` internally. See #1019. This means:

    - a slightly improved performance on most browsers.
    - less risk of security exploits.
    - the code of the new compiler is easier to understand, maintain, and debug.

    Breaking change here: When using custom nodes in the expression parser,
    the syntax of `_compile` has changed. This is an undocumented feature though.

- **Parsed expressions**

    - The class `ConstantNode` is changed such that it just holds a value
      instead of holding a stringified value and it's type.
      `ConstantNode(valueStr, valueType`) is now `ConstantNode(value)`
      Stringification uses `math.format`, which may result in differently
      formatted numeric output.

    - The constants `true`, `false`, `null`, `undefined`, `NaN`, `Infinity`,
      and `uninitialized` are now parsed as ConstantNodes instead of
      SymbolNodes in the expression parser. See #833.

- **Implicit multiplication**

    - Changed the behavior of implicit multiplication to have higher
      precedence than explicit multiplication and division, except in
      a number of specific cases. This gives a more natural behavior
      for implicit multiplications. For example `24h / 6h` now returns `4`,
      whilst `1/2 kg` evaluates to `0.5 kg`. Thanks @ericman314. See: #792.
      Detailed documentation: https://github.com/josdejong/mathjs/blob/v4/docs/expressions/syntax.md#implicit-multiplication.

    - Immediately invoking a function returned by a function like `partialAdd(2)(3)`
      is no longer supported, instead these expressions are evaluated as
      an implicit multiplication `partialAdd(2) * (3)`. See #1035.

- **String formatting**

    - In function `math.format`, the options `{exponential: {lower: number, upper: number}}`
      (where `lower` and `upper` are values) are replaced with `{lowerExp: number, upperExp: number}`
      (where `lowerExp` and `upperExp` are exponents). See #676. For example:
      ```js
      math.format(2000, {exponential: {lower: 1e-2, upper: 1e2}})
      ```
      is now:
      ```js
      math.format(2000, {lowerExp: -2, upperExp: 2})
      ```

    - In function `math.format`, the option `notation: 'fixed'` no longer rounds to
      zero digits  when no precision is specified: it leaves the digits as is.
      See #676.

- **String comparison**

    Changed the behavior of relational functions (`compare`, `equal`,
    `equalScalar`, `larger`, `largerEq`, `smaller`, `smallerEq`, `unequal`)
    to compare strings by their numeric value they contain instead of
    alphabetically. This also impacts functions `deepEqual`, `sort`, `min`,
    `max`, `median`, and `partitionSelect`. Use `compareNatural` if you
    need to sort an array with text. See #680.

- **Angle units**

    Changed `rad`, `deg`, and `grad` to have short prefixes,
    and introduced `radian`, `degree`, and `gradian` and their plurals
    having long prefixes. See #749.

- **Null**

    - `null` is no longer implicitly casted to a number `0`, so input like
      `math.add(2, null)` is no longer supported. See #830, #353.

    - Dropped constant `uninitialized`, which was used to initialize
      leave new entries undefined when resizing a matrix is removed.
      Use `undefined` instead to indicate entries that are not explicitly
      set. See #833.

- **New typed-function library**

    - The `typed-function` library used to check the input types
      of functions is completely rewritten and doesn't use `eval` under
      the hood anymore. This means a reduced security risk, and easier
      to debug code. The API is the same, but error messages may differ
      a bit. Performance is comparable but may differ in specific
      use cases and browsers.

Non breaking changes:

- Thanks to the new expression compiler and `typed-function` implementation,
  mathjs doesn't use JavaScript's `eval` anymore under the hood.
  This allows using mathjs in environments with security restrictions.
  See #401.
- Implemented additional methods `isUnary()` and `isBinary()` on
  `OperatorNode`. See #1025.
- Improved error messages for statistical functions.
- Upgraded devDependencies.
- Fixed #1014: `derivative` silently dropping additional arguments
  from operator nodes with more than two arguments.


## 2018-02-07, version 3.20.2

- Upgraded to `typed-function@0.10.7` (bug-fix release).
- Fixed option `implicit` not being copied from an `OperatorNode`
  when applying function `map`. Thanks @HarrySarson.
- Fixed #995: spaces and underscores not property being escaped
  in `toTex()`. Thanks @FSMaxB.


## 2018-01-17, version 3.20.1

- Fixed #1018: `simplifyCore` failing in some cases with parentheses.
  Thanks @firepick1.


## 2018-01-14, version 3.20.0

- Implement support for 3 or more arguments for operators `+` and `*` in
  `derivative`. Thanks @HarrySarson. See #1002.
- Fixed `simplify` evalution of `simplify` of functions with more than two
  arguments wrongly: `simplify('f(x, y, z)') evaluated to `f(f(x, y), z)`
  instead of `f(x, y, z)`. Thanks @joelhoover.
- Fixed `simplify` throwing an error in some cases when simplifying unknown
  functions, for example `simplify('f(4)')`. Thanks @joelhoover.
- Fixed #1013: `simplify` wrongly simplifing some expressions containing unary
  minus, like `0 - -x`. Thanks @joelhoover.
- Fixed an error in an example in the documentation of `xor`. Thanks @denisx.


## 2018-01-06, version 3.19.0

- Extended functions `distance` and `intersect` with support for BigNumbers.
  Thanks @ovk.
- Improvements in function `simplify`: added a rule that allows combining
  of like terms in embedded quantities. Thanks @joelhoover.


## 2017-12-28, version 3.18.1

- Fixed #998: An issue with simplifying an expression containing a subtraction.
  Thanks @firepick1.


## 2017-12-16, version 3.18.0

- Implemented function `rationalize`. Thanks @paulobuchsbaum.
- Upgraded dependencies:
  ```
  decimal.js    7.2.3  →  9.0.1 (no breaking changes affecting mathjs)
  fraction.js   4.0.2  →  4.0.4
  tiny-emitter  2.0.0  →  2.0.2
  ```
- Upgraded dev dependencies.
- Fixed #975: a wrong example in the docs of lusolve.
- Fixed #983: `pickRandom` returning an array instead of single value
  when input was an array with just one value. Clarified docs.
- Fixed #969: preven issues with yarn autoclean by renaming an
  interally used folder "docs" to "embeddedDocs".


## 2017-11-18, version 3.17.0

- Improved `simplify` for nested exponentiations. Thanks @IvanVergiliev.
- Fixed a security issue in `typed-function` allowing arbitrary code execution
  in the JavaScript engine by creating a typed function with JavaScript code
  in the name. Thanks Masato Kinugawa.
- Fixed a security issue where forbidden properties like constructor could be
  replaced by using unicode characters when creating an object. No known exploit,
  but could possibly allow arbitrary code execution. Thanks Masato Kinugawa.


## 2017-10-18, version 3.16.5

- Fixed #954: Functions `add` and `multiply` not working when
  passing three or more arrays or matrices.


## 2017-10-01, version 3.16.4

- Fixed #948, #949: function `simplify` returning wrong results or
  running into an infinite recursive loop. Thanks @ericman314.
- Fixed many small issues in the embedded docs.  Thanks @Schnark.


## 2017-08-28, version 3.16.3

- Fixed #934: Wrong simplification of unary minus. Thanks @firepick1.
- Fixed #933: function `simplify` reordering operations. Thanks @firepick1.
- Fixed #930: function `isNaN` returning wrong result for complex
  numbers having just one of their parts (re/im) being `NaN`.
- Fixed #929: `FibonacciHeap.isEmpty` returning wrong result.


## 2017-08-20, version 3.16.2

- Fixed #924: a regression in `simplify` not accepting the signature
  `simplify(expr, rules, scope)` anymore. Thanks @firepick1.
- Fixed missing parenthesis when stringifying expressions containing
  implicit multiplications (see #922). Thanks @FSMaxB.


## 2017-08-12, version 3.16.1

- For security reasons, type checking is now done in a more strict
  way using functions like `isComplex(x)` instead of duck type checking
  like `x && x.isComplex === true`.
- Fixed #915: No access to property "name".
- Fixed #901: Simplify units when calling `unit.toNumeric()`.
  Thanks @AlexanderBeyn.
- Fixed `toString` of a parsed expression tree containing an
  immediately invoked function assignment not being wrapped in
  parenthesis (for example `(f(x) = x^2)(4)`).


## 2017-08-06, version 3.16.0

- Significant performance improvements in `math.simplify`.
  Thanks @firepick1.
- Improved API for `math.simplify`, optionally pass a scope with
  variables which are resolved, see #907. Thanks @firepick1.
- Fixed #912: math.js didn't work on IE10 anymore (regression
  since 3.15.0).


## 2017-07-29, version 3.15.0

- Added support for the dollar character `$` in symbol names (see #895).
- Allow objects with prototypes as scope again in the expression parser,
  this was disabled for security reasons some time ago. See #888, #899.
  Thanks @ThomasBrierley.
- Fixed #846: Issues in the functions `map`, `forEach`, and `filter`
  when used in the expression parser:
  - Not being able to use a function assignment as inline expression
    for the callback function.
  - Not being able to pass an inline expression as callback for `map`
    and `forEach`.
  - Index and original array/matrix not passed in `map` and `filter`.


## 2017-07-05, version 3.14.2

- Upgraded to `fraction.js@4.0.2`
- Fixed #891 using BigNumbers not working in browser environments.


## 2017-06-30, version 3.14.1

- Reverted to `fraction.js@4.0.0`, there is an issue with `4.0.1`
  in the browser.


## 2017-06-30, version 3.14.0

- Implemented set methods `setCartesian`, `setDifference`,
  `setDistinct`, `setIntersect`, `setIsSubset`, `setPowerset`,
  `setSize`. Thanks @Nekomajin42.
- Implemented method `toHTML` on nodes. Thanks @Nekomajin42.
- Implemented `compareNatural` and `sort([...], 'natural')`.
- Upgraded dependencies to the latest versions:
  - `complex.js@2.0.4`
  - `decimal.js@7.2.3`
  - `fraction.js@4.0.1`
  - `tiny-emitter@2.0.0`
  - And all devDependencies.
- Fixed #865: `splitUnit` can now deal with round-off errors.
  Thanks @ericman314.
- Fixed #876: incorrect definition for unit `erg`. Thanks @pjhampton.
- More informative error message when using single quotes instead of
  double quotes around a string. Thanks @HarrySarson.


## 2017-05-27, version 3.13.3

- Fixed a bug in function `intersection` of line and plane.
  Thanks @viclai.
- Fixed security vulnerabilities.


## 2017-05-26, version 3.13.2

- Disabled function `chain` inside the expression parser for security
  reasons (it's not needed there anyway).
- Fixed #856: function `subset` not returning non-primitive scalars
  from Arrays correctly. (like `math.eval('arr[1]', {arr: [math.bignumber(2)]})`.
- Fixed #861: physical constants not available in the expression parser.


## 2017-05-12, version 3.13.1

- Fixed creating units with an alias not working within the expression
  parser.
- Fixed security vulnerabilities. Thanks Sam.


## 2017-05-12, version 3.13.0

- Command line application can now evaluate inline expressions
  like `mathjs 1+2`. Thanks @slavaGanzin.
- Function `derivative` now supports `abs`. Thanks @tetslee.
- Function `simplify` now supports BigNumbers. Thanks @tetslee.
- Prevent against endless loops in `simplify`. Thanks @tetslee.
- Fixed #813: function `simplify` converting small numbers to inexact
  Fractions. Thanks @tetslee.
- Fixed #838: Function `simplify` now supports constants like `e`.
  Thanks @tetslee.


## 2017-05-05, version 3.12.3

- Fixed security vulnerabilities. Thanks Dan and Sam.


## 2017-04-30, version 3.12.2

- Added a rocket trajectory optimization example.


## 2017-04-24, version 3.12.1

- Fixed #804
  - Improved handling of powers of `Infinity`. Thanks @HarrySarson.
  - Fixed wrong formatting of complex NaN.
- Fixed security vulnerabilities in the expression parser.
  Thanks Sam and Dan.


## 2017-04-17, version 3.12.0

- Implemented QR decomposition, function `math.qr`. Thanks @HarrySarson.
- Fixed #824: Calling `math.random()` freezes IE and node.js.


## 2017-04-08, version 3.11.5

- More security measures in the expression parser.
  WARNING: the behavior of the expression parser is now more strict,
  some undocumented features may not work any longer.
  - Accessing and assigning properties is now only allowed on plain
    objects, not on classes, arrays, and functions anymore.
  - Accessing methods is restricted to a set of known, safe methods.


## 2017-04-03, version 3.11.4

- Fixed a security vulnerability in the expression parser. Thanks @xfix.


## 2017-04-03, version 3.11.3

- Fixed a security vulnerability in the expression parser. Thanks @xfix.


## 2017-04-03, version 3.11.2

- Fixed a security vulnerability in the expression parser. Thanks @xfix.


## 2017-04-02, version 3.11.1

- Fixed security vulnerabilities in the expression parser.
  Thanks Joe Vennix and @xfix.


## 2017-04-02, version 3.11.0

- Implemented method Unit.toSI() to convert a unit to base SI units.
  Thanks @ericman314.
- Fixed #821, #822: security vulnerabilities in the expression parser.
  Thanks @comex and @xfix.


## 2017-03-31, version 3.10.3

- More security fixes related to the ones fixed in `v3.10.2`.


## 2017-03-31, version 3.10.2

- Fixed a security vulnerability in the expression parser allowing
  execution of arbitrary JavaScript. Thanks @CapacitorSet and @denvit.


## 2017-03-26, version 3.10.1

- Fixed `xgcd` for negative values. Thanks @litmit.
- Fixed #807: function transform of existing functions not being removed when
  overriding such a function.


## 2017-03-05, version 3.10.0

- Implemented function `reshape`. Thanks @patgrasso and @ericman314.
- Implemented configuration option `seedRandom` for deterministic random
  numbers. Thanks @morsecodist.
- Small fixes in the docs. Thanks @HarrySarson.
- Dropped support for component package manager (which became deprecated about
  one and a half year ago).


## 2017-02-22, version 3.9.3

- Fixed #797: issue with production builds of React Native projects.
- Fixed `math.round` not accepting inputs `NaN`, `Infinity`, `-Infinity`.
- Upgraded all dependencies.


## 2017-02-16, version 3.9.2

- Fixed #795: Parse error in case of a multi-line expression with just comments.


## 2017-02-06, version 3.9.1

- Fixed #789: Math.js not supporting conversion of `string` to `BigNumber`,
  `Fraction`, or `Complex` number.
- Fixed #790: Expression parser did not pass function arguments of enclosing
  functions via `scope` to functions having `rawArgs = true`.
- Small fixes in the docs. Thanks @HarrySarson.


## 2017-01-23, version 3.9.0

- Implemented support for algebra: powerful new functions `simplify` and
  `derivative`. Thanks @ericman314, @tetslee, and @BigFav.
- Implemented Kronecker Product `kron`. Thanks @adamisntdead.
- Reverted `FunctionNode` not accepting a string as function name anymore.
- Fixed #765: `FunctionAssignmentNode.toString()` returning a string
  incompatible with the function assignment syntax.


## 2016-12-15, version 3.8.1

- Implemented function `mad` (median absolute deviation). Thanks @ruhleder.
- Fixed #762: expression parser failing to invoke a function returned
  by a function.


## 2016-11-18, version 3.8.0

- Functions `add` and `multiply` now accept more than two arguments. See #739.
- `OperatorNode` now supports more than two arguments. See #739. Thanks @FSMaxB.
- Implemented a method `Node.cloneDeep` for the expression nodes. See #745.
- Fixed a bug in `Node.clone()` not cloning implicit multiplication correctly.
  Thanks @FSMaxB.
- Fixed #737: Improved algorithm determining the best prefix for units.
  It will now retain the original unit like `1 cm` when close enough,
  instead of returning `10 mm`. Thanks @ericman314.
- Fixed #732: Allow letter-like unicode characters like Ohm `\u2126`.
- Fixed #749: Units `rad`, `deg`, and `grad` can now have prefixes like `millirad`.
- Some fixes in the docs and comments of examples. Thanks @HarrySarson.


## 2016-11-05, version 3.7.0

- Implemented method `Node.equals(other)` for all nodes of the expression parser.
- Implemented BigNumber support in function `arg()`.
- Command Line Interface loads faster.
- Implicit conversions between Fractions and BigNumbers throw a neat error now
  (See #710).


## 2016-10-21, version 3.6.0

- Implemented function `erf()`. THanks @patgrasso.
- Extended function `cross()` to support n-d vectors. Thanks @patgrasso.
- Extended function `pickRandom` with the option to pick multiple values from
  an array and give the values weights: `pickRandom(possibles, number, weights)`.
  Thanks @woylie.
- Parser now exposes test functions like `isAlpha` which can be replaced in
  order to adjust the allowed characters in variables names (See #715).
- Fixed #727: Parser not throwing an error for invalid implicit multiplications
  like `-2 2` and `2^3 4` (right after the second value of an operator).
- Fixed #688: Describe allowed variable names in the docs.


## 2016-09-21, version 3.5.3

- Some more fixes regarding numbers ending with a decimal mark (like `2.`).


## 2016-09-20, version 3.5.2

- Fixed numbers ending with a decimal mark (like `2.`) not being supported by
  the parser, solved the underlying ambiguity in the parser. See #707, #711.


## 2016-09-12, version 3.5.1

- Removed a left over console.log statement. Thanks @eknkc.


## 2016-09-07, version 3.5.0

- Comments of expressions are are now stored in the parsed nodes. See #690.
- Fixed function `print` not accepting an Object with formatting options as
  third parameter Thanks @ThomasBrierley.
- Fixed #707: The expression parser no longer accepts numbers ending with a dot
  like `2.`.


## 2016-08-08, version 3.4.1

- Fixed broken bundle files (`dist/math.js`, `dist/math.min.js`).
- Fixed some layout issues in the function reference docs.


## 2016-08-07, version 3.4.0

- Implemented support for custom units using `createUnit`. Thanks @ericman314.
- Implemented function `splitUnits`. Thanks @ericman314.
- Implemented function `isPrime`. Thanks @MathBunny.


## 2016-07-05, version 3.3.0

- Implemented function `isNaN`.
- Function `math.filter` now passes three arguments to the callback function:
  value, index, and array.
- Removed the check on the number of arguments from functions defined in the
  expression parser (see #665).
- Fixed #665: functions `map`, `forEach`, and `filter` now invoke callbacks
  which are a typed-function with the correct number of arguments.


## 2016-04-26, version 3.2.1

- Fixed #651: unable to perform calculations on "Unit-less" units.
- Fixed matrix.subset mutating the replacement matrix when unsqueezing it.


## 2016-04-16, version 3.2.0

- Implemented #644: method `Parser.getAll()` to retrieve all defined variables.
- Upgraded dependencies (decimal.js@5.0.8, fraction.js@3.3.1,
  typed-function@0.10.4).
- Fixed #601: Issue with unnamed typed-functions by upgrading to
  typed-function v0.10.4.
- Fixed #636: More strict `toTex` templates, reckon with number of arguments.
- Fixed #641: Bug in expression parser parsing implicit multiplication with
  wrong precedence in specific cases.
- Fixed #645: Added documentation about `engineering` notation of function
  `math.format`.


## 2016-04-03, version 3.1.4

- Using ES6 Math functions like `Math.sinh`, `Math.cbrt`, `Math.sign`, etc when
  available.
- Fixed #631: unit aliases `weeks`, `months`, and `years` where missing.
- Fixed #632: problem with escaped backslashes at the end of strings.
- Fixed #635: `Node.toString` options where not passed to function arguments.
- Fixed #629: expression parser throws an error when passing a number with
  decimal exponent instead of parsing them as implicit multiplication.
- Fixed #484, #555: inaccuracy of `math.sinh` for values between -1 and 1.
- Fixed #625: Unit `in` (`inch`) not always working due to ambiguity with
  the operator `a in b` (alias of `a to b`).


## 2016-03-24, version 3.1.3

- Fix broken bundle.


## 2016-03-24, version 3.1.2

- Fix broken npm release.


## 2016-03-24, version 3.1.1

- Fixed #621: a bug in parsing implicit multiplications like `(2)(3)+4`.
- Fixed #623: `nthRoot` of zero with a negative root returned `0` instead of
  `Infinity`.
- Throw an error when functions `min`, `max`, `mean`, or `median` are invoked
  with multiple matrices as arguments (see #598).


## 2016-03-19, version 3.1.0

- Hide multiplication operator by default when outputting `toTex` and `toString`
  for implicit multiplications. Implemented and option to output the operator.
- Implemented unit `kip` and alias `kips`. Thanks @hgupta9.
- Added support for prefixes for units `mol` and `mole`. Thanks @stu-blair.
- Restored support for implicit multiplications like `2(3+4)` and `(2+3)(4+5)`.
- Some improvements in the docs.
- Added automatic conversions from `boolean` and `null` to `Fraction`,
  and conversions from `Fraction` to `Complex`.


## 2016-03-04, version 3.0.0

### breaking changes

- More restricted support for implicit multiplication in the expression
  parser: `(...)(...)` is now evaluated as a function invocation,
  and `[...][...]` as a matrix subset.
- Matrix multiplication no longer squeezes scalar outputs to a scalar value,
  but leaves them as they are: a vector or matrix containing a single value.
  See #529.
- Assignments in the expression parser now return the assigned value rather
  than the created or updated object (see #533). Example:

  ```
  A = eye(3)
  A[1,1] = 2   # this assignment now returns 2 instead of A
  ```

- Expression parser now supports objects. This involves a refactoring and
  extension in expression nodes:
  - Implemented new node `ObjectNode`.
  - Refactored `AssignmentNode`, `UpdateNode`, and `IndexNode` are refactored
    into `AccessorNode`, `AssignmentNode`, and `IndexNode` having a different API.
- Upgraded the used BigNumber library `decimal.js` to v5. Replaced the
  trigonometric functions of math.js with those provided in decimal.js v5.
  This can give slightly different behavior qua round-off errors.
- Replaced the internal `Complex.js` class with the `complex.js` library
  created by @infusion.
- Entries in a matrix (typically numbers, BigNumbers, Units, etc) are now
  considered immutable, they are no longer copied when performing operations on
  the entries, improving performance.
- Implemented nearly equal comparison for relational functions (`equal`,
  `larger`, `smaller`, etc.) when using BigNumbers.
- Changed the casing of the configuration options `matrix` (`Array` or `Matrix`)
  and `number` (`number`, `BigNumber`, `Fraction`) such that they now match
  the type returned by `math.typeof`. Wrong casing gives a console warning but
  will still work.
- Changed the default config value for `epsilon` from `1e-14` to `1e-12`,
  see #561.

### non-breaking changes

- Extended function `pow` to return the real root for cubic roots of negative
  numbers. See #525, #482, #567.
- Implemented support for JSON objects in the expression parser and the
  function `math.format`.
- Function `math.fraction` now supports `BigNumber`, and function
  `math.bignumber` now supports `Fraction`.
- Expression parser now allows function and/or variable assignments inside
  accessors and conditionals, like `A[x=2]` or `a > 2 ? b="ok" : b="fail"`.
- Command line interface:
  - Outputs the variable name of assignments.
  - Fixed not rounding BigNumbers to 14 digits like numbers.
  - Fixed non-working autocompletion of user defined variables.
- Reorganized and extended docs, added docs on classes and more. Thanks @hgupta9.
- Added new units `acre`, `hectare`, `torr`, `bar`, `mmHg`, `mmH2O`, `cmH2O`,
  and added new aliases `acres`, `hectares`, `sqfeet`, `sqyard`, `sqmile`,
  `sqmiles`, `mmhg`, `mmh2o`, `cmh2o`. Thanks @hgupta9.
- Fixed a bug in the toString method of an IndexNode.
- Fixed angle units `deg`, `rad`, `grad`, `cycle`, `arcsec`, and `arcmin` not
  being defined as BigNumbers when configuring to use BigNumbers.


## 2016-02-03, version 2.7.0

- Added more unit aliases for time: `secs`, `mins`, `hr`, `hrs`. See #551.
- Added support for doing operations with mixed `Fractions` and `BigNumbers`.
- Fixed #540: `math.intersect()` returning null in some cases. Thanks @void42.
- Fixed #546: Cannot import BigNumber, Fraction, Matrix, Array.
  Thanks @brettjurgens.


## 2016-01-08, version 2.6.0

- Implemented (complex) units `VA` and `VAR`.
- Implemented time units for weeks, months, years, decades, centuries, and
  millennia. Thanks @owenversteeg.
- Implemented new notation `engineering` in function `math.format`.
  Thanks @johnmarinelli.
- Fixed #523: In some circumstances, matrix subset returned a scalar instead
  of the correct subset.
- Fixed #536: A bug in an internal method used for sparse matrices.


## 2015-12-05, version 2.5.0

- Implemented support for numeric types `Fraction` and `BigNumber` in units.
- Implemented new method `toNumeric` for units.
- Implemented new units `arcsec`, `arcsecond`, `arcmin`, `arcminute`.
  Thanks @devdevdata222.
- Implemented new unit `Herts` (`Hz`). Thanks @SwamWithTurtles.
- Fixed #485: Scoping issue with variables both used globally as well as in a
  function definition.
- Fixed: Function `number` didn't support `Fraction` as input.


## 2015-11-14, version 2.4.2

- Fixed #502: Issue with `format` in some JavaScript engines.
- Fixed #503: Removed trailing commas and the use of keyword `import` as
  property, as this gives issues with old JavaScript engines.


## 2015-10-29, version 2.4.1

- Fixed #480: `nthRoot` not working on Internet Explorer (up to IE11).
- Fixed #490: `nthRoot` returning an error for negative values like
  `nthRoot(-2, 3)`.
- Fixed #489: an issue with initializing a sparse matrix without data.
  Thanks @Retsam.
- Fixed: #493: function `combinations` did not throw an exception for
  non-integer values of `k`.
- Fixed: function `import` did not override typed functions when the option
  override was set true.
- Fixed: added functions `math.sparse` and `math.index` to the reference docs,
  they where missing.
- Fixed: removed memoization from `gamma` and `factorial` functions, this
  could blow up memory.


## 2015-10-09, version 2.4.0

- Added support in the expression parser for mathematical alphanumeric symbols
  in the expression parser: unicode range \u{1D400} to \u{1D7FF} excluding
  invalid code points.
- Extended function `distance` with more signatures. Thanks @kv-kunalvyas.
- Fixed a bug in functions `sin` and `cos`, which gave wrong results for
  BigNumber integer values around multiples of tau (i.e. `sin(bignumber(7))`).
- Fixed value of unit `stone`. Thanks @Esvandiary for finding the error.


## 2015-09-19, version 2.3.0

- Implemented function `distance`. Thanks @devanp92.
- Implemented support for Fractions in function `lcm`. Thanks @infusion.
- Implemented function `cbrt` for numbers, complex numbers, BigNumbers, Units.
- Implemented function `hypot`.
- Upgraded to fraction.js v3.0.0.
- Fixed #450: issue with non sorted index in sparse matrices.
- Fixed #463, #322: inconsistent handling of implicit multiplication.
- Fixed #444: factorial of infinity not returning infinity.


## 2015-08-30, version 2.2.0

- Units with powers (like `m^2` and `s^-1`) now output with the best prefix.
- Implemented support for units to `abs`, `cube`, `sign`, `sqrt`, `square`.
  Thanks @ericman314.
- Implemented function `catalan` (Combinatorics). Thanks @devanp92.
- Improved the `canDefineProperty` check to return false in case of IE8, which
  has a broken implementation of `defineProperty`. Thanks @golmansax.
- Fixed function `to` not working in case of a simplified unit.
- Fixed #437: an issue with row swapping in `lup`, also affecting `lusolve`.


## 2015-08-12, version 2.1.1

- Fixed wrong values of the physical constants `speedOfLight`, `molarMassC12`,
  and `magneticFluxQuantum`. Thanks @ericman314 for finding two of them.


## 2015-08-11, version 2.1.0

- Implemented derived units (like `110 km/h in m/s`). Thanks @ericman314.
- Implemented support for electric units. Thanks @ericman314.
- Implemented about 50 physical constants like `speedOfLight`, `gravity`, etc.
- Implemented function `kldivergence` (Kullback-Leibler divergence).
  Thanks @saromanov.
- Implemented function `mode`. Thanks @kv-kunalvyas.
- Added support for unicode characters in the expression parser: greek letters
  and latin letters with accents. See #265.
- Internal functions `Unit.parse` and `Complex.parse` now throw an Error
  instead of returning null when passing invalid input.


## 2015-07-29, version 2.0.1

- Fixed operations with mixed fractions and numbers be converted to numbers
  instead of fractions.


## 2015-07-28, version 2.0.0

- Large internal refactoring:
  - performance improvements.
  - allows to create custom bundles
  - functions are composed using `typed-function` and are extensible
- Implemented support for fractions, powered by the library `fraction.js`.
- Implemented matrix LU decomposition with partial pivoting and a LU based
  linear equations solver (functions `lup` and `lusolve`). Thanks @rjbaucells.
- Implemented a new configuration option `predictable`, which can be set to
  true in order to ensure predictable function output types.
- Implemented function `intersect`. Thanks @kv-kunalvyas.
- Implemented support for adding `toTex` properties to custom functions.
  Thanks @FSMaxB.
- Implemented support for complex values to `nthRoot`. Thanks @gangachris.
- Implemented util functions `isInteger`, `isNegative`, `isNumeric`,
  `isPositive`, and `isZero`.

### breaking changes

- String input is now converted to numbers by default for all functions.
- Adding two strings will no longer concatenate them, but will convert the
  strings to numbers and add them.
- Function `index` does no longer accept an array `[start, end, step]`, but
  instead accepts an array with arbitrary index values. It also accepts
  a `Range` object as input.
- Function `typeof` no longer returns lower case names, but now returns lower
  case names for primitives (like `number`, `boolean`, `string`), and
  upper-camel-case for non-primitives (like `Array`, `Complex`, `Function`).
- Function `import` no longer supports a module name as argument. Instead,
  modules can be loaded using require: `math.import(require('module-name'))`.
- Function `import` has a new option `silent` to ignore errors, and throws
  errors on duplicates by default.
- Method `Node.compile()` no longer needs `math` to be passed as argument.
- Reintroduced method `Node.eval([scope])`.
- Function `sum` now returns zero when input is an empty array. Thanks @FSMAxB.
- The size of Arrays is no longer validated. Matrices will validate this on
  creation.


## 2015-07-12, version 1.7.1

- Fixed #397: Inaccuracies in nthRoot for very large values, and wrong results
  for very small values. (backported from v2)
- Fixed #405: Parser throws error when defining a function in a multiline
  expression.


## 2015-05-31, version 1.7.0

- Implemented function `quantileSeq` and `partitionSelect`. Thanks @BigFav.
- Implemented functions `stirlingS2`, `bellNumbers`, `composition`, and
  `multinomial`. Thanks @devanp92.
- Improved the performance of `median` (see #373). Thanks @BigFav.
- Extended the command line interface with a `mode` option to output either
  the expressions result, string representation, or tex representation.
  Thanks @FSMaxB.
- Fixed #309: Function median mutating the input matrix. Thanks @FSMaxB.
- Fixed `Node.transform` not recursing over replaced parts of the
  node tree (see #349).
- Fixed #381: issue in docs of `randomInt`.


## 2015-04-22, version 1.6.0

- Improvements in `toTex`. Thanks @FSMaxB.
- Fixed #328: `abs(0 + 0i)` evaluated to `NaN`.
- Fixed not being able to override lazy loaded constants.


## 2015-04-09, version 1.5.2

- Fixed #313: parsed functions did not handle recursive calls correctly.
- Fixed #251: binary prefix and SI prefix incorrectly used for byte. Now
  following SI standards (`1 KiB == 1024 B`, `1 kB == 1000 B`).
- Performance improvements in parsed functions.


## 2015-04-08, version 1.5.1

- Fixed #316: a bug in rounding values when formatting.
- Fixed #317, #319: a bug in formatting negative values.


## 2015-03-28, version 1.5.0

- Added unit `stone` (6.35 kg).
- Implemented support for sparse matrices. Thanks @rjbaucells.
- Implemented BigNumber support for function `atan2`. Thanks @BigFav.
- Implemented support for custom LaTeX representations. Thanks @FSMaxB.
- Improvements and bug fixes in outputting parentheses in `Node.toString` and
  `Node.toTex` functions. Thanks @FSMaxB.
- Fixed #291: function `format` sometimes returning exponential notation when
  it should return a fixed notation.


## 2015-02-28, version 1.4.0

- Implemented trigonometric functions:
  `acosh`, `acoth`, `acsch`, `asech`, `asinh`, `atanh`, `acot`, `acsc`, `asec`.
  Thanks @BigFav.
- Added BigNumber support for functions: `cot`, `csc`, `sec`, `coth`,
  `csch`, `sech`. Thanks @BigFav.
- Implemented support for serialization and deserialization of math.js data
  types.
- Fixed the calculation of `norm()` and `abs()` for large complex numbers.
  Thanks @rjbaucells.
- Fixed #281: improved formatting complex numbers. Round the real or imaginary
  part to zero when the difference is larger than the configured precision.


## 2015-02-09, version 1.3.0

- Implemented BigNumber implementations of most trigonometric functions: `sin`,
  `cos`, `tan`, `asin`, `acos`, `atan`, `cosh`, `sinh`, `tanh`. Thanks @BigFav.
- Implemented function `trace`. Thanks @pcorey.
- Faster loading of BigNumber configuration with a high precision by lazy
  loading constants like `pi` and `e`.
- Fixed constants `NaN` and `Infinity` not being BigNumber objects when
  BigNumbers are configured.
- Fixed missing parentheses in the `toTex` representation of function
  `permutations`.
- Some minor fixes in the docs. Thanks @KenanY.


## 2014-12-25, version 1.2.0

- Support for bitwise operations `bitAnd`, `bitNot`, `bitOr`, `bitXor`,
  `leftShift`, `rightArithShift`, and `rightLogShift`. Thanks @BigFav.
- Support for boolean operations `and`, `not`, `or`, `xor`. Thanks @BigFav.
- Support for `gamma` function. Thanks @BigFav.
- Converting a unit without value will now result in a unit *with* value,
  i.e. `inch in cm` will return `2.54 cm` instead of `cm`.
- Improved accuracy of `sinh` and complex `cos` and `sin`. Thanks @pavpanchekha.
- Renamed function `select` to `chain`. The old function `select` will remain
  functional until math.js v2.0.
- Upgraded to decimal.js v4.0.1 (BigNumber library).


## 2014-11-22, version 1.1.1

- Fixed Unit divided by Number returning zero.
- Fixed BigNumber downgrading to Number for a negative base in `pow`.
- Fixed some typos in error messaging (thanks @andy0130tw) and docs.


## 2014-11-15, version 1.1.0

- Implemented functions `dot` (dot product), `cross` (cross product), and
  `nthRoot`.
- Officially opened up the API of expression trees:
  - Documented the API.
  - Implemented recursive functions `clone`, `map`, `forEach`, `traverse`,
    `transform`, and `filter` for expression trees.
  - Parameter `index` in the callbacks of `map` and `forEach` are now cloned
    for every callback.
  - Some internal refactoring inside nodes to make the API consistent:
    - Renamed `params` to `args` and vice versa to make things consistent.
    - Renamed `Block.nodes` to `Block.blocks`.
    - `FunctionNode` now has a `name: string` instead of a `symbol: SymbolNode`.
    - Changed constructor of `RangeNode` to
      `new RangeNode(start: Node, end: Node [, step: Node])`.
    - Nodes for a `BlockNode` must now be passed via the constructor instead
      of via a function `add`.
- Fixed `2e` giving a syntax error instead of being parsed as `2 * e`.


## 2014-09-12, version 1.0.1

- Disabled array notation for ranges in a matrix index in the expression parser
  (it is confusing and redundant there).
- Fixed a regression in the build of function subset not being able to return
  a scalar.
- Fixed some missing docs and broken links in the docs.


## 2014-09-04, version 1.0.0

- Implemented a function `filter(x, test)`.
- Removed `math.distribution` for now, needs some rethinking.
- `math.number` can convert units to numbers (requires a second argument)
- Fixed some precedence issues with the range and conversion operators.
- Fixed an zero-based issue when getting a matrix subset using an index
  containing a matrix.


## 2014-08-21, version 0.27.0

- Implemented functions `sort(x [, compare])` and `flatten(x)`.
- Implemented support for `null` in all functions.
- Implemented support for "rawArgs" functions in the expression parser. Raw
  functions are invoked with unevaluated parameters (nodes).
- Expressions in the expression parser can now be spread over multiple lines,
  like '2 +\n3'.
- Changed default value of the option `wrap` of function `math.import` to false.
- Changed the default value for new entries in a resized matrix when to zero.
  To leave new entries uninitialized, use the new constant `math.uninitialized`
  as default value.
- Renamed transform property from `__transform__` to `transform`, and documented
  the transform feature.
- Fixed a bug in `math.import` not applying options when passing a module name.
- A returned matrix subset is now only squeezed when the `index` consists of
  scalar values, and no longer for ranges resolving into a single value.


## 2014-08-03, version 0.26.0

- A new instance of math.js can no longer be created like `math([options])`,
  to prevent side effects from math being a function instead of an object.
  Instead, use the function `math.create([options])` to create a new instance.
- Implemented `BigNumber` support for all constants: `pi`, `tau`, `e`, `phi`,
  `E`, `LN2`, `LN10`, `LOG2E`, `LOG10E`, `PI`, `SQRT1_2`, and `SQRT2`.
- Implemented `BigNumber` support for functions `gcd`, `xgcd`, and `lcm`.
- Fixed function `gxcd` returning an Array when math.js was configured
  as `{matrix: 'matrix'}`.
- Multi-line expressions now return a `ResultSet` instead of an `Array`.
- Implemented transforms (used right now to transform one-based indices to
  zero-based for expressions).
- When used inside the expression parser, functions `concat`, `min`, `max`,
  and `mean` expect an one-based dimension number.
- Functions `map` and `forEach` invoke the callback with one-based indices
  when used from within the expression parser.
- When adding or removing dimensions when resizing a matrix, the dimensions
  are added/removed from the inner side (right) instead of outer side (left).
- Improved index out of range errors.
- Fixed function `concat` not accepting a `BigNumber` for parameter `dim`.
- Function `squeeze` now squeezes both inner and outer singleton dimensions.
- Output of getting a matrix subset is not automatically squeezed anymore
  except for scalar output.
- Renamed `FunctionNode` to `FunctionAssignmentNode`, and renamed `ParamsNode`
  to `FunctionNode` for more clarity.
- Fixed broken auto completion in CLI.
- Some minor fixes.


## 2014-07-01, version 0.25.0

- The library now immediately returns a default instance of mathjs, there is
  no need to instantiate math.js in a separate step unless one ones to set
  configuration options:

        // instead of:
        var mathjs = require('mathjs'),  // load math.js
            math = mathjs();             // create an instance

        // just do:
        var math = require('mathjs');
- Implemented support for implicit multiplication, like `math.eval('2a', {a:3})`
  and `math.eval('(2+3)(1-3)')`. This changes behavior of matrix indexes as
  well: an expression like `[...][...]` is not evaluated as taking a subset of
  the first matrix, but as an implicit multiplication of two matrices.
- Removed utility function `ifElse`. This function is redundant now the
  expression parser has a conditional operator `a ? b : c`.
- Fixed a bug with multiplying a number with a temperature,
  like `math.eval('10 * celsius')`.
- Fixed a bug with symbols having value `undefined` not being evaluated.


## 2014-06-20, version 0.24.1

- Something went wrong with publishing on npm.


## 2014-06-20, version 0.24.0

- Added constant `null`.
- Functions `equal` and `unequal` support `null` and `undefined` now.
- Function `typeof` now recognizes regular expressions as well.
- Objects `Complex`, `Unit`, and `Help` now return their string representation
  when calling `.valueOf()`.
- Changed the default number of significant digits for BigNumbers from 20 to 64.
- Changed the behavior of the conditional operator (a ? b : c) to lazy
  evaluating.
- Fixed imported, wrapped functions not accepting `null` and `undefined` as
  function arguments.


## 2014-06-10, version 0.23.0

- Renamed some functions (everything now has a logical, camel case name):
  - Renamed functions `edivide`, `emultiply`, and `epow` to `dotDivide`,
    `dotMultiply`, and `dotPow` respectively.
  - Renamed functions `smallereq` and `largereq` to `smallerEq` and `largerEq`.
  - Renamed function `unary` to `unaryMinus` and added support for strings.
- `end` is now a reserved keyword which cannot be used as function or symbol
  name in the expression parser, and is not allowed in the scope against which
  an expression is evaluated.
- Implemented function `unaryPlus` and unary plus operator.
- Implemented function `deepEqual` for matrix comparisons.
- Added constant `phi`, the golden ratio (`phi = 1.618...`).
- Added constant `version`, returning the version number of math.js as string.
- Added unit `drop` (`gtt`).
- Fixed not being able to load math.js using AMD/require.js.
- Changed signature of `math.parse(expr, nodes)` to `math.parse(expr, options)`
  where `options: {nodes: Object.<String, Node>}`
- Removed matrix support from conditional function `ifElse`.
- Removed automatic assignment of expression results to variable `ans`.
  This functionality can be restored by pre- or postprocessing every evaluation,
  something like:

        function evalWithAns (expr, scope) {
          var ans = math.eval(expr, scope);
          if (scope) {
            scope.ans = ans;
          }
          return ans;
        }


## 2014-05-22, version 0.22.0

- Implemented support to export expressions to LaTeX. Thanks Niels Heisterkamp
  (@nheisterkamp).
- Output of matrix multiplication is now consistently squeezed.
- Added reference documentation in the section /docs/reference.
- Fixed a bug in multiplying units without value with a number (like `5 * cm`).
- Fixed a bug in multiplying two matrices containing vectors (worked fine for
  arrays).
- Fixed random functions not accepting Matrix as input, and always returning
  a Matrix as output.


## 2014-05-13, version 0.21.1

- Removed `crypto` library from the bundle.
- Deprecated functions `Parser.parse` and `Parser.compile`. Use
  `math.parse` and `math.compile` instead.
- Fixed function `add` not adding strings and matrices element wise.
- Fixed parser not being able to evaluate an exponent followed by a unary minus
  like `2^-3`, and a transpose followed by an index like `[3]'[1]`.


## 2014-04-24, version 0.21.0

- Implemented trigonometric hyperbolic functions `cosh`, `coth`, `csch`,
  `sech`, `sinh`, `tanh`. Thanks Rogelio J. Baucells (@rjbaucells).
- Added property `type` to all expression nodes in an expression tree.
- Fixed functions `log`, `log10`, `pow`, and `sqrt` not supporting complex
  results from BigNumber input (like `sqrt(bignumber(-4))`).


## 2014-04-16, version 0.20.0

- Switched to module `decimal.js` for BigNumber support, instead of
  `bignumber.js`.
- Implemented support for polar coordinates to the `Complex` datatype.
  Thanks Finn Pauls (@finnp).
- Implemented BigNumber support for functions `exp`, `log`, and `log10`.
- Implemented conditional operator `a ? b : c` in expression parser.
- Improved floating point comparison: the functions now check whether values
  are nearly equal, against a configured maximum relative difference `epsilon`.
  Thanks Rogelio J. Baucells (@rjbaucells).
- Implemented function `norm`. Thanks Rogelio J. Baucells (@rjbaucells).
- Improved function `ifElse`, is now specified for special data types too.
- Improved function `det`. Thanks Bryan Cuccioli (@bcuccioli).
- Implemented `BigNumber` support for functions `det` and `diag`.
- Added unit alias `lbs` (pound mass).
- Changed configuration option `decimals` to `precision` (applies to BigNumbers
  only).
- Fixed support for element-wise comparisons between a string and a matrix.
- Fixed: expression parser now trows IndexErrors with one-based indices instead
  of zero-based.
- Minor bug fixes.


## 2014-03-30, version 0.19.0

- Implemented functions `compare`, `sum`, `prod`, `var`, `std`, `median`.
- Implemented function `ifElse` Thanks @mtraynham.
- Minor bug fixes.


## 2014-02-15, version 0.18.1

- Added unit `feet`.
- Implemented function `compile` (shortcut for parsing and then compiling).
- Improved performance of function `pow` for matrices. Thanks @hamadu.
- Fixed broken auto completion in the command line interface.
- Fixed an error in function `combinations` for large numbers, and
  improved performance of both functions `combinations` and `permutations`.


## 2014-01-18, version 0.18.0

- Changed matrix index notation of expression parser from round brackets to
  square brackets, for example `A[1, 1:3]` instead of `A(1, 1:3)`.
- Removed need to use the `function` keyword for function assignments in the
  expression parser, you can define a function now like `f(x) = x^2`.
- Implemented a compilation step in the expression parser: expressions are
  compiled into JavaScript, giving much better performance (easily 10x as fast).
- Renamed unit conversion function and operator `in` to `to`. Operator `in` is
  still available in the expression parser as an alias for `to`. Added unit
  `in`, an abbreviation for `inch`. Thanks Elijah Insua (@tmpvar).
- Added plurals and aliases for units.
- Implemented an argument `includeEnd` for function `range` (false by default).
- Ranges in the expression parser now support big numbers.
- Implemented functions `permutations` and `combinations`.
  Thanks Daniel Levin (@daniel-levin).
- Added lower case abbreviation `l` for unit litre.


## 2013-12-19, version 0.17.1

- Fixed a bug with negative temperatures.
- Fixed a bug with prefixes of units squared meter `m2` and cubic meter `m3`.


## 2013-12-12, version 0.17.0

- Renamed and flattened configuration settings:
  - `number.defaultType` is now `number`.
  - `number.precision` is now `decimals`.
  - `matrix.defaultType` is now `matrix`.
- Function `multiply` now consistently outputs a complex number on complex input.
- Fixed `mod` and `in` not working as function (only as operator).
- Fixed support for old browsers (IE8 and older), compatible when using es5-shim.
- Fixed support for Java's ScriptEngine.


## 2013-11-28, version 0.16.0

- Implemented BigNumber support for arbitrary precision calculations.
  Added settings `number.defaultType` and `number.precision` to configure
  big numbers.
- Documentation is extended.
- Removed utility functions `isScalar`, `toScalar`, `isVector`, `toVector`
  from `Matrix` and `Range`. Use `math.squeeze` and `math.size` instead.
- Implemented functions `get` and `set` on `Matrix`, for easier and faster
  retrieval/replacement of elements in a matrix.
- Implemented function `resize`, handling matrices, scalars, and strings.
- Functions `ones` and `zeros` now return an empty matrix instead of a
  number 1 or 0 when no arguments are provided.
- Implemented functions `min` and `max` for `Range` and `Index`.
- Resizing matrices now leaves new elements undefined by default instead of
  filling them with zeros. Function `resize` now has an extra optional
  parameter `defaultValue`.
- Range operator `:` in expression parser has been given a higher precedence.
- Functions don't allow arguments of unknown type anymore.
- Options be set when constructing a math.js instance or using the new function
  `config(options`. Options are no longer accessible via `math.options`.
- Renamed `scientific` notation to `exponential` in function `format`.
- Function `format` outputs exponential notation with positive exponents now
  always with `+` sign, so outputs `2.1e+3` instead of `2.1e3`.
- Fixed function `squeeze` not being able squeeze into a scalar.
- Some fixes and performance improvements in the `resize` and `subset`
  functions.
- Function `size` now adheres to the option `matrix.defaultType` for scalar
  input.
- Minor bug fixes.


## 2013-10-26, version 0.15.0

- Math.js must be instantiated now, static calls are no longer supported. Usage:
  - node.js: `var math = require('mathjs')();`
  - browser: `var math = mathjs();`
- Implemented support for multiplying vectors with matrices.
- Improved number formatting:
  - Function `format` now support various options: precision, different
    notations (`fixed`, `scientific`, `auto`), and more.
  - Numbers are no longer rounded to 5 digits by default when formatted.
  - Implemented a function `format` for `Matrix`, `Complex`, `Unit`, `Range`,
    and `Selector` to format using options.
  - Function `format` does only stringify values now, and has a new parameter
    `precision` to round to a specific number of digits.
  - Removed option `math.options.precision`,
    use `math.format(value [, precision])` instead.
  - Fixed formatting numbers as scientific notation in some cases returning
    a zero digit left from the decimal point. (like "0.33333e8" rather than
    "3.3333e7"). Thanks @husayt.
- Implemented a function `print` to interpolate values in a template string,
  this functionality was moved from the function `format`.
- Implemented statistics function `mean`. Thanks Guillermo Indalecio Fernandez
  (@guillermobox).
- Extended and changed `max` and `min` for multi dimensional matrices: they now
  return the maximum and minimum of the flattened array. An optional second
  argument `dim` allows to calculate the `max` or `min` for specified dimension.
- Renamed option `math.options.matrix.default` to
  `math.options.matrix.defaultType`.
- Removed support for comparing complex numbers in functions `smaller`,
  `smallereq`, `larger`, `largereq`. Complex numbers cannot be ordered.


## 2013-10-08, version 0.14.0

- Introduced an option `math.options.matrix.default` which can have values
  `matrix` (default) or `array`. This option is used by the functions `eye`,
  `ones`, `range`, and `zeros`, to determine the type of matrix output.
- Getting a subset of a matrix will automatically squeeze the resulting subset,
  setting a subset of a matrix will automatically unsqueeze the given subset.
- Removed concatenation of nested arrays in the expression parser.
  You can now input nested arrays like in JavaScript. Matrices can be
  concatenated using the function `concat`.
- The matrix syntax `[...]` in the expression parser now creates 1 dimensional
  matrices by default. `math.eval('[1,2,3,4]')` returns a matrix with
  size `[4]`, `math.eval('[1,2;3,4]')` returns a matrix with size `[2,2]`.
- Documentation is restructured and extended.
- Fixed non working operator `mod` (modulus operator).


## 2013-09-03, version 0.13.0

- Implemented support for booleans in all relevant functions.
- Implemented functions `map` and `forEach`. Thanks Sebastien Piquemal (@sebpic).
- All construction functions can be used to convert the type of variables,
  also element-wise for all elements in an Array or Matrix.
- Changed matrix indexes of the expression parser to one-based with the
  upper-bound included, similar to most math applications. Note that on a
  JavaScript level, math.js uses zero-based indexes with excluded upper-bound.
- Removed support for scalars in the function `subset`, it now only supports
  Array, Matrix, and String.
- Removed the functions `get` and `set` from a selector, they are a duplicate
  of the function `subset`.
- Replaced functions `get` and `set` of `Matrix` with a single function
  `subset`.
- Some moving around with code and namespaces:
  - Renamed namespace `math.expr` to `math.expression` (contains Scope, Parser,
    node objects).
  - Renamed namespace `math.docs` to `math.expression.docs`.
  - Moved `math.expr.Selector` to `math.chaining.Selector`.
- Fixed some edge cases in functions `lcm` and `xgcd`.


## 2013-08-22, version 0.12.1

- Fixed outdated version of README.md.
- Fixed a broken unit test.


## 2013-08-22, version 0.12.0

- Implemented functions `random([min, max])`, `randomInt([min, max])`,
  `pickRandom(array)`. Thanks Sebastien Piquemal (@sebpic).
- Implemented function `distribution(name)`, generating a distribution object
  with functions `random`, `randomInt`, `pickRandom` for different
  distributions. Currently supporting `uniform` and `normal`.
- Changed the behavior of `range` to exclude the upper bound, so `range(1, 4)`
  now returns `[1, 2, 3]` instead of `[1, 2, 3, 4]`.
- Changed the syntax of `range`, which is now `range(start, end [, step])`
  instead of `range(start, [step, ] end)`.
- Changed the behavior of `ones` and `zeros` to geometric dimensions, for
  example `ones(3)` returns a vector with length 3, filled with ones, and
  `ones(3,3)` returns a 2D array with size [3, 3].
- Changed the return type of `ones` and `zeros`: they now return an Array when
  arguments are Numbers or an Array, and returns a Matrix when the argument
  is a Matrix.
- Change matrix index notation in parser from round brackets to square brackets,
  for example `A[0, 0:3]`.
- Removed the feature introduced in v0.10.0 to automatically convert a complex
  value with an imaginary part equal to zero to a number.
- Fixed zeros being formatted as null. Thanks @TimKraft.


## 2013-07-23, version 0.11.1

- Fixed missing development dependency


## 2013-07-23, version 0.11.0

- Changed math.js from one-based to zero-based indexes.
  - Getting and setting matrix subset is now zero-based.
  - The dimension argument in function `concat` is now zero-based.
- Improvements in the string output of function help.
- Added constants `true` and `false`.
- Added constructor function `boolean`.
- Fixed function `select` not accepting `0` as input.
  Thanks Elijah Manor (@elijahmanor).
- Parser now supports multiple unary minus operators after each other.
- Fixed not accepting empty matrices like `[[], []]`.
- Some fixes in the end user documentation.


## 2013-07-08, version 0.10.0

- For complex calculations, all functions now automatically replace results
  having an imaginary part of zero with a Number. (`2i * 2i` now returns a
  Number `-4` instead of a Complex `-4 + 0i`).
- Implemented support for injecting custom node handlers in the parser. Can be
  used for example to implement a node handler for plotting a graph.
- Implemented end user documentation and a new `help` function.
- Functions `size` and `squeeze` now return a Matrix instead of an Array as
  output on Matrix input.
- Added a constant tau (2 * pi). Thanks Zak Zibrat (@palimpsests).
- Renamed function `unaryminus` to `unary`.
- Fixed a bug in determining node dependencies in function assignments.


## 2013-06-14, version 0.9.1

- Implemented element-wise functions and operators: `emultiply` (`x .* y`),
  `edivide` (`x ./ y`), `epow` (`x .^ y`).
- Added constants `Infinity` and `NaN`.
- Removed support for Workspace to keep the library focused on its core task.
- Fixed a bug in the Complex constructor, not accepting NaN values.
- Fixed division by zero in case of pure complex values.
- Fixed a bug in function multiply multiplying a pure complex value with
  Infinity.


## 2013-05-29, version 0.9.0

- Implemented function `math.parse(expr [,scope])`. Optional parameter scope can
  be a plain JavaScript Object containing variables.
- Extended function `math.expr(expr [, scope])` with an additional parameter
  `scope`, similar to `parse`. Example: `math.eval('x^a', {x:3, a:2});`.
- Implemented function `subset`, to get or set a subset from a matrix, string,
  or other data types.
- Implemented construction functions number and string (mainly useful inside
  the parser).
- Improved function `det`. Thanks Bryan Cuccioli (@bcuccioli).
- Moved the parse code from prototype math.expr.Parser to function math.parse,
  simplified Parser a little bit.
- Strongly simplified the code of Scope and Workspace.
- Fixed function mod for negative numerators, and added error messages in case
  of wrong input.


## 2013-05-18, version 0.8.2

- Extended the import function and some other minor improvements.
- Fixed a bug in merging one dimensional vectors into a matrix.
- Fixed a bug in function subtract, when subtracting a complex number from a
  real number.


## 2013-05-10, version 0.8.1

- Fixed an npm warning when installing mathjs globally.


## 2013-05-10, version 0.8.0

- Implemented a command line interface. When math.js is installed globally via
  npm, the application is available on your system as 'mathjs'.
- Implemented `end` keyword for index operator, and added support for implicit
  start and end (expressions like `a(2,:)` and `b(2:end,3:end-1)` are supported
  now).
- Function math.eval is more flexible now: it supports variables and multi-line
  expressions.
- Removed the read-only option from Parser and Scope.
- Fixed non-working unequal operator != in the parser.
- Fixed a bug in resizing matrices when replacing a subset.
- Fixed a bug in updating a subset of a non-existing variable.
- Minor bug fixes.


## 2013-05-04, version 0.7.2

- Fixed method unequal, which was checking for equality instead of inequality.
  Thanks @FJS2.


## 2013-04-27, version 0.7.1

- Improvements in the parser:
  - Added support for chained arguments.
  - Added support for chained variable assignments.
  - Added a function remove(name) to remove a variable from the parsers scope.
  - Renamed nodes for more consistency and to resolve naming conflicts.
  - Improved stringification of an expression tree.
  - Some simplifications in the code.
  - Minor bug fixes.
- Fixed a bug in the parser, returning NaN instead of throwing an error for a
  number with multiple decimal separators like `2.3.4`.
- Fixed a bug in Workspace.insertAfter.
- Fixed: math.js now works on IE 6-8 too.


## 2013-04-20, version 0.7.0

- Implemented method `math.eval`, which uses a readonly parser to evaluate
  expressions.
- Implemented method `xgcd` (extended eucledian algorithm). Thanks Bart Kiers
  (@bkiers).
- Improved math.format, which now rounds values to a maximum number of digits
  instead of decimals (default is 5 digits, for example `math.format(math.pi)`
  returns `3.1416`).
- Added examples.
- Changed methods square and cube to evaluate matrices element wise (consistent
  with all other methods).
- Changed second parameter of method import to an object with options.
- Fixed method math.typeof on IE.
- Minor bug fixes and improvements.


## 2013-04-13, version 0.6.0

- Implemented chained operations via method math.select(). For example
  `math.select(3).add(4).subtract(2).done()` will return `5`.
- Implemented methods gcd and lcm.
- Implemented method `Unit.in(unit)`, which creates a clone of the unit with a
  fixed representation. For example `math.unit('5.08 cm').in('inch')` will
  return a unit which string representation always is in inch, thus `2 inch`.
  `Unit.in(unit)` is the same as method `math.in(x, unit)`.
- Implemented `Unit.toNumber(unit)`, which returns the value of the unit when
  represented with given unit. For example
  `math.unit('5.08 cm').toNumber('inch')` returns the number `2`, as the
  representation of the unit in inches has 2 as value.
- Improved: method `math.in(x, unit)` now supports a string as second parameter,
  for example `math.in(math.unit('5.08 cm'), 'inch')`.
- Split the end user documentation of the parser functions from the source
  files.
- Removed function help and the built-in documentation from the core library.
- Fixed constant i being defined as -1i instead of 1i.
- Minor bug fixes.


## 2013-04-06, version 0.5.0

- Implemented data types Matrix and Range.
- Implemented matrix methods clone, concat, det, diag, eye, inv, ones, size,
  squeeze, transpose, zeros.
- Implemented range operator `:`, and transpose operator `'` in parser.
- Changed: created construction methods for easy object creation for all data
  types and for the parser. For example, a complex value is now created
  with `math.complex(2, 3)` instead of `new math.Complex(2, 3)`, and a parser
  is now created with `math.parser()` instead of `new math.parser.Parser()`.
- Changed: moved all data types under the namespace math.type, and moved the
  Parser, Workspace, etc. under the namespace math.expr.
- Changed: changed operator precedence of the power operator:
  - it is now right associative instead of left associative like most scripting
    languages. So `2^3^4` is now calculated as `2^(3^4)`.
  - it has now higher precedence than unary minus most languages, thus `-3^2` is
    now calculated as `-(3^2)`.
- Changed: renamed the parsers method 'put' into 'set'.
- Fixed: method 'in' did not check for units to have the same base.


## 2013-03-16, version 0.4.0

- Implemented Array support for all methods.
- Implemented Array support in the Parser.
- Implemented method format.
- Implemented parser for units, math.Unit.parse(str).
- Improved parser for complex values math.Complex.parse(str);
- Improved method help: it now evaluates the examples.
- Fixed: a scoping issue with the Parser when defining functions.
- Fixed: method 'typeof' was not working well with minified and mangled code.
- Fixed: errors in determining the best prefix for a unit.


## 2013-03-09, version 0.3.0

- Implemented Workspace
- Implemented methods cot, csc, sec.
- Implemented Array support for methods with one parameter.


## 2013-02-25, version 0.2.0

- Parser, Scope, and expression tree with Nodes implemented.
- Implemented method import which makes it easy to extend math.js.
- Implemented methods arg, conj, cube, equal, factorial, im, largereq,
  log(x, base), log10, mod, re, sign, smallereq, square, unequal.


## 2013-02-18, version 0.1.0

- Reached full compatibility with Javascripts built-in Math library.
- More functions implemented.
- Some bugfixes.


## 2013-02-16, version 0.0.2

- All constants of Math implemented, plus the imaginary unit i.
- Data types Complex and Unit implemented.
- First set of functions implemented.


## 2013-02-15, version 0.0.1

- First publish of the mathjs package. (package is still empty)
