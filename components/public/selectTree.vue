<template>
  <div>
    <el-select
      style="width:100%"
      v-model="formItem[item.key]"
      clearable
      placeholder="请选择"
      @change="formChange($event,item)"
      @clear="handleClear"
      :ref="formItem[item.key]+'_treeSelect'"
    >
      <el-option hidden :value="formItem[item.key]" ></el-option>
      <ui-tree :ref="item.key+'_tree'" :treeObj="item.treeObj" @getNodeData="clickTree"></ui-tree>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    formObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    },
    formItem: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    formChange(event, item) {
      this.$emit("formChange", event, item, item.key);
    },
    handleClear() {
      let tree = this.$refs[this.item.key+'_tree'].$refs[this.item.treeObj.key]
      this.$set(this.formItem,this.item.key,null);
      tree.setCurrentKey(null)
    },
    clickTree(data) {
      let input = this.$refs[this.formItem[this.item.key]+'_treeSelect']
      this.$set(this.formItem,this.item.key,data[this.item.treeObj.defaultProps.label]);
      input.blur()
    }
  }
};
</script>