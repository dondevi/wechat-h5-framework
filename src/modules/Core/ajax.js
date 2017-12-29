/**
 * @overview 核心库
 *
 * =============================================================================
 *  Core AJAX 异步通信
 * =============================================================================
 *
 *  说明:
 *    1.参考 jQuery API 的设计, 实现 AJAX 功能
 *
 *  API:
 *    1.核心方法:
 *      1. $.ajax(url, [settings]);
 *      2. $.get(url, [data], [callback]);
 *      3. $.post(url, [data], [callback]);
 *      4. $.ajaxSetup(settings);
 *    2.Promise callback:
 *      1. done: 处理成功
 *      2. fail: 处理失败
 *      3. always: 处理完毕 (成功或失败都执行)
 *         例: $.post(url, data).done(callback).fail(callback).always(callback);
 *
 * =============================================================================
 *
 * @requires ./core.js
 *
 * @author dondevi
 * @create 2015-11-13
 * @version 1.2.0
 * @todo Rebuild to Fecth API
 *
 * @update 2016-10-10 dondevi
 *   1.Update: Promise chain callbacks
 * @update 2016-10-14 dondevi
 *   1.Update: ajax fail progress
 * @update 2016-12-05 dondevi
 *   1.Update: defaults, headers
 * @update 2016-12-28 dondevi
 *   1.Update: response content type
 */

/**
 * ---------------------------------------------------------------------------
 *  Exports
 * ---------------------------------------------------------------------------
 * @global
 */
$.ajax = ajax;
$.get  = get;
$.post = post;
// $.ajaxSetup = setupDefaults;





/**
 * ---------------------------------------------------------------------------
 *  Variable
 * ---------------------------------------------------------------------------
 */

/**
 * 默认请求参数
 * @type {Object}
 * @private
 */
var _defaults = {
  type:    "GET",   // 提交类型
  timeout: 180000,  // 超时时间
  headers: {        // 头部信息
    "Content-Type":     "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest"
  }
};





/**
 * ---------------------------------------------------------------------------
 *  AJAX
 * ---------------------------------------------------------------------------
 */

// /**
//  * 设置请求参数的默认值
//  * @param  {Object} settings 自定义参数
//  * @memberOf $
//  */
// function setupDefaults (settings) {
//   for (var key in settings) {
//     if (_defaults[key]) {
//       _defaults[key] = settings[key];
//     }
//   }
// };

/**
 * GET 方法
 * @param  {string}   url      - 地址
 * @param  {*}        data     - 数据
 * @param  {Function} handler  - 处理函数
 * @param  {Object}   settings - 设置
 * @return {Object}            - Promise 对象
 * @memberOf $
 */
function get (url, data, handler) {
  if ("function" === typeof data) {
    handler = data;
  } else if ("object" === typeof data) {
    url += "?" + param(data);
  }
  return $.ajax(url, {
    type: "GET",
    success: handler
  });
};





/**
 * POST 方法
 * @param  {string}   url      - 地址
 * @param  {*}        data     - 数据
 * @param  {Function} handler  - 处理函数
 * @param  {Object}   settings - 设置
 * @return {Object}            - Promise 对象
 * @memberOf $
 */
function post (url, data, handler, settings) {
  if ("object" === typeof data) {
    data = param(data);
  }
  settings = settings || {};
  settings["type"]    = "POST";
  settings["data"]    = data;
  settings["success"] = handler;
  return $.ajax(url, settings);
}





/**
 * 序列化对象为字符串
 * @param  {Object} object - 数据对象
 * @return {string}        - 序列化字符串 (格式: key=value&k2=v2&k3=v3...)
 * @private
 */
function param (object) {
  var result = [];
  for (var key in object) {
    result.push(key + "=" + object[key]);
  }
  return result.join("&");
}





/**
 * ---------------------------------------------------------------------------
 *  AJAX core
 * ---------------------------------------------------------------------------
 */

/**
 * Asynchronous Javascript And XML
 * 执行一个异步的 HTTP 请求
 * @param  {string} url        - 地址
 * @param  {Object} [settings] - 设置
 * @return {Object}            - Deffered 对象
 * @memberOf $
 */
