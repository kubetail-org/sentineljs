'use strict';

var touchedClass = 'hkjs--touched',  // hasn't lost focus yet
    untouchedClass = 'hkjs--untouched',
    pristineClass = 'hkjs--pristine',  // user hasn't interacted yet
    dirtyClass = 'hkjs--dirty',
    emptyClass = 'hkjs--empty',  // control is empty
    notEmptyClass = 'hkjs--not-empty',
    inputTypeRegex = /radio|checkbox/i;


/**
 * Initialize input element.
 * @param {Element} controlEl - The control element.
 */
function initialize(controlEl) {
  // check element type
  if (inputTypeRegex.test(controlEl.type)) return;

  // check flag
  if (controlEl._hkjs == true) return;
  controlEl._hkjs = true;

  // add initial `empty/not-empty`
  inputHandler(null, controlEl);

  // add `pristine` if not pre-seeded with `dirty`
  if (!hasClass(controlEl, dirtyClass)) addClass(controlEl, pristineClass);

  // add `untouched` if not pre-seeded with `touched`
  if (!hasClass(controlEl, touchedClass)) addClass(controlEl, untouchedClass);

  // replace `untouched` with `touched` when control loses focus
  on(controlEl, 'blur', function blurHandler() {
    // ignore if event is a window blur
    if (document.activeElement === controlEl) return;

    // replace class and remove event handler
    removeClass(controlEl, untouchedClass);
    addClass(controlEl, touchedClass);
    off(controlEl, 'blur', blurHandler);
  });

  // replace `pristine` with `dirty` when user interacts with control
  one(controlEl, 'input change', function() {
    removeClass(controlEl, pristineClass);
    addClass(controlEl, dirtyClass);
  });

  // add change handler
  on(controlEl, 'input change', inputHandler);
}


/**
 * Handle input events.
 */
function inputHandler(ev, el) {
  var controlEl = el || ev.target,
      value = controlEl.value || {};  // in case value is null

  if (value.length) {
    removeClass(controlEl, emptyClass);
    addClass(controlEl, notEmptyClass);
  } else {
    removeClass(controlEl, notEmptyClass);
    addClass(controlEl, emptyClass);
  }
}


/**
 * Add a class to an element.
 * @param {Element} element - The DOM element.
 * @param {string} cssClasses - Space separated list of class names.
 */
function addClass(element, cssClasses) {
  var existingClasses = getExistingClasses(element),
      splitClasses = cssClasses.split(' '),
      cssClass;

  for (var i=0; i < splitClasses.length; i++) {
    cssClass = splitClasses[i].trim();
    if (existingClasses.indexOf(' ' + cssClass + ' ') == -1) {
      existingClasses += cssClass + ' ';
    }
  }

  element.setAttribute('class', existingClasses.trim());
}


/**
 * Remove classes from a DOM element
 * @param {Element} element - The DOM element.
 * @param {string} cssClasses - Space separated list of class names.
 */
function removeClass(element, cssClasses) {
  var existingClasses = getExistingClasses(element),
      splitClasses = cssClasses.split(' '),
      cssClass;

  for (var i=0; i < splitClasses.length; i++) {
    cssClass = splitClasses[i].trim();
    while (existingClasses.indexOf(' ' + cssClass + ' ') >= 0) {
      existingClasses = existingClasses.replace(' ' + cssClass + ' ', ' ');
    }
  }

  element.setAttribute('class', existingClasses.trim());
}


/**
 * Check if element has class.
 * @param {Element} element - The DOM element.
 * @param {string} cls - The class name string.
 */
function hasClass(element, cls) {
  return (getExistingClasses(element).indexOf(' ' + cls + ' ') > -1);
}


/**
 * Get existing classes from element.
 * @param {Element} element - The DOM element.
 */
function getExistingClasses(element) {
  var classes = (element.getAttribute('class') || '').replace(/[\n\t]/g, '');
  return ' ' + classes + ' ';
}


/**
 * Add event listener
 * @param {Element} element - The DOM element.
 * @param {string} events - Space separated names.
 * @param {Function} callback - The callback function.
 * @param {Boolean} useCapture - Use capture flag.
 */
function on(element, events, callback, useCapture) {
  useCapture = (useCapture == undefined) ? false : useCapture;

  events.split(' ').map(function(event) {
    element.addEventListener(event, callback, useCapture);
  });
}


/**
 * Remove event listener
 * @param {Element} element - The DOM element.
 * @param {string} events - Space separated names.
 * @param {Function} callback - The callback function.
 * @param {Boolean} useCapture - Use capture flag.
 */
function off(element, events, callback, useCapture) {
  useCapture = (useCapture == undefined) ? false : useCapture;

  events.split(' ').map(function(event) {
    element.removeEventListener(event, callback, useCapture);
  });
}


/**
 * Add event listener
 * @param {Element} element - The DOM element.
 * @param {string} events - Space separated names.
 * @param {Function} callback - The callback function.
 */
function one(element, events, callback, useCapture) {
  useCapture = (useCapture == undefined) ? false : useCapture;

  events.split(' ').map(function(event) {
    on(element, event, function onFn(ev) {
      // execute callback
      if (callback) callback.apply(this, arguments);

      // remove wrapper
      off(element, event, onFn, useCapture);
    }, useCapture);
  });
}


// singleton object
var hkjs = {};


/**
 * Initialize library.
 * @param {Element} controlEl - An input or textarea element (optional)
 */
hkjs.init = function init(controlEl) {
  // initialize and exit if controlEl is defined
  if (controlEl) return initialize(controlEl);

  var doc = document;

  // check flag
  if (doc._hkjs == true) return;
  doc._hkjs = true;

  // otherwise, initialize all elements
  var cssRule = 'input:not([type="radio"]):not([type="checkbox"]),textarea',
      elList = doc.querySelectorAll(cssRule),
      i = elList.length;
  while (i--) initialize(elList[i]);

  // add CSS detector
  var cssText = '@keyframes hkjs-node-inserted';
  cssText += '{from{transform:none;}to{transform:none;}}';
  cssText += cssRule;
  cssText += '{animation-duration:0.0001s;animation-name:hkjs-node-inserted;}';

  var e = doc.createElement('style');
  e.type = 'text/css';

  if (e.styleSheet) e.styleSheet.cssText = cssText;
  else e.appendChild(doc.createTextNode(cssText));

  // add to document
  var head = doc.head;
  head.insertBefore(e, head.firstChild);

  // add event listener
  var animEvs = 'animationstart mozAnimationStart webkitAnimationStart';
  on(doc, animEvs, function(ev) {
    // check event name
    if (ev.animationName != 'hkjs-node-inserted') return;

    // stop other callbacks
    ev.stopImmediatePropagation();

    // initialize element
    initialize(ev.target);
  }, true);
};


// export
return hkjs;
