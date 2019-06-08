---
layout: default
---

<h1 id="core">Core <a href="#core" title="Permalink">#</a></h1>

<h2 id="usage">Usage <a href="#usage" title="Permalink">#</a></h2>

The core of math.js is the `math` namespace containing all functions and constants. There are three ways to do calculations in math.js:

- Doing regular function calls like `math.add(math.sqrt(4), 2)`.
- Evaluating expressions like `math.evaluate('sqrt(4) + 2')`
- Chaining operations like `math.chain(4).sqrt().add(2)`.

<h2 id="configuration">Configuration <a href="#configuration" title="Permalink">#</a></h2>

math.js can be configured using the `math.config()`, see page [Configuration](configuration.html).

<h2 id="extension">Extension <a href="#extension" title="Permalink">#</a></h2>

math.js can be extended with new functions and constants using the function `math.import()`, see page [Extension](extension.html).

<h2 id="serialization">Serialization <a href="#serialization" title="Permalink">#</a></h2>

To persist or exchange data structures like matrices and units, the data types of math.js can be stringified as JSON. This is explained on the page [Serialization](serialization.html).
