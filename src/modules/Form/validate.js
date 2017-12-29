/**
 * @overview XFH5
 *
 * =============================================================================
 *  表单验证
 * =============================================================================
 *
 *  API:
 *    1. form.checkValidity();         // 验证表单
 *    2. form_element.checkValidity(); // 验证表单元素
 *
 *  原理:
 *    覆盖原生表单 checkValidity 方法
 *
 *  注意:
 *    1.需为 <form> 标签添加 novalidate 属性
 *      例: <form novalidate></form>
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2014-09-03
 * @version 1.5.4
 *
 * @update 2015-01-29 dondevi
 *   1.重构
 * @update 2015-12-09 dondevi
 *   1.英文提示
 * @update 2015-06-16 dondevi
 *   1.Refactor
 *
 */


"use strict";

var _regex = {
  // 元素类型
  element:   /text|password|email|tel|url|number|file|textarea|select-one/,
  // 中文名
  chinese:   /^[\u4E00-\u9FA5]+$/,
  // 英文名
  english:   /^[a-zA-Z][a-zA-Z\·\.\s\-\']*[a-zA-Z]$/,
  // 名词 (非纯数字/特殊字符)
  noun:      /[a-zA-Z\u4E00-\u9FA5]/, /** @todo 优化 */
  // 密码
  password:  /^[\^\$\!\.\w\*~@#%&]{6,32}$/,
  // 手机号码
  tel:       /^0?1[3|4|5|7|8][0-9]\d{8}$/,
  // 电话号码
  phone:     /^(0?1[3|4|5|7|8][0-9]\d{8}|\d{3}\-?\d{8}|\d{4}\-?\d{7})$/, /** @todo 优化 */
  // 邮箱
  email:     /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  // 网址
  url:       /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
  // 日期
  date:      /^[1-9]\d{3}[\-\/\.]?(?:0[1-9]|1[0-2])[\-\/\.]?(?:[0-2][0-9]|3[0-1])$/,
  // 邮编
  zipcode:   /^[1-9][0-9]{5}$/,
  // 身份证号码
  resident:  /(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$)/,
  // 回执号码
  receipt:   /^Y\d{2}(?:0[1-9]|1[0-2])(?:[0-2][0-9]|3[0-1])\d{7}[A-Z\d]$/,
};


// Input 验证
HTMLTextAreaElement.prototype.checkValidity =
HTMLSelectElement.prototype.checkValidity =
HTMLInputElement.prototype.checkValidity = function (type, pattern) {
  var param = getParam(this, type, pattern);
  if (this.disabled || this.readOnly || this.hidden) {
    return true;
  }
  var result = true;
  result = result && checkRequired(param);
  if (!/file|select/.test(param.type) && param.value) {
    result = result && checkLength(param);
    result = result && checkPattern(param);
  }
  return result;
};


// 表单验证
HTMLFormElement.prototype.checkValidity = function () {
  var els = this.elements;
  var unchecks = {};
  for (var i = 0, el = null; el = els[i]; i++) {
    // 筛选需验证的元素
    if (_regex["element"].test(el.type)) {
      if (!el.checkValidity()) {
        el.scrollIntoViewIfNeeded();
        return false;
      }
    }
    if (/radio|checkbox/.test(el.type) && el.required) {
      if (!(el.name in unchecks)) { unchecks[el.name] = el; }
      if (el.checked) { unchecks[el.name] = null; }
    }
  }
  for (var key in unchecks) {
    if (unchecks[key]) {
      unchecks[key].parentNode.scrollIntoViewIfNeeded();
      window.alert("请选择" + unchecks[key].dataset["label"]);
      return false;
    }
  }
  return true;
};


// 获取验证参数
function getParam (el, type, pattern) {
  return {
    el:      el,
    type:    type || el.dataset.type || el.type,
    value:   el.value,
    label:   el.dataset.label ||
             el.labels[0] && el.labels[0].innerHTML ||
             el.getAttribute("placeholder") || "内容",
    pattern: pattern || el.pattern || el.getAttribute("pattern")
  };
}

// 验证必填项
function checkRequired (param) {
  if (!param.el.required) { return true; }
  if (param.value)        { return true; }
  if ("en-us" === document.documentElement.lang) {
    window.alert((/select/.test(param.type) ? "Please select \"" : "Please enter \"") + param.label + "\"");
  } else {
    window.alert((/select/.test(param.type) ? "请选择" : "请填写") + param.label);
  }
  return false;
}

// 验证长度
function checkLength (param) {
  if (0 < param.el.minLength && param.value.length < param.el.minLength) {
    if ("en-us" === document.documentElement.lang) {
      window.alert("Please lengthen \"" + param.label + "\" to " + param.el.minLength + " characters or more（you are currenty using " + param.value.length + " characters）");
    } else {
      window.alert("\"" + param.label + "\"至少需要 " + param.el.minLength + " 位字符（您输入了 " + param.value.length + " 位）");
    }
    return false;
  }
  // if (0 < param.el.maxLength && param.value.length > param.el.maxLength) {
  //   window.alert("请将\"" + param.label + "\"减少至 " + param.el.maxLength + " 位字符以内（您输入了 " + param.value.length + " 位）");
  //   return false;
  // }
  return true;
}

// 验证格式
function checkPattern (param) {
  var regex = param.pattern && new RegExp(param.pattern) || _regex[param.type];
  if (!regex) { return true; }
  if (regex.test(param.value)) { return true; }
  if ("en-us" === document.documentElement.lang) {
    window.alert("Please match the format of \"" + param.label + "\"");
  } else {
    window.alert("请填写正确的" + param.label);
  }
  return false;
}
