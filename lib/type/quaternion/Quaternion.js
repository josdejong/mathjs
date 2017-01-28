'use strict';
var Complex = require('complex.js');

function factory (type, config, load, typed, math) {

	var Q = {
		r: 0,
		i: 0,
		j: 0,
		k: 0
	};

        //Constants
  Quaternion.prototype.CONST = {
    R: {r:1},
    I: {i:1},
    J: {j:1},
    K: {k:1},
    ZERO: {r:0, i:0, j:0, k:0},
    PI: {r: Math.PI},
    E: {r: Math.E}
  };


  /*
  * @constructor
  * @returnes Quaternion
  */
	function Quaternion(a,b,c,d) {

    /*
     * Quaternion multiplcation is not comutative NOTE: A*B !== B*A
     *
     * Quaternion addition is comutative A + B === B + A
     *
     * non comutative methods are anotated with @nonComut anotation
     */

		if(!(this instanceof Quaternion )){
			return new Quaternion(a,b,c,d);
		}

		parseQuaternion(a,b,c,d);

    this.r = Q.r;
    this.i = Q.i;
    this.j = Q.j;
    this.k = Q.k;

    // check for pure and scalor Quaternions
    if(Q.r === 0 ){
      this.isPure = true;
    } else {
      this.isPure = false;
    }

    if(Q.i === 0 && Q.j === 0 && Q.k === 0){
      this.isScalar = true;
    } else {
      this.isScalar = false;
    }
    // 0 + 0i + 0j + 0k is the only number that is scalar and pure
    // this is the eqasiest way to check for a zero quaternion

    if (this.j === 0 && this.k === 0) {
      this.canConverToComlex = true;
    } else {
      this.canConverToComlex = false;
    }
	}

	function makeQuartError() {
    throw SyntaxError('Invalid Param');
  };

	function parseQuaternion(a,b,c,d){
		Q = {
      r: 0,
      i: 0,
      j: 0,
      k: 0
    };

    if (a instanceof Quaternion) {
      Q = a;
    } else if (
      typeof a === 'number' || typeof b === 'number' ||
      typeof c === 'number' || typeof d === 'number'
    ) {
      Q.r = parseFloat(a) || 0;
      Q.i = parseFloat(b) || 0;
      Q.j = parseFloat(c) || 0;
      Q.k = parseFloat(d) || 0;
		} else if (
        typeof a === 'undefined' && typeof b === 'undefined' &&
        typeof c === 'undefined' && typeof d === 'undefined'
    ) {
      Q.r = 0;
      Q.i = 0;
      Q.j = 0;
      Q.k = 0;
    } else if (
      typeof a === 'object' && a !== null &&
      (typeof a.r === 'number' || typeof a.i === 'number' ||
      typeof a.j === 'number' || typeof a.k === 'number')
      && typeof a.phi === 'undefined' //to prevent the r from modulus argument form complex number being used as a scaler Quaternion
    ) {
      Q.r = parseFloat(a.r) || 0;
      Q.i = parseFloat(a.i) || 0;
      Q.j = parseFloat(a.j) || 0;
      Q.k = parseFloat(a.k) || 0;
    } else if (typeof a === 'object' && a !== null && ('re' in a || 'im' in a)) { //check for complex numbers being passed in form z = x + yi
      Q.r = parseFloat(a.re) || 0;
      Q.i = parseFloat(a.im) || 0;
      Q.j = 0;
      Q.k = 0;
    } else if (typeof a === 'object' && a !== null && 'phi' in a && 'r' in a) {
      Q.r = Math.cos(a.phi) * a.r;
      Q.i = Math.sin(a.phi) * a.r;
      Q.j = 0;
      Q.k = 0;
    } else if (typeof a === 'string') {
      a = '+' + a ;
      a = a.replace(/\s+/g,"");
      a.toLowerCase();
      var identifyTerm = /[\+\-](?:(?:\d+)[ijk]|(?:\d+\.)[ijk]|(?:\d+\.\d+[ijk])|(?:\.\d+)[ijk]|[ijk]|(?:\d+\.\d+)|(?:\.\d+)|(?:\d+)|(?:\d\+\.))/gi
      //todo: find less horific Regex for this
      /* The reges will match any number of any of the folowing examples:
       *
       * ZX, ZX.X, Z.X, ZXY, ZX.XY, Z.XY, ZY
       *
       * where X represent a series of digits , Y represents one of i, j or k and Z represents a + or -
       * The regex uses a '+' or '-' to detect the start of a term.
       * This is why a '+' is appened to the start of the string if a '-' is not found.
      */
      var results = a.match(identifyTerm);
      var identifyInvalid = /[ijk][ijk]/;
      if (a.search(identifyInvalid) !== -1) {// checking for repeated
        makeQuartError();
      }
      if (results.length <1) {
        makeQuartError();
      }
      for (var i = 0; i<results.length; i++) {
        var last_char = results[i].charAt(results[i].length-1);
        var component = (last_char === 'i' || last_char === 'j' || last_char === 'k') // determing what component each term in
          ? last_char
          : 'r';
        var value = 0;
        if(component === 'r'){
          value = parseFloat(results[i]);
        } else if (results[i].length > 2){
          value = parseFloat(results[i].substring(0,results[i].length-1));
        } else if (results[i].length === 2 ) {
          value = parseFloat(results[i].charAt(0)+'1');
        } else {
          makeQuartError();
        }

        Q[component] += value;
      }
    } else if (// suport for quaternions in form (3 + 4i) + (1 - 2i)j (passed in as 2 complex numbers)
      typeof a === 'object' && 'im' in a && 're' in a &&
      typeof b === 'object' && 'im' in b && 're' in b
     ) {
      Q.r = a.re;
      Q.i = a.im;
      Q.j = b.re;
      Q.k = b.im;
    }else {
      makeQuartError();
    }
	}

  Quaternion.prototype.type = 'Quaternion';
  Quaternion.prototype.isQuaternion = true;

        // arithmetic functions

  /*
  * adds 2 Quaternion numbers together
  *
  * @returns {Quaternion}
  */
  Quaternion.prototype.add = function(q) {
    parseQuaternion(q);
    return new Quaternion(Q.r + this.r, Q.i + this.i, Q.j + this.j, Q.k + this.k);
  };

  /*
   * subtracs a Quaternion from this
   *
   * @returns {Quaternion}
   * @nonComut
   */
  Quaternion.prototype.subtract = function(q) {
    parseQuaternion(q);
    return new Quaternion(this.r -Q.r , this.i - Q.i, this.j - Q.j, this.k - Q.k);
  };

  /*
   * subtracts in the reverse order. Used for calculating 4 - (2 + 3k)
   * as .subtract cannot be called from the number 4
   *
   * @returns {Quaternion}
   * @nonComut
   */
  Quaternion.prototype.reverseOrderSubtract = function(q) {
    parseQuaternion(q);
    return (new Quaternion(Q)).subtract(this);
  };

  /*
   * multiplies 2 quaternions
   *
   * @returns {Quaternion}
   * @nonComut
   */
  Quaternion.prototype.mul = function(q) {
    parseQuaternion(q);
    return new Quaternion(
      (this.r * Q.r) - (this.i * Q.i) - (this.j * Q.j) - (this.k * Q.k),
      (this.r * Q.i) + (this.i * Q.r) + (this.j * Q.k) - (this.k * Q.j),
      (this.r * Q.j) + (this.j * Q.r) + (this.k * Q.i) - (this.i * Q.k),
      (this.r * Q.k) + (this.k * Q.r) + (this.i * Q.j) - (this.j * Q.i)
     );
  };

  /*
   * finds the multiplictive inverse of a Quaternion by
   * dividing the conjigate by the norm
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.reciprocal = function() {
    if(this.isPure && this.isScalar) {// easiest way to check for 0
      return new Quaternion();
    }
    var norm_squared = Math.pow(this.norm(),2);
    var conjugate = this.conjugate();
    return new Quaternion(
      conjugate.r/norm_squared, conjugate.i/norm_squared,
      conjugate.j/norm_squared, conjugate.k/norm_squared);
  };

  /*
   * finds the sign of each component of a Quaternion
   *
   * @returns {Quaternion}
   * each component will either be +1, -1 or 0
   */
  Quaternion.prototype.sign = function() {
    var r = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    if (this.r !== 0) {
      r = this.r / Math.abs(this.r);
    }
    if (this.i !== 0) {
      i = this.i / Math.abs(this.i);
    }
    if (this.j !== 0) {
      j = this.j / Math.abs(this.j);
    }
    if (this.k !== 0) {
      k = this.k / Math.abs(this.k);
    }
    return new Quaternion(r, i, j, k);
  };

  /*
   * returns the absolute value of each individual component
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.positive = function() {
    return new Quaternion(
      this.r < 0 ? -this.r : this.r,
      this.i < 0 ? -this.i : this.i,
      this.j < 0 ? -this.j : this.j,
      this.k < 0 ? -this.k : this.k);
  };

  /*
   * finds the addative inverse by multipling by -1
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.negative = function() {
    return new Quaternion(-this.r, -this.i, -this.j, -this.k);
  };

  /*
   * finds the dot product of a Quaternion and this
   * by treating the two Quaternions as vector4s
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.dotMul = function(q) {
    parseQuaternion(q);
    return (Q.r * this.r) + (Q.i * this.i) + (Q.j * this.j) + (Q.k * this.k);
  }

  /*
   * rounds each component up to a set number of d.p.
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.ceil = function(places) {
    if (typeof places === 'undefined'){
      places = 1;
    } else {
      places = Math.pow(10,places);
    }
    return new Quaternion(
      Math.ceil(this.r*places)/places, Math.ceil(this.i*places)/places,
      Math.ceil(this.j*places)/places, Math.ceil(this.k*places)/places);
  }

  /*
   * rounds each componet down to a set number of d.p.
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.floor = function(places) {
    if (typeof places === 'undefined'){
      places = 1;
    } else {
      places = Math.pow(10,places);
    }
    return new Quaternion(
      Math.floor(this.r*places)/places, Math.floor(this.i*places)/places,
      Math.floor(this.j*places)/places, Math.floor(this.k*places)/places);
  }

  /*
   * rounds each component down to a set number of d.p.
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.round = function(places) {
    if (typeof places === 'undefined'){
      places = 1;
    } else {
      places = Math.pow(10,places);
    }
    return new Quaternion(
      Math.round(this.r*places)/places, Math.round(this.i*places)/places,
      Math.round(this.j*places)/places, Math.round(this.k*places)/places
    );
  }

  /*
   * multiples this by its self
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.square = function() {
    return this.mul(this);
  }

  /*
   * multiples q by this (the rever order to usual)
   *
   * this method is used when wanting to compute (3+ 4i)(5 - 2i +3j - 5k)
   * as the quaternion multiplcation method cannt be called form the complex number
   *
   * @returns {Quaternion}
   * @nonComut
   */
  Quaternion.prototype.reverseOrderMultiply = function(q) {
    return (new Quaternion(q)).mul(this);
  }

  /*
   * divides this by a Quaternion by multipling by its multiplicative inverse
   *
   * @returns {Quaternion}
   * @nonComut
   */
  Quaternion.prototype.divide = function(q) {
    var P = (new Quaternion(q)).reciprocal();
    return this.mul(P).round(15);
  }

  /*
   * rounds each component towards zero
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.fix = function() {
    return new Quaternion(
      (this.r > 0) ? Math.floor(this.r): Math.ceil(this.r),
      (this.i > 0) ? Math.floor(this.i): Math.ceil(this.i),
      (this.j > 0) ? Math.floor(this.j): Math.ceil(this.j),
      (this.k > 0) ? Math.floor(this.k): Math.ceil(this.k));
  }

  /*
   * divides this by a scalor.
   * can be more acurate than finding the multiplicitive inverse of a scalar then multiplying
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.divideScalar = function(q) {
    return new Quaternion(this.r/q, this.i/q, this.j/q, this.k/q);
  }

  /*
   * dot divides this with a Quaternion by treating
   * the Quaternions as vector4s
   *
   * @returns {Quaternion}
   * @nonComut
   */
   //treats the quaternion like a Vector 4
  Quaternion.prototype.dotDivide = function(q) {
    parseQuaternion(q);
    return (this.r / Q.r) + (this.i / Q.i) + (this.j / Q.j) + (this.k * Q.k);
  }

  /*
   * dot power this to an exponent
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.dotPow = function(e){ // performs the power on each individual element
    return new Quaternion(
      Math.pow(this.r,e), Math.pow(this.i,e),
      Math.pow(this.j,e), Math.pow(this.k,e));
  }

  /*
   * raises e to the power of this
   * (used to calculate most of the trig functions)
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.exp = function() {
    /*
    * this is computed using the formula form https://en.wikipedia.org/wiki/Quaternion
    *
    * the formula is:
    *
    * e^q = e^a[cos(|v|) +  (v/|v|)*sin(|v|)]
    * where q = a + bi + cj + dk = a + v
    * where v is a vector containing the i, j and k components
    * and |v| is the norm of v
    * NOTE: |v| != |q| because v dose not contain a real component
    */
    if (this.isScalar) { // when v = 0i + 0j + 0k the norm is 0 so finding v/|v| is not possible
      return new Quaternion({r:Math.exp(this.r)});
    }
    var eToTheA = Math.exp(this.r);
    var vNorm = Math.pow(this.i*this.i + this.j*this.j + this.k*this.k,0.5);
    var sinOfVNorm = Math.sin(vNorm);
    var vOnVNorm = new Quaternion(0, this.i/vNorm, this.j/vNorm, this.k/vNorm);
    var cosVnorm = Math.cos(vNorm);

    return (vOnVNorm.mul(new Quaternion({r:sinOfVNorm})).add(new Quaternion({r:cosVnorm}))).mul(new Quaternion({r:eToTheA}));
  }

  /*
   * logs this to base e
   * (used ot calculate most of the trig functions)
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.ln = function() {// possibly impliment passing in peramiters later
     /*
     * this is computed using the formula form https://en.wikipedia.org/wiki/Quaternion
     *
     * the formula is:
     *
     * ln(q) = ln(|q|) + (v/|v|) * acos(a/|q|)
     * where q = a + bi + cj + dk = a + v
     * where v is a vector containing the i, j and k components of q
     * and |v| is the norm of v
     * NOTE: |v| IS NOT THE NORM OF q AS v DOSE NOT CONTAIN A REAL COMPONENT
     */
    if (this.canConverToComlex) {
      var c = (new Complex(this.r, this.i)).log();
      return new Quaternion(c.re, c.im, 0,0);
    }
    var qNomr = this.norm();
    var vNorm = Math.pow(this.i*this.i + this.j*this.j + this.k*this.k,0.5);
    var aCosOfAOnQNomr = Math.acos(this.r/qNomr);
    var vOnVnorm = new Quaternion(0, this.i/vNorm, this.j/vNorm, this.k/vNorm);
    return vOnVnorm.mul({r:aCosOfAOnQNomr}).add(new Quaternion(Math.log(qNomr),0,0,0));
  }

  /*
   * raises this to power of another quaternion
   * (uses the exp() method)
   *
   * @returns {Quaternion}
   * @nonComut
   */

  Quaternion.prototype.pow = function(p) {
    parseQuaternion(p)
    p = new Quaternion(Q.r, Q.i, Q.j, Q.k);
    if (p.isScalar && p.isPure) {//check for 0
      return new Quaternion({r:1});
    }

    if (this.r === 1 && this.isScalar) {
      return this;
    }

    if (p.isScalar && p.r % 1 === 0) {
      var P = this;
      if (p<0) {
        P = this.reciprocal();
        p *= -1;
      }
      var result = P;
      for (var i = 1; i < p.r ; i++) {
        result = result.mul(P);
      }
      return result;
    }

    if (this.canConverToComlex && p.canConverToComlex) {
      var c = new Complex(this.r, this.i).pow(new Complex(p.r, p.i));
      return new Quaternion(c.re, c.im, 0, 0);
    }

    /*
     * formula for evaluating a Quaternion to a non integer power
     *
     * q^p === e^ln(q^p) === e^[ln(q)*p]
     */

    return this.ln().mul(p).exp().round(15);
  }

  // can be used instead of pow but can also be used to find the square root of negative real numbers when constraints have been passed in
  Quaternion.prototype.nthRoot = function(root, constraint,unknownComponent) {
    if(!this.isPure && this.r <0 && root === 2) {
      parseQuaternion(constraint);

      if(Q.r !== 0){
        throw TypeError('Invalid constraint');
      }

      console.log(unknownComponent);

      if(!(unknownComponent === 'i' || unknownComponent === 'j' || unknownComponent === 'k')) {
        throw TypeError('Invalid unknown component');
      }

      if(Q[unknownComponent] !== 0) {
        throw TypeError('Unknown component can not be constraint');
      }

      var P = new Quaternion(Q);

      if((-this.r)-P.i*P.i-P.j*P.j-P.k*P.k<0) {
        throw TypeError('Constraint too large. No roots exist that fit the constraint');
      }

      if(unknownComponent === 'i') {
        P[unknownComponent] = Math.pow((-this.r)-Q.j*Q.j-Q.k*Q.k,0.5);
      } else if(unknownComponent === 'j') {
        P[unknownComponent] = Math.pow((-this.r)-Q.i*Q.i-Q.k*Q.k,0.5);
      } else {
        P[unknownComponent] = Math.pow((-this.r)-Q.i*Q.i-Q.j*Q.j,0.5);
      }

      return P;
    } else {
      return this.pow({r:1/root})
    }

  }

  /*
   * performs power in the reverse order (uses this as the exponet and p as the base)
   *
   * @returns {Quaternion}
   * @nonComut
   */
  Quaternion.prototype.reverseOrderPower = function(p) {
    parseQuaternion(p);
    return (new Quaternion(Q)).pow(this);
  }

  Quaternion.prototype.log = function() {
    return this.ln();
  }

  /*
   * converts this to a string
   *
   * @returns {String}
   */
  Quaternion.prototype.toString = function() {
    var returnString = '';
    returnString += buildToString(returnString,this.r,'');
    returnString += buildToString(returnString,this.i,'i');
    returnString += buildToString(returnString,this.j,'j');
    returnString += buildToString(returnString,this.k,'k');
    return returnString;
  }

  function buildToString(string, value, component){
    if (value === 0){
      return '';
    }
    if(string === ''){
      return value.toString() + component;
    } else {
      var stringValue = Math.abs(value).toString();
      if (value === 1 || value === -1) {
        stringValue = '';
      }

      return (value > 0)
      ? ' + ' + stringValue + component
      : ' - ' + stringValue + component;
    }
  }

        //non real specific functions

  /*
   * finds the conjugate of this
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.conjugate = function(){
    return new Quaternion(this.r, -this.i, -this.j, -this.k);
  }

  /*
   * finds the norm of this
   *
   * @returns {number}
   */
  Quaternion.prototype.norm = function(){
    return Math.pow(this.r*this.r + this.i*this.i + this.j*this.j + this.k*this.k,0.5);
  }

  /*
   * creates another copy of this
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.clone = function() {
    return new Quaternion(this.r, this.i, this.j, this.k);
  }

  /*
   * gets real component of this
   *
   * @returns {number}
   */
  Quaternion.prototype.r = function() {
    return this.r;
  }

  /*
   * gets first imaginary component of this
   *
   * @returns {number}
   */
  Quaternion.prototype.i = function() {
    return this.i;
  }

  /*
   * gets second imaginary component of this
   *
   * @returns {number}
   */
  Quaternion.prototype.j = function() {
    return this.j;
  }

  /*
   * gets third imaginary component of this
   *
   * @returns {number}
   */
  Quaternion.prototype.k = function() {
    return this.k;
  }

  /*
   * gets the argument of this
   *
   * @returns {number}
   */
  Quaternion.prototype.arg = function() {
    return Math.acos(a/this.norm());
  }

        //rotation function

  Quaternion.prototype.rotate = function(rotation) {
    parseQuaternion(rotation)
    rotation = new Quaternion(Q);
    if(rotation.norm() !== 1 && rotation.isPure) {
      rotation = rotation.normalise(); //if the rotation quaternion is not normalised it is normalised here
    }

    return rotation.mul(this).mul(rotation.conjugate());
  }

  Quaternion.prototype.normalise = function(){
    var norm = this.norm();
    if(norm === 0) {
      return this;
    } else {
      return new Quaternion(this.r/norm, this.i/norm, this.j/norm, this.k/norm);
    }
  }

        //relational functions

  Quaternion.prototype.equals = function(q) {
    parseQuaternion(q);
    return (this.r === Q.r && this.i === Q.i &&
            this.j === Q.j && this.k === Q.k);
  }

  Quaternion.prototype.unequal = function(q) {
    return !this.equals(q);
  }

  Quaternion.prototype.isNaN = function() {
    return isNaN(this.r) || isNaN(this.i) || isNaN(this.j) || isNaN(this.k);
  }


        //conversion functions
   //vector a matrix related functions
   Quaternion.prototype.toVector3 = function() {
    return [this.i, this.j, this.k];
   }

   Quaternion.prototype.toVector4 = function() {
    return [this.r, this.i, this.j, this.k];
   }

   Quaternion.prototype.to2x2Matrix = function() {
    return [
      [new Complex(this.r, this.i), new Complex(this.j, this.k)],
      [new Complex(-this.j,this.k), new Complex(this.r, -this.i)]
    ];
   }

   Quaternion.prototype.to4x4Matrix = function() {
    return [
      [this.r, this.i, this.j, this.k],
      [-this.i, this.r, -this.k, this.j],
      [-this.j, this.k, this.r, -this.i],
      [-this.k, -this.j, this.i, this.r]
    ];
  }

        //utility function
  /*
   * this method is used when the starting peramiter is not a Quaternion
   * this is needed becaues many Quaternion operators are not comutative
   * example:
   * used when wanting to compute (3+2i) * (3 + 7i + 3j + 5k)
   * becasue (3+2i) is not a Quaternion the multiply method
   * cannot be called form it so it is passed into nonQuaternion() with the name of the funciton
   * (3+2i) * (3 + 7i + 3j + 5k) = A
   *
   * A = nonQuaternion([new Complex(3+2i), new Quaternion(3 + 7i + 3j + 5k)], 'mul');
   *
   * this is nessessary because Quaternions are not comutative
   * @perams {values[] , string}
   *
   * @return the return type of the function passed in
   */
  Quaternion.prototype.nonQuaternionOp = function(peramiters, operation) {
    if (peramiters.length !== 2 || arguments.length !== 2) {
      throw new Error('wrong number of peramiters');
    }

    return (new Quaternion(peramiters[0]))[operation](new Quaternion(peramiters[1]));
  }

  Quaternion.prototype.toJson = function () {
    return {
      mathjs:'Quaternion',
      r: this.r,
      i: this.i,
      j: this.j,
      k: this.k
    }
  }

	return Quaternion;
}

exports.name = 'Quaternion';
exports.path = 'type';
exports.factory = factory;
