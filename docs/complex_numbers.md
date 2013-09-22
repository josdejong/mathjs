# Complex

Math.js supports complex numbers. Most functions can be executed with complex
numbers as arguments.

```js
var a = math.complex(2, 3);     // 2 + 3i
a.re;                           // 2
a.im;                           // 3
var b = math.complex('4 - 2i'); // 4 - 2i
math.add(a, b);                 // 6 + i
math.sqrt(-4);                  // 2i
```
