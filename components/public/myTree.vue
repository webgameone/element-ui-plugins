<template>
  <div>
    <el-input v-if="mysetting.showInput" v-model="input" placeholder="请输入内容" />
    <vue-magic-tree :setting="setting" :nodes="nodes" />
  </div>
</template>

<script>
// vue-magic-tree地址
// https://github.com/pengqiangsheng/vue-magic-tree
// ztree文档地址
// http://www.treejs.cn/v3/api.php

import vueMagicTree from 'vue-magic-tree'

export default {
  name: "uiMyTree",
  components: {
    // eslint-disable-next-line no-undef
    vueMagicTree
  },
  props: {
    setting: {
      type: Object,
      default: () => {
        return {}
      }
    },
    mysetting: {
      type: Object,
      default: () => {
        return {}
      }
    },
    list: {
      type: Array,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      input: '',
      nodes: this.list, // 当前展示的节点
      searchList: [] // 查询数据
    }
  },
  watch: {
    input(val) {
      this.inputChange(val)
    }
  },
  methods: {
    inputChange(val) {
      this.searchList = []
      if (val === '') {
        this.nodes = this.list
      } else {
        this.filterTree(this.list)
        this.nodes = this.searchList
      }
    },
    // 判断该根元素是否已添加
    isExist(cur) {
      if (this.searchList.length === 0) return false
      return this.searchList.some(item => {
        if (cur.path === '0|') {
          return item.id === cur.id
        } else {
          return item.id === `${cur.path.split('|')[1]}`
        }
      })
    },
    filterTree(list) {
      list.map(item => {
        const child = item[`${this.setting.data.key.children}`]
        if (
          !this.isExist(item) &&
          item[`${this.setting.data.key.name}`].indexOf(this.input) !== -1
        ) {
          this.searchList.push(this.getRoot(item))
        }
        if (!child || child === undefined) {
          return
        }
        this.filterTree(child)
      })
    },
    getRoot(cur) {
      let obj = {}
      if (cur.path === '0|') {
        obj = cur
      } else {
        this.list.map(item => {
          if (item.id === `${cur.path.split('|')[1]}`) {
            obj = item
          }
        })
      }
      return obj
    }
  }
}
</script>

