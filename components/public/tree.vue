//树组件
/*
key:'' //必填项，唯一值，用于区分不同的tre
treeDeptData: //tree树值
checkedKeys: 默认勾选上的key

expandAll:true //是否展开全部的
showCheckbox：true //是否显示checkbox
checkOnClickNode: true//是否在点击节点的时候选中节点
checkStrictly:true //在显示复选框的情况下，是否严格的遵循父子不互相关联的做法,默认为false,父子是关联的
defaultProps //配置选项
filterNode //对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
*/
<template>
 <div>
    <el-input
      v-if='treeObj.isShowInput?treeObj.isShowInput:false'
      :placeholder="treeObj.placeholder?treeObj.placeholder:'请输入名称或code进行筛选'"
      v-model="filterText"
      @input="test">
    </el-input>
    <el-tree
      :ref="treeObj.key?treeObj.key:'eltree'"
      class="filter-tree"
      node-key="id"
      :data="treeObj.treeDeptData?treeObj.treeDeptData:[]"
      :default-checked-keys="treeObj.checkedKeys?treeObj.checkedKeys:[]"
      :props="treeObj.defaultProps?treeObj.defaultProps:defaultProps"
      :load="loadNode"
      :filter-node-method="treeObj.filterNode"

      :default-expanded-keys="treeObj.expandKeys?treeObj.expandKeys:[]"
      :default-expand-all="treeObj.expandAll?treeObj.expandAll:false"
      :show-checkbox="treeObj.showCheckbox?treeObj.showCheckbox:false"
      :check-on-click-node="treeObj.checkOnClickNode?treeObj.checkOnClickNode:false"
      :check-strictly="treeObj.checkStrictly?treeObj.checkStrictly:false"
      :expand-on-click-node="(treeObj.expandOnClickNode == undefined || treeObj.expandOnClickNode)?true:false"
      :lazy="treeObj.lazy?treeObj.lazy:false"
      highlight-current
      @node-click="getNodeData"
      @check-change="checkChange"
      style="width:100%">
        <template v-if="treeObj.treeSlot?treeObj.treeSlot:false" v-slot="{ node }">
          <slot name="treeButton" :node="node"></slot>
        </template>
    </el-tree>
  </div>
</template>

<script>
export default {
  name:'uiTree',
  props:{
    treeObj:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      filterText:'',//过滤
    }
  },
  watch:{
    treeObj:{
      handler(newVal, oldVal)
      {
        // console.log('hahahahahahahah');
      },
      deep:true
    },
  },
  created() {
    // console.log(this.treeObj)
  },
  methods: {
    //输入过滤
    test(e){
      this.debounce(this.treeFilter,400,e)
    },
    treeFilter(val){
      this.$refs[this.treeObj.key].filter(val)
    },
    debounce(fn,wait,val) {
      let timer;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn(val);
      }, wait);
    },
    getNodeData(data){
      this.$emit('getNodeData',data)
    },
    loadNode(node, resolve) {
      this.$emit('loadNode',node, resolve)
    },
    checkChange(node, check, checked) {
      this.$emit('checkChange',node, check, checked)
    }
  },
}
</script>
