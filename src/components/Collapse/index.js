/**
 * @overview XFH5
 *
 * =============================================================================
 *  折叠内容 Collapse
 * =============================================================================
 *
 *  说明:
 *    实现元素显示/隐藏效果
 *
 *  结构:
 *    <!-- 触发元素 -->
 *    <button data-collapse="#collapse-id">...</button>
 *    <!-- 目标元素 -->
 *    <div class="collapse" id="collapse-id">...</div>
 *
 *  原理:
 *    1.设置 .collapse 会将目标元素隐藏
 *    2.添加 .in 将目标元素显示，同时会向触发元素添加 .avtive
 *
 *  使用:
 *    1.HTML:
 *      1.显示/隐藏目标元素：指定任意元素的 data-collapse 属性(collapse_id)
 *    1.Javascript:
 *      1.显示目标元素: $(collapse_id).addClass("in");
 *      2.隐藏目标元素: $(collapse_id).removeClass("in");
 *
 * =============================================================================
 *
 * @require modules/Core/core.js, modules/Core/fn.js, modules/Core/event.js
 *
 * @author dondevi
 * @create 2014-08-28
 *
 * @update 2014-12-19 dondevi
 * @update 2016-07-26 dondevi
 *   1.delegate event
 */


// 展开/收缩按钮
$(document.body).on("click", function (event) {
  var target = $(event.target).closest("[data-collapse]")[0];
  if (target) {
    event.preventDefault();
    event.stopPropagation();
    var $target = $(target.dataset.collapse);
    $target.toggleClass("in");
    $(target).toggleClass("active");
  }
});
