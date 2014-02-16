# Function cube

Compute the cube of a value. The cube of `x` is `x * x * x`. For matrices, the function is evaluated element wise.


## Syntax

```js
math.cube(x)
```

### Parameters

Parameter | Type | Description
--------- | ---- | -----------
`x`       | Number &#124; BigNumber &#124; Boolean &#124; Complex &#124; Array &#124; Matrix | Number for which to calculate the cube

### Returns

Type | Description
---- | -----------
Number &#124; BigNumber &#124; Complex &#124; Array &#124; Matrix | Cube of x


## Examples

```js
var math = mathjs();

math.cube(2);                           // returns Number 8
math.pow(2, 3);                         // returns Number 8
math.multiply(math.multiply(2, 2), 2);  // returns Number 8

math.cube([1, 2, 3, 4]);                // returns Array [1, 8, 27, 64]
```


## See also

[multiply](multiply.md),
[square](square.md),
[pow](pow.md)
