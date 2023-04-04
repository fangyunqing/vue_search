<template>
  <div>
    <div>
      <el-tag v-for="item in conditions" :key="item" style="margin-right: 2px">{{ item }}</el-tag>
    </div>

    <el-divider />

    <card-edit
      v-model="value"
      pre-step-visible
      next-step-visible
      :rules="rules"
      @preStep="preStep"
      @nextStep="nextStep"
    >
      <template slot="title" slot-scope="itemData">
        <div style="margin-top: 5px">
          <el-tag v-for="item in getFields(itemData)" :key="item" style="margin-right: 2px">
            {{ item }}
          </el-tag>
        </div>
      </template>
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
            <el-form-item label="sql语句" prop="expression">
              <common-editor
                v-model.trim="itemData.item.expression"
                language="sql"
                :hint-options="hitOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="连接方式" prop="how">
              <el-select v-model.trim="itemData.item.how" placeholder="请选择">
                <el-option
                  v-for="dt in howMap"
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
  name: 'SearchSqlDlg',
  components: { CardEdit, CommonEditor },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    conditions: {
      type: Array,
      default: () => []
    },
    results: {
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
        expression: [
          { required: true, message: '请输入sql语句', trigger: 'blur' }
        ],
        order: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ],
        how: [
          { pattern: specificationRegExp, message: '请输入合法字符', trigger: 'change' },
          { required: true, message: '请选择连接方式', trigger: 'blur' }
        ]
      },
      /**
       * 类型
       */
      howMap: [
        {
          key: 'left',
          value: 'left'
        },
        {
          key: 'right',
          value: 'right'
        },
        {
          key: 'inner',
          value: 'inner'
        },
        {
          key: 'outer',
          value: 'outer'
        }
      ],
      /**
       * Hit
       */
      hitOptions: {
        tables: {
          condition: this.conditions,
          result: this.results
        }
      }
    }
  },
  methods: {
    preStep() {
      this.$emit('preStep')
    },
    nextStep() {
      this.results.splice(0, this.results.length)
      const parser = require('js-sql-parser')
      this.value.forEach(item => {
        const from_location = item.expression.search(/from\b/i)
        let expression = item.expression
        if (from_location > -1) {
          expression = expression.substring(0, from_location)
        }
        try {
          const ast = parser.parse(expression)
          ast.value.selectItems.value.forEach(item => {
            const field_name = (item.alias || item.value).split('.').reverse()[0]
            this.results.push(field_name)
          })
          // eslint-disable-next-line no-empty
        } catch (e) {
        }
      })
      this.$emit('nextStep')
    },
    getFields(itemData) {
      const parser = require('js-sql-parser')
      if (itemData.item.expression?.length > 0) {
        const from_location = itemData.item.expression.search(/from\b/i)
        let expression = itemData.item.expression
        if (from_location > -1) {
          expression = expression.substring(0, from_location)
        }
        try {
          const ast = parser.parse(expression)
          const fields = []

          ast.value.selectItems.value.forEach(item => {
            const field_name = (item.alias || item.value).split('.').reverse()[0]
            fields.push(field_name)
          })
          return fields
          // eslint-disable-next-line no-empty
        } catch (e) {
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
