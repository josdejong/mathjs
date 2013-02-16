/**
 * Change the unit of a value. x in unit or in(x, unit)
 * @param {Unit} x
 * @param {Unit} unit
 * @return {Unit} res
 */
function unit_in(x, unit) {
    if (isUnit(x)) {
        // Test if unit has no value
        if (unit.hasValue) {
            throw new Error('Cannot convert to a unit with a value');
        }
        // Test if unit has a unit
        if (!unit.hasUnit) {
            throw new Error('Unit expected on the right hand side of function in');
        }

        var res = unit.copy();
        res.value = x.value;
        res.fixPrefix = true;

        return res;
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('in', x);
}

math2['in'] = unit_in;

/**
 * Function documentation
 */
unit_in.doc ={
    'name': 'in',
    'category': 'Units',
    'syntax': [
        'x in unit',
        'in(x, unit)'
    ],
    'description': 'Change the unit of a value.',
    'examples': [
        '5 inch in cm',
        '3.2kg in g',
        '16 bytes in bits'
    ],
    'seealso': []
};
