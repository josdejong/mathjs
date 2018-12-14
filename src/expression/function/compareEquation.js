// 'use strict'

function factory(type, config, load, typed) {
    const parse = load(require('../parse'))
    const evalEql = load(require('./eval'))

    /**
     * Evaluate an equation.
     
     * Syntax:
     *
     *     math.compareEquation(expr)
     *     math.eval(expr, scope)
     *
     * Example:
     *
     *     math.compareEquation('a^2+b^2c^2')               // false
     *     math.compareEquation('a^2+b^2=c^2', {
                a: 3,
                b: 4,
                c: 5
            })       // true
     *
     * See also:
     *
     *    eval, compile
     *
     * @param {string} expr   The expression to be evaluated, always return false without '=' signal
     * @param {Object} [scope]                    Scope to read/write variables
     * @return {Boolean} The result of the expression
     */
    return typed('compile', {
        'string': function (expr) {
            return false
        },

        'string, Object': function (expr, scope) {
            const operator = {
                '=': (a, b) => a === b,
                '>': (a, b) => a > b,
                '<': (a, b) => a < b
            };
            const keys = Object.keys(operator)
            const arr = expr.split('').filter(item => keys.includes(item))
            if (arr.length) {
                const arrNew = expr.split(arr[0])
                const left = evalEql(arrNew[0], scope)
                const right = evalEql(arrNew[1], scope)
                return operator[arr[0]](left, right)
            } else {
                return false
            }
        },


    })
}

exports.name = 'compareEquation'
exports.factory = factory
