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
        assert.equal(cssRules.length, 4);
        
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

    it('detect new nodes with custom animation names', function(done) {

      // add css rule
      var styleEl = document.createElement('style');
      document.head.appendChild(styleEl);
      var sheet = styleEl.sheet;
      sheet.insertRule(
        '.my-div2{animation-duration:0.0001s;animation-name:node-inserted2;}',
        sheet.cssRules.length)

      sheet.insertRule(
        '@keyframes node-inserted2 {from{transform:none;}to{transform:none;}}',
        sheet.cssRules.length)

      // add watch
      sentinel.on('.my-div2', function(el) {
        assert.equal(el.className, 'my-div2');

        assert.ok(getComputedStyle(el).animationName.indexOf('node-inserted2') >= 0);

        document.head.removeChild(styleEl);

        done();
      });

      // add element to dom
      testEl.className = 'my-div2';
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
      assert.equal(cssRules.length, 2);
    });


    it('removes all callbacks when second argument is undefined', function() {
      sentinel.on('.test-div', function(){});
      sentinel.on('.test-div', function(){});

      var cssRules = getSentinelStyleEl().sheet.cssRules;

      assert.equal(cssRules.length, 2);
      sentinel.off('.test-div');
      assert.equal(cssRules.length, 2);
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
      assert.equal(cssRules.length, 3);

      // when queue is empty css rules will be removed
      sentinel.off('!node-inserted', fn2);
      assert.equal(cssRules.length, 2);
    });
  });
});
