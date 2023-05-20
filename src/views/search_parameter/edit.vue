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
        <el-col :span="12">
          <el-form-item :label="$t('searchParameter.name')+'：'" prop="name">
            {{ row.name }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('searchParameter.display')+'：'" prop="display">
            {{ row.display }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('searchParameter.value')+'：'" prop="value">
            <el-input v-model.trim="row.value" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('searchParameter.version')+'：'" prop="version">
            {{ row.version }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('searchParameter.memo')+'：'" prop="memo">
            <el-input v-model.trim="row.memo" type="textarea" :rows="2" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item>
            <el-button type="primary" @click="ok">确认</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import { specificationRegExp } from '@/utils/validate'
import { modifySearchParameter } from '@/api/search_config'

export default {
  name: 'SearchParameterEdit',
  data() {
    return {
      /**
       * 全屏加载
       */
      fullscreenLoading: false,
      /**
       * 数据
       */
      row: {},
      /**
       * 规则
       */
      rules: {
        value: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入值', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    setFormData(row) {
      this.row = Object.assign({}, row)
    },
    ok() {
      this.$refs.form.validate((valid) => { // 校验
        if (valid) {
          this.fullscreenLoading = true
          modifySearchParameter(this.row).then(res => {
            this.fullscreenLoading = false
            this.$emit('submit-success')
          }).catch(error => this.fullscreenLoading = false)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
