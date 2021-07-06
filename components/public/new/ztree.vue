// z-tree的测试页面
<template>
  <div class="ztree-wrapper">
    <el-input
      v-if="(treeProps.input.show || treeProps.input.show == undefined) ? true : false"
      :style="{width:treeProps.input.width?treeProps.input.width:'50%'}"
      class="treeInput"
      v-model="keyValue"
      :disabled="treeProps.input.disabled ? treeProps.input.disabled : false"
      :placeholder="treeProps.input.placeholder?treeProps.input.placeholder:'请输入内容'"
    ></el-input>
    <div class="ztree-box">
      <div v-show="noData">未找到对应条目</div>
      <ul :id="treeProps.id" class="ztree" ref="ztree"></ul>
    </div>
  </div>
</template>

<script>
import { data } from '@/utils/ztreeData2.json'
export default {
  name:'uiZtree',
  props:{
    treeProps:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    // setting:{
    //   type: Object,
    //   require: false,
    //   default: function () {
    //     return {};
    //   },
    // }
  },
  data () {
    return {
      keyValue: '',
      noData: false,
      treeObj: '',
      nodes: [],
      allNodes: [],
      nodesShow: [],
      treeDefaultSetting: {
          data:{
            key:{
              children: "children",
              name:'name',
            },
            simpleData:{
              enable: true,
              idKey: 'id',
              pIdKey: 'pid',
              rootPId: 0,
            }
          },
          check: {
            enable: false //是否开启checkbox
          },
          view: {
            nameIsHTML: true,
            selectedMulti: false,
            showLine: true, //显示连线
            fontCss : {color:"#676767"},//文字样式
            dblClickExpand:true,//双击展开子节点
            showIcon:false //显示图标
          },
          edit: {
            enable: false,
            editNameSelectAll: false
          }
      },
      newSetting:{}
    }
	  },
	  watch: {
	    keyValue (newV) {
	      this.searchFun(newV, true, true)
	    },
      treeProps:{
        handler(newVal){
          this.initzTree()
        },
        deep:true,
        immediate:true
      }
	  },
	  mounted () {
      this.$nextTick(()=>{
        //测试初始化tree
        // this.initzTree()
      })
	  },
	  methods: {
	    initzTree () {
        //初始化ztree      http://www.treejs.cn/v3/api.php
        //父级的tree配置
        this.newSetting = {};
        let testSetting =  {
            data:{
              key:{
                children: "childMenu", //children的字段名
                name:'name',//name的字段名
              },
              simpleData:{
                enable: true,
                idKey: 'id',
                pIdKey: 'pId',
                rootPId: 0,
              }
            },
            check: {
              enable: false //是否开启checkbox
            },
            view: {
              nameIsHTML: true,
              selectedMulti: false,
              showLine: true, //显示连线
              fontCss : {color:"#676767"},//文字样式
              dblClickExpand:true,//双击展开子节点
              showIcon:false //显示图标
            },
            edit: {
              enable: false,
              editNameSelectAll: false
            }
        }

        //正式
        Object.assign(this.newSetting, this.treeDefaultSetting, this.treeProps.setting);
        this.treeObj = $.fn.zTree.init($("#"+this.treeProps.id), this.newSetting, this.treeProps.data)

        //测试
        // Object.assign(this.newSetting, this.treeDefaultSetting, testSetting);
        // this.treeObj = $.fn.zTree.init($("#"+this.treeProps.id), this.newSetting, data)

        let nodes = this.treeObj.getNodes()
        //默认展开第一个
        this.treeObj.expandNode(nodes[0])
        //将所有节点存储起来
        this.allNodes = this.queryFun(nodes)

        //全部展开
        // this.treeObj.expandAll(true)
	    },
	    queryFun(node) {
        // console.log(node);
	      for (var i in node) {
	        this.nodes.push(node[i])
	        if (node[i][this.newSetting.data.key.children]) {
	          this.queryFun(node[i][this.newSetting.data.key.children])
	        }
	      }
	      return this.nodes
	    },
	    searchFun (val, isHighLight, isExpand) {
        //正则
	      let key = val.replace(/(^\s*)|(\s*$)/g, "");
        //需要展示的节点
	      this.nodesShow = [];
        //是否高亮显示
	      isHighLight = isHighLight === false ? false : true
        //是否展开
	      isExpand = isExpand ? true : false
        //过滤树
	      this.filterzTree(key, this.allNodes, isExpand, isHighLight);

	      if (this.keyValue === '') {
	        this.noData = false
	      } else {
	        if (this.nodesShow.length === 0) {
	          this.noData = true
	        } else {
	          this.noData = false
	        }
	      }
	      this.showNodesFun(this.nodesShow, key)
	    },
      //过滤树
	    filterzTree(key, nodes, isExpand, isHighLight) {
	      let metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'
		    let rexMeta = new RegExp(metaChar, 'gi')
        //获取name得字段值
	      let nameKey = this.treeObj.setting.data.key.name;

	      for (var i =0; i < nodes.length; i++) {
	        if (nodes[i] && nodes[i].oldname && nodes[i].oldname.length > 0) {
	          nodes[i][nameKey] = nodes[i].oldname;
	        }
          // if (nodes[i] && nodes[i][nameKey] && nodes[i][nameKey].length > 0) {
	        //   nodes[i][nameKey] = nodes[i][nameKey];
	        // }
	        this.treeObj.updateNode(nodes[i])

	        if (key === '') {
	          this.initzTree()
	          break
	        } else {
	          if (nodes[i][nameKey] && nodes[i][nameKey].toLowerCase().indexOf(key.toLowerCase()) !== -1) {
	            if (isHighLight) {
	              var newKeywords = key.replace(rexMeta, (matchStr) => {
	                return '//' + matchStr
	              })
	              nodes[i].oldname = nodes[i][nameKey]
	              var rexGlobal = new RegExp(newKeywords, 'gi')
	              nodes[i][nameKey] = nodes[i].oldname.replace(rexGlobal, (originalText) => {
	                var highLightText =
	                '<span style="color: whitesmoke;background-color: darkred;">'
	                + originalText
	                +'</span>'
	                return 	highLightText
	              })
	              this.treeObj.updateNode(nodes[i])
	            }

              if(nodes[i].isParent){
                for(let item of nodes[i][this.newSetting.data.key.children]){
                  this.treeObj.showNode(item)
	                this.nodesShow.push(item)
                }
              }

	            this.treeObj.showNode(nodes[i])
	            this.nodesShow.push(nodes[i])
	          } else {
              this.treeObj.hideNode(nodes[i])
	          }
	        }
	      }
	    },
      showNodesFun (nodesShow, key) {
	      if (key.length > 0) {
	        nodesShow.forEach(node => {
	          let pathOfOne = node.getPath()

            //显示子节点
            this.treeObj.showNode(node)

	          if (pathOfOne && pathOfOne.length > 0) {
	            for (let i = 0; i < pathOfOne.length - 1; i++) {
	              this.treeObj.showNode(pathOfOne[i])
	              this.treeObj.expandNode(pathOfOne[i],true,true)
	            }
	          }
	        })
	      } else {
	        var rootNodes = this.treeObj.getNodesByParam('level', '0')
	        rootNodes.forEach(node => {
	          this.treeObj.expandNode(node, true)
	        })
	      }
	    }
	  }
}
</script>

<style lang="scss">
  .ztree *{
    font-size: 13px!important;
  }
  .treeInput{
    .el-input__inner{
      height: 28px;
    }
  }
</style>
<style lang="scss" scoped>

.ztree-wrapper{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.ztree-box{
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  flex: 1;
}
.ztree{
  margin: 5px;
  padding: 0;
}
</style>

