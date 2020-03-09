import { containsCollections, deepForEach, reduce } from '../../utils/collection'
import { factory } from '../../utils/factory'
import { improveErrorMessage } from './utils/improveErrorMessage'
import { noBignumber, noFraction } from '../../utils/noop'

const name = 'cumsum'
const dependencies = ['typed', 'add']

export const createCumSum = /* #__PURE__ */ factory(name, dependencies, ({ typed, add }) => {
    /**
     * Compute the cumulative sum of a matrix or a list with values.
     * In case of a (multi dimensional) array or matrix, the cumulative sum of
     * across a certain dimension will be calculated.
     *
     * Syntax:
     *
     *     math.cumsum(a, b, c, ...)
     *     math.cumsum(A)
     *
     * Examples:
     *
     *     math.cumsum(2, 1, 4, 3)               // returns [2,3,7,10]
     *     math.cumsum([2, 1, 4, 3])             // returns [2,3,7,10]
     *     math.cumsum([[2, 5], [4, 3], [1, 7]]) // returns [[2,5],[6,8],[7,15]]
     *
     * See also:
     *
     *    mean, median, min, max, prod, std, variance
     *
     * @param {... *} args  A single matrix or or multiple scalar values
     * @return {*} The cumulative sum of all values
     */
    return typed(name, {
        // sum([a, b, c, d, ...])
        'Array | Matrix': _cumsum,

        // sum([a, b, c, d, ...], dim)
        'Array | Matrix, number | BigNumber': _ncumSumDim,

        // cumsum(a, b, c, d, ...)
        '...': function(args) {
            if (containsCollections(args)) {
                throw new TypeError('All values expected to be scalar in function cumsum')
            }

            return _cumsum(args)
        }
    })

    /**
     * Recursively calculate the sum of an n-dimensional array
     * @param {Array} array
     * @return {number} sum
     * @private
     */
    function _cumsum(array) {
        return array && array.map((sum => value => sum = add(sum, value))(0)) || []
    }

    function _ncumSumDim(array, dim) {
        try {
            return _cumsummap(array, dim)
        } catch (err) {
            throw improveErrorMessage(err, name)
        }
    }
    /* TODO: Get this function from collection.js*/
    /**
     * Transpose a matrix
     * @param {Array} mat
     * @returns {Array} ret
     * @private
     */
    function _switch(mat) {
        const I = mat.length
        const J = mat[0].length
        let i, j
        const ret = []
        for (j = 0; j < J; j++) {
            const tmp = []
            for (i = 0; i < I; i++) {
                tmp.push(mat[i][j])
            }
            ret.push(tmp)
        }
        return ret
    }

    /*Possible TODO: Refactor _reduce in collection.js to be able to work here as well*/
    function _cumsummap(mat, dim) {
        let i, ret, tran

        if (dim <= 0) {
            if (!Array.isArray(mat[0][0])) {
                return mat.map((sum => value => sum = add(sum, value))(0))
            } else {
                tran = _switch(mat)
                ret = []
                for (i = 0; i < tran.length; i++) {
                    ret[i] = _cumsummap(tran[i], dim - 1)
                }
                return ret
            }
        } else {
            ret = []
            for (i = 0; i < mat.length; i++) {
                ret[i] = _cumsummap(mat[i], dim - 1)
            }
            return ret
        }
    }

})