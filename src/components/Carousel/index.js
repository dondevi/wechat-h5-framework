/**
 * @overview XFH5
 *
 * =============================================================================
 *  Carousel 轮播
 * =============================================================================
 *
 *  说明:
 *    实现手指滑动的轮播效果
 *
 *  结构：
 *    <div class="carousel">
 *      <ol class="carousel-inner">
 *        <li class="item active">...</li>
 *        ...
 *      </ol>
 *      <ol class="carousel-indicators">
 *        <li class="active" data-index="0"></li>
 *        ...
 *      </ol>
 *    </div>
 *
 *  原理:
 *    1.移动效果使用 CSS Translate3d (可触发 GPU 加速)
 *    2.切换效果使用 CSS Transition, 移动过程中设置 .moving 来屏蔽
 *    3.当移动距离达到特定值时触发切换效果 (设置 .active)
 *
 *  使用:
 *    1.HTML:
 *      1.按 Bootstrap3 的规范写 carousel 组件即可
 *        Tips: 可以用 Sublime 的 Bootstrap3 插件
 *      2.添加 .vertical 可切换成竖向模式
 *        例: <div class="carousel vertical">...</div>
 *    2.Javascript:
 *      1.重置: $(carousel_id).trigger("reset");
 *      2.事件: $(carousel_id).on("end"); // 末页
 *
 *  TODO:
 *    1.重构
 *    2.性能优化
 *
 * =============================================================================
 *
 * @require modules/Core/core.js, modules/Core/fn.js, modules/Core/event.js
 *
 * @author dondevi
 * @create 2014-09-03
 *
 * @update 2015-03-11 dondevi
 * @update 2015-03-14 dondevi
 *   1.添加了 touchTarget
 * @update 2015-08-10 dondevi
 *   1.改用 matrix3d
 *   2.添加 data-stop-carousel
 * @update 2015-10-28 dondevi
 *   1.重构
 *
 * @update 2016-12-19 李军
 *   1.每次滑动后，触发change事件
 *
 */


var transform = ("webkitTransform" in document.body.style) ? "webkitTransform" : "transform";





/**
 * ---------------------------------------------------------------------------
 *  Event Binding
 * ---------------------------------------------------------------------------
 */
$.each($(".carousel"), function (i, carousel) {

  var $carousel = $(carousel);

  /**
   * @typedef {param}
   * @type {Object}
   * @property {boolean} isInit - 是否初始化
   * @property {number}  size - 尺寸
   */
  var param = {
    isInit:     false,
    size:       0,
    startPoint: 0,
    movePoint:  0,
    curIndex:   0,
    maxIndex:   0,
    $carousel:  $carousel,
    target:     $carousel.find(".carousel-inner")[0],
    $indexList: $carousel.find(".carousel-indicators").find("li"),
    isVertical: $carousel.hasClass("vertical")
  };

  var $touchTarget = $(carousel.dataset["target"]);
  $touchTarget = $touchTarget[0] ? $touchTarget : $carousel;

  $carousel.on("reset", HANDLER_resetCarousel.bind(param));
  $carousel.on("switch", HANDLER_switchCarousel.bind(param));
  $(window).on("orientationchange", HANDLER_orientChange.bind(param));

  $touchTarget.on("touchstart", HANDLER_touchStart.bind(param));
  $touchTarget.on("touchmove", HANDLER_touchMove.bind(param));
  $touchTarget.on("touchend", HANDLER_touchEnd.bind(param));

  param.$indexList.on("click", function (event) {
    slidTarget.call(param, param.curIndex = +this.dataset["index"]);
  });



});





/**
 * ---------------------------------------------------------------------------
 *  Event Handler
 * ---------------------------------------------------------------------------
 * @this {param}
 */

function HANDLER_resetCarousel (event) {
  this.curIndex = 0;
  slidTarget.call(this, 0);
}

function HANDLER_switchCarousel (event, index, isDisableAnimation) {
  this.curIndex = index;
  // 切换时，是否禁用动画
  if (isDisableAnimation) {
    this.$carousel.addClass("moving");
    slidTarget.call(this, index);
    // 异步执行的动画结束后，再异步去除class，恢复动画
    window.requestAnimationFrame(() => window.setTimeout(() => this.$carousel.removeClass("moving"), 0));
  } else {
    slidTarget.call(this, index);
  }
}

function HANDLER_orientChange (event) {
  this.isInit = false;
}

