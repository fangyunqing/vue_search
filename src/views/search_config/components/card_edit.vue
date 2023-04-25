<template>
  <div style="height:40vh">
    <div>
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="name">
              <el-input v-model.trim="searchForm.name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="search">
                查询
              </el-button>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="add">
                增加
              </el-button>
              <el-button v-if="orderVisible" type="primary" size="small" icon="el-icon-thumb" @click="orderItem">
                排序
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-scrollbar ref="el_scroll" style="height:70%">
      <div v-for="wrapValue in wrapValueList" :key="wrapValue.key" ref="cards">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ cardTitle(wrapValue) }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="cardVisible(wrapValue)">{{ cardVisibleText(wrapValue) }}</el-button>
            <el-button style="float: right; padding: 3px 0" type="text" @click="cardDelete(wrapValue)">删除</el-button>
            <slot
              name="title"
              :item="wrapValue.item"
            />
          </div>
          <div v-show="wrapValue.visible">
            <el-form ref="dataForm" :model="wrapValue.item" :rules="rules" label-width="100px">
              <slot
                name="content"
                :item="wrapValue.item"
              />
            </el-form>
          </div>
        </el-card>
      </div>

    </el-scrollbar>

    <div style="margin-top: 10px; text-align: center">
      <el-row>
        <el-button v-if="preStepVisible" type="primary" @click="preStep">上一步</el-button>
        <el-button v-if="nextStepVisible" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="finishVisible" type="primary" @click="finish">完成</el-button>
      </el-row>

    </div>
  </div>
</template>

<script>
export default {
  name: 'CardEdit',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Object,
      default: () => {}
    },
    preStepVisible: {
      type: Boolean,
      default: false
    },
    nextStepVisible: {
      type: Boolean,
      default: false
    },
    finishVisible: {
      type: Boolean,
      default: false
    },
    orderVisible: {
      type: Boolean,
      default: false
    },
    resetEmpty: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      /**
       * 包装数据
       */
      wrapValueList: [],
      /**
       * 查询
       */
      searchForm: {}
    }
  },
  watch: {
    value: {
      handler() {
        this.wrapValueList = this.value.map(item => {
          return {
            item: item,
            key: this._.uniqueId(),
            visible: false
          }
        })
      },
      immediate: true
    },
    wrapValueList: {
      handler() {
        this.$emit('change', this.wrapValueList)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cardDelete(wrapValue) {
      this.$confirm('此操作将永久删除该选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.wrapValueList = this.wrapValueList.filter(wv => wv.key !== wrapValue.key)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
      this.scrollToWhere(this.wrapValueList.length - 1)
    },
    cardVisible(wrapValue) {
      wrapValue.visible = !wrapValue.visible
    },
    cardVisibleText(wrapValue) {
      return wrapValue.visible ? '隐藏' : '显示'
    },
    cardTitle(wrapValue) {
      return wrapValue.item.display + '(' + wrapValue.item.name + ')'
    },
    add() {
      this.wrapValueList.forEach(wv => { wv.visible = false })
      const new_item = this._.cloneDeep(this.resetEmpty || {})
      if (this.orderVisible) {
        const orderList = this.wrapValueList.map(wv => wv.item.order)
        new_item.order = this._.max(orderList)
        if (new_item.order) {
          new_item.order = new_item.order + 1
        }
      }
      this.wrapValueList.push({
        item: new_item,
        key: this._.uniqueId(),
        visible: true
      })

      this.scrollToWhere(this.wrapValueList.length - 1)
    },
    search() {
      if (this.searchForm.name) {
        const find = this.wrapValueList.find(wv => {
          return wv.item.name.indexOf(this.searchForm.name) > -1 | wv.item.display.indexOf(this.searchForm.name) > -1
        })

        if (find) {
          this.wrapValueList.forEach(wv => { wv.visible = false })
          find.visible = true
          this.scrollToWhere(this.wrapValueList.indexOf(find))
        }
      }
    },
    preStep() {
      this.$emit('preStep')
    },
    async nextStep() {
      if (await this.validate()) {
        this.syncValue()
        this.$emit('nextStep')
      }
    },
    async finish() {
      if (await this.validate()) {
        this.syncValue()
        this.$emit('finish')
      }
    },
    async validate() {
      if (this.wrapValueList.length === 0) {
        this.$message({
          type: 'error',
          message: '至少添加一项数据'
        })
        return false
      }
      const ret = []
      for (const wv of this.wrapValueList) {
        const index = this.wrapValueList.indexOf(wv)
        const p = await this.$refs.dataForm[index].validate().catch(err => err)
        if (!p) {
          wv.visible = true
        } else {
          ret.push(1)
        }
      }
      return ret.length === this.wrapValueList.length
    },
    syncValue() {
      this.value.splice(0, this.value.length)
      this.wrapValueList.forEach(wv => this.value.push(wv.item))
    },
    orderItem() {
      this.wrapValueList.sort((a, b) => {
        const ret = a.item.order - b.item.order
        if (ret > 0) {
          return 1
        } else if (ret < 0) {
          return -1
        } else {
          return 0
        }
      })
    },
    scrollToWhere(index) {
      this.$nextTick().then(() => {
        this.$refs.el_scroll.wrap.scrollTop = this.$refs.cards[index].offsetTop
      })
    }
  }
}
</script>

<style scoped>

</style>
