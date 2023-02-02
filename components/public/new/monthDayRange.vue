//只有月份和日期的范围选择器
<template>
  <el-date-picker
      popper-class="monthdayRange"
      style="width:100%"
      v-model="formItem[item.key]"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format='MM-dd'
      value-format='yyyy-MM-dd'
      :onlyMonthDay="true"
      :disabled="item.disabled?item.disabled:false"
      :clearable="item.clearable===false?item.clearable:true"
      :picker-options="item.pickerOptions?item.pickerOptions:null"
      @focus="inputForce"
      @change="formChange($event,item)"
    >
  </el-date-picker>
</template>

<script>
export default {
  props:{
    formObj:{
      type: Object,
      default: () => {
        return {}
      }
    },
    formItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    item:{
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {

  },
  methods: {
    inputForce(e){
      let leftHeader = this.$$('.monthdayRange .data_rangge_leftLabel');
      let rightHeader = this.$$('.monthdayRange .data_rangge_rightLabel')
      let leftHeaderTxt = this.$$('.monthdayRange .data_rangge_leftLabelTxt');
      let rightHeaderTxt = this.$$('.monthdayRange .data_rangge_rightLabelTxt');

      leftHeader.css('opacity',0)
      leftHeaderTxt.css('display','block')

      rightHeader.css('opacity',0)
      rightHeaderTxt.css('display','block')

      //左右箭头
      let leftArrow = this.$$('.el-date-range-picker__header .el-icon-arrow-left')
      let rightArrow = this.$$('.el-date-range-picker__header .el-icon-arrow-right')

      //监听事件
      let that = this;
      leftArrow.on("click",function(){
        leftHeaderTxt = that.$$('.monthdayRange .data_rangge_leftLabelTxt');
        if(leftHeaderTxt[0].innerText=='1 月'){
          leftArrow.css('display','none')
        }
        rightArrow.css('display','block')
      })
      rightArrow.on("click",function(){
        rightHeaderTxt = that.$$('.monthdayRange .data_rangge_rightLabelTxt');
        if(rightHeaderTxt[0].innerText=='12 月'){
          rightArrow.css('display','none')
        }
        leftArrow.css('display','block')
      })

      if(leftHeaderTxt[0]){
        if(leftHeaderTxt[0].innerText=='1 月'){
          leftArrow.css('display','none')
        }
      }

      if(rightHeaderTxt[0]){
        if(rightHeaderTxt[0].innerText=='12 月'){
          rightArrow.css('display','none')
        }
      }
    },
    formChange(e,item){
      console.log(e)
    }
  },
}
</script>

<style lang="scss">
.monthdayRange{
  //左边年份箭头
  .el-icon-d-arrow-left{
    display: none!important;
  }
  //右边年份箭头
  .el-icon-d-arrow-right{
    display: none!important;
  }
}

</style>
