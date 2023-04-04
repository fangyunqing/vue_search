<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
    class="app-container"
  >
    <el-form ref="form" :model="row" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="row.name" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="数据库名称" prop="db_name">
            <el-input v-model.trim="row.db_name" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="数据库类型" prop="db_type">
            <el-select v-model.trim="row.db_type" placeholder="请选择">
              <el-option
                v-for="item in dbTypeList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="ip" prop="ip">
            <el-input v-model.trim="row.ip" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="端口" prop="port">
            <el-input v-model.number="row.port" clearable type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="账户" prop="user_name">
            <el-input v-model.trim="row.user_name" clearable auto-complete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="row.password" clearable show-password auto-complete="new-password" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="可用" prop="usable">
            <el-switch
              v-model.trim="row.usable"
              active-value="1"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item prop="remark">
            <el-input v-model.trim="row.remark" clearable rows="3" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item prop="major">
            <el-button type="primary" @click="handle">{{ statusMap[status] }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import { specificationRegExp } from '@/utils/validate'
import { datasourceAdd, datasourceModify } from '@/api/search_config'

export default {
  name: 'DatabaseDlg',
  data() {
    return {
      /**
       * 全屏加载中是否显示
       */
      fullscreenLoading: false,
      /**
       * 表单数据
       */
      row: {},
      /**
       * 状态
       */
      status: '',
      /**
       * 状态映射
       */
      statusMap: {
        'update': '更新',
        'create': '创建'
      },
      /**
       * 数据库类型
       */
      dbTypeList: [
        {
          key: 'sqlserver',
          value: 'sqlserver'
        },
        {
          key: 'oracle',
          value: 'oracle'
        },
        {
          key: 'mysql',
          value: 'mysql'
        }
      ],
      /**
       * 校验规则
       */
      rules: {
        name: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        db_name: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入数据库名称', trigger: 'blur' }
        ],
        db_type: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入数据库类型', trigger: 'blur' }
        ],
        ip: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入ip', trigger: 'blur' }
        ],
        port: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        user_name: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        remark: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    setFormData(row, status) {
      this.row = Object.assign({}, row)
      this.status = status
    },
    handle() {
      this.$refs.form.validate((valid) => { // 校验
        if (valid) {
          this.fullscreenLoading = true
          if (this.status === 'create') {
            datasourceAdd(this.row).then(res => {
              this.fullscreenLoading = false
              this.$emit('submit-success')
            }).catch(error => this.fullscreenLoading = false)
          } else if (this.status === 'update') {
            datasourceModify(this.row).then(res => {
              this.fullscreenLoading = false
              this.$emit('submit-success')
            }).catch(error => this.fullscreenLoading = false)
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
