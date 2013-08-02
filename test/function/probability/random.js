var assert = require('assert'),
    _ = require('underscore'),
    math = require('../../../math.js');

var testRandom = function() {
    var picked = [], count

    _.times(1000, function() {
        picked.push(math.random(-10, 10))
    })

    count = _.filter(picked, function(val) { return val < -10 }).length
    assert.equal(count, 0)
    count = _.filter(picked, function(val) { return val > 10 }).length
    assert.equal(count, 0)

    count = _.filter(picked, function(val) { return val < -8 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= -8 && val < -6 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= -6 && val < -4 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= -4 && val < -2 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= -2 && val < 0 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= 0 && val < 2 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= 2 && val < 4 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= 4 && val < 6 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= 6 && val < 8 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val >= 8 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
}

var testRandomInt = function() {
    var picked = []
      , count

    _.times(1000, function() {
        picked.push(math.randomInt(-15, -5))
    })

    picked.forEach(function(val) {
        assert.ok(_.contains([-15, -14, -13, -12, -11, -10, -9, -8, -7, -6], val))
    })

    count = _.filter(picked, function(val) { return val === -15 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -14 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -13 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -12 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -11 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -10 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -9 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -8 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -7 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)
    count = _.filter(picked, function(val) { return val === -6 }).length
    assert.equal(math.round(count/picked.length, 1), 0.1)

}

testRandom()
testRandomInt()