---
layout: default
---

<a name="ResultSet"></a>
<h2 id="resultset">ResultSet <a href="#resultset" title="Permalink">#</a></h2>
* [new ResultSet(entries)](#new_ResultSet_new)
* _instance_
	* [.valueOf()](#ResultSet+valueOf) ⇒ <code>Array</code>
	* [.toString()](#ResultSet+toString) ⇒ <code>string</code>
	* [.toJSON()](#ResultSet+toJSON) ⇒ <code>Object</code>
* _static_
	* [.fromJSON(json)](#ResultSet.fromJSON) ⇒ <code>[ResultSet](#ResultSet)</code>

<a name="new_ResultSet_new"></a>
<h3 id="new-resultsetentries">new ResultSet(entries) <a href="#new-resultsetentries" title="Permalink">#</a></h3>
A ResultSet contains a list or results


| Param | Type |
| --- | --- |
| entries | <code>Array</code> | 

<a name="ResultSet+valueOf"></a>
<h3 id="resultsetvalueof--codearraycode">resultSet.valueOf() ⇒ <code>Array</code> <a href="#resultsetvalueof--codearraycode" title="Permalink">#</a></h3>
Returns the array with results hold by this ResultSet

**Kind**: instance method of <code>[ResultSet](#ResultSet)</code>  
**Returns**: <code>Array</code> - entries  
<a name="ResultSet+toString"></a>
<h3 id="resultsettostring--codestringcode">resultSet.toString() ⇒ <code>string</code> <a href="#resultsettostring--codestringcode" title="Permalink">#</a></h3>
Returns the stringified results of the ResultSet

**Kind**: instance method of <code>[ResultSet](#ResultSet)</code>  
**Returns**: <code>string</code> - string  
<a name="ResultSet+toJSON"></a>
<h3 id="resultsettojson--codeobjectcode">resultSet.toJSON() ⇒ <code>Object</code> <a href="#resultsettojson--codeobjectcode" title="Permalink">#</a></h3>
Get a JSON representation of the ResultSet

**Kind**: instance method of <code>[ResultSet](#ResultSet)</code>  
**Returns**: <code>Object</code> - Returns a JSON object structured as:                  `{"mathjs": "ResultSet", "entries": [...]}`  
<a name="ResultSet.fromJSON"></a>
<h3 id="resultsetfromjsonjson--coderesultsetresultsetcode">ResultSet.fromJSON(json) ⇒ <code>[ResultSet](#ResultSet)</code> <a href="#resultsetfromjsonjson--coderesultsetresultsetcode" title="Permalink">#</a></h3>
Instantiate a ResultSet from a JSON object

**Kind**: static method of <code>[ResultSet](#ResultSet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>Object</code> | A JSON object structured as:                       `{"mathjs": "ResultSet", "entries": [...]}` |

