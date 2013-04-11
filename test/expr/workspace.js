var assert = require('assert'),
    math = require('../../math.js');

var workspace = math.workspace();
var id0 = workspace.append('a = 3/4');
var id1 = workspace.append('a + 2');
assert.equal(workspace.getResult(id0), 0.75);
assert.equal(workspace.getResult(id1), 2.75);
workspace.replace('a=5/2', id0);
assert.equal(workspace.getResult(id0), 2.5);
assert.equal(workspace.getResult(id1), 4.5);


// TODO: extensively test Workspace
