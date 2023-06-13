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
      <el-table-column :label="$t('searchSort.id')" prop="id" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchSort.fieldName')" prop="field_name" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchSort.rule')" prop="rule" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchSort.order')" prop="order" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column :label="$t('searchSort.createTime')" prop="create_time" header-align="center" align="center" min-width="80" show-overflow-tooltip />
    </el-table>

  </div>
</template>

<script>
import { getSearchSort } from '@/api/search_config'
export default {
  name: 'SearchSort',
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
      expFormVisible: false,
      /**
       * exp
       */
      expression: ''
    }
  },
  methods: {
    setSearchId(searchId) {
      getSearchSort(searchId).then(res => {
        this.list = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
