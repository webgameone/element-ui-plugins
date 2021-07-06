// 弹窗组件使用说明
/*
弹窗属性
popObj{
  title:'弹窗标题'
  col:4 ,//弹窗的宽度和高度，计算方式(col*20%) 默认是4 ，也就是相对于浏览器视窗80%的宽度和80%的高度
  loading:true,// 弹窗是否允许loading
  loadingText:'请稍等,数据请求中!', //自定义loading的文字
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
  <div id="popupBox" v-if="dialogFormVisible" :style="{width:popObj.col?(popObj.col*20)+'%':'80%',height:popObj.col?(popObj.col*20)+'%':'80%'}">
    <!-- 带缓存功能的弹窗 -->
    <el-dialog
      class="popup"
      v-loading="popObj.loading?popObj.loading:false"
      :element-loading-text="popObj.loadingText&&popObj.loadingText!==''?popObj.loadingText:'请稍等,数据请求中!'"
      :element-loading-spinner="popObj.loadingIcon&&popObj.loadingIcon!==''?popObj.loadingIcon:'el-icon-loading'"
      :title="popObj.title?popObj.title:''"
      :destroy-on-close="true"
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="true"
      :modal="false"
      :close-on-click-modal="false"
      close="popupClose"
      :before-close="handleDialogClose">

      <slot name="slot"></slot>

      <div slot="footer" class="dialog-footer">
        <!-- 自定义的按钮组 -->
        <div v-if="popObj.btnArr&&popObj.btnArr.length>0">
          <el-button
            v-for="(item) in popObj.btnArr"
            :key="item.key"
            :type="item.type?item.type:''"
            @click="popupClick($event,item.key)">{{item.title}}</el-button>
        </div>

        <!-- 默认的按钮组 -->
        <div v-else>
          <el-button @click.once="popupClick($event,'cancle')">取 消</el-button>
          <el-button type="primary" @click.once="popupClick($event,'submit')">确 定</el-button>
        </div>
      </div>
    </el-dialog>

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
      default:false
    }
  },
  data() {
    return {
      loading:true,
      dialogVisible: false
    };
  },
  watch: {
    dialogFormVisible(newVal) {
      this.dialogVisible = newVal;
    }
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
}
</style>

