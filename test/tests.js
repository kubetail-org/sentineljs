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

    // reset setintel
    sentinel.reset();
  });


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
      var cssRules = document.getElementById('sentineljs').sheet.cssRules;
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

    
    it('returns gracefully if callback is null', function() {
      // try to add listener
      sentinel.on('.test-div', null);

      // check CSS rules
      var styleEl = document.getElementById('sentineljs');
      assert.equal(styleEl, null);
    });


    it('supports extra animation callbacks', function() {
      sentinel.on('.test-div', function(){}, 'extra-animation');

      // add animation listener
      var l = ['animationstart', 'mozAnimationStart', 'webkitAnimationStart'];
      l.forEach(function(event) {
        document.addEventListener(event, function tempFn(ev) {
          if (ev.animationName == 'extra-animation') done();
          document.removeEventListener(event, tempFn);
        });
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
  });


  describe('off() tests', function() {
    it('removes individual callbacks', function() {
      function fn1() {}
      function fn2() {}

      sentinel.on('.test-div', fn1);
      sentinel.on('.test-div', fn2);

      var cssRules = document.getElementById('sentineljs').sheet.cssRules;

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

      var cssRules = document.getElementById('sentineljs').sheet.cssRules;

      assert.equal(cssRules.length, 2);
      sentinel.off('.test-div');
      assert.equal(cssRules.length, 0);
    });
  });
});
