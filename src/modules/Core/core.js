/**
 * @overview 核心库
 *
 * =============================================================================
 *  Core 核心逻辑
 * =============================================================================
 *
 *  说明:
 *    1.参考 jQuery API 的设计, 实现 $() 及部分核心功能
 *    2.可用 jQuery 1.7+ 或 Zepto 替代，不过有坑请慎重！
 *
 *  API:
 *    1.选择器/包装器:
 *      1. $(selector);              // 包装所查询的元素集合
 *    2.核心方法:
 *      2. $.isArray(data);          // 判断数据是否数组类型
 *      1. $.inArray(data, array);   // 判断数据是否在数组中
 *      3. $.each(array, handler);   // 遍历数组
 *
 *  注意:
 *    1.包装器返回的是 数组 而不是 类数组
 *      例：$(document.body) 会返回 [document.body]
 *    2.功能有限: 只针对业务需要
 *    3.容错性低: 严格限制使用方式和参数类型
 *    4.兼容性低: 基于 ECMAScript 5
 *      例：Dom: querySelector; Array: forEach, isArray...
 *
 * =============================================================================
 *
 * @required by all others in this framework
 *
 * @author dondevi
 * @create 2014-09-15
 * @version 1.3.3
 *
 * @update 2015-03-20 dondevi
 *   1.添加 $.fn.one
 * @update 2015-04-02 dondevi
 *   1.优化 wrapper 方法：使用 apply、优化正则
 *   2.注释掉 $.support
 * @update 2015-06-19 dondevi
 *   1. $.fn.on 添加参数 useCapture
 * @update 2015-10-27 dondevi
 *   1.重构
 *   2.完善注释
 *   3.加入版本号 1.0.0
 * @update 2015-11-13 dondevi
 *   1.分离 compat.js
 *   2.分离 ajax.js
 *   3.分离 proto.js
 *   4.版本号升级 1.2.0
 * @update 2016-03-14 dondevi
 *   1.优化 querySelector
 * @update 2016-04-25 dondevi
 *   1.Fixed: "this" in $.each
 * @update 2017-05-23 dondevi
 *   1.Refactor
 *   2.Add isSelector()
 *   3.Update version to 1.3.3
 *
 */

/**
 * ---------------------------------------------------------------------------
 *  Exports
 * ---------------------------------------------------------------------------
 */

/**
 * $ Wrapper
 * @type {Function}
 * @exports $
 * @namespace
 * @global
 */
window.$ = wrapper;

/**
 * Core Functions
 * @type {Function}
 * @memberOf $
 * @global
 */
$.isArray = isArray;
$.inArray = inArray;
$.each    = forEach;
$.util    = {};       // 扩展点





/**
 * ---------------------------------------------------------------------------
 *  Core Logic
 * ---------------------------------------------------------------------------
 */

/**
 * $包装器, 包装所查询的元素集合
 * @param  {(string|*)} [selector] - 选择器字符串或任意数据
 * @param  {Object[]}   [contexts] - 父节点集合, 默认为 [document]
 * @return {Array}      collection - 包装结果
 * @private
 */
function wrapper (selector, contexts) {
  if ("string" !== typeof selector) {
    return toArray(selector);
  }

  try {
    var collection = [];
    forEach(contexts || [document], (index, context) => {
      if (context instanceof Node) {
        var nodeList = querySelectorAll(selector, context);
        Array.prototype.push.apply(collection, nodeList);
      }
    });
  } catch (exception) {
    throw exception;
  }

  if (!collection[0]) {
    console.info("%cNot Found: %s", "color:grey;font-size:10px", selector);
  }

  return collection;
};

/**
 * 根据选择器字符串查询元素集合
 * @param  {string} selector - 选择器字符串
 * @param  {Object} context  - 父节点
 * @return {Array}  nodeList - 查询元素集合
 * @private
 */
function querySelectorAll (selector, context) {
  if (isSelector(selector, "id")) {
    var result = context.getElementById(selector.substring(1));
    return result ? [result] : [];
  }
  if (isSelector(selector, "class")) {
    return context.getElementsByClassName(selector.substring(1));
  }
  if (isSelector(selector, "tag")) {
    return context.getElementsByTagName(selector);
  }
  try {
    return context.querySelectorAll(selector);
  } catch (exception) {
    return [];
  }
}





/**
 * ---------------------------------------------------------------------------
 *  Core Functions
 * ---------------------------------------------------------------------------
 */

/**
 * 判断数据是否数组类型
 * @param  {*}       data - 数据
 * @return {Boolean}
 * @memberOf $
 */
function isArray (data) {
  return Array.isArray(data);
  // return data instanceof Array;
  // return "[object Array]" === Object.prototype.toString.call(data);
}

/**
 * 判断是否选择器字符串
 * @param  {string} selector - 选择器字符串
 * @param  {string} type     - 选择器类型 [id|class|tag]
 * @return {Boolean}         - 是否选择器
 * @private
 */
function isSelector (selector, type) {
  if ("string" !== typeof selector) { return false; }
  var regx = {
    "tag":   /^(?:\\.|[\w-]|[^\0-\xa0])+$/,
    "id":    /^#(?:\\.|[\w-]|[^\0-\xa0])+$/,
    "class": /^\.(?:\\.|[\w-]|[^\0-\xa0])+$/,
  }[type] || /^[#\.]?(?:\\.|[\w-]|[^\0-\xa0])+$/;
  return regx.test(selector);
}

/**
 * 判断数据是否类数组
 * @param  {*}       data - 数据
 * @return {Boolean}
 * @since 1.3.1
 */
function isArrayLike (data) {
  return data instanceof NodeList ||
         data instanceof HTMLCollection ||
         "[object Arguments]" === data.toString();
}

/**
 * 判断数据是否在数组中
 * @param  {*}       data  - 数据
 * @param  {Array}   array - 数组
 * @return {Boolean}
 * @memberOf $
 */
function inArray (data, array) {
  return -1 < array.indexOf(data);
}

/**
 * 将任意类型数据转换为数组
 * @param  {*}     data - 数据
 * @return {Array}      - 数组
 * @memberOf $
 */
function toArray (data) {
  if (!data) { return []; }
  if (isArray(data)) { return data; }
  if (isArrayLike(data)) {
    return Array.prototype.slice.call(data);
  }
  return [data];
}

/**
 * 遍历数组
 * @param  {?Array}   array   - 数组
 * @param  {Function} handler - 处理函数
 * @memberOf $
 */
function forEach (array, handler) {
  if (!array) { return; }
  array = toArray(array);
  array.forEach((item, index) => {
    item && handler.call(item, index, item);
  });
}





export default $;
// export { isArray, inArray, forEach, querySelectorAll, isSelector };
