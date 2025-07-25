---
layout: default
---

<a name="Unit"></a>
<h2 id="unit">Unit <a href="#unit" title="Permalink">#</a></h2>
* [new Unit([value], [name])](#new_Unit_new)
* _instance_
	* [.valueOf](#Unit+valueOf) ⇒ <code>string</code>
	* [.clone()](#Unit+clone) ⇒ <code>Unit</code>
	* [._isDerived()](#Unit+_isDerived) ⇒ <code>boolean</code>
	* [.hasBase(base)](#Unit+hasBase)
	* [.equalBase(other)](#Unit+equalBase) ⇒ <code>boolean</code>
	* [.equals(other)](#Unit+equals) ⇒ <code>boolean</code>
	* [.multiply(other)](#Unit+multiply) ⇒ <code>Unit</code>
	* [.divide(other)](#Unit+divide) ⇒ <code>Unit</code>
	* [.pow(p)](#Unit+pow) ⇒ <code>Unit</code>
	* [.abs(x)](#Unit+abs) ⇒ <code>Unit</code>
	* [.to(valuelessUnit)](#Unit+to) ⇒ <code>Unit</code>
	* [.toNumber(valuelessUnit)](#Unit+toNumber) ⇒ <code>number</code>
	* [.toNumeric(valuelessUnit)](#Unit+toNumeric) ⇒ <code>number</code> &#124; <code>BigNumber</code> &#124; <code>Fraction</code>
	* [.toString()](#Unit+toString) ⇒ <code>string</code>
	* [.toJSON()](#Unit+toJSON) ⇒ <code>Object</code>
	* [.formatUnits()](#Unit+formatUnits) ⇒ <code>string</code>
	* [.format([options])](#Unit+format) ⇒ <code>string</code>
	* [.toBest(unitList, options)](#Unit+toBest) ⇒ <code>Unit</code>
* _static_
	* [.parse(str)](#Unit.parse) ⇒ <code>Unit</code>
	* [.isValuelessUnit(name)](#Unit.isValuelessUnit) ⇒ <code>boolean</code>
	* [.fromJSON(json)](#Unit.fromJSON) ⇒ <code>Unit</code>

<a name="new_Unit_new"></a>
<h3 id="new-unitvalue-name">new Unit([value], [name]) <a href="#new-unitvalue-name" title="Permalink">#</a></h3>
A unit can be constructed in the following ways:

```js
const a = new Unit(value, name)
const b = new Unit(null, name)
const c = Unit.parse(str)
```

Example usage:

```js
const a = new Unit(5, 'cm')               // 50 mm
const b = Unit.parse('23 kg')             // 23 kg
const c = math.in(a, new Unit(null, 'm')  // 0.05 m
const d = new Unit(9.81, "m/s^2")         // 9.81 m/s^2
```

| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>number</code> &#124; <code>BigNumber</code> &#124; <code>Fraction</code> &#124; <code>Complex</code> &#124; <code>boolean</code> | A value like 5.2 |
| [name] | <code>string</code> | A unit name like "cm" or "inch", or a derived unit of the form: "u1[^ex1] [u2[^ex2] ...] [/ u3[^ex3] [u4[^ex4]]]", such as "kg m^2/s^2", where each unit appearing after the forward slash is taken to be in the denominator. "kg m^2 s^-2" is a synonym and is also acceptable. Any of the units can include a prefix. |

<a name="Unit+valueOf"></a>
<h3 id="unitvalueof--codestringcode">unit.valueOf ⇒ <code>string</code> <a href="#unitvalueof--codestringcode" title="Permalink">#</a></h3>
Returns the string representation of the unit.

**Kind**: instance property of <code>Unit</code>  
<a name="Unit+clone"></a>
<h3 id="unitclone--codeunitcode">unit.clone() ⇒ <code>Unit</code> <a href="#unitclone--codeunitcode" title="Permalink">#</a></h3>
create a copy of this unit

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>Unit</code> - Returns a cloned version of the unit  
<a name="Unit+_isDerived"></a>
<h3 id="unit_isderived--codebooleancode">unit._isDerived() ⇒ <code>boolean</code> <a href="#unit_isderived--codebooleancode" title="Permalink">#</a></h3>
Return whether the unit is derived (such as m/s, or cm^2, but not N)

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>boolean</code> - True if the unit is derived  
<a name="Unit+hasBase"></a>
<h3 id="unithasbasebase">unit.hasBase(base) <a href="#unithasbasebase" title="Permalink">#</a></h3>
check if this unit has given base unit
If this unit is a derived unit, this will ALWAYS return false, since by definition base units are not derived.

**Kind**: instance method of <code>Unit</code>  

| Param | Type |
| --- | --- |
| base | <code>BASE_UNITS</code> &#124; <code>STRING</code> &#124; <code>undefined</code> | 

<a name="Unit+equalBase"></a>
<h3 id="unitequalbaseother--codebooleancode">unit.equalBase(other) ⇒ <code>boolean</code> <a href="#unitequalbaseother--codebooleancode" title="Permalink">#</a></h3>
Check if this unit has a base or bases equal to another base or bases
For derived units, the exponent on each base also must match

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>boolean</code> - true if equal base  

| Param | Type |
| --- | --- |
| other | <code>Unit</code> | 

<a name="Unit+equals"></a>
<h3 id="unitequalsother--codebooleancode">unit.equals(other) ⇒ <code>boolean</code> <a href="#unitequalsother--codebooleancode" title="Permalink">#</a></h3>
Check if this unit equals another unit

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>boolean</code> - true if both units are equal  

| Param | Type |
| --- | --- |
| other | <code>Unit</code> | 

<a name="Unit+multiply"></a>
<h3 id="unitmultiplyother--codeunitcode">unit.multiply(other) ⇒ <code>Unit</code> <a href="#unitmultiplyother--codeunitcode" title="Permalink">#</a></h3>
Multiply this unit with another one

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>Unit</code> - product of this unit and the other unit  

| Param | Type |
| --- | --- |
| other | <code>Unit</code> | 

<a name="Unit+divide"></a>
<h3 id="unitdivideother--codeunitcode">unit.divide(other) ⇒ <code>Unit</code> <a href="#unitdivideother--codeunitcode" title="Permalink">#</a></h3>
Divide this unit by another one

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>Unit</code> - result of dividing this unit by the other unit  

| Param | Type |
| --- | --- |
| other | <code>Unit</code> | 

<a name="Unit+pow"></a>
<h3 id="unitpowp--codeunitcode">unit.pow(p) ⇒ <code>Unit</code> <a href="#unitpowp--codeunitcode" title="Permalink">#</a></h3>
Calculate the power of a unit

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>Unit</code> - The result: this^p  

| Param | Type |
| --- | --- |
| p | <code>number</code> &#124; <code>Fraction</code> &#124; <code>BigNumber</code> | 

<a name="Unit+abs"></a>
<h3 id="unitabsx--codeunitcode">unit.abs(x) ⇒ <code>Unit</code> <a href="#unitabsx--codeunitcode" title="Permalink">#</a></h3>
Calculate the absolute value of a unit

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>Unit</code> - The result: |x|, absolute value of x  

| Param | Type |
| --- | --- |
| x | <code>number</code> &#124; <code>Fraction</code> &#124; <code>BigNumber</code> | 

<a name="Unit+to"></a>
<h3 id="unittovaluelessunit--codeunitcode">unit.to(valuelessUnit) ⇒ <code>Unit</code> <a href="#unittovaluelessunit--codeunitcode" title="Permalink">#</a></h3>
Convert the unit to a specific unit name.

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>Unit</code> - Returns a clone of the unit with a fixed prefix and unit.  

| Param | Type | Description |
| --- | --- | --- |
| valuelessUnit | <code>string</code> &#124; <code>Unit</code> | A unit without value. Can have prefix, like "cm" |

<a name="Unit+toNumber"></a>
<h3 id="unittonumbervaluelessunit--codenumbercode">unit.toNumber(valuelessUnit) ⇒ <code>number</code> <a href="#unittonumbervaluelessunit--codenumbercode" title="Permalink">#</a></h3>
Return the value of the unit when represented with given valueless unit

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>number</code> - Returns the unit value as number.  

| Param | Type | Description |
| --- | --- | --- |
| valuelessUnit | <code>string</code> &#124; <code>Unit</code> | For example 'cm' or 'inch' |

<a name="Unit+toNumeric"></a>
<h3 id="unittonumericvaluelessunit--codenumbercode-124-codebignumbercode-124-codefractioncode">unit.toNumeric(valuelessUnit) ⇒ <code>number</code> &#124; <code>BigNumber</code> &#124; <code>Fraction</code> <a href="#unittonumericvaluelessunit--codenumbercode-124-codebignumbercode-124-codefractioncode" title="Permalink">#</a></h3>
Return the value of the unit in the original numeric type

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>number</code> &#124; <code>BigNumber</code> &#124; <code>Fraction</code> - Returns the unit value  

| Param | Type | Description |
| --- | --- | --- |
| valuelessUnit | <code>string</code> &#124; <code>Unit</code> | For example 'cm' or 'inch' |

<a name="Unit+toString"></a>
<h3 id="unittostring--codestringcode">unit.toString() ⇒ <code>string</code> <a href="#unittostring--codestringcode" title="Permalink">#</a></h3>
Get a string representation of the unit.

**Kind**: instance method of <code>Unit</code>  
<a name="Unit+toJSON"></a>
<h3 id="unittojson--codeobjectcode">unit.toJSON() ⇒ <code>Object</code> <a href="#unittojson--codeobjectcode" title="Permalink">#</a></h3>
Get a JSON representation of the unit

**Kind**: instance method of <code>Unit</code>  
**Returns**: <code>Object</code> - Returns a JSON object structured as:
                  `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixPrefix": false}`  
<a name="Unit+formatUnits"></a>
<h3 id="unitformatunits--codestringcode">unit.formatUnits() ⇒ <code>string</code> <a href="#unitformatunits--codestringcode" title="Permalink">#</a></h3>
Get a string representation of the units of this Unit, without the value.

**Kind**: instance method of <code>Unit</code>  
<a name="Unit+format"></a>
<h3 id="unitformatoptions--codestringcode">unit.format([options]) ⇒ <code>string</code> <a href="#unitformatoptions--codestringcode" title="Permalink">#</a></h3>
Get a string representation of the Unit, with optional formatting options.

**Kind**: instance method of <code>Unit</code>  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> &#124; <code>number</code> &#124; <code>function</code> | Formatting options. See                                                lib/utils/number:format for a                                                description of the available                                                options. |

<a name="Unit+toBest"></a>
<h3 id="unittobestunitlist-options--codeunitcode">unit.toBest(unitList, options) ⇒ <code>Unit</code> <a href="#unittobestunitlist-options--codeunitcode" title="Permalink">#</a></h3>
Converts a unit to the most appropriate display unit with optional unitList and options.

**Kind**: instance method of <code>Unit</code>
**Returns**: <code>Unit</code>  

| Param | Type | Description |
| --- | --- | --- |
| unitList | <code>Array of strings</code> &#124; | Units strings array (optional).
| options | <code>Object</code> &#124; | Only "offset" available right now - better prefix calculation

<a name="Unit.parse"></a>
<h3 id="unitparsestr--codeunitcode">Unit.parse(str) ⇒ <code>Unit</code> <a href="#unitparsestr--codeunitcode" title="Permalink">#</a></h3>
Parse a string into a unit. The value of the unit is parsed as number,
BigNumber, or Fraction depending on the math.js config setting `number`.

Throws an exception if the provided string does not contain a valid unit or
cannot be parsed.

**Kind**: static method of <code>Unit</code>  
**Returns**: <code>Unit</code> - unit  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | A string like "5.2 inch", "4e2 cm/s^2" |

<a name="Unit.isValuelessUnit"></a>
<h3 id="unitisvaluelessunitname--codebooleancode">Unit.isValuelessUnit(name) ⇒ <code>boolean</code> <a href="#unitisvaluelessunitname--codebooleancode" title="Permalink">#</a></h3>
Test if the given expression is a unit.
The unit can have a prefix but cannot have a value.

**Kind**: static method of <code>Unit</code>  
**Returns**: <code>boolean</code> - true if the given string is a unit  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | A string to be tested whether it is a value less unit.                        The unit can have prefix, like "cm" |

<a name="Unit.fromJSON"></a>
<h3 id="unitfromjsonjson--codeunitcode">Unit.fromJSON(json) ⇒ <code>Unit</code> <a href="#unitfromjsonjson--codeunitcode" title="Permalink">#</a></h3>
Instantiate a Unit from a JSON object

**Kind**: static method of <code>Unit</code>  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>Object</code> | A JSON object structured as:                       `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixPrefix": false}` |

