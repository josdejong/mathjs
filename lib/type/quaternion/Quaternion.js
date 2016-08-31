'usestrict';
var Complex = require('complex.js');

function factory (type, config, load, typed, math) {
	
	var Q = { 
		r: 0,
		i: 0,
		j: 0,
		k: 0
	}

  //Constants 
  // Quaternion.prototype.RE = {r:1};
  // Quaternion.prototype.I = {i:1};
  // Quaternion.prototype.J = {j:1};
  // Quaternion.prototype.K = {k:1};
  Quaternion.prototype.ZERO = {r:0, i:0, j:0, k:0};

  /*
  * @constructor
  * @returnes Quaternion
  */
	function Quaternion(a,b,c,d) {
		
		if(!(this instanceof Quaternion )){
			return new Quaternion(a,b,c,d);
		}

		makeQuaternion(a,b,c,d);

    this.r = Q.r;
    this.i = Q.i;
    this.j = Q.j;
    this.k = Q.k;
    
    // check for pure and scalor Quaternions
    if (Q.r === 0 && Q.i !== 0 && Q.j !== 0 && Q.k !== 0){
      this.isPure = true;
      this.isScalar = false;
    } else if (Q.i === Q.j === Q.k ===0){ // 0 + 0i + 0j + 0k is still a scaler Quaternion
      this.isPure = false;
      this.isScalar = true;
    } else {
      this.isPure = false;
      this.isScalar = false;
    }
    if (!this.isPure && this.j === this.k === 0) {
      this.canConverToComlex = true;
    } else {
      this.canConverToComlex = false;
    }
	}

  function checkPurityAndScalerness(q) {
    if (Q.r === 0 && Q.i !== 0 && Q.j !== 0 && Q.k !== 0){
      this.isPure = true;
      this.isScalar = false;
    } else if (Q.i ===0 && Q.j === 0 && Q.k ===0){ // 0 + 0i + 0j + 0k is still a scaler Quaternion
      this.isPure = false;
      this.isScalar = true;
    } else {
      this.isPure = false;
      this.isScalar = false;
    }
  }

	function makeQuartError() {
    throw SyntaxError('Invalid Param');
  };

	function makeQuaternion(a,b,c,d){
		Q = { 
      r: 0,
      i: 0,
      j: 0,
      k: 0
    }
    if(
      typeof a === 'number' && typeof b === 'number' &&
      typeof c === 'number' && typeof d === 'number'
    ) {
      Q.r = parseFloat(a);
      Q.i = parseFloat(b);
      Q.j = parseFloat(c);
      Q.k = parseFloat(d);
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
      Q.r = parseFloat(a.r) | 0;
      Q.i = parseFloat(a.i) | 0; 
      Q.j = parseFloat(a.j) | 0;
      Q.k = parseFloat(a.k) | 0;
    } else if (typeof a === 'object' && a !== null && ('re' in a || 'im' in a)) { //check for complex numbers being passed in form z = x + yi
      Q.r = parseFloat(a.re) | 0;
      Q.i = parseFloat(a.im) | 0;
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
       * where X represent a series of digits , Y represents on of i, j or k and Z represents a + or -
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
    } else {
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
    makeQuaternion(q)
    return new Quaternion(Q.r + this.r, Q.i + this.i, Q.j + this.j, Q.k + this.k);
  };

  /*
   * subtracs a Quaternion from this
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.subtract = function(q) {
    makeQuaternion(q);
    return new Quaternion(this.r -Q.r , this.i - Q.i, this.j - Q.j, this.k - Q.k);
  };

  /*
   * subtracts in the reverse order. Used for calculating 4 - (2 + 3i) 
   * as .subtract cannot be called from the number 4
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.reverseOrderSubtract = function(q) {
    makeQuaternion(q);
    return (new Quaternion(Q)).subtract(this);
  };

  /*
   * multiplies 2 quaternions
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.mul = function(q) {
    makeQuaternion(q);
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
    if(this.r === this.i === this.j === this.k === 0) {
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
      this.r < 0 ? this.r*-1 : this.r,
      this.i < 0 ? this.i*-1 : this.i,
      this.j < 0 ? this.j*-1 : this.j,
      this.k < 0 ? this.k*-1 : this.k);
  };

  /*
   * finds the addative inverse by multipling by -1 
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.negative = function() {
    return new Quaternion(this.r * -1, this.i *-1, this.j * -1, this.k * -1);
  };

  /*
   * finds the dot product of a Quaternion and this
   *
   * @returns {Quaternion}
   */

   //todo fix this 
  Quaternion.prototype.dotMul = function(q) {
    makeQuaternion(q);
    return new Quaternion(this.r * Q.r, this.i * Q.i, this.j * Q.j, this.k * Q.k);
  }

  /*
   * rounds each component up to set precision
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
   * rounds each componet down to set precision
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
   * rounds to nearest number dependent of set precision
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
    )
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
   * this is used because Quaternion multiplication is non comutative so 
   * AB !== BA 
   * this method is used when wanting to compute (3+ 4i)(5 - 2i +3j - 5k) 
   * as the quaternion multiplcation method cannt be called form the complex number
   * 
   * @returns {Quaternion}
   */
  Quaternion.prototype.reverseOrderMultiply = function(q) {
    return (new Quaternion(q)).mul(this);
  }

  /*
   * divides this by a Quaternion by multipling by its multiplicative inverse
   * 
   * @returns {Quaternion}
   */
  Quaternion.prototype.divide = function(q) {
    var P = (new Quaternion(q)).reciprocal();
    return this.mul(P);
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
      (this.k > 0) ? Math.floor(this.k): Math.ceil(this.k))
  }

  /*
   * divides this by a scalor
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.divideScalar = function(q) {
    return new Quaternion(this.r/q, this.i/q, this.j/q, this.k/q);
  }

  /*
   * dot divides each this with a Quaternion
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.dotDivide = function(q) {
    makeQuaternion(q);
    return new Quaternion(this.r/Q.r, this.i/Q.i, this.j/Q.j, this.k/Q.k);
  }

  /*
   * dot power this to an exponent
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.dotPow = function(e){ // treats it as a vegctor rather than a Quaternion 
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
    * NOTE: |V|  IS NOT THE NORM OF q AS v DOSE NOT CONTAIN A REAL COMPONENT 
    */
    var eToTheA = Math.exp(this.r);
    var vNorm = Math.pow(this.i*this.i, this.j*this.j, this.k*this.k,0.5);
    var sinOfVNorm = Math.sin(vNorm);
    return new Quaternion(
      eToTheA*Math.cos(vNorm), eToTheA*sinOfVNorm*this.i/vNorm,
      eToTheA*sinOfVNorm*this.j/vNorm, eToTheA*sinOfVNorm*this.k/vNorm
    )
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
     * where v is a vector containing the i, j and k components 
     * and |v| is the norm of v 
     * NOTE: |v| IS NOT THE NORM OF q AS v DOSE NOT CONTAIN A REAL COMPONENT 
     */  
    var qNomr = this.norm();
    var vNorm = new Quaternion({r:Math.pow(this.i*this.i, this.j*this.j, this.k*this.k,0.5)});
    var aCosOfAOnQNomr = Complex.acos(this.r/qNomr);// uses Complex acos as the value may be out side of the real acos range
    return (new Quaternion(0,this.i,this.j,this.k)).divide(vNorm).mul(aCosOfAOnQNomr).add(Math.log(qNomr),0,0,0); 
  }

  /*
   * rises this to power of another quaternion
   * (uses the exp() method)
   * 
   * @returns {Quaternion}
   */
  Quaternion.prototype.pow = function(p) {
    /* 
     * formula for evaluating any Quaternion to a Quaternion power
     * q^p === e^ln(q^p) === e^[p*ln(q)]
     */
    p = new Quaternion(p);

    return new p.mul(this.ln()).exp();
  }

  /*
   * performs power in the reverse order (uses this as the exponet and p as the base)
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.reverseOrderPower = function(p) {
    makeQuaternion(p);
    return (new Quaternion(P)).pow(this);
  }

  /*
   * logs this to base 10 
   * (uses ln() method)
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.log10 = function() {
    /*
     * this is done by using the formula to change the base of a number
     * log_10(q) = log_e(q)/log_e(10)
     *
     */
     return this.ln().divide(Math.log(10),0,0,0);
  }  

  /*
   * logs this to any base
   * (uses ln() method)
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.logn = function(base) {
    /*
     * this is done by using the formula to change the base of a number
     * log_n(q) = log_e(q)/log_e(n)
     *
     */
    makeQuaternion(base);
    n = new Quaternion(Q.r, Q.i, Q.j, Q.k);
    return this.ln().divide(n.ln());
  }

  /*
   * converts this to a string
   *
   * @returns {String}
   */
  Quaternion.prototype.toString = function() {
    var returnString = '';
    returnString += buildToString(returnString,this.r,'r');
    returnString += buildToString(returnString,this.i,'i');
    returnString += buildToString(returnString,this.j,'j');
    returnString += buildToString(returnString,this.k,'k');
    return returnString;
  }

  function buildToString(string, value, component){
    if(value === 0){
      return '';
    }
    if(string === ''){
      return value.toString() + component;
    } else {
      return (value > 0) 
      ? '+' + value.toString() + component
      : value.toString() + component;
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
   * gets rational component of this
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.r = function() {
    return this.r;
  }

  /*
   * gets first imaginary component of this
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.i = function() {
    return this.i;
  }

  /*
   * gets second imaginary component of this
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.j = function() {
    return this.j;
  }

  /*
   * gets third imaginary component of this
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.k = function() {
    return this.k;
  }

  /*
   * gets the argument of this
   *
   * @returns {Quaternion}
   */
  Quaternion.prototype.arg = function() {
    return Math.acos(a/this.norm());
  }

        //relational functions

  Quaternion.prototype.equals = function(q) {
    makeQuaternion(q);
    return (this.r === Q.r && this.i === Q.i &&
            this.j === Q.j && this.k === Q.k);
  }

  Quaternion.prototype.unequal = function(q) {
    return !this.equals(q);
  }

        //trig functions

  /*
   * all function below return the trig function they are named after
   * 
   * @returns {Quaternion}
   */

  //  basic trig function
  Quaternion.prototype.sin = function(q) {
    /*
     * calculated using the formula:
     * Sin(q) = [e^(iq)-e^(-iq)]/2i 
     */
    var iTimesQ = (new Quaternion({i:1})).mul(q);
    var minusITimesQ = (new Quaternion({i:-1})).mul(q);
    return new Quaternion( (iTimesQ.exp().subtract(minusITimesQ.exp()) ).divide({i:2}));
  }

  Quaternion.prototype.cos = function(){
    /*
     * calculated using the formula:
     * cos(q) = [e^(iq) _ e^(-iq)]/2
     */
    var iTimesQ = (new Quaternion({i:1})).mul(q);
    var minusITimesQ = (new Quaternion({i:-1})).mul(q); 
    return new Quaternion( iTimesQ.exp().add(minusITimesQ.exp() ).divide(2));
  }

  Quaternion.prototype.tan = function() {// using identity tan(x) = sin(x)/cos(x)
    return this.sin().divide(this.cos());
  }

  // recipricals of basic trig funcitons
  Quaternion.prototype.cosec = function() {
    return this.sin().reciprocal();
  }

  Quaternion.prototype.sec = function() {
    return this.cos().reciprocal();
  }

  Quaternion.prototype.cot = function() {
    return this.cos().divide(this.sin());
  }

  //inverse basic trig funcitons
  /*
   * For All inverse trig functions formula see:
   * https://en.wikipedia.org/wiki/Inverse_trigonometric_functions
   **/
  Quaternion.prototype.asin = function() {
    /* 
     * using rearangment of sin formula:
     *
     * asin(q) = -i*ln[i*q + (1 + q^2)^0.5 ]
     */ 
     var minusI = new Quaternion({i:-1});
     var I = new Quaternion({i:1});
     var rootVal = (new Quaternion(this.RE)).subtract(this.square()).pow(0.5);
     var lnVal = I.mul(this).add(rootVal).ln();
     return minusI.mul(lnVal);
  }

  Quaternion.prototype.acos = function() {
    return (new Quaternion(Math.PI/2,0,0,0)).subtract(this.asin());
  }

  Quaternion.prototype.atan = function() {
    /*
     * calculated using formula:
     *
     * (i/2)*[ ln(1 - i*p) - ln(1 + i*p) ] === (i/2)*ln[ (1 - i*p)/(1 + ip)] 
     * the second formula is used because calculating fewer logs reduces time
     */
     var one = new Quaternion(1,0,0,0);
     var i = new Quaternion(0,1,0,0);
     var a = one.subtract(i.divide(this));
     var b = one.add(i.divide(this));
     return iOn2.mul(0,0.5,0,0).mul(a.divide(b).ln());
  }

  //inverse reiprical of basic trig functions

  /*
   * calculated using formula
   *
   * asin(q) === acosec(1/q) (sub in q = 1/q)
   * therefore acosec(q) === asin(1/q);
   *
   * this identity is true for all inverse funcitons and the inverse reciprical functions
   */

  Quaternion.prototype.acosec = function() {
     return this.reciprocal().asin();
  }

  Quaternion.prototype.asec = function() {
    return this.reciprocal().acos();
  }

  Quaternion.prototype.acot = function() {
    return this.reciprocal().atan();
  }

  /*
   * basic hyperboic trig funcitons
   *
   * formulas for these are defined: https://en.wikipedia.org/wiki/Hyperbolic_function
   */
  Quaternion.prototype.sinh = function() {
    /* 
     * calculating using formula:
     *
     * sinh(q) = (e^q - e^-q)/2
     */
    return this.exp().sub(this.mul(-1,0,0,0).exp()).divide(0.5,0,0,0);
  }

  Quaternion.prototype.cosh = function() {
    /*
     * calculating using formula:
     *
     * cosh(q) = (e^q + e^-q)/2
     */
     return this.exp().add(this.mul(-1,0,0,0).exp()).divide(0.5,0,0,0);
  }

  Quaternion.prototype.tanh = function() {
    /*
     * calculating using idntity: 
     *
     * tanh(q) = sinh(q)/cosh(q)
     */
    return this.sinh().divide(this.cosh());
  }

  //basic hyperbolic recipricol trig functions

  Quaternion.prototype.cosech = function() {
    /*
     * calculating using identity:
     *
     * cosech(q) = 1/sinh(q)
     */
     return this.sinh().reciprocal()
  }

  Quaternion.prototype.sech = function() {
    /*
     * calculating using identity:
     *
     * sech(q) = 1/cosh(q)
     */
    return this.cosh().reciprocal();
  }

  Quaternion.prototype.coth = function() {
    /*
     * calculating using identity:
     *
     * coth(q) = cosh(q)/sinh(q)
     */
     return this.cosh().divide(this.sinh());
  }

  //inverse funcion of basic hyperbolic funtions 
  Quaternion.prototype.asinh = function() {
    /*
     * calculated using formula:
     *
     * asinh(q) = ln[q + (q^2 + 1)^0.5]
     */
     var root = this.square().add(1,0,0,0).pow(0.5);
     return root.add(this).ln();
  }

  Quaternion.prototype.acosh = function() {
    /* 
     * calculated using formula:
     * 
     * acosh(q) = ln[q + (x^2 - 1)^0.5]
     */
     var root = this.square().subtract(1,0,0,0).pow(0.5);
     return this.add(root).ln();
  }

  Quaternion.prototype.atanh = function() {
    /*
     * calculating using formula: 
     *
     * atanh(q) = ln[ (x+1)/(1-x)]/2
     */
    var fraction = this.add(1,0,0,0).divide(new Quaternion(1,0,0,0).subtract(this));
    return fraction.ln().divide(2,0,0,0);
  }

  //inverse reiprical of basic hyperbolic trig functions

  /*
   * calculated using formula
   *
   * asinh(q) === acosech(1/q) (sub in q = 1/q)
   * therefore acosech(q) === asinh(1/q);
   *
   * this identity is true for all inverse hyperbolic funcitons and the inverse reciprical hyperbolic functions
   */

   Quaternion.prototype.acosech = function() {
    return this.reciprocal().asinh();
   }

   Quaternion.prototype.asech = function() {
    return this.reciprocal().acosh();
   }

   Quaternion.prototype.acoth = function() {
    return this.reciprocal().atan();
   }

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

	return Quaternion;
}

exports.name = 'Quaternion';
exports.path = 'type';
exports.factory = factory;
