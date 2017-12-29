/**
 * @overview 核心库
 *
 * =============================================================================
 *  Compat - Polyfill 浏览器兼容高级特性
 * =============================================================================
 *
 *  List:
 *    Array.forEach
 *    Array.includes
 *    Object.assign
 *
 *    RadioNodeList.value
 *    RadioNodeList.index
 *    HTMLSelectElement.selectedOptions
 *
 *    window.URL
 *    window.getUserMedia
 *    window.requestAnimationFrame
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2015-11-13
 * @version 1.0.3
 *
 * @update 2017-05-23 dondevi
 *   1.Seperate from Core/compate.js
 *
 */

/**
 * -----------------------------------------------------------------------------
 *  Javascript Core
 * -----------------------------------------------------------------------------
 */

// Array.forEach
if ("function" !== typeof Array.prototype.forEach) {
  Array.prototype.forEach = callback => {
    var item = null;
    for (var index = 0; item = this[index]; index++) {
      callback(item, index);
    }
  };
}

// Array.includes
if ("function" !== typeof Array.prototype.includes) {
  Array.prototype.includes = (searchElement, fromIndex) => {
    return -1 < this.indexOf(searchElement, fromIndex);
  };
}

// Object.assign
if ("function" !== typeof Object.assign) {
  Object.assign = target => {
    if (target === undefined || target === null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source === undefined || source === null) { return; }
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
    return output;
  };
}


/**
 * -----------------------------------------------------------------------------
 *  Javascript DOM
 * -----------------------------------------------------------------------------
 */

if (!window.RadioNodeList) {
  window.RadioNodeList = window.NodeList;
}

// Polyfill: RadioNodeList.value
if (!("value" in RadioNodeList.prototype)) {
  Object.defineProperty(RadioNodeList.prototype, "value", {
    get () {
      for (var i = 0, el = null; el = this[i]; i++) {
        if (el.checked) { return el.value; }
      }
    },
    set (value) {
      for (var i = 0, el = null; el = this[i]; i++) {
        if (!el.checked && el.value === value) {
          el.checked = true;
          break;
        }
      }
    },
    configurable: true
  });
}

// Shim RadioNodeList.index
// Object.defineProperty(RadioNodeList.prototype, "selectedIndex", {
//   get () {
//     for (var i = 0, el = null; el = this[i]; i++) {
//       if (el.checked) { return i; }
//     }
//   },
//   set (index) {
//     for (var i = 0, el = null; el = this[i]; i++) {
//       if (!el.checked && i === index) {
//         el.checked = true;
//         break;
//       }
//     }
//   },
//   configurable: true
// });

/**
 * HTMLSelectElement.selectedOptions For Android
 * @since 1.0.2
 */
if (!("selectedOptions" in HTMLSelectElement.prototype)) {
  Object.defineProperty(HTMLSelectElement.prototype, "selectedOptions", {
    get () {
      var result = [];
      for (var i = 0, el = null; el = this.options[i]; i++) {
        if (el.selected) { result.push(el); }
      }
      return result[0] ? result : undefined;
    }
  });
}



/**
 * -----------------------------------------------------------------------------
 *  Javascript BOM
 * -----------------------------------------------------------------------------
 */

// window.URL
window.URL = window.URL || window.mozURL || window.webkitURL;

// window.getUserMedia
window.navigator.getUserMedia = window.navigator.getUserMedia ||
                                window.navigator.mozGetUserMedia ||
                                window.navigator.webkitGetUserMedia;

// window.requestAnimationFrame
window.requestAnimationFrame = window.requestAnimationFrame ||
                               (callback => callback());
