---
layout: default
---

<h1 id="history">History <a href="#history" title="Permalink">#</a></h1>

<h1 id="20251003-1482">2025-10-03, 14.8.2 <a href="#20251003-1482" title="Permalink">#</a></h1>

- Fix: improve performance in functions like `map` when passing a unary 
  function (<a href="https://github.com/josdejong/mathjs/issues/3546">#3546</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix: improve the type definition of `abs(complex)` which returns a `number`
  (<a href="https://github.com/josdejong/mathjs/issues/3543">#3543</a>). Thanks <a href="https://github.com/joshkel">@joshkel</a>.
- Fix: add missing type definitions for `ctranspose` (<a href="https://github.com/josdejong/mathjs/issues/3545">#3545</a>). Thanks <a href="https://github.com/joshkel">@joshkel</a>.
- Fix: typos in code comments (<a href="https://github.com/josdejong/mathjs/issues/3544">#3544</a>). Thanks <a href="https://github.com/joshkel">@joshkel</a>.

<h1 id="20250926-1481">2025-09-26, 14.8.1 <a href="#20250926-1481" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/3538">#3538</a> `config` printing a warning when using `{ number: 'bigint' }` 
  (<a href="https://github.com/josdejong/mathjs/issues/3540">#3540</a>).

<h1 id="20250924-1480">2025-09-24, 14.8.0 <a href="#20250924-1480" title="Permalink">#</a></h1>

- Feat: <a href="https://github.com/josdejong/mathjs/issues/3353">#3353</a> support for the nullish coalescing operator `??` in the
  expression parser (<a href="https://github.com/josdejong/mathjs/issues/3497">#3497</a>). Thanks <a href="https://github.com/ikemHood">@ikemHood</a>.

<h1 id="20250905-1470">2025-09-05, 14.7.0 <a href="#20250905-1470" title="Permalink">#</a></h1>

- Feat: faster `DenseMatrix` symbol iterator (<a href="https://github.com/josdejong/mathjs/issues/3521">#3521</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: implement serialization support for `Parser`, fixing <a href="https://github.com/josdejong/mathjs/issues/3509">#3509</a> (<a href="https://github.com/josdejong/mathjs/issues/3525">#3525</a>).
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3519">#3519</a>, <a href="https://github.com/josdejong/mathjs/issues/3368">#3368</a> categories "Core functions" and "Construction functions"
  missing from the generated function overview.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3517">#3517</a> `printTransformDependencies` not exported in the type definitions.
- Fix: add missing type definition for function `diff` (<a href="https://github.com/josdejong/mathjs/issues/3520">#3520</a>). Thanks <a href="https://github.com/dodokw">@dodokw</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3396">#3396</a> improve documentation of function `range`.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3523">#3523</a> cleanup old polyfills from the browser bundle 
  by removing `core-js` (<a href="https://github.com/josdejong/mathjs/issues/3524">#3524</a>).

<h1 id="20250725-1460">2025-07-25, 14.6.0 <a href="#20250725-1460" title="Permalink">#</a></h1>

- Feat: new function `toBest(unit, unitList, offset)`, and corresponding
  method `unit.toBest(...)` (<a href="https://github.com/josdejong/mathjs/issues/3484">#3484</a>). Thanks <a href="https://github.com/Mundi93">@Mundi93</a>, <a href="https://github.com/EliaAlesiani">@EliaAlesiani</a>, and 
  <a href="https://github.com/HeavyRainLQ">@HeavyRainLQ</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3512">#3512</a> `sign` of zero not returning zero in case of a fraction (<a href="https://github.com/josdejong/mathjs/issues/3513">#3513</a>). 
  Thanks <a href="https://github.com/kyle-compute">@kyle-compute</a>.

<h1 id="20250702-1453">2025-07-02, 14.5.3 <a href="#20250702-1453" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/2199">#2199</a> parse non-breaking white space `&nbsp;` as white space 
  (<a href="https://github.com/josdejong/mathjs/issues/3487">#3487</a>). Thanks donmccurdy.
- Fix: refine the type definitions of `scope` (<a href="https://github.com/josdejong/mathjs/issues/3490">#3490</a>). Thanks <a href="https://github.com/JayChang4w">@JayChang4w</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3493">#3493</a> type definitions of `unit(number)` (<a href="https://github.com/josdejong/mathjs/issues/3495">#3495</a>). Thanks <a href="https://github.com/mrft">@mrft</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3494">#3494</a> type definitions not supporting `unit.to(unit)` (<a href="https://github.com/josdejong/mathjs/issues/3495">#3495</a>).
  Thanks <a href="https://github.com/mrft">@mrft</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3499">#3499</a> refine type definitions of `add` and `multiply` to not allow zero
  or one argument (<a href="https://github.com/josdejong/mathjs/issues/3495">#3495</a>). Thanks <a href="https://github.com/mrft">@mrft</a>.

<h1 id="20250530-1452">2025-05-30, 14.5.2 <a href="#20250530-1452" title="Permalink">#</a></h1>

- Fix: add embedded docs for the deprecated physical constant `coulomb`, 
  see <a href="https://github.com/josdejong/mathjs/issues/3472">#3472</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3469">#3469</a> add `ResultSet` interface and improve `isResultSet` typing 
  (<a href="https://github.com/josdejong/mathjs/issues/3481">#3481</a>). Thanks <a href="https://github.com/ranidam">@ranidam</a>.

<h1 id="20250528-1451">2025-05-28, 14.5.1 <a href="#20250528-1451" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/3482">#3482</a> mathjs throwing an error related to `BigInt`  when loading in
  specific environments.
- Fix: syntax section of function `numeric` (see <a href="https://github.com/josdejong/mathjs/issues/3448">#3448</a>).
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3472">#3472</a> rename physical constant `coulomb` to `coulombConstant`. The old
  name is still available for backward compatibility.
- Fix: support multiplication of arrays with units (<a href="https://github.com/josdejong/mathjs/issues/3456">#3456</a>). Thanks <a href="https://github.com/Delaney">@Delaney</a>.

<h1 id="20250521-1450">2025-05-21, 14.5.0 <a href="#20250521-1450" title="Permalink">#</a></h1>

- Feat: improve the performance of the `map` and `forEach` methods of 
  `DenseMatrix` (<a href="https://github.com/josdejong/mathjs/issues/3446">#3446</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: improve the performance of `subset` (<a href="https://github.com/josdejong/mathjs/issues/3467">#3467</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: define embedded docs for `compile`, `evaluate`, `parse`, and `parser`,
  and add tests for the examples in embedded docs (<a href="https://github.com/josdejong/mathjs/issues/3413">#3413</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3450">#3450</a> support multiplication of valueless units by arbitrary types
  (<a href="https://github.com/josdejong/mathjs/issues/3454">#3454</a>).
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3474">#3474</a> correctly parse `(lbf in)` (<a href="https://github.com/josdejong/mathjs/issues/3476">#3476</a>). Thanks <a href="https://github.com/costerwi">@costerwi</a>.

<h1 id="20250328-1440">2025-03-28, 14.4.0 <a href="#20250328-1440" title="Permalink">#</a></h1>

- Feat: improve the performance of function `flatten` (<a href="https://github.com/josdejong/mathjs/issues/3400">#3400</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: improve the performance of `map` and `forEach` (<a href="https://github.com/josdejong/mathjs/issues/3409">#3409</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: add LaTeX representation for fractions (<a href="https://github.com/josdejong/mathjs/issues/3434">#3434</a>, <a href="https://github.com/josdejong/mathjs/issues/3419">#3419</a>). Thanks <a href="https://github.com/orelbn">@orelbn</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3422">#3422</a> allow dot operators after symbol E (<a href="https://github.com/josdejong/mathjs/issues/3425">#3425</a>).
- Fix: issue in the `nthRoots` latex function template string (<a href="https://github.com/josdejong/mathjs/issues/3427">#3427</a>).
  Thanks <a href="https://github.com/aitee">@aitee</a>.
- Fix: upgrade to the latest version of `@babel/runtime`.

<h1 id="20250306-1431">2025-03-06, 14.3.1 <a href="#20250306-1431" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/3350">#3350</a> cannot import a constant that is a complex number.

<h1 id="20250228-1430">2025-02-28, 14.3.0 <a href="#20250228-1430" title="Permalink">#</a></h1>

- Feat: improved performance of function `flatten` (<a href="https://github.com/josdejong/mathjs/issues/3354">#3354</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: improved performance of `DenseMatrix` Symbol.iterator (<a href="https://github.com/josdejong/mathjs/issues/3395">#3395</a>). 
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: improved performance of functions `map` and `forEach` (<a href="https://github.com/josdejong/mathjs/issues/3399">#3399</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3390">#3390</a> issue in callback optimization and add error handling for invalid
  argument types (<a href="https://github.com/josdejong/mathjs/issues/3394">#3394</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3356">#3356</a> add missing eigsDependencies export to TypeScript definitions 
  (<a href="https://github.com/josdejong/mathjs/issues/3397">#3397</a>). Thanks <a href="https://github.com/porst17">@porst17</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3406">#3406</a> infer the correct type for multi-dimensional arrays in function 
  `multiply` (<a href="https://github.com/josdejong/mathjs/issues/3408">#3408</a>). Thanks <a href="https://github.com/orelbn">@orelbn</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3387">#3387</a> use utility `math.isNaN` for consistent `max` and `min` results 
  (<a href="https://github.com/josdejong/mathjs/issues/3389">#3389</a>). Thanks <a href="https://github.com/orelbn">@orelbn</a>.

<h1 id="20250205-1421">2025-02-05, 14.2.1 <a href="#20250205-1421" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/3377">#3377</a> remove redundant dependency `@lambdatest/node-tunnel`.

<h1 id="20250130-1420">2025-01-30, 14.2.0 <a href="#20250130-1420" title="Permalink">#</a></h1>

- Feat: <a href="https://github.com/josdejong/mathjs/issues/3041">#3041</a>, <a href="https://github.com/josdejong/mathjs/issues/3340">#3340</a> rename `apply` to `mapSlices` (<a href="https://github.com/josdejong/mathjs/issues/3357">#3357</a>). Function
  `apply` is still available but is now marked deprecated. Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3247">#3247</a> don't override type-native floor/ceil within tolerance of value 
  (<a href="https://github.com/josdejong/mathjs/issues/3369">#3369</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3360">#3360</a> add bigint support to matrix indices and ranges (<a href="https://github.com/josdejong/mathjs/issues/3361">#3361</a>).
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3115">#3115</a> type definitions for matrixFrom* (<a href="https://github.com/josdejong/mathjs/issues/3371">#3371</a>). Thanks <a href="https://github.com/Hudsxn">@Hudsxn</a> 
  and <a href="https://github.com/gwhitney">@gwhitney</a>.

<h1 id="20250124-1410">2025-01-24, 14.1.0 <a href="#20250124-1410" title="Permalink">#</a></h1>

- Feat: implement `bigint` support in functions `log`, `log2`, `log10`, 
  `larger`, `smaller`, `max`, `min` (<a href="https://github.com/josdejong/mathjs/issues/3345">#3345</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3342">#3342</a> hexadecimal input not turned into a `bigint` (<a href="https://github.com/josdejong/mathjs/issues/3348">#3348</a>).
- Fix `randomInt()` not working (<a href="https://github.com/josdejong/mathjs/issues/3345">#3345</a>).
- Docs: fixed description of `sign` in the embedded docs (<a href="https://github.com/josdejong/mathjs/issues/3338">#3338</a>). 
  Thanks <a href="https://github.com/witer33">@witer33</a>.

<h1 id="20241211-1401">2024-12-11, 14.0.1 <a href="#20241211-1401" title="Permalink">#</a></h1>

- Fix: make derivative much faster (<a href="https://github.com/josdejong/mathjs/issues/3322">#3322</a>). Thanks <a href="https://github.com/paulftw">@paulftw</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3317">#3317</a> export `Fraction` type from the `fraction.js` library instead of
  using a custom interface (<a href="https://github.com/josdejong/mathjs/issues/3330">#3330</a>). Thanks <a href="https://github.com/fchu">@fchu</a>.

<h1 id="20241120-1400">2024-11-20, 14.0.0 <a href="#20241120-1400" title="Permalink">#</a></h1>

!!! BE CAREFUL: BREAKING CHANGES !!!

- Feat: Upgrade to `fraction.js@5`, using `bigint` under the hood (<a href="https://github.com/josdejong/mathjs/issues/3283">#3283</a>).
- Feat: Implement support for `Unit` in functions `ceil`, `floor`, and `fix`.
  Possible breaking changes in the type definitions of arrays and matrices
  due to the introduction of generics (<a href="https://github.com/josdejong/mathjs/issues/3269">#3269</a>). Thanks <a href="https://github.com/orelbn">@orelbn</a>.
- Feat: Implement support for `log(x: Fraction, base: Fraction)`.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3301">#3301</a> precedence of `%` (mod) being higher than `*` and `/` (<a href="https://github.com/josdejong/mathjs/issues/3311">#3311</a>).
  Thanks <a href="https://github.com/nkumawat34">@nkumawat34</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3222">#3222</a> prevent `math.import(...)` from overriding units unless you 
  specify `{ override: true }` (<a href="https://github.com/josdejong/mathjs/issues/3225">#3225</a>).
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3219">#3219</a> let functions `dotDivide`, `dotPow`, `bitXor`, `xor`, `equal`,
  `larger`, `largerEq`, `smaller`, `smallerEq`, and `unequal` return a sparse 
  matrix when the input is two sparse matrices (<a href="https://github.com/josdejong/mathjs/issues/3307">#3307</a>). Thanks <a href="https://github.com/Aakash-Rana">@Aakash-Rana</a>.
- Fix: Improve type definitions of arrays (<a href="https://github.com/josdejong/mathjs/issues/3306">#3306</a>). Thanks <a href="https://github.com/orelbn">@orelbn</a>.

<h1 id="20241120-1323">2024-11-20, 13.2.3 <a href="#20241120-1323" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/3260">#3260</a> improve type definitions and documentation on the callback 
  indices of `map`, `filter`, and `forEach`.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3323">#3323</a> support functions in function `clone`.
- Docs: fix a broken link in the documentation (<a href="https://github.com/josdejong/mathjs/issues/3316">#3316</a>). 
  Thanks <a href="https://github.com/emmanuel-ferdman">@emmanuel-ferdman</a>.

<h1 id="20241113-1322">2024-11-13, 13.2.2 <a href="#20241113-1322" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/1455">#1455</a> implicit multiplication of a fraction with unit `in` is incorrect 
  (<a href="https://github.com/josdejong/mathjs/issues/3315">#3315</a>). Thanks <a href="https://github.com/nkumawat34">@nkumawat34</a>.

<h1 id="20241106-1321">2024-11-06, 13.2.1 <a href="#20241106-1321" title="Permalink">#</a></h1>

- Update to the latest version of `complex.js`.
- Fix `Index.dimension(dim)` accepting non-numeric input.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3290">#3290</a> should validate variables names in method `Parser.set` (<a href="https://github.com/josdejong/mathjs/issues/3308">#3308</a>).
  Thanks <a href="https://github.com/nkumawat34">@nkumawat34</a>.

<h1 id="20241002-1320">2024-10-02, 13.2.0 <a href="#20241002-1320" title="Permalink">#</a></h1>

- Feat: improve performance of functions `map`, `filter` and `forEach` (<a href="https://github.com/josdejong/mathjs/issues/3256">#3256</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: improve performance of the methods `map()` and `forEach()`
  of `DenseMatrix` (<a href="https://github.com/josdejong/mathjs/issues/3251">#3251</a>). Thanks <a href="https://github.com/Galm007">@Galm007</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3253">#3253</a> cannot use identifiers containing special characters in function
  `derivative`.
- Fix: improve the type definitions of `ConstantNode` to support all data 
  types (<a href="https://github.com/josdejong/mathjs/issues/3257">#3257</a>). Thanks <a href="https://github.com/smith120bh">@smith120bh</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3259">#3259</a> function `symbolicEqual` missing in the TypeScript definitions.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3246">#3246</a> function `leafCount` missing in the TypeScript definitions.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3267">#3267</a> implicit multiplication with a negative number and unit `in`.
- Docs: fix broken links on the Configuration page. Thanks <a href="https://github.com/vassudanagunta">@vassudanagunta</a>.
- Docs: document the syntax of `map` and `forEach` in the expression parser
  (<a href="https://github.com/josdejong/mathjs/issues/3272">#3272</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.

<h1 id="20240827-1311">2024-08-27, 13.1.1 <a href="#20240827-1311" title="Permalink">#</a></h1>

- Fix security vulnerability in the CLI and web API allowing to call functions
  `import`, `createUnit` and `reviver`, allowing to get access to the internal
  math namespace and allowing arbitrary code execution. Thanks <a href="https://github.com/StarlightPWN">@StarlightPWN</a>.
- Fix security vulnerability: when overwriting a `rawArgs` function with a 
  non-`rawArgs` function, it was still called with raw arguments. This was both
  a functional issue and a security issue. Thanks <a href="https://github.com/StarlightPWN">@StarlightPWN</a>.
- Fix security vulnerability: ensure that `ObjectWrappingMap` cannot delete
  unsafe properties. Thanks <a href="https://github.com/StarlightPWN">@StarlightPWN</a>.
- Fix: not being able to use methods and properties on arrays inside the
  expression parser.

<h1 id="20240826-1310">2024-08-26, 13.1.0 <a href="#20240826-1310" title="Permalink">#</a></h1>

- Feat: support multiple inputs in function `map` (<a href="https://github.com/josdejong/mathjs/issues/3228">#3228</a>, <a href="https://github.com/josdejong/mathjs/issues/3196">#3196</a>). 
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: add matrix datatypes in more cases (<a href="https://github.com/josdejong/mathjs/issues/3235">#3235</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: export util functions `isMap`, `isPartitionedMap`, and 
  `isObjectWrappingMap`.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3241">#3241</a> function `map` not always working with matrices (<a href="https://github.com/josdejong/mathjs/issues/3242">#3242</a>). 
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3244">#3244</a> fix broken link to `ResultSet` in the docs about classes.
- Docs: add a link to the documentation page about the syntax expression
  from the function `evaluate` (see <a href="https://github.com/josdejong/mathjs/issues/3238">#3238</a>).
- Docs: improve the documentation of `scope` and fix the example
  `custom_scope_objects.js` (<a href="https://github.com/josdejong/mathjs/issues/3150">#3150</a>)
- Docs: spelling fixes in the embedded docs (<a href="https://github.com/josdejong/mathjs/issues/3252">#3252</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.

<h1 id="20240719-1303">2024-07-19, 13.0.3 <a href="#20240719-1303" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/3232">#3232</a> fix type definitions of function `format` to support notations
  `hex`, `bin`, and `oct`.
- Fix: use more precise definitions for US liquid volume units (<a href="https://github.com/josdejong/mathjs/issues/3229">#3229</a>).
  Thanks <a href="https://github.com/Vistinum">@Vistinum</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/2286">#2286</a> types static methods and members for Unit class (<a href="https://github.com/josdejong/mathjs/issues/3230">#3230</a>).
  Thanks <a href="https://github.com/orelbn">@orelbn</a>.

<h1 id="20240704-1302">2024-07-04, 13.0.2 <a href="#20240704-1302" title="Permalink">#</a></h1>

- Fix an error in the type definitions of `quantileSeq` (<a href="https://github.com/josdejong/mathjs/issues/3223">#3223</a>).
  Thanks <a href="https://github.com/domdomegg">@domdomegg</a>.

<h1 id="20240628-1301">2024-06-28, 13.0.1 <a href="#20240628-1301" title="Permalink">#</a></h1>

- Fix: <a href="https://github.com/josdejong/mathjs/issues/3227">#3227</a> generated bundle containing `catch` blocks without parameters.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/2348">#2348</a> update type definitions of the `Parser` methods (<a href="https://github.com/josdejong/mathjs/issues/3226">#3226</a>).
  Thanks <a href="https://github.com/orelbn">@orelbn</a>.

<h1 id="20240531-1300">2024-05-31, 13.0.0 <a href="#20240531-1300" title="Permalink">#</a></h1>

Breaking changes:

- Change `isZero`, `isPositive`, and `isNegative` to respect `config.epsilon`
  (<a href="https://github.com/josdejong/mathjs/issues/3139">#3139</a>, <a href="https://github.com/josdejong/mathjs/issues/2838">#2838</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Change the behavior of the internal `nearlyEqual` to align with Python and
  Julia (<a href="https://github.com/josdejong/mathjs/issues/3152">#3152</a>, <a href="https://github.com/josdejong/mathjs/issues/2838">#2838</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Upgrade to `fraction.js@4.3.7`,
  see <https://github.com/rawify/Fraction.js/issues/68>.
- Dropped support for JavaScript engines that do not fully support ES6 or
  `bigint`, or are not actively maintained. ES2020 is now the minimum required
  EcmaScript version.

Non-breaking changes:

- Implemented support for `bigint` (<a href="https://github.com/josdejong/mathjs/issues/3207">#3207</a>, <a href="https://github.com/josdejong/mathjs/issues/3207">#3207</a>)
- Implemented a new config option `config.numberFallback` needed for `bigint`
  (<a href="https://github.com/josdejong/mathjs/issues/3207">#3207</a>).
- Internal: refactored tooling to ES modules and upgraded all devDependencies.

<h1 id="20240531-1243">2024-05-31, 12.4.3 <a href="#20240531-1243" title="Permalink">#</a></h1>

- Fix: serialization of Units without a value, see <a href="https://github.com/josdejong/mathjs/issues/1240">#1240</a>.
- Fix: outdated, incorrect documentation about the order of precedence for
  operator modulus `%`. See <a href="https://github.com/josdejong/mathjs/issues/3189">#3189</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3197">#3197</a> improve `quantileSeq` type definitions (<a href="https://github.com/josdejong/mathjs/issues/3198">#3198</a>). Thanks <a href="https://github.com/domdomegg">@domdomegg</a>.

<h1 id="20240424-1242">2024-04-24, 12.4.2 <a href="#20240424-1242" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/3192">#3192</a>: function `isNaN` returns `false` for `NaN` units in a matrix or
  array (<a href="https://github.com/josdejong/mathjs/issues/3193">#3193</a>). Thanks <a href="https://github.com/lgerin">@lgerin</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3180">#3180</a> fix type definitions of functions `add` and `multiply` to allow
  more than two arguments.
- Docs: correct the docs about `traverse` returning void (<a href="https://github.com/josdejong/mathjs/issues/3177">#3177</a>).
  Thanks <a href="https://github.com/rohildshah">@rohildshah</a>.

<h1 id="20240313-1241">2024-03-13, 12.4.1 <a href="#20240313-1241" title="Permalink">#</a></h1>

- Docs: implement an interactive version of the Lorenz example, and show the
  chart full screen (<a href="https://github.com/josdejong/mathjs/issues/3151">#3151</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/3172">#3172</a>: simplify `"true and true"`.
- Fix <a href="https://github.com/josdejong/mathjs/issues/3163">#3163</a>: `toTex` wrongly returning `Infinity` for large BigNumbers.
- Fix <a href="https://github.com/josdejong/mathjs/issues/3162">#3162</a>: add license information about CSParse (<a href="https://github.com/josdejong/mathjs/issues/3164">#3164</a>).
- Fix <a href="https://github.com/josdejong/mathjs/issues/3175">#3175</a>: cannot delete units using `math.Unit.deleteUnit`.
- Fix: faster startup time of the CLI and REPL by loading the bundle.
- Fix: remove using polyfill.io inside the example
  `pretty_printing_with_mathjax.html` (<a href="https://github.com/josdejong/mathjs/issues/3167">#3167</a>). Thanks <a href="https://github.com/SukkaW">@SukkaW</a>.

<h1 id="20240222-1240">2024-02-22, 12.4.0 <a href="#20240222-1240" title="Permalink">#</a></h1>

- Feat: implement support for trailing commas in matrices (<a href="https://github.com/josdejong/mathjs/issues/3154">#3154</a>, <a href="https://github.com/josdejong/mathjs/issues/2968">#2968</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Feat: improve the performance of `multiply` a lot by adding matrix type
  inferencing (<a href="https://github.com/josdejong/mathjs/issues/3149">#3149</a>). Thanks <a href="https://github.com/RandomGamingDev">@RandomGamingDev</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3100">#3100</a> function `round` not handling round-off errors (<a href="https://github.com/josdejong/mathjs/issues/3136">#3136</a>).
  Thanks <a href="https://github.com/BrianFugate">@BrianFugate</a>.
- Fix: `PartitionedMap` and `ObjectWrappingMap` missing a property
  `Symbol.iterator`, causing problems when trying `new Map(scope)` (<a href="https://github.com/josdejong/mathjs/issues/3156">#3156</a>).
- Fix: type definitions of function `mode` (<a href="https://github.com/josdejong/mathjs/issues/3153">#3153</a>). Thanks <a href="https://github.com/rich-martinez">@rich-martinez</a>.
- Docs: describe method `getAllAsMap` in the Parser docs (<a href="https://github.com/josdejong/mathjs/issues/3158">#3158</a>, <a href="https://github.com/josdejong/mathjs/issues/3157">#3157</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.

<h1 id="20240208-1232">2024-02-08, 12.3.2 <a href="#20240208-1232" title="Permalink">#</a></h1>

- Improved the performance of custom defined functions in the expression
  parser (<a href="https://github.com/josdejong/mathjs/issues/3150">#3150</a>).
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3143">#3143</a> cannot use `and` and `or` inside a function definition.
  Regression since `v12.1.0` (<a href="https://github.com/josdejong/mathjs/issues/3150">#3150</a>).

<h1 id="20240201-1231">2024-02-01, 12.3.1 <a href="#20240201-1231" title="Permalink">#</a></h1>

- Improved the typings of the arguments of `ArrayNode`, `FunctionNode`,
  `IndexNode`, `OperatorNode`, and `RelationalNode` (<a href="https://github.com/josdejong/mathjs/issues/3123">#3123</a>). Thanks <a href="https://github.com/sylee957">@sylee957</a>.
- Added a fully featured code editor example with CodeMirror and Katex (<a href="https://github.com/josdejong/mathjs/issues/3027">#3027</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3114">#3114</a> build warnings related to a number of wrong `/* #__PURE__ */`
  annotations.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3142">#3142</a> support BigNumber values for the options of function `format`:
  `precision`, `wordSize`, `lowerExp`, `upperExp`. Support BigNumber values
  for the option `wordSize` in the functions `hex`, `bin`, and `oct`.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3125">#3125</a> type definitions of function `hypot` (<a href="https://github.com/josdejong/mathjs/issues/3144">#3144</a>).
  Thanks <a href="https://github.com/silentmissile">@silentmissile</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3141">#3141</a> `help(config)` altering the actual `config` when evaluating the
  examples.
- Docs: <a href="https://github.com/josdejong/mathjs/issues/3145">#3145</a> fix documentation about REPL, it does require a build step
  nowadays.

<h1 id="20240112-1230">2024-01-12, 12.3.0 <a href="#20240112-1230" title="Permalink">#</a></h1>

- Implement support new metric prefixes: `ronna` (`R`), `quetta` (`Q`),
  `ronto` (`r`), and `quecto` (`q`) (<a href="https://github.com/josdejong/mathjs/issues/3113">#3113</a>, <a href="https://github.com/josdejong/mathjs/issues/3112">#3112</a>). Thanks <a href="https://github.com/AlexEdgcomb">@AlexEdgcomb</a>.
- Fix a bug converting a unitless unit (<a href="https://github.com/josdejong/mathjs/issues/3117">#3117</a>). Thanks <a href="https://github.com/costerwi">@costerwi</a>.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3097">#3097</a> `toSI()` wrongly converting `degC` (<a href="https://github.com/josdejong/mathjs/issues/3118">#3118</a>). Thanks <a href="https://github.com/costerwi">@costerwi</a>.

<h1 id="20231220-1221">2023-12-20, 12.2.1 <a href="#20231220-1221" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/3109">#3109</a>: method `Node.toHTML` not accepting a custom `handler`.

<h1 id="20231208-1220">2023-12-08, 12.2.0 <a href="#20231208-1220" title="Permalink">#</a></h1>

- Feat: lazy evaluation of operators `and`, `or`, `&`, `|` (<a href="https://github.com/josdejong/mathjs/issues/3090">#3090</a>, <a href="https://github.com/josdejong/mathjs/issues/3101">#3101</a>,
  <a href="https://github.com/josdejong/mathjs/issues/2766">#2766</a>). Thanks <a href="https://github.com/smith120bh">@smith120bh</a>.
- Fix: passing a 4th argument with a scope to raw functions.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3096">#3096</a> embedded docs of eigs throwing an error.

<h1 id="20231117-1210">2023-11-17, 12.1.0 <a href="#20231117-1210" title="Permalink">#</a></h1>

- Feat: Extend function `round` with support for units (<a href="https://github.com/josdejong/mathjs/issues/2761">#2761</a>, <a href="https://github.com/josdejong/mathjs/issues/3095">#3095</a>).
- Feat: Extend function `mod` with support for negative divisors in when
  using `BigNumber` or `Fraction` (<a href="https://github.com/josdejong/mathjs/issues/3087">#3087</a>).
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3092">#3092</a> a typo in an error message when converting a string into a number.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/3094">#3094</a> function `derivative` mutates the input expression when it fails.

<h1 id="20231026-1200">2023-10-26, 12.0.0 <a href="#20231026-1200" title="Permalink">#</a></h1>

Breaking changes:

- Fix <a href="https://github.com/josdejong/mathjs/issues/2879">#2879</a>, <a href="https://github.com/josdejong/mathjs/issues/2927">#2927</a>, <a href="https://github.com/josdejong/mathjs/issues/3014">#3014</a>: change the confusing interface of `eigs` (<a href="https://github.com/josdejong/mathjs/issues/3037">#3037</a>),
  thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
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
  module resolution (<a href="https://github.com/josdejong/mathjs/issues/3079">#3079</a>, <a href="https://github.com/josdejong/mathjs/issues/2919">#2919</a>).
  - Type `MathJsStatic` is renamed to `MathJsInstance`.
  - Type `FactoryDependencies` is deprecated, use `MathJsFactory` instead, and
    import dependency maps directly from the library.
- Change the assignment operator of `.toTex()` output from `:=` to `=` (see
  <a href="https://github.com/josdejong/mathjs/issues/2980">#2980</a>, <a href="https://github.com/josdejong/mathjs/issues/2987">#2987</a>).
- Drop official support for Node.js 14 and 16.

Features:

- Function `eigs` now has an option to turn off calculation of eigenvectors
  (<a href="https://github.com/josdejong/mathjs/issues/3057">#3057</a>, <a href="https://github.com/josdejong/mathjs/issues/2180">#2180</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.

Fixes:

- Find eigenvectors of defective matrices (<a href="https://github.com/josdejong/mathjs/issues/3037">#3037</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.

<h1 id="20231026-11120">2023-10-26, 11.12.0 <a href="#20231026-11120" title="Permalink">#</a></h1>

- Implemented function `subtractScalar` (<a href="https://github.com/josdejong/mathjs/issues/3081">#3081</a>, <a href="https://github.com/josdejong/mathjs/issues/2643">#2643</a>), thanks <a href="https://github.com/vrushaket">@vrushaket</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/3073">#3073</a>: function format not escaping control characters and double
  quotes (<a href="https://github.com/josdejong/mathjs/issues/3082">#3082</a>).
- Fix: function `clone` not throwing an error when passing an unsupported
  type like a function.
- Fix: <a href="https://github.com/josdejong/mathjs/issues/2960">#2960</a> add type definition of function `symbolicEqual` (<a href="https://github.com/josdejong/mathjs/issues/3035">#3035</a>),
  thanks <a href="https://github.com/juancodeaudio">@juancodeaudio</a>.

<h1 id="20231011-11112">2023-10-11, 11.11.2 <a href="#20231011-11112" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/3025">#3025</a>: improve handling of matrices and error handling
  in function `corr` (<a href="https://github.com/josdejong/mathjs/issues/3030">#3030</a>). Thanks <a href="https://github.com/vrushaket">@vrushaket</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/3074">#3074</a>: improve error message when using function `max` in `derivative`.
- Fix <a href="https://github.com/josdejong/mathjs/issues/3073">#3073</a>: fix parsing quotes inside a string.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2027">#2027</a>: cannot use named operators like `to` or `mod` as property name.

<h1 id="20230920-11111">2023-09-20, 11.11.1 <a href="#20230920-11111" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2989">#2989</a>: use one-based indices in `print` in the parser (<a href="https://github.com/josdejong/mathjs/issues/3009">#3009</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2936">#2936</a>: `mod` sometimes giving wrong results due to internal round-off
  errors (<a href="https://github.com/josdejong/mathjs/issues/3011">#3011</a>). Thanks <a href="https://github.com/praisennamonu1">@praisennamonu1</a>.
- Internal refactor of `quantileSeq`, and fixed the embedded help (<a href="https://github.com/josdejong/mathjs/issues/3003">#3003</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Updated dependencies and devDependencies.

<h1 id="20230905-11110">2023-09-05, 11.11.0 <a href="#20230905-11110" title="Permalink">#</a></h1>

- Implement function `corr` to calculate the correlation between two matrices
  (<a href="https://github.com/josdejong/mathjs/issues/3015">#3015</a>, <a href="https://github.com/josdejong/mathjs/issues/2624">#2624</a>). Thanks <a href="https://github.com/vrushaket">@vrushaket</a>.
- Lock `fraction.js` at version `4.3.4` for now, see <a href="https://github.com/josdejong/mathjs/issues/3024">#3024</a>, 3022,
  <https://github.com/rawify/Fraction.js/issues/68>.

<h1 id="20230831-11101">2023-08-31, 11.10.1 <a href="#20230831-11101" title="Permalink">#</a></h1>

- Upgrade to `fraction.js@4.3.4`, see <a href="https://github.com/josdejong/mathjs/issues/3022">#3022</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/3020">#3020</a>: `lruQueue` using the global `hasOwnProperty` which may be
  polluted.
- Add support for prefixes for the unit `erg`, and restrict prefixes of the
  unit `joule` to only long prefixes like `kilo` and no short prefixes
  like `k` (<a href="https://github.com/josdejong/mathjs/issues/3019">#3019</a>). Thanks <a href="https://github.com/costerwi">@costerwi</a>.
- Add a new browser example `examples/browser/lorenz.html` that uses `solveODE`
  and plots the result in a chart (<a href="https://github.com/josdejong/mathjs/issues/3018">#3018</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.

<h1 id="20230823-11100">2023-08-23, 11.10.0 <a href="#20230823-11100" title="Permalink">#</a></h1>

- Extend function `quantileSeq` with support for a `dimension` (<a href="https://github.com/josdejong/mathjs/issues/3002">#3002</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Implement <a href="https://github.com/josdejong/mathjs/issues/2735">#2735</a>: Support indexing with an array of booleans, for
  example `a[[true, false, true]]` and `a[a > 2]` (<a href="https://github.com/josdejong/mathjs/issues/2994">#2994</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Implement function `zeta` (<a href="https://github.com/josdejong/mathjs/issues/2950">#2950</a>, <a href="https://github.com/josdejong/mathjs/issues/2975">#2975</a>, <a href="https://github.com/josdejong/mathjs/issues/2904">#2904</a>). Thanks <a href="https://github.com/Bobingstern">@Bobingstern</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2990">#2990</a>: `DenseMatrix` can mutate input arrays (<a href="https://github.com/josdejong/mathjs/issues/2991">#2991</a>).

<h1 id="20230724-1191">2023-07-24, 11.9.1 <a href="#20230724-1191" title="Permalink">#</a></h1>

- Fix a security vulnerability in `FunctionNode` and `SymbolNode` allowing
  arbitrary code execution via `math.evaluate`. Thanks Harry Chen.
- Fix <a href="https://github.com/josdejong/mathjs/issues/3001">#3001</a>: mathjs bundle containing `new Function(...)` (CSP issue).

<h1 id="20230719-1190">2023-07-19, 11.9.0 <a href="#20230719-1190" title="Permalink">#</a></h1>

- Implement function `solveODE` (<a href="https://github.com/josdejong/mathjs/issues/2958">#2958</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Implement functions `zpk2tf` and `freqz` (<a href="https://github.com/josdejong/mathjs/issues/2988">#2988</a>, <a href="https://github.com/josdejong/mathjs/issues/2969">#2969</a>). Thanks <a href="https://github.com/alykhaled">@alykhaled</a>.
- Implement support for units in function `range` (<a href="https://github.com/josdejong/mathjs/issues/2997">#2997</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2974">#2974</a>: `simplify` puts plus and minus signs next to each other (<a href="https://github.com/josdejong/mathjs/issues/2981">#2981</a>).
  Thanks <a href="https://github.com/MaybePixem">@MaybePixem</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2973">#2973</a>: fixes and improvements in the embedded docs (<a href="https://github.com/josdejong/mathjs/issues/2976">#2976</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2996">#2996</a>: two errors in the examples in the documentation about Expression
  trees.
- Fix round-off errors near zero when converting temperatures (<a href="https://github.com/josdejong/mathjs/issues/2962">#2962</a>).
  Thanks <a href="https://github.com/costerwi">@costerwi</a>.
- Refactored function `range`, reducing the amount of code (<a href="https://github.com/josdejong/mathjs/issues/2995">#2995</a>).
  Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.

<h1 id="20230620-1182">2023-06-20, 11.8.2 <a href="#20230620-1182" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2971">#2971</a>: improve typings of statistics functions `min`, `max`, `mean`,
  `median`, `mode`, `std`, `sum`, `prod`, `variance`. Fixes a regression
  introduced in v11.8.1.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2972">#2972</a>: type definitions of `Unit.divide(Unit)` have a wrong return type.

<h1 id="20230613-1181">2023-06-13, 11.8.1 <a href="#20230613-1181" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2964">#2964</a>: issue in function `distance` when calculate the distance from
  a point to a line (<a href="https://github.com/josdejong/mathjs/issues/2965">#2965</a>). Thanks <a href="https://github.com/Kiku-CN">@Kiku-CN</a>.
- Fix `math.format` not working correctly for `engineering` notation when using
  BigNumbers and for `fixed` notation with `precision: 0` configured (<a href="https://github.com/josdejong/mathjs/issues/2956">#2956</a>).
  Thanks <a href="https://github.com/mgreminger">@mgreminger</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2880">#2880</a>: not possible to map cube root `cbrt`.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2938">#2938</a>: make the syntax description of all functions consistent in the
  docs (<a href="https://github.com/josdejong/mathjs/issues/2941">#2941</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2954">#2954</a>: improve the TypeScript definitions the return type of functions
  `min` and `max` (<a href="https://github.com/josdejong/mathjs/issues/2955">#2955</a>). Thanks <a href="https://github.com/Maxim-Mazurok">@Maxim-Mazurok</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2959">#2959</a>: typo in an example in the docs. Thanks <a href="https://github.com/kunalagrwl">@kunalagrwl</a>.
- Drop official support for Node.js 14, has reached end of life.

<h1 id="20230403-1180">2023-04-03, 11.8.0 <a href="#20230403-1180" title="Permalink">#</a></h1>

- Extended functions `fraction`, `bignumber`, and `number` with support for
  units, see <a href="https://github.com/josdejong/mathjs/issues/2918">#2918</a> (<a href="https://github.com/josdejong/mathjs/issues/2926">#2926</a>).
- Implemented aliases `amp` and `amps` for unit `ampere` (<a href="https://github.com/josdejong/mathjs/issues/2917">#2917</a>).
  Thanks <a href="https://github.com/veggiesaurus">@veggiesaurus</a>.
- Improve TypeScript definitions of function `gcd` (<a href="https://github.com/josdejong/mathjs/issues/2922">#2922</a>). Thanks <a href="https://github.com/brunoSnoww">@brunoSnoww</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2923">#2923</a>: improve docs of the function `distance` (<a href="https://github.com/josdejong/mathjs/issues/2924">#2924</a>). Thanks <a href="https://github.com/tmtron">@tmtron</a>.

<h1 id="20230315-1170">2023-03-15, 11.7.0 <a href="#20230315-1170" title="Permalink">#</a></h1>

- Implement <a href="https://github.com/josdejong/mathjs/issues/2567">#2567</a>: accept array as parameter for function `gcd` (<a href="https://github.com/josdejong/mathjs/issues/2878">#2878</a>).
  Thanks <a href="https://github.com/jakubriegel">@jakubriegel</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2908">#2908</a>: improvements in the docs and examples of functions
  `partitionSelect`, `diff`, `expm1`, `round`, `nthRoots`, `sign`,
  `rigthArithShift`, `setIsSubset`, `setSize`, and the docs about units.
  Thanks <a href="https://github.com/tmtron">@tmtron</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2907">#2907</a>: determinant of empty matrix should be 1.
- Refactor index.d.ts by writing function declarations using a generic,
  reducing a lot of repetition (<a href="https://github.com/josdejong/mathjs/issues/2913">#2913</a>). Thanks <a href="https://github.com/brunoSnoww">@brunoSnoww</a>.

<h1 id="20230224-1160">2023-02-24, 11.6.0 <a href="#20230224-1160" title="Permalink">#</a></h1>

- Implement broadcasting for the following functions and their corresponding
  operator: `add`, `dotDivide`, `dotMultiply`, `dotPow`, `gcd`, `lcm`, `mod`,
  `nthRoot`, `subtract`, `bitAnd`, `bitOr`, `bitXor`, `leftShift`,
  `rightArithShift`, `rightLogShift`, `and`, `or`, `xor`, `compare`,
  `compareText`, `equal`, `larger`, `largerEq`, `smaller`, `smallerEq`,
  `unequal`, `atan2` and `to` (<a href="https://github.com/josdejong/mathjs/issues/2895">#2895</a>, <a href="https://github.com/josdejong/mathjs/issues/2753">#2753</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Implement support for non-power-of-2 fft (<a href="https://github.com/josdejong/mathjs/issues/2900">#2900</a>, <a href="https://github.com/josdejong/mathjs/issues/2577">#2577</a>). Thanks <a href="https://github.com/cyavictor88">@cyavictor88</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2888">#2888</a>: update type definitions of function `unit` to allow creating a
  unit from a fraction or complex number.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2892">#2892</a>: an error in the examples of the embedded help of function `sort`.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2891">#2891</a>: functions `column` and `row` sometimes returning a scalar number.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2896">#2896</a>: define the fourth argument of function `intersect` as optional
  in the TypeScript definitions. Thanks <a href="https://github.com/wodndb">@wodndb</a>.
- Fix: quantileSeq not accepting a matrix as second argument `prob` (see <a href="https://github.com/josdejong/mathjs/issues/2902">#2902</a>).
- Fix broken examples in functions `to`, `distance`, `getMatrixDataType`,
  `subset`, and `max` (see <a href="https://github.com/josdejong/mathjs/issues/2902">#2902</a>).

<h1 id="20230131-1151">2023-01-31, 11.5.1 <a href="#20230131-1151" title="Permalink">#</a></h1>

- Add type definitions for function `rotationMatrix` (<a href="https://github.com/josdejong/mathjs/issues/2860">#2860</a>).
  Thanks <a href="https://github.com/brunoSnoww">@brunoSnoww</a>.
- Add type signature for `lusolve(LUDecomposition, ...)` (<a href="https://github.com/josdejong/mathjs/issues/2864">#2864</a>).
  Thanks <a href="https://github.com/evanmiller">@evanmiller</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2873">#2873</a>: the rocket_trajectory_optimization.html example being partly
  broken. Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2871">#2871</a>: coverage report broken (<a href="https://github.com/josdejong/mathjs/issues/2877">#2877</a>). Thanks <a href="https://github.com/bornova">@bornova</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2883">#2883</a>: update documentation for stat functions, describe missing syntax.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2884">#2884</a>: fix examples in the embedded docs of function `pow` and some other
  functions.
- Fix type definition of function `complex` for one numeric input (<a href="https://github.com/josdejong/mathjs/issues/2886">#2886</a>),
  thanks <a href="https://github.com/ariymarkowitz">@ariymarkowitz</a>.
- Fix type definitions of `map()` and `forEach()` (<a href="https://github.com/josdejong/mathjs/issues/2887">#2887</a>), thanks <a href="https://github.com/xiaohk">@xiaohk</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2606">#2606</a>: improve type definitions of `dotMultiply`, `dotPow` and
  `dotDivide` (<a href="https://github.com/josdejong/mathjs/issues/2890">#2890</a>). Thanks <a href="https://github.com/brunoSnoww">@brunoSnoww</a>.

<h1 id="20221205-1150">2022-12-05, 11.5.0 <a href="#20221205-1150" title="Permalink">#</a></h1>

- Improve `simplify` rule matches in non-commutative contexts (<a href="https://github.com/josdejong/mathjs/issues/2841">#2841</a>).
  Thanks <a href="https://github.com/samueltlg">@samueltlg</a>.
- Simplify: add rules and restructure tests for non-commutative contexts
  (<a href="https://github.com/josdejong/mathjs/issues/2847">#2847</a>). Thanks <a href="https://github.com/samueltlg">@samueltlg</a>.
- Fix function `reshape` mutating the input in case of a matrix (see <a href="https://github.com/josdejong/mathjs/issues/2854">#2854</a>).
- Fix TypeScript types for `multiply()` with `number[]` and `number[][]`
  (<a href="https://github.com/josdejong/mathjs/issues/2852">#2852</a>). Thanks <a href="https://github.com/hfhchan">@hfhchan</a>.

<h1 id="20221118-1140">2022-11-18, 11.4.0 <a href="#20221118-1140" title="Permalink">#</a></h1>

- Implemented more wildcards to describe rules for `simplify`, making it easier
  for example to describe unary minus (<a href="https://github.com/josdejong/mathjs/issues/1915">#1915</a>). Thanks <a href="https://github.com/thatcomputerguy0101">@thatcomputerguy0101</a>.
- Implemented functions `schur`, `sylvester`, and `lyap` (<a href="https://github.com/josdejong/mathjs/issues/2646">#2646</a>).
  Thanks <a href="https://github.com/egidioln">@egidioln</a>.
- Implemented function `polynomialRoot`, and use it in a benchmark (<a href="https://github.com/josdejong/mathjs/issues/2839">#2839</a>).
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2825">#2825</a> partly: improve simplifying operations on constants in
  non-commutative contexts (<a href="https://github.com/josdejong/mathjs/issues/2827">#2827</a>). Thanks <a href="https://github.com/samueltlg">@samueltlg</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2840">#2840</a>: a bug in the docs and type definitions of `Node.traverse` and
  `Node.forEach`, they do return `void`.

<h1 id="20221107-1133">2022-11-07, 11.3.3 <a href="#20221107-1133" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2830">#2830</a>: Prevent inserting zero values when creating a `SparseMatrix` from a
  `DenseMatrix` (<a href="https://github.com/josdejong/mathjs/issues/2836">#2836</a>). Thanks <a href="https://github.com/AlexandreAlvesDB">@AlexandreAlvesDB</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2835">#2835</a>: a regression in the type definitions of `FunctionNode`, introduced
  in `v11.3.2`. See <a href="https://github.com/josdejong/mathjs/issues/2733">#2733</a>. Thanks <a href="https://github.com/dsteve">@dsteve</a>.

<h1 id="20221025-1132">2022-10-25, 11.3.2 <a href="#20221025-1132" title="Permalink">#</a></h1>

- Add generics to remaining Node type definitions (<a href="https://github.com/josdejong/mathjs/issues/2733">#2733</a>). Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Allow unit prefixes for (absolute) temperatures `kelvin`, `rankine`,
  `celsius`, and `fahrenheit` (<a href="https://github.com/josdejong/mathjs/issues/2824">#2824</a>). Thanks <a href="https://github.com/jfeist">@jfeist</a>

<h1 id="20221019-1131">2022-10-19, 11.3.1 <a href="#20221019-1131" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2809">#2809</a>: code completion issues in some IDE's (<a href="https://github.com/josdejong/mathjs/issues/2812">#2812</a>).
- Fix <a href="https://github.com/josdejong/mathjs/issues/2818">#2818</a>: throw an error when a function assignment has duplicate
  parameter names (<a href="https://github.com/josdejong/mathjs/issues/2819">#2819</a>).
- Update `decimal.js` to version `10.4.2`.

<h1 id="20221011-1130">2022-10-11, 11.3.0 <a href="#20221011-1130" title="Permalink">#</a></h1>

- Allow creating new subclasses of `Node` in TypeScript (<a href="https://github.com/josdejong/mathjs/issues/2772">#2772</a>).
  Note that this disables being able to narrow MathNodes by using the `.type`
  property. Use typeguards like `isOperatorNode(...)` instead (see <a href="https://github.com/josdejong/mathjs/issues/2810">#2810</a>).
  Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2793">#2793</a>: `flatten()` cloning entries of array/Matrix (<a href="https://github.com/josdejong/mathjs/issues/2799">#2799</a>).
- Fix <a href="https://github.com/josdejong/mathjs/issues/2627">#2627</a>: TypeScript definitions of `pinv` missing (<a href="https://github.com/josdejong/mathjs/issues/2804">#2804</a>).
  Thanks <a href="https://github.com/HanchaiN">@HanchaiN</a>.
- Update dependencies to `decimal.js@10.4.1`.

<h1 id="20220913-1121">2022-09-13, 11.2.1 <a href="#20220913-1121" title="Permalink">#</a></h1>

- Fix doc generator being broken, not generating a function reference.

<h1 id="20220912-1120">2022-09-12, 11.2.0 <a href="#20220912-1120" title="Permalink">#</a></h1>

- Implement function `isRelationalNode` (<a href="https://github.com/josdejong/mathjs/issues/2731">#2731</a>). Thanks <a href="https://github.com/isaacbyr">@isaacbyr</a>.
- Added missing types `'largerEq'` and `'or'` in `OperatorNodeMap` in the
  TypeScript definitions. Thanks <a href="https://github.com/ajinkyac03">@ajinkyac03</a>.
- Fixed typos in min func type defs (<a href="https://github.com/josdejong/mathjs/issues/2768">#2768</a>). Thanks <a href="https://github.com/mabdullahadeel">@mabdullahadeel</a>.
- Improved the TypeScript definitions for `pickRandom`. Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Fixed documentation of unit `min` which means `minutes`, not `minim` (<a href="https://github.com/josdejong/mathjs/issues/2773">#2773</a>).
  Thanks <a href="https://github.com/jasonhornsby">@jasonhornsby</a>.

<h1 id="20220823-1110">2022-08-23, 11.1.0 <a href="#20220823-1110" title="Permalink">#</a></h1>

- Add Unit constructor from value and pure (valueless) Unit (<a href="https://github.com/josdejong/mathjs/issues/2628">#2628</a>).
  Thanks <a href="https://github.com/costerwi">@costerwi</a>
- Fix <a href="https://github.com/josdejong/mathjs/issues/2144">#2144</a>: `examples/advanced/custom_loading.js` was broken.
- Fix JSON `replacer` function missing in the TypeScript definitions.
  Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Update dependencies to `typed-function@4.1.0` and `decimal.js@10.4.0`.

<h1 id="20220725-version-1101">2022-07-25, version 11.0.1 <a href="#20220725-version-1101" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2632">#2632</a>: TypeScript issue of `simplifyConstant` and `simplifyCore`
  not having a return type defined.

<h1 id="20220723-version-1100">2022-07-23, version 11.0.0 <a href="#20220723-version-1100" title="Permalink">#</a></h1>

!!! BE CAREFUL: BREAKING CHANGES !!!

Breaking changes:

- Dropped official support for IE11.
- Upgraded to `typed-function@3`, see [josdejong/typed-function/HISTORY.md](https://github.com/josdejong/typed-function/blob/develop/HISTORY.md#2022-05-12-version-300). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>. Most importantly:
  - Conversions now have preference over `any`.
  - The `this` variable is no longer bound to the typed function itself.
  - The properties `typed.types`, `typed.conversions`, and `typed.ignore`
      have been removed.
  - There are new static functions available like `typed.referTo`,
      `typed.referToSelf`, `typed.addTypes`, `typed.addConversions`.
- Implement amended "Rule 2" for implicit multiplication (<a href="https://github.com/josdejong/mathjs/issues/2370">#2370</a>, <a href="https://github.com/josdejong/mathjs/issues/2460">#2460</a>):
  when having a division followed by an implicit multiplication, the division
  gets higher precedence over the implicit multiplication when (a) the
  numerator is a constant with optionally a prefix operator (`-`, `+`, `~`),
  and (b) the denominator is a constant. For example: formerly `-1 / 2 x` was
  interpreted as `-1 / (2 * x)` and now it is interpreted as `(-1 / 2) * x`.
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Drop elementwise matrix support for trigonometric functions, exp, log, gamma,
  square, sqrt, cube, and cbrt to prevent confusion with standard matrix
  functions (<a href="https://github.com/josdejong/mathjs/issues/2440">#2440</a>, <a href="https://github.com/josdejong/mathjs/issues/2465">#2465</a>). Instead, use `math.map(matrix, fn)`.
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Simplify: convert equivalent function calls into operators, for example,
  `add(2, x)` will now be simplified into `2 + x` (<a href="https://github.com/josdejong/mathjs/issues/2415">#2415</a>, <a href="https://github.com/josdejong/mathjs/issues/2466">#2466</a>).
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Removed the automatic conversion from `number` to `string` (<a href="https://github.com/josdejong/mathjs/issues/2482">#2482</a>).
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2412">#2412</a>: let function `diff` return an empty matrix when the input contains
  only one element (<a href="https://github.com/josdejong/mathjs/issues/2422">#2422</a>).
- Internal refactoring in the `simplifyCore` logic (<a href="https://github.com/josdejong/mathjs/issues/2490">#2490</a>, <a href="https://github.com/josdejong/mathjs/issues/2484">#2484</a>, <a href="https://github.com/josdejong/mathjs/issues/2459">#2459</a>).
  The function `simplifyCore` will no longer (partially) merge constants, that
  behavior has been moved to `simplifyConstant`. The combination of
  `simplifyConstant` and `simplifyCore` is still close to the old behavior
  of `simplifyCore`, but there are some differences. To reproduce the same
  behavior as the old `simplifyCore`, you can use
  `math.simplify(expr, [math.simplifyCore, math.simplifyConstant])`.
  Thanks to the refactoring, `simplify` is more thorough in reducing constants.
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Disable support for splitting rest parameters in chained calculations
  (<a href="https://github.com/josdejong/mathjs/issues/2485">#2485</a>, <a href="https://github.com/josdejong/mathjs/issues/2474">#2474</a>). For example: `math.chain(3).max(4, 2).done()` will now throw
  an error rather than return `4`, because the rest parameter of
  `math.max(...number)` has been split between the contents of the chain and
  the arguments to the max call. Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Function `typeOf` now returns `function` (lowercase) for a function instead
  of `Function` (<a href="https://github.com/josdejong/mathjs/issues/2560">#2560</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.

Non-breaking changes:

- Fix <a href="https://github.com/josdejong/mathjs/issues/2600">#2600</a>: improve the TypeScript definitions of `simplify`.
  Thanks <a href="https://github.com/laureen-m">@laureen-m</a> and <a href="https://github.com/mattvague">@mattvague</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2607">#2607</a>: improve type definition of `createUnit`. Thanks <a href="https://github.com/egziko">@egziko</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2608">#2608</a>: clarify the docs on the need to configure a smaller `epsilon`
  when using BigNumbers.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2613">#2613</a>: describe matrix methods `get` and `set` in the docs.
- Fix link to `math.rationalize` in the docs (<a href="https://github.com/josdejong/mathjs/issues/2616">#2616</a>). Thanks <a href="https://github.com/nukisman">@nukisman</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2621">#2621</a>: add TypeScript definitions for `count` (<a href="https://github.com/josdejong/mathjs/issues/2622">#2622</a>). Thanks <a href="https://github.com/Hansuku">@Hansuku</a>.
- Improved TypeScript definitions of `multiply` (<a href="https://github.com/josdejong/mathjs/issues/2623">#2623</a>). Thanks <a href="https://github.com/Windrill">@Windrill</a>.

<h1 id="20220628-version-1064">2022-06-28, version 10.6.4 <a href="#20220628-version-1064" title="Permalink">#</a></h1>

- Improve TypeScript definitions of the `factory` function, thanks <a href="https://github.com/mattvague">@mattvague</a>.

<h1 id="20220624-version-1063">2022-06-24, version 10.6.3 <a href="#20220624-version-1063" title="Permalink">#</a></h1>

- Revert the TypeScript definition fixes for `factory` applied in `v10.6.2`,
  they give some complications.

<h1 id="20220624-version-1062">2022-06-24, version 10.6.2 <a href="#20220624-version-1062" title="Permalink">#</a></h1>

- Improve TypeScript definitions of `ParenthesisNode`. Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Change the TypeScript definition of `MathNodeCommon['type']` into a less
  strict string, so it is possible to extend with new Node classes.
  Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Improve TypeScript definitions of the `factory` function, thanks <a href="https://github.com/mattvague">@mattvague</a>.

<h1 id="20220531-version-1061">2022-05-31, version 10.6.1 <a href="#20220531-version-1061" title="Permalink">#</a></h1>

- Improve the  TypeScript types For `OperatorNode`: you can now define generic
  types like `OperatorNode<'+', 'add'>`. Thanks <a href="https://github.com/mattvague">@mattvague</a>.

<h1 id="20220524-version-1060">2022-05-24, version 10.6.0 <a href="#20220524-version-1060" title="Permalink">#</a></h1>

- Implementation of Fourier transform functions `fft` and `ifft` (<a href="https://github.com/josdejong/mathjs/issues/2540">#2540</a>).
  Thanks <a href="https://github.com/HanchaiN">@HanchaiN</a>.
- Fix TypeScript types not being listed in the exported fields (<a href="https://github.com/josdejong/mathjs/issues/2569">#2569</a>).
  Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Large improvements in TypeScript definitions for chained expressions (<a href="https://github.com/josdejong/mathjs/issues/2537">#2537</a>).
  Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2571">#2571</a>: improve TypeScript definition of functions `clone` and `cloneDeep`
  (<a href="https://github.com/josdejong/mathjs/issues/2572">#2572</a>). Thanks <a href="https://github.com/mattvague">@mattvague</a>.
- Fix the first argument of `derivative` holding the expression not correctly
  being converted when using `.toTex()` (<a href="https://github.com/josdejong/mathjs/issues/2564">#2564</a>). Thanks <a href="https://github.com/mattvague">@mattvague</a>.

<h1 id="20220511-version-1053">2022-05-11, version 10.5.3 <a href="#20220511-version-1053" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2337">#2337</a>: npm package containing examples and docs to solve security
  vulnerabilities being reported on the examples and their dependencies.
- Fix core, construction, and some other functions missing in docs.
- Drop official support for Node.js 12 which has reached its end of life.

<h1 id="20220509-version-1052">2022-05-09, version 10.5.2 <a href="#20220509-version-1052" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2553">#2553</a>: `@types/mocha` defined in `dependencies` instead of
  `devDependencies`, causing problems in projects that use a different version
  of this dependency. Thanks <a href="https://github.com/Kolahzary">@Kolahzary</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2550">#2550</a>: remove `examples/node_modules` folder from the npm package.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2528">#2528</a>: improve contribution guidelines (<a href="https://github.com/josdejong/mathjs/issues/2548">#2548</a>).
- Document `SymbolNode.onUndefinedSymbol` and
  `FunctionNode.onUndefinedFunction`.

<h1 id="20220502-version-1051">2022-05-02, version 10.5.1 <a href="#20220502-version-1051" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2526">#2526</a>, <a href="https://github.com/josdejong/mathjs/issues/2529">#2529</a>: improve TypeScript definitions of function `round`, `fix`,
  `floor`, `ceil`, and `nthRoot`, and improved the number only implementations
  of those functions  (<a href="https://github.com/josdejong/mathjs/issues/2531">#2531</a>, <a href="https://github.com/josdejong/mathjs/issues/2539">#2539</a>). Thanks <a href="https://github.com/simlaticak">@simlaticak</a> and <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2532">#2532</a>: matrix index symbol `end` not working when used inside
  a sub-expression.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2524">#2524</a>: In generating AUTHORS list, ignore a list of specific commits
  (e.g., to avoid spurious duplicates in list). (<a href="https://github.com/josdejong/mathjs/issues/2543">#2543</a>)
- Add type definitions of function `resolve` (<a href="https://github.com/josdejong/mathjs/issues/2536">#2536</a>). Thanks <a href="https://github.com/mattvague">@mattvague</a>.

<h1 id="20220419-version-1050">2022-04-19, version 10.5.0 <a href="#20220419-version-1050" title="Permalink">#</a></h1>

- Implement <a href="https://github.com/josdejong/mathjs/issues/1563">#1563</a>: function `pinv`, Moore–Penrose inverse (<a href="https://github.com/josdejong/mathjs/issues/2521">#2521</a>).
  Thanks <a href="https://github.com/HanchaiN">@HanchaiN</a>.
- Optimize function `det` for integers by switching to the Bareiss algorithm:
  no more round-off errors for integer input (<a href="https://github.com/josdejong/mathjs/issues/2516">#2516</a>). Thanks <a href="https://github.com/HanchaiN">@HanchaiN</a>.
- Implement <a href="https://github.com/josdejong/mathjs/issues/2463">#2463</a>: allow negative integer powers of invertible square matrices
  (<a href="https://github.com/josdejong/mathjs/issues/2517">#2517</a>). Thanks <a href="https://github.com/HanchaiN">@HanchaiN</a>.
- Implement the `lgamma` function (defined as log(gamma(z))) for number and
  Complex types. Supersedes <a href="https://github.com/josdejong/mathjs/issues/320">#320</a>. (<a href="https://github.com/josdejong/mathjs/issues/2417">#2417</a>). Thanks <a href="https://github.com/yifanwww">@yifanwww</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2523">#2523</a>: update to the latest complex.js to improve `sin(z)` for small
  `im(z)` (<a href="https://github.com/josdejong/mathjs/issues/2525">#2525</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2526">#2526</a>: update TypeScript definition of `ceil` (<a href="https://github.com/josdejong/mathjs/issues/2531">#2531</a>). Thanks <a href="https://github.com/simlaticak">@simlaticak</a>
- Change mocha reporter to 'dot' to avoid excessively long log files. (<a href="https://github.com/josdejong/mathjs/issues/2520">#2520</a>)

<h1 id="20220408-version-1043">2022-04-08, version 10.4.3 <a href="#20220408-version-1043" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2508">#2508</a>: improve the precision of stirlingS2 (<a href="https://github.com/josdejong/mathjs/issues/2509">#2509</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2514">#2514</a>: implement optional argument `base` in the number implementation
  of function `log` (<a href="https://github.com/josdejong/mathjs/issues/2515">#2515</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Improve the documentation on operator `;` (<a href="https://github.com/josdejong/mathjs/issues/2512">#2512</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.

<h1 id="20220329-version-1042">2022-03-29, version 10.4.2 <a href="#20220329-version-1042" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2499">#2499</a>: different behavior for unit conversion "degC" and "K" (<a href="https://github.com/josdejong/mathjs/issues/2501">#2501</a>).
  Also disables getting the sign for units with an offset, which is ambiguous.
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2503">#2503</a>: fix an issue in `log()` for complex numbers in which the imaginary
  part is much larger in absolute value than the real part, fixed in
  `complex.js@2.1.0` (<a href="https://github.com/josdejong/mathjs/issues/2505">#2505</a>), thanks <a href="https://github.com/gwhitney">@gwhitney</a>, <a href="https://github.com/infusion">@infusion</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2493">#2493</a>: unclear error message when an entity that is not a function
  is being called as a function (<a href="https://github.com/josdejong/mathjs/issues/2494">#2494</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Some fixes in the docs on units (<a href="https://github.com/josdejong/mathjs/issues/2498">#2498</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Add `forEach` example in embedded docs (<a href="https://github.com/josdejong/mathjs/issues/2507">#2507</a>). Thanks <a href="https://github.com/dvd101x">@dvd101x</a>.
- Correct approx.deepEqual() to accept an epsilon argument giving the
  comparison tolerance. It was already being called this way, but was
  silently ignoring the tolerance. Thanks <a href="https://github.com/yifanwww">@yifanwww</a>.

<h1 id="20220323-version-1041">2022-03-23, version 10.4.1 <a href="#20220323-version-1041" title="Permalink">#</a></h1>

- Improve TypeScript definitions for function `unit` (<a href="https://github.com/josdejong/mathjs/issues/2479">#2479</a>).
  Thanks <a href="https://github.com/SinanAkkoyun">@SinanAkkoyun</a>.
- Add tests for type declarations (<a href="https://github.com/josdejong/mathjs/issues/2448">#2448</a>). Thanks <a href="https://github.com/samestep">@samestep</a>.
- Further improvement to TypeScript definitions of `std` and `variance`
  (make dimension parameter optional, <a href="https://github.com/josdejong/mathjs/issues/2474">#2474</a>). Thanks <a href="https://github.com/NattapongSiri">@NattapongSiri</a>.
- Next step (as per <a href="https://github.com/josdejong/mathjs/issues/2431">#2431</a>) for full publication of "is" functions like
  `isMatrix` etc: Provide TypeScript definitions of "is" functions and
  make them type guards. (<a href="https://github.com/josdejong/mathjs/issues/2432">#2432</a>). Thanks <a href="https://github.com/ChristopherChudzicki">@ChristopherChudzicki</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2491">#2491</a>: Multi line object expressions don't work with comments (<a href="https://github.com/josdejong/mathjs/issues/2492">#2492</a>).
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2478">#2478</a>: a bug in calculating the eigenvectors when dealing with complex
  numbers (<a href="https://github.com/josdejong/mathjs/issues/2496">#2496</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Update project dependencies and devDependencies.

<h1 id="20220307-version-1040">2022-03-07, version 10.4.0 <a href="#20220307-version-1040" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2461">#2461</a>: make sure `simplifyCore` recurses over all binary nodes (<a href="https://github.com/josdejong/mathjs/issues/2462">#2462</a>).
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2429">#2429</a>: fix the TypeScript definitions of functions `std` and `variance`
  (<a href="https://github.com/josdejong/mathjs/issues/2455">#2455</a>). Thanks <a href="https://github.com/NattapongSiri">@NattapongSiri</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1633">#1633</a>: implement a `cumsum` function generating cumulative sums of a list
  of values or a matrix. (<a href="https://github.com/josdejong/mathjs/issues/1870">#1870</a>). Thanks <a href="https://github.com/hjonasson">@hjonasson</a>.
- Upgrade to the latest version of `Fraction.js`, having more strict input,
  only accepting an integer numerator and denominator. See <a href="https://github.com/josdejong/mathjs/issues/2427">#2427</a>.
- Fix typo in documentation example for `format`. (<a href="https://github.com/josdejong/mathjs/issues/2468">#2468</a>) Thanks <a href="https://github.com/abranhe">@abranhe</a>.
- Write unit tests for all jsdoc examples. See <a href="https://github.com/josdejong/mathjs/issues/2452">#2452</a>. Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.

<h1 id="20210302-version-1030">2021-03-02, version 10.3.0 <a href="#20210302-version-1030" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1260">#1260</a>: implement function `symbolicEqual` (<a href="https://github.com/josdejong/mathjs/issues/2424">#2424</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2441">#2441</a>, <a href="https://github.com/josdejong/mathjs/issues/2442">#2442</a>: support passing a function as argument to functions created
  in the expression parser (<a href="https://github.com/josdejong/mathjs/issues/2443">#2443</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2325">#2325</a>: improve documentation of subset indices (<a href="https://github.com/josdejong/mathjs/issues/2446">#2446</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2439">#2439</a>: fix a bug in `complexEigs` in which real-valued norms were
  inadvertently being typed as complex numbers (<a href="https://github.com/josdejong/mathjs/issues/2445">#2445</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2436">#2436</a>: improve documentation and error message of function `map` (<a href="https://github.com/josdejong/mathjs/issues/2457">#2457</a>).
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.

<h1 id="20220301-version-1020">2022-03-01, version 10.2.0 <a href="#20220301-version-1020" title="Permalink">#</a></h1>

- Implemented context options to control simplifications allowed in `simplify`,
  see <a href="https://github.com/josdejong/mathjs/issues/2399">#2399</a>, <a href="https://github.com/josdejong/mathjs/issues/2391">#2391</a>. Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Implemented function `leafCount` as a first simple measure of the complexity
  of an expression, see <a href="https://github.com/josdejong/mathjs/issues/2411">#2411</a>, <a href="https://github.com/josdejong/mathjs/issues/2389">#2389</a>. Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2413">#2413</a>: improve `combinations` to return an integer result without rounding
  errors for larger values, see <a href="https://github.com/josdejong/mathjs/issues/2414">#2414</a>. Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2385">#2385</a>: function `rotate` missing in TypeScript definitions.
  Thanks <a href="https://github.com/DIVYA-19">@DIVYA-19</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2450">#2450</a>: Add BigNumber to parameter type in `math.unit` and add TypeScript
  types for `Unit.simplify` and `Unit.units` (<a href="https://github.com/josdejong/mathjs/issues/2353">#2353</a>). Thanks <a href="https://github.com/joshhansen">@joshhansen</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2383">#2383</a>: detect infinite loops in `simplify` (<a href="https://github.com/josdejong/mathjs/issues/2405">#2405</a>). Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1423">#1423</a>: collect like factors and cancel like terms in sums (<a href="https://github.com/josdejong/mathjs/issues/2388">#2388</a>).
  Thanks <a href="https://github.com/gwhitney">@gwhitney</a>.

<h1 id="20220202-version-1011">2022-02-02, version 10.1.1 <a href="#20220202-version-1011" title="Permalink">#</a></h1>

- Improvements and fixes in function `simplify`, thanks <a href="https://github.com/gwhitney">@gwhitney</a>:
  - Fix <a href="https://github.com/josdejong/mathjs/issues/2393">#2393</a>: regression bug in `simplify('2-(x+1)')`.
  - Ad option `consoleDebug` to `simplify` to see what is going on.
- Fix TypeScript definition of `ConfigOptions`, which was missing option
  `predictable`.

<h1 id="20220115-version-1010">2022-01-15, version 10.1.0 <a href="#20220115-version-1010" title="Permalink">#</a></h1>

- Implemented function `invmod`, see <a href="https://github.com/josdejong/mathjs/issues/2368">#2368</a>, <a href="https://github.com/josdejong/mathjs/issues/1744">#1744</a>. Thanks <a href="https://github.com/thetazero">@thetazero</a>.
- Improvements and fixes in function `simplify`, thanks <a href="https://github.com/gwhitney">@gwhitney</a>:
  - Fix <a href="https://github.com/josdejong/mathjs/issues/1179">#1179</a>, <a href="https://github.com/josdejong/mathjs/issues/1290">#1290</a>: improve collection of non-constant like terms (<a href="https://github.com/josdejong/mathjs/issues/2384">#2384</a>).
  - Fix <a href="https://github.com/josdejong/mathjs/issues/2152">#2152</a>: do not transform strings into numbers (<a href="https://github.com/josdejong/mathjs/issues/2372">#2372</a>).
  - Fix <a href="https://github.com/josdejong/mathjs/issues/1913">#1913</a>: implement support for array and object simplification (<a href="https://github.com/josdejong/mathjs/issues/2382">#2382</a>).
- Fix <a href="https://github.com/josdejong/mathjs/issues/2379">#2379</a>: add embedded documentation for function `print`.
- Remove broken example from the embedded documentation of function `forEach`.

<h1 id="20211229-version-1002">2021-12-29, version 10.0.2 <a href="#20211229-version-1002" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2156">#2156</a>: simplify expressions like `-1 / (-x)` to `1/x`. Thanks <a href="https://github.com/ony3000">@ony3000</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2363">#2363</a>: remove a redundant part of the regex to split a number.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2291">#2291</a>: add support for fractions in function `intersect`.
  Thanks <a href="https://github.com/thetazero">@thetazero</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2358">#2358</a>: bug in `SparseMatrix` when replacing a subset of a matrix with
  a non-consecutive index. Thanks <a href="https://github.com/Al-0">@Al-0</a>.

<h1 id="20211222-version-1001">2021-12-22, version 10.0.1 <a href="#20211222-version-1001" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1681">#1681</a>: function `gamma` giving inaccurate complex results in some cases.
  Thanks <a href="https://github.com/kmdrGroch">@kmdrGroch</a>.
- Fixed a typo in an example, see <a href="https://github.com/josdejong/mathjs/issues/2366">#2366</a>. Thanks <a href="https://github.com/blackwindforce">@blackwindforce</a>.

<h1 id="20211103-version-1000">2021-11-03, version 10.0.0 <a href="#20211103-version-1000" title="Permalink">#</a></h1>

!!! BE CAREFUL: BREAKING CHANGES IN THE TYPESCRIPT DEFINITIONS !!!

- Improvements to the Typescript typings (commit fc5c202e).
  Thanks <a href="https://github.com/joshhansen">@joshhansen</a>. First introduced in v9.5.1, but reverted because
  it contains breaking changes.
  
  Breaking changes: interface `MathNode` is now renamed to `MathNodeCommon`
  and the related interfaces are structured in a different way.

- Fixed a typo in the TypeScript definition of toHTML. Thanks <a href="https://github.com/TheToto">@TheToto</a>.

<h1 id="20211103-version-952">2021-11-03, version 9.5.2` <a href="#20211103-version-952" title="Permalink">#</a></h1>

- Revert the improvements to the Typescript typings because they contain
  breaking changes. The improvements will be published in v10.0.0. See <a href="https://github.com/josdejong/mathjs/issues/2339">#2339</a>.

<h1 id="20211013-version-951">2021-10-13, version 9.5.1 <a href="#20211013-version-951" title="Permalink">#</a></h1>

- Various improvements to the Typescript typings.
  Thanks <a href="https://github.com/joshhansen">@joshhansen</a> and <a href="https://github.com/DianaTdr">@DianaTdr</a>.

<h1 id="20210922-version-950">2021-09-22, version 9.5.0 <a href="#20210922-version-950" title="Permalink">#</a></h1>

- Implemented support for calculations with percentage, see <a href="https://github.com/josdejong/mathjs/issues/2303">#2303</a>.
  Thanks <a href="https://github.com/rvramesh">@rvramesh</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2319">#2319</a>: make the API of `Parser.evaluate` consistent with `math.evaluate`:
  support a list with expressions as input.
- Improved documentation of function `setCartesian`. Thanks <a href="https://github.com/fieldfoxWim">@fieldfoxWim</a>.

<h1 id="20210915-version-945">2021-09-15, version 9.4.5 <a href="#20210915-version-945" title="Permalink">#</a></h1>

- Improved the performance of `Node.equals` by improving the internal
  function `deepStrictEqual`. Thanks <a href="https://github.com/tomlarkworthy">@tomlarkworthy</a>.
- Fixes in the TypeScript definitions:
  - Define `hasNumericValue`. Thanks <a href="https://github.com/write2kcl">@write2kcl</a>.
  - Define `MathNode.isRelationalNode`. Thanks <a href="https://github.com/m93a">@m93a</a>.
  - Fix typo in `MathNode.isConditionalNode`. Thanks <a href="https://github.com/m93a">@m93a</a>.

<h1 id="20210707-version-944">2021-07-07, version 9.4.4 <a href="#20210707-version-944" title="Permalink">#</a></h1>

- Fixed `ArrayNode.toTex()`: remove the row delimiter on the last row,
  see <a href="https://github.com/josdejong/mathjs/issues/2267">#2267</a>. Thanks <a href="https://github.com/davidtranhq">@davidtranhq</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2269">#2269</a>: `intersect`  not returning `null` for matrix input. Thanks <a href="https://github.com/m93a">@m93a</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2245">#2245</a>: mathjs not working in IE11 anymore due to a missing polyfill for
  `Symbol`. The browser bundle now includes the necessary polyfills (it is
  larger now because of that, see also <a href="https://github.com/josdejong/mathjs/issues/2266">#2266</a>). Thanks <a href="https://github.com/m93a">@m93a</a>.
- Update dependencies (`complex.js@2.0.15`, `decimal.js@10.3.1`)
- Drop official support for node.js 10, which has reached end of life.
  See <a href="https://github.com/josdejong/mathjs/issues/2258">#2258</a>.

<h1 id="20210623-version-943">2021-06-23, version 9.4.3 <a href="#20210623-version-943" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2222">#2222</a>: mathjs polluting the `Decimal` prototype. Thanks <a href="https://github.com/m93a">@m93a</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2253">#2253</a>: expression parser throwing an error when accessing nested object
  properties named `e`.
- Fixes in the TypeScript definitions:
  - function `floor`, <a href="https://github.com/josdejong/mathjs/issues/2159">#2159</a>, <a href="https://github.com/josdejong/mathjs/issues/2246">#2246</a>. Thanks <a href="https://github.com/write2kcl">@write2kcl</a>.
  - function `simplify`, see <a href="https://github.com/josdejong/mathjs/issues/2252">#2252</a>. Thanks <a href="https://github.com/nitroin">@nitroin</a>.
- Upgraded to `decimal.js@10.3.0`

<h1 id="20210605-version-942">2021-06-05, version 9.4.2 <a href="#20210605-version-942" title="Permalink">#</a></h1>

- Implemented iterative eigenvalue finder for `eigs`, making it much more
  robust. See <a href="https://github.com/josdejong/mathjs/issues/2179">#2179</a>, <a href="https://github.com/josdejong/mathjs/issues/2237">#2237</a>. Thanks <a href="https://github.com/m93a">@m93a</a>.
- Improved TypeScript definitions of function `parse`. Thanks <a href="https://github.com/OpportunityLiu">@OpportunityLiu</a>.

<h1 id="20210524-version-941">2021-05-24, version 9.4.1 <a href="#20210524-version-941" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2100">#2100</a>: add TypeScript declaration for `eigs`. Thanks <a href="https://github.com/andrebianchessi">@andrebianchessi</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2220">#2220</a>: add TypeScript files to published npm package. Thanks <a href="https://github.com/dhritzkiv">@dhritzkiv</a>.
- Update readme regarding TypeScript definition files. Thanks <a href="https://github.com/dhritzkiv">@dhritzkiv</a>.
- Update to `fraction.js@4.1.1`

<h1 id="20210516-version-940">2021-05-16, version 9.4.0 <a href="#20210516-version-940" title="Permalink">#</a></h1>

- Implemented support to use objects with a `Map` interface as scope,
  see <a href="https://github.com/josdejong/mathjs/issues/2143">#2143</a>, <a href="https://github.com/josdejong/mathjs/issues/2166">#2166</a>. Thanks <a href="https://github.com/jhugman">@jhugman</a>.
- Extend `eigs` to support general complex matrices, see <a href="https://github.com/josdejong/mathjs/issues/1741">#1741</a>. Thanks <a href="https://github.com/m93a">@m93a</a>.
- DenseMatrix and SparseMatrix are now iterable, see <a href="https://github.com/josdejong/mathjs/issues/1184">#1184</a>. Thanks <a href="https://github.com/m93a">@m93a</a>.
- Implemented utility functions `matrixFromRows`, `matrixFromColumns`, and
  `matrixFromFunction`, see <a href="https://github.com/josdejong/mathjs/issues/2155">#2155</a>, <a href="https://github.com/josdejong/mathjs/issues/2153">#2153</a>. Thanks <a href="https://github.com/m93a">@m93a</a>.
- Added TypeScript definitions to the project, making it redundant to install
  `@types/mathjs`, and making it easier to improve the definitions. See <a href="https://github.com/josdejong/mathjs/issues/2187">#2187</a>,
  <a href="https://github.com/josdejong/mathjs/issues/2192">#2192</a>. Thanks <a href="https://github.com/CatsMiaow">@CatsMiaow</a>.
- Upgraded dependencies
  - `complex.js@2.0.13` (fixing <a href="https://github.com/josdejong/mathjs/issues/2211">#2211</a>). Thanks <a href="https://github.com/infusion">@infusion</a>
  - `fraction.js@4.1.0` (`pow` now supporting rational exponents).
- Fix <a href="https://github.com/josdejong/mathjs/issues/2174">#2174</a>: function `pickRandom` having no name. Thanks <a href="https://github.com/HK-SHAO">@HK-SHAO</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2019">#2019</a>: VSCode auto import keeps adding import { null } from 'mathjs'.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2185">#2185</a>: Fix TypeScript definition of unit division, which can also return
  a number.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2123">#2123</a>: add type definitions for functions `row` and `column`.
- Fix some files not exposed in the package, see <a href="https://github.com/josdejong/mathjs/issues/2213">#2213</a>. Thanks <a href="https://github.com/javiermarinros">@javiermarinros</a>.

<h1 id="20210412-version-932">2021-04-12, version 9.3.2 <a href="#20210412-version-932" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2169">#2169</a>: mathjs requesting `@babel/runtime` dependency.
  Regression introduced in `v9.3.1`.

<h1 id="20210410-version-931">2021-04-10, version 9.3.1 <a href="#20210410-version-931" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/2133">#2133</a>: strongly improved the performance of `isPrime`, see <a href="https://github.com/josdejong/mathjs/issues/2139">#2139</a>.
  Thanks <a href="https://github.com/Yaffle">@Yaffle</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2150">#2150</a>: give a clear error "Error: Undefined function ..." instead when
  evaluating a non-existing function.
- Fix <a href="https://github.com/josdejong/mathjs/issues/660">#660</a>: expose internal functions `FunctionNode.onUndefinedFunction(name)`
  and `SymbolNode.onUndefinedSymbol(name)`, allowing to override the behavior.
  By default, an Error is thrown.

<h1 id="20210310-version-930">2021-03-10, version 9.3.0 <a href="#20210310-version-930" title="Permalink">#</a></h1>

- Implemented support for parsing non decimal numbers with radix point,
  see <a href="https://github.com/josdejong/mathjs/issues/2122">#2122</a>, <a href="https://github.com/josdejong/mathjs/issues/2121">#2121</a>. Thanks <a href="https://github.com/clnhlzmn">@clnhlzmn</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2128">#2128</a>: typo in docs of `luSolveAll` and `usolveAll`.

<h1 id="20210203-version-920">2021-02-03, version 9.2.0 <a href="#20210203-version-920" title="Permalink">#</a></h1>

- Implemented function `count` to count the total elements in a matrix,
  see <a href="https://github.com/josdejong/mathjs/issues/2085">#2085</a>. Thanks <a href="https://github.com/Josef37">@Josef37</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2096">#2096</a>: cleanup old reference to external dependency `crypto`.
- Some refactoring in the code to remove duplications, see <a href="https://github.com/josdejong/mathjs/issues/2093">#2093</a>.
  Thanks <a href="https://github.com/Josef37">@Josef37</a>.

<h1 id="20210127-version-910">2021-01-27, version 9.1.0 <a href="#20210127-version-910" title="Permalink">#</a></h1>

- Extended function `reshape` with support for a wildcard `-1` to automatically
  calculate the remaining size, like `reshape([1, 2, 3, 4, 5, 6], [-1, 2])`
  which will output `[[0, 1], [2, 3], [4, 5]]`. See <a href="https://github.com/josdejong/mathjs/issues/2075">#2075</a>. Thanks <a href="https://github.com/Josef37">@Josef37</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2087">#2087</a>: function `simplify` ignores second argument of `log`, for example
  in `simplify('log(e, 9)')` . Thanks <a href="https://github.com/quentintruong">@quentintruong</a>.

<h1 id="20210116-version-900">2021-01-16, version 9.0.0 <a href="#20210116-version-900" title="Permalink">#</a></h1>

- Improved support for bin, hex, and oct literals. See <a href="https://github.com/josdejong/mathjs/issues/1996">#1996</a>. Thanks <a href="https://github.com/clnhlzmn">@clnhlzmn</a>.
  - **Breaking change**: parse literals with prefixes `0b`, `0c`, and `0x` are  
    now unsigned by default. To parse them as signed, you have to specify a
    suffix specifying the word size such as `i16` or `i32`.
  - Function `format` now supports more notations: `bin`, 'hex', and `oct`,
    for example `format(255, {notation: "hex"})`.
  - The functions `format`, `bin`, `hex`, `oct` now allow specifying a wordSize,
    like `bin(10, 32)` and `format(10, {notation: "bin", wordSize: 32})`.
  - BigNumber support for the bin, hex, and oct literals.
- Extended and improved the example rocket_trajectory_optimization.html.
  Thanks <a href="https://github.com/Josef37">@Josef37</a>.

<h1 id="20201230-version-811">2020-12-30, version 8.1.1 <a href="#20201230-version-811" title="Permalink">#</a></h1>

- Improved the performance of parsing and evaluating units a lot, see <a href="https://github.com/josdejong/mathjs/issues/2065">#2065</a>.
  Thanks <a href="https://github.com/flaviut">@flaviut</a>.
- Upgraded dependency `fraction.js` to `v4.0.13`.
- Moved continuous integration testing from Travis CI to Github Workflow,
  see <a href="https://github.com/josdejong/mathjs/issues/2024">#2024</a>, <a href="https://github.com/josdejong/mathjs/issues/2041">#2041</a>. Thanks <a href="https://github.com/harrysarson">@harrysarson</a>.

<h1 id="20201204-version-810">2020-12-04, version 8.1.0 <a href="#20201204-version-810" title="Permalink">#</a></h1>

- Implemented units `kilogramforce` (`kgf`). Thanks <a href="https://github.com/rnd-debug">@rnd-debug</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2026">#2026</a>: Implement a new option `fractionsLimit` for function `simplify`,
  defaulting to `Infinity`.
- Improved the documentation of function `clone`. Thanks <a href="https://github.com/redbar0n">@redbar0n</a>.

<h1 id="20201109-version-801">2020-11-09, version 8.0.1 <a href="#20201109-version-801" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1979">#1979</a>: missing "subset" dependency when using "mathjs/number" entry point.
- Fix <a href="https://github.com/josdejong/mathjs/issues/2022">#2022</a>: update pretty printing with MathJax example to the latest version
  of MathJax. Thanks <a href="https://github.com/pkra">@pkra</a>.

<h1 id="20201106-version-800">2020-11-06, version 8.0.0 <a href="#20201106-version-800" title="Permalink">#</a></h1>

!!! BE CAREFUL: BREAKING CHANGES !!!

- You can now use mathjs directly in node.js using ES modules without need for
  a transpiler (see <a href="https://github.com/josdejong/mathjs/issues/1928">#1928</a>, <a href="https://github.com/josdejong/mathjs/issues/1941">#1941</a>, <a href="https://github.com/josdejong/mathjs/issues/1962">#1962</a>).
  Automatically loading either commonjs code or ES modules code is improved.
  All generated code is moved under `/lib`: the browser bundle is moved from
  `/dist` to `/lib/browser`, ES module files are moved to `/lib/esm`,
  and commonjs files are moved to `/lib/cjs`. Thanks <a href="https://github.com/GreenImp">@GreenImp</a>.
- Non-minified bundle `dist/math.js` is no longer provided. Either use the
  minified bundle, or create a bundle yourself.
- Replaced random library `seed-random` with `seedrandom`, see <a href="https://github.com/josdejong/mathjs/issues/1955">#1955</a>.
  Thanks <a href="https://github.com/poppinlp">@poppinlp</a>.
- Breaking changes in `pickRandom`, see <a href="https://github.com/josdejong/mathjs/issues/1990">#1990</a>, <a href="https://github.com/josdejong/mathjs/issues/1976">#1976</a>.
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

<h1 id="20201102-version-760">2020-11-02, version 7.6.0 <a href="#20201102-version-760" title="Permalink">#</a></h1>

- Implemented function `rotate(w, theta)`. See <a href="https://github.com/josdejong/mathjs/issues/1992">#1992</a>, <a href="https://github.com/josdejong/mathjs/issues/1160">#1160</a>. Thanks <a href="https://github.com/rnd-debug">@rnd-debug</a>.
- Implemented support for custom characters in Units via `Unit.isValidAlpha`.
  See <a href="https://github.com/josdejong/mathjs/issues/1663">#1663</a>, <a href="https://github.com/josdejong/mathjs/issues/2000">#2000</a>. Thanks <a href="https://github.com/rnd-debug">@rnd-debug</a>.

<h1 id="20201010-version-751">2020-10-10, version 7.5.1 <a href="#20201010-version-751" title="Permalink">#</a></h1>

- Fix object pollution vulnerability in `math.config`. Thanks Snyk.

<h1 id="20201007-version-750">2020-10-07, version 7.5.0 <a href="#20201007-version-750" title="Permalink">#</a></h1>

- Function `pickRandom` now allows randomly picking elements from matrices
  with 2 or more dimensions instead of only from a vector, see <a href="https://github.com/josdejong/mathjs/issues/1974">#1974</a>.
  Thanks <a href="https://github.com/KonradLinkowski">@KonradLinkowski</a>.

<h1 id="20201007-version-740">2020-10-07, version 7.4.0 <a href="#20201007-version-740" title="Permalink">#</a></h1>

- Implemented support for passing a precision in functions `ceil`, `floor`,
  and `fix`, similar to `round`, see <a href="https://github.com/josdejong/mathjs/issues/1967">#1967</a>, <a href="https://github.com/josdejong/mathjs/issues/1901">#1901</a>. Thanks <a href="https://github.com/rnd-debug">@rnd-debug</a>.
- Implemented function `rotationMatrix`, see <a href="https://github.com/josdejong/mathjs/issues/1160">#1160</a>, <a href="https://github.com/josdejong/mathjs/issues/1984">#1984</a>. Thanks <a href="https://github.com/rnd-debug">@rnd-debug</a>.
- Implement a clear error message when using `sqrtm` with a matrix having
  more than two dimensions. Thanks <a href="https://github.com/KonradLinkowski">@KonradLinkowski</a>.
- Update dependency `decimal.js` to `10.2.1`.

<h1 id="20200926-version-730">2020-09-26, version 7.3.0 <a href="#20200926-version-730" title="Permalink">#</a></h1>

- Implemented functions `usolveAll` and `lsolveAll`, see <a href="https://github.com/josdejong/mathjs/issues/1916">#1916</a>. Thanks <a href="https://github.com/m93a">@m93a</a>.
- Implemented support for units in functions `std` and `variance`, see <a href="https://github.com/josdejong/mathjs/issues/1950">#1950</a>.
  Thanks <a href="https://github.com/rnd-debug">@rnd-debug</a>.
- Implemented support for binary, octal, and hexadecimal notation in the
  expression parser, and implemented functions `bin`, `oct`, and `hex` for
  formatting. Thanks <a href="https://github.com/clnhlzmn">@clnhlzmn</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1964">#1964</a>: inconsistent calculation of negative dividend modulo for
  `BigNumber` and `Fraction`. Thanks <a href="https://github.com/ovk">@ovk</a>.

<h1 id="20200824-version-720">2020-08-24, version 7.2.0 <a href="#20200824-version-720" title="Permalink">#</a></h1>

- Implemented new function `diff`, see <a href="https://github.com/josdejong/mathjs/issues/1634">#1634</a>, <a href="https://github.com/josdejong/mathjs/issues/1920">#1920</a>. Thanks <a href="https://github.com/Veeloxfire">@Veeloxfire</a>.
- Implemented support for norm 2 for matrices in function `norm`.
  Thanks <a href="https://github.com/rnd-debug">@rnd-debug</a>.

<h1 id="20200713-version-710">2020-07-13, version 7.1.0 <a href="#20200713-version-710" title="Permalink">#</a></h1>

- Implement support for recursion (self-referencing) of typed-functions,
  new in `typed-function@2.0.0`. This fixes <a href="https://github.com/josdejong/mathjs/issues/1885">#1885</a>: functions which where
  extended with a new data type did not always work. Thanks <a href="https://github.com/nickewing">@nickewing</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1899">#1899</a>: documentation on expression trees still using old namespace
  `math.expression.node.*` instead of `math.*`.

<h1 id="20200624-version-702">2020-06-24, version 7.0.2 <a href="#20200624-version-702" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1882">#1882</a>: have `DenseMatrix.resize` and `SparseMatrix.resize` accept
  `DenseMatrix` and `SparseMatrix` as inputs too, not only `Array`.
- Fix functions `sum`, `prod`, `min`, and `max` not throwing a conversion error
  when passing a single string, like `sum("abc")`.

<h1 id="20200530-version-701">2020-05-30, version 7.0.1 <a href="#20200530-version-701" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1844">#1844</a>: clarify the documentation of function `eigs`. Thanks <a href="https://github.com/Lazersmoke">@Lazersmoke</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1855">#1855</a>: Fix error in the documentation for `math.nthRoots(x)`.  
- Fix <a href="https://github.com/josdejong/mathjs/issues/1856">#1856</a>: make the library robust against Object prototype pollution.

<h1 id="20200507-version-700">2020-05-07, version 7.0.0 <a href="#20200507-version-700" title="Permalink">#</a></h1>

Breaking changes:

- Improvements in calculation of the `dot` product of complex values.
  The first argument is now conjugated. See <a href="https://github.com/josdejong/mathjs/issues/1761">#1761</a>. Thanks <a href="https://github.com/m93a">@m93a</a>.  
- Dropped official support for Node.js v8 which has reached end of life.
- Removed all deprecation warnings introduced in v6.
  To upgrade smoothly from v5 to v7 or higher, upgrade to v6 first
  and resolve all deprecation warnings.

<h1 id="20200504-version-665">2020-05-04, version 6.6.5 <a href="#20200504-version-665" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1834">#1834</a>: value `Infinity` cannot be serialized and deserialized.
  This is solved now with a new `math.replacer` function used as
  `JSON.stringify(value, math.replacer)`.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1842">#1842</a>: value `Infinity` not turned into the latex symbol `\\infty`.

<h1 id="20200415-version-664">2020-04-15, version 6.6.4 <a href="#20200415-version-664" title="Permalink">#</a></h1>

- Fix published files containing Windows line endings (CRLF instead of LF).  

<h1 id="20200410-version-663">2020-04-10, version 6.6.3 <a href="#20200410-version-663" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1813">#1813</a>: bug in engineering notation for numbers of function `format`,
  sometimes resulting in needless trailing zeros.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1808">#1808</a>: methods `.toNumber()` and `.toNumeric()` not working on a
  unitless unit.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1645">#1645</a>: not being able to use named operators `mod`, `and`, `not`, `or`,
  `xor`, `to`, `in` as object keys. Thanks <a href="https://github.com/Veeloxfire">@Veeloxfire</a>.
- Fix `eigs` not using `config.epsilon`.

<h1 id="20200329-version-662">2020-03-29, version 6.6.2 <a href="#20200329-version-662" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1789">#1789</a>: Function `eigs` not calculating with BigNumber precision
  when input contains BigNumbers.
- Run the build script during npm `prepare`, so you can use the library
  directly when installing directly from git. See <a href="https://github.com/josdejong/mathjs/issues/1751">#1751</a>. Thanks <a href="https://github.com/cinderblock">@cinderblock</a>.

<h1 id="20200226-version-661">2020-02-26, version 6.6.1 <a href="#20200226-version-661" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1725">#1725</a>: simplify `a/(b/c)`. Thanks <a href="https://github.com/dbramwell">@dbramwell</a>.
- Fix examples in documentation of `row` and `column`.

<h1 id="20200201-version-660">2020-02-01, version 6.6.0 <a href="#20200201-version-660" title="Permalink">#</a></h1>

- Implemented function `eigs`, see <a href="https://github.com/josdejong/mathjs/issues/1705">#1705</a>, <a href="https://github.com/josdejong/mathjs/issues/542">#542</a> <a href="https://github.com/josdejong/mathjs/issues/1175">#1175</a>. Thanks <a href="https://github.com/arkajitmandal">@arkajitmandal</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1727">#1727</a>: validate matrix size when creating a `DenseMatrix` using
  `fromJSON`.
- Fixed `DenseMatrix.map` copying the size and datatype from the original
  matrix instead of checking the returned dimensions and type of the callback.
- Add a caret to dependencies (like) `^1.2.3`) to allow downstream updates
  without having to await a new release of mathjs.

<h1 id="20200108-version-650">2020-01-08, version 6.5.0 <a href="#20200108-version-650" title="Permalink">#</a></h1>

- Implemented `baseName` option for `createUnit`, see <a href="https://github.com/josdejong/mathjs/issues/1707">#1707</a>.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h1 id="20200106-version-640">2020-01-06, version 6.4.0 <a href="#20200106-version-640" title="Permalink">#</a></h1>

- Extended function `dimension` with support for n-dimensional points.
  Thanks <a href="https://github.com/Veeloxfire">@Veeloxfire</a>.

<h1 id="20191231-version-630">2019-12-31, version 6.3.0 <a href="#20191231-version-630" title="Permalink">#</a></h1>

- Improved performance of `factorial` for `BigNumber` up to a factor two,
  see <a href="https://github.com/josdejong/mathjs/issues/1687">#1687</a>. Thanks <a href="https://github.com/kmdrGroch">@kmdrGroch</a>.

<h1 id="20191120-version-625">2019-11-20, version 6.2.5 <a href="#20191120-version-625" title="Permalink">#</a></h1>

- Fixed `IndexNode` using a hardcoded, one-based implementation of `index`,
  making it impossible to instantiate a zero-based version of the expression
  parser. See <a href="https://github.com/josdejong/mathjs/issues/782">#782</a>.

<h1 id="20191120-version-624">2019-11-20, version 6.2.4 <a href="#20191120-version-624" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1669">#1669</a>: function 'qr' threw an error if the pivot was zero,
  thanks <a href="https://github.com/kevinkelleher12">@kevinkelleher12</a> and <a href="https://github.com/harrysarson">@harrysarson</a>.
- Resolves <a href="https://github.com/josdejong/mathjs/issues/942">#942</a>: remove misleading assert in 'qr'. Thanks <a href="https://github.com/harrysarson">@harrysarson</a>.
- Work around a bug in complex.js where `sign(0)` returns complex NaN.
  Thanks <a href="https://github.com/harrysarson">@harrysarson</a>.

<h1 id="20191006-version-623">2019-10-06, version 6.2.3 <a href="#20191006-version-623" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1640">#1640</a>: function `mean` not working for units. Thanks <a href="https://github.com/clintonc">@clintonc</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1639">#1639</a>: function `min` listed twice in the "See also" section of the
  embedded docs of function `std`.
- Improved performance of `isPrime`, see <a href="https://github.com/josdejong/mathjs/issues/1641">#1641</a>. Thanks <a href="https://github.com/arguiot">@arguiot</a>.

<h1 id="20190923-version-622">2019-09-23, version 6.2.2 <a href="#20190923-version-622" title="Permalink">#</a></h1>

- Fixed methods `map` and `clone` not copying the `dotNotation` property of
  `IndexNode`. Thanks <a href="https://github.com/rianmcguire">@rianmcguire</a>.
- Fixed a typo in the documentation of `toHTML`. Thanks <a href="https://github.com/maytanthegeek">@maytanthegeek</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1615">#1615</a>: error in the docs of `isNumeric`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1628">#1628</a>: Cannot call methods on empty strings or numbers with value `0`.

<h1 id="20190831-version-621">2019-08-31, version 6.2.1 <a href="#20190831-version-621" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1606">#1606</a>: function `format` not working for expressions.

<h1 id="20190828-version-620">2019-08-28, version 6.2.0 <a href="#20190828-version-620" title="Permalink">#</a></h1>

- Improved performance of `combinationsWithRep`. Thanks <a href="https://github.com/waseemyusuf">@waseemyusuf</a>.
- Add unit aliases `bit` and `byte`.
- Fix docs referring to `bit` and `byte` instead of `bits` and `bytes`.
- Updated dependency `typed-function@1.1.1`.

<h1 id="20190817-version-610">2019-08-17, version 6.1.0 <a href="#20190817-version-610" title="Permalink">#</a></h1>

- Implemented function `combinationsWithRep` (see <a href="https://github.com/josdejong/mathjs/issues/1329">#1329</a>). Thanks <a href="https://github.com/waseemyusuf">@waseemyusuf</a>.

<h1 id="20190805-version-604">2019-08-05, version 6.0.4 <a href="#20190805-version-604" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1554">#1554</a>, <a href="https://github.com/josdejong/mathjs/issues/1565">#1565</a>: ES Modules where not transpiled to ES5, giving issues on
  old browsers. Thanks <a href="https://github.com/mockdeep">@mockdeep</a> for helping to find a solution.

<h1 id="20190707-version-603">2019-07-07, version 6.0.3 <a href="#20190707-version-603" title="Permalink">#</a></h1>

- Add `unpkg` and `jsdelivr` fields in package.json pointing to UMD build.
  Thanks <a href="https://github.com/tmcw">@tmcw</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1550">#1550</a>: nested user defined function not receiving variables of an
  outer user defined function.

<h1 id="20190611-version-602">2019-06-11, version 6.0.2 <a href="#20190611-version-602" title="Permalink">#</a></h1>

- Fix not being able to set configuration after disabling function `import`
  (regression since v6.0.0).

<h1 id="20190609-version-601">2019-06-09, version 6.0.1 <a href="#20190609-version-601" title="Permalink">#</a></h1>

- Fix function reference not published in npm library.
- Fix function `evaluate` and `parse` missing in generated docs.

<h1 id="20190608-version-600">2019-06-08, version 6.0.0 <a href="#20190608-version-600" title="Permalink">#</a></h1>

!!! BE CAREFUL: BREAKING CHANGES !!!

<h3 id="most-notable-changes">Most notable changes <a href="#most-notable-changes" title="Permalink">#</a></h3>

1. Full support for **ES modules**. Support for tree-shaking out of the box.

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

2. Support for **lightweight, number-only** implementations of all functions:

    ```
    import { add, multiply } from 'mathjs/number'
    ```

3. New **dependency injection** solution used under the hood.

<h3 id="breaking-changes">Breaking changes <a href="#breaking-changes" title="Permalink">#</a></h3>

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
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1428">#1428</a>: transform iterating over replaced nodes. New behavior
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
  See <a href="https://github.com/josdejong/mathjs/issues/1529">#1529</a>. Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h3 id="non-breaking-changes">Non breaking changes <a href="#non-breaking-changes" title="Permalink">#</a></h3>

- Implemented units `t`, `tonne`, `bel`, `decibel`, `dB`, and prefixes
  for `candela`. Thanks <a href="https://github.com/mcvladthegoat">@mcvladthegoat</a>.
- Fixed `epsilon` setting being applied globally to Complex numbers.
- Fix `math.simplify('add(2, 3)')` throwing an error.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1530">#1530</a>: number formatting first applied `lowerExp` and `upperExp`
  and after that rounded the value instead of the other way around.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1473">#1473</a>: remove `'use strict'` in every file, not needed anymore.

<h1 id="20190518-version-5103">2019-05-18, version 5.10.3 <a href="#20190518-version-5103" title="Permalink">#</a></h1>

- Fixed dependency `del` being a dependency instead of devDependency.

<h1 id="20190518-version-5102">2019-05-18, version 5.10.2 <a href="#20190518-version-5102" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1515">#1515</a>, <a href="https://github.com/josdejong/mathjs/issues/1516">#1516</a>, <a href="https://github.com/josdejong/mathjs/issues/1517">#1517</a>: broken package due to a naming conflict in
  the build folder of a util file `typeOf.js` and `typeof.js`.
  Solved by properly cleaning all build folders before building.

<h1 id="20190517-version-5101">2019-05-17, version 5.10.1 <a href="#20190517-version-5101" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1512">#1512</a>: format using notation `engineering` can give wrong results
  when the value has less significant digits than the number of digits in
  the output.

<h1 id="20190508-version-5100">2019-05-08, version 5.10.0 <a href="#20190508-version-5100" title="Permalink">#</a></h1>

- Fix `lib/header.js` not having filled in date and version. Thanks <a href="https://github.com/kevjin">@kevjin</a>.
- Upgraded dependency `decimal.js@10.2.0`, fixing an issue on node.js 12.

<h1 id="20190408-version-590">2019-04-08, version 5.9.0 <a href="#20190408-version-590" title="Permalink">#</a></h1>

- Implemented functions `row` and `column` (see <a href="https://github.com/josdejong/mathjs/issues/1413">#1413</a>). Thanks <a href="https://github.com/SzechuanSage">@SzechuanSage</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1459">#1459</a>: `engineering` notation of function `format` not available
  for `BigNumber`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1465">#1465</a>: `node.toHTML()` not correct for unary operators like
  `factorial`.

<h1 id="20190320-version-580">2019-03-20, version 5.8.0 <a href="#20190320-version-580" title="Permalink">#</a></h1>

- Implemented new function `apply`. Thanks <a href="https://github.com/bnlcas">@bnlcas</a>.
- Implemented passing an optional `dimension` argument to `std` and `var`.
  Thanks <a href="https://github.com/bnlcas">@bnlcas</a>.

<h1 id="20190310-version-570">2019-03-10, version 5.7.0 <a href="#20190310-version-570" title="Permalink">#</a></h1>

- Implemented support for `pow()` in `derivative`. Thanks <a href="https://github.com/sam-19">@sam-19</a>.
- Gracefully handle round-off errors in fix, ceil, floor, and range
  (Fixes <a href="https://github.com/josdejong/mathjs/issues/1429">#1429</a>, see also <a href="https://github.com/josdejong/mathjs/issues/1434">#1434</a>, <a href="https://github.com/josdejong/mathjs/issues/1432">#1432</a>). Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h1 id="20190302-version-560">2019-03-02, version 5.6.0 <a href="#20190302-version-560" title="Permalink">#</a></h1>

- Upgrade decimal.js to v10.1.1 (<a href="https://github.com/josdejong/mathjs/issues/1421">#1421</a>).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1418">#1418</a>: missing whitespace when stringifying an expression
  containing "not".

<h1 id="20190220-version-550">2019-02-20, version 5.5.0 <a href="#20190220-version-550" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1401">#1401</a>: methods `map` and `forEach` of `SparseMatrix` not working
  correctly when indexes are unordered.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1404">#1404</a>: inconsistent rounding of negative numbers.
- Upgrade tiny-emitter to v2.1.0 (<a href="https://github.com/josdejong/mathjs/issues/1397">#1397</a>).

<h1 id="20190125-version-542">2019-01-25, version 5.4.2 <a href="#20190125-version-542" title="Permalink">#</a></h1>

- Fixed `math.format` not working for BigNumbers with a precision above
  1025 digits (see <a href="https://github.com/josdejong/mathjs/issues/1385">#1385</a>). Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed incorrect LaTeX output of `RelationalNode`. Thanks <a href="https://github.com/rianmcguire">@rianmcguire</a>.
- Fixed a bug the methods `map`, `forEach`, `traverse`, and `transform`
  of `FunctionNode`.

<h1 id="20190110-version-541">2019-01-10, version 5.4.1 <a href="#20190110-version-541" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1378">#1378</a>: negative bignumbers not formatted correctly.
- Upgrade fraction.js to version 4.0.12 (<a href="https://github.com/josdejong/mathjs/issues/1369">#1369</a>).

<h1 id="20181209-version-540">2018-12-09, version 5.4.0 <a href="#20181209-version-540" title="Permalink">#</a></h1>

- Extended sum.js to accept a dimension input to calculate the sum over a
  specific axis. Thanks <a href="https://github.com/bnlcas">@bnlcas</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1328">#1328</a>: objects can't be written multi-line. Thanks <a href="https://github.com/GHolk">@GHolk</a>.
- Remove side effects caused by `Unit.format` and `Unit.toString`,
  making changes to the unit on execution. Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h1 id="20181203-version-531">2018-12-03, version 5.3.1 <a href="#20181203-version-531" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1336">#1336</a>: Unit.toSI() returning units with prefix like `mm` instead
  of `m`. Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h1 id="20181129-version-530">2018-11-29, version 5.3.0 <a href="#20181129-version-530" title="Permalink">#</a></h1>

- Implemented function `hasNumericValue`. Thanks <a href="https://github.com/Sathish-kumar-Subramani">@Sathish-kumar-Subramani</a>.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1326">#1326</a>: non-ascii character in print.js.
- Fix <a href="https://github.com/josdejong/mathjs/issues/1337">#1337</a>: `math.format` not working correctly with `{ precision: 0 }`.
  Thanks <a href="https://github.com/dkenul">@dkenul</a>.

<h1 id="20181030-version-523">2018-10-30, version 5.2.3 <a href="#20181030-version-523" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1293">#1293</a>: non-unicode characters in `escape-latex` giving issues in some
  specific cases. Thanks <a href="https://github.com/dangmai">@dangmai</a>.
- Fixed incorrect LaTeX output of function `bitNot`, see <a href="https://github.com/josdejong/mathjs/issues/1299">#1299</a>. Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1304">#1304</a>: function `pow` not supporting inputs `pow(Unit, BigNumber)`.
- Upgraded dependencies (`escape-latex@1.2.0`)

<h1 id="20181023-version-522">2018-10-23, version 5.2.2 <a href="#20181023-version-522" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1286">#1286</a>: Fixed unit base recognition and formatting for
  user-defined units. Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h1 id="20181018-version-521">2018-10-18, version 5.2.1 <a href="#20181018-version-521" title="Permalink">#</a></h1>

- Fixed unit `rod` being defined as `5.02921` instead of `5.0292`.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Upgraded dependencies (`fraction.js@4.0.10`)
- Upgraded devDependencies (`@babel/core@7.1.2`, `nyc@13.1.0`,
  `webpack@4.21.0`).

<h1 id="20181005-version-520">2018-10-05, version 5.2.0 <a href="#20181005-version-520" title="Permalink">#</a></h1>

- Implemented support for chained conditionals like `10 < x <= 50`.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Add an example showing a proof of concept of using `BigInt` in mathjs.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1269">#1269</a>: Bugfix for BigNumber divided by unit. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1240">#1240</a>: allow units having just a value and no unit.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h2 id="20180909-version-512">2018-09-09, version 5.1.2 <a href="#20180909-version-512" title="Permalink">#</a></h2>

- Fixed a typo in the docs of `parse`. Thanks <a href="https://github.com/mathiasvr">@mathiasvr</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1222">#1222</a>: a typo in the docs of `subset`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1236">#1236</a>: `quantileSeq` has inconsistent return.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1237">#1237</a>: norm sometimes returning a complex number instead of
  number.
- Upgraded dependencies (`fraction.js@4.0.9`)
- Upgraded devDependencies (`babel@7`, `karma-webpack@3.0.4`,
  `nyc@13.0.1`, `standard@12.0.0`, `uglify-js@3.4.9`, `webpack@4.17.2`)

<h2 id="20180821-version-511">2018-08-21, version 5.1.1 <a href="#20180821-version-511" title="Permalink">#</a></h2>

- Function `isNumeric` now recognizes more types.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1214">#1214</a>: functions `sqrt`, `max`, `min`, `var`, `std`, `mode`, `mad`,
  `median`, and `partitionSelect` not neatly handling `NaN` inputs. In some
  cases (`median`, `mad`, and `partitionSelect`) this resulted in an infinite
  loop.
- Upgraded dependencies (`escape-latex@1.1.1`)
- Upgraded devDependencies (`webpack@4.17.0`)

<h2 id="20180812-version-510">2018-08-12, version 5.1.0 <a href="#20180812-version-510" title="Permalink">#</a></h2>

- Implemented support for strings enclosed in single quotes.
  Thanks <a href="https://github.com/jean-emmanuel">@jean-emmanuel</a>.
- Implemented function `getMatrixDataType`. Thanks <a href="https://github.com/JasonShin">@JasonShin</a>.
- Implemented new `options` argument in `simplify`. Thanks <a href="https://github.com/paulobuchsbaum">@paulobuchsbaum</a>.
- Bug fixes in `rationalize`, see <a href="https://github.com/josdejong/mathjs/issues/1173">#1173</a>. Thanks <a href="https://github.com/paulobuchsbaum">@paulobuchsbaum</a>.

<h2 id="20180722-version-504">2018-07-22, version 5.0.4 <a href="#20180722-version-504" title="Permalink">#</a></h2>

- Strongly improved the performance of functions `factorial` for numbers.
  This improves performance of functions `gamma`, `permutation`, and
  `combination` too. See <a href="https://github.com/josdejong/mathjs/issues/1170">#1170</a>. Thanks <a href="https://github.com/honeybar">@honeybar</a>.
- Strongly improved the performance of function `reshape`, thanks to a
  friend of <a href="https://github.com/honeybar">@honeybar</a>.

<h2 id="20180714-version-503">2018-07-14, version 5.0.3 <a href="#20180714-version-503" title="Permalink">#</a></h2>

- Fixed many functions (for example `add` and `subtract`) not working
  with matrices having a `datatype` defined.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1147">#1147</a>: bug in `format` with `engineering` notation in outputting
  the correct number of significant figures. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1162">#1162</a>: transform functions not being cleaned up when overriding
  it by importing a factory function with the same name.
- Fixed broken links in the documentation. Thanks <a href="https://github.com/stropitek">@stropitek</a>.
- Refactored the code of `parse` into a functional approach.
  Thanks <a href="https://github.com/harrysarson">@harrysarson</a>.
- Changed `decimal.js` import to ES6. Thanks <a href="https://github.com/weinshel">@weinshel</a>.

<h2 id="20180707-version-502">2018-07-07, version 5.0.2 <a href="#20180707-version-502" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1136">#1136</a>: rocket trajectory example broken (since v4.0.0).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1137">#1137</a>: `simplify` unnecessarily replacing implicit multiplication with
  explicit multiplication.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1146">#1146</a>: `rationalize` throwing exceptions for some input with decimals.
  Thanks <a href="https://github.com/maruta">@maruta</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1088">#1088</a>: function arguments not being passed to `rawArgs` functions.
- Fixed advanced example `add_new_datatypes`.
- Fixed mathjs core constants not working without complex numbers.
  Thanks <a href="https://github.com/ChristopherChudzicki">@ChristopherChudzicki</a>.
- Fixed a broken link in the documentation on units. Thanks <a href="https://github.com/stropitek">@stropitek</a>.
- Upgraded dependencies (`typed-function@1.0.4`, `complex.js@2.0.11`).
- Upgraded devDependencies (`babel-loader@7.1.5`, `uglify-js@3.4.3`,
  `expr-eval@1.2.2`, `webpack@4.15.1`).

<h2 id="20180701-version-501">2018-07-01, version 5.0.1 <a href="#20180701-version-501" title="Permalink">#</a></h2>

- Improved error messaging when converting units. Thanks <a href="https://github.com/gap777">@gap777</a>.
- Upgraded devDependencies (`kerma`, `uglify-js`, `webpack`).

<h2 id="20180616-version-500">2018-06-16, version 5.0.0 <a href="#20180616-version-500" title="Permalink">#</a></h2>

!!! BE CAREFUL: BREAKING CHANGES !!!

- Implemented complex conjugate transpose `math.ctranspose`. See <a href="https://github.com/josdejong/mathjs/issues/1097">#1097</a>.
  Thanks <a href="https://github.com/jackschmidt">@jackschmidt</a>.
- Changed the behavior of `A'` (transpose) in the expression parser to
  calculate the complex conjugate transpose. See <a href="https://github.com/josdejong/mathjs/issues/1097">#1097</a>. Thanks <a href="https://github.com/jackschmidt">@jackschmidt</a>.
- Added support for `complex({abs: 1, arg: 1})`, and improved the docs on
  complex numbers. Thanks <a href="https://github.com/ssaket">@ssaket</a>.
- Renamed `eye` to `identity`, see <a href="https://github.com/josdejong/mathjs/issues/1054">#1054</a>.
- Math.js code can now contain ES6. The ES6 source code is moved from `lib`
  to `src`, and `lib` now contains the compiled ES5 code.
- Upgraded dependencies:
  - `decimal.js` from `9.0.1` to `10.0.1`
  - Upgraded dev dependencies
- Changed code style to <https://standardjs.com/>, run linter on `npm test`.
  See <a href="https://github.com/josdejong/mathjs/issues/1110">#1110</a>.
- Dropped support for bower. Use npm or an other package manages instead.
- Dropped support for (non-primitive) instances of `Number`, `Boolean`, and
  `String` from functions `clone` and `typeof`.
- Dropped official support for IE9 (probably still works, but it's not tested).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/851">#851</a>: More consistent behavior of sqrt, nthRoot, and pow.
  Thanks <a href="https://github.com/dakotablair">@dakotablair</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1103">#1103</a>: Calling `toTex` on node that contains `derivative` causing
  an exception. Thanks <a href="https://github.com/joelhoover">@joelhoover</a>.

<h2 id="20180602-version-442">2018-06-02, version 4.4.2 <a href="#20180602-version-442" title="Permalink">#</a></h2>

- Drastically improved the performance of `det`. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1065">#1065</a>, <a href="https://github.com/josdejong/mathjs/issues/1121">#1121</a>: Fixed wrong documentation of function
  `compareNatural` and clarified the behavior for strings.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1122">#1122</a> a regression in function `inv` (since `v4.4.1`).
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h2 id="20180529-version-441">2018-05-29, version 4.4.1 <a href="#20180529-version-441" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1109">#1109</a>: a bug in `inv` when dealing with values close to zero.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h2 id="20180528-version-440">2018-05-28, version 4.4.0 <a href="#20180528-version-440" title="Permalink">#</a></h2>

- Implemented functions `equalText` and `compareText`. See <a href="https://github.com/josdejong/mathjs/issues/1085">#1085</a>.

<h2 id="20180521-version-430">2018-05-21, version 4.3.0 <a href="#20180521-version-430" title="Permalink">#</a></h2>

- Implemented matrix exponential `math.expm`. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1101">#1101</a>: math.js bundle not working when loading in a WebWorker.
- Upgraded dependencies
  - `complex.js` from `v2.0.2` to `v2.0.10`.
  - `fraction.js` from `v4.0.4` to `v4.0.8`.
- Upgraded devDependencies (`mocha`, `uglify-js`, `webpack`).

<h2 id="20180505-version-422">2018-05-05, version 4.2.2 <a href="#20180505-version-422" title="Permalink">#</a></h2>

- Fixed calculating the Frobenius norm of complex matrices correctly,
  see <a href="https://github.com/josdejong/mathjs/issues/1098">#1098</a>. Thanks <a href="https://github.com/jackschmidt">@jackschmidt</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1076">#1076</a>: cannot use mathjs in React VR by updating to
  `escape-latex@1.0.3`.

<h2 id="20180502-version-421">2018-05-02, version 4.2.1 <a href="#20180502-version-421" title="Permalink">#</a></h2>

- Fixed `dist/math.js` being minified.

<h2 id="20180502-version-420">2018-05-02, version 4.2.0 <a href="#20180502-version-420" title="Permalink">#</a></h2>

- Implemented function `math.sqrtm`. Thanks <a href="https://github.com/ferrolho">@ferrolho</a>.
- Implemented functions `math.log2`, `math.log1p`, and `math.expm1`.
  Thanks <a href="https://github.com/BigFav">@BigFav</a> and <a href="https://github.com/harrysarson">@harrysarson</a>.
- Fixed some unit tests broken on nodejs v10.
- Upgraded development dependencies.
- Dropped integration testing on nodejs v4.

<h2 id="20180418-version-412">2018-04-18, version 4.1.2 <a href="#20180418-version-412" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1082">#1082</a>: implemented support for unit plurals `decades`, `centuries`,
  and `millennia`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1083">#1083</a>: units `decade` and `watt` having a wrong name when stringifying.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.

<h2 id="20180411-version-411">2018-04-11, version 4.1.1 <a href="#20180411-version-411" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1063">#1063</a>: derivative not working when resolving a variable with unary
  minus like `math.derivative('-x', 'x')`.

<h2 id="20180408-version-410">2018-04-08, version 4.1.0 <a href="#20180408-version-410" title="Permalink">#</a></h2>

- Extended function `math.print` with support for arrays and matrices.
  Thanks <a href="https://github.com/jean-emmanuel">@jean-emmanuel</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1077">#1077</a>: Serialization/deserialization to JSON with reviver not being
  supported by nodes.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1016">#1016</a>: Extended `math.typeof` with support for `ResultSet` and nodes
  like `SymbolNode`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1072">#1072</a>: Added support for long and short prefixes for the unit `bar`
  (i.e. `millibar` and `mbar`).

<h2 id="20180317-version-401">2018-03-17, version 4.0.1 <a href="#20180317-version-401" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1062">#1062</a>: mathjs not working on ES5 browsers like IE11 and Safari 9.3.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1061">#1061</a>: `math.unit` not accepting input like `1/s`.

<h2 id="20180225-version-400">2018-02-25, version 4.0.0 <a href="#20180225-version-400" title="Permalink">#</a></h2>

!!! BE CAREFUL: BREAKING CHANGES !!!

Breaking changes (see also <a href="https://github.com/josdejong/mathjs/issues/682">#682</a>):

- **New expression compiler**

    The compiler of the expression parser is replaced with one that doesn't use
    `eval` internally. See <a href="https://github.com/josdejong/mathjs/issues/1019">#1019</a>. This means:

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
      SymbolNodes in the expression parser. See <a href="https://github.com/josdejong/mathjs/issues/833">#833</a>.

- **Implicit multiplication**

  - Changed the behavior of implicit multiplication to have higher
      precedence than explicit multiplication and division, except in
      a number of specific cases. This gives a more natural behavior
      for implicit multiplications. For example `24h / 6h` now returns `4`,
      whilst `1/2 kg` evaluates to `0.5 kg`. Thanks <a href="https://github.com/ericman314">@ericman314</a>. See: <a href="https://github.com/josdejong/mathjs/issues/792">#792</a>.
      Detailed documentation: <https://github.com/josdejong/mathjs/blob/v4/docs/expressions/syntax.md#implicit-multiplication>.

  - Immediately invoking a function returned by a function like `partialAdd(2)(3)`
      is no longer supported, instead these expressions are evaluated as
      an implicit multiplication `partialAdd(2) * (3)`. See <a href="https://github.com/josdejong/mathjs/issues/1035">#1035</a>.

- **String formatting**

  - In function `math.format`, the options `{exponential: {lower: number, upper: number}}`
      (where `lower` and `upper` are values) are replaced with `{lowerExp: number, upperExp: number}`
      (where `lowerExp` and `upperExp` are exponents). See <a href="https://github.com/josdejong/mathjs/issues/676">#676</a>. For example:

      ```js
      math.format(2000, {exponential: {lower: 1e-2, upper: 1e2}})
      ```

      is now:

      ```js
      math.format(2000, {lowerExp: -2, upperExp: 2})
      ```

  - In function `math.format`, the option `notation: 'fixed'` no longer rounds to
      zero digits  when no precision is specified: it leaves the digits as is.
      See <a href="https://github.com/josdejong/mathjs/issues/676">#676</a>.

- **String comparison**

    Changed the behavior of relational functions (`compare`, `equal`,
    `equalScalar`, `larger`, `largerEq`, `smaller`, `smallerEq`, `unequal`)
    to compare strings by their numeric value they contain instead of
    alphabetically. This also impacts functions `deepEqual`, `sort`, `min`,
    `max`, `median`, and `partitionSelect`. Use `compareNatural` if you
    need to sort an array with text. See <a href="https://github.com/josdejong/mathjs/issues/680">#680</a>.

- **Angle units**

    Changed `rad`, `deg`, and `grad` to have short prefixes,
    and introduced `radian`, `degree`, and `gradian` and their plurals
    having long prefixes. See <a href="https://github.com/josdejong/mathjs/issues/749">#749</a>.

- **Null**

  - `null` is no longer implicitly casted to a number `0`, so input like
      `math.add(2, null)` is no longer supported. See <a href="https://github.com/josdejong/mathjs/issues/830">#830</a>, <a href="https://github.com/josdejong/mathjs/issues/353">#353</a>.

  - Dropped constant `uninitialized`, which was used to initialize
      leave new entries undefined when resizing a matrix is removed.
      Use `undefined` instead to indicate entries that are not explicitly
      set. See <a href="https://github.com/josdejong/mathjs/issues/833">#833</a>.

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
  See <a href="https://github.com/josdejong/mathjs/issues/401">#401</a>.
- Implemented additional methods `isUnary()` and `isBinary()` on
  `OperatorNode`. See <a href="https://github.com/josdejong/mathjs/issues/1025">#1025</a>.
- Improved error messages for statistical functions.
- Upgraded devDependencies.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1014">#1014</a>: `derivative` silently dropping additional arguments
  from operator nodes with more than two arguments.

<h2 id="20180207-version-3202">2018-02-07, version 3.20.2 <a href="#20180207-version-3202" title="Permalink">#</a></h2>

- Upgraded to `typed-function@0.10.7` (bug-fix release).
- Fixed option `implicit` not being copied from an `OperatorNode`
  when applying function `map`. Thanks <a href="https://github.com/HarrySarson">@HarrySarson</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/995">#995</a>: spaces and underscores not property being escaped
  in `toTex()`. Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.

<h2 id="20180117-version-3201">2018-01-17, version 3.20.1 <a href="#20180117-version-3201" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1018">#1018</a>: `simplifyCore` failing in some cases with parentheses.
  Thanks <a href="https://github.com/firepick1">@firepick1</a>.

<h2 id="20180114-version-3200">2018-01-14, version 3.20.0 <a href="#20180114-version-3200" title="Permalink">#</a></h2>

- Implement support for 3 or more arguments for operators `+` and `*` in
  `derivative`. Thanks <a href="https://github.com/HarrySarson">@HarrySarson</a>. See <a href="https://github.com/josdejong/mathjs/issues/1002">#1002</a>.
- Fixed `simplify` evalution of `simplify` of functions with more than two
  arguments wrongly: `simplify('f(x, y, z)') evaluated to`f(f(x, y), z)`
  instead of `f(x, y, z)`. Thanks <a href="https://github.com/joelhoover">@joelhoover</a>.
- Fixed `simplify` throwing an error in some cases when simplifying unknown
  functions, for example `simplify('f(4)')`. Thanks <a href="https://github.com/joelhoover">@joelhoover</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1013">#1013</a>: `simplify` wrongly simplifing some expressions containing unary
  minus, like `0 - -x`. Thanks <a href="https://github.com/joelhoover">@joelhoover</a>.
- Fixed an error in an example in the documentation of `xor`. Thanks <a href="https://github.com/denisx">@denisx</a>.

<h2 id="20180106-version-3190">2018-01-06, version 3.19.0 <a href="#20180106-version-3190" title="Permalink">#</a></h2>

- Extended functions `distance` and `intersect` with support for BigNumbers.
  Thanks <a href="https://github.com/ovk">@ovk</a>.
- Improvements in function `simplify`: added a rule that allows combining
  of like terms in embedded quantities. Thanks <a href="https://github.com/joelhoover">@joelhoover</a>.

<h2 id="20171228-version-3181">2017-12-28, version 3.18.1 <a href="#20171228-version-3181" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/998">#998</a>: An issue with simplifying an expression containing a subtraction.
  Thanks <a href="https://github.com/firepick1">@firepick1</a>.

<h2 id="20171216-version-3180">2017-12-16, version 3.18.0 <a href="#20171216-version-3180" title="Permalink">#</a></h2>

- Implemented function `rationalize`. Thanks <a href="https://github.com/paulobuchsbaum">@paulobuchsbaum</a>.
- Upgraded dependencies:

  ```
  decimal.js    7.2.3  →  9.0.1 (no breaking changes affecting mathjs)
  fraction.js   4.0.2  →  4.0.4
  tiny-emitter  2.0.0  →  2.0.2
  ```

- Upgraded dev dependencies.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/975">#975</a>: a wrong example in the docs of lusolve.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/983">#983</a>: `pickRandom` returning an array instead of single value
  when input was an array with just one value. Clarified docs.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/969">#969</a>: preven issues with yarn autoclean by renaming an
  interally used folder "docs" to "embeddedDocs".

<h2 id="20171118-version-3170">2017-11-18, version 3.17.0 <a href="#20171118-version-3170" title="Permalink">#</a></h2>

- Improved `simplify` for nested exponentiations. Thanks <a href="https://github.com/IvanVergiliev">@IvanVergiliev</a>.
- Fixed a security issue in `typed-function` allowing arbitrary code execution
  in the JavaScript engine by creating a typed function with JavaScript code
  in the name. Thanks Masato Kinugawa.
- Fixed a security issue where forbidden properties like constructor could be
  replaced by using unicode characters when creating an object. No known exploit,
  but could possibly allow arbitrary code execution. Thanks Masato Kinugawa.

<h2 id="20171018-version-3165">2017-10-18, version 3.16.5 <a href="#20171018-version-3165" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/954">#954</a>: Functions `add` and `multiply` not working when
  passing three or more arrays or matrices.

<h2 id="20171001-version-3164">2017-10-01, version 3.16.4 <a href="#20171001-version-3164" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/948">#948</a>, <a href="https://github.com/josdejong/mathjs/issues/949">#949</a>: function `simplify` returning wrong results or
  running into an infinite recursive loop. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed many small issues in the embedded docs.  Thanks <a href="https://github.com/Schnark">@Schnark</a>.

<h2 id="20170828-version-3163">2017-08-28, version 3.16.3 <a href="#20170828-version-3163" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/934">#934</a>: Wrong simplification of unary minus. Thanks <a href="https://github.com/firepick1">@firepick1</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/933">#933</a>: function `simplify` reordering operations. Thanks <a href="https://github.com/firepick1">@firepick1</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/930">#930</a>: function `isNaN` returning wrong result for complex
  numbers having just one of their parts (re/im) being `NaN`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/929">#929</a>: `FibonacciHeap.isEmpty` returning wrong result.

<h2 id="20170820-version-3162">2017-08-20, version 3.16.2 <a href="#20170820-version-3162" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/924">#924</a>: a regression in `simplify` not accepting the signature
  `simplify(expr, rules, scope)` anymore. Thanks <a href="https://github.com/firepick1">@firepick1</a>.
- Fixed missing parenthesis when stringifying expressions containing
  implicit multiplications (see <a href="https://github.com/josdejong/mathjs/issues/922">#922</a>). Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.

<h2 id="20170812-version-3161">2017-08-12, version 3.16.1 <a href="#20170812-version-3161" title="Permalink">#</a></h2>

- For security reasons, type checking is now done in a more strict
  way using functions like `isComplex(x)` instead of duck type checking
  like `x && x.isComplex === true`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/915">#915</a>: No access to property "name".
- Fixed <a href="https://github.com/josdejong/mathjs/issues/901">#901</a>: Simplify units when calling `unit.toNumeric()`.
  Thanks <a href="https://github.com/AlexanderBeyn">@AlexanderBeyn</a>.
- Fixed `toString` of a parsed expression tree containing an
  immediately invoked function assignment not being wrapped in
  parenthesis (for example `(f(x) = x^2)(4)`).

<h2 id="20170806-version-3160">2017-08-06, version 3.16.0 <a href="#20170806-version-3160" title="Permalink">#</a></h2>

- Significant performance improvements in `math.simplify`.
  Thanks <a href="https://github.com/firepick1">@firepick1</a>.
- Improved API for `math.simplify`, optionally pass a scope with
  variables which are resolved, see <a href="https://github.com/josdejong/mathjs/issues/907">#907</a>. Thanks <a href="https://github.com/firepick1">@firepick1</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/912">#912</a>: math.js didn't work on IE10 anymore (regression
  since 3.15.0).

<h2 id="20170729-version-3150">2017-07-29, version 3.15.0 <a href="#20170729-version-3150" title="Permalink">#</a></h2>

- Added support for the dollar character `$` in symbol names (see <a href="https://github.com/josdejong/mathjs/issues/895">#895</a>).
- Allow objects with prototypes as scope again in the expression parser,
  this was disabled for security reasons some time ago. See <a href="https://github.com/josdejong/mathjs/issues/888">#888</a>, <a href="https://github.com/josdejong/mathjs/issues/899">#899</a>.
  Thanks <a href="https://github.com/ThomasBrierley">@ThomasBrierley</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/846">#846</a>: Issues in the functions `map`, `forEach`, and `filter`
  when used in the expression parser:
  - Not being able to use a function assignment as inline expression
    for the callback function.
  - Not being able to pass an inline expression as callback for `map`
    and `forEach`.
  - Index and original array/matrix not passed in `map` and `filter`.

<h2 id="20170705-version-3142">2017-07-05, version 3.14.2 <a href="#20170705-version-3142" title="Permalink">#</a></h2>

- Upgraded to `fraction.js@4.0.2`
- Fixed <a href="https://github.com/josdejong/mathjs/issues/891">#891</a> using BigNumbers not working in browser environments.

<h2 id="20170630-version-3141">2017-06-30, version 3.14.1 <a href="#20170630-version-3141" title="Permalink">#</a></h2>

- Reverted to `fraction.js@4.0.0`, there is an issue with `4.0.1`
  in the browser.

<h2 id="20170630-version-3140">2017-06-30, version 3.14.0 <a href="#20170630-version-3140" title="Permalink">#</a></h2>

- Implemented set methods `setCartesian`, `setDifference`,
  `setDistinct`, `setIntersect`, `setIsSubset`, `setPowerset`,
  `setSize`. Thanks <a href="https://github.com/Nekomajin42">@Nekomajin42</a>.
- Implemented method `toHTML` on nodes. Thanks <a href="https://github.com/Nekomajin42">@Nekomajin42</a>.
- Implemented `compareNatural` and `sort([...], 'natural')`.
- Upgraded dependencies to the latest versions:
  - `complex.js@2.0.4`
  - `decimal.js@7.2.3`
  - `fraction.js@4.0.1`
  - `tiny-emitter@2.0.0`
  - And all devDependencies.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/865">#865</a>: `splitUnit` can now deal with round-off errors.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/876">#876</a>: incorrect definition for unit `erg`. Thanks <a href="https://github.com/pjhampton">@pjhampton</a>.
- More informative error message when using single quotes instead of
  double quotes around a string. Thanks <a href="https://github.com/HarrySarson">@HarrySarson</a>.

<h2 id="20170527-version-3133">2017-05-27, version 3.13.3 <a href="#20170527-version-3133" title="Permalink">#</a></h2>

- Fixed a bug in function `intersection` of line and plane.
  Thanks <a href="https://github.com/viclai">@viclai</a>.
- Fixed security vulnerabilities.

<h2 id="20170526-version-3132">2017-05-26, version 3.13.2 <a href="#20170526-version-3132" title="Permalink">#</a></h2>

- Disabled function `chain` inside the expression parser for security
  reasons (it's not needed there anyway).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/856">#856</a>: function `subset` not returning non-primitive scalars
  from Arrays correctly. (like `math.eval('arr[1]', {arr: [math.bignumber(2)]})`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/861">#861</a>: physical constants not available in the expression parser.

<h2 id="20170512-version-3131">2017-05-12, version 3.13.1 <a href="#20170512-version-3131" title="Permalink">#</a></h2>

- Fixed creating units with an alias not working within the expression
  parser.
- Fixed security vulnerabilities. Thanks Sam.

<h2 id="20170512-version-3130">2017-05-12, version 3.13.0 <a href="#20170512-version-3130" title="Permalink">#</a></h2>

- Command line application can now evaluate inline expressions
  like `mathjs 1+2`. Thanks <a href="https://github.com/slavaGanzin">@slavaGanzin</a>.
- Function `derivative` now supports `abs`. Thanks <a href="https://github.com/tetslee">@tetslee</a>.
- Function `simplify` now supports BigNumbers. Thanks <a href="https://github.com/tetslee">@tetslee</a>.
- Prevent against endless loops in `simplify`. Thanks <a href="https://github.com/tetslee">@tetslee</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/813">#813</a>: function `simplify` converting small numbers to inexact
  Fractions. Thanks <a href="https://github.com/tetslee">@tetslee</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/838">#838</a>: Function `simplify` now supports constants like `e`.
  Thanks <a href="https://github.com/tetslee">@tetslee</a>.

<h2 id="20170505-version-3123">2017-05-05, version 3.12.3 <a href="#20170505-version-3123" title="Permalink">#</a></h2>

- Fixed security vulnerabilities. Thanks Dan and Sam.

<h2 id="20170430-version-3122">2017-04-30, version 3.12.2 <a href="#20170430-version-3122" title="Permalink">#</a></h2>

- Added a rocket trajectory optimization example.

<h2 id="20170424-version-3121">2017-04-24, version 3.12.1 <a href="#20170424-version-3121" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/804">#804</a>
  - Improved handling of powers of `Infinity`. Thanks <a href="https://github.com/HarrySarson">@HarrySarson</a>.
  - Fixed wrong formatting of complex NaN.
- Fixed security vulnerabilities in the expression parser.
  Thanks Sam and Dan.

<h2 id="20170417-version-3120">2017-04-17, version 3.12.0 <a href="#20170417-version-3120" title="Permalink">#</a></h2>

- Implemented QR decomposition, function `math.qr`. Thanks <a href="https://github.com/HarrySarson">@HarrySarson</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/824">#824</a>: Calling `math.random()` freezes IE and node.js.

<h2 id="20170408-version-3115">2017-04-08, version 3.11.5 <a href="#20170408-version-3115" title="Permalink">#</a></h2>

- More security measures in the expression parser.
  WARNING: the behavior of the expression parser is now more strict,
  some undocumented features may not work any longer.
  - Accessing and assigning properties is now only allowed on plain
    objects, not on classes, arrays, and functions anymore.
  - Accessing methods is restricted to a set of known, safe methods.

<h2 id="20170403-version-3114">2017-04-03, version 3.11.4 <a href="#20170403-version-3114" title="Permalink">#</a></h2>

- Fixed a security vulnerability in the expression parser. Thanks <a href="https://github.com/xfix">@xfix</a>.

<h2 id="20170403-version-3113">2017-04-03, version 3.11.3 <a href="#20170403-version-3113" title="Permalink">#</a></h2>

- Fixed a security vulnerability in the expression parser. Thanks <a href="https://github.com/xfix">@xfix</a>.

<h2 id="20170403-version-3112">2017-04-03, version 3.11.2 <a href="#20170403-version-3112" title="Permalink">#</a></h2>

- Fixed a security vulnerability in the expression parser. Thanks <a href="https://github.com/xfix">@xfix</a>.

<h2 id="20170402-version-3111">2017-04-02, version 3.11.1 <a href="#20170402-version-3111" title="Permalink">#</a></h2>

- Fixed security vulnerabilities in the expression parser.
  Thanks Joe Vennix and <a href="https://github.com/xfix">@xfix</a>.

<h2 id="20170402-version-3110">2017-04-02, version 3.11.0 <a href="#20170402-version-3110" title="Permalink">#</a></h2>

- Implemented method Unit.toSI() to convert a unit to base SI units.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/821">#821</a>, <a href="https://github.com/josdejong/mathjs/issues/822">#822</a>: security vulnerabilities in the expression parser.
  Thanks <a href="https://github.com/comex">@comex</a> and <a href="https://github.com/xfix">@xfix</a>.

<h2 id="20170331-version-3103">2017-03-31, version 3.10.3 <a href="#20170331-version-3103" title="Permalink">#</a></h2>

- More security fixes related to the ones fixed in `v3.10.2`.

<h2 id="20170331-version-3102">2017-03-31, version 3.10.2 <a href="#20170331-version-3102" title="Permalink">#</a></h2>

- Fixed a security vulnerability in the expression parser allowing
  execution of arbitrary JavaScript. Thanks <a href="https://github.com/CapacitorSet">@CapacitorSet</a> and <a href="https://github.com/denvit">@denvit</a>.

<h2 id="20170326-version-3101">2017-03-26, version 3.10.1 <a href="#20170326-version-3101" title="Permalink">#</a></h2>

- Fixed `xgcd` for negative values. Thanks <a href="https://github.com/litmit">@litmit</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/807">#807</a>: function transform of existing functions not being removed when
  overriding such a function.

<h2 id="20170305-version-3100">2017-03-05, version 3.10.0 <a href="#20170305-version-3100" title="Permalink">#</a></h2>

- Implemented function `reshape`. Thanks <a href="https://github.com/patgrasso">@patgrasso</a> and <a href="https://github.com/ericman314">@ericman314</a>.
- Implemented configuration option `seedRandom` for deterministic random
  numbers. Thanks <a href="https://github.com/morsecodist">@morsecodist</a>.
- Small fixes in the docs. Thanks <a href="https://github.com/HarrySarson">@HarrySarson</a>.
- Dropped support for component package manager (which became deprecated about
  one and a half year ago).

<h2 id="20170222-version-393">2017-02-22, version 3.9.3 <a href="#20170222-version-393" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/797">#797</a>: issue with production builds of React Native projects.
- Fixed `math.round` not accepting inputs `NaN`, `Infinity`, `-Infinity`.
- Upgraded all dependencies.

<h2 id="20170216-version-392">2017-02-16, version 3.9.2 <a href="#20170216-version-392" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/795">#795</a>: Parse error in case of a multi-line expression with just comments.

<h2 id="20170206-version-391">2017-02-06, version 3.9.1 <a href="#20170206-version-391" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/789">#789</a>: Math.js not supporting conversion of `string` to `BigNumber`,
  `Fraction`, or `Complex` number.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/790">#790</a>: Expression parser did not pass function arguments of enclosing
  functions via `scope` to functions having `rawArgs = true`.
- Small fixes in the docs. Thanks <a href="https://github.com/HarrySarson">@HarrySarson</a>.

<h2 id="20170123-version-390">2017-01-23, version 3.9.0 <a href="#20170123-version-390" title="Permalink">#</a></h2>

- Implemented support for algebra: powerful new functions `simplify` and
  `derivative`. Thanks <a href="https://github.com/ericman314">@ericman314</a>, <a href="https://github.com/tetslee">@tetslee</a>, and <a href="https://github.com/BigFav">@BigFav</a>.
- Implemented Kronecker Product `kron`. Thanks <a href="https://github.com/adamisntdead">@adamisntdead</a>.
- Reverted `FunctionNode` not accepting a string as function name anymore.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/765">#765</a>: `FunctionAssignmentNode.toString()` returning a string
  incompatible with the function assignment syntax.

<h2 id="20161215-version-381">2016-12-15, version 3.8.1 <a href="#20161215-version-381" title="Permalink">#</a></h2>

- Implemented function `mad` (median absolute deviation). Thanks <a href="https://github.com/ruhleder">@ruhleder</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/762">#762</a>: expression parser failing to invoke a function returned
  by a function.

<h2 id="20161118-version-380">2016-11-18, version 3.8.0 <a href="#20161118-version-380" title="Permalink">#</a></h2>

- Functions `add` and `multiply` now accept more than two arguments. See <a href="https://github.com/josdejong/mathjs/issues/739">#739</a>.
- `OperatorNode` now supports more than two arguments. See <a href="https://github.com/josdejong/mathjs/issues/739">#739</a>. Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Implemented a method `Node.cloneDeep` for the expression nodes. See <a href="https://github.com/josdejong/mathjs/issues/745">#745</a>.
- Fixed a bug in `Node.clone()` not cloning implicit multiplication correctly.
  Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/737">#737</a>: Improved algorithm determining the best prefix for units.
  It will now retain the original unit like `1 cm` when close enough,
  instead of returning `10 mm`. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/732">#732</a>: Allow letter-like unicode characters like Ohm `\u2126`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/749">#749</a>: Units `rad`, `deg`, and `grad` can now have prefixes like `millirad`.
- Some fixes in the docs and comments of examples. Thanks <a href="https://github.com/HarrySarson">@HarrySarson</a>.

<h2 id="20161105-version-370">2016-11-05, version 3.7.0 <a href="#20161105-version-370" title="Permalink">#</a></h2>

- Implemented method `Node.equals(other)` for all nodes of the expression parser.
- Implemented BigNumber support in function `arg()`.
- Command Line Interface loads faster.
- Implicit conversions between Fractions and BigNumbers throw a neat error now
  (See <a href="https://github.com/josdejong/mathjs/issues/710">#710</a>).

<h2 id="20161021-version-360">2016-10-21, version 3.6.0 <a href="#20161021-version-360" title="Permalink">#</a></h2>

- Implemented function `erf()`. THanks <a href="https://github.com/patgrasso">@patgrasso</a>.
- Extended function `cross()` to support n-d vectors. Thanks <a href="https://github.com/patgrasso">@patgrasso</a>.
- Extended function `pickRandom` with the option to pick multiple values from
  an array and give the values weights: `pickRandom(possibles, number, weights)`.
  Thanks <a href="https://github.com/woylie">@woylie</a>.
- Parser now exposes test functions like `isAlpha` which can be replaced in
  order to adjust the allowed characters in variables names (See <a href="https://github.com/josdejong/mathjs/issues/715">#715</a>).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/727">#727</a>: Parser not throwing an error for invalid implicit multiplications
  like `-2 2` and `2^3 4` (right after the second value of an operator).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/688">#688</a>: Describe allowed variable names in the docs.

<h2 id="20160921-version-353">2016-09-21, version 3.5.3 <a href="#20160921-version-353" title="Permalink">#</a></h2>

- Some more fixes regarding numbers ending with a decimal mark (like `2.`).

<h2 id="20160920-version-352">2016-09-20, version 3.5.2 <a href="#20160920-version-352" title="Permalink">#</a></h2>

- Fixed numbers ending with a decimal mark (like `2.`) not being supported by
  the parser, solved the underlying ambiguity in the parser. See <a href="https://github.com/josdejong/mathjs/issues/707">#707</a>, <a href="https://github.com/josdejong/mathjs/issues/711">#711</a>.

<h2 id="20160912-version-351">2016-09-12, version 3.5.1 <a href="#20160912-version-351" title="Permalink">#</a></h2>

- Removed a left over console.log statement. Thanks <a href="https://github.com/eknkc">@eknkc</a>.

<h2 id="20160907-version-350">2016-09-07, version 3.5.0 <a href="#20160907-version-350" title="Permalink">#</a></h2>

- Comments of expressions are are now stored in the parsed nodes. See <a href="https://github.com/josdejong/mathjs/issues/690">#690</a>.
- Fixed function `print` not accepting an Object with formatting options as
  third parameter Thanks <a href="https://github.com/ThomasBrierley">@ThomasBrierley</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/707">#707</a>: The expression parser no longer accepts numbers ending with a dot
  like `2.`.

<h2 id="20160808-version-341">2016-08-08, version 3.4.1 <a href="#20160808-version-341" title="Permalink">#</a></h2>

- Fixed broken bundle files (`dist/math.js`, `dist/math.min.js`).
- Fixed some layout issues in the function reference docs.

<h2 id="20160807-version-340">2016-08-07, version 3.4.0 <a href="#20160807-version-340" title="Permalink">#</a></h2>

- Implemented support for custom units using `createUnit`. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Implemented function `splitUnits`. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Implemented function `isPrime`. Thanks <a href="https://github.com/MathBunny">@MathBunny</a>.

<h2 id="20160705-version-330">2016-07-05, version 3.3.0 <a href="#20160705-version-330" title="Permalink">#</a></h2>

- Implemented function `isNaN`.
- Function `math.filter` now passes three arguments to the callback function:
  value, index, and array.
- Removed the check on the number of arguments from functions defined in the
  expression parser (see <a href="https://github.com/josdejong/mathjs/issues/665">#665</a>).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/665">#665</a>: functions `map`, `forEach`, and `filter` now invoke callbacks
  which are a typed-function with the correct number of arguments.

<h2 id="20160426-version-321">2016-04-26, version 3.2.1 <a href="#20160426-version-321" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/651">#651</a>: unable to perform calculations on "Unit-less" units.
- Fixed matrix.subset mutating the replacement matrix when unsqueezing it.

<h2 id="20160416-version-320">2016-04-16, version 3.2.0 <a href="#20160416-version-320" title="Permalink">#</a></h2>

- Implemented <a href="https://github.com/josdejong/mathjs/issues/644">#644</a>: method `Parser.getAll()` to retrieve all defined variables.
- Upgraded dependencies (decimal.js@5.0.8, fraction.js@3.3.1,
  typed-function@0.10.4).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/601">#601</a>: Issue with unnamed typed-functions by upgrading to
  typed-function v0.10.4.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/636">#636</a>: More strict `toTex` templates, reckon with number of arguments.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/641">#641</a>: Bug in expression parser parsing implicit multiplication with
  wrong precedence in specific cases.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/645">#645</a>: Added documentation about `engineering` notation of function
  `math.format`.

<h2 id="20160403-version-314">2016-04-03, version 3.1.4 <a href="#20160403-version-314" title="Permalink">#</a></h2>

- Using ES6 Math functions like `Math.sinh`, `Math.cbrt`, `Math.sign`, etc when
  available.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/631">#631</a>: unit aliases `weeks`, `months`, and `years` where missing.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/632">#632</a>: problem with escaped backslashes at the end of strings.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/635">#635</a>: `Node.toString` options where not passed to function arguments.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/629">#629</a>: expression parser throws an error when passing a number with
  decimal exponent instead of parsing them as implicit multiplication.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/484">#484</a>, <a href="https://github.com/josdejong/mathjs/issues/555">#555</a>: inaccuracy of `math.sinh` for values between -1 and 1.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/625">#625</a>: Unit `in` (`inch`) not always working due to ambiguity with
  the operator `a in b` (alias of `a to b`).

<h2 id="20160324-version-313">2016-03-24, version 3.1.3 <a href="#20160324-version-313" title="Permalink">#</a></h2>

- Fix broken bundle.

<h2 id="20160324-version-312">2016-03-24, version 3.1.2 <a href="#20160324-version-312" title="Permalink">#</a></h2>

- Fix broken npm release.

<h2 id="20160324-version-311">2016-03-24, version 3.1.1 <a href="#20160324-version-311" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/621">#621</a>: a bug in parsing implicit multiplications like `(2)(3)+4`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/623">#623</a>: `nthRoot` of zero with a negative root returned `0` instead of
  `Infinity`.
- Throw an error when functions `min`, `max`, `mean`, or `median` are invoked
  with multiple matrices as arguments (see <a href="https://github.com/josdejong/mathjs/issues/598">#598</a>).

<h2 id="20160319-version-310">2016-03-19, version 3.1.0 <a href="#20160319-version-310" title="Permalink">#</a></h2>

- Hide multiplication operator by default when outputting `toTex` and `toString`
  for implicit multiplications. Implemented and option to output the operator.
- Implemented unit `kip` and alias `kips`. Thanks <a href="https://github.com/hgupta9">@hgupta9</a>.
- Added support for prefixes for units `mol` and `mole`. Thanks <a href="https://github.com/stu-blair">@stu-blair</a>.
- Restored support for implicit multiplications like `2(3+4)` and `(2+3)(4+5)`.
- Some improvements in the docs.
- Added automatic conversions from `boolean` and `null` to `Fraction`,
  and conversions from `Fraction` to `Complex`.

<h2 id="20160304-version-300">2016-03-04, version 3.0.0 <a href="#20160304-version-300" title="Permalink">#</a></h2>

<h3 id="breaking-changes">breaking changes <a href="#breaking-changes" title="Permalink">#</a></h3>

- More restricted support for implicit multiplication in the expression
  parser: `(...)(...)` is now evaluated as a function invocation,
  and `[...][...]` as a matrix subset.
- Matrix multiplication no longer squeezes scalar outputs to a scalar value,
  but leaves them as they are: a vector or matrix containing a single value.
  See <a href="https://github.com/josdejong/mathjs/issues/529">#529</a>.
- Assignments in the expression parser now return the assigned value rather
  than the created or updated object (see <a href="https://github.com/josdejong/mathjs/issues/533">#533</a>). Example:

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
  created by <a href="https://github.com/infusion">@infusion</a>.
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
  see <a href="https://github.com/josdejong/mathjs/issues/561">#561</a>.

<h3 id="nonbreaking-changes">non-breaking changes <a href="#nonbreaking-changes" title="Permalink">#</a></h3>

- Extended function `pow` to return the real root for cubic roots of negative
  numbers. See <a href="https://github.com/josdejong/mathjs/issues/525">#525</a>, <a href="https://github.com/josdejong/mathjs/issues/482">#482</a>, <a href="https://github.com/josdejong/mathjs/issues/567">#567</a>.
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
- Reorganized and extended docs, added docs on classes and more. Thanks <a href="https://github.com/hgupta9">@hgupta9</a>.
- Added new units `acre`, `hectare`, `torr`, `bar`, `mmHg`, `mmH2O`, `cmH2O`,
  and added new aliases `acres`, `hectares`, `sqfeet`, `sqyard`, `sqmile`,
  `sqmiles`, `mmhg`, `mmh2o`, `cmh2o`. Thanks <a href="https://github.com/hgupta9">@hgupta9</a>.
- Fixed a bug in the toString method of an IndexNode.
- Fixed angle units `deg`, `rad`, `grad`, `cycle`, `arcsec`, and `arcmin` not
  being defined as BigNumbers when configuring to use BigNumbers.

<h2 id="20160203-version-270">2016-02-03, version 2.7.0 <a href="#20160203-version-270" title="Permalink">#</a></h2>

- Added more unit aliases for time: `secs`, `mins`, `hr`, `hrs`. See <a href="https://github.com/josdejong/mathjs/issues/551">#551</a>.
- Added support for doing operations with mixed `Fractions` and `BigNumbers`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/540">#540</a>: `math.intersect()` returning null in some cases. Thanks <a href="https://github.com/void42">@void42</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/546">#546</a>: Cannot import BigNumber, Fraction, Matrix, Array.
  Thanks <a href="https://github.com/brettjurgens">@brettjurgens</a>.

<h2 id="20160108-version-260">2016-01-08, version 2.6.0 <a href="#20160108-version-260" title="Permalink">#</a></h2>

- Implemented (complex) units `VA` and `VAR`.
- Implemented time units for weeks, months, years, decades, centuries, and
  millennia. Thanks <a href="https://github.com/owenversteeg">@owenversteeg</a>.
- Implemented new notation `engineering` in function `math.format`.
  Thanks <a href="https://github.com/johnmarinelli">@johnmarinelli</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/523">#523</a>: In some circumstances, matrix subset returned a scalar instead
  of the correct subset.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/536">#536</a>: A bug in an internal method used for sparse matrices.

<h2 id="20151205-version-250">2015-12-05, version 2.5.0 <a href="#20151205-version-250" title="Permalink">#</a></h2>

- Implemented support for numeric types `Fraction` and `BigNumber` in units.
- Implemented new method `toNumeric` for units.
- Implemented new units `arcsec`, `arcsecond`, `arcmin`, `arcminute`.
  Thanks <a href="https://github.com/devdevdata222">@devdevdata222</a>.
- Implemented new unit `Herts` (`Hz`). Thanks <a href="https://github.com/SwamWithTurtles">@SwamWithTurtles</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/485">#485</a>: Scoping issue with variables both used globally as well as in a
  function definition.
- Fixed: Function `number` didn't support `Fraction` as input.

<h2 id="20151114-version-242">2015-11-14, version 2.4.2 <a href="#20151114-version-242" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/502">#502</a>: Issue with `format` in some JavaScript engines.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/503">#503</a>: Removed trailing commas and the use of keyword `import` as
  property, as this gives issues with old JavaScript engines.

<h2 id="20151029-version-241">2015-10-29, version 2.4.1 <a href="#20151029-version-241" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/480">#480</a>: `nthRoot` not working on Internet Explorer (up to IE11).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/490">#490</a>: `nthRoot` returning an error for negative values like
  `nthRoot(-2, 3)`.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/489">#489</a>: an issue with initializing a sparse matrix without data.
  Thanks <a href="https://github.com/Retsam">@Retsam</a>.
- Fixed: <a href="https://github.com/josdejong/mathjs/issues/493">#493</a>: function `combinations` did not throw an exception for
  non-integer values of `k`.
- Fixed: function `import` did not override typed functions when the option
  override was set true.
- Fixed: added functions `math.sparse` and `math.index` to the reference docs,
  they where missing.
- Fixed: removed memoization from `gamma` and `factorial` functions, this
  could blow up memory.

<h2 id="20151009-version-240">2015-10-09, version 2.4.0 <a href="#20151009-version-240" title="Permalink">#</a></h2>

- Added support in the expression parser for mathematical alphanumeric symbols
  in the expression parser: unicode range \u{1D400} to \u{1D7FF} excluding
  invalid code points.
- Extended function `distance` with more signatures. Thanks <a href="https://github.com/kv-kunalvyas">@kv-kunalvyas</a>.
- Fixed a bug in functions `sin` and `cos`, which gave wrong results for
  BigNumber integer values around multiples of tau (i.e. `sin(bignumber(7))`).
- Fixed value of unit `stone`. Thanks <a href="https://github.com/Esvandiary">@Esvandiary</a> for finding the error.

<h2 id="20150919-version-230">2015-09-19, version 2.3.0 <a href="#20150919-version-230" title="Permalink">#</a></h2>

- Implemented function `distance`. Thanks <a href="https://github.com/devanp92">@devanp92</a>.
- Implemented support for Fractions in function `lcm`. Thanks <a href="https://github.com/infusion">@infusion</a>.
- Implemented function `cbrt` for numbers, complex numbers, BigNumbers, Units.
- Implemented function `hypot`.
- Upgraded to fraction.js v3.0.0.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/450">#450</a>: issue with non sorted index in sparse matrices.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/463">#463</a>, <a href="https://github.com/josdejong/mathjs/issues/322">#322</a>: inconsistent handling of implicit multiplication.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/444">#444</a>: factorial of infinity not returning infinity.

<h2 id="20150830-version-220">2015-08-30, version 2.2.0 <a href="#20150830-version-220" title="Permalink">#</a></h2>

- Units with powers (like `m^2` and `s^-1`) now output with the best prefix.
- Implemented support for units to `abs`, `cube`, `sign`, `sqrt`, `square`.
  Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Implemented function `catalan` (Combinatorics). Thanks <a href="https://github.com/devanp92">@devanp92</a>.
- Improved the `canDefineProperty` check to return false in case of IE8, which
  has a broken implementation of `defineProperty`. Thanks <a href="https://github.com/golmansax">@golmansax</a>.
- Fixed function `to` not working in case of a simplified unit.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/437">#437</a>: an issue with row swapping in `lup`, also affecting `lusolve`.

<h2 id="20150812-version-211">2015-08-12, version 2.1.1 <a href="#20150812-version-211" title="Permalink">#</a></h2>

- Fixed wrong values of the physical constants `speedOfLight`, `molarMassC12`,
  and `magneticFluxQuantum`. Thanks <a href="https://github.com/ericman314">@ericman314</a> for finding two of them.

<h2 id="20150811-version-210">2015-08-11, version 2.1.0 <a href="#20150811-version-210" title="Permalink">#</a></h2>

- Implemented derived units (like `110 km/h in m/s`). Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Implemented support for electric units. Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Implemented about 50 physical constants like `speedOfLight`, `gravity`, etc.
- Implemented function `kldivergence` (Kullback-Leibler divergence).
  Thanks <a href="https://github.com/saromanov">@saromanov</a>.
- Implemented function `mode`. Thanks <a href="https://github.com/kv-kunalvyas">@kv-kunalvyas</a>.
- Added support for unicode characters in the expression parser: greek letters
  and latin letters with accents. See <a href="https://github.com/josdejong/mathjs/issues/265">#265</a>.
- Internal functions `Unit.parse` and `Complex.parse` now throw an Error
  instead of returning null when passing invalid input.

<h2 id="20150729-version-201">2015-07-29, version 2.0.1 <a href="#20150729-version-201" title="Permalink">#</a></h2>

- Fixed operations with mixed fractions and numbers be converted to numbers
  instead of fractions.

<h2 id="20150728-version-200">2015-07-28, version 2.0.0 <a href="#20150728-version-200" title="Permalink">#</a></h2>

- Large internal refactoring:
  - performance improvements.
  - allows to create custom bundles
  - functions are composed using `typed-function` and are extensible
- Implemented support for fractions, powered by the library `fraction.js`.
- Implemented matrix LU decomposition with partial pivoting and a LU based
  linear equations solver (functions `lup` and `lusolve`). Thanks <a href="https://github.com/rjbaucells">@rjbaucells</a>.
- Implemented a new configuration option `predictable`, which can be set to
  true in order to ensure predictable function output types.
- Implemented function `intersect`. Thanks <a href="https://github.com/kv-kunalvyas">@kv-kunalvyas</a>.
- Implemented support for adding `toTex` properties to custom functions.
  Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Implemented support for complex values to `nthRoot`. Thanks <a href="https://github.com/gangachris">@gangachris</a>.
- Implemented util functions `isInteger`, `isNegative`, `isNumeric`,
  `isPositive`, and `isZero`.

<h3 id="breaking-changes">breaking changes <a href="#breaking-changes" title="Permalink">#</a></h3>

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
- Function `sum` now returns zero when input is an empty array. Thanks <a href="https://github.com/FSMAxB">@FSMAxB</a>.
- The size of Arrays is no longer validated. Matrices will validate this on
  creation.

<h2 id="20150712-version-171">2015-07-12, version 1.7.1 <a href="#20150712-version-171" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/397">#397</a>: Inaccuracies in nthRoot for very large values, and wrong results
  for very small values. (backported from v2)
- Fixed <a href="https://github.com/josdejong/mathjs/issues/405">#405</a>: Parser throws error when defining a function in a multiline
  expression.

<h2 id="20150531-version-170">2015-05-31, version 1.7.0 <a href="#20150531-version-170" title="Permalink">#</a></h2>

- Implemented function `quantileSeq` and `partitionSelect`. Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Implemented functions `stirlingS2`, `bellNumbers`, `composition`, and
  `multinomial`. Thanks <a href="https://github.com/devanp92">@devanp92</a>.
- Improved the performance of `median` (see <a href="https://github.com/josdejong/mathjs/issues/373">#373</a>). Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Extended the command line interface with a `mode` option to output either
  the expressions result, string representation, or tex representation.
  Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/309">#309</a>: Function median mutating the input matrix. Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Fixed `Node.transform` not recursing over replaced parts of the
  node tree (see <a href="https://github.com/josdejong/mathjs/issues/349">#349</a>).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/381">#381</a>: issue in docs of `randomInt`.

<h2 id="20150422-version-160">2015-04-22, version 1.6.0 <a href="#20150422-version-160" title="Permalink">#</a></h2>

- Improvements in `toTex`. Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/328">#328</a>: `abs(0 + 0i)` evaluated to `NaN`.
- Fixed not being able to override lazy loaded constants.

<h2 id="20150409-version-152">2015-04-09, version 1.5.2 <a href="#20150409-version-152" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/313">#313</a>: parsed functions did not handle recursive calls correctly.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/251">#251</a>: binary prefix and SI prefix incorrectly used for byte. Now
  following SI standards (`1 KiB == 1024 B`, `1 kB == 1000 B`).
- Performance improvements in parsed functions.

<h2 id="20150408-version-151">2015-04-08, version 1.5.1 <a href="#20150408-version-151" title="Permalink">#</a></h2>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/316">#316</a>: a bug in rounding values when formatting.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/317">#317</a>, <a href="https://github.com/josdejong/mathjs/issues/319">#319</a>: a bug in formatting negative values.

<h2 id="20150328-version-150">2015-03-28, version 1.5.0 <a href="#20150328-version-150" title="Permalink">#</a></h2>

- Added unit `stone` (6.35 kg).
- Implemented support for sparse matrices. Thanks <a href="https://github.com/rjbaucells">@rjbaucells</a>.
- Implemented BigNumber support for function `atan2`. Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Implemented support for custom LaTeX representations. Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Improvements and bug fixes in outputting parentheses in `Node.toString` and
  `Node.toTex` functions. Thanks <a href="https://github.com/FSMaxB">@FSMaxB</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/291">#291</a>: function `format` sometimes returning exponential notation when
  it should return a fixed notation.

<h2 id="20150228-version-140">2015-02-28, version 1.4.0 <a href="#20150228-version-140" title="Permalink">#</a></h2>

- Implemented trigonometric functions:
  `acosh`, `acoth`, `acsch`, `asech`, `asinh`, `atanh`, `acot`, `acsc`, `asec`.
  Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Added BigNumber support for functions: `cot`, `csc`, `sec`, `coth`,
  `csch`, `sech`. Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Implemented support for serialization and deserialization of math.js data
  types.
- Fixed the calculation of `norm()` and `abs()` for large complex numbers.
  Thanks <a href="https://github.com/rjbaucells">@rjbaucells</a>.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/281">#281</a>: improved formatting complex numbers. Round the real or imaginary
  part to zero when the difference is larger than the configured precision.

<h2 id="20150209-version-130">2015-02-09, version 1.3.0 <a href="#20150209-version-130" title="Permalink">#</a></h2>

- Implemented BigNumber implementations of most trigonometric functions: `sin`,
  `cos`, `tan`, `asin`, `acos`, `atan`, `cosh`, `sinh`, `tanh`. Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Implemented function `trace`. Thanks <a href="https://github.com/pcorey">@pcorey</a>.
- Faster loading of BigNumber configuration with a high precision by lazy
  loading constants like `pi` and `e`.
- Fixed constants `NaN` and `Infinity` not being BigNumber objects when
  BigNumbers are configured.
- Fixed missing parentheses in the `toTex` representation of function
  `permutations`.
- Some minor fixes in the docs. Thanks <a href="https://github.com/KenanY">@KenanY</a>.

<h2 id="20141225-version-120">2014-12-25, version 1.2.0 <a href="#20141225-version-120" title="Permalink">#</a></h2>

- Support for bitwise operations `bitAnd`, `bitNot`, `bitOr`, `bitXor`,
  `leftShift`, `rightArithShift`, and `rightLogShift`. Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Support for boolean operations `and`, `not`, `or`, `xor`. Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Support for `gamma` function. Thanks <a href="https://github.com/BigFav">@BigFav</a>.
- Converting a unit without value will now result in a unit *with* value,
  i.e. `inch in cm` will return `2.54 cm` instead of `cm`.
- Improved accuracy of `sinh` and complex `cos` and `sin`. Thanks <a href="https://github.com/pavpanchekha">@pavpanchekha</a>.
- Renamed function `select` to `chain`. The old function `select` will remain
  functional until math.js v2.0.
- Upgraded to decimal.js v4.0.1 (BigNumber library).

<h2 id="20141122-version-111">2014-11-22, version 1.1.1 <a href="#20141122-version-111" title="Permalink">#</a></h2>

- Fixed Unit divided by Number returning zero.
- Fixed BigNumber downgrading to Number for a negative base in `pow`.
- Fixed some typos in error messaging (thanks <a href="https://github.com/andy0130tw">@andy0130tw</a>) and docs.

<h2 id="20141115-version-110">2014-11-15, version 1.1.0 <a href="#20141115-version-110" title="Permalink">#</a></h2>

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

<h2 id="20140912-version-101">2014-09-12, version 1.0.1 <a href="#20140912-version-101" title="Permalink">#</a></h2>

- Disabled array notation for ranges in a matrix index in the expression parser
  (it is confusing and redundant there).
- Fixed a regression in the build of function subset not being able to return
  a scalar.
- Fixed some missing docs and broken links in the docs.

<h2 id="20140904-version-100">2014-09-04, version 1.0.0 <a href="#20140904-version-100" title="Permalink">#</a></h2>

- Implemented a function `filter(x, test)`.
- Removed `math.distribution` for now, needs some rethinking.
- `math.number` can convert units to numbers (requires a second argument)
- Fixed some precedence issues with the range and conversion operators.
- Fixed an zero-based issue when getting a matrix subset using an index
  containing a matrix.

<h2 id="20140821-version-0270">2014-08-21, version 0.27.0 <a href="#20140821-version-0270" title="Permalink">#</a></h2>

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

<h2 id="20140803-version-0260">2014-08-03, version 0.26.0 <a href="#20140803-version-0260" title="Permalink">#</a></h2>

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

<h2 id="20140701-version-0250">2014-07-01, version 0.25.0 <a href="#20140701-version-0250" title="Permalink">#</a></h2>

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

<h2 id="20140620-version-0241">2014-06-20, version 0.24.1 <a href="#20140620-version-0241" title="Permalink">#</a></h2>

- Something went wrong with publishing on npm.

<h2 id="20140620-version-0240">2014-06-20, version 0.24.0 <a href="#20140620-version-0240" title="Permalink">#</a></h2>

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

<h2 id="20140610-version-0230">2014-06-10, version 0.23.0 <a href="#20140610-version-0230" title="Permalink">#</a></h2>

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

<h2 id="20140522-version-0220">2014-05-22, version 0.22.0 <a href="#20140522-version-0220" title="Permalink">#</a></h2>

- Implemented support to export expressions to LaTeX. Thanks Niels Heisterkamp
  (@nheisterkamp).
- Output of matrix multiplication is now consistently squeezed.
- Added reference documentation in the section /docs/reference.
- Fixed a bug in multiplying units without value with a number (like `5 * cm`).
- Fixed a bug in multiplying two matrices containing vectors (worked fine for
  arrays).
- Fixed random functions not accepting Matrix as input, and always returning
  a Matrix as output.

<h2 id="20140513-version-0211">2014-05-13, version 0.21.1 <a href="#20140513-version-0211" title="Permalink">#</a></h2>

- Removed `crypto` library from the bundle.
- Deprecated functions `Parser.parse` and `Parser.compile`. Use
  `math.parse` and `math.compile` instead.
- Fixed function `add` not adding strings and matrices element wise.
- Fixed parser not being able to evaluate an exponent followed by a unary minus
  like `2^-3`, and a transpose followed by an index like `[3]'[1]`.

<h2 id="20140424-version-0210">2014-04-24, version 0.21.0 <a href="#20140424-version-0210" title="Permalink">#</a></h2>

- Implemented trigonometric hyperbolic functions `cosh`, `coth`, `csch`,
  `sech`, `sinh`, `tanh`. Thanks Rogelio J. Baucells (@rjbaucells).
- Added property `type` to all expression nodes in an expression tree.
- Fixed functions `log`, `log10`, `pow`, and `sqrt` not supporting complex
  results from BigNumber input (like `sqrt(bignumber(-4))`).

<h2 id="20140416-version-0200">2014-04-16, version 0.20.0 <a href="#20140416-version-0200" title="Permalink">#</a></h2>

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

<h2 id="20140330-version-0190">2014-03-30, version 0.19.0 <a href="#20140330-version-0190" title="Permalink">#</a></h2>

- Implemented functions `compare`, `sum`, `prod`, `var`, `std`, `median`.
- Implemented function `ifElse` Thanks <a href="https://github.com/mtraynham">@mtraynham</a>.
- Minor bug fixes.

<h2 id="20140215-version-0181">2014-02-15, version 0.18.1 <a href="#20140215-version-0181" title="Permalink">#</a></h2>

- Added unit `feet`.
- Implemented function `compile` (shortcut for parsing and then compiling).
- Improved performance of function `pow` for matrices. Thanks <a href="https://github.com/hamadu">@hamadu</a>.
- Fixed broken auto completion in the command line interface.
- Fixed an error in function `combinations` for large numbers, and
  improved performance of both functions `combinations` and `permutations`.

<h2 id="20140118-version-0180">2014-01-18, version 0.18.0 <a href="#20140118-version-0180" title="Permalink">#</a></h2>

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

<h2 id="20131219-version-0171">2013-12-19, version 0.17.1 <a href="#20131219-version-0171" title="Permalink">#</a></h2>

- Fixed a bug with negative temperatures.
- Fixed a bug with prefixes of units squared meter `m2` and cubic meter `m3`.

<h2 id="20131212-version-0170">2013-12-12, version 0.17.0 <a href="#20131212-version-0170" title="Permalink">#</a></h2>

- Renamed and flattened configuration settings:
  - `number.defaultType` is now `number`.
  - `number.precision` is now `decimals`.
  - `matrix.defaultType` is now `matrix`.
- Function `multiply` now consistently outputs a complex number on complex input.
- Fixed `mod` and `in` not working as function (only as operator).
- Fixed support for old browsers (IE8 and older), compatible when using es5-shim.
- Fixed support for Java's ScriptEngine.

<h2 id="20131128-version-0160">2013-11-28, version 0.16.0 <a href="#20131128-version-0160" title="Permalink">#</a></h2>

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

<h2 id="20131026-version-0150">2013-10-26, version 0.15.0 <a href="#20131026-version-0150" title="Permalink">#</a></h2>

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
    "3.3333e7"). Thanks <a href="https://github.com/husayt">@husayt</a>.
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

<h2 id="20131008-version-0140">2013-10-08, version 0.14.0 <a href="#20131008-version-0140" title="Permalink">#</a></h2>

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

<h2 id="20130903-version-0130">2013-09-03, version 0.13.0 <a href="#20130903-version-0130" title="Permalink">#</a></h2>

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

<h2 id="20130822-version-0121">2013-08-22, version 0.12.1 <a href="#20130822-version-0121" title="Permalink">#</a></h2>

- Fixed outdated version of README.md.
- Fixed a broken unit test.

<h2 id="20130822-version-0120">2013-08-22, version 0.12.0 <a href="#20130822-version-0120" title="Permalink">#</a></h2>

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
- Fixed zeros being formatted as null. Thanks <a href="https://github.com/TimKraft">@TimKraft</a>.

<h2 id="20130723-version-0111">2013-07-23, version 0.11.1 <a href="#20130723-version-0111" title="Permalink">#</a></h2>

- Fixed missing development dependency

<h2 id="20130723-version-0110">2013-07-23, version 0.11.0 <a href="#20130723-version-0110" title="Permalink">#</a></h2>

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

<h2 id="20130708-version-0100">2013-07-08, version 0.10.0 <a href="#20130708-version-0100" title="Permalink">#</a></h2>

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

<h2 id="20130614-version-091">2013-06-14, version 0.9.1 <a href="#20130614-version-091" title="Permalink">#</a></h2>

- Implemented element-wise functions and operators: `emultiply` (`x .* y`),
  `edivide` (`x ./ y`), `epow` (`x .^ y`).
- Added constants `Infinity` and `NaN`.
- Removed support for Workspace to keep the library focused on its core task.
- Fixed a bug in the Complex constructor, not accepting NaN values.
- Fixed division by zero in case of pure complex values.
- Fixed a bug in function multiply multiplying a pure complex value with
  Infinity.

<h2 id="20130529-version-090">2013-05-29, version 0.9.0 <a href="#20130529-version-090" title="Permalink">#</a></h2>

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

<h2 id="20130518-version-082">2013-05-18, version 0.8.2 <a href="#20130518-version-082" title="Permalink">#</a></h2>

- Extended the import function and some other minor improvements.
- Fixed a bug in merging one dimensional vectors into a matrix.
- Fixed a bug in function subtract, when subtracting a complex number from a
  real number.

<h2 id="20130510-version-081">2013-05-10, version 0.8.1 <a href="#20130510-version-081" title="Permalink">#</a></h2>

- Fixed an npm warning when installing mathjs globally.

<h2 id="20130510-version-080">2013-05-10, version 0.8.0 <a href="#20130510-version-080" title="Permalink">#</a></h2>

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

<h2 id="20130504-version-072">2013-05-04, version 0.7.2 <a href="#20130504-version-072" title="Permalink">#</a></h2>

- Fixed method unequal, which was checking for equality instead of inequality.
  Thanks <a href="https://github.com/FJS2">@FJS2</a>.

<h2 id="20130427-version-071">2013-04-27, version 0.7.1 <a href="#20130427-version-071" title="Permalink">#</a></h2>

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

<h2 id="20130420-version-070">2013-04-20, version 0.7.0 <a href="#20130420-version-070" title="Permalink">#</a></h2>

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

<h2 id="20130413-version-060">2013-04-13, version 0.6.0 <a href="#20130413-version-060" title="Permalink">#</a></h2>

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

<h2 id="20130406-version-050">2013-04-06, version 0.5.0 <a href="#20130406-version-050" title="Permalink">#</a></h2>

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

<h2 id="20130316-version-040">2013-03-16, version 0.4.0 <a href="#20130316-version-040" title="Permalink">#</a></h2>

- Implemented Array support for all methods.
- Implemented Array support in the Parser.
- Implemented method format.
- Implemented parser for units, math.Unit.parse(str).
- Improved parser for complex values math.Complex.parse(str);
- Improved method help: it now evaluates the examples.
- Fixed: a scoping issue with the Parser when defining functions.
- Fixed: method 'typeof' was not working well with minified and mangled code.
- Fixed: errors in determining the best prefix for a unit.

<h2 id="20130309-version-030">2013-03-09, version 0.3.0 <a href="#20130309-version-030" title="Permalink">#</a></h2>

- Implemented Workspace
- Implemented methods cot, csc, sec.
- Implemented Array support for methods with one parameter.

<h2 id="20130225-version-020">2013-02-25, version 0.2.0 <a href="#20130225-version-020" title="Permalink">#</a></h2>

- Parser, Scope, and expression tree with Nodes implemented.
- Implemented method import which makes it easy to extend math.js.
- Implemented methods arg, conj, cube, equal, factorial, im, largereq,
  log(x, base), log10, mod, re, sign, smallereq, square, unequal.

<h2 id="20130218-version-010">2013-02-18, version 0.1.0 <a href="#20130218-version-010" title="Permalink">#</a></h2>

- Reached full compatibility with Javascripts built-in Math library.
- More functions implemented.
- Some bugfixes.

<h2 id="20130216-version-002">2013-02-16, version 0.0.2 <a href="#20130216-version-002" title="Permalink">#</a></h2>

- All constants of Math implemented, plus the imaginary unit i.
- Data types Complex and Unit implemented.
- First set of functions implemented.

<h2 id="20130215-version-001">2013-02-15, version 0.0.1 <a href="#20130215-version-001" title="Permalink">#</a></h2>

- First publish of the mathjs package. (package is still empty)
