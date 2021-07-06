// 始终显示的弹窗组件使用说明
/*
弹窗属性
popObj{
  title:'弹窗标题'
  col:4 ,//弹窗的宽度和高度，计算方式(col*20%) 默认是4 ，也就是相对于浏览器视窗80%的宽度和80%的高度
  loading:true,// 弹窗是否允许loading
  loadingText:'请稍等,数据请求中!', //自定义loading的文字
  setNoBtn: false,  // 设置底部按钮不显示， 默认显示， false 是显示  true 是不显示
  //自定义的按钮组，如果不自定义，就使用默认的按钮组
  btnArr:[
    {
      title:'取消',// 按钮名称
      key:'cancle'// 按钮的key（唯一值，用于区分不同按钮）
    },
    {
      title:'修改',
      key:'submit',
      type:'primary'//按钮的样式类型，如不指定，默认为白色线框按钮样式
    }
  ]
}

*/
<template>
  <div id="popupBox" v-if="dialogVisible" :style="{width:popObj.width?popObj.width+'px':(popObj.col?(popObj.col*20)+'%':'80%'),height:popObj.height?popObj.height+'px':(popObj.col?(popObj.col*20)+'%':'80%')}">
    <el-dialog
      class="popup"
      v-loading="popObj.loading?popObj.loading:false"
      :element-loading-text="popObj.loadingText&&popObj.loadingText!==''?popObj.loadingText:'请稍等,数据请求中!'"
      :element-loading-spinner="popObj.loadingIcon&&popObj.loadingIcon!==''?popObj.loadingIcon:'el-icon-loading'"
      :title="popObj.title?popObj.title:''"
      :visible="dialogVisible"
      :destroy-on-close="true"
      :modal-append-to-body="true"
      :modal="false"
      :close-on-click-modal="false"
      close="popupClose"
      :before-close="handleDialogClose">

      <slot name="slot"></slot>

      <div slot="footer" class="dialog-footer" v-if="!popObj.setNoBtn">
        <!-- 自定义的按钮组 -->
        <div v-if="popObj.btnArr&&popObj.btnArr.length>0">
          <el-button
            v-for="(item) in popObj.btnArr"
            :key="item.key"
            :type="item.type?item.type:''"
            :disabled="item.disabled"
            @click="popupClick($event,item.key)">{{item.title}}</el-button>
        </div>

        <!-- 默认的按钮组 -->
        <div v-else>
          <el-button :disabled="isDisabled"  @click.once="popupClick($event,'cancle')">取 消</el-button>
          <el-button :disabled="isDisabled" type="primary" @click.once="popupClick($event,'submit')">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 不带缓存的弹窗 -->
    <!-- <div v-else class="noBufferDialog">
      <div class="noBufferDialog_title">
          <span class="title_text">{{popObj.title?popObj.title:''}}</span>
          <div class="title_close_box">
            <i class="title_close el-icon-close" @click.once="popupClick($event,'cancle')"></i>
          </div>
      </div>
      <div class="noBufferDialog_innerBox">
        <slot name="slot"></slot>
      </div>
      <div class="noBufferDialog_footer">
        <div class="noBufferDialog_footer_btnBox">
          <el-button class="bottomBtn" @click.once="popupClick($event,'cancle')">取 消</el-button>
          <el-button class="bottomBtn" type="primary" @click.once="popupClick($event,'submit')">确 定</el-button>
        </div>
      </div>
    </div> -->

    <div class="dialogMask">
    </div>
  </div>
</template>

<script>
export default {
  name:"uiPopup",
  props:{
    popObj: {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    dialogFormVisible:{
      type: Boolean,
      default:true
    }
  },
  data() {
    return {
      loading:true,
      dialogVisible: true,
      isDisabled:false
    };
  },
  watch: {
    dialogFormVisible(newVal) {
      // this.dialogVisible = newVal;
    }
  },
  created() {
    console.log(this.popObj)
  },
  beforeDestroy(){

  },
  methods: {
    //点击右上角x按钮关闭的操作
    handleDialogClose(){
      this.$emit('popupBtnFn','close');
    },
    popupClose(){
      // console.log('弹窗关闭了')
    },
    //右下角按钮组的点击事件
    popupClick(event,type){
      this.$emit('popupBtnFn',type);
    },
    //设置默认按钮--确定和取消按钮的disabled的状态
    setDefaultBtnDisabled(disabled=false){
      this.isDisabled = disabled;
      console.log(this.isDisabled);
    },
    //设置自定义按钮的disabled的属性值
    setCustomBtnDisabled(keyName,attribute,value){
      let btnArr = this.popObj.btnArr;
      let len = btnArr.length;

      if(len==0){
        return;
      }
      for(let i=0;i<len;i++){
        if(btnArr[i].key==keyName){
          btnArr[i][attribute] = value
        }
      }
    }
  },
}
</script>

<style lang="scss">
#popupBox{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 800;
  .el-dialog__wrapper{
    position: absolute;
  }
  .dialogMask{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000;
    opacity: 0.5;
    z-index: 1000;
  }
  .el-dialog{
    margin-top: 0!important;
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    margin:auto!important;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .el-dialog__header{
    border-bottom: 1px solid#DCDFE6;
    padding: 15px;
  }
  .el-dialog__body{
    height: calc(100% - 185px);
    overflow: auto;
  }
  .el-dialog__footer{
    width: 100%;
    position: absolute;
    bottom:0px;
    right:0px;
    border-top: 1px solid#DCDFE6;
    padding: 15px;
  }

  /*不带缓存的弹窗*/
  .noBufferDialog{
    margin-top: 0!important;
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    margin:auto!important;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    border-radius: 5px;
    z-index: 1001;
    /*title和关闭按钮*/
    .noBufferDialog_title{
      width: 100%;
      height: 55px;
      border-bottom: 1px solid#DCDFE6;
      line-height: 55px;
      .title_close_box{
        float: right;
        font-size: 20px!important;
        margin-right: 15px;
      }
      .title_text{
        margin-left: 15px;
        font-size: 18px!important;
      }
      .title_close{
        cursor: pointer;
      }
    }
    .noBufferDialog_innerBox{
      padding: 20px 10px;
      height: calc(100% - 166px);
      overflow-y: auto;
    }
    /*底部的footer*/
    .noBufferDialog_footer{
      width: 100%;
      height: 70px;
      line-height: 70px;
      position: absolute;
      bottom:0px;
      right:0px;
      border-top: 1px solid#DCDFE6;
      .noBufferDialog_footer_btnBox{
        margin-right: 20px;
        float: right;
      }
    }
  }
}
</style>

