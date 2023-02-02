//拾取图标
<template>
  <div>
    <el-popover
      placement="bottom"
      width="400"
      trigger="click">
      <span slot="reference" class="selectBox">
        <i v-if="item.iconType=='iconfont'" :class="'iconfont '+userChooseIcon"></i>

        <img v-if="item.iconType=='img'" class="selectIconImg" :src="userChooseIcon" alt="">
      </span>

      <!-- iconfont模式 -->
      <div class="iconList" v-if="item.iconType=='iconfont'">
        <i
          v-for="item in formObj.selectData[item.key]"
          :key="item"
          :class="'iconfont '+item"
          @click="setIcon($event,item)"
          style="font-size:20px"
        ></i>
      </div>

      <!-- img模式 -->
      <div class="iconList" v-if="item.iconType=='img'">
        <i
          v-for="item in formObj.selectData[item.key]"
          :key="item"
          class="iconfont"
          @click="setIcon($event,item)"
          style="font-size:20px"
        >
        <img class="iconImg" :src="item.url" alt="">
        </i>
      </div>
   </el-popover>
  </div>
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
  watch:{
    formItem: {
        handler(val, newval) {
          if(this.item.iconType=="iconfont"){
            this.userChooseIcon = val[this.item.key];
          }else if(this.item.iconType=="img"){
            this.userChooseIcon = val[this.item.key];
          }
        },
        deep: true
      }
  },
  data() {
    return {
      userChooseIcon:'',
      iconList:[
        "icon-dalou",
        "icon-ic_location_city_px",
        "icon-24gf-building",
        "icon-dalou1",
        "icon-wuding",
        "icon-dalou",
        "icon-ic_location_city_px",
        "icon-24gf-building",
        "icon-dalou1",
        "icon-dalou1",
        "icon-wuding",
        "icon-dalou",
        "icon-ic_location_city_px",
        "icon-24gf-building",
        "icon-dalou1",
      ]
    }
  },
  methods: {
    //给icon绑定的点击事件
    setIcon(event,item){
      if(this.item.iconType=="iconfont"){
        this.userChooseIcon = item;
        this.$emit('formChange',item)
      }else if(this.item.iconType=="img"){
        setTimeout(() => {
          this.userChooseIcon = item.url;
        }, 10);
        this.$emit('formChange',item)
      }

    }
  },
}
</script>

<style lang="scss" scoped>
.selectBox{
  display: inline-block;
  width: 100%;
  height: 26px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  text-align: center;
  line-height: 26px;
}
.selectIconImg{
  width: 26px;
  height: 26px;
}
.iconList{
    width: 400px;
    height: 300px;
    overflow-y: scroll;//y轴显示滚动条
    overflow-x: hidden;//x轴溢出隐藏
    // display: flex;
    // flex-wrap: wrap;//一定要换行
    i{
      display: inline-block;
      width: 40px;
      height: 40px;
      color: #000000;
      font-size: 20px;
      border: 1px solid #E6E6E6;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      line-height: 40px;
      margin: 0px;
      margin-right: 8.4px;
      margin-bottom: 8.4px;
      &:hover{
          color: #000000;
          border-color: rgb(64, 158, 255);
      }
    }
    i:nth-of-type(8n+0){
      margin-right: 0;
    }

    .iconImg{
      width: 100%;
      height: 100%;
    }
}
</style>
