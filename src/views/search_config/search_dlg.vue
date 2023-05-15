<template>
  <div>
    <el-form ref="form" :model="value" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="value.name" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="展示名" prop="display">
            <el-input v-model.trim="value.display" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="页条数" prop="page_size">
            <el-input v-model.number="value.page_size" clearable type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="top" prop="top">
            <el-input v-model.number="value.top" clearable type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="redis缓存时间(秒)" prop="redis_cache_time">
            <el-input v-model.number="value.redis_cache_time" clearable type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="文件缓存阀值" prop="want_csv">
            <el-input v-model.number="value.file_cache_limit" clearable type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="导出文件大小" prop="export_single_size">
            <el-input v-model.number="value.export_single_size" clearable type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="缓存页数" prop="pages">
            <el-input v-model.number="value.pages" clearable type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="导出文件类型" prop="export_file_type">
            <el-select v-model.trim="value.export_file_type" placeholder="请选择">
              <el-option
                v-for="item in exportFileTypeList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="文件缓存时间(分钟)" prop="export_file_cache_time">
            <el-input v-model.number="value.export_file_cache_time" clearable type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="可用" prop="usable">
            <el-switch
              v-model.trim="value.usable"
              active-value="1"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top: 5px; text-align: center">
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>
  </div>

</template>

<script>
import { specificationRegExp } from '@/utils/validate'

export default {
  name: 'SearchDlg',
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        name: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        display: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入展示名', trigger: 'blur' }
        ],
        page_size: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入页条数', trigger: 'blur' }
        ],
        top: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入top', trigger: 'blur' }
        ],
        redis_cache_time: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入redis缓存时间', trigger: 'blur' }
        ],
        file_cache_limit: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入csv阀值', trigger: 'blur' }
        ],
        export_single_size: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入导出文件大小', trigger: 'blur' }
        ],
        pages: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入缓存页数', trigger: 'blur' }
        ],
        export_file_type: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入导出文件类型', trigger: 'blur' }
        ],
        export_file_cache_time: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入文件缓存时间', trigger: 'blur' }
        ]
      },
      /**
       * 导出文件映射
       */
      exportFileTypeList: [
        {
          key: 'xlsx',
          value: 'xlsx'
        },
        {
          key: 'csv',
          value: 'csv'
        }
      ]
    }
  },
  methods: {
    nextStep() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('nextStep')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
