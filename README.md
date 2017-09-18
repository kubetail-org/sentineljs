# SentinelJS

<img src="https://www.muicss.com/static/images/sentinel.svg" width="250px">

SentinelJS is a tiny JS library that lets you detect new DOM nodes using CSS selectors (682 bytes).

## Introduction

SentinelJS is a tiny JS library that makes it easy to set up watch functions that will notify you anytime a new DOM node is added that satisfies a CSS selector rule. SentinelJS is useful for writing plugins that make modifications when a new DOM node is inserted. This can be useful for creating Shadow DOM-like experience where you can define interactive components using purely HTML.

The latest version of SentinelJS can be found in the `dist/` directory in this repository:
 * [sentinel.js](https://raw.githubusercontent.com/muicss/sentineljs/master/dist/sentinel.js)
 * [sentinel.min.js](https://raw.githubusercontent.com/muicss/sentineljs/master/dist/sentinel.min.js)

You can also use it as a CJS or AMD module:

```bash
$ npm install --save sentinel-js
```

```javascript
var sentinel = require('sentinel-js');

sentinel.on('my-awesome-component', function(el) {
  // add more functionality to the element
  el.innerHTML = 'The sentinel is always watching.';
});
```

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
      });
    </script>
  </head>
  <body>
    <button onclick="addDiv();">Add another DIV</button>
    <div class="my-div"></div>
  </body>
</html>
```

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

#### on(cssSelectors, callbackFn)

Use the `on()` method to set up a watch for new DOM nodes.
 
 * `cssSelectors` - A single selector string or an array
 * `callbackFn` - The callback function

#### off(cssSelectors[, callbackFn])

Use the `off()` method to remove a watch. If `callbackFn` is emtpy, all watches for the given cssSelector will be removed.
 
 * `cssSelectors` - A single selector string or an array
 * `callbackFn` - The callback function you want to remove the watch for (optional)

#### reset()

The `reset()` method will remove all watches and callbacks from the sentinel library.

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
