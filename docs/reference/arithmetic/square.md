# Function square

Calculate the square of a value, multiply a value with itself. The square of `x` is defined as `x * x`. For matrices, the function is evaluated element wise.


## Syntax

```js
math.square(x)
```

### Parameters

Parameter | Type | Description
--------- | ---- | -----------
`x`       | Number &#124; BigNumber &#124; Boolean &#124; Complex &#124; Array &#124; Matrix | Number for which to calculate the square

### Returns

Type | Description
---- | -----------
Number &#124; BigNumber &#124; Complex &#124; Array &#124; Matrix | x squared


## Examples

```js
var math = mathjs();

math.square(2);           // returns Number 4
math.square(3);           // returns Number 9
math.pow(3, 2);           // returns Number 9
math.multiply(3, 3);      // returns Number 9

math.square([1, 2, 3, 4]);  // returns Array [1, 4, 9, 16]
```


## See also

[cube](cube.md),
[multiply](multiply.md),
[sqrt](sqrt.md),
[pow](pow.md)
