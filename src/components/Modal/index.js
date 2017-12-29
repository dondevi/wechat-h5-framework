/**
 * @overview XFH5
 *
 * =============================================================================
 *  Modal 模态框
 * =============================================================================
 *
 *  说明:
 *    实现模态框效果
 *
 *  结构:
 *    <div class="modal fade" id="modal-id">
 *      <div class="modal-dialog">...</div>
 *    </div>
 *
 *  原理:
 *
 *  使用:
 *    1.HTML:
 *      1.打开模态框: 指定任意元素的 data-modal 属性
 *        例: <button data-modal="#modal-id"></button>
 *      2.关闭模态框: 指定任意元素的 data-dismiss 属性
 *        例: <button data-dismiss="#modal-id"></button>
 *      3.添加 .fade 可激活动画效果
 *        例：<div class="modal fade">...</div>
 *    2.Javascript:
 *      1.打开模态框: $.ui.modal.open(modal_id);
 *      2.关闭模态框: $.ui.modal.close(modal_id);
 *      3.可捕获模态框的 open, close 事件
 *
 * =============================================================================
 *
 * @require common/core/core.js
 *
 * @author dondevi
 * @create 2014-08-28
 *
 * @update 2015-01-22 dondevi
 * @update 2015-03-30 dondevi
 *   1.重命名为 modal
 * @update 2016-06-24 dondevi
 *   1.Bugfix: Set event cancelBubble true
 * @update 2016-07-28 dondevi
 *   1.[data-modal] event delegate
 *
 */




/**
 * ---------------------------------------------------------------------------
 *  Event Binding
 * ---------------------------------------------------------------------------
 */

// 打开模态框
$(document.body).on("click", "[data-modal]", function (event) {
  // var related = event.target;
  var related = event.currentTarget;
  var target  = related.dataset["modal"];
  // if (target) {
    event.stopPropagation();
    openModal(target, related);
  // }
});

// 关闭模态框
$(document.body).on("click", function (event) {
  var related = event.target;
  var target = related.dataset["dismiss"];
  if (target) {
    event.stopPropagation();
    closeModal(target, related);
  }
});





/**
 * ---------------------------------------------------------------------------
 *  Core Logic
 * ---------------------------------------------------------------------------
 */

/**
 * 打开对话框
 * @param  {(string|Object)} id      - 模态框 ID 或元素
 * @param  {Object}          related - 关联元素
 */
function openModal (id, related) {
  var $modal = $(id);
  if ($modal[0] && !$modal[0].offsetWidth) {
    $modal[0].style.display = "block";
    window.setTimeout(function () {
      $modal.addClass("in");
      $modal.trigger($.Event("open", {
        cancelBubble: true,
        relatedTarget: related
      }));
      $modal = null;
    }, 3);
  }
  return $modal;
}

/**
 * 关闭对话框
 * @param  {(string|Object)} id      - 模态框 ID 或元素
 * @param  {Object}          related - 关联元素
 */
function closeModal (id, related) {
  var $modal = $(id);
  if ($modal[0] && $modal[0].offsetWidth) {
    $modal.removeClass("in");
    window.setTimeout(function () {
      $modal[0].style.display = "";
      $modal.trigger($.Event("close", {
        cancelBubble: true,
        relatedTarget: related
      }));
      $modal = null;
    }, 334);
  }
  return $modal;
}





/**
 * ---------------------------------------------------------------------------
 *  Exports
 * ---------------------------------------------------------------------------
 */
$.ui = $.ui || {};
$.ui.modal = {
  open:  openModal,
  close: closeModal
};
