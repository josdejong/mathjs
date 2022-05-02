## Contributing

Contributions to the math.js library are very welcome! We can't do this alone. You can contribute in different ways: spread the word, report bugs, come up with ideas and suggestions, and contribute to the code.

### What can I do?

Search through the [issues](https://github.com/josdejong/mathjs/issues) looking
  for something that looks interesting to you to pick up. Some issues are marked
  ["help wanted"](https://github.com/josdejong/mathjs/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22),
  these are typically issues which should be relatively easy to pick up.

### There are a few preferences regarding code contributions:

- The code of math.js follows the JavaScript Standard Style as described on https://standardjs.com/, powered by `eslint`. Run `npm run lint` to test, and `npm run format` to automatically adjust your code to the code style.
- Make sure you properly unit test your changes.
- Before creating a pull request, run the unit tests to make sure they all pass.
- Only commit changes done in the source files under `src`, not to the generated builds
  which are located in the folders `dist` and `lib`.
- Send pull requests to the `develop` branch, not the `master` branch.

### How to implement a new function?

- Implement the function in the right category, for example `./src/function/arithmetic/myNewFunction.js`, where you can replace `arithmetic` with the proper category, and `myNewFunction` with the name of the new function. Add the new function to the index files `./src/factoriesAny.js` and possibly `./src/factoriesNumber.js`.
- Write documentation on the function in the source code comment of `myNewFunction.js`. This documentation is used to auto generate documentation on the website.
- Write embedded documentation for the new function in `./src/expression/embeddedDocs/function/arithmetic/myNewFunction.js`. Add the new documentation to the index file `./src/expression/embeddedDocs/embeddedDocs.js`.
- Write unit tests for the function in `./test/unit-tests/function/arithmetic/myNewFunction.test.js`.
- Write a TypeScript definition for the new function in `./types/index.d.ts`, and write tests for it in `./types/index.ts`. Normally, two definitions need to be added: one for the static function `math.myNewFunction(...)` and one for the chained API `math.chain(...).myNewFunction(...)`. 
- Ensure the code style is ok by running `npm run lint` (run `npm run format` to fix the code style automatically).

More information can be found in the projects [README.md](https://github.com/josdejong/mathjs#readme). And: feel free to ask when in doubt.

Thanks!
