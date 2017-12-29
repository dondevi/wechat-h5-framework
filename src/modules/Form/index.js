/**
 * @overview 工具库
 *
 * =============================================================================
 *  Form 表单处理
 * =============================================================================
 *
 *  API:
 *    1. $.form.getData(form);         // 获取表单数据
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-05-24
 *
 */

$.form = $.util.form = $.util.form || {};


/**
 * 获取表单数据
 * @todo 优化
 * @param  {Object} form - 表单元素
 * @return {Object}
 */
$.util.form.getData = function (form) {
  var data = {};
  $.each(form.elements, function (i, field) {
    if (!field.name || field.hidden ||
        /FIELDSET|BUTTON/.test(field.nodeName) ||
        "ignore" in field.dataset) {
      return;
    }
    var result = getFieldValueAndText(field);
    if ("" === result.value) { return; }
    nameToObject(data, field.name, result.value, result.text);
    // 附加数据
    var attach = field.dataset["attachField"];
    if (attach) {
      nameToObject(data, attach, field.dataset["attachValue"], field.dataset["attachText"]);
    }
  });
  return data;
}

function getFieldValueAndText (field) {
  var value = null;
  var text  = "";
  switch (field.type) {
    case "select-one":
      value = field.value;
      text  = field.selectedOptions[0].text;
      break;
    case "radio":
    case "checkbox":
      if (field.checked) {
        value = field.value || true;
      } else {
        value = "";
      }
      break;
    case "hidden":
      text = field.dataset["label"];
    default:
      value = field.value;
      break;
  }
  if ("date" === field.dataset["type"]) {
    if (/^\d{8}$/.test(value)) {
      value = [value.slice(0,4), value.slice(4,6), value.slice(6,8)].join("-");
    }
    text = value;
    value = +new Date(value);
  }
  return { value: value, text: text };
}

/**
 * <input name="a[b][]" value="1"> -> { a: { b: [1] } }
 * @param  {Object} object - the result
 * @param  {String} name
 * @param  {[type]} value
 * @param  {String} text
 * @return {Object} object
 *
 * @todo  Fix bug: object after array, ex. [][a]
 */
function nameToObject (object, name, value, text) {
  var lookup = object || {};
  var keys   = name.match(/[a-z0-9_]+|\[\]/gi) || [];
  var last   = keys.length - 1;
  for (var i = 0, key = null; key = keys[i]; i++) {
    var needPush = /^\[\]$/.test(key);
    // Last Key
    if (i === last) {
      if (needPush) {
        lookup.push(value);
      } else {
        lookup[key] = value;
        if (text) {
          lookup[key + "_label"] = text;
        }
      }
      break;
    }
    // Multidimensional Array
    if (needPush) {
      var arr = [];
      lookup.push(arr);
      lookup = arr;
      continue;
    }
    // Generate key
    if ("object" !== typeof lookup[key]) {
      var isArray = /^\d+$|^\[\]$/.test(keys[i+1]);
      lookup[key] = isArray ? [] : {};
    }
    lookup = lookup[key];
  }
  return object;
}
