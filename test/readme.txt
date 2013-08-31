## Tests

To execute the tests, run the following in the root of the project:


    mocha test --recursive


## Code coverage

To test code coverage of the tests, install `istanbul` and run it:

    npm install -g istanbul
    istanbul cover _mocha -- test --reporter spec --recursive

To see the results, open the generated report in your browser:

    ./coverage/lcov-report/index.html
