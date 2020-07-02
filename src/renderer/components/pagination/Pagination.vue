<template>
  <div class="pagination-block">
    <el-pagination
      hide-on-single-page
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPageSync"
      :page-sizes="[10, 50, 100, 200, 300, 400]"
      :page-size="perPage"
      layout="sizes, prev, pager, next"
      :total="1000">
    </el-pagination>
    <el-tooltip class="item" effect="dark" content="Refresh" :hide-after="2000">
      <button class="refresh-btn btn btn-small waves-effect waves-red wallet-action" @click="getData()">
        <i class="el-icon-refresh-right" />
      </button>
    </el-tooltip>
  </div>
</template>

<script>
import Vuex from 'vuex';

export default {
  name: 'Pagination',
  props: ['view', 'getDataMethod', 'loadDataOnInit'],  
  data() {
    return {
      currentPageSync: 0
    }
  },
  computed: {
    perPage() { return this.$store.getters.getPaginationState(this.view).perPage },
    currentPage() { return this.$store.getters.getPaginationState(this.view).currentPage },
    ...Vuex.mapGetters([
      'getPaginationState',
      'getPaginationParams'
    ])
  },
  
  watch: {
    currentPage: function(currentPage) {
      this.currentPageSync = currentPage;
    }
  },
  
  methods: {
    ...Vuex.mapMutations(['setPerPage', 'setCurrentPage']),

    handleSizeChange(val) {
      this.setPerPage({view: this.view, perPage: val});
      this.getData();
    },

    handleCurrentChange(val) {
      this.setCurrentPage({view: this.view, currentPage: val});
      this.getData();
    },

    getData() {
      this.getDataMethod(this.getPaginationParams(this.view));
    }
  },

  created() {
    this.currentPageSync = this.getPaginationState(this.view).currentPage;

    if (this.loadDataOnInit) {
      this.getData();
    }
  },

  updated() {
    this.$scrollTo(0, 0);
  }
};
</script>

<style lang="scss">
  //  Overrides default css of pagination input select (element-ui)
  div.el-pagination {
    padding-right: 0px !important;
    padding-bottom: 10px !important;
  }
  .el-pagination.el-select.el-input {
    width: 115px !important;
  }
  input.el-input__inner {
    height: 30px !important;
    margin-bottom: 0 !important;
    width: 100px !important;
    padding-right: 0px !important;
    margin-right: 25px !important;
  }
  .el-input__suffix {
    right: -10px !important;
    color: #555 !important;
  }

  i.el-select__caret {
    color: #606266 !important;
  }
</style>

<style lang="scss" scoped>
  .refresh-btn {
    margin-left: 10px;
  }
  .pagination-block {
    display: flex;    
    justify-content: flex-end;
  }
</style>
