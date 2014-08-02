#!/usr/bin/env node
/**
 * math.js
 * https://github.com/josdejong/mathjs
 *
 * Math.js is an extensive math library for JavaScript and Node.js,
 * It features real and complex numbers, units, matrices, a large set of
 * mathematical functions, and a flexible expression parser.
 *
 * Usage:
 *
 *     mathjs [scriptfile] {OPTIONS}
 *
 * Options:
 *
 *     --version, -v  Show application version
 *        --help, -h  Show this message
 *
 * Example usage:
 *     mathjs                                 Open a command prompt
 *     mathjs script.txt                      Run a script file
 *     mathjs script.txt > results.txt        Run a script file, output to file
 *     cat script.txt | mathjs                Run input stream
 *     cat script.txt | mathjs > results.txt  Run input stream, output to file
 *
 * @license
 * Copyright (C) 2013-2014 Jos de Jong <wjosdejong@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var math = require('../index'),
    parser = math.parser(),
    fs = require('fs');

var PRECISION = 14; // decimals

/**
 * auto complete a text
 * @param {String} text
 * @return {[Array, String]} completions
 */
function completer (text) {
  var name;
  var matches = [];
  var m = /[a-zA-Z_0-9]+$/.exec(text);
  if (m) {
    var keyword = m[0];

    // scope variables
    // TODO: not nice to read the (private) defs inside the scope
    for (var def in parser.scope.defs) {
      if (parser.scope.defs.hasOwnProperty(def)) {
        if (def.indexOf(keyword) == 0) {
          matches.push(def);
        }
      }
    }

    // commandline keywords
    ['exit', 'quit', 'clear'].forEach(function (cmd) {
      if (cmd.indexOf(keyword) == 0) {
        matches.push(cmd);
      }
    });

    // math functions and constants
    var ignore = ['expr', 'type'];
    for (var func in math) {
      if (math.hasOwnProperty(func)) {
        if (func.indexOf(keyword) == 0 && ignore.indexOf(func) == -1) {
          matches.push(func);
        }
      }
    }

    // units
    var Unit = math.type.Unit;
    for (name in Unit.UNITS) {
      if (Unit.UNITS.hasOwnProperty(name)) {
        if (name.indexOf(keyword) == 0) {
          matches.push(name);
        }
      }
    }
    for (name in Unit.PREFIXES) {
      if (Unit.PREFIXES.hasOwnProperty(name)) {
        var prefixes = Unit.PREFIXES[name];
        for (var prefix in prefixes) {
          if (prefixes.hasOwnProperty(prefix)) {
            if (prefix.indexOf(keyword) == 0) {
              matches.push(prefix);
            }
            else if (keyword.indexOf(prefix) == 0) {
              var unitKeyword = keyword.substring(prefix.length);
              for (var n in Unit.UNITS) {
                if (Unit.UNITS.hasOwnProperty(n)) {
                  if (n.indexOf(unitKeyword) == 0 &&
                      Unit.isValuelessUnit(prefix + n)) {
                    matches.push(prefix + n);
                  }
                }
              }
            }
          }
        }
      }
    }

    // remove duplicates
    matches = matches.filter(function(elem, pos, arr) {
      return arr.indexOf(elem) == pos;
    });
  }

  return [matches, keyword];
}

/**
 * Run stream, read and evaluate input and stream that to output.
 * Text lines read from the input are evaluated, and the results are send to
 * the output.
 * @param input   Input stream
 * @param output  Output stream
 */
function runStream (input, output) {
  var readline = require('readline'),
      rl = readline.createInterface({
        input: input || process.stdin,
        output: output || process.stdout,
        completer: completer
      });

  if (rl.output.isTTY) {
    rl.setPrompt('> ');
    rl.prompt();
  }

  // TODO: automatic insertion of 'ans' before operators like +, -, *, /

  rl.on('line', function(line) {
    var expr = line.trim();

    // check for exit
    if (expr.toLowerCase() == 'exit' || expr.toLowerCase() == 'quit') {
      // exit application
      rl.close();
    }
    if (expr.toLowerCase() == 'clear') {
      // clear memory
      parser.clear();
      console.log('memory cleared');

      // get next input
      if (rl.output.isTTY) {
        rl.prompt();
      }
    }
    else {
      // evaluate expression
      if (expr) {
        try {
          var res = parser.eval(expr);
          parser.set('ans', res); // TODO: in case of multi line input, set ans as the last of the expressions
          if (!Array.isArray(res) || res.length) {
            // TODO: how to distinguish array output from multi-line output?

            console.log(math.format(res, PRECISION));
          }
        }
        catch (err) {
          console.log(err.toString());
        }
      }

      // get next input
      if (rl.output.isTTY) {
        rl.prompt();
      }
    }
  });

  rl.on('close', function() {
    console.log();
    process.exit(0);
  });
}

/**
 * Output application version number.
 * Version number is read version from package.json.
 */
function outputVersion () {
  fs.readFile(__dirname + '/../package.json', function (err, data) {
    if (err) {
      console.log(err.toString());
    }
    else {
      var pkg = JSON.parse(data);
      var version = pkg && pkg.version ? 'v' + pkg.version : 'unknown';
      console.log(version);
    }
  });
}

/**
 * Output a help message
 */
function outputHelp() {
  console.log('math.js');
  console.log('http://mathjs.org');
  console.log();
  console.log('Math.js is an extensive math library for JavaScript and Node.js. It features ');
  console.log('real and complex numbers, units, matrices, a large set of mathematical');
  console.log('functions, and a flexible expression parser.');
  console.log();
  console.log('Usage:');
  console.log('    mathjs [scriptfile] {OPTIONS}');
  console.log();
  console.log('Options:');
  console.log('    --version, -v  Show application version');
  console.log('       --help, -h  Show this message');
  console.log();
  console.log('Example usage:');
  console.log('    mathjs                                Open a command prompt');
  console.log('    mathjs script.txt                     Run a script file');
  console.log('    mathjs script.txt > results.txt       Run a script file, output to file');
  console.log('    cat script.txt | mathjs               Run input streaml');
  console.log('    cat script.txt | mathjs > results.txt Run input stream, output to file');
  console.log();
}

/**
 * Process input and output, based on the command line arguments
 */
if (process.argv.length > 2) {
  var arg = process.argv[2];
  if (arg == '-v' || arg == '--version') {
    outputVersion();
  }
  else if (arg == '-h' || arg == '--help') {
    outputHelp();
  }
  else {
    // run a script file
    runStream(fs.createReadStream(arg), process.stdout);
  }
}
else {
  // run a stream, can be user input or pipe input
  runStream(process.stdin, process.stdout);
}
