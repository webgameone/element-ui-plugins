<template>
  <div class="selectinput">
    <div class="swrap">
      <div class="selectwrap" :style="'width:'+drapWidth+'px'">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
            {{ivalue}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in selectinputlist" :key="index" :command="item.text">{{item.text}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="Iwrap">
        <!-- datetimerange -->
        <div>
          <el-date-picker
            v-model="dataval"
            :type="dataType"
            range-separator="-"
            :clearable="clearableProp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            @change="changeDate"
          ></el-date-picker>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import moment from 'moment'
import tool from '@/utils/tools/tool'
export default {
  props: {
    clearableProp:{
      type:Boolean,
      default:false
    },
    selectinputlist: {
      type: Array,
      default: () => {
        return []
      }
    },
    selecttype: {
      type: String,
      default: 'input'
    },
    drapWidth:{
      type:Number,
      default:()=>{
        return 100
      }
    },
    dataType:{
      type:String,
      default:()=>{
        return 'daterange'
      }
    },
    //默认时间
    defaultDate:{
      type:Array,
      default:()=>{
        return []
      }
    },
    clearable:{
      type:Boolean,
      default:false,
    },
    pickerOptions:{
      type:Object,
      default:()=>{return null}
    }
  },
  watch:{
    defaultDate:{
      handler:function(val){
        this.dataval=val;
      },
      deep:true
    }
  },
  data () {
    return {
      inputvalue: '',
      ivalue: '',
      dataval: [],
      pickerOptions: {
        // disabledDate (time) {
        //   let _now = Date.now()
        //   let seven = 90 * 24 * 60 * 60 * 1000
        //   let sevenDays = _now - seven
        //   return time.getTime() > _now || time.getTime() < sevenDays // 大于当前的禁止，小于7天前的禁止
        // }
      }
    }
  },
  created () {
    this.getdefaultValue()
    this.ivalue = this.selectinputlist[0].text;
    this.$emit('selecttype', this.ivalue);
  },
  methods: {
    //清空
    clearTime(){
      let re = tool.getCurrentDay();
      this.dataval=re;
      this.ivalue = this.selectinputlist[0].text;
    },
    handleCommand (command) {
      this.ivalue = command
      this.$emit('selecttype', this.ivalue)
    },
    // 默认当前日期
    getdefaultValue () {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var hours=now.getHours();
      var min=now.getMinutes();
      var second=now.getSeconds();

      //前一日
      var beforeData=new Date(Number(now.getTime())-Number(24*60*60*1000));
      var beforeYear=beforeData.getFullYear();
      var beforeMonth = beforeData.getMonth()+1 // 得到月份
      var beforeDay = beforeData.getDate() // 得到日期
      var defaultDateStart='';
      var defaultDateEnd='';
      if(this.dataType=='daterange'){
        defaultDateStart = `${year}-${month}-${date}`
        defaultDateEnd = `${year}-${month}-${date}`
      }else{
        defaultDateStart = `${beforeYear}-${beforeMonth}-${beforeDay} ${hours}:${min}:${second}`
        defaultDateEnd = `${year}-${month}-${date} ${hours}:${min}:${second}`
      }

      //如果有父类传递默认时间
      if(this.defaultDate){
        this.dataval = this.defaultDate;
      }else{
        this.dataval = [defaultDateStart, defaultDateEnd];
      }

      
      //先提交出默认日期出去
      setTimeout(() => {
        this.$emit('selectDateChange',this.dataval);
      }, 0);

      return this.dataval
    },
    //修改日期
    changeDate(v){
      this.$emit('selectDateChange',v)
    }
  }
}
</script>>
<style lang="scss" scoped>
select:focus {
  outline: none;
}
.selectinput {
  // margin-top: 10px;
  // margin-right: 16px;

  .swrap {
    display: flex;
  }
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
  .Iwrap {
    flex-grow: 1;
    flex: 1;
    // padding-left: 5px;
  }
}
</style>>
