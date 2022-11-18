# How to publish math.js

This document describes the steps required to publish a new version of math.js.


## Update version number and history

1. Update the version number `package.json`.
2. Run `npm install` to also have this version number updated in `package-lock.json`
3. Update the date and version number in the file `HISTORY.md`. Verify whether all
changes in the new version are described.


## Build and test

Build the distribution files in folders under `lib`, and test everything by running:

    npm run build-and-test

After the build is complete, verify whether the files are created and contain the
correct date and version number in the header.


## Commit

- Commit the final code.
- Merge the develop branch into the master branch.
- Push to Github.

Now go to Github Actions and verify if the tests run fine there as well:

https://github.com/josdejong/mathjs/actions

If everything is well, create a tag for the new version, like:

    git tag v1.2.4
    git push --tags


## Publish

Publish to npm:

    npm publish


## Update the website

Wait until the new version of math.js is available on cdnjs.org.

The website is located in the `gh-pages` branch of the project.
Follow the readme in the `gh-pages` branch on how to update the website.


## Update the REST API

Update the `mathjs-rest` project (served at https://api.mathjs.org).


## Back to develop

Switch to the develop branch


## Done

Time to drink a beer.

