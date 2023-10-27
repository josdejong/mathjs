import Alpine from 'alpinejs'

console.log(Alpine)
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
(function (mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
      mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
      define(["../../lib/codemirror"], mod);
    else // Plain browser env
      mod(CodeMirror);
  })(function (CodeMirror) {
    "use strict";
  
    CodeMirror.defineMode("mathjs", function () {
      function wordRegexp(words) {
        return new RegExp("^((" + words.join(")|(") + "))\\b");
      }
  
      let singleOperators = new RegExp("^[\\+\\-\\*/&|\\^~<>!%']");
      let singleDelimiters = new RegExp('^[\\(\\[\\{\\},:=;\\.?]');
      let doubleOperators = new RegExp("^((==)|(!=)|(<=)|(>=)|(<<)|(>>)|(\\.[\\+\\-\\*/\\^]))");
      let doubleDelimiters = new RegExp("^((!=)|(\^\\|))");
      let tripleDelimiters = new RegExp("^((>>>)|(<<<))");
      let expressionEnd = new RegExp("^[\\]\\)]");
      let identifiers = new RegExp("^[_A-Za-z\xa1-\uffff][_A-Za-z0-9\xa1-\uffff]*");
  
      const mathFunctions = []
      const mathPhysicalConstants = []
      const mathIgnore = ['expr', 'type']
      const numberLiterals = ['e', 'E', 'i', 'Infinity', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'NaN',
      'null', 'phi', 'pi', 'PI', 'SQRT1_2', 'SQRT2', 'tau', 'undefined', 'version']
  
      // based on https://github.com/josdejong/mathjs/blob/develop/bin/cli.js
      for (const expression in math.expression.mathWithTransform) {
        if (!mathIgnore.includes(expression)) {
          if (typeof math[expression] === "function") {
            mathFunctions.push(expression)
          } else if(!numberLiterals.includes(expression)) {
            mathPhysicalConstants.push(expression)
          }
        }
      }
  
      let builtins = wordRegexp(mathFunctions);
  
      let keywords = wordRegexp(['to', 'in', 'and', 'not', 'or', 'xor', 'mod']);
  
      // generates a list of all valid units in mathjs
      let listOfUnits = []
      for (const unit in math.Unit.UNITS) {
        for (const prefix in math.Unit.UNITS[unit].prefixes) {
          listOfUnits.push(prefix + unit)
        }
      }
  
      // remove duplicates
      let units = wordRegexp(Array.from(new Set(listOfUnits)))
  
      // physicalCOnstants https://mathjs.org/docs/datatypes/units.html#physical-constants
      let physicalConstants = wordRegexp(mathPhysicalConstants)
  
      // tokenizers
      function tokenTranspose(stream, state) {
        if (!stream.sol() && stream.peek() === '\'') {
          stream.next();
          state.tokenize = tokenBase;
          return 'operator';
        }
        state.tokenize = tokenBase;
        return tokenBase(stream, state);
      }
  
  
      function tokenComment(stream, state) {
        if (stream.match(/^.*#}/)) {
          state.tokenize = tokenBase;
          return 'comment';
        };
        stream.skipToEnd();
        return 'comment';
      }
  
      function tokenBase(stream, state) {
        // whitespaces
        if (stream.eatSpace()) return null;
  
        // Handle one line Comments
        if (stream.match('#{')) {
          state.tokenize = tokenComment;
          stream.skipToEnd();
          return 'comment';
        }
  
        if (stream.match(/^[#]/)) {
          stream.skipToEnd();
          return 'comment';
        }
  
        // Handle Number Literals
        if (stream.match(/^[0-9\.+-]/, false)) {
          if (stream.match(/^[+-]?0x[0-9a-fA-F]+[ij]?/)) {
            stream.tokenize = tokenBase;
            return 'number';
          };
          if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?[ij]?/)) { return 'number'; };
          if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?[ij]?/)) { return 'number'; };
        }
        if (stream.match(wordRegexp(numberLiterals))) { return 'number'; };
  
  
  
  
        // Handle Strings
        let m = stream.match(/^"(?:[^"]|"")*("|$)/) || stream.match(/^'(?:[^']|'')*('|$)/)
        if (m) { return m[1] ? 'string' : "string error"; }
  
        // Handle words
        if (stream.match(keywords)) { return 'keyword'; };
        if (stream.match(builtins)) { return 'builtin'; };
        if (stream.match(physicalConstants)) { return 'tag'; };
        if (stream.match(units)) { return 'attribute'; };
        if (stream.match(identifiers)) { return 'variable'; };
  
        if (stream.match(singleOperators) || stream.match(doubleOperators)) { return 'operator'; };
        if (stream.match(singleDelimiters) || stream.match(doubleDelimiters) || stream.match(tripleDelimiters)) { return null; };
  
        if (stream.match(expressionEnd)) {
          state.tokenize = tokenTranspose;
          return null;
        };
  
  
        // Handle non-detected items
        stream.next();
        return 'error';
      };
  
      return {
        startState: function () {
          return {
            tokenize: tokenBase
          };
        },
  
        token: function (stream, state) {
          let style = state.tokenize(stream, state);
          if (style === 'number' || style === 'variable') {
            state.tokenize = tokenTranspose;
          }
          return style;
        },
  
        lineComment: '#',
  
        fold: 'indent'
      };
    });
  
    CodeMirror.defineMIME("text/x-mathjs", "mathjs");
  
  });
  