/**
 * sentineljs tests
 * @module test/tests.js
 */

var assert = chai.assert,
    expect = chai.expect;


describe('SentinelJS tests', function() {
  var testEl = null;


  beforeEach(function() {
    // create test element
    testEl = document.createElement('div');
    testEl.className = 'test-div';
  });


  afterEach(function() {
    // remove element from DOM
    if (testEl.parentNode) testEl.parentNode.removeChild(testEl);

    // reset setinel
    sentinel.reset();
  });


  function getSentinelStyleEl() {
    return document.getElementsByTagName('style')[0];
  }


  describe('on() tests', function() {
    it('detects new nodes', function(done) {
      // add listener
      sentinel.on('.test-div', function(el) {
        assert.equal(testEl, el);
        done();
      });

      // add element to DOM
      document.body.appendChild(testEl);
    });


    it('only adds one rule per selector', function() {
      // add two listeners
      sentinel.on('.test-div', function() {});
      sentinel.on('.test-div', function() {});

      // check CSS rules
      var cssRules = getSentinelStyleEl().sheet.cssRules;
      assert.equal(cssRules.length, 2);
    });


    it('executes callbacks in order', function(done) {
      var args = [];

      function check(s) {
        args.push(s);

        // check order of arguments
        if (args.length == 2) {
          assert.equal(args[0], '1');
          done();
        }
      }

      sentinel.on('.test-div', function() {
        check('1');
      });

      sentinel.on('.test-div', function() {
        check('2');
      });

      document.body.appendChild(testEl);
    });


    it('supports array of CSS selectors', function(done) {
      // create test element
      var testEl2 = document.createElement('div');
      testEl2.className = 'test-div2';

      // add listener
      var classNames = [];
      sentinel.on(['.test-div', '.test-div2'], function(el) {
        classNames.push(el.className);
        if (classNames.length == 2) {
          classNames = classNames.sort();
          assert.equal(classNames[0], 'test-div');
          assert.equal(classNames[1], 'test-div2');
          done();
        }
      });

      // add to dom
      document.body.appendChild(testEl);
      document.body.appendChild(testEl2);
    });


    it('supports custom animation names', function(done) {
      // add watch
      sentinel.on('!node-inserted', function(el) {
        assert.equal(el.className, 'my-div');

        // check CSS rules
        var cssRules = getSentinelStyleEl().sheet.cssRules;
        assert.equal(cssRules.length, 2);
        
        done();
      });

      // add css rule
      var sheet = getSentinelStyleEl().sheet;
      sheet.insertRule(
        '.my-div{animation-duration:0.0001s;animation-name:node-inserted;}',
        sheet.cssRules.length)

      // add element to dom
      testEl.className = 'my-div';
      document.body.appendChild(testEl);
    });


    it('detects elements with visibility:hidden', function(done) {
      testEl.style.visibility = 'hidden';

      // add listener
      sentinel.on('.test-div', function(el) {
        // test element
        assert.equal(testEl, el);

        // verify element is hidden
        var val = getComputedStyle(el).getPropertyValue('visibility');
        assert.equal(val, 'hidden');
        
        done();
      });

      // add element to DOM
      document.body.appendChild(testEl);
    });
  });


  describe('off() tests', function() {
    it('removes individual callbacks', function() {
      function fn1() {}
      function fn2() {}

      sentinel.on('.test-div', fn1);
      sentinel.on('.test-div', fn2);

      var cssRules = getSentinelStyleEl().sheet.cssRules;

      // removing first one will keep css rules
      sentinel.off('.test-div', fn1);
      assert.equal(cssRules.length, 2);

      // when queue is empty css rules will be removed
      sentinel.off('.test-div', fn2);
      assert.equal(cssRules.length, 0);
    });


    it('removes all callbacks when second argument is undefined', function() {
      sentinel.on('.test-div', function(){});
      sentinel.on('.test-div', function(){});

      var cssRules = getSentinelStyleEl().sheet.cssRules;

      assert.equal(cssRules.length, 2);
      sentinel.off('.test-div');
      assert.equal(cssRules.length, 0);
    });


    it('removes custom animation name callbacks', function() {
      function fn1() {}
      function fn2() {}

      // add watch
      sentinel.on('!node-inserted', fn1);
      sentinel.on('!node-inserted', fn2);

      var cssRules = getSentinelStyleEl().sheet.cssRules;

      // removing first one will keep css rules
      sentinel.off('!node-inserted', fn1);
      assert.equal(cssRules.length, 1);

      // when queue is empty css rules will be removed
      sentinel.off('!node-inserted', fn2);
      assert.equal(cssRules.length, 0);
    });
  });
});
