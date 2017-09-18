# SentinelJS

<img src="https://www.muicss.com/static/images/sentinel.svg" width="250px">

SentinelJS is a tiny JS library that lets you detect new DOM nodes using CSS selectors (682 bytes).

## Introduction

SentinelJS is a tiny JS library that makes it easier to set up watch functions that will notify you anytime a new DOM node is added that satisfies a CSS selector rule.

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

#### off(cssSelectors[, callbackFn])

#### reset()

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
