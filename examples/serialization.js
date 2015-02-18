var math = require('../index');

// serialize a math.js data type into a JSON string
var x = math.complex('2 + 3i');
var str1 = JSON.stringify(x);
console.log(str1);
// outputs {"@type":"Complex","re":2,"im":3}

// deserialize a JSON string into a math.js data type
// note that the reviver of math.js is needed for this:
var str2 = '{"@type":"Complex","re":2,"im":3}';
var y = JSON.parse(str2, math.json.reviver);
console.log(math.typeof(y));  // 'complex'
console.log(y.toString());    // 2 + 3i
