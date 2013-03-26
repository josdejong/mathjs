/**
 * Create a unit. Depending on the passed arguments, the function
 * will create and return a new math.type.Unit object.
 *
 * The method accepts the following arguments:
 *     unit(unit : string)
 *     unit(value : number, unit : string
 *
 * Example usage:
 *     var a = math.unit(5, 'cm');          // 50 mm
 *     var b = math.unit('23 kg');          // 23 kg
 *     var c = math.in(a, math.unit('m');   // 0.05 m
 *
 * @param {*} args
 * @return {Unit} value
 */
function unit(args) {
    switch(arguments.length) {
        case 1:
            // parse a string
            var str = arguments[0];
            if (!isString(str)) {
                throw new TypeError('A string or a number and string expected in function unit');
            }

            if (Unit.isUnit(str)) {
                return new Unit(null, str); // a pure unit
            }

            var u = Unit.parse(str);        // a unit with value, like '5cm'
            if (u) {
                return u;
            }

            throw new SyntaxError('String "' + str + '" is no valid unit');
            break;

        case 2:
            // a number and a unit
            return new Unit(arguments[0], arguments[1]);
            break;

        default:
            throw newArgumentsError('unit', arguments.length, 1, 2);
    }
}

math.unit = unit;
