/**
 * @overview 工具库
 *
 * =============================================================================
 *  扩展工具
 * =============================================================================
 *
 *  API:
 *    1. $.util.deparam(urlParam);                            // 地址参数反序列化
 *    2. $.util.render(tmpl, json, [container], [isAppend]);  // 渲染模板
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2014-09-03
 *
 * @update 2015-02-11 dondevi
 * @update 2016-04-14 dondevi
 *   1.Add: layzr
 * @update 2016-04-25 dondevi
 *   1.Update: $.util.deparam, $.util.date.format
 * @update 2016-05-17 dondevi
 *   1.Update: $.util.post unsuccess
 * @update 2016-05-19 dondevi
 *   1.Update: $.util.render inderBefore
 * @update 2016-12-13 dondevi
 *   1.Remove: $.util.post & $.util.postAS
 * @update 2017-05-23 dondevi
 *   1.Move $.util.date.format to modules/Date/date.js
 *   1.Move $.deferred & $.promise to modules/Defer/index.js
 *   1.Move $.session to modules/Storage/index.js
 *   1.Move $.session to modules/Storage/index.js
 */

/**
 * @see http://olado.github.io/doT/
 */
import doT from "vendors/doT.js";


/**
 * 地址参数反序列化
 * @param  {String} urlParam - 序列化参数
 * @return {Object}
 */
$.util.deparam = (urlParam) => {
  if ("string" !== typeof urlParam) { return false; }
  urlParam = urlParam.replace(/^[#\?]/, "");
  var result = {};
  urlParam.split("&").forEach(param => {
    param = param.split("=");
    result[param[0]] = param[1];
  });
  return result;
};








/**
 * 封装 template
 * @param  {string}  tmplID   - 模板 ID
 * @param  {json}    json     - 数据
 * @param  {string}  options  - 容器 ID
 * @param  {string}  options.container - 容器 ID
 * @param  {boolean} options.append    - 是否追加内容
 * @param  {boolean} options.inert     - 是否在前插入内容
 * @require common/lib/doT.js
 * @update 2015-12-16 dondevi
 * @update 2016-05-20 dondevi
 * @update 2016-06-16 dondevi
 *   1.Optimize
 */
$.util.render = (tmplID, json, options) => {
  var tmpl = document.querySelectorAll(tmplID)[0];
  if (!tmpl) { return; }
  options = Object.assign({
    container: "",
    append: false,
    insert: false,
    replace: false
  }, options);
  var containerID = options.container ||
                    tmpl.dataset.container ||
                    tmplID.replace("tmp-", "");
  var container = $(containerID)[0] || tmpl.parentNode;
  var html = doT.compile(tmpl.innerHTML)(json || null)
                .replace(/(^\s+|\s+$)/, "");
  if (options.append) {
    var frag = getFragment(html);
    container.appendChild(frag);
  } else if (options.insert) {
    var frag = getFragment(html);
    container.insertBefore(frag, container.firstChild);
  } else if (options.replace) {
    container.outerHTML = html;
  } else {
    container.innerHTML = html;
  }
};

function getFragment (html) {
  var div  = document.createElement("div");
  var frag = document.createDocumentFragment();
  div.innerHTML = html;
  $.each(div.children, (index, node) => {
    frag.appendChild(node.cloneNode(true));
  });
  return frag;
}
