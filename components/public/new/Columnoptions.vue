<template>
  <div>
    <el-drawer title="列设置选项" :with-header="false" width="30%" placement="right" :closable="false" :visible="visiblecolumn" :after-visible-change="afterVisibleChange" @close="onClose">
      <div class="columnwrap">
        <div class="coltitle">列选项设置</div>
        <div class="drawerclumn">
          <el-checkbox-group @change="onselected" v-model="selectvalue">
            <draggable v-model="showcolumn1" @change="handleDraggableItemChange">
              <p v-for="(item,index) in showcolumn1" :key="index">
                <el-checkbox :label="item.title" :disabled="columnDisable.includes(item.key)?true:false"></el-checkbox>
              </p>
            </draggable>
          </el-checkbox-group>
        </div>
        <div class="btnwrap">
          <el-button type="primary" size="mini" @click="defineset">确定</el-button>
          <el-button size="mini" @click="Reset">重置</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
// import Sortable from 'sortablejs'
import draggable from 'vuedraggable'
export default {
  components: { draggable },
  props: {
    column: {
      type: Array,
      default: () => {
        return []
      }
    },
    columnDisable: {
      type: Array,
      default: () => {
        return []
      }
    },
    visiblecolumn: {
      type: Boolean
      // default: false
    }
  },
  data () {
    return {
      // visiblecolumn: false,
      selectvalue: [],
      showcolumn1: [],
      // 当前设置的列
      showcolumn: [],
      sortable: null
    }
  },
  created () {
    this.showcolumn1 = this.column;
    this.getcheck();
  },
  methods: {
    //table的列交换位置
    handleDraggableItemChange (val) {
      let oldIndex = val.moved.oldIndex;
      let newIndex = val.moved.newIndex;
      let tempoldIndex = this.showcolumn1[oldIndex];
      let tempNewIndex = this.showcolumn1[newIndex];

      this.showcolumn1[oldIndex] = tempoldIndex;
      this.showcolumn1[newIndex] = tempNewIndex;
    },
    Reset () {
      // 重置列
      this.showcolumn1 = this.column;
      let len = this.showcolumn1.length;
      for(let i=0;i<len;i++){
        this.showcolumn1[i].display =true;
      }
      this.getcheck();
    },
    afterVisibleChange (val) {
      console.log('visible', val)
    },
    onClose () {
      this.$emit('closeColumnoptions')
    },
    // 表格筛选 checkbox的勾选事件
    onselected (item) {
      let len = this.showcolumn1.length;

      for(let i=0;i<len;i++){
        if(this.selectvalue.indexOf(this.showcolumn1[i].title)!=-1){
          this.showcolumn1[i].display =true;
        }else{
          this.showcolumn1[i].display =false;
        }
      }
    },
    // 获取checkbox选中的值
    getcheck () {
      this.selectvalue = this.showcolumn1.filter(item=>{
        return item.display===true
      }).map(item => {
        return item.title
      })
    },
    // 表格重新设置列的顺序
    defineset () {
      this.$emit('definesetcolumn', this.showcolumn1)
    }
  }
}
</script>
<style lang="scss" scoped>
.columnwrap {
  padding: 20px;

  .coltitle {
    line-height: 40px;
  }
  .drawerclumn {
    margin: 20px;
    height: 600px;
    overflow: auto;
  }
  .btnwrap {
    margin-top: 80px;
  }
}
</style>