function ajax (url, settings) {

  // 获取请求参数
  var options = getOptions(url, settings);

  // Deffered 对象, 用于延迟执行代码
  var deffered = { dones: [options.success], fails: [], alwayses: [] };
  // Promise 对象, 对 Deffered 对象进行设置的 API
  var promise = {
    done:   callback => { deffered.dones.push(callback); return promise; },
    fail:   callback => { deffered.fails.push(callback); return promise; },
    always: callback => { deffered.alwayses.push(callback); return promise; }
  };

  if (!options["url"]) {
    window.setTimeout(() => {
      deffered.alwayses.forEach(always => {
        always && always();
      });
    });
    return promise;
  }

  // XHR 对象
  try {
    var xhr = new XMLHttpRequest();
  } catch (e) {
    var xhr = new ActiveXObject("Msxml2.XMLHTTP");
  }

  // 连接状态事件
  xhr.onreadystatechange = event => {
    if (4 === xhr.readyState) {
      // 处理响应
      response(xhr, deffered);
    }
  };

  // 执行完毕事件
  xhr.onload = event => {
    deffered.alwayses.forEach(always => {
      always && always(event);
    });
  };

  // 发送请求
  request(xhr, options);

  return promise;
}





/**
 * 获取最终的请求参数
 * @param  {string}  url        - 提交地址或自定义参数
 * @param  {Object?} [settings] - 自定义参数
 * @return {Object}             - 最终请求参数
 * @since 1.1.0
 * @private
 */
function getOptions (url, settings) {
  // 处理参数顺序
  if ("object" === typeof url) {
    settings = url;
  } else {
    settings["url"] = url;
  }
  if (!settings) {
    settings = { url: url };
  }
  // 地址为空
  if (!settings["url"]) {
    console.error("%c提交地址为空！", "color:red");
  }
  // 填充默认值
  for (var key in _defaults) {
    if (!settings.hasOwnProperty(key)) {
      if ("headers" === key) {
        settings[key] = Object.assign({}, _defaults[key], settings[key]);
      } else {
        settings[key] = _defaults[key];
      }
    }
  }
  return settings;
}





/**
 * 发送请求
 * @param  {Object} xhr     - XMLHttpRequest 对象
 * @param  {Object} options - 请求参数
 * @since 1.1.0
 * @private
 */
function request (xhr, options) {
  xhr.open(options.type, options.url, true);
  if ("POST" === options.type.toUpperCase()) {
    for (var key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }
  }
  xhr.timeout = options.timeout;
  xhr.send(options.data || null);
}





/**
 * 处理响应
 * @callback response
 * @param {Object} xhr      - XMLHttpRequest 对象
 * @param {Object} deffered - Deffered 对象
 * @throws {ReferenceError} - 响应不是JSON格式
 * @exception {net} - 断线
 * @exception {net} - 错误的地址
 * @exception {net} - 跨域 (可能重定向到了微信授权地址)
 * @since 1.1.0
 * @private
 * @update 2016-10-14 dondevi
 */
function response (xhr, deffered) {
  // 处理成功
  if (200 === xhr.status) {
    var response = xhr.responseText;
    var contentType = xhr.getResponseHeader("Content-Type");
    if (/json/.test(contentType)) {
      try {
        response = JSON.parse(response);
      } catch (exception) {
        deffered.fails.forEach(fail => {
          fail && fail(exception);
        });
        throw "Response is not JSON: " + response;
      }
    }
    deffered.dones.forEach(done => {
      done && done(response);
    });
  // 处理失败
  } else {
    var exception = { code: xhr.status, message: "", xhr, isAJAX: true };
    if (/^5\d\d/.test(xhr.status)) {
      exception.message = "服务升级中, 请稍后再试";
    } else if (/^4\d\d/.test(xhr.status)) {
      exception.message = "请求失败: " + exception.code;
    } else {
      // offline/error-url/x-domain
      exception.message = "网络连接失败, 请检查您的网络";
    }
    deffered.fails.forEach(fail => {
      fail && fail(exception);
    });
  }
}
