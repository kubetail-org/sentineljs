/**
 * Sentinel Library
 * A library that uses CSS animations to detect when DOM elements are added to the DOM.
 */

// --- Internal State (Shared across all exports) ---
const isArray = Array.isArray;
let selectorToAnimationMap = {};
let animationCallbacks = {};
let styleEl = null;
let styleSheet = null;
let cssRules = null;

/**
 * Add a watcher for specific CSS selectors.
 * @param {string | string[]} cssSelectors - A single selector string or an array of selector strings to watch.
 * @param {function(HTMLElement): void} callback - The function to call when an element is detected.
 */
export const on = function(cssSelectors, callback) {
  if (!callback) return;

  // Initialize the style element and listener only once
  if (!styleEl) {
    const doc = document;
    const head = doc.head;

    // 1. Add animationstart event listener
    doc.addEventListener('animationstart', function(ev) {
      const callbacks = animationCallbacks[ev.animationName];

      if (!callbacks) return;

      // Trigger all callbacks associated with this selector
      callbacks.forEach(fn => fn(ev.target));
    }, true);

    // 2. Inject the stylesheet
    styleEl = doc.getElementById("sentinel-css");
    if (!styleEl) {
      styleEl = doc.createElement('style');
      styleEl.id = "sentinel-css";
      head.insertBefore(styleEl, head.firstChild);
    }
    styleSheet = styleEl.sheet;
    cssRules = styleSheet.cssRules;
  }

  const selectors = isArray(cssSelectors) ? cssSelectors : [cssSelectors];

  selectors.forEach(function(selector) {
    let animId = selectorToAnimationMap[selector];

    if (!animId) {
      const isCustomName = selector[0] === '!';

      // Create a unique animation name if one wasn't provided
      animId = isCustomName ? selector.slice(1) : 'sentinel-' + Math.random().toString(16).slice(2);

      // Cache the mapping
      selectorToAnimationMap[selector] = animId;

      // 3. Add the Keyframes Rule
      const keyframeIndex = styleSheet.insertRule("@keyframes " + animId + " {from{transform:none;}to{transform:none;}}", cssRules.length);
      cssRules[keyframeIndex]._id = selector;

      // 4. Add the Selector Rule
      if (!isCustomName) {
        const ruleIndex = styleSheet.insertRule(selector + " { animation-duration: 0.0001s; animation-name: " + animId + "; }", cssRules.length);
        cssRules[ruleIndex]._id = selector;
      }
    }

    // Register the callback
    if (!animationCallbacks[animId]) {
      animationCallbacks[animId] = [];
    }
    animationCallbacks[animId].push(callback);
  });
};

/**
 * Remove a watcher for specific CSS selectors.
 * @param {string | string[]} cssSelectors - The selector(s) to stop watching.
 * @param {function(HTMLElement): void} [callback] - The specific callback to remove.
 */
export const off = function(cssSelectors, callback) {
  const selectors = isArray(cssSelectors) ? cssSelectors : [cssSelectors];

  selectors.forEach(function(selector) {
    const animId = selectorToAnimationMap[selector];
    if (!animId) return;
    const callbackList = animationCallbacks[animId];
    if (!callbackList) return;

    // Remove specific callback or clear all
    if (callback) {
      const index = callbackList.indexOf(callback);
      if (index !== -1) callbackList.splice(index, 1);
    } else {
      callbackList.length = 0;
    }

    // If callbacks remain, keep the CSS rules alive so other listeners work
    if (callbackList.length > 0) return;

    // --- Cleanup ---
    for (let i = cssRules.length - 1; i >= 0; i--) {
      if (cssRules[i]._id === selector) {
        styleSheet.deleteRule(i);
      }
    }
    delete selectorToAnimationMap[selector];
    delete animationCallbacks[animId];
  });
};

/**
 * Reset the library state.
 * Useful for unit testing or SPA navigation cleanup.
 */
export const reset = function() {
  selectorToAnimationMap = {};
  animationCallbacks = {};
  if (styleEl && styleEl.parentNode) {
    styleEl.parentNode.removeChild(styleEl);
  }
  styleEl = null;
  styleSheet = null;
  cssRules = null;
};

// --- Export Definitions ---

// 1. Create the default object (for `import sentinel from 'sentinel-js'`)
const sentinel = {
  on,
  off,
  reset
};

// 2. Legacy Browser Support (window.sentinel)
if (typeof window !== 'undefined') {
  window.sentinel = sentinel;

  // Dispatch the legacy load event
  let ev;
  if (typeof window.CustomEvent === 'function') {
      ev = new CustomEvent('sentinel-load');
  } else {
      ev = document.createEvent('HTMLEvents');
      ev.initEvent('sentinel-load', false, false);
  }
  document.dispatchEvent(ev);
}

// 3. Default Export
export default sentinel;