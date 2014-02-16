# Function add

Add two values, `x + y`. Matrices are evaluated element wise.


## Syntax

```js
math.add(x, y)
```

### Parameters

Parameter | Type | Description
--------- | ---- | -----------
`x`       | Number &#124; BigNumber &#124; Boolean &#124; Complex &#124; Unit &#124; String &#124; Array &#124; Matrix | Value to add `y` to
`y`       | Number &#124; BigNumber &#124; Boolean &#124; Complex &#124; Unit &#124; String &#124; Array &#124; Matrix | Value to be added to `x`

### Returns

Type | Description
---- | -----------
Number &#124; BigNumber &#124; Complex &#124; Unit &#124; String &#124; Array &#124; Matrix | Sum of `x` and `y`, `x + y`


## Examples

```js
math.add(2, 3);               // returns Number 5

var a = math.complex(2, 3);
var b = math.complex(-4, 1);
math.add(a, b);               // returns Complex -2 + 4i

math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]

var c = math.unit('5 cm');
var d = math.unit('2.1 mm');
math.add(c, d);               // returns Unit 52.1 mm
```


## See also

[subtract](subtract.md)
