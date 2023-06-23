<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
    class="app-container"
  >
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="查询信息" />
      <el-step title="条件" />
      <el-step title="sql" />
      <el-step title="字段" />
      <el-step title="排序" />
    </el-steps>
    <el-divider />
    <search-dlg
      v-show="showStatus[0]"
      v-model="row.search"
      @commit="commit"
      @nextStep="nextStep"
      @finish="finish"
    />
    <search-condition-dlg
      v-show="showStatus[1]"
      v-model="row.searchCondition"
      :conditions.sync="conditions"
      @preStep="preStep"
      @nextStep="nextStep"
      @finish="finish"
    />
    <search-sql-dlg
      v-show="showStatus[2]"
      v-model="row.searchSql"
      :conditions="conditions"
      :results.sync="results"
      @preStep="preStep"
      @nextStep="nextStep"
      @finish="finish"
    />
    <search-field-dlg
      v-show="showStatus[3]"
      v-model="row.searchField"
      :results="results"
      :fields.sync="fields"
      @preStep="preStep"
      @nextStep="nextStep"
      @finish="finish"
    />
    <search-sort-dlg
      v-show="showStatus[4]"
      v-model="row.searchSort"
      :fields="fields"
      @preStep="preStep"
      @finish="finish"
    />
  </div>
</template>

<script>
import SearchDlg from '@/views/search_config/search_dlg'
import SearchConditionDlg from '@/views/search_config/search_condition_dlg'
import SearchSqlDlg from '@/views/search_config/search_sql_dlg'
import SearchFieldDlg from '@/views/search_config/search_field_dlg'
import { searchAdd, searchModify, searchInfo } from '@/api/search_config'
import SearchSortDlg from '@/views/search_config/search_sort_dlg'

export default {
  name: 'SearchStep',
  components: { SearchSortDlg, SearchFieldDlg, SearchSqlDlg, SearchConditionDlg, SearchDlg },
  data() {
    return {
      /**
       * 全屏加载
       */
      fullscreenLoading: false,
      /**
       * 窗口的状态
       */
      status: '',
      /**
       * 数据
       */
      row: {
        search: {},
        searchCondition: [],
        searchSql: [],
        searchField: [],
        searchSort: []
      },
      search: {
      },
      /**
       * 进度条
       */
      active: 0,
      /**
       * 显示状态
       */
      showStatus: [true, false, false, false, false],
      /**
       * 条件
       */
      conditions: [],
      /**
       * 结果
       */
      results: [],
      /**
       * 字段
       */
      fields: []
    }
  },
  methods: {
    resetSearch() {
      return {
        usable: '1',
        page_size: 100,
        top: 2000,
        redis_cache_time: 300,
        want_csv: 10000,
        export_single_size: 20000,
        pages: 21,
        export_file_type: 'xlsx',
        export_file_cache_time: 300
      }
    },
    setFormData(row, status) {
      this.status = status
      if (status === 'create') {
        this.row = {
          search: this.resetSearch(),
          searchCondition: [],
          searchSql: [],
          searchField: [],
          searchSort: []
        }
      } else if (status === 'update') {
        this.fullscreenLoading = true
        searchInfo(row.id).then(res => {
          this.fullscreenLoading = false
          this.row.search = res.data.search
          res.data.searchCondition.forEach(item => this.row.searchCondition.push(item))
          res.data.searchSql.forEach(item => this.row.searchSql.push(item))
          res.data.searchField.forEach(item => this.row.searchField.push(item))
          res.data.searchSort.forEach(item => this.row.searchSort.push(item))
        }).catch(error => this.fullscreenLoading = false)
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++
        this.showStatus = [false, false, false, false, false]
        this.showStatus[this.active] = true
      }
    },
    commit() {

    },
    preStep() {
      if (this.active > 0) {
        this.active--
        this.showStatus = [false, false, false, false, false]
        this.showStatus[this.active] = true
      }
    },
    finish() {
      this.fullscreenLoading = true
      if (this.status === 'create') {
        searchAdd(this.row).then(res => {
          this.fullscreenLoading = false
          this.$emit('success')
        }).catch(error => {
          this.fullscreenLoading = false
        })
      } else {
        searchModify(this.row).then(res => {
          this.fullscreenLoading = false
          this.$emit('success')
        }).catch(error => {
          this.fullscreenLoading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
