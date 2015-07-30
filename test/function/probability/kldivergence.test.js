var assert = require('assert');
var math = require('../../../index');


describe('kldivergence', function(){
    it('should return 0, cause distributions is equals', function(){
        var q = [0.1,0.4,0.5,0.2];
        assert.equal(math.kldivergence(q, q), 0);
        assert.equal(math.kldivergence(math.matrix(q), q), 0);
        assert.equal(math.kldivergence(q, math.matrix(q)), 0);
        assert.equal(math.kldivergence(math.matrix(q), math.matrix(q)), 0);
    });

    it('should return distance between two distrubutions', function(){
        var q = [0.5,0.6,0.7];
        var p = [0.4,0.5,0.6];
        assert.notEqual(math.kldivergence(q, p), 0);
    });

    it('should return normalized distance between two distributions', function(){
        var q = [1,2,3,4,5,6,7,8];
        var p = [2,3,4,5,6,7,8,9];
        assert.notEqual(math.kldivergence(q, p), 0);
    });

    it('should return infinity', function(){
        var q = [1,2];
        var p = [0,1];
        assert.equal(math.kldivergence(q, p), Infinity);
    });

    it('should return NaN', function(){
        var q = [-1,2];
        var p = [0.4,1];
        assert.equal(isNaN(parseFloat(math.kldivergence(q, p))), true);
    });
});
