/**
 * Create a chained value. All methods available in the math.js library
 * can be called upon the value, and then will be evaluated with the
 * value itself as first argument.
 * The chain can be closed by executing chain.done(), which will return the
 * final value.
 * @param {*} value
 * @return {math.type.Chain} chain
 */
math.chain = function chain(value) {
    return new math.type.Chain(value);
};
