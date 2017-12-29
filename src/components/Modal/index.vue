<!--
/**
 * @overview 幸福网络 H5 框架
 *
 * =============================================================================
 *  Modal Dialog 模态对话框
 * =============================================================================
 *  @example
 *    <modal v-bind:is-open="false">
 *      <h1 slot="header"></h1>
 *    </modal>
 * =============================================================================
 *
 * @author dondevi
 * @create 2016-10-28
 *
 */
-->

<template>
  <div class="modal" v-bind:class="{ in: isOpen }">
    <div class="modal-mask" v-on:click.stop="close"></div>
    <div class="modal-dialog">
      <div class="modal-header">
        <slot name="header"></slot>
        <button class="close" v-on:click.stop="close">&times;</button>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="btn" v-on:click.stop="close">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>


<script>
  import "./index.css";

  export default {
    props: {
      isOpen: { type: Boolean, default: false },
    },
    methods: {
      open  () { this.isOpen = true;  },
      close () { this.isOpen = false; },
    }
  };
</script>
