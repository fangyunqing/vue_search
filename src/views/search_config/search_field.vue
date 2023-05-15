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
      <el-table-column label="依赖字段" prop="result_fields" header-align="center" align="center" min-width="80" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-tag
            v-for="item in rowData.row.result_fields"
            :key="item"
            style="margin-right: 2px;margin-bottom: 2px"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="py函数" header-align="center" align="center" min-width="40" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-button type="primary" size="mini" @click="look(rowData)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="排序号" prop="order" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="create_time" header-align="center" align="center" min-width="80" show-overflow-tooltip />
    </el-table>

    <el-dialog v-if="expFormVisible" :visible.sync="expFormVisible">
      <common-editor
        :value="exp"
        language="python"
      />
    </el-dialog>

  </div>
</template>

<script>

import { getSearchField } from '@/api/search_config'
import CommonEditor from '@/components/CommonEditor'

export default {
  name: 'SearchField',
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
       * exp
       */
      exp: '',
      /**
       * 语句窗口是否可以见
       */
      expFormVisible: false
    }
  },
  methods: {
    setSearchId(searchId) {
      getSearchField(searchId).then(res => {
        this.list = res.data
      })
    },
    look(rowData) {
      this.expFormVisible = true
      this.exp = rowData.row.rule
    }
  }
}
</script>

<style scoped>

</style>
