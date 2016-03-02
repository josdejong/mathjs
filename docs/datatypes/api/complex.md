<a name="Complex"></a>
## Complex
* [new Complex(re, [im])](#new_Complex_new)
* _instance_
	* [.valueOf](#Complex+valueOf) ⇒ <code>string</code>
	* [.clone()](#Complex+clone) ⇒ <code>[Complex](#Complex)</code>
	* [.equals(other)](#Complex+equals) ⇒ <code>boolean</code>
	* [.format([options])](#Complex+format) ⇒ <code>string</code>
	* [.toString()](#Complex+toString) ⇒ <code>string</code>
	* [.toJSON()](#Complex+toJSON) ⇒ <code>Object</code>
* _static_
	* [.parse(str)](#Complex.parse) ⇒ <code>[Complex](#Complex)</code>
	* [.fromPolar()](#Complex.fromPolar) ⇒ <code>[Complex](#Complex)</code>
	* [.fromJSON(json)](#Complex.fromJSON) ⇒ <code>[Complex](#Complex)</code>

<a name="new_Complex_new"></a>
### new Complex(re, [im])
A complex value can be constructed in the following ways:    var a = new Complex();    var b = new Complex(re, im);    var c = Complex.parse(str);Example usage:    var a = new Complex(3, -4);      // 3 - 4i    a.re = 5;                        // a = 5 - 4i    var i = a.im;                    // -4;    var b = Complex.parse('2 + 6i'); // 2 + 6i    var c = new Complex();           // 0 + 0i    var d = math.add(a, b);          // 5 + 2i


| Param | Type | Description |
| --- | --- | --- |
| re | <code>number</code> | The real part of the complex value |
| [im] | <code>number</code> | The imaginary part of the complex value |

<a name="Complex+valueOf"></a>
### complex.valueOf ⇒ <code>string</code>
Returns a string representation of the complex number.

**Kind**: instance property of <code>[Complex](#Complex)</code>  
**Returns**: <code>string</code> - str  
<a name="Complex+clone"></a>
### complex.clone() ⇒ <code>[Complex](#Complex)</code>
Create a copy of the complex value

**Kind**: instance method of <code>[Complex](#Complex)</code>  
**Returns**: <code>[Complex](#Complex)</code> - clone  
<a name="Complex+equals"></a>
### complex.equals(other) ⇒ <code>boolean</code>
Test whether this complex number equals an other complex value.Two complex numbers are equal when both their real and imaginary partsare equal.

**Kind**: instance method of <code>[Complex](#Complex)</code>  
**Returns**: <code>boolean</code> - isEqual  

| Param | Type |
| --- | --- |
| other | <code>[Complex](#Complex)</code> | 

<a name="Complex+format"></a>
### complex.format([options]) ⇒ <code>string</code>
Get a string representation of the complex number,with optional formatting options.

**Kind**: instance method of <code>[Complex](#Complex)</code>  
**Returns**: <code>string</code> - str  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> &#124; <code>number</code> &#124; <code>function</code> | Formatting options. See                                                lib/utils/number:format for a                                                description of the available                                                options. |

<a name="Complex+toString"></a>
### complex.toString() ⇒ <code>string</code>
Get a string representation of the complex number.

**Kind**: instance method of <code>[Complex](#Complex)</code>  
**Returns**: <code>string</code> - str  
<a name="Complex+toJSON"></a>
### complex.toJSON() ⇒ <code>Object</code>
Get a JSON representation of the complex number

**Kind**: instance method of <code>[Complex](#Complex)</code>  
**Returns**: <code>Object</code> - Returns a JSON object structured as:                  `{"mathjs": "Complex", "re": 2, "im": 3}`  
<a name="Complex.parse"></a>
### Complex.parse(str) ⇒ <code>[Complex](#Complex)</code>
Parse a complex number from a string. For example Complex.parse("2 + 3i")will return a Complex value where re = 2, im = 3.Throws an Error if provided string does not contain a valid complex number.

**Kind**: static method of <code>[Complex](#Complex)</code>  
**Returns**: <code>[Complex](#Complex)</code> - complex  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="Complex.fromPolar"></a>
### Complex.fromPolar() ⇒ <code>[Complex](#Complex)</code>
Create a complex number from polar coordinatesUsage:    Complex.fromPolar(r: number, phi: number) : Complex    Complex.fromPolar({r: number, phi: number}) : Complex

**Kind**: static method of <code>[Complex](#Complex)</code>  

| Param | Type |
| --- | --- |
| args... | <code>\*</code> | 

<a name="Complex.fromJSON"></a>
### Complex.fromJSON(json) ⇒ <code>[Complex](#Complex)</code>
Create a Complex number from a JSON object

**Kind**: static method of <code>[Complex](#Complex)</code>  
**Returns**: <code>[Complex](#Complex)</code> - Returns a new Complex number  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>Object</code> | A JSON Object structured as                       {"mathjs": "Complex", "re": 2, "im": 3}                       All properties are optional, default values                       for `re` and `im` are 0. |

