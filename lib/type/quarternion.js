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
  // Quarternion.prototype.RE = {r:1};
  // Quarternion.prototype.I = {i:1};
  // Quarternion.prototype.J = {j:1};
  // Quarternion.prototype.K = {k:1};
  Quarternion.prototype.ZERO = {r:0, i:0, j:0, k:0};

  /*
  * @constructor
  * @returnes Quarternion
  */
	function Quarternion(a,b,c,d) {
		
		if(!(this instanceof Quarternion )){
			return new Quarternion(a,b,c,d);
		}

		makeQuarternion(a,b,c,d);

    this.r = Q.r;
    this.i = Q.i;
    this.j = Q.j;
    this.k = Q.k;
    this.isQuarternion = true;
    // check for pure and scalor Quarternions
    if (Q.r === 0 && Q.i !== 0 && Q.j !== 0 && Q.k !== 0){
      this.isPure = true;
      this.isScalar = false;
    } else if (Q.i ===0 && Q.j === 0 && Q.k ===0){ // 0 + 0i + 0j + 0k is still a scaler Quarternion
      this.isPure = false;
      this.isScalar = true;
    } else {
      this.isPure = false;
      this.isScalar = false;
    }
	}

  function checkPurityAndScalerness(q){
    if (Q.r === 0 && Q.i !== 0 && Q.j !== 0 && Q.k !== 0){
      this.isPure = true;
      this.isScalar = false;
    } else if (Q.i ===0 && Q.j === 0 && Q.k ===0){ // 0 + 0i + 0j + 0k is still a scaler Quarternion
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

	function makeQuarternion(a,b,c,d){
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
      && typeof a.phi === 'undefined' //to prevent the r from modulus argument form complex number being used as a scaler Quarternion
    ){
      Q.r = parseFloat(a.r) | 0;
      Q.i = parseFloat(a.i) | 0; 
      Q.j = parseFloat(a.j) | 0;
      Q.k = parseFloat(a.k) | 0;
    } else if (typeof a === 'object' && a !== null && ('re' in a || 'im' in a)) { //check for complex numbers being passed in form z = x + yi
      Q.r = parseFloat(a.re);
      Q.i = parseFloat(a.im);
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
       * X, X.X, .X, XY, X.XY, .XY  
       *
       * where X represent a positive or negative number and Y represents on of i, j or k
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

  // arithmetic function

  /*
  * adds 2 Quarternion numbers together
  *
  * @returns {Quarternion}
  */
  Quarternion.prototype.add = function(q) {
    makeQuarternion(q)
    return new Quarternion(Q.r + this.r, Q.i + this.i, Q.j + this.j, Q.k + this.k);
  };

  Quarternion.prototype.subtract = function(q) {
    makeQuarternion(p);
    return new Quarternion(this.r -Q.r , this.i - Q,i, this.j - Q.j, this.k - Q.k);
  }

  Quarternion.prototype.mul = function(q){
    makeQuarternion(q)
    return new Quarternion(
      (this.r * Q.r) - (this.i * Q.i) - (this.j * Q.j) - (this.k * Q.k),
      (this.r * Q.i) + (this.i * Q.r) + (this.j * Q.k) - (this.k * Q.j),
      (this.r * Q.j) + (this.j * Q.j) + (this.k * Q.i) - (this.i * Q.k),
      (this.r * Q.k) + (this.k * Q.r) + (this.i * Q.j) - (this.j * Q.i)
     )
  }

  Quarternion.prototype.reciprocal = function() {
    var norm_squared = Math.pow(this.norm(),2);
    var conjugate = this.conjugate();
    return new Quarternion(
      conjugate.r/norm_squared, conjugate.i/norm_squared,
      conjugate.j/norm_squared, conjugate.k/norm_squared);
  }

  Quarternion.prototype.sign = function() {
    var norm = this.norm();
    var positive = this.positive();
    return new Complex(norm.r/positive.r, norm.i/positive.i, norm.j/positive.j, norm.k/positive.k);
  }

  Quarternion.prototype.positive = function(){
    return new Complex(
      this.r < 0 ? this.r*-1 : this.r,
      this.i < 0 ? this.i*-1 : this.i,
      this.j < 0 ? this.j*-1 : this.j,
      this.k < 0 ? this.k*-1 : this.k)
  }

  Quarternion.prototype.negative = function(){
    this.positive().mul(-1,0,0,0)
  }

  Quarternion.prototype.dot = function(q) {
    makeQuarternion(q);

  Quarternion.prototype.ceil = function(places) {
    if (typeof places === 'undefined'){
      places = 1;
    } else {
      places = Math.pow(10,places);
    }
    return new Quarternion(
      Math.ceil(this.r*places)/places, Math.ceil(this.i*places)/places,
      Math.ceil(this.j*places)/places, Math.ceil(this.k*places)/places);
  }

  Quarternion.prototype.floor = function(places) {
    if (typeof places === 'undefined'){
      places = 1;
    } else {
      places = Math.pow(10,places);
    }
    return new Quarternion(
      Math.foor(this.r*places)/places, Math.floor(this.i*places)/places,
      Math.floor(this.j*places)/places, Math.floor(this.k*places)/places); 
  }

  Quarternion.prototype.round = function(places) {
    if (typeof places === 'undefined'){
      places = 1;
    } else {
      places = Math.pow(10,places);
    }
    return new Quarternion(
      Math.round(this.r*places)/places, Math.round(this.i*places)/places,
      Math.round(this.j*places)/places, Math.round(this.k*places)/places
    )
  }

  Quarternion.prototype.square = function(){
    return this.mul(this);
  }

  Quarternion.prototype.divide = function(q) {
    makeQuarternion(q)
    Q = Q.reciprocal();
    return this.mul(Q);
  }

  Quarternion.prototype.fix = function() {
    return new Quarternion( 
      (this.r > 0) ? math.floor(this.r): math.ceil(this.r),
      (this.i > 0) ? math.floor(this.i): math.ceil(this.i),
      (this.j > 0) ? math.floor(this.j): math.ceil(this.j),
      (this.k > 0) ? math.floor(this.k): math.ceil(this.k))
  }

  Quarternion.prototype.divideScalar = function(q) {
    return new Quarternion(this.r/q, this.i/q, this.j/q, this.k/q);
  }

  Quarternion.prototype.dotDivide = function(q) {
    makeQuarternion(q);
    new Quarternion(this.r/Q.r, this.i/Q.i, this.j/Q.j, this.k/Q.k);
  }

  Quarternion.prototype.dotPower = function(e){ // treats it as a vegctor rather than a Quarternion 
    return new Quarternion(
      Math.pow(this.r,e), Math.pow(this.i,e),
      Math.pow(this.j,e), Math.pow(this.k,e))
  }

  Quarternion.prototype.exp = function() {
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
    return new Quarternion(
      eToTheA*Math.cos(vNorm), eToTheA*sinOfVNorm*this.i/vNorm,
      eToTheA*sinOfVNorm*this.j/vNorm, eToTheA*sinOfVNorm*this.k/vNorm
    )
  }

  Quarternion.prototype.ln = function() {// possibly impliment passing in peramiters later
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
    var vNorm = Math.pow(this.i*this.i, this.j*this.j, this.k*this.k);
    var aCosOfAOnQNomr = Math.acos(this.r/qNomr);
    return new Quarternion(
      Math.log(this.r), aCosOfAOnQNomr*this.i/vNorm,
      aCosOfAOnQNomr*this.j/vNorm, aCosOfAOnQNomr*this.k/vNorm
    );    
  }

  Quarternion.prototype.pow = function(p) {
    /* 
     * formula for evaluating any Quarternion to a Quarternion power
     * q^p === e^ln(q^p) === e^[p*ln(q)]
     */
    p = new Quarternion(p);

    return new p.mul(this.ln()).exp();
  }


  Quarternion.prototype.log10 = function() {
    /*
     * this is done by using the formula to change the base of a number
     * log_10(q) = log_e(q)/log_e(b)
     *
     */
     return this.ln().divide(Math.log(10),0,0,0);
  }  

  Quarternion.prototype.toString = function() {
    var returnString = '';
    
    returnString += buildToString(returnString,this.r,'r');
    returnString += buildToString(returnString,this.i,'i');
    returnString += buildToString(returnString,this.j,'j');
    returnString += buildToString(returnString,this.k,'k');
   
  }

  function buildToString(string, value, componen){
    if(value === 0){
      return '';
    }
    if(string === ''){
      return value.toString() + componen;
    } else {
      return (value > 0) 
      ? '+' + value.toString() + component
      : value.toString() + component;
    }
  }

  //non real specific functions
  Quarternion.prototype.conjugate = function(){
    return new Quarternion(this.r, -this.i, -this.j, -this.k);
  }

  Quarternion.prototype.norm = function(){
    return Math.pow(this.r*this.r + this.i*this.i + this.j*this.j + this.k*this.k,0.5);
  }

  Quarternion.prototype.clone = function() {
    return new Quarternion(this.r, this.i, this.j, this.k);
  }

  Quarternion.prototype.r = function() {
    return this.r;
  }

  Quarternion.prototype.i = function() {
    return this.i;
  }

  Quarternion.prototype.j = function() {
    return this.j;
  }

  Quarternion.prototype.k = function() {
    return this.k;
  }

  Quarternion.prototype.arg = function() {
    return Math.acos(a/this.norm());
  }

  //relational functions

  Quarternion.prototype.equals = function(q) {
    makeQuarternion(q);
    return (this.r === Q.r && this.i === Q.i &&
            this.j === Q.j && this.k === Q.k);
  }

  Quarternion.prototype.unequal = function(q) {
    return !this.equals(q);
  }

  //trig functions

  //  basic trig function
  Quarternion.prototype.sin = function(q) {
    /*
     * calculated using the formula:
     * Sin(q) = [e^(iq)-e^(-iq)]/2i 
     */
    var iTimesQ = (new Quarternion({i:1})).mul(q);
    var minusITimesQ = (new Quarternion({i:-1})).mul(q);
    return new Quarternion( (iTimesQ.exp().subtract(minusITimesQ.exp()) ).divide({i:2}));
  }

  Quarternion.prototype.cos = function(){
    /*
     * calculated using the formula:
     * cos(q) = [e^(iq) _ e^(-iq)]/2
     */
    var iTimesQ = (new Quarternion({i:1})).mul(q);
    var minusITimesQ = (new Quarternion({i:-1})).mul(q); 
    return new Quarternion(( iTimesQ.exp().add(minusITimesQ.exp() ).divide(2));
  }

  Quarternion.prototype.tan = function() {// using identity tan(x) = sin(x)/cos(x)
    return this.sin().divide(this.cos());
  }

  // recipricals of basic trig funcitons
  Quarternion.prototype.cosec = function() {
    return this.sin().reciprocal();
  }

  Quarternion.prototype.sec = function() {
    return this.cos().reciprocal();
  }

  Quarternion.prototype.cot = function() {
    return this.cos().divide(this.sin());
  }

  //inverse basic trig funcitons
  /*
   * For All inverse trig functions formula see:
   * https://en.wikipedia.org/wiki/Inverse_trigonometric_functions
   **/
  Quarternion.prototype.asin = function() {
    /* 
     * using rearangment of sin formula:
     *
     * asin(q) = -i*ln[i*q + (1 + q^2)^0.5 ]
     */ 
     var minusI = new Complex(i:-1);
     var I = new Complex({i;1});
     var rootVal = (new Complex(this.RE)).subtract(this.square()).pow(0.5);
     var lnVal = I.mul(this).add(rootVal).ln();
     return minusI.mul(lnVal);
  }

  Quarternion.prototype.acos = function() {
    return (new Quarternion(Math.PI/2,0,0,0)).subtract(this.asin());
  }

  Quarternion.prototype.atan = function() {
    /*
     * calculated using formula:
     *
     * (i/2)*[ ln(1 - i*p) - ln(1 + i*p) ] === (i/2)*ln[ (1 - i*p)/(1 + ip)] 
     * the second formula is used because calculating fewer logs reduces time
     */
     var one = new Quarternion(1,0,0,0);
     var i = new Quarternion(0,1,0,0);
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

  Quarternion.prototype.acosec = function() {
     return this.reciprocal().asin();
  }

  Quarternion.prototype.asec = function() {
    return this.reciprocal().acos();
  }

  Quarternion.prototype.acot = function() {
    return this.reciprocal().atan();
  }

  /*
   * basic hyperboic trig funcitons
   *
   * formulas for these are defined: https://en.wikipedia.org/wiki/Hyperbolic_function
   */
  Quarternion.prototype.sinh = function() {
    /* 
     * calculating using formula:
     *
     * sinh(q) = (e^q - e^-q)/2
     */
    return this.exp().sub(this.mul(-1,0,0,0).exp()).divide(0.5,0,0,0);
  }

  Quarternion.prototype.cosh = function() {
    /*
     * calculating using formula:
     *
     * cosh(q) = (e^q + e^-q)/2
     */
     return this.exp().add(this.mul(-1,0,0,0).exp()).divide(0.5,0,0,0);
  }

  Quarternion.prototype.tanh = function() {
    /*
     * calculating using idntity: 
     *
     * tanh(q) = sinh(q)/cosh(q)
     */
    return this.sinh().divide(this.cosh());
  }

  //basic hyperbolic recipricol trig functions

  Quarternion.prototype.cosech = function() {
    /*
     * calculating using identity:
     *
     * cosech(q) = 1/sinh(q)
     */
     return this.sinh().reciprocal()
  }

  Quarternion.prototype.sech = function() {
    /*
     * calculating using identity:
     *
     * sech(q) = 1/cosh(q)
     */
    return this.cosh().reciprocal();
  }

  Quarternion.prototype.coth = function() {
    /*
     * calculating using identity:
     *
     * coth(q) = cosh(q)/sinh(q)
     */
     return this.cosh().divide(this.sinh());
  }

  //inverse funcion of basic hyperbolic funtions 
  Quarternion.prototype.asinh = function() {
    /*
     * calculated using formula:
     *
     * asinh(q) = ln[q + (q^2 + 1)^0.5]
     */
     var root = this.square().add(1,0,0,0).pow(0.5);
     return root.add(this).ln();
  }

  Quarternion.prototype.acosh = function() {
    /* 
     * calculated using formula:
     * 
     * acosh(q) = ln[q + (x^2 - 1)^0.5]
     */
     var root = this.square().subtract(1,0,0,0).pow(0.5);
     return this.add(root).ln();
  }

  Quarternion.prototype.atanh = funcion() {
    /*
     * calculating using formula: 
     *
     * atanh(q) = ln[ (x+1)/(1-x)]/2
     */
    var fraction = this.add(1,0,0,0).divide(new Quarternion(1,0,0,0).subtract(this));
    return function.ln().divide(2,0,0,0);
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

   Quarternion.prototype.acosech = function() {
    return this.asinh(this.reciprocal());
   }

   Quarternion.prototype.asech = function() {
    return this.acosh(this.reciprocal());
   }

   Quarternion.prototype.acoth = function() {
    return this.atan(this.reciprocal());
   }

   //vector a matrix related functions 
   Quarternion.prototype.toVector3 = function() {
    return [this.i, this.j, this.k];
   }

   Quarternion.prototype.toVector4 = function() {
    return [this.r, this.i, this.j, this.k];
   }

   Quarternion.prototype.to2x2Matrix = function() {
    return [
      [new Complex(this.r, this.i), new Complex(this.j, this.k)],
      [new Complex(-this.j,this.k), new Complex(this.r, -this.i)]
    ];
   }

   Quarternion.prototype.to4x4Matrix = function() {
    return [
      [this.r, this.i, this.j, this.k],
      [-this.i, this.r, -this.k, this.j],
      [-this.j, this.k, this.r, -this.i],
      [-this.k, -this.j, this.i, this.r]
    ];
   }

	return Quarternion;
}

exports.name = "Quarternion";
exports.factory = factory;


/*
*
*
*
*/
