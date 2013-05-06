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
 *     mathjs           Open a command prompt
 *     mathjs script    Run a script file
 *
 * @license
 * Copyright (C) 2013 Jos de Jong <wjosdejong@gmail.com>
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

// TODO: implement piping

var readline = require('readline'),
    math = require('../math'),
    fs = require('fs');

/**
 * auto complete a text
 * @param {String} text
 * @return {[Array, String]} completions
 */
function completer (text) {
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
        ['exit', 'quit'].forEach(function (cmd) {
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
        Unit.UNITS.forEach(function (unit) {
            if (unit.name.indexOf(keyword) == 0) {
                matches.push(unit.name);
            }
        });
        for (var name in Unit.PREFIXES) {
            if (Unit.PREFIXES.hasOwnProperty(name)) {
                var prefixes = Unit.PREFIXES[name];
                for (var prefix in prefixes) {
                    if (prefixes.hasOwnProperty(prefix)) {
                        if (prefix.indexOf(keyword) == 0) {
                            matches.push(prefix);
                        }
                        else if (keyword.indexOf(prefix) == 0) {
                            var unitKeyword = keyword.substring(prefix.length);
                            Unit.UNITS.forEach(function (unit) {
                                if (unit.name.indexOf(unitKeyword) == 0 &&
                                    Unit.isPlainUnit(prefix + unit.name)) {
                                    matches.push(prefix + unit.name);
                                }
                            });
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

if (process.argv.length > 2) {
    // execute a script file
    var file = process.argv[2];

    fs.readFile(file, function (err, data) {
        if (err) {
            console.log(err.toString());
            process.exit(1);
        }

        var parser = math.parser();
        var results = parser.eval(String(data));
        console.log(results.join('\n'));
    });
}
else {
    // handle user input

    // read the version number from package.json
    var version = 'unknown';
    try {
        var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));
        version = pkg && pkg.version;
    }
    catch (err) {}

    // output header with general information
    console.log('math.js, version ' + version);
    console.log('http://mathjs.org');
    console.log('');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer
    });
    var parser = math.parser();
    var input = function () {
        rl.question("> ", function(expr) {
            // check for exit
            if (expr.toLowerCase() == 'exit' || expr.toLowerCase() == 'quit') {
                rl.close();
            }
            else {
                // TODO: implement method clear

                // evaluate expression
                if (expr) {
                    try {
                        var res = parser.eval(expr);
                        console.log(math.format(res));
                    }
                    catch (err) {
                        console.log(err.toString());
                    }
                }

                // get next input
                input();
            }
        });
    };
    input();
}
