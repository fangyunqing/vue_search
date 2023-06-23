<template>
  <div>

    <div>
      <el-tag
        v-for="item in results"
        :key="item"
        style="margin-right: 2px;margin-bottom: 2px"
        :type="useField.indexOf(item) > -1 ? 'info' : 'primary'"
      >
        {{ item }}
      </el-tag>
    </div>

    <el-divider />

    <card-edit
      v-model="value"
      pre-step-visible
      next-step-visible
      finish-visible
      order-visible
      :rules="rules"
      :reset-empty="resetEmpty()"
      @preStep="preStep"
      @nextStep="nextStep"
      @change="valueChange"
      @finish="finish"
    >
      <template slot="content" slot-scope="itemData">
        <el-row>
          <el-col :span="10">
            <el-form-item label="名称" prop="name">
              <el-input v-model.trim="itemData.item.name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="展示名" prop="display">
              <el-input v-model.trim="itemData.item.display" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="依赖字段" prop="result_fields">
              <el-select
                v-model.trim="itemData.item.result_fields"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="dt in results"
                  :key="dt"
                  :label="dt"
                  :value="dt"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="py函数" prop="rule">
              <common-editor
                v-model.trim="itemData.item.rule"
                language="python"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="数据类型" prop="datatype">
              <el-select v-model.trim="itemData.item.datatype" placeholder="请选择">
                <el-option
                  v-for="dt in datatypeConditionMap"
                  :key="dt.key"
                  :label="dt.value"
                  :value="dt.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="排序号" prop="order">
              <el-input v-model.number="itemData.item.order" type="number" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </card-edit>
  </div>
</template>

<script>
import CardEdit from '@/views/search_config/components/card_edit'
import CommonEditor from '@/components/CommonEditor'
import { specificationRegExp } from '@/utils/validate'

export default {
  name: 'SearchFieldDlg',
  components: { CommonEditor, CardEdit },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    results: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
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
        order: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ],
        result_fields: [
          { required: true, message: '请输入依赖字段', trigger: 'blur' }
        ],
        datatype: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请选择数据类型', trigger: 'blur' }
        ]
      },
      /**
       * 类型
       */
      datatypeConditionMap: [
        {
          key: 'str',
          value: '字符串'
        },
        {
          key: 'int',
          value: '整形'
        },
        {
          key: 'float',
          value: '浮点'
        },
        {
          key: 'date',
          value: '日期'
        },
        {
          key: 'datetime',
          value: '日期时间'
        }
      ],
      /**
       * 使用过的字段
       */
      useField: []
    }
  },
  methods: {
    preStep() {
      this.$emit('preStep')
    },
    nextStep() {
      this.fields.splice(0, this.results.length)
      this.value.forEach(item => {
        this.fields.push({
          name: item.name,
          display: item.display
        })
      })
      this.$emit('nextStep')
    },
    resetEmpty() {
      return {
        visible: '1'
      }
    },
    valueChange(wrapValueList) {
      this.useField.splice(0, this.useField.length)
      wrapValueList.forEach(wv => {
        wv.item.result_fields.forEach(f => this.useField.push(f))
      })
    },
    finish() {
      this.$emit('finish')
    }
  }
}
</script>

<style scoped>

</style>
