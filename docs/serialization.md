# Serialization

Math.js has a number of data types like `Matrix`, `Complex`, and `Unit`. These
types are instantiated JavaScript objects. In order to share these data types
between a server and a client, or a web worker and the browser, these data
types must be serialized. The data types of math.js can be serialized to JSON.

Math.js types can be serialized using JavaScript's built-in `JSON.stringify`
function:

```js
var x   = math.complex('2 + 3i');
var str = JSON.stringify(x);
console.log(str);
// outputs a string '{"mathjs":"Complex","re":2,"im":3}'
```

In order to deserialize a string, containing math.js data types, `JSON.parse`
can be used. In order to recognize the data types of math.js, `JSON.parse` must
be called with the reviver function of math.js:

```js
var json = '{"mathjs":"Complex","re":2,"im":3}';
var x    = JSON.parse(json, math.json.reviver);   // Complex 2 + 3i
```

Note that if math.js is used in conjunction with other data types, it is
possible to use multiple reviver functions by cascading them, like:

```js
var reviver = function (key, value) {
  return math.json.reviver(key, otherReviver(key, value));
}
```
