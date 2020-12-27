# Serialization

Math.js has a number of data types like `Matrix`, `Complex`, and `Unit`. These
types are instantiated JavaScript objects. To be able to store these data types
or send them between processes, they must be serialized. The data types of
math.js can be serialized to JSON. Use cases:

- Store data in a database or on disk.
- Interchange of data between a server and a client.
- Interchange of data between a web worker and the browser.

Math.js types can be serialized using JavaScript's built-in `JSON.stringify`
function:

```js
const x = math.complex('2 + 3i')
const str = JSON.stringify(x, math.replacer)
console.log(str)
// outputs a string '{"mathjs":"Complex","re":2,"im":3}'
```

> IMPORTANT: in most cases works, serialization correctly without
> passing the `math.replacer` function as second argument. This is because
> in most cases we can rely on the default behavior of JSON.stringify, which 
> uses the `.toJSON` method on classes like `Unit` and `Complex` to correctly 
> serialize them. However, there are a few special cases like the 
> number `Infinity` which does require the replacer function in order to be 
> serialized without losing information: without it, `Infinity` will be 
> serialized as `"null"` and cannot be deserialized correctly.
>
> So, it's best to always pass the `math.replacer` function to prevent 
> weird edge cases.

In order to deserialize a string, containing math.js data types, `JSON.parse`
can be used. In order to recognize the data types of math.js, `JSON.parse` must
be called with the reviver function of math.js:

```js
const json = '{"mathjs":"Unit","value":5,"unit":"cm","fixPrefix":false}'
const x = JSON.parse(json, math.reviver)   // Unit 5 cm
```

Note that if math.js is used in conjunction with other data types, it is
possible to use multiple reviver functions at the same time by cascading them:

```js
const reviver = function (key, value) {
  return reviver1(key, reviver2(key, value))
}
```
