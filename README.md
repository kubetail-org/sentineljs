# SentinelJS

<img src="https://www.muicss.com/static/images/sentinel.svg" width="250px">

SentinelJS is a tiny JavaScript library that lets you detect new DOM nodes using CSS selectors (682 bytes).

## Introduction

SentinelJS is a tiny JavaScript library that makes it easy to set up a watch function that will notify you anytime a new node is added to the DOM that matches a given CSS rule. Among other things, you can take advantage of this to implement custom-elements and make other in-place modifications to new DOM elements:

```html
<script>
  sentinel.on('custom-element', function(el) {
    // A new <custom-element> has been detected
    el.innerHTML = 'The sentinel is always watching.';
  });
</script>
<custom-element></custom-element>
```

The latest version of SentinelJS can be found in the `dist/` directory in this repository:
 * [sentinel.js](https://raw.githubusercontent.com/muicss/sentineljs/master/dist/sentinel.js)
 * [sentinel.min.js](https://raw.githubusercontent.com/muicss/sentineljs/master/dist/sentinel.min.js)

You can also use it as a CJS or AMD module:

```bash
$ npm install --save sentinel-js
```

```javascript
var sentinel = require('sentinel-js');

sentinel.on('custom-element', function(el) {
  // A new <custom-element> has been detected
  el.innerHTML = 'The sentinel is always watching.';
});
```

SentinelJS is 682 bytes (minified + gzipped).

## Quickstart

```html
<!doctype html>
<html>
  <head>
    <script src="//cdn.rawgit.com/muicss/sentineljs/0.0.1/dist/sentinel.min.js"></script>
    <script>
      // use the `sentinel` global object
      sentinel.on('.my-div', function(el) {
        el.innerHTML = 'The sentinel is always watching.';
      });

      // add a new div to the DOM
      function addDiv() {
        var newEl = document.createElement('div');
        newEl.className = 'my-div';
        document.body.appendChild(newEl);
      };
    </script>
  </head>
  <body>
    <button onclick="addDiv();">Add another DIV</button>
    <div class="my-div"></div>
  </body>
</html>
```

[View Demo &raquo;](https://jsfiddle.net/muicss/rbqLbjzf/)

## Browser Support

 * IE10+
 * Opera 12+
 * Safari 5+
 * Chrome
 * Firefox
 * iOS 6+
 * Android 4.4+
 
## Documentation

### API

#### on() - Add a watch for new DOM nodes

```
on(cssSelectors, callbackFn[, extraAnimation])

  * cssSelectors {Array or String} - A single selector string or an array
  * callbackFn {Function} - The callback function
  * extraAnimation {String} - Trigger extra animations (e.g. "anim1, anim2") (optional)

Examples:

1. Set up a watch for a single CSS selector:

   sentinel.on('.my-div', function(el) {
     // add an input box
     var inputEl = document.createElement('input');
     el.appendChild(inputEl);
   });
  
2. Set up a watch for multiple CSS selectors:
 
   sentinel.on(['.my-div1', '.my-div2'], function(el) {
     // add an input box
     var inputEl = document.createElement('input');
     el.appendChild(inputEl);
   });

3. Trigger extra animations:
  
   sentinel.on('.my-div', function(el) {
     // add an input box
     var inputEl = document.createElement('input');
     el.appendChild(inputEl);
   }, 'anim1, anim2');
```

#### off() - Remove a watch or a callback

```
off(cssSelectors[, callbackFn])

  * cssSelectors {Array or String} - A single selector string or an array
  * callbackFn {Function} - The callback function you want to remove the watch for (optional)

Examples:

1. Remove a callback:
 
   function myCallback(el) { /* do something awesome */ }

   // add listener
   sentinel.on('.my-div', myCallback);

   // remove listener
   sentinel.off('.my-div', myCallback);

2. Remove a watch:

   // add multiple callbacks
   sentinel.on('.my-div', function fn1(el) {});
   sentinel.on('.my-div', function fn2(el) {});

   // remove all callbacks
   sentinel.off('.my-div');
```

#### reset() - Remove all watches and callbacks

```
reset()

Examples:

1. Remove all watches and callbacks from the sentinel library:

   // add multiple callbacks
   sentinel.on('.my-div1', function fn1(el) {});
   sentinel.on('.my-div2', function fn2(el) {});

   // remove all watches and callbacks
   sentinel.reset();
```

### Async Loading

To make it easy to use SentinelJS asynchronously, the library dispatches a `sentinel-load` event that will notify you when the library is ready to be used:

```html
<!doctype html>
<html>
  <head>
    <script src="//cdn.rawgit.com/muicss/sentineljs/0.0.1/dist/sentinel.min.js" async></script>
    <script>
      // use the `sentinel-load` event to detect load time
      document.addEventListener('sentinel-load', function() {
        // now the `sentinel` global object is available
        sentinel.on('.my-div', function(el) {
          el.innerHTML = 'The sentinel is always watching.';
        });
      });
    </script>
  </head>
  <body>
    <div class="my-div"></div>
  </body>
</html>
```

Icons made by [Freepik](http://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
