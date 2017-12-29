/**
 * @overview 工具库
 *
 * =============================================================================
 *  扩展工具 - 表单
 * =============================================================================
 *
 *  API:
 *    1. $.ui.form.linkage(form, linkage{items, values}, mixin);  // 表单数据联动
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2016-01-08
 * @version 1.0.0
 * @todo Refactor
 *
 * @update 2016-07-21 dondevi
 *   1.linkage = items + values
 * @update 2016-07-22 dondevi
 *   1.API Changed: showItems & hideItems
 *   2.Refactor
 *
 */


$.util = $.util || {};
$.util.form = $.util.form || {};
$.util.form.linkage = linkage;
$.util.form.linkage.setOptions = linkageSetOptions;





/**
 * 表单数据联动
 * @todo 优化
 * @param  {Object} form           - 表单元素
 * @param  {Object} linkage.items  - 联动数据映射表: 值->字段
 * @param  {Object} linkage.values - 联动数据映射表: 值->值
 * @param  {Object} mixinHandler   - 监听 change 事件的处理函数
 * @return {Object}
 */
function linkage (form, linkage, mixinHandler) {
  if (!form || !linkage) { return; }
  $(form).on("change", function (event) {
    linkageItems(form, linkage, event.target);
    linkageValues(form, linkage, event.target);
    mixinHandler && mixinHandler(event);
  });
};



/**
 * 设置选项列表
 * @param  {Object}  field  选择框元素
 * @param  {Array}   values 选项范围
 * @param  {Boolean} isInit 是否初始化
 */
function linkageSetOptions (field, values, isInit) {
  if (!field || !values || !values[0]) { return; }
  var selectItem = $(field).closest(".list-item")[0];
  var menuId = selectItem.dataset["modal"] || selectItem.hash && selectItem.hash.split("&")[0];
  var optionItems = $(menuId).find(".list-item");
  $.each(optionItems, function (i, optionItem) {
    var $optionItem = $(optionItem);
    // Show or hide option items
    if (values.includes(optionItem.dataset["value"])) {
      $optionItem.removeClass("hide")
      if (field.options[0].selected) {
        $optionItem.removeClass("active");
      }
    } else {
      $optionItem.addClass("hide");
    }
    // If there is only one option value
    if (1 === values.length && selectItem.dataset["modal"] && !isInit) {
      $optionItem.trigger("click");
    }
  });
}




/**
 * linkage Items
 * @param  {Object} form    - 表单元素
 * @param  {Object} linkage - 联动配置
 * @param  {Object} field   - 当前字段元旦
 */
function linkageItems (form, linkage, field) {
  var linkage_items = linkage["items"];
  if (!linkage_items) { return; }
  var linkage_item  = linkage_items[field.name];
  if (!linkage_item)  { return; }
  var showFieldNames = [];
  var hideFieldNames = [];
  for (var enumValue in linkage_item) {
    if ("checkbox" === field.type && field.value !== enumValue) { continue; }
    if ("checkbox" === field.type ? field.checked :
        "*" === enumValue ? field.value :
        field.value === enumValue) {
      showFieldNames = showFieldNames.concat(linkage_item[enumValue]);
    } else {
      hideFieldNames = hideFieldNames.concat(linkage_item[enumValue]);
    }
  }
  showFieldNames = showFieldNames.filter(function(item, index, array) {
    return array.indexOf(item) === index;
  });
  hideFieldNames = hideFieldNames.filter(function (item, index, array) {
    return array.indexOf(item) === index && !showFieldNames.includes(item);
  });
  $.ui.form.showItems(form, showFieldNames);
  $.ui.form.hideItems(form, hideFieldNames);
}




/**
 * linkage Values
 * @param  {Object} form    - 表单元素
 * @param  {Object} linkage - 联动配置
 * @param  {Object} field   - 当前字段元素
 */
function linkageValues (form, linkage, field) {
  var linkage_values = linkage["values"];
  if (!linkage_values) { return; }
  var linkage_value  = linkage_values[field.name];
  if (!linkage_value)  { return; }
  for (var enumName in linkage_value) {
    var targetField = form[enumName];
    var targetValue = linkage_value[enumName][field.value];
    if (targetValue) {
      targetField.options[0].selected = true;
      linkageSetOptions(targetField, targetValue);
      $.ui.form.showItems(form, [enumName]);
    } else {
      $.ui.form.hideItems(form, [enumName]);
    }
  }
}
