/**
 * @overview 工具库
 *
 * =============================================================================
 *  扩展工具
 * =============================================================================
 *
 *  API:
 *    2. $.image.layzr;    // Layzr 实例
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-05-24
 *
 */

/**
 * @see https://github.com/callmecavs/layzr.js
 */
import Layzr from "vendors/layzr.js";
import error_landscape from "themes/default/images/error_landscape.png";
import error_portrait from "themes/default/images/error_portrait.png";

/**
 * 图片延时加载
 * @type {Object}
 */
$.image = $.util.img = {};
$.util.img.layzr = new Layzr();
$.util.img.layzr.update().check().handlers(true);

/**
 * 处理图片加载失败事件
 */
document.body.addEventListener("error", event => {
  var img = event.target;
  if ("IMG" !== img.nodeName) { return; }

  var times = +img.dataset["loadTimes"] || 0;
  img.dataset["loadTimes"] = times + 1;

  if (2 > times) {
    return window.setTimeout(() => refreshImage(img), 800);
  }

  if (3 > times) {
    showErrorImage(img);
  }

}, true);


function refreshImage (img) {
  var spliter = (/\?/.test(img.src) ? "&" : "?") + "_r_=";
  img.src = img.src.split(spliter)[0] + spliter + Math.random();
}

function showErrorImage (img) {
  if (!img.dataset["origin"]) {
    img.dataset["origin"] = img.src;
  }
  var type = img.dataset["type"];
  var def  = img.dataset["default"] || "landscape" === type
           ? error_landscape
           : error_portrait;
  img.src = def;
}