function HANDLER_touchStart (event) {
  event.stopPropagation();
  initialParam.call(this);
  if (!("stopCarousel" in event.target.dataset)) {
    this.$carousel.addClass("moving");
    var targetTouches = event.targetTouches || [{ pageX: event.pageX, pageY: event.pageY }];
    var pointType = this.isVertical ? "pageY" : "pageX";
    this.startPoint = this.movePoint = targetTouches[0][pointType];
  }
}

function HANDLER_touchMove (event) {
  event.stopPropagation();
  if (!("stopCarousel" in event.target.dataset) && /moving/.test(this.$carousel[0].className)) {
    event.preventDefault();
    var changedTouches = event.changedTouches || [{ pageX: event.pageX, pageY: event.pageY }];
    var pointType = this.isVertical ? "pageY" : "pageX";
    var changedTouch = changedTouches[0][pointType];
    var delta = changedTouch - this.movePoint;
    this.movePoint = changedTouch;
    moveTarget.call(this, delta);
  }
}

// 处理触摸结束事件
function HANDLER_touchEnd (event) {
  event.stopPropagation();
  if (!("stopCarousel" in event.target.dataset)) {
    this.$carousel.removeClass("moving");
    var changedTouches = event.changedTouches || [{ pageX: event.pageX, pageY: event.pageY }];
    var pointType = this.isVertical ? "pageY" : "pageX";
    var delta = changedTouches[0][pointType] - this.startPoint;
    // 前一页
    if (35 < delta) {
      this.curIndex = Math.max(--this.curIndex, 0);
    }
    // 后一页
    if (-35 > delta) {
      if (this.curIndex === this.maxIndex) {
        this.$carousel.trigger("last");
      }
      this.curIndex = Math.min(++this.curIndex, this.maxIndex);
    }
    if (0 !== delta) {
      window.setTimeout(slidTarget.bind(this, this.curIndex));
    }
  }
}





/**
 * ---------------------------------------------------------------------------
 *  Core Logic
 * ---------------------------------------------------------------------------
 */

/**
 * 初始化参数
 * @this {Boolean}    this.isInit     [是否已初始化]
 * @this {Object DOM} this.target     [目标元素]
 * @this {Number}     this.size       [Carousel 尺寸]
 * @this {Number}     this.maxIndex   [Item 数目]
 * @this {Boolean}    this.isVertical [是否垂直模式]
 */
function initialParam () {
  if (!this.isInit) {
    this.isInit   = true;
    this.size     = this.isVertical ? this.target.offsetHeight : this.target.offsetWidth;
    this.maxIndex = this.$carousel.find(".item").length - 1;
    if (this.curIndex > this.maxIndex ) {
      this.curIndex = this.maxIndex;
      window.setTimeout(slidTarget.bind(this, this.curIndex));
    }
  }
}

/**
 * 元素跟随手指滑动
 * @param {Number}     delta           [位移量]
 * @this  {Object DOM} this.target     [目标元素]
 * @this  {Boolean}    this.isVertical [是否垂直模式]
 */
function moveTarget (delta) {
  var value = getTranslate(this.target, this.isVertical) + delta;
  setTranslate(this.target, value, this.isVertical);
}

/**
 * 翻页
 * @param {Number}     index           [序号]
 * @this  {Object DOM} this.target     [目标元素]
 * @this  {Number}     this.size       [Carousel 尺寸]
 * @this  {Boolean}    this.isVertical [是否垂直模式]
 */
function slidTarget (index) {
  var value = -index * this.size;
  setTranslate(this.target, value, this.isVertical);
  setCurrentIndex.call(this.$indexList, index);
  this.$carousel.trigger("change", [index]);
}

/**
 * 设置当前序号
 * @param {Number} index [序号]
 * @this  {Array}        [指示器列表]
 */
function setCurrentIndex (index) {
  this.removeClass("active").eq(index).addClass("active");
}

/**
 * 获取目标元素 CSS Translate 的值
 * @param  {Object DOM} target     [目标元素]
 * @param  {Boolean}    isVertical [是否垂直模式]
 * @return {String}
 */
function getTranslate (target, isVertical) {
  var regx = isVertical
           ? /^matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, |, 0, 1\)$/g
           : /^matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, |, 0, 0, 1\)$/g;
  return +(target.style[transform] || "").replace(regx, "") || 0;
}

/**
 * 设置目标元素 CSS Translate 的值
 * @param  {Object DOM} target     [目标元素]
 * @param  {String}     value      [值]
 * @param  {Boolean}    isVertical [是否垂直模式]
 * @return {String}
 */
function setTranslate (target, value, isVertical) {
  window.requestAnimationFrame(function () {
    target.style[transform] = isVertical
                            ? "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + value + ", 0, 1)"
                            : "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + value + ", 0, 0, 1)";
  });
}
