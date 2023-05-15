<template>
  <div>
    <card-edit
      v-model="value"
      pre-step-visible
      next-step-visible
      order-visible
      :reset-empty="resetEmpty()"
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
        <el-row v-show="itemData.item.datatype === 'list' || itemData.item.datatype === 'lookup' ">
          <el-col :span="20">
            <el-form-item label="下拉框值" prop="list_values">
              <common-editor
                v-model.trim="itemData.item.list_values"
                language="sql"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="模糊查询" prop="fuzzy_query">
              <el-switch
                v-model.trim="itemData.item.fuzzy_query"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="条件类型" prop="datatype">
              <el-select v-model.trim="itemData.item.condition_type" placeholder="请选择">
                <el-option
                  v-for="dt in conditionTypeMap"
                  :key="dt.key"
                  :label="dt.value"
                  :value="dt.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-show="itemData.item.datatype === 'date'" :span="10">
            <el-form-item label="日期默认值" prop="date_default">
              <el-select v-model.trim="itemData.item.date_default" placeholder="请选择">
                <el-option
                  v-for="dt in dateShowMap"
                  :key="dt.key"
                  :label="dt.value"
                  :value="dt.key"
                />
              </el-select>
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
        condition_type: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请选择条件类型', trigger: 'blur' }
        ],
        order: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ],
        fuzzy_query: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请选择是否支持模糊查询', trigger: 'blur' }
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
        },
        {
          key: 'lookup',
          value: '查找(lookup)'
        }
      ],
      /**
       * 日期的显示类型
       */
      dateShowMap: [
        {
          key: 'blank',
          value: '不显示'
        },
        {
          key: 'today',
          value: '今天'
        },
        {
          key: 'yesterday',
          value: '昨天'
        },
        {
          key: 'week',
          value: '一周前'
        },
        {
          key: 'month',
          value: '一个月前'
        },
        {
          key: 'quarter',
          value: '一个季度前'
        },
        {
          key: 'half of year',
          value: '半年前'
        },
        {
          key: 'year',
          value: '一年前'
        }
      ],
      /**
       * 条件类型
       */
      conditionTypeMap: [
        {
          key: 'normal',
          value: '普通'
        },
        {
          key: 'time',
          value: '时间'
        }
      ]
    }
  },
  methods: {
    preStep() {
      this.$emit('preStep')
    },
    nextStep() {
      this.conditions.splice(0, this.conditions.length)
      this.value.forEach(v => this.conditions.push(v.name))
      this.$emit('nextStep')
    },
    resetEmpty() {
      return {
        fuzzy_query: '0',
        condition_type: 'normal'
      }
    }
  }
}
</script>

<style scoped>

</style>
