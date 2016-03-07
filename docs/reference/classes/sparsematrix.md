---
layout: default
---

<a name="SparseMatrix"></a>
<h2 id="sparsematrix">SparseMatrix <a href="#sparsematrix" title="Permalink">#</a></h2>
Sparse Matrix implementation. This type implements a Compressed Column Storage format
for sparse matrices.

* _instance_
	* [.storage()](#SparseMatrix+storage) ⇒ <code>string</code>
	* [.datatype()](#SparseMatrix+datatype) ⇒ <code>string</code>
	* [.create(data, [datatype])](#SparseMatrix+create)
	* [.density()](#SparseMatrix+density) ⇒ <code>number</code>
	* [.subset(index, [replacement], [defaultValue])](#SparseMatrix+subset)
	* [.get(index)](#SparseMatrix+get) ⇒ <code>\*</code>
	* [.set(index, value, [defaultValue])](#SparseMatrix+set) ⇒ <code>[SparseMatrix](#SparseMatrix)</code>
	* [.resize(size, [defaultValue], [copy])](#SparseMatrix+resize) ⇒ <code>Matrix</code>
	* [.clone()](#SparseMatrix+clone) ⇒ <code>[SparseMatrix](#SparseMatrix)</code>
	* [.size()](#SparseMatrix+size) ⇒ <code>Array.&lt;number&gt;</code>
	* [.map(callback, [skipZeros])](#SparseMatrix+map) ⇒ <code>[SparseMatrix](#SparseMatrix)</code>
	* [.forEach(callback, [skipZeros])](#SparseMatrix+forEach)
	* [.toArray()](#SparseMatrix+toArray) ⇒ <code>Array</code>
	* [.valueOf()](#SparseMatrix+valueOf) ⇒ <code>Array</code>
	* [.format([options])](#SparseMatrix+format) ⇒ <code>string</code>
	* [.toString()](#SparseMatrix+toString) ⇒ <code>string</code>
	* [.toJSON()](#SparseMatrix+toJSON) ⇒ <code>Object</code>
	* [.diagonal([k])](#SparseMatrix+diagonal) ⇒ <code>Matrix</code>
	* [.swapRows(i, j)](#SparseMatrix+swapRows) ⇒ <code>Matrix</code>
* _static_
	* [.fromJSON(json)](#SparseMatrix.fromJSON) ⇒ <code>[SparseMatrix](#SparseMatrix)</code>
	* [.diagonal(size, value, [k], [datatype])](#SparseMatrix.diagonal) ⇒ <code>[SparseMatrix](#SparseMatrix)</code>

<a name="SparseMatrix+storage"></a>
<h3 id="sparsematrixstorage--codestringcode">sparseMatrix.storage() ⇒ <code>string</code> <a href="#sparsematrixstorage--codestringcode" title="Permalink">#</a></h3>
Get the storage format used by the matrix.Usage:    var format = matrix.storage()                   // retrieve storage format

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>string</code> - The storage format.  
<a name="SparseMatrix+datatype"></a>
<h3 id="sparsematrixdatatype--codestringcode">sparseMatrix.datatype() ⇒ <code>string</code> <a href="#sparsematrixdatatype--codestringcode" title="Permalink">#</a></h3>
Get the datatype of the data stored in the matrix.Usage:    var format = matrix.datatype()                   // retrieve matrix datatype

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>string</code> - The datatype.  
<a name="SparseMatrix+create"></a>
<h3 id="sparsematrixcreatedata-datatype">sparseMatrix.create(data, [datatype]) <a href="#sparsematrixcreatedata-datatype" title="Permalink">#</a></h3>
Create a new SparseMatrix

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  

| Param | Type |
| --- | --- |
| data | <code>Array</code> | 
| [datatype] | <code>string</code> | 

<a name="SparseMatrix+density"></a>
<h3 id="sparsematrixdensity--codenumbercode">sparseMatrix.density() ⇒ <code>number</code> <a href="#sparsematrixdensity--codenumbercode" title="Permalink">#</a></h3>
Get the matrix density.Usage:    var density = matrix.density()                   // retrieve matrix density

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>number</code> - The matrix density.  
<a name="SparseMatrix+subset"></a>
<h3 id="sparsematrixsubsetindex-replacement-defaultvalue">sparseMatrix.subset(index, [replacement], [defaultValue]) <a href="#sparsematrixsubsetindex-replacement-defaultvalue" title="Permalink">#</a></h3>
Get a subset of the matrix, or replace a subset of the matrix.Usage:    var subset = matrix.subset(index)               // retrieve subset    var value = matrix.subset(index, replacement)   // replace subset

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| index | <code>Index</code> |  |  |
| [replacement] | <code>Array</code> &#124; <code>Maytrix</code> &#124; <code>\*</code> |  |  |
| [defaultValue] | <code>\*</code> | <code>0</code> | Default value, filled in on new entries when                                  the matrix is resized. If not provided,                                  new matrix elements will be filled with zeros. |

<a name="SparseMatrix+get"></a>
<h3 id="sparsematrixgetindex--codecode">sparseMatrix.get(index) ⇒ <code>\*</code> <a href="#sparsematrixgetindex--codecode" title="Permalink">#</a></h3>
Get a single element from the matrix.

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>\*</code> - value  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Array.&lt;number&gt;</code> | Zero-based index |

<a name="SparseMatrix+set"></a>
<h3 id="sparsematrixsetindex-value-defaultvalue--codesparsematrixsparsematrixcode">sparseMatrix.set(index, value, [defaultValue]) ⇒ <code>[SparseMatrix](#SparseMatrix)</code> <a href="#sparsematrixsetindex-value-defaultvalue--codesparsematrixsparsematrixcode" title="Permalink">#</a></h3>
Replace a single element in the matrix.

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>[SparseMatrix](#SparseMatrix)</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Array.&lt;number&gt;</code> | Zero-based index |
| value | <code>\*</code> |  |
| [defaultValue] | <code>\*</code> | Default value, filled in on new entries when                                  the matrix is resized. If not provided,                                  new matrix elements will be set to zero. |

<a name="SparseMatrix+resize"></a>
<h3 id="sparsematrixresizesize-defaultvalue-copy--codematrixcode">sparseMatrix.resize(size, [defaultValue], [copy]) ⇒ <code>Matrix</code> <a href="#sparsematrixresizesize-defaultvalue-copy--codematrixcode" title="Permalink">#</a></h3>
Resize the matrix to the given size. Returns a copy of the matrix when `copy=true`, otherwise return the matrix itself (resize in place).

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>Matrix</code> - The resized matrix  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| size | <code>Array.&lt;number&gt;</code> |  | The new size the matrix should have. |
| [defaultValue] | <code>\*</code> | <code>0</code> | Default value, filled in on new entries.                                  If not provided, the matrix elements will                                  be filled with zeros. |
| [copy] | <code>boolean</code> |  | Return a resized copy of the matrix |

<a name="SparseMatrix+clone"></a>
<h3 id="sparsematrixclone--codesparsematrixsparsematrixcode">sparseMatrix.clone() ⇒ <code>[SparseMatrix](#SparseMatrix)</code> <a href="#sparsematrixclone--codesparsematrixsparsematrixcode" title="Permalink">#</a></h3>
Create a clone of the matrix

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>[SparseMatrix](#SparseMatrix)</code> - clone  
<a name="SparseMatrix+size"></a>
<h3 id="sparsematrixsize--codearrayltnumbergtcode">sparseMatrix.size() ⇒ <code>Array.&lt;number&gt;</code> <a href="#sparsematrixsize--codearrayltnumbergtcode" title="Permalink">#</a></h3>
Retrieve the size of the matrix.

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>Array.&lt;number&gt;</code> - size  
<a name="SparseMatrix+map"></a>
<h3 id="sparsematrixmapcallback-skipzeros--codesparsematrixsparsematrixcode">sparseMatrix.map(callback, [skipZeros]) ⇒ <code>[SparseMatrix](#SparseMatrix)</code> <a href="#sparsematrixmapcallback-skipzeros--codesparsematrixsparsematrixcode" title="Permalink">#</a></h3>
Create a new matrix with the results of the callback function executed oneach entry of the matrix.

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>[SparseMatrix](#SparseMatrix)</code> - matrix  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback function is invoked with three                              parameters: the value of the element, the index                              of the element, and the Matrix being traversed. |
| [skipZeros] | <code>boolean</code> | Invoke callback function for non-zero values only. |

<a name="SparseMatrix+forEach"></a>
<h3 id="sparsematrixforeachcallback-skipzeros">sparseMatrix.forEach(callback, [skipZeros]) <a href="#sparsematrixforeachcallback-skipzeros" title="Permalink">#</a></h3>
Execute a callback function on each entry of the matrix.

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback function is invoked with three                              parameters: the value of the element, the index                              of the element, and the Matrix being traversed. |
| [skipZeros] | <code>boolean</code> | Invoke callback function for non-zero values only. |

<a name="SparseMatrix+toArray"></a>
<h3 id="sparsematrixtoarray--codearraycode">sparseMatrix.toArray() ⇒ <code>Array</code> <a href="#sparsematrixtoarray--codearraycode" title="Permalink">#</a></h3>
Create an Array with a copy of the data of the SparseMatrix

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>Array</code> - array  
<a name="SparseMatrix+valueOf"></a>
<h3 id="sparsematrixvalueof--codearraycode">sparseMatrix.valueOf() ⇒ <code>Array</code> <a href="#sparsematrixvalueof--codearraycode" title="Permalink">#</a></h3>
Get the primitive value of the SparseMatrix: a two dimensions array

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>Array</code> - array  
<a name="SparseMatrix+format"></a>
<h3 id="sparsematrixformatoptions--codestringcode">sparseMatrix.format([options]) ⇒ <code>string</code> <a href="#sparsematrixformatoptions--codestringcode" title="Permalink">#</a></h3>
Get a string representation of the matrix, with optional formatting options.

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>string</code> - str  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> &#124; <code>number</code> &#124; <code>function</code> | Formatting options. See                                                lib/utils/number:format for a                                                description of the available                                                options. |

<a name="SparseMatrix+toString"></a>
<h3 id="sparsematrixtostring--codestringcode">sparseMatrix.toString() ⇒ <code>string</code> <a href="#sparsematrixtostring--codestringcode" title="Permalink">#</a></h3>
Get a string representation of the matrix

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>string</code> - str  
<a name="SparseMatrix+toJSON"></a>
<h3 id="sparsematrixtojson--codeobjectcode">sparseMatrix.toJSON() ⇒ <code>Object</code> <a href="#sparsematrixtojson--codeobjectcode" title="Permalink">#</a></h3>
Get a JSON representation of the matrix

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
<a name="SparseMatrix+diagonal"></a>
<h3 id="sparsematrixdiagonalk--codematrixcode">sparseMatrix.diagonal([k]) ⇒ <code>Matrix</code> <a href="#sparsematrixdiagonalk--codematrixcode" title="Permalink">#</a></h3>
Get the kth Matrix diagonal.

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>Matrix</code> - The matrix vector with the diagonal values.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [k] | <code>number</code> &#124; <code>BigNumber</code> | <code>0</code> | The kth diagonal where the vector will retrieved. |

<a name="SparseMatrix+swapRows"></a>
<h3 id="sparsematrixswaprowsi-j--codematrixcode">sparseMatrix.swapRows(i, j) ⇒ <code>Matrix</code> <a href="#sparsematrixswaprowsi-j--codematrixcode" title="Permalink">#</a></h3>
Swap rows i and j in Matrix.

**Kind**: instance method of <code>[SparseMatrix](#SparseMatrix)</code>  
**Returns**: <code>Matrix</code> - The matrix reference  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | Matrix row index 1 |
| j | <code>number</code> | Matrix row index 2 |

<a name="SparseMatrix.fromJSON"></a>
<h3 id="sparsematrixfromjsonjson--codesparsematrixsparsematrixcode">SparseMatrix.fromJSON(json) ⇒ <code>[SparseMatrix](#SparseMatrix)</code> <a href="#sparsematrixfromjsonjson--codesparsematrixsparsematrixcode" title="Permalink">#</a></h3>
Generate a matrix from a JSON object

**Kind**: static method of <code>[SparseMatrix](#SparseMatrix)</code>  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>Object</code> | An object structured like                       `{"mathjs": "SparseMatrix", "values": [], "index": [], "ptr": [], "size": []}`,                       where mathjs is optional |

<a name="SparseMatrix.diagonal"></a>
<h3 id="sparsematrixdiagonalsize-value-k-datatype--codesparsematrixsparsematrixcode">SparseMatrix.diagonal(size, value, [k], [datatype]) ⇒ <code>[SparseMatrix](#SparseMatrix)</code> <a href="#sparsematrixdiagonalsize-value-k-datatype--codesparsematrixsparsematrixcode" title="Permalink">#</a></h3>
Create a diagonal matrix.

**Kind**: static method of <code>[SparseMatrix](#SparseMatrix)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| size | <code>Array</code> |  | The matrix size. |
| value | <code>number</code> &#124; <code>Array</code> &#124; <code>Matrix</code> |  | The values for the diagonal. |
| [k] | <code>number</code> &#124; <code>BigNumber</code> | <code>0</code> | The kth diagonal where the vector will be filled in. |
| [datatype] | <code>string</code> |  | The Matrix datatype, values must be of this datatype. |

