<template>
  <div class="modal scrollable fade" id="modal-alert" style="z-index:3001" data-dismiss="#modal-alert">
    <div class="modal-dialog modal-dialog-middle">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="alert-title">温馨提示</h4>
        </div>
        <div class="modal-body text-center">
          <p class="text-left" id="alert-message"></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-block btn-md" type="button" data-dismiss="#modal-alert">关闭</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal scrollable fade" id="modal-confirm" style="z-index:3001" data-dismiss="#modal-confirm">
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
            <button class="btn btn-block btn-md" type="button" data-dismiss="#modal-confirm">取消</button>
          </div>
          <div class="col-xs-6">
            <button class="btn btn-block btn-md btn-default" type="button" data-dismiss="#modal-confirm" data-value="true">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
  export default {
  };
</script>



<style scoped>
  .modal-body {
    padding: 25px 15px;
  }
    .modal-body > p {
      display: inline-block;
    }
  .modal-footer {
    padding: 0 15px 15px;
    background: none;
    border: none;
  }
  .modal-footer .btn {
      margin: auto;
    }
</style>
