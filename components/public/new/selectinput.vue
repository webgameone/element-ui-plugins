/*这个是放入新的组件库的*/
<template>
  <div class="selectinput">
    <div class="swrap">
      <div class="selectwrap" :style="{width:labelWidth+'px'}">
        <el-dropdown @command="handleCommand" :style="{width:labelWidth+'px'}">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
            {{ivalue}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in selectinputlist" :key="index" :command="item.text">{{item.text}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div>:</div> -->
      </div>
      <div class="Iwrap">
        <div>
          <el-input
            :placeholder="placeholder"
            v-model="inputvalue"
            @input="inputChange"
            clearable />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import moment from 'moment'
export default {
  props: {
    selectinputlist: {
      type: Array,
      default: () => {
        return []
      }
    },
    labelWidth:{
      type:Number,
      default:100
    },
    deValue:{
      type:String,
      default:''
    }
  },
  data () {
    return {
      inputvalue: '',
      ivalue: '',
      placeholder: '',
      dataval: []
    }
  },
  watch:{
    deValue(newVal,oldVal){
      this.inputvalue = newVal;
    }
  },
  mounted() {
    this.ivalue = this.selectinputlist[0].text;
    this.placeholder = this.selectinputlist[0].text;

    this.$emit('selecttype', this.ivalue)
  },
  methods: {
    handleCommand (command) {
      this.placeholder = command;
      this.ivalue = command

      this.$emit('selecttype', this.ivalue)
    },
    inputChange(v){
      this.$emit('inputChange',v);
    }
  }
}
</script>
<style lang="scss" scoped>
select:focus {
  outline: none;
}
.selectinput {
  .swrap {
    display: flex;
    .selectwrap {
      box-sizing: border-box;
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
    // padding-left: 5px;
  }
}
</style>>
