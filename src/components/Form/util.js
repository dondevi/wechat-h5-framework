/**
 * @overview 工具库
 *
 * =============================================================================
 *  扩展工具
 * =============================================================================
 *
 *  API:
 *    1. $.util.form.submit(form, handler); // 通用表单提交
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2014-09-03
 *
 * @update 2015-02-11 dondevi
 * @update 2016-04-15 dondevi
 *   1.修复: Android 软键盘覆盖正在编辑的表单元素的问题
 * @update 2017-05-24 dondevi
 *   1.Move Android keyboard compat code to modules/Compat/index.js
 *   2.Move $.util.form.getDate to modules/Form/index.js
 */

$.util.form = $.util.form || {};


/**
 * 封装 表单提交 事件
 * 包括表单验证、按钮状态和加载状态
 * @param  {Object}   form    - 表单元素
 * @param  {Function} handler - 事件处理函数
 * @require modules/Form/validate.js
 * @update 2016-03-15 dondevi
 *   1. $body 改成 page
 */
$.util.form.submit = (form, handler) => {

  var isHold = false;

  var btn  = form["dosubmit"] || {};
  var page = $(form).closest(".page")[0] || document.body;

  var hold = () => {
    if (isHold) { return; }
    isHold = true;
    page.classList.add("loading");
    btn.disabled = true;
  };

  var unhold = () => {
    if (!isHold) { return; }
    isHold = false;
    page.classList.remove("loading");
    btn.disabled = false;
  };

  $(form).on("submit", (event, data) => {
    event.preventDefault();
    if (!form.checkValidity()) { return; }
    if (btn.disabled) { return; }
    hold();
    try {
      var promise = handler(event, data, unhold);
      if (event.holdon) { return; }
      if (promise && promise.always) {
        promise.always && promise.always(unhold);
      } else {
        unhold();
      }
    } catch (exception) {
      unhold();
      throw exception;
    }
  });

};
