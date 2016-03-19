/**
 * This is a little tool to generate reference documentation of all math.js
 * functions under ./lib/functions. This is NO generic solution.
 *
 * The tool can parse documentation information from the block comment in the
 * functions code, and generate a markdown file with the documentation.
 */
var fs = require('fs');
var glob = require('glob');
var mkdirp = require('mkdirp');
var gutil = require('gulp-util');

// special cases for function syntax
var SYNTAX = {
  cbrt: 'math.cbrt(x [, allRoots])',
  gcd: 'math.gcd(a, b)',
  log: 'math.log(x [, base])',
  lcm: 'math.lcm(a, b)',
  norm: 'math.norm(x [, p])',
  round: 'math.round(x [, n])',
  complex: 'math.complex(re, im)',
  matrix: 'math.matrix(x)',
  sparse: 'math.sparse(x)',
  unit: 'math.unit(x)',
  eval: 'math.eval(expr [, scope])',
  parse: 'math.parse(expr [, scope])',
  concat: 'math.concat(a, b, c, ... [, dim])',
  ones: 'math.ones(m, n, p, ...)',
  range: 'math.range(start, end [, step])',
  resize: 'math.resize(x, size [, defaultValue])',
  subset: 'math.subset(x, index [, replacement])',
  zeros: 'math.zeros(m, n, p, ...)',
  permutations: 'math.permutations(n [, k])',
  random: 'math.random([min, max])',
  randomInt: 'math.randomInt([min, max])',
  format: 'math.format(value [, precision])',
  'import': 'math.import(object, override)',
  print: 'math.print(template, values [, precision])'
};

var IGNORE_FUNCTIONS = {
  distribution: true
};

var IGNORE_WARNINGS = {
  seeAlso: ['help', 'intersect', 'clone', 'typeof', 'chain', 'import', 'config', 'typed'],
  parameters: ['parser'],
  returns: ['forEach', 'import']
};

/**
 * Extract JSON documentation from the comments in a file with JavaScript code
 * @param {String} name    Function name
 * @param {String} code    javascript code containing a block comment
 *                         describing a math.js function
 * @return {Object} doc    json document
 */
