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
        <el-col :span="5">
          <el-form-item :label="$t('searchParameter.display')" prop="display">
            <el-input v-model.trim="searchForm.display" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('searchParameter.name')" prop="name">
            <el-input v-model.trim="searchForm.name" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">
              查询
            </el-button>
            <el-button type="danger" icon="el-icon-refresh" @click="reset">
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
    >
      <el-table-column :label="$t('searchParameter.name')" prop="name" header-align="center" align="center" width="120" show-overflow-tooltip />
      <el-table-column :label="$t('searchParameter.display')" prop="display" header-align="center" align="center" width="120" show-overflow-tooltip />
      <el-table-column :label="$t('searchParameter.value')" prop="value" header-align="center" align="center" width="200" show-overflow-tooltip />
      <el-table-column :label="$t('searchParameter.version')" prop="version" header-align="center" align="center" width="200" show-overflow-tooltip />
      <el-table-column :label="$t('searchParameter.memo')" prop="memo" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column fixed="right" align="center" label="" min-width="20" show-overflow-tooltip>
        <template slot-scope="rowData">
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

    <el-dialog v-if="dialogFormVisible" :visible.sync="dialogFormVisible" title="编辑" :close-on-click-modal="false" :modal-append-to-body="false">
      <search-parameter-edit ref="dlg" @submit-success="submitSuccess" />
    </el-dialog>
  </div>
</template>

<script>

import { searchParameter } from '@/api/search_config'
import SearchParameterEdit from '@/views/search_parameter/edit'
import Pagination from '@/components/Pagination'

export default {
  name: 'SearchParameter',
  components: { SearchParameterEdit, Pagination },
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
       * 编辑窗口
       */
      dialogFormVisible: false
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
      searchParameter(param).then(response => {
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
    search() {
      this.page.pageNumber = 1
      this.getList()
    },
    reset() {
      this.page.pageNumber = 1
      for (const key in this.searchForm) {
        this.searchForm[key] = ''
      }
      this.getList()
    },
    edit(rowData) {
      this.dialogFormVisible = true
      setTimeout(() => {
        this.$refs.dlg.setFormData(rowData.row)
      }, 100)
    },
    submitSuccess() {
      this.dialogFormVisible = false
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
