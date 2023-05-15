<template>
  <div>
    <el-table
      :key="tableKey"
      :data="list"
      tooltip-effect="dark"
      height="30vh"
      border
      fit
      :row-key="record => record.id"
      highlight-current-row
    >
      <el-table-column label="id" prop="id" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="名称" prop="name" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="展示名" prop="display" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="数据类型" prop="datatype" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="条件类型" prop="condition_type" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="时间类型" prop="date_default" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="模糊查询" prop="datatype" header-align="center" align="center" min-width="80" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-tag v-if="rowData.row.fuzzy_query === '1'">支持</el-tag>
          <el-tag v-else type="warning">不支持</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下拉框" header-align="center" align="center" min-width="40" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-button v-show="rowData.row.datatype === 'list'" type="primary" size="mini" @click="look(rowData)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="排序号" prop="order" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="create_time" header-align="center" align="center" min-width="80" show-overflow-tooltip />
    </el-table>

    <el-dialog v-if="expFormVisible" :visible.sync="expFormVisible">
      <common-editor
        v-model="expression"
        language="sql"
      />
    </el-dialog>
  </div>
</template>

<script>

import { getSearchCondition } from '@/api/search_config'
import CommonEditor from '@/components/CommonEditor'

export default {
  name: 'SearchCondition',
  components: { CommonEditor },
  data() {
    return {
      /**
       * 数据
       */
      list: [],
      /**
       * tableKey
       */
      tableKey: Math.random(),
      /**
       * 语句窗口是否可以见
       */
      expFormVisible: false
    }
  },
  methods: {
    setSearchId(searchId) {
      getSearchCondition(searchId).then(res => {
        this.list = res.data
      })
    },
    look(rowData) {
      this.expFormVisible = true
      this.expression = rowData.row.list_values
    }
  }
}
</script>

<style scoped>

</style>
