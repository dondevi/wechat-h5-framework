/**
 * @overview 核心库
 *
 * =============================================================================
 *  Core Event 事件
 * =============================================================================
 *
 *  说明:
 *    1.参考 jQuery API 的设计, 实现 $.fn 的功能
 *
 *  API:
 *    1. $.Event(type, [props], [detail]);  // 创建 Event 对象
 *    2. $.fn.on(eventName, handler);       // 绑定事件
 *    3. $.fn.one(eventName, handler);      // 绑定一次性事件
 *    4. $.fn.trigger(eventName, [data]);   // 触发事件
 *
 *  注意:
 *    1.功能有限: 只针对业务需要
 *    2.容错性低: 严格限制使用方式和参数类型
 *
 * =============================================================================
 *
 * @requires ./core.js
 * @version 1.1.1
 * @todo 优化, 重构
 *
 * @author dondevi
 * @create 2015-11-16
 *
 * @update 2017-04-13 dondevi
 *   1.Update: on
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
 * 创建 Event 对象
 * @param  {string} type     - 事件类型
 * @param  {Object} [props]  - 事件属性
 * @param  {*}      [detail] - 附加数据
 * @return {Object}          - Event对象
 * @memberOf $
 */
$.Event = function (type, props, detail) {
  var event = document.createEvent("Events");
  type = emulateTouchIfNeeded(type);
  event.initEvent(type, true, true, detail);
  if (props && "object" === typeof props) {
    for (var key in props) {
      event[key] = props[key];
    }
  }
  event.forwardedTouchEvent = true; // Hack: Fixed FastClick conflict
  return event;
}





/**
 * 绑定事件
 * @param  {string}   type       - 事件类型
 * @param  {String}   delegate   - 委派元素选择器
 * @param  {Function} handler    - 事件处理函数
 * @param  {Boolean}  useCapture - 是否采用捕获模式
 * @return {Array}
 * @update 2016-06-23 dondevi
 *   1.Add "delegate"
 * @update 2017-04-13 dondevi
 *   1.Rebuild
 */
$.fn.on = function (type, delegate, handler, useCapture) {

  if ("function" === typeof delegate) {
    useCapture = !!handler;
    handler = delegate;
  }
  if (!handler) { return this; }

  var hasDelegate = "string" === typeof delegate;
  var eventType = emulateTouchIfNeeded(type);

  $.each(this, function (i, delegateTarget) {
    delegateTarget.addEventListener(eventType, function (event) {
      var currentTarget = delegateTarget;
      if (hasDelegate) {
        currentTarget = $(event.target).closest(delegate)[0];
        event.delegateTarget = delegateTarget;
        Object.defineProperty(event, "currentTarget", { writable: true });
        event.currentTarget  = currentTarget;
      }
      if (!currentTarget) { return true; }
      var res = handler.apply(currentTarget, [event].concat(event._args));
      if (false === res) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, useCapture);
  });

  return this;

};


/**
 * 绑定一次性事件
 * @param  {string}   type      - 事件类型
 * @param  {Function} handler    - 事件处理函数
 * @return {Array}
 */
$.fn.one = function (type, handler) {
  $.each(this, function (i, el) {
    var callback = function (event) {
      handler.apply(el, [event].concat(event._args));
      el.removeEventListener(type, callback, false);
      callback = null;
    };
    el.addEventListener(type, callback, false);
  });
  return this;
};

// /**
//  * 取消绑定事件
//  * @param  {string} type - 事件类型
//  * @return {Array}
//  */
// $.fn.off = function (type) {
//   $.each(this, function (i, el) {
//     el.removeEventListener(type, callback, false);
//   });
//   return this;
// };

/**
 * 触发事件
 * @param  {string} type - 事件类型
 * @param  {Array}  args  - 附加数据
 * @return {Array}
 */
$.fn.trigger = function (type, args) {
  if (type instanceof Event) {
    var event = type;
  } else {
    var event = $.Event(type);
  }
  if ($.isArray(args)) {
    event._args = args;
  }
  event.isTrigger = true;
  $.each(this, function (i, el) {
    el.dispatchEvent(event);
  });
  return this;
};


// 模拟触摸
function emulateTouchIfNeeded (type) {
  if (!('ontouchstart' in window)) {
    type = {
      "touchstart": "mousedown",
      "touchmove": "mousemove",
      "touchend": "mouseup"
    }[type] || type;
  }
  return type;
}
