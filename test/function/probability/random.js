var assert = require('assert'),
    _ = require('underscore'),
    math = require('../../../math.js');

var assertApproxEqual = function(testVal, val, tolerance) {
    var diff = Math.abs(val - testVal) 
    if (diff > tolerance) assert.equal(testVal, val) 
    else assert.ok(diff <= tolerance)
}

var assertUniformDistribution = function(values, min, max) {
    var interval = (max - min) / 10
    count = _.filter(values, function(val) { return val < min }).length
    assert.equal(count, 0)
    count = _.filter(values, function(val) { return val > max }).length
    assert.equal(count, 0)

    count = _.filter(values, function(val) { return val < (min + interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + interval) && val < (min + 2 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + 2 * interval) && val < (min + 3 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + 3 * interval) && val < (min + 4 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + 4 * interval) && val < (min + 5 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + 5 * interval) && val < (min + 6 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + 6 * interval) && val < (min + 7 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + 7 * interval) && val < (min + 8 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + 8 * interval) && val < (min + 9 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)
    count = _.filter(values, function(val) { return val >= (min + 9 * interval) }).length
    assert.equal(math.round(count/values.length, 1), 0.1)

}

var testRandomFloat = function() {
    var picked = [], count

    _.times(1000, function() {
        picked.push(math.random())
    })
    assertUniformDistribution(picked, 0, 1)
}

var testRandomFloatMinMax = function() {
    var picked = [], count

    _.times(1000, function() {
        picked.push(math.random(-10, 10))
    })
    assertUniformDistribution(picked, -10, 10)
}

var testRandomMatrix = function() {
    var picked = [],
        matrices = [],
        size = [2, 3, 4],
        count, matrix

    _.times(100, function() {
        matrices.push(math.random(size))
    })

    // Collect all values in one array
    matrices.forEach(function(matrix) {
        assert.deepEqual(matrix.size(), size)
        matrix.forEach(function(val) {
            picked.push(val)
        })
    })
    assert.equal(picked.length, 2 * 3 * 4 * 100)

    assertUniformDistribution(picked, 0, 1)
}

var testRandomMatrixMinMax = function() {
    var picked = [],
        matrices = [],
        size = [2, 3, 4],
        count, matrix

    _.times(100, function() {
        matrices.push(math.random(size, -103, 8))
    })

    // Collect all values in one array
    matrices.forEach(function(matrix) {
        assert.deepEqual(matrix.size(), size)
        matrix.forEach(function(val) {
            picked.push(val)
        })
    })
    assert.equal(picked.length, 2 * 3 * 4 * 100)

    assertUniformDistribution(picked, -103, 8)
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

var testPickRandom = function() {
    var possibles = [11, 22, 33, 44, 55],
        picked = [],
        count

    _.times(1000, function() {
        picked.push(math.pickRandom(possibles))
    })

    count = _.filter(picked, function(val) { return val === 11 }).length
    assert.equal(math.round(count/picked.length, 1), 0.2)

    count = _.filter(picked, function(val) { return val === 22 }).length
    assert.equal(math.round(count/picked.length, 1), 0.2)

    count = _.filter(picked, function(val) { return val === 33 }).length
    assert.equal(math.round(count/picked.length, 1), 0.2)

    count = _.filter(picked, function(val) { return val === 44 }).length
    assert.equal(math.round(count/picked.length, 1), 0.2)

    count = _.filter(picked, function(val) { return val === 55 }).length
    assert.equal(math.round(count/picked.length, 1), 0.2)
}

var testRandomNormal = function() {
    var picked = [], count, distribution = math.distribution('normal')

    _.times(100000, function() {
        picked.push(distribution.random())
    })
    count = _.filter(picked, function(val) { return val < 0 }).length
    assert.equal(count, 0)
    count = _.filter(picked, function(val) { return val > 1 }).length
    assert.equal(count, 0)

    count = _.filter(picked, function(val) { return val < 0.25 }).length
    assertApproxEqual(count/picked.length, 0.07, 0.01)
    count = _.filter(picked, function(val) { return val < 0.4 }).length
    assertApproxEqual(count/picked.length, 0.27, 0.01)
    count = _.filter(picked, function(val) { return val < 0.5 }).length
    assertApproxEqual(count/picked.length, 0.5, 0.01)
    count = _.filter(picked, function(val) { return val < 0.6 }).length
    assertApproxEqual(count/picked.length, 0.73, 0.01)
    count = _.filter(picked, function(val) { return val < 0.75 }).length
    assertApproxEqual(count/picked.length, 0.93, 0.01)
}

testRandomFloat()
testRandomFloatMinMax()
testRandomMatrix()
testRandomMatrixMinMax()


testRandomInt()
testPickRandom()

testRandomNormal()