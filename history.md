---
layout: default
---

<h1 id="history">History <a href="#history" title="Permalink">#</a></h1>

<h1 id="20191006-version-624">2019-10-06, version 6.2.4 <a href="#20191006-version-624" title="Permalink">#</a></h1>

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

- Upgrade decimal.js to v10.1.1  <a href="https://github.com/josdejong/mathjs/issues/1421">#1421</a>).
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1418">#1418</a>: missing whitespace when stringifying an expression
  containing "not".


<h1 id="20190220-version-550">2019-02-20, version 5.5.0 <a href="#20190220-version-550" title="Permalink">#</a></h1>

- Fixed <a href="https://github.com/josdejong/mathjs/issues/1401">#1401</a>: methods `map` and `forEach` of `SparseMatrix` not working
  correctly when indexes are unordered.
- Fixed <a href="https://github.com/josdejong/mathjs/issues/1404">#1404</a>: inconsistent rounding of negative numbers.
- Upgrade tiny-emitter to v2.1.0  <a href="https://github.com/josdejong/mathjs/issues/1397">#1397</a>).


<h1 id="20190125-version-542">2019-01-25, version 5.4.2 <a href="#20190125-version-542" title="Permalink">#</a></h1>

- Fixed `math.format` not working for BigNumbers with a precision above
  1025 digits (see <a href="https://github.com/josdejong/mathjs/issues/1385">#1385</a>). Thanks <a href="https://github.com/ericman314">@ericman314</a>.
- Fixed incorrect LaTeX output of `RelationalNode`. Thanks <a href="https://github.com/rianmcguire">@rianmcguire</a>.
- Fixed a bug the methods `map`, `forEach`, `traverse`, and `transform`
  of `FunctionNode`.


<h1 id="20190110-version-541">2019-01-10, version 5.4.1 <a href="#20190110-version-541" title="Permalink">#</a></h1>

- Fix <a href="https://github.com/josdejong/mathjs/issues/1378">#1378</a>: negative bignumbers not formatted correctly.
- Upgrade fraction.js to version 4.0.12  <a href="https://github.com/josdejong/mathjs/issues/1369">#1369</a>).


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
- Upgraded devDependencies (`babel-loader@7.1.5 `, `uglify-js@3.4.3`,
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
- Changed code style to https://standardjs.com/, run linter on `npm test`.
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
      Detailed documentation: https://github.com/josdejong/mathjs/blob/v4/docs/expressions/syntax.md#implicit-multiplication.

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
  arguments wrongly: `simplify('f(x, y, z)') evaluated to `f(f(x, y), z)`
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

- Fixed <a href="https://github.com/josdejong/mathjs/issues/480">#480</a>: `nthRoot` not working on Internet Explorer (up to IE 11).
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
