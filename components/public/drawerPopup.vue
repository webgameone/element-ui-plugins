//抽屉弹窗组件
/*
弹窗属性
drawerObj{
  title:'弹窗标题'
  modal:true ,//是否需要遮罩层
  direction:'rtl',//抽屉打开的方向
  showClose:true, //是否显示关闭按钮
  size: '40%',  // 抽屉尺寸
  withHeader: true,// 是否显示标题（默认true）
  footer: true,// 是否显示底部按钮（默认true）
  wrapperClosable: true,// 是否可点击遮罩关闭（默认true）
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
  ]
}

显示抽屉：showDrawer
*/
<template>
  <el-drawer
    :title="drawerObj.title?drawerObj.title:''"
    :modal="isBoolean(drawerObj.modal)"
    :direction="drawerObj.direction?drawerObj.direction:'rtl'"
    :show-close="isBoolean(drawerObj.showClose)"
    :size="drawerObj.size?drawerObj.size:'80%'"
    :with-header="isBoolean(drawerObj.withHeader)"
    :wrapper-closable="false"
    :modal-append-to-body="false"
    :visible.sync="showDrawer"
    @close="popupClick($event,'close')"
    ref="drawer"
  >
    <div class="drawer-container">
      <div class="drawer-container-top">
        <slot name="slot"></slot>
      </div>
      <div class="drawer-container-bottom" v-if="isBoolean(drawerObj.footer)">
        <div class="btn-box" :style="{ justifyContent: drawerObj.btnAlign?drawerObj.btnAlign:'center' }" v-if="drawerObj.btnArr&&drawerObj.btnArr.length>0">
          <el-button
            v-for="(item) in drawerObj.btnArr"
            :key="item.key"
            :type="item.type?item.type:''"
            :disabled="item.disabled"
            @click="popupClick($event,item.key)"
          >{{item.title}}</el-button>
        </div>
        <div class="btn-box" :style="{ justifyContent: drawerObj.btnAlign?drawerObj.btnAlign:'center' }" v-else>
          <el-button :disabled="isDisabled" @click="popupClick($event,'cancle')">取 消</el-button>
          <el-button
            :disabled="isDisabled"
            type="primary"
            @click="popupClick($event,'submit')"
          >确 定</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "uiDrawerPopup",
  props: {
    drawerObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    showDrawer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isDisabled: false,
    };
  },
  watch: {
    showDrawer(newVal) {}
  },
  methods: {
    isBoolean: function(vm) {
      return (vm === undefined || vm) ? true : false
    },
    //右下角按钮组的点击事件
    popupClick(event, type) {
      this.$emit("drawerBtnFn", type);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header > :first-child {
  outline: none !important;
}
.drawer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .drawer-container-top {
    flex: 1;
    overflow: auto;
    padding: 0 24px;
  }
  .drawer-container-bottom {
    padding: 10px;
    .btn-box {
      display: flex;
    }
  }
}
</style>

