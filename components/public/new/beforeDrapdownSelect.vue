<template>
  <div class="Dropdownselect">
    <div class="swrap">
      <div class="selectwrap" :style="'width:'+drapWidth+'px'">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ivalue}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in selectinputlist" :key="index" :command="item">{{item.text}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="Iwrap">
        <div>
          <el-select
            v-model="value"
            filterable
            clearable
            :key="randomKey"
            placeholder="请选择"
            @change='selectchangh'
            :filter-method="filterMethod"
            @visible-change="formVisibleChange($event,item)"
          >
            <el-option v-if='showRight'>
              <span style="float: left">名称</span>
              <span v-if='showRight' style="float: right;color: #8492a6;font-size:12px">编号</span>
            </el-option>
            <el-option
              v-for="item in dropdownselect"
              :key="item.value"
              :label="item.text"
              :value="item.value">
              <span style="float: left">{{ item.text }}</span>
              <span v-if='showRight' style="float: right;color: #8492a6;font-size:12px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectinputlist: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectlist: {
      type: Array,
      default: () => {
        return []
      }
    },
    drapWidth:{
      type:Number,
      default:()=>{
        return 100
      }
    },
    selectData:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    showRight:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      ivalue: this.selectinputlist[0].text,
      dataval: [],
      value: '',
      randomKey:0,
      dropdownselect: [],
      dropdownselectAll: [] //备份全部的数据
    }
  },
  watch:{
    "selectlist": {
      handler: function (val, oldVal) {
        //备份所有的数据
        this.dropdownselectAll = this.selectlist;
        this.dropdownselect = this.selectlist;
        this.selectFilter()
      },
      deep: true,
      immediate: true
    },
  },
  created(){
    this.$emit('selectDrap', this.ivalue)
  },
  methods: {
    //搜索过滤事件
    filterMethod(query){
      if (query !== '') {
        setTimeout(() => {
          this.dropdownselect = this.dropdownselectAll.filter(item => {
            return item.text.indexOf(query) > -1;
          });
        }, 200);
      } else {
        this.dropdownselect = [];
      }
    },
    //select下拉选项的显示和隐藏
    formVisibleChange(){
      this.selectFilter();
    },
    handleCommand (command) {
      this.ivalue = command.text;
      this.value = '';
      this.$nextTick(()=>{
        this.dropdownselectAll=this.selectData[command.key];
        this.selectFilter();
      });
      this.$emit('selectDrap', command.text)
    },
    selectFilter(query = '') {
      let arr =this.dropdownselectAll && this.dropdownselectAll.filter((item) => {
        return item.value+"".includes(query) || item.text.includes(query)
      })
      if (arr && arr.length > 20) {
        this.dropdownselect = arr.slice(0, 20)
      } else {
        this.dropdownselect = arr
      }
    },
    selectchangh(val) {
      let parm = {}
      //parm.text = this.text
      parm.key = val
      this.$emit('getDropdowmselect', parm)
    }

  }
}
</script>
<style lang="scss" scoped>
select:focus {
  outline: none;
}
.Dropdownselect {
  .swrap {
    display: flex;
    .selectwrap {
      box-sizing: border-box;
      //width: 100px;
      padding: 0 12px 0 0;
      text-align: right;
      .el-dropdown {
        width: 100%;
      }
      .ant-select-selection {
        border: none;
      }
      display: flex;
    }
  }

  .Iwrap {
    width: 282px;
    flex-grow: 1;
    flex: 1;
    .el-select {
      width: 100%;
    }
    // padding-left: 5px;
  }
}
</style>>
