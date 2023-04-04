<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
    class="app-container"
  >
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="searchForm.name" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search">
              查询
            </el-button>
            <el-button type="danger" icon="el-icon-refresh">
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="operate-nav">
      <el-button type="primary" @click="add">新增</el-button>
    </el-row>
    <el-table
      :key="tableKey"
      ref="dataTable"
      :data="data.list"
      tooltip-effect="dark"
      height="30vh"
      border
      fit
      :row-key="record => record.id"
      highlight-current-row
      @current-change="currentChange"
    >
      <el-table-column label="id" prop="id" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="名称" prop="name" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="展示名" prop="display" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="页条数" prop="page_size" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="top" prop="top" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="redis缓存时间" prop="redis_cache_time" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="csv阀值" prop="want_csv" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="导出文件大小" prop="export_single_size" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="缓存页数" prop="pages" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="导出文件类型" prop="export_file_type" header-align="center" align="center" min-width="90" show-overflow-tooltip />
      <el-table-column label="文件缓存时间" prop="export_file_cache_time" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="可用" prop="usable" header-align="center" align="center" min-width="80" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-tag v-if="rowData.row.usable === '1'">可用</el-tag>
          <el-tag v-else type="warning">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" header-align="center" align="center" min-width="90" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-tooltip class="item" effect="dark" :content="rowData.row.error" placement="left-start">
            <el-tag>
              {{ rowData.row.status }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="" min-width="200" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-button v-if="rowData.row.usable === '1'" type="primary" size="mini" @click="statusChange(rowData)">
            停用
          </el-button>
          <el-button v-else type="primary" size="mini" @click="statusChange(rowData)">
            启用
          </el-button>
          <el-button type="primary" size="mini" @click="edit(rowData)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="data.total > page.pageSize"
      small
      :total="data.total"
      :page.sync="page.pageNumber"
      :limit.sync="page.pageSize"
      :page-sizes="[10, 50, 100, 200]"
      @pagination="getList"
    />
    <el-divider />
    <el-tabs type="card" active-name="condition">
      <el-tab-pane label="条件" name="condition">
        <search-condition ref="searchCondition" />
      </el-tab-pane>
      <el-tab-pane label="SQL" name="sql">
        <search-sql ref="searchSql" />
      </el-tab-pane>
      <el-tab-pane label="字段" name="field">
        <search-field ref="searchField" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-if="dialogFormVisible" :visible.sync="dialogFormVisible" :title="dlgStatusMap[dlgStatus]" :close-on-click-modal="false" :modal-append-to-body="false">
      <search-step ref="dlg" @success="success" />
    </el-dialog>

  </div>
</template>

<script>

import { getSearch, searchDisable, searchUsable } from '@/api/search_config'
import Pagination from '@/components/Pagination'
import SearchCondition from '@/views/search_config/search_condition'
import SearchSql from '@/views/search_config/search_sql'
import SearchField from '@/views/search_config/search_field'
import SearchStep from '@/views/search_config/search_step'

export default {
  name: 'SearchConfig',
  components: { SearchStep, SearchField, SearchSql, SearchCondition, Pagination },
  data() {
    return {
      /**
       * 全屏加载中是否显示
       */
      fullscreenLoading: false,
      /**
       * 搜索表单字段
       */
      searchForm: {},
      /**
       * 分页数据
       */
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      /**
       * 数据
       */
      data: {
        list: [],
        total: 0
      },
      /**
       * tableKey
       */
      tableKey: Math.random(),
      /**
       * 新增编辑的弹框显示与否
       */
      dialogFormVisible: false,
      /**
       * 窗口状态
       */
      dlgStatus: '',
      /**
       * 窗口状态映射
       */
      dlgStatusMap: {
        'update': '编辑',
        'create': '新增'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      let param = {}
      param = Object.assign(param, this.searchForm, this.page)
      this.fullscreenLoading = true
      getSearch(param).then(response => {
        this.data.list = response.data.list
        this.data.total = response.data.total
        setTimeout(() => {
          this.fullscreenLoading = false
          if (this.data.list.length) {
            this.$refs.dataTable.setCurrentRow(this.data.list[0])
          }
        }, 1.5 * 1000)
      })
    },
    currentChange(currentRow, oldRow) {
      this.$refs.searchCondition.setSearchId(currentRow.id)
      this.$refs.searchSql.setSearchId(currentRow.id)
      this.$refs.searchField.setSearchId(currentRow.id)
    },
    add() {
      this.dlgStatus = 'create'
      this.dialogFormVisible = true
      setTimeout(() => {
        this.$refs.dlg.setFormData(this.resetTemp(), this.dlgStatus)
      }, 100)
    },
    resetTemp() {
      return {
      }
    },
    edit(rowData) {
      this.dlgStatus = 'update'
      this.dialogFormVisible = true
      setTimeout(() => {
        this.$refs.dlg.setFormData(rowData.row, this.dlgStatus)
      }, 100)
    },
    success() {
      this.dialogFormVisible = false
      this.getList()
    },
    statusChange(rowData) {
      if (rowData.row.usable === '0') {
        searchUsable(rowData.row.id, rowData.row.version).then(res => {})
        this.getList()
      } else {
        searchDisable(rowData.row.id, rowData.row.version).then(res => {})
        this.getList()
      }
    }
  }
}
</script>

<style scoped>

</style>
