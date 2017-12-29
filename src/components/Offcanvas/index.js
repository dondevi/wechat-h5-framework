/**
 * @overview XFH5
 *
 * =============================================================================
 *  Offcanvas 滑动导航
 * =============================================================================
 *
 *  说明:
 *    实现点击隐藏滑动导航的功能
 *
 *  使用:
 *    1.HTML:
 *      1.添加 data-offcanvas 属性
 *
 * =============================================================================
 *
 * @require core/core.js, core/fn.js, core/event.js
 *
 * @author dondevi
 * @create 2015-01-22
 * @version 1.0.0
 *
 */

$(document.body)
  .on("click", "[data-open-offcanvas]", function (event) {
    $(".offcanvas-container").addClass("open-offcanvas");
  })
  .on("touchstart", ".offcanvas", function (event) {
    if (!event.stopOffcanvas) {
      event.preventDefault();
      event.stopPropagation();
      $(".offcanvas-container").removeClass("open-offcanvas");
    }
  })
  .on("touchstart", ".offcanvas-panel", function (event) {
    event.stopOffcanvas = true;
  })
  .on("click", ".js-close-offcanvas", function (event) {
    $(".offcanvas-container").removeClass("open-offcanvas");
  });
