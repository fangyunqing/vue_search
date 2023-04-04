<template>
  <div>
    <card-edit
      v-model="value"
      pre-step-visible
      next-step-visible
      order-visible
      :rules="rules"
      @preStep="preStep"
      @nextStep="nextStep"
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
        <el-row>
          <el-col :span="20">
            <el-form-item label="下拉框值" prop="list_values">
              <common-editor
                v-model.trim="itemData.item.list_values"
                language="sql"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </card-edit>
  </div>
</template>

<script>

import CardEdit from '@/views/search_config/components/card_edit'
import { specificationRegExp } from '@/utils/validate'
import CommonEditor from '@/components/CommonEditor'

export default {
  name: 'SearchConditionDlg',
  components: { CardEdit, CommonEditor },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    conditions: {
      type: Array,
      default: () => []
    }
  },
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
        datatype: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请选择数据类型', trigger: 'blur' }
        ],
        order: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入排序号', trigger: 'blur' }
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
          key: 'list',
          value: '列表'
        }
      ]
    }
  },
  methods: {
    preStep() {
      this.$emit('preStep')
    },
    nextStep() {
      this.$emit('nextStep')
    }
  }
}
</script>

<style scoped>

</style>
