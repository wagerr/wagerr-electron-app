<template>
  <el-dialog
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    custom-class="custom-dialog dialog-debug"
    :visible.sync="isVisible"
    width="80%"
  >
    <div class="dialog-header" slot="title">DebugWindow</div>
    <div class="h-100 w-100">
      <debug-input />
    </div>
  </el-dialog>
</template>

<script>
import DebugInput from './DebugInput';
export default {
  name: 'DebugWindow',
  components: { DebugInput },
  data() {
    return {
      isVisible: false
    };
  },
  created() {
    this.isVisible = true;
  },
  computed: {},
  methods: {}
};
</script>
<style lang="scss">
.el-dialog.dialog-debug {
  background: rgb(43, 44, 45);
  .debug-container {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
<style scoped>
.history-panel {
  padding: 15px;
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 2px #888;
}
.dialog-header {
  color: red;
}
.label-command {
  margin-top: 15px;
}
.input-command {
  margin-top: 5px;
}
</style>
