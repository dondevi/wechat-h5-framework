/**
 * @overview 核心库
 *
 * =============================================================================
 *  Storage 本地存储
 * =============================================================================
 *
 *  API:
 *    1. $.session
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-05-23
 *
 */

/**
 * 会话管理
 * @type {Object}
 */
$.session = {
  get (key) {
    var value = window.sessionStorage.getItem(key);
    try {
      return window.JSON.parse(value);
    } catch (e) {
      return null;
    }
  },
  set (key, value) {
    value = window.JSON.stringify(value);
    window.sessionStorage.setItem(key, value);
  },
  assign (key, value) {
    var session = $.session.get(key);
    if ("object" !== typeof session) {
      return console.error(key + " is not an Object");
    }
    var value = Object.assign(session, value);
    $.session.set(key, value);
  },
  remove (key) {
    window.sessionStorage.removeItem(key);
  }
};
