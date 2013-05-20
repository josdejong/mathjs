var assert = require('assert'),
    math = require('../../math.js');

// TODO: test workspace as soon as it works again after simplifying scope
return;

var workspace = math.workspace();
var id0 = workspace.append('a = 3/4');
var id1 = workspace.append('a + 2');
assert.equal(workspace.getResult(id0), 0.75);
assert.equal(workspace.getResult(id1), 2.75);
assert.deepEqual(workspace.toJSON(), [
    { id: 0, expression: 'a = 3/4', dependencies: [ 1 ], result: 0.75 },
    { id: 1, expression: 'a + 2', dependencies: [], result: 2.75 }
]);

workspace.replace('a=5/2', id0);
assert.deepEqual(workspace.toJSON(), [
    { id: 0, expression: 'a=5/2', dependencies: [ 1 ], result: 2.5 },
    { id: 1, expression: 'a + 2', dependencies: [], result: 4.5 }
]);

var id2 = workspace.insertBefore('a=10', id1);
assert.deepEqual(workspace.toJSON(), [
    { id: 0, expression: 'a=5/2', dependencies: [ 2, 1 ], result: 2.5 },
    { id: 2, expression: 'a=10', dependencies: [ 1 ], result: 10 },
    { id: 1, expression: 'a + 2', dependencies: [], result: 12 }
]);

var id3 = workspace.insertBefore('a * 3', id2);
assert.deepEqual(workspace.toJSON(), [
    { id: 0, expression: 'a=5/2', dependencies: [ 3, 2, 1 ], result: 2.5 },
    { id: 3, expression: 'a * 3', dependencies: [], result: 7.5 },
    { id: 2, expression: 'a=10', dependencies: [ 1 ], result: 10 },
    { id: 1, expression: 'a + 2', dependencies: [], result: 12 }
]);

var id4 = workspace.append('q + 2');
assert.deepEqual(workspace.toJSON(), [
    { id: 0, expression: 'a=5/2', dependencies: [ 3, 2, 1 ], result: 2.5 },
    { id: 3, expression: 'a * 3', dependencies: [], result: 7.5 },
    { id: 2, expression: 'a=10', dependencies: [ 1 ], result: 10 },
    { id: 1, expression: 'a + 2', dependencies: [], result: 12 },
    { id: 4, expression: 'q + 2', dependencies: [], result: 'Error: Undefined symbol q' }
]);

var id5 = workspace.insertAfter('q = a * 6', id3);
assert.deepEqual(workspace.toJSON(), [
    { id: 0, expression: 'a=5/2', dependencies: [ 3, 5, 4, 2, 1 ], result: 2.5 },
    { id: 3, expression: 'a * 3', dependencies: [], result: 7.5 },
    { id: 5, expression: 'q = a * 6', dependencies: [ 4 ], result: 15 },
    { id: 2, expression: 'a=10', dependencies: [ 1 ], result: 10 },
    { id: 1, expression: 'a + 2', dependencies: [], result: 12 },
    { id: 4, expression: 'q + 2', dependencies: [], result: 17 }
]);

// TODO: extensively test Workspace
