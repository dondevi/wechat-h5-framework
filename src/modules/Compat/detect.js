/**
 * @overview 核心库
 *
 * =============================================================================
 *  Compat - detect 浏览器兼容性检测
 * =============================================================================
 *
 *  说明:
 *    1.非 jQuery API 设计
 *
 *  API:
 *    1. $.device    // 设备检测
 *    2. $.support   // 特性检测
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2015-11-13
 * @version 1.0.2
 *
 * @update 2017-05-23 dondevi
 *   1.Seperate from Core/compate.js
 *
 */


/**
 * ---------------------------------------------------------------------------
 *  Device detection 设备检测
 * ---------------------------------------------------------------------------
 */

/** @private {string} */
var ua = window.navigator.userAgent;

/**
 * Detect Device's OS
 * @constant {Object}
 * @readonly
 */
$.device = {
  mobile:       1 !== navigator.maxTouchPoints,      // 移动端
  Wechat:       /MicroMessenger/i.test(ua),          // 微信
  WindowsPhone: 0 <= ua.indexOf("Windows Phone"),    // 微软
  BlackBerry10: 0 <  ua.indexOf('BB10')              // 黑莓
};

if (!$.device.WindowsPhone) {
  $.device.Android = 0 < ua.indexOf('Android');      // 安卓
  $.device.iOS     = /iP(?:hone|ad|od)/i.test(ua);   // 苹果
  if ($.device.iOS) {
    $.device.iOS4             = /OS 4_\d(?:_\d)?/i.test(ua);
    $.device.iOS9             = /OS 9_\d(?:_\d)?/i.test(ua);
    $.device.iOSWithBadTarget = /OS (?:[6-9]|\d{2})_\d/i.test(ua);
  }
}





/**
 * ---------------------------------------------------------------------------
 *  Feature detection 特性检测
 * ---------------------------------------------------------------------------
 */

// /**
//  * Detect Feature Supported
//  * @readonly
//  * @constant {Object}
//  */
// $.support = {
//   fileReader: !!window.FileReader,
//   accept: "accept" in document.createElement("input"),
//   capture: "capture" in document.createElement("input"),
//   canvas: (function (document) {
//     var canvas = document.createElement("canvas");
//     var result = false;
//     if (!!(canvas.getContext && canvas.getContext('2d'))) {
//       result = {
//         toDataURL_jpeg: 0 === canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg')
//       };
//     }
//     canvas = null;
//     return result;
//   })(document)
// };
