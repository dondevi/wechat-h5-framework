/**
 * @overview 核心库
 *
 * =============================================================================
 *  Core Prototype 原型方法
 * =============================================================================
 *
 *  说明:
 *    1.参考 jQuery API 的设计, 实现 $.fn 的功能
 *
 *  API:
 *    1. $.fn.eq(index);                  //选择元素
 *    2. $.fn.add(array);                 //添加元素
 *    4. $.fn.hasClass(className);        //判断是否含有某个类名
 *    5. $.fn.addClass(className);        //添加类名
 *    6. $.fn.removeClass(className);     //删除类名
 *    7. $.fn.toggleClass(className);     //切换类名
 *    8. $.fn.find(selector);             //查询后代元素
 *    9. $.fn.closest(selector);          //查询最近的祖先元素
 *
 *  注意:
 *    1.功能有限: 只针对业务需要
 *    2.容错性低: 严格限制使用方式和参数类型
 *
 * =============================================================================
 *
 * @requires ./core.js
 *
 * @author dondevi
 * @create 2015-11-13
 * @version 1.1.3
 * @todo 优化, 重构
 *
 * @update 2015-11-17 dondevi
 *   1.优化 closest
 * @update 2016-08-10 dondevi
 *   2.Fixed Array.prototype.find
 *
 */


"use strict";





/**
 * ---------------------------------------------------------------------------
 *  Exports
 * ---------------------------------------------------------------------------
 */

/**
 * @namespace fn
 */
$.fn = Array.prototype;

/**
 * 选择元素
 * @param  {Number} index - 序号
 * @return {Array}        - 所选元素
 */
$.fn.eq = function (index) {
  return [this[index]];
};

/**
 * 添加元素
 * @param  {?Array} els - 待添加元素
 * @return {Array}      - 添加后的元素集合
 * @since 1.1.2
 */
$.fn.add = function (els) {
  var $els = $(els);
  if ($els[0]) {
    return this.concat($els);
  }
  return this;
};





/**
 * 判断是否含有某个类名
 * @param  {string}  className - 类名
 * @return {Boolean}
 */
$.fn.hasClass = function (className) {
  var result = false;
  if (className) {
    $.each(this, function (i, el) {
      if (hasClass(el, className)) {
        result = true;
      }
    });
  }
  return result;
};

/**
 * 添加类名
 * @param  {string} className - 类名
 * @return {Array}
 */
$.fn.addClass = function (className) {
  if (className) {
    $.each(this, function (i, el) {
      if (!hasClass(el, className)) {
        el.className += " " + className;
      }
    });
  }
  return this;
};

/**
 * 删除类名
 * @param  {string} className - 类名
 * @return {Array}
 */
$.fn.removeClass = function (className) {
  var regx = new RegExp("\\s+" + className, "g");
  $.each(this, function (i, el) {
    if (hasClass(el, className)) {
      el.className = (" " + el.className).replace(regx, "").replace(/^\s+/, "");
    }
  });
  regx = null;
  return this;
};

/**
 * 切换类名
 * @param  {string} className - 类名
 * @return {Array}
 */
$.fn.toggleClass = function (className) {
  var regx = new RegExp("\\s+" + className, "g");
  $.each(this, function (i, el) {
    if (hasClass(el, className)) {
      el.className = (" " + el.className).replace(regx, "").replace(/^\s+/, "");
    } else {
      el.className += " " + className;
    }
  });
  regx = null;
  return this;
};





/**
 * 查询后代元素
 * @param  {string} selector - 选择器
 * @return {Array}
 */
var arrayFind = Array.prototype.find;
$.fn.find = function (selector) {
  if (Array.isArray(this) && "function" === typeof selector) {
    return arrayFind.call(this, selector);
  }
  return $(selector, this);
};

// /**
//  * 判断后代元素是否匹配选择器
//  * @param  {string} selector - 选择器
//  * @return {Array}
//  */
// $.fn.has = function (selector) {
//   var result = false;
//   $.each(this, function (i, el) {
//     if ($(selector, el)[0]) {
//       result = true;
//     }
//   });
//   return result;
// };

// /**
//  * 追加元素
//  * @param  {Object} dom - 元素
//  */
// $.fn.append = function (dom) {
//   var div  = document.createElement("div");
//   var frag = document.createDocumentFragment();
//   div.innerHTML = dom.innerHTML;
//   $.each(div.children, function (i, node) {
//     frag.appendChild(node.cloneNode(true));
//   });
//   container.appendChild(frag);
//   div = frag = null;
// };

/**
 * 查询最近的祖先元素
 * @param  {string} selector - 选择器
 * @return {Array}
 */
$.fn.closest = function (selector) {
  var result = [];
  $.each(this, function (i, el) {
    var cl = closest(el, selector);
    cl && result.push(cl);
  });
  return result;
};





/**
 * ---------------------------------------------------------------------------
 *  Util Function
 * ---------------------------------------------------------------------------
 */

/**
 * 判断元素是否含有某个类名
 * @param  {Object}  el        - 元素
 * @param  {string}  className - 类名
 * @return {Boolean}
 */
function hasClass (el, className) {
  if (-1 < (" " + el.className + " ").indexOf(" " + className + " ")) {
    return true;
  }
}

/**
 * 判断元素是否匹配某个选择器
 * @param  {Object}  el       - 元素
 * @param  {string}  selector - 选择器
 * @return {Boolean}
 * @update 2016-06-24 dondevi
 *   1. Bugfix: /[\[\]]/ to /[\[\]]/g
 */
function is (el, selector) {
  if (/^#(:?\w\-?)*$/.test(selector)) {
    return el.id === selector.substring(1);
  }
  if (/^\.(:?\w\-?)*$/.test(selector)) {
    return hasClass(el, selector.substring(1));
  }
  if (/^\w+$/.test(selector)) {
    return selector === el.nodeName.toLowerCase();
  }
  if (/\[.+\]/.test(selector)) {
    return !!el.getAttribute(selector.replace(/[\[\]]/g, ""));
  }
  if (el.matches) {
    return el.matches(selector);
  }
};

/**
 * 查询最近的祖先元素
 * @param  {Object}  el       - 元素
 * @param  {string}  selector - 选择器
 * @return {Object?}
 * @since 1.1.1
 */
function closest (el, selector) {
  if (el.closest) { // ES5
    return el.closest(selector);
  }
  if (is(el, selector)) {
    return el;
  }
  if ("BODY" === el.nodeName) {
    return false;
  }
  return closest(el.parentNode, selector);
}