function generateDoc(name, code) {
  // get block comment from code
  var match = /\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//.exec(code);

  if (!match) {
    return null;
  }

  // get text content inside block comment
  var comment = match[0].replace('/**', '')
      .replace('*/', '')
      .replace(/\n\s*\* ?/g, '\n')
      .replace(/\r/g, '');

  var lines = comment.split('\n'),
      line = '';

  // get next line
  function next () {
    line = lines.shift();
  }

  // returns true if current line is empty
  function empty() {
    return !line || !line.trim();
  }

  // returns true if there still is a current line
  function exists() {
    return line !== undefined;
  }

  // returns true if current line is a header like 'Syntax:'
  function isHeader() {
    return /^(Name|Syntax|Description|Examples|See also)/i.test(line);
  }

  // returns true if the current line starts with an annotation like @param
  function isAnnotation() {
    return /^@/.test(line);
  }

  function skipEmptyLines () {
    while (exists() && empty()) next();
  }

  function stripLeadingSpaces(lines) {
    var spaces = null;
    lines.forEach(function (line) {
      var match = /^ +/.exec(line);
      var s = match && match[0] && match[0].length;
      if (s > 0 && (spaces == null || s < spaces)) {
        spaces = s;
      }
    });

    if (spaces) {
      lines.forEach(function (line, index) {
        lines[index] = line.substring(spaces);
      })
    }
  }

  function parseDescription () {
    var description = '';

    while (exists() && !isHeader() && !isAnnotation()) {
      description += line + '\n';

      next();
    }

    // remove trailing returns
    while (description.charAt(description.length - 1) == '\n') {
      description = description.substring(0, description.length - 1);
    }

    doc.description = description;
  }

  function parseSyntax() {
    if (/^syntax/i.test(line)) {
      next();
      skipEmptyLines();

      while (exists() && !empty()) {
        doc.syntax.push(line);
        next();
      }
      stripLeadingSpaces(doc.syntax);

      skipEmptyLines();

      return true;
    }
    return false;
  }

  function parseWhere() {
    if (/^where/i.test(line)) {
      next();
      skipEmptyLines();

      while (exists() && !empty()) {
        doc.where.push(line);
        next();
      }

      skipEmptyLines();

      return true;
    }
    return false;
  }

  function parseExamples() {
    if (/^example/i.test(line)) {
      next();
      skipEmptyLines();

      while (exists() && (empty() || line.charAt(0) == ' ')) {
        doc.examples.push(line);
        next();
      }
      stripLeadingSpaces(doc.examples);

      if (doc.examples[doc.examples.length - 1].trim() == '') doc.examples.pop();

      skipEmptyLines();

      return true;
    }
    return false;
  }

  function parseSeeAlso() {
    if (/^see also/i.test(line)) {
      next();
      skipEmptyLines();

      while (exists() && !empty()) {
        var names = line.split(',');
        doc.seeAlso = doc.seeAlso.concat(names.map(function (name) {
          return name.trim();
        }));
        next();
      }

      skipEmptyLines();

      return true;
    }
    return false;
  }

  function trim (text) {
    return text.trim();
  }

  // replace characters like '<' with HTML entities like '&lt;'
  function escapeTags (text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function parseParameters() {
    var count = 0;
    do {
      var match = /\s*@param\s*\{(.*)}\s*\[?(\w*)]?\s*(.*)?$/.exec(line);
      if (match) {
        next();

        count++;
        var annotation = {
          name: match[2] || '',
          description: (match[3] || '').trim(),
          types: match[1].split('|').map(trim).map(escapeTags)
        };
        doc.parameters.push(annotation);

        // TODO: this is an ugly hack to extract the default value
        var index = annotation.description.indexOf(']');
        var defaultValue = null;
        if (index != -1) {
          defaultValue = annotation.description.substring(1, index).trim();
          annotation.description = annotation.description.substring(index + 1).trim();
        }

        // multi line description
        while (exists() && !empty() && /^\s{6}/.test(line)) {
          annotation.description += ' ' + line.trim();
          next();
        }

        if (defaultValue !== null) {
          annotation.description += ' Default value: ' + defaultValue + '.';
        }
      }
    } while (match);

    return count > 0;
  }

  function parseReturns() {
    var match = /\s*@returns?\s*\{(.*)}\s*(.*)?$/.exec(line);
    if (match) {
      next();

      doc.returns = {
        description: match[2] || '',
        types: match[1].split('|').map(trim).map(escapeTags)
      };

      // multi line description
      while (exists() && !empty() && /^\s{6}/.test(line)) {
        doc.returns.description += ' ' + line.trim();
        next();
      }

      return true;
    }
    return false;
  }

  // initialize doc
  var doc = {
    name: name,
    description: '',
    syntax: [],
    where: [],
    examples: [],
    seeAlso: [],
    parameters: [],
    returns: null
  };

  next();
  skipEmptyLines();
  parseDescription();

  do {
    skipEmptyLines();

    var handled = parseSyntax() ||
        parseWhere() ||
        parseExamples() ||
        parseSeeAlso() ||
        parseParameters() ||
        parseReturns();

    if (!handled) {
      // skip this line, no one knows what to do with it
      next();
    }
  } while (exists());

  return doc;
}

/**
 * Validate whether all required fields are available in given doc
 * @param {Object} doc
 * @return {String[]} issues
 */
function validateDoc (doc) {
  var issues = [];

  function ignore(field) {
    return IGNORE_WARNINGS[field].indexOf(doc.name) !== -1
  }

  if (!doc.name) {
    issues.push('name missing in document');
  }

  if (!doc.description) {
    issues.push('function "' + doc.name + '": description missing');
  }

  if (!doc.syntax || doc.syntax.length == 0) {
    issues.push('function "' + doc.name + '": syntax missing');
  }

  if (!doc.examples || doc.examples.length == 0) {
    issues.push('function "' + doc.name + '": examples missing');
  }

  if (doc.parameters && doc.parameters.length) {
    doc.parameters.forEach(function (param, index) {
      if (!param.name || !param.name.trim()) {
        issues.push('function "' + doc.name + '": name missing of parameter ' + index + '');
      }
      if (!param.description || !param.description.trim()) {
        issues.push('function "' + doc.name + '": description missing for parameter ' + (param.name || index));
      }
      if (!param.types || !param.types.length) {
        issues.push('function "' + doc.name + '": types missing for parameter ' + (param.name || index));
      }
    });
  }
  else {
    if (!ignore('parameters')) {
      issues.push('function "' + doc.name + '": parameters missing');
    }
  }

  if (doc.returns) {
    if (!doc.returns.description || !doc.returns.description.trim()) {
      issues.push('function "' + doc.name + '": description missing of returns');
    }
    if (!doc.returns.types || !doc.returns.types.length) {
      issues.push('function "' + doc.name + '": types missing of returns');
    }
  }
  else {
    if (!ignore('returns')) {
      issues.push('function "' + doc.name + '": returns missing');
    }
  }

  if (!doc.seeAlso || doc.seeAlso.length == 0) {
    if (!ignore('seeAlso')) {
      issues.push('function "' + doc.name + '": seeAlso missing');
    }
  }

  return issues;
}

/**
 * Generate markdown
 * @param {Object} doc          A JSON object generated with generateDoc()
 * @param {Object} functions    All functions, used to generate correct links
 *                              under seeAlso
 * @returns {string} markdown   Markdown contents
 */
function generateMarkdown (doc, functions) {
  var text = '';

  // TODO: should escape HTML characters in text

  text += '<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->\n\n';

  text += '# Function ' + doc.name + '\n\n';

  text += doc.description + '\n\n\n';

  if (doc.syntax && doc.syntax.length) {
    text += '## Syntax\n\n' +
        '```js\n' +
        doc.syntax.join('\n') +
        '\n```\n\n';
  }

  if (doc.where && doc.where.length) {
    text += '### Where\n\n' + doc.where.join('\n') + '\n\n';
  }

  text += '### Parameters\n\n' +
      'Parameter | Type | Description\n' +
      '--------- | ---- | -----------\n' +
      doc.parameters.map(function (p) {
        return '`' + p.name + '` | ' +
            (p.types ? p.types.join(' &#124; ') : '') + ' | ' +
            p.description
      }).join('\n') +
      '\n\n';

  if (doc.returns) {
    text += '### Returns\n\n' +
        'Type | Description\n' +
        '---- | -----------\n' +
        (doc.returns.types ? doc.returns.types.join(' &#124; ') : '') + ' | ' + doc.returns.description +
        '\n\n\n';
  }

  if (doc.examples && doc.examples.length) {
    text += '## Examples\n\n' +
        '```js\n' +
        doc.examples.join('\n') +
        '\n```\n\n\n';
  }

  if (doc.seeAlso && doc.seeAlso.length) {
    text += '## See also\n\n' +
        doc.seeAlso.map(function (name) {
          return '[' + name + '](' + name + '.md)';
        }).join(',\n') +
        '\n';
  }

  return text;
}

/**
 * Iterate over all source files and generate markdown documents for each of them
 * @param {String} inputPath   Path to /lib/
 * @param {String} outputPath  Path to /docs/reference/functions
 * @param {String} outputRoot  Path to /docs/reference
 */
function iteratePath (inputPath, outputPath, outputRoot) {
  if (!fs.existsSync(outputPath)) {
    mkdirp.sync(outputPath);
  }

  glob(inputPath + '**/*.js', null, function (err, files) {
    // generate path information for each of the files
    var functions = {}; // TODO: change to array

    files.forEach(function (fullPath) {
      var path = fullPath.split('/');
      var name = path.pop().replace(/.js$/, '');
      var functionIndex = path.indexOf('function');
      var category;

      // Note: determining whether a file is a function and what it's category
      // is is a bit tricky and quite specific to the structure of the code,
      // we reckon with some edge cases here.
      if (path.indexOf('docs') === -1 && functionIndex !== -1) {
        if (path.indexOf('expression') !== -1) {
          category = 'expression';
        }
        else if (/^.\/lib\/type\/[a-zA-Z0-9_]*\/function/.test(fullPath)) {
          category = 'construction';
        }
        else if (/^.\/lib\/core\/function/.test(fullPath)) {
          category = 'core';
        }
        else {
          category = path[functionIndex + 1];
        }
      }
      else if (path.join('/') === './lib/type') {
        // for boolean.js, number.js, string.js
        category = 'construction';
      }

      if (IGNORE_FUNCTIONS[name]) {
        category = null;
      }

      if (category) {
        functions[name] = {
          name: name,
          category: category,
          fullPath: fullPath,
          relativePath: fullPath.substring(inputPath.length)
        };
      }
    });

    // loop over all files, generate a doc for each of them
    var issues = [];
    for (var name in functions) {
      if (functions.hasOwnProperty(name)) {
        var fn = functions[name];
        var code = String(fs.readFileSync(fn.fullPath));

        var isFunction = code.indexOf('exports.name') !== -1
            && code.indexOf('exports.factory') !== -1
            && code.indexOf('exports.path') === -1;
        var doc = isFunction && generateDoc(name, code);

        if (isFunction && doc) {
          fn.doc = doc;
          issues = issues.concat(validateDoc(doc));
          var markdown = generateMarkdown(doc, functions);
          fs.writeFileSync(outputPath + '/' + fn.name + '.md', markdown);
        }
        else {
          //gutil.log('Ignoring', fn.fullPath);
          delete functions[name];
        }
      }
    }

    /**
     * Helper function to generate a markdown list entry for a function.
     * Used to generate both alphabetical and categorical index pages.
     * @param {string} name Function name
     * @returns {string}    Returns a markdown list entry
     */
    function functionEntry (name) {
      var fn = functions[name];
      var syntax = SYNTAX[name] || fn.doc && fn.doc.syntax && fn.doc.syntax[0] || name;
      syntax = syntax
          //.replace(/^math\./, '')
          .replace(/\s+\/\/.*$/, '')
          .replace(/;$/, '');
      if (syntax.length < 40) {
        syntax = syntax.replace(/ /g, '&nbsp;');
      }

      var description = '';
      if (fn.doc.description) {
        description = fn.doc.description.replace(/\n/g, ' ').split('.')[0] + '.';
      }

      return '[' + syntax + '](functions/' + name + '.md) | ' + description;
    }

    /**
     * Change the first letter of the given string to upper case
     * @param {string} text
     */
    function toCapital (text) {
      return text[0].toUpperCase() + text.slice(1);
    }

    var order = ['core', 'construction', 'expression']; // and then the rest
    function categoryIndex (entry) {
      var index = order.indexOf(entry);
      return index === -1 ? Infinity : index;
    }
    function compareAsc (a, b) {
      return a > b ? 1 : (a < b ? -1 : 0);
    }
    function compareCategory (a, b) {
      var indexA = categoryIndex(a);
      var indexB = categoryIndex(b);
      return (indexA > indexB) ? 1 : (indexA < indexB ? -1 : compareAsc(a, b));
    }

    // generate categorical page with all functions
    var categories = {};
    Object.keys(functions).forEach(function (name) {
      var fn = functions[name];
      var category = categories[fn.category];
      if (!category) {
        categories[fn.category] = {};
      }
      categories[fn.category][name] = fn;
    });
    var categorical = '# Function reference\n\n';
    categorical += Object.keys(categories).sort(compareCategory).map(function (category) {
      var functions = categories[category];

      return '## ' + toCapital(category) + ' functions\n\n' +
          'Function | Description\n' +
          '---- | -----------\n' +
        Object.keys(functions).sort().map(functionEntry).join('\n') + '\n';
    }).join('\n');
    categorical += '\n\n\n<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->\n';

    fs.writeFileSync(outputRoot + 'functions.md', categorical);


    // output all issues
    if (issues.length) {
      issues.forEach(function (issue) {
        gutil.log('Warning: ' + issue);
      });
      gutil.log(issues.length + ' warnings');
    }
  });
}

// exports
exports.iteratePath = iteratePath;
exports.generateDoc = generateDoc;
exports.validateDoc = validateDoc;
exports.generateMarkdown = generateMarkdown;