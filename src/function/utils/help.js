/**
 * Display documentation on a function or data type
 * @param {function | string | Object} subject
 * @return {String} documentation
 */
function help(subject) {
    if (subject.doc) {
        return generateDoc(subject.doc);
    }
    else if (subject.constructor.doc) {
        return generateDoc(subject.constructor.doc);
    }
    else if (isString(subject)) {
        // search the subject in the methods
        var obj = math[subject];
        if (obj && obj.doc) {
            return generateDoc(obj.doc);
        }

        // search the subject in the types
        for (var t in math.type) {
            if (math.type.hasOwnProperty(t)) {
                if (subject.toLowerCase() == t.toLowerCase() && math.type[t].doc) {
                    return generateDoc(math.type[t].doc);
                }
            }
        }
    }

    // TODO: generate documentation for constants, number and string

    if (subject instanceof Object && subject.name) {
        return 'No documentation found on subject "' + subject.name +'"';
    }
    else if (subject instanceof Object && subject.constructor.name) {
        return 'No documentation found on subject "' + subject.constructor.name +'"';
    }
    else {
        return 'No documentation found on subject "' + subject +'"';
    }
}

math.help = help;

/**
 * Generate readable documentation from a documentation object
 * @param {Object} doc
 * @return {String} readableDoc
 * @private
 */
function generateDoc (doc) {
    var desc = '';

    if (doc.name) {
        desc += 'NAME\n' + doc.name + '\n\n';
    }
    if (doc.category) {
        desc += 'CATEGORY\n' + doc.category + '\n\n';
    }
    if (doc.syntax) {
        desc += 'SYNTAX\n' + doc.syntax.join('\n') + '\n\n';
    }
    if (doc.examples) {
        desc += 'EXAMPLES\n';
        for (var i = 0; i < doc.examples.length; i++) {
            desc += doc.examples[i] + '\n';
            // TODO: evaluate the examples
        }
        desc += '\n';
    }
    if (doc.seealso) {
        desc += 'SEE ALSO\n' + doc.seealso.join(', ') + '\n';
    }

    return desc;
}

math.abs = abs;

/**
 * Function documentation
 */
help.doc = {
    'name': 'help',
    'category': 'Utils',
    'syntax': [
        'help(object)'
    ],
    'description': 'Display documentation on a function or data type.',
    'examples': [
        'help("sqrt")',
        'help("Complex")'
    ],
    'seealso': []
};
