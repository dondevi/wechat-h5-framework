/**
 * @overview XFH5
 *
 * =============================================================================
 *  Tabs 标签页
 * =============================================================================
 *
 *  说明:
 *    实现标签页的切换效果
 *
 *  结构:
 *    <ul class="tab-nav">
 *      <li class="active" data-tab="#tab-1">
 *        ...
 *      </li>
 *      ...
 *    </ul>
 *    <div class="tab-content">
 *      <div class="tab-pane active" id="tab-1">...</div>
 *      ...
 *    </div>
 *
 *  API:
 *    1.HTML:
 *      1.指定 .tab-nav 中 <a> 标签的 data-tab 属性(tab_id)
 *
 * =============================================================================
 *
 * @require modules/Core/core.js, modules/Core/fn.js, modules/Core/event.js
 *
 * @author dondevi
 * @create 2015-01-27
 *
 * @update 2015-03-11
 * @update 2016-12-16 dondevi
 *   1.Reset scroll bar when switch tabs
 */


$(document.body).on("click", "[data-tab]", function (event) {
  event.preventDefault();
  var $tab = $(this);
  if ($tab.hasClass("active")) { return; }
  // Event
  var switchEvent = $.Event("switch");
  $tab.trigger(switchEvent);
  if (switchEvent.defaultPrevented) { return; }
  // Tab
  $(".active", this.parentNode).removeClass("active");
  $tab.addClass("active");
  var $target = $(this.dataset["tab"]);
  // Pane
  if (!$target[0]) { return; }
  $target[0].parentNode.scrollTop = 0;
  $(".tab-pane.active", $target[0].parentNode).removeClass("active");
  $target.addClass("active");
});
