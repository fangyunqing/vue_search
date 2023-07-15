<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
    class="app-container"
  >
    <el-container>
      <el-aside>
        <div>
          <el-form ref="searchForm" :model="searchForm">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="name">
                  <el-input v-model.trim="searchForm.name" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="getList">
                    查询
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFunction">
                    增加
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteFunction">
                    删除
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-table
          ref="functionTable"
          :data="functionList"
          :show-header="false"
          highlight-current-row
          @row-dblclick="rowDoubleClick"
          @row-click="rowClock"
        >
          <el-table-column :label="$t('searchFunction.name')" prop="name" header-align="center" align="center" min-width="80" show-overflow-tooltip />
        </el-table>
      </el-aside>
      <el-main>
        <el-form ref="rowForm" :model="row" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('searchFunction.name')" prop="name">
                <el-input v-model.trim="row.name" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item :label="$t('searchFunction.display')" prop="display">
                <el-input v-model.trim="row.display" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="value">
                <common-editor
                  ref="editor"
                  v-model.trim="row.value"
                  language="python"
                  style="height: 50vh"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>

</template>

<script>

import CommonEditor from '@/components/CommonEditor'
import { saveFunction, searchFunction, searchFunctionById, deleteFunction } from '@/api/search_config'
import { specificationRegExp } from '@/utils/validate'

export default {
  name: 'SearchFunction',
  components: { CommonEditor },
  data() {
    return {
      /**
       * 规则
       */
      rules: {
        name: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        display: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入展示名', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入函数', trigger: 'blur' }
        ]
      },
      /**
       * 全屏加载中是否显示
       */
      fullscreenLoading: false,
      /**
       * 函数列表
       */
      functionList: [
        {
          name: 'getName',
          id: 1
        },
        {
          name: 'getValue',
          id: 2
        }
      ],
      /**
       * 选中行的信息
       */
      row: {},
      /**
       * 搜索表单字段
       */
      searchForm: {},
      /**
       * 选中行
       */
      currentRowIndex: -1

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      let param = {}
      param = Object.assign(param, this.searchForm)
      this.fullscreenLoading = true
      searchFunction(param).then(response => {
        this.functionList = response.data
        setTimeout(() => {
          this.fullscreenLoading = false
          if (this.functionList.length) {
            this.$refs.functionTable.setCurrentRow(this.functionList[0])
          }
        }, 1.5 * 1000)
      }).catch(error => this.fullscreenLoading = false)
    },
    save() {
      this.$refs.rowForm.validate((valid) => {
        if (valid) {
          saveFunction(this.row).then(response => {
            this.getList()
          })
        }
      })
    },
    emptySearchFunction() {
      return {
        name: '',
        display: '',
        value: '',
        version: 0
      }
    },
    addFunction() {
      this.$refs.editor.setCodeContent('')
      this.row = this.emptySearchFunction()
    },
    deleteFunction() {
      if (this.currentRowIndex !== -1) {
        deleteFunction(this.currentRowIndex).then(response => {
          this.getList()
        })
      }
    },
    rowClock(row, column, event) {
      this.currentRowIndex = row.id
    },
    rowDoubleClick(row, column, event) {
      searchFunctionById(row.id).then(response => {
        this.row = response.data
        this.$refs.editor.setCodeContent(this.row.value)
      })
    }
  }
}
</script>

<style scoped>
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  height: 85vh;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  height: 85vh;
}

</style>
