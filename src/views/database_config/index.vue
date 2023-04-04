<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
    class="app-container"
  >
    <el-row class="operate-nav">
      <el-button type="primary" @click="add">新增</el-button>
    </el-row>
    <el-table
      :key="tableKey"
      :data="list"
      tooltip-effect="dark"
      height="50vh"
      border
      fit
      :row-key="record => record.id"
      highlight-current-row
    >
      <el-table-column label="id" prop="id" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="名称" prop="name" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="数据库名称" prop="db_name" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="ip" prop="ip" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="端口" prop="port" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="数据库类型" prop="db_type" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="用户名" prop="user_name" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="密码" prop="password" header-align="center" align="center" min-width="80" show-overflow-tooltip>
        <template slot-scope="{}">
          <span>******</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="可用" prop="usable" header-align="center" align="center" min-width="80" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-tag v-if="rowData.row.usable === '1'">可用</el-tag>
          <el-tag v-else type="warning">停用</el-tag>
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

    <el-dialog :visible.sync="dialogFormVisible" :title="dlgStatusMap[dlgStatus]" :close-on-click-modal="false">
      <database-dlg ref="dlg" @submit-success="submitSuccess" />
    </el-dialog>
  </div>
</template>

<script>
import { getSearchDatasource, datasourceUsable, datasourceDisable } from '@/api/search_config'
import DatabaseDlg from '@/views/database_config/database_dlg'

export default {
  name: 'DatabaseConfig',
  components: { DatabaseDlg },
  data() {
    return {
      /**
       * 全屏加载中是否显示
       */
      fullscreenLoading: false,
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
      },
      /**
       * tableKey
       */
      tableKey: Math.random(),
      /**
       * 数据
       */
      usableMap: {
        '0': '停用',
        '1': '可用'
      },
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.fullscreenLoading = true
      getSearchDatasource().then(response => {
        this.list = response.data
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 1.5 * 1000)
      })
    },
    statusChange(rowData) {
      if (rowData.row.usable === '1') {
        datasourceDisable(rowData.row.id).then(res => {
          this.getList()
        })
      } else {
        datasourceUsable(rowData.row.id).then(res => {
          this.getList()
        })
      }
    },
    submitSuccess() {
      this.dlgStatus = ''
      this.dialogFormVisible = false
      this.getList()
    },
    edit(rowData) {
      this.dlgStatus = 'update'
      this.dialogFormVisible = true
      setTimeout(() => {
        this.$refs.dlg.setFormData(rowData.row, this.dlgStatus)
      }, 100)
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
        usable: '1',
        user_name: '',
        password: ''
      }
    }
  }

}
</script>

<style scoped>
</style>
