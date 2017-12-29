/**
 * @overview XFH5
 *
 * =============================================================================
 *  前端测试机
 * =============================================================================
 *
 *  说明:
 *    模拟 后台服务 和 微信 JSSDK
 *
 *  原理:
 *    1.根据 请求 URL 配置 对应的 数据 或 处理函数
 *    2.劫持 window.wx 对象模拟微信JSSDK
 *    3.劫持 $.ajax 方法模拟请求
 *
 *  使用:
 *    1.在 URL 的 QueryString 中添加 test 参数
 *      例: http://wx.xfxg.cn/devi/xfxg?test
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2014-08-29
 * @version 1.1.2
 *
 * @update 2015-02-02 dondevi
 * @update 2015-02-14 dondevi
 *   1.使用?test参数作为测试机开关
 *   2.更改 window.CONFIG.preview
 *   3.添加证照库的数据
 *   4.跟随 core.js 接口变动更改相应代码
 * @update 2015-03-12 dondevi
 *   1.添加文档注释
 *   2.重构data部分
 * @update 2016-01-16 dondevi
 *   1.分离为独立模块
 * @update 2016-05-12 dondevi
 *   1.Refactor
 * @update 2016-10-20 dondevi
 *   1.Upgrade: function "mapDatas" add param "urls"
 * @update 2017-05-23 dondevi
 *   1.Refactor
 *   2.Remove fillForms
 *   3.Add $.mock
 *
 */


// Toggle Test
$.mock = $.test = { init: init };

/**
 * 初始化测试机
 * @param {Object} config - 测试数据
 * @param {Object} config.urls  - 提交地址集合
 * @param {Object} config.ajax  - 假数据集合
 * @param {Object} config.jssdk - 模拟 JSSDK 方法
 */
function init (config, isFocus) {
  if (!/[\?&]test\b/i.test(window.location.search) && !isFocus) {
    return;
  }
  emulateJSSDK(config.jssdk);
  emulateAJAX(config.urls, config.ajax);
}





/**
 * ---------------------------------------------------------------------------
 *  Core Logics
 * ---------------------------------------------------------------------------
 */

/**
 * Emulate Wechat JSSDK
 * @param {Object} apis - 劫持函数集合
 */
function emulateJSSDK (apis) {
  var isMobile = 1 !== window.navigator.maxTouchPoints
  var isWechat = /MicroMessenger/i.test(window.navigator.userAgent);
  window.wx = window.wx || {};
  for (var api in apis) {
    if (isMobile && isWechat && /choseImage/.test(api) && window === window.top) {
    } else {
      window.wx[api] = apis[api];
    }
  }
}

/**
 * Emulate AJAX
 * @param {Object} urls  - 提交地址
 * @param {Object} datas - 模拟数据集合
 */
$.originAJAX = $.ajax;
function emulateAJAX (urls, datas) {
  if (!urls) { return; }
  datas = mapDatas(urls, datas);
  if (!datas) { return; }
  $.ajax = fakeAJAX.bind($, datas);
}





/**
 * ---------------------------------------------------------------------------
 *  Util Funcions
 * ---------------------------------------------------------------------------
 */

/**
 * 模拟 AJAX 响应
 * @param  {Function} datas     - 模拟数据集合
 * @param  {string}   url       - 提交地址
 * @param  {Object}   settings  - 提交设置
 * @return {Object}             - Promise 对象
 */
function fakeAJAX (datas, url, settings) {

  var options = {
    delay: 300
  };

  var param = getParam(settings["data"]);
  var respond = getData(url, param, datas);

  if (undefined === respond) {
    return $.originAJAX(url, settings);
  }

  var json = {
    error: false, success: true, data: respond,
    exception: { message: "(模拟系统内部错误)" }
  };

  var deferred = $.deferred();
  deferred.promise.done(settings["success"]);

  window.setTimeout(function () {
    var resolve = deferred.resolve.done(json);
    resolve.success && resolve.success(json.data);
    resolve.always();
  }, options.delay);

  return deferred.promise;

};





/**
 * 转换假数据集合
 * { key: url } + { key: data } => { url: data }
 * @param {Object} urls  - 网址集合
 * @param {Object} datas - 假数据集合
 * @return {Object}
 */
function mapDatas (urls, datas) {
  if (!urls || !datas) { return null; }
  var result = {};
  for (var key in datas) {
    result[urls[key]] = datas[key];
  }
  return result;
};

/**
 * 获取请求参数
 * @param {Object} request - 请求数据
 */
function getParam (request) {
  var isJSON = /^\{.*\}$/.test(request);
  if (isJSON) {
    request = JSON.parse(request);
    // SCCRJ: { "liveTime": 0, "param": "{...}" }
    return request.param || request;
  }
  request = $.util.deparam(request);
  try {
    // XFXG: dcode=0&param="{...}"
    return JSON.parse(request.param);
  } catch (exception) {
    // BZT: a=1&b=2&c=3...
    return request;
  }
}

/**
 * 获取假数据
 * @param {string} url   - 网址
 * @param {Object} param - 请求参数
 * @param {Object} datas - 假数据集合
 * @return {Object}
 */
function getData (url, param, datas) {
  var data = datas[url];
  if ("function" === typeof data) {
    data = data(param, options);
  }
  return data;
}

