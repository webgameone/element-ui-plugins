//支持大数据的下拉列表
<template>
  <div id="bigDataSelectComps" style="width:100%;">
    <!-- 下拉组件展示id和名称 -->
    <el-select
      v-if="item.selectType&&item.selectType=='selectShowIdComp'"
      filterable
      class="selectShowIdCompClass"
      :multiple="item.multiple?item.multiple:false"
      :collapse-tags="item.collapseTags && item.multiple ? true : false"
      :remote="item.remote?item.remote:false"
      :remote-method="item.remoteMethod?item.remoteMethod:null"
      :placeholder="item.placeholder?item.placeholder:'请选择'"
      :clearable="item.clearable!=null?item.clearable:true"
      :popper-append-to-body="true"
      :allow-create="item.allowCreate?item.allowCreate:false"
      :disabled="item.disabled?item.disabled:false"
      v-model="formItem[item.key]"
      style="width:100%"
      :filter-method="item.filterMethod?item.filterMethod:defaultFilter"
      v-el-select-loadmore:rangeNumber="loadMore(rangeNumber)"
      @change="formChange($event,item)"
      @blur="formBlur($event,item)"
      @focus="formFocus()"
      @clear="formClear(item)"
      @visible-change="formVisibleChange($event,item)"
    >
      <!-- 可以自定义option的数量 -->
      <template v-if="item.options">
          <div style="margin-bottom:20px;">
            <el-option style="position:absolute;top:0;background:#fff;width:100%;height:35px;z-index:500;">
              <div style="display:flex;justify-content:space-between;">
                <span style="color: #8492a6;font-size:12px;" v-for="(child1) in item.options" :key="child1.value" :style="child1.mstyle">{{child1.title?child1.title:''}}</span>
              </div>
            </el-option>
          </div>
          <el-option
          v-for="(it,index) in currentSelectList.slice(0, rangeNumber)"
          :key="it[item.custValue]?it[item.custValue]:it.value"
          :label="it[item.custText]?it[item.custText]:it.text"
          :value="it[item.custValue]?it[item.custValue]:it.value"
          >
            <div style="display:flex;justify-content:space-between;">
              <span @click="getClickIndex(index)" v-for="(child) in item.options" :key="it[child.str]" :style="child.mstyle">{{it[child.str]}}</span>
            </div>
          </el-option>
      </template>
      <!-- 默认的option -->
      <template v-else>
        <div style="margin-bottom:20px;">
          <el-option style="position:absolute;top:0;background:#fff;width:100%;height:35px;z-index:500;">
            <div style="display:flex;justify-content:space-between;">
              <span style="width:50%;">{{item.listName?item.listName:'名称'}}</span>
              <span style="width:50%;;color: #8492a6;font-size:12px;text-align:right">{{item.listValue?item.listValue:'编号'}}</span>
            </div>
          </el-option>
        </div>
        <el-option v-for="(it) in currentSelectList.slice(0, rangeNumber)"
          :key="it[item.custValue]?it[item.custValue]:it.value"
          :label="it[item.custText]?it[item.custText]:it.text"
          :value="it[item.custValue]?it[item.custValue]:it.value">
          <div style="display:flex;justify-content:space-between;">
            <span>{{it[item.custText]?it[item.custText]:it.text}}</span>
            <span style="color: #8492a6;font-size:12px">{{it.defaultValue?it.defaultValue:(it[item.custValue]?it[item.custValue]:it.value)}}</span>
          </div>
        </el-option>
      </template>
    </el-select>

    <!-- 普通下拉组件 -->
    <el-select
      v-else
      filterable
      collapse-tags
      :class="item.multiple?'selectMultiple selectComp':'selectComp'"
      :multiple="item.multiple?item.multiple:false"
      :remote="item.remote?item.remote:false"
      :remote-method="item.remoteMethod?item.remoteMethod:null"
      :placeholder="item.placeholder?item.placeholder:'请选择'"
      :clearable="item.clearable!=null?item.clearable:true"
      :popper-append-to-body="true"
      :allow-create="item.allowCreate?item.allowCreate:false"
      :disabled="item.disabled?item.disabled:false"
      v-model="formItem[item.key]"
      :style="{width:'100%'}"
      :filter-method="item.filterMethod?item.filterMethod:defaultFilter"
      v-el-select-loadmore:rangeNumber="loadMore(rangeNumber)"
      @change="formChange($event,item)"
      @blur="formBlur($event,item)"
      @focus="formFocus()"
      @clear="formClear(item)"
      @visible-change="formVisibleChange($event,item)"
    >
      <el-option
        v-for="(it,index) in currentSelectList.slice(0, rangeNumber)"
        :key="it[item.custValue]?it[item.custValue]:it.value"
        :label="it[item.custText]?it[item.custText]:it.text"
        :value="it[item.custValue]?it[item.custValue]:it.value"
      >
      <div @click="getClickIndex(index)">
        <span >{{it[item.custText]?it[item.custText]:it.text}}</span>
      </div>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  directives: {
    'el-select-loadmore':{
        bind(el, binding) {
            let self = this
            // 获取element-ui定义好的scroll盒子
            const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
            SELECTWRAP_DOM.addEventListener('scroll', function () {
                /**
                * scrollHeight 获取元素内容高度(只读)
                * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                * clientHeight 读取元素的可见高度(只读)
                * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                */
                const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                if (condition) binding.value()
            });
        }
    }
  },
  props:{
    formObj:{
      type: Object,
      default: () => {
        return {}
      }
    },
    selectlist: {
      type: Array,
      default: () => {
        return []
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
  data() {
      return {
        index:0,
        choose: "",
        rangeNumber: 10,//默认先展示10条数据
        backList:null, //备份的数据
        newSelectlist:[],
        currentSelectList:[]
      }
  },
  watch:{
    selectlist:{
      handler(newVal){
        //全部的列表
        this.newSelectlist = JSON.parse(JSON.stringify(newVal));
        //默认的渲染列表
        this.currentSelectList = this.newSelectlist;
        // console.log(this.newSelectlist.length);
        //备份数据
        this.backList = JSON.parse(JSON.stringify(newVal));
      },
      deep:true,
      immediate:true
    },
    item:{
      // handler(newVal){
      //   console.log(this.formItem);
      //   console.log(this.formItem[newVal.key]);
      // },
      // immediate:true
    },
    formItem:{
      handler(newVal){
        if(newVal[this.item.key] instanceof Array&&newVal[this.item.key].length>0){
          //下拉-多选
          this.bigDataSetData(newVal[this.item.key])
        }else if(newVal[this.item.key]&&newVal[this.item.key]!==undefined){
          //下拉-单选
          this.bigDataSetData(newVal[this.item.key])
        }
      },
      immediate:true
    }
  },
  beforeCreate(){
    // console.log(this.selectlist);
  },
  created(){
  },
  mounted() {
    if(this.item.selectKey){
      this.item.key = this.item.selectKey
    }
  },
  methods: {
      defaultFilter(query){
        if (query !== "") {
          this.currentSelectList = this.backList.filter(
            item => {
              if(typeof (this.item.custText)=='undefined'){
                if (item.text.indexOf(query) > -1) {
                  // console.log(item);
                  return item;
                }
              }else{
                // console.log('第二个');
                if (item[this.item.custText].indexOf(query) > -1) {
                  return item;
                }
              }
            }
          );
        }else{
          this.currentSelectList = this.backList
        }
      },
      getClickIndex(index){
        this.index = index;
      },
      loadMore(n){
        // console.log(n);
        //n是默认初始展示的条数会在渲染的时候就可以获取,具体可以打log查看
        //if(n < 8) this.rangeNumber = 10 //elementui下拉超过7条才会出滚动条,如果初始不出滚动条无法触发loadMore方法
        return () => this.rangeNumber += 5 //每次滚动到底部可以新增条数  可自定义
      },
      formChange(event,item){
        // console.log(event);
        // console.log(this.selectlist[this.index]);
        this.$emit('formChange',event,item,this.newSelectlist[this.index])
      },
      formBlur(event,item){
        // console.log(event.target.value);
        this.$emit('formBlur',event,item)
      },
      formFocus(){
        this.$emit('formFocus')
      },
      formClear(item){
        this.$emit('formClear',item);
      },
      formVisibleChange(event,item){
        // if(event){
        //   this.focusSelect = false;
        // }else{
        //   this.focusSelect = true;
        // }

        if(this.formItem[this.item.key]==null||this.formItem[this.item.key]==''){
          //如果什么都没有选，就还是给默认值
          setTimeout(() => {
            this.newSelectlist = this.backList;
          }, 0);
        }
        this.$emit('formVisibleChange',event,item)
      },
      //大数据的回显
      bigDataSetData(value){
        let len = this.newSelectlist.length;

        if(value instanceof Array&&value.length>0){
          let valuenLen = value.length;
          //多选
          for(let i=0;i<valuenLen;i++){
            let index = this.newSelectlist.findIndex(e=>{
              return e.value==value[i] || e[this.item.custValue]==value[i]
            })

            if(index!=-1&&index>this.rangeNumber){
              //找到了对应的下标
              let t = this.newSelectlist[index];
              //删掉那个数字
              this.currentSelectList.splice(index,1);

              //将这个回显放在最前面
              this.currentSelectList.unshift(t)
            }
          }
        }else{
          //单选
          for(let i=0;i<len;i++){
            if(value == this.newSelectlist[i].value||value == this.newSelectlist[i][this.item.custValue]){
              //如果在范围内，就不用理会
              if(i<=this.rangeNumber){
                return;
              }
              let t = this.newSelectlist[i];
              //删掉那个数字
              this.currentSelectList.splice(i,1);

              //将这个回显放在最前面
              this.currentSelectList.unshift(t)
            }
          }
        }
      }
  }
};
</script>

<style lang="scss">
#bigDataSelectComps{
  .el-select__input.is-mini{
    // width: 92%!important;
    // height: auto!important;
  }
}
</style>
<style lang="scss" scoped>
//带ID的下拉列表
.selectShowIdCompClass{
  .el-scrollbar{
    position: relative;
  }
}
</style>
