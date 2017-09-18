# SentinelJS

<img src="https://www.muicss.com/static/images/sentinel.svg" width="250px">

SentinelJS is a tiny JS library that lets you detect new DOM nodes using CSS selectors (682 bytes).

## Introduction

SentinelJS is a tiny JS library that makes it easy to set up watch functions that will notify you anytime a new node is added to the DOM. Using SentinelJS you can create a custom element-like experience where you can define interactive components using pure HTML.

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
on(cssSelectors, callbackFn)

 * cssSelectors {Array or String} - A single selector string or an array
 * callbackFn {Function} - The callback function
```

Use the `on()` method to set up a watch for new DOM nodes:
 
```javascript
sentinel.on(['.my-div1', '.my-div2'], function(el) {
  // add an input box
  var inputEl = document.createElement('input');
  el.appendChild(inputEl);
});
```

You can also use single css selector strings:

```javascript
sentinel.on('.my-div', function(el) {
  // add an input box
  var inputEl = document.createElement('input');
  el.appendChild(inputEl);
});
```

#### off() - Remove a watch or a callback

```
off(cssSelectors[, callbackFn])

 * cssSelectors {Array or String} - A single selector string or an array
 * callbackFn {Function} - The callback function you want to remove the watch for (optional)
```

Use the `off()` method to remove a watch callback:
 
```javascript
function callbackFn() {
  // add an input box
  var inputEl = document.createElement('input');
  el.appendChild(inputEl);
}

// add listener
sentinel.on('.my-div', callbackFn);

// remove listener
sentinel.off('.my-div', callbackFn);
```

To remove all callbacks you can leave the `callbackFn` argument blank:
```javascript
// add multiple callbacks
sentinel.on('.my-div', function fn1(el) {});
sentinel.on('.my-div', function fn2(el) {});

// remove all callbacks
sentinel.off('.my-div');
```

#### reset() - Remove all watches and callback

The `reset()` method will remove all watches and callbacks from the sentinel library:

```javascript
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
