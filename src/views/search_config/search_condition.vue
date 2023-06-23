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
      <el-table-column :label="$t('searchCondition.id')" prop="id" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchCondition.name')" prop="name" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchCondition.display')" prop="display" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchCondition.datatype')" prop="datatype" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchCondition.conditionType')" prop="condition_type" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchCondition.dateDefault')" prop="date_default" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchCondition.fuzzyQuery')" prop="fuzzy_query" header-align="center" align="center" min-width="80" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-tag v-if="rowData.row.fuzzy_query === '1'">支持</el-tag>
          <el-tag v-else type="warning">不支持</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('searchCondition.required')" prop="required" header-align="center" align="center" min-width="80" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-tag v-if="rowData.row.required === '1'">支持</el-tag>
          <el-tag v-else type="warning">不支持</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('searchCondition.listValues')" header-align="center" align="center" min-width="40" show-overflow-tooltip>
        <template slot-scope="rowData">
          <el-button v-show="rowData.row.datatype === 'list'" type="primary" size="mini" @click="look(rowData)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('searchCondition.order')" prop="order" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchCondition.createTime')" prop="create_time" header-align="center" align="center" min-width="80" show-overflow-tooltip />
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
