弹窗属性
drawerObj{
  title:'弹窗标题'
  showClose:true, //是否显示关闭按钮
  size: '40%',  // 抽屉尺寸
  withHeader: true,// 是否显示标题（默认true）
  footer: true,// 是否显示底部按钮（默认true）
  btnAlign: 'flex-end',  // 底部按钮对齐方式，需要传入justifyContent相关属性
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
  ],
  // 二级抽屉参数跟一级是一样的
  innerObj: {
    showInner: false,//是否打开二级抽屉
  }
}
*/
<template>
  <div class="custom-container-bg">
    <div class="custom-container" :style="{ width: drawerObj.size?drawerObj.size:'80%'}">
      <div class="custom-header" v-if="isBoolean(drawerObj.withHeader)">
        <span>{{ drawerObj.title }}</span>
        <el-button
          icon="el-icon-close"
          v-if="isBoolean(drawerObj.showClose)"
          @click="popupClick($event,'close')"
        ></el-button>
      </div>
      <div class="custom-main">
        <slot name="slot"></slot>
      </div>
      <div class="custom-botttom" v-if="isBoolean(drawerObj.footer)">
        <div
          class="btn-box"
          :style="{ justifyContent: drawerObj.btnAlign?drawerObj.btnAlign:'center' }"
          v-if="drawerObj.btnArr&&drawerObj.btnArr.length>0"
        >
          <el-button
            v-for="(item,index) in drawerObj.btnArr"
            :key="item.key"
            :type="item.type?item.type:''"
            :disabled="item.disabled"
            @click="popupClick($event,item.key,index)"
          >{{item.title}}</el-button>
        </div>
        <div
          class="btn-box"
          :style="{ justifyContent: drawerObj.btnAlign?drawerObj.btnAlign:'center' }"
          v-else
        >
          <el-button :disabled="isDisabled" @click="popupClick($event,'cancle')">取 消</el-button>
          <el-button :disabled="isDisabled" type="primary" @click="popupClick($event,'submit')">确 定</el-button>
        </div>
      </div>
    </div>
    <!-- 二级抽屉 -->
    <div class="custom-inner-bg" v-if="innerObj.showInner">
      <div class="custom-container" :style="{ width: innerObj.size?innerObj.size:'60%' }">
        <div class="custom-header" v-if="isBoolean(innerObj.withHeader)">
          <span>{{ innerObj.title }}</span>
          <el-button
            icon="el-icon-close"
            v-if="isBoolean(innerObj.showClose)"
            @click="innerClick($event,'close')"
          ></el-button>
        </div>
        <div class="custom-main">
          <slot name="inner"></slot>
        </div>
        <div class="custom-botttom" v-if="isBoolean(innerObj.footer)">
          <div
            class="btn-box"
            :style="{ justifyContent: innerObj.btnAlign?innerObj.btnAlign:'center' }"
            v-if="innerObj.btnArr&&innerObj.btnArr.length>0"
          >
            <el-button
              v-for="(item) in innerObj.btnArr"
              :key="item.key"
              :type="item.type?item.type:''"
              :disabled="item.disabled"
              @click="innerClick($event,item.key)"
            >{{item.title}}</el-button>
          </div>
          <div
            class="btn-box"
            :style="{ justifyContent: innerObj.btnAlign?innerObj.btnAlign:'center' }"
            v-else
          >
            <el-button :disabled="isDisabled" @click="innerClick($event,'cancle')">取 消</el-button>
            <el-button
              :disabled="isDisabled"
              type="primary"
              @click="innerClick($event,'submit')"
            >确 定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "uiCustomDrawer",
  props: {
    drawerObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    showCustomDrawer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isDisabled: false,
      innerObj:
        this.drawerObj.innerObj === undefined ? {} : this.drawerObj.innerObj
    };
  },
  watch: {
    showCustomDrawer(newVal) {}
  },
  methods: {
    isBoolean: function(vm) {
      return vm === undefined || vm ? true : false;
    },
    //右下角按钮组的点击事件
    popupClick(event, type,index) {
      this.$emit("customDrawerFn", type,index);
    },
    innerClick(event, type) {
      this.$emit("customDrawerInnerFn", type);
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-container-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 101;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.custom-inner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 102;
  background-color: rgba(0, 0, 0, 0.5);
}
.custom-container {
  height: 100%;
  position: absolute;
  right: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .custom-header {
    height: 44px;
    color: #222222;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    font-weight: bold;
    .el-button {
      border: none;
      cursor: pointer;
      font-size: 20px;
      color: inherit;
      background-color: transparent;
    }
    .el-button:hover {
      color: #409eff;
    }
  }
  .custom-botttom {
    padding: 10px 20px;
    .btn-box {
      display: flex;
    }
  }
}
.custom-main {
  overflow-y: auto;
  padding: 10px 20px;
  flex: 1;
}
</style>

