# How to publish math.js

This document describes the steps required to publish a new version of math.js.


## Update version number

Update the version number package.json.


## Update history

Update the date and version number in the file HISTORY.md. Verify whether all
changes in the new version are described.


## Build and test

Build the distribution files in folders `dist` and `lib`, and test everything by running:

    npm run build-and-test

After the build is complete, verify if the files are created and contain the
correct date and version number in the header.

Check whether there are new markdown files generated in `./docs` and add if
so add them to git.


## Commit

- Commit the final code.
- Merge the develop branch into the master branch.
- Push to github.

Now go to travis-ci and verify if the tests run fine there as well:

  https://travis-ci.org/josdejong/mathjs

If everything is well, create a tag for the new version, like:

    git tag v1.2.4
    git push --tags


## Publish

Publish to npm:

    npm publish

or directly pass a valid one time password (two factor authentication):

    npm publish --otp 123456


## Test published libraries

Install the libraries locally and test whether they work correctly:

    cd tmp-folder
    npm install mathjs


## Update the website

Wait until the new version of math.js is available on cdnjs.org.

The website is located in the `gh-pages` branch of the project.
Follow the readme in the `gh-pages` branch on how to update the website.

## Update the REST API

Update the `mathjs-rest` project (served at http://api.mathjs.org).


## Back to develop

Switch to the develop branch


## Done

Time to drink a beer.

