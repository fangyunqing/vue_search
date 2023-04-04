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
      <el-table-column label="排序号" prop="order" header-align="center" align="center" min-width="80" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="create_time" header-align="center" align="center" min-width="80" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script>

import { getSearchCondition } from '@/api/search_config'

export default {
  name: 'SearchCondition',
  data() {
    return {
      /**
       * 数据
       */
      list: [],
      /**
       * tableKey
       */
      tableKey: Math.random()
    }
  },
  methods: {
    setSearchId(searchId) {
      getSearchCondition(searchId).then(res => {
        this.list = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
