# Function round

Round a value towards the nearest integer. When `n` is specified, the value is rounded to `n` decimals. If `x` is complex, both real and imaginary part are rounded towards the nearest integer. For matrices, the function is evaluated element wise.


## Syntax

```js
math.round(x)
math.round(x, n)
```

### Parameters

Parameter | Type | Description
--------- | ---- | -----------
`x`       | Number &#124; BigNumber &#124; Boolean &#124; Complex &#124; Array &#124; Matrix | Number to be rounded
`n`       | Number &#124; BigNumber &#124; Boolean &#124; Array | Number of decimals. Optional, 0 by default.

### Returns

Type | Description
---- | -----------
Number &#124; BigNumber &#124; Complex &#124; Array &#124; Matrix | Rounded value


## Examples

```js
var math = mathjs();

math.round(3.2);              // returns Number 3
math.round(3.8);              // returns Number 4
math.round(-4.2);             // returns Number -4
math.round(-4.7);             // returns Number -5
math.round(math.pi, 3);       // returns Number 3.14
math.round(123.45678, 2);     // returns Number 123.46

var c = math.complex(3.2, -2.7);
math.round(c);                // returns Complex 3 - 3i

math.round([3.2, 3.8, -4.7]); // returns Array [3, 4, -5]
```


## See also

[ceil](ceil.md),
[floor](floor.md),
[fix](fix.md)
