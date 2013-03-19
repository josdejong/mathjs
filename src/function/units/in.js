/**
 * Change the unit of a value. x in unit or in(x, unit)
 * @param {Unit | Array} x
 * @param {Unit | Array} unit
 * @return {Unit | Array} res
 */
function unit_in(x, unit) {
    if (arguments.length != 2) {
        throw newArgumentsError('in', arguments.length, 2);
    }

    if (x instanceof Unit && unit instanceof Unit) {
        if (!x.equalBase(unit)) {
            throw new Error('Units do not match');
        }
        if (unit.hasValue) {
            throw new Error('Cannot convert to a unit with a value');
        }
        if (!unit.hasUnit) {
            throw new Error('Unit expected on the right hand side of function in');
        }

        var res = unit.clone();
        res.value = x.value;
        res.fixPrefix = true;

        return res;
    }

    if (x instanceof Array || unit instanceof Array) {
        return util.map2(x, unit, unit_in);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.in(x.valueOf());
    }

    throw newUnsupportedTypeError('in', x);
}

math.in = unit_in;

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
