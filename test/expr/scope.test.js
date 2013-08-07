// test Scope
var assert = require('assert'),
    approx = require('../../tools/approx.js'),
    math = require('../../src/index.js'),
    Scope = math.expr.Scope;

describe('Scope', function() {

  describe('get', function() {

    var scope1 = new Scope();
    var scope2 = new Scope(scope1);
    var symbols3 = {myvar: 3};
    var scope3 = new Scope(scope2, symbols3);

    it('should get variables in the scope', function () {
      assert.equal(scope1.get('sin'), math.sin);
      assert.equal(scope3.get('sin'), math.sin);
      assert.equal(scope3.get('myvar'), 3);
      assert.equal(scope2.get('myvar'), undefined);
      assert.equal(scope1.get('myvar'), undefined);
    })

    it('should support subscopes', function() {
      var value5 = {
        'aaa': 'bbb'
      };
      var scope5 = new Scope();
      scope5.set('value5', value5);
      var sub5 = scope5.createSubScope();
      assert.equal(scope5.get('value5'), value5);
      assert.equal(sub5.get('value5'), value5);
      sub5.set('subValue5', 5);
      assert.equal(scope5.get('subValue5'), undefined);
      assert.equal(sub5.get('subValue5'), 5);
    })
  })

  describe('set', function() {

    var scope1 = new Scope();
    var scope2 = new Scope(scope1);
    var symbols3 = {myvar: 3};
    var scope3 = new Scope(scope2, symbols3);

    it('should set variables in the scope', function() {
      scope3.set('d', 4);
      assert.equal(scope3.get('d'), 4);
      assert.equal(symbols3['d'], 4);
      assert.equal(scope2.get('d'), undefined);

      symbols3['pi'] = 3;
      assert.equal(scope3.get('pi'), 3);
      approx.equal(scope2.get('pi'), Math.PI);
      approx.equal(scope1.get('pi'), Math.PI);
    })

  })

  describe('clear', function() {

    it('should restore the constants', function() {
      var symbols4 = {e: 5};
      var scope4 = new Scope(symbols4);
      assert.equal(scope4.get('myvar'), undefined);
      assert.equal(scope4.get('e'), 5);
      scope4.clear();
      approx.equal(scope4.get('e'), Math.E);
      assert.equal(symbols4['e'], undefined);
    })

    it('should clear a scope and its subscopes', function() {
      var value5 = {
        'aaa': 'bbb'
      };
      var scope5 = new Scope();
      scope5.set('value5', value5);
      var sub5 = scope5.createSubScope();
      sub5.set('subValue5', 5);

      scope5.clear();
      assert.equal(scope5.get('value5'), undefined);
      assert.equal(sub5.get('value5'), undefined);
      assert.equal(scope5.get('subValue5'), undefined);
      assert.equal(sub5.get('subValue5'), undefined);
    });

  })

  describe('remove', function() {

    it('should remove variables', function () {
      var symbols6 = {
        aa: 'aa',
        bb: 'bb',
        cc: 'cc'
      };
      var scope6 = new Scope(symbols6);
      assert.equal(scope6.get('aa'), 'aa');
      assert.equal(scope6.get('bb'), 'bb');
      assert.equal(scope6.get('cc'), 'cc');
      scope6.remove('bb');
      assert.equal(scope6.get('aa'), 'aa');
      assert.equal(scope6.get('bb'), undefined);
      assert.equal(scope6.get('cc'), 'cc');
      assert.deepEqual(symbols6, {
        aa: 'aa',
        cc: 'cc'
      });
    })

  })


  describe('clearCache', function() {

    it('should clear cached variables', function() {
      var scope7 = new Scope();
      scope7.set('a', 123);
      assert.equal(scope7.get('a'), 123);
      var scope8 = new Scope(scope7);
      assert.equal(scope8.get('a'), 123);
      // 'a' is now in the cache of scope8, refering to scope7
      scope8.parentScope = null;                  // remove scope7 as parent
      assert.equal(scope8.get('a'), 123);         // whoops! still in the cache
      scope8.clearCache();                        // clear the cache of scope8
      assert.equal(scope8.get('a'), undefined);   // ah, that's better
    })
  })

})