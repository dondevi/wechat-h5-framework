/**
 * @overview XFH5
 *
 * =============================================================================
 *  Number 数量选择
 * =============================================================================
 *
 *  说明:
 *    实现数量的增减功能
 *
 *  结构:
 *    <div class="number-box">
 *      <button type="button" dir="-">-</button>
 *      <input type="text" name="name" min="1" value="1">
 *      <button type="button" dir="+">+</button>
 *    </div>
 *
 * =============================================================================
 *
 * @require modules/Core/core.js, modules/Core/fn.js, modules/Core/event.js
 *
 * @author dondevi
 * @create 2014-08-29
 *
 * @update 2015-01-22 dondevi
 * @update 2016-03-24 dondevi
 *   1.改为 delegate 方式
 * @update 2016-07-28 dondevi
 *   1.Trigger Change event
 * @update 2016-12-15 dondevi
 *   1.Update: updateNum
 *   2.Remove: updatePrice
 * @update 2016-12-16 dondevi
 *   1.Add: btn disabled state
 * @update 2017-09-20 dondevi
 *   1.Rename: "Amount" to "Number"
 *
 */

/**
 * ---------------------------------------------------------------------------
 * Event Binding
 * ---------------------------------------------------------------------------
 */
$(document.body).on("click", ".number-box", function (event) {
  event.stopPropagation();
  var box = event.currentTarget;
  var btn = event.target;
  if ("BUTTON" === btn.nodeName) {
    var dir = btn.getAttribute("dir") || btn.innerHTML;
    var input = box.querySelector("input");
    var btnSubs = box.querySelector('[dir="-"]');
    var btnPlus = box.querySelector('[dir="+"]');
    updateNum(dir, input, btnSubs, btnPlus);
  }
});





/**
 * ---------------------------------------------------------------------------
 *  Core Logic
 * ---------------------------------------------------------------------------
 */

/**
 * 改变数量
 * @param  {DOM} input - input 元素
 * @param  {DOM} btn   - 按钮元素
 */
function updateNum (dir, input, btnSubs, btnPlus) {
  var step = +input.getAttribute("step") || 1;
  var min  = +input.getAttribute("min") || 0;
  var max  = +input.getAttribute("max") || Infinity;
  var value = +input.value;
  btnSubs.disabled = false;
  btnPlus.disabled = false;
  if ("-" === dir) {
    value -= step;
    if (min >= value) {
      value = min;
      btnSubs.disabled = true;
    }
  }
  if ("+" === dir) {
    value += step;
    if (max <= value) {
      value = max;
      btn.disabled = true;
    }
  }
  if (+input.value !== value) {
    input.value = value;
    $(input).trigger("change");
  }
}
