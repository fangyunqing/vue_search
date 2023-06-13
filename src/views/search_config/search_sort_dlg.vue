<template>
  <div>
    <div>
      <el-tag
        v-for="item in fields"
        :key="item.name"
        style="margin-right: 2px;margin-bottom: 2px"
      >
        {{ item.display }}({{ item.name }})
      </el-tag>
    </div>

    <el-divider />

    <card-edit
      v-model="value"
      pre-step-visible
      finish-visible
      order-visible
      :rules="rules"
      :reset-empty="resetEmpty()"
      @preStep="preStep"
      @finish="finish"
      @change="valueChange"
    >
      <template slot="content" slot-scope="itemData">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('searchSort.fieldName')" prop="field_name">
              <el-select
                v-model.trim="itemData.item.field_name"
                filterable
                default-first-option
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="dt in fields"
                  :key="dt.name"
                  :label="dt.display"
                  :value="dt.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('searchSort.rule')" prop="rule">
              <el-select
                v-model.trim="itemData.item.rule"
                filterable
                default-first-option
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="dt in ruleMap"
                  :key="dt.key"
                  :label="dt.value"
                  :value="dt.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
export default {
  name: 'SearchSortDlg',
  components: { CardEdit },
  props: {
    value: {
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
      /**
       * 规则
       */
      rules: {},
      /**
       * 类型
       */
      ruleMap: [
        {
          key: 'asc',
          value: '升序'
        },
        {
          key: 'desc',
          value: '降序'
        }
      ]
    }
  },
  methods: {
    preStep() {
      this.$emit('preStep')
    },
    finish() {
      this.$emit('finish')
    },
    resetEmpty() {
      return {
        rule: 'asc'
      }
    },
    valueChange(wrapValueList) {
      wrapValueList.forEach(wv => {
        if (wv.item.field_name) {
          wv.item.name = wv.item.field_name
          const findField = this.fields.find(field => field.name === wv.item.name)
          if (findField) {
            wv.item.display = findField.display
          } else {
            wv.item.display = '_'
          }
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
