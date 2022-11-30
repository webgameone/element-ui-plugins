//可以拖拽缩放的弹窗组件
/*
弹窗属性
popObj{
  title:'弹窗标题'
  col:4 ,//弹窗的宽度和高度，计算方式(col*20%) 默认是4 ，也就是相对于浏览器视窗80%的宽度和80%的高度
  loading:true,// 弹窗是否允许loading
  loadingText:'请稍等,数据请求中!', //自定义loading的文字
  setNoBtn: false,  // 设置底部按钮不显示， 默认显示， false 是显示  true 是不显示

  bgColor: 'rgba(255,0,0,0.5)',//背景颜色
  border: 'none', //弹窗边框
  headerColor: 'rgba(255,255,0,0.5)', //顶部标题栏背景颜色
  headerBottomBorder: 'none', //顶部标题栏底部border
  headerTitleColor: '#ffffff', //顶部标题栏文字颜色
  headerTitleTextWeight: '400', //顶部标题栏文字weight
  headerZoomBtnColor: '#ff0000', //顶部标题栏zoom按钮颜色
  headerCloseBtnColor: '#00ff00', //顶部标题栏close按钮颜色

  showFooter: true/false, //是否显示底部按钮组
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
  <vxe-modal
    class="dragPopup"
    v-model="dialogVisible"
    :title="popObj.title?popObj.title:''"
    :width="popObj.width?popObj.width+'px':(popObj.col?(popObj.col*20)+'%':'80%')"
    :height="popObj.height?popObj.height+'px':(popObj.col?(popObj.col*20)+'%':'80%')"
    min-width="450"
    min-height="320"
    :loading="popObj.loading?popObj.loading:false"
    resize
    transfer
    :showFooter="popObj.showFooter || popObj.showFooter == undefined ? true : false"
    @close="popupClose"
  >
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
        <el-button @click="popupClick($event,'cancle')">取 消</el-button>
        <el-button :disabled="isDisabled" type="primary" @click="popupClick($event,'submit')">确 定</el-button>
      </div>
    </div>
  </vxe-modal>
</template>

<script>
export default {
  name:'uiDragPopup',
  props:{
    popObj: {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    showPopup:{
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
    popObj:{
      handler(newVal){
        //弹窗背景颜色
        if(newVal.bgColor){
          setTimeout(() => {
            this.$$('.vxe-modal--box').css('background',newVal.bgColor);
          }, 100);
        }
        //弹窗边框
        if(newVal.border){
          setTimeout(() => {
            this.$$('.vxe-modal--box').css('border',newVal.border);
          }, 100);
        }
        //标题背景颜色
        if(newVal.headerColor){
          setTimeout(() => {
            this.$$('.vxe-modal--header').css('background',newVal.headerColor);
          }, 100);
        }
        //标题栏底部Border
        if(newVal.headerBottomBorder){
          setTimeout(() => {
            this.$$('.vxe-modal--header').css('border-bottom',newVal.headerBottomBorder);
          }, 100);
        }
        //标题文字颜色
        if(newVal.headerTitleColor){
          setTimeout(() => {
            this.$$('.vxe-modal--title').css('color',newVal.headerTitleColor);
          }, 100);
        }
        //标题栏文字weight
        if(newVal.headerTitleTextWeight){
          setTimeout(() => {
            this.$$('.vxe-modal--title').css('font-weight',newVal.headerTitleTextWeight);
          }, 100);
        }
        //标题右侧按钮颜色(zoom)
        if(newVal.headerZoomBtnColor){
          setTimeout(() => {
            this.$$('.vxe-modal--zoom-btn').css('color',newVal.headerZoomBtnColor);
          }, 100);
        }
        //标题右侧按钮颜色(close)
        if(newVal.headerCloseBtnColor){
          setTimeout(() => {
            this.$$('.vxe-modal--close-btn').css('color',newVal.headerCloseBtnColor);
          }, 100);
        }

      },
      deep:true,
      immediate:true
    }
  },
  created() {
    // console.log(this.popObj);
  },
  beforeDestroy(){
  },
  methods: {
    //点击右上角x按钮关闭的操作
    popupClose(){
      this.$emit('popupBtnFn','close');
    },
    //右下角按钮组的点击事件
    popupClick(event,type){
      this.isDisabled = true;
      this.setBtnIntervalFn()
      this.$emit('popupBtnFn',type);
    },
    //设置默认按钮--确定和取消按钮的disabled的状态
    setDefaultBtnDisabled(disabled=false){
      this.isDisabled = disabled;
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
    },
    //节流操作-2秒节流
    setBtnIntervalFn(){
      let time = setTimeout(() => {
        this.isDisabled = false;
      }, 2000);
    }
  },
}
</script>

<style lang="scss">
.dragPopup{
  .vxe-modal--box{
    position: relative;
    .vxe-modal--content{
      position: relative;
      padding: 5px 20px;
    }
    .vxe-modal--content  div:nth-child(1){
      // border: 1px solid transparent;
      // overflow-x: hidden;
      // overflow: hidden;
    }
  }
}

</style>

