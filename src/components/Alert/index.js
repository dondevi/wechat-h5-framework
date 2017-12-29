/**
 * @overview 工具库
 *
 * =============================================================================
 *  Alert 警告框
 * =============================================================================
 *
 *  原理:
 *    1.覆盖原生 alert, confirm 方法
 *    2.使用 ui/modal 组件显示内容
 *
 *  说明:
 *    1.Alert 多次调用将依次显示 (需按关闭)
 *    2.兼容原生的调用方式
 *
 *  API:
 *    1. window.alert(message, [title]);
 *    2. window.confirm(message, yesCallback, noCallback, [title]);
 *
 * =============================================================================
 *
 * @require Applaction/Common/View/_common/alert.html
 * @require modules/Core/core.js, modules/Core/fn.js, modules/Core/event.js
 * @require ../ui/modal.js
 *
 * @author dondevi
 * @create 2014-09-03
 * @version 1.1.0
 *
 * @update 2015-02-11 dondevi
 * @update 2015-10-14 dondevi
 *   1.分离 window.onerror 功能为 common/util/log.js
 *   2.重构代码
 *   3.添加 confirm 功能
 * @update 2016-04-25 dondevi
 *   1.合并 alert.html
 *
 */

/**
 * ---------------------------------------------------------------------------
 *  Init
 *  @since 1.1.0
 * ---------------------------------------------------------------------------
 */
var template_toast =`
  <div class="modal fade" id="modal-toast" style="z-index:3001;background:transparent;">
    <div class="toast">
      <p class="toast-content" id="toast-message"></p>
    </div>
  </div>
`;

var template_alert =`
  <div class="modal scrollable fade" id="modal-alert" style="z-index:3001"
       data-dismiss="#modal-alert">
    <div class="modal-dialog modal-dialog-middle">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="alert-title">温馨提示</h4>
        </div>
        <div class="modal-body text-center">
          <p class="text-left" id="alert-message"></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-block btn-md" id="alert-btn" type="button"
                  data-dismiss="#modal-alert">关闭</button>
        </div>
      </div>
    </div>
  </div>
`;

var template_confirm =`
  <div class="modal scrollable fade" id="modal-confirm" style="z-index:3001"
       data-dismiss="#modal-confirm">
    <div class="modal-dialog modal-dialog-middle">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="confirm-title">温馨提示</h4>
        </div>
        <div class="modal-body text-center" style="padding:25px 15px;">
          <p class="text-left" id="confirm-message"></p>
        </div>
        <div class="modal-footer">
          <div class="col-xs-6">
            <button class="btn btn-block btn-md" id="confirm-btn-no" type="button"
                    data-dismiss="#modal-confirm">取消</button>
          </div>
          <div class="col-xs-6">
            <button class="btn btn-block btn-md btn-default" id="confirm-btn-yes" type="button"
                    data-dismiss="#modal-confirm" data-value="true">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

document.body.appendChild((() => {
  var div = document.createElement("div");
  div.innerHTML = template_toast + template_alert + template_confirm;
  return div;
})());




/**
 * ---------------------------------------------------------------------------
 *  Variable
 * ---------------------------------------------------------------------------
 */

// Element
var $toastModal  = $("#modal-toast");                             // Toast 弹框
var toastMessage = document.getElementById("toast-message");      // Toast 内容

var $alertModal  = $("#modal-alert");                             // Alert 弹框
var alertTitle   = document.getElementById("alert-title");        // Alert 标题
var alertMessage = document.getElementById("alert-message");      // Alert 内容
var alertBtn     = document.getElementById("alert-btn");          // Alert 按钮

var $confirmModal  = $("#modal-confirm");                         // Confirm 弹框
var confirmTitle   = document.getElementById("confirm-title");    // Confirm 标题
var confirmMessage = document.getElementById("confirm-message");  // Confirm 内容
var confirmBtnYes  = document.getElementById("confirm-btn-yes");  // Confirm 确认按钮
var confirmBtnNo   = document.getElementById("confirm-btn-no");   // Confirm 取消按钮

// Data
var _alertStack    = [];    // Alert 数据栈

var _originAlert   = window.alert;
var _originConfirm = window.confirm;





/**
 * ---------------------------------------------------------------------------
 *  Exports
 * ---------------------------------------------------------------------------
 */

window.toast   = showToast;   // 覆盖原生 toast 函数
window.alert   = showAlert;   // 覆盖原生 alert 函数
window.confirm = showConfirm; // 覆盖原生 confirm 函数

/**
 * HACK: Fixed Wechat Override
 * document.__wxjsjs__isLoaded
 */
window.setTimeout(() => {
  window.alert = showAlert;
}, 100);





/**
 * ---------------------------------------------------------------------------
 *  Event Binding
 * ---------------------------------------------------------------------------
 */

// Alert 弹框关闭事件
$alertModal.on("close", showNextAlert);

// Confirm 弹框关闭事件
$confirmModal.on("close", HANDLER_closeConfirmModal);





/**
 * ---------------------------------------------------------------------------
 *  Event Handler
 * ---------------------------------------------------------------------------
 */

// 处理 Confirm 弹框关闭事件
function HANDLER_closeConfirmModal (event) {
  var isYes = !!event.relatedTarget.dataset["value"];
  if (isYes) {
    $confirmModal.yesCallback && $confirmModal.yesCallback();
  } else {
    $confirmModal.noCallback && $confirmModal.noCallback();
  }
}





/**
 * ---------------------------------------------------------------------------
 *  Content Render
 * ---------------------------------------------------------------------------
 */

// 显示 Alert 弹框
function RENDER_showAlertModal (message, title) {
  RENDER_showModal($alertModal, alertTitle, alertMessage, message, title);
}

// 显示 Confirm 弹框
function RENDER_showComfirmModal (message, title) {
  RENDER_showModal($confirmModal, confirmTitle, confirmMessage, message, title);
}

// 显示弹框
function RENDER_showModal ($modal, modalTitle, modalMessage, message = "", title) {
  if (title) {
    modalTitle.innerHTML = title;
    modalTitle.parentNode.style.display = "block"; // 显示标题
  } else {
    modalTitle.parentNode.style.display = "none"; // 隐藏标题
  }
  modalMessage.innerHTML = message.toString().replace(/\n/g, "<br>"); // 转换 \n 为 <br>
  $.ui.modal.open($modal);
};





/**
 * ---------------------------------------------------------------------------
 *  Core Logic
 * ---------------------------------------------------------------------------
 */

// 显示 Toast
function showToast (message = "", delay = 3000) {
  if ("block" === $toastModal[0].style.display) { return; }
  toastMessage.innerHTML = message.toString().replace(/\n/g, "<br>");
  $.ui.modal.open($toastModal);
  window.setTimeout(() => $.ui.modal.close($toastModal), delay);
};

// 自定义 Alert
function showAlert (message, title) {
  if ("block" === $alertModal[0].style.display) {
    // 如果已显示 Alert 则压栈
    return _alertStack.push([message, title]);
  }
  RENDER_showAlertModal(message, title);
};

// 自定义 Confirm
function showConfirm (message, yesCallback, noCallback, title) {
  if (!yesCallback && !noCallback) {
    return _originConfirm(message);
  }
  $confirmModal.yesCallback = yesCallback;
  $confirmModal.noCallback  = noCallback;
  RENDER_showComfirmModal(message, title);
};

// 显示下一条 Alert
function showNextAlert () {
  var alertData = _alertStack.pop();
  if (alertData) {
    RENDER_showAlertModal(alertData[0], alertData[1]);
  }
}
