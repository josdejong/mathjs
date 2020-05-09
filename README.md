![math.js](https://raw.github.com/josdejong/mathjs/master/misc/img/mathjs.png)

[https://mathjs.org](https://mathjs.org)

Math.js is an extensive math library for JavaScript and Node.js. It features a flexible expression parser with support for symbolic computation, comes with a large set of built-in functions and constants, and offers an integrated solution to work with different data types like numbers, big numbers, complex numbers, fractions, units, and matrices. Powerful and easy to use.

[![Version](https://img.shields.io/npm/v/mathjs.svg)](https://www.npmjs.com/package/mathjs)
[![Downloads](https://img.shields.io/npm/dm/mathjs.svg)](https://www.npmjs.com/package/mathjs)
[![Build Status](https://img.shields.io/travis/josdejong/mathjs/master.svg)](https://travis-ci.org/josdejong/mathjs)
[![Maintenance](https://img.shields.io/maintenance/yes/2020.svg)](https://github.com/josdejong/mathjs/graphs/commit-activity)
[![License](https://img.shields.io/github/license/josdejong/mathjs.svg)](https://github.com/josdejong/mathjs/blob/master/LICENSE)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjosdejong%2Fmathjs.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjosdejong%2Fmathjs?ref=badge_shield)
[![Slack](https://slack.bri.im/badge.svg)](https://slack.bri.im)

## Features

- Supports numbers, big numbers, complex numbers, fractions, units, strings, arrays, and matrices.
- Is compatible with JavaScript's built-in Math library.
- Contains a flexible expression parser.
- Does symbolic computation.
- Comes with a large set of built-in functions and constants.
- Can be used as a command line application as well.
- Runs on any JavaScript engine.
- Is easily extensible.
- Open source.

## Usage

Math.js can be used in both node.js and in the browser.

Install math.js using [npm](https://www.npmjs.com/package/mathjs):

    npm install mathjs

> Note that when using mathjs in a TypeScript project, you will have to install type definition files too: `npm install @types/mathjs`.

Or download mathjs via one of the CDN's listed on the downloads page:

&nbsp;&nbsp;&nbsp;&nbsp;[https://mathjs.org/download.html](https://mathjs.org/download.html#download)

Math.js can be used similar to JavaScript's built-in Math library. Besides that,
math.js can evaluate
[expressions](https://mathjs.org/docs/expressions/index.html)
and supports
[chained operations](https://mathjs.org/docs/core/chaining.html).

```js
import {
  atan2, chain, derivative, e, evaluate, log, pi, pow, round, sqrt
} from 'mathjs'

// functions and constants
round(e, 3)                    // 2.718
atan2(3, -3) / pi              // 0.75
log(10000, 10)                 // 4
sqrt(-4)                       // 2i
pow([[-1, 2], [3, 1]], 2)      // [[7, 0], [0, 7]]
derivative('x^2 + x', 'x')     // 2 * x + 1

// expressions
evaluate('12 / (2.3 + 0.7)')   // 4
evaluate('12.7 cm to inch')    // 5 inch
evaluate('sin(45 deg) ^ 2')    // 0.5
evaluate('9 / 3 + 2i')         // 3 + 2i
evaluate('det([-1, 2; 3, 1])') // -7

// chaining
chain(3)
    .add(4)
    .multiply(2)
    .done()  // 14
```

See the [Getting Started](https://mathjs.org/docs/getting_started.html) for a more detailed tutorial.


## Browser support

Math.js works on any ES5 compatible JavaScript engine: node.js, Chrome, Firefox, Safari, Edge, and IE11.


## Documentation

- [Getting Started](https://mathjs.org/docs/getting_started.html)
- [Examples](https://mathjs.org/examples/index.html)
- [Overview](https://mathjs.org/docs/index.html)
- [History](https://mathjs.org/history.html)


## Build

First clone the project from github:

    git clone git://github.com/josdejong/mathjs.git
    cd mathjs

Install the project dependencies:

    npm install

Then, the project can be build by executing the build script via npm:

    npm run build

This will build the library math.js and math.min.js from the source files and
put them in the folder dist.


## Test

To execute tests for the library, install the project dependencies once:

    npm install

Then, the tests can be executed:

    npm test

Additionally, the tests can be run on FireFox using [headless mode](https://developer.mozilla.org/en-US/Firefox/Headless_mode):

    npm run test:browser

To run the tests remotely on BrowserStack, first set the environment variables `BROWSER_STACK_USERNAME` and `BROWSER_STACK_ACCESS_KEY` with your username and access key and then execute:

    npm run test:browserstack

To test code coverage of the tests:

    npm run coverage

To see the coverage results, open the generated report in your browser:

    ./coverage/lcov-report/index.html


### Continuous integration testing

Continuous integration tests are run on [Travis CI](https://travis-ci.org/) and [BrowserStack](https://www.browserstack.com) every time a commit is pushed to github.
The test results can be checked on https://travis-ci.org/josdejong/mathjs. Travis CI runs the tests for different versions of node.js, and BrowserStack runs the tests are run on all major browsers.

[![Travis CI](https://raw.github.com/josdejong/mathjs/develop/misc/Travis-CI-logo.png)](https://travis-ci.org/) &nbsp;&nbsp;&nbsp;
[![BrowserStack](https://raw.github.com/josdejong/mathjs/master/misc/browserstack.png)](https://www.browserstack.com)

Thanks Travis CI and BrowserStack for the generous free hosting of this open source project!

## License

Copyright (C) 2013-2020 Jos de Jong <wjosdejong@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
