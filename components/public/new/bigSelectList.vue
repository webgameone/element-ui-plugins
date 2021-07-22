<template>
  <div class="selectListFormComp">
    <el-select
      filterable
      :multiple="item.multiple?item.multiple:false"
      collapse-tags
      :remote="item.remote?item.remote:false"
      :remote-method="item.remoteMethod?item.remoteMethod:null"
      :placeholder="item.placeholder?item.placeholder:'请选择'"
      :clearable="item.clearable!=null?item.clearable:true"
      v-model="formItem[item.key]"
      :popper-append-to-body="false"
      :allow-create="item.allowCreate?item.allowCreate:false"
      :disabled="item.disabled?item.disabled:false"
      style="width:100%"
      :filter-method="item.filterMethod?item.filterMethod:defaultFilter"
      v-el-select-loadmore:rangeNumber="loadMore(rangeNumber)"
      @change="formChange($event,item)"
      @blur="formBlur($event,item)"
      @focus="formFocus()"
      @visible-change="formVisibleChange($event,item)"
    >
      <el-option
        v-for="(item) in newSelectlist.slice(0, rangeNumber)"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      >{{ item.text }}</el-option>
    </el-select>

    <div>
      <el-table
        :data="tableData"
        class="compTable"
        border
        style="width:'100%'"
        :height="item.height"
        :show-header="item.showHeader||false"
        :row-class-name="tableRowClassName">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          v-for="(it) in item.tableColData"
          :key="it.title"
          :label="it.title"
          :align="it.align||'center'"
          :prop="it.key"
          :width="it.width"
          :min-width="it.minWidth||'200'">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="60">
          <template slot-scope="scope">
            <el-button style="color:#F56C6C" @click="deleteFn(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
    formObj: {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    item:{
      type: Object,
      default:() =>{
        return {}
      }
    },
    formItem:{
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data(){
    return{
      tableData: [
      ],
      rangeNumber: 10,//默认先展示10条数据
      selectList:[],
      newSelectlist:[],
      backList:null, //备份的数据
    }
  },
  watch:{
    formItem: {
        handler(val, newval) {
          let temp = val[this.item.key];
          let tempArr = [];

          this.selectList = val[this.item.key];
          this.newSelectlist = JSON.parse(JSON.stringify(this.formObj.selectData[this.item.key]));
          //备份数据
          this.backList = JSON.parse(JSON.stringify(this.formObj.selectData[this.item.key]));

          let mtime = setInterval(() => {
            if(this.formObj.selectData[this.item.key] && this.formObj.selectData[this.item.key].length!==0 &&temp){
              clearInterval(mtime)
              mtime = null;
              //给table赋值
              this.formObj.selectData[this.item.key].map((item)=>{
                temp.map((it)=>{
                  if((it)==(item.value)){
                    let obj = item.table;
                    tempArr.push(obj)
                  }
                })
              })

              //table显示值
              this.tableData = tempArr;
              this.getTableData();
            }
          }, 100);
        },
        deep: true
      }
  },
  mounted(){
  },
  methods: {
    defaultFilter(query){
      if (query !== "") {
        // console.log('开始过滤');
        this.newSelectlist = this.backList.filter(
          item => {
            if(typeof (this.item.custText)=='undefined'){
              if (item.text.indexOf(query) > -1) {
                return item;
              }
            }else{
              if (item[this.item.custText].indexOf(query) > -1) {
                return item;
              }
            }
          }
        );
      }else{
        this.newSelectlist = this.backList
      }
    },
    loadMore(n){
      // console.log(n);
      //n是默认初始展示的条数会在渲染的时候就可以获取,具体可以打log查看
      //if(n < 8) this.rangeNumber = 10 //elementui下拉超过7条才会出滚动条,如果初始不出滚动条无法触发loadMore方法
      return () => this.rangeNumber += 5 //每次滚动到底部可以新增条数  可自定义
    },
    formChange(event,item){
      this.selectList = event;
      let tempArr = [];

      if(this.item.valueType=='array'){
        this.formObj.selectData[this.item.key].map((item)=>{
          event.map((it)=>{
            if((it[0])==(item.value[0])){
              let obj = {
                date:item.value[0]
              }
              tempArr.push(obj)
            }
          })
        })

        //table显示值
        this.tableData = tempArr;
        this.getTableData();
      }else{
        //非数组值
        this.formObj.selectData[this.item.key].map((item)=>{
          event.map((it)=>{
            if((it)==(item.value)){
              let obj = item.table;
              tempArr.push(obj)
            }
          })
        })

        //table显示值
        this.tableData = tempArr;
        this.getTableData();
      }

      this.$emit('formChange',event,item,item.key)
    },
    formBlur(event,item){
      this.$emit('formBlur',event,item)
    },
    formFocus(){
      this.$emit('formFocus')
    },
    formVisibleChange(event,item){
      if(this.formItem[this.item.key]==null||this.formItem[this.item.key]==''){
          //如果什么都没有选，就还是给默认值
          setTimeout(() => {
            this.newSelectlist = this.backList;
          }, 0);
        }
        this.$emit('formVisibleChange',event,item)
    },
    deleteFn(row){
      //获取对应的text
      let v = row;
      let tempArr = [];

      if(this.item.valueType=='array'){
        //获取下标
        let index = this.selectList.findIndex((item)=>{
          return v==item[0]
        });

        //从列表移除
        this.selectList.splice(index,1);

        //更新table的data
        this.formObj.selectData[this.item.key].map((item)=>{
          this.selectList.map((it)=>{
            if((it[0])==(item.value[0])){
              let obj = item.table
              tempArr.push(obj)
            }
          })
        })

        //table显示值
        this.tableData = tempArr;
        this.getTableData();
      }else{
        //非数组的值
        //获取对应的value
        this.formObj.selectData[this.item.key].map((item)=>{
          if(v==item.table){
            v = item.value
          }
        })

        //获取下标
        let index = this.selectList.findIndex((item)=>{
          return v==item
        });

        //从列表移除
        this.selectList.splice(index,1);

        //更新table的data
        this.formObj.selectData[this.item.key].map((item)=>{
          this.selectList.map((it)=>{
            if((it)==(item.value)){
              let obj = item.table;
              tempArr.push(obj)
            }
          })
        })

        //table显示值
        this.tableData = tempArr;
        this.getTableData();
      }

      this.$emit('formChange',this.selectList,this.item,this.item.key)
    },
    //获得table的数据
    getTableData(){
     this.$emit('getBigSelectListTableData',this.tableData,this.item)
    }
  },
}
</script>

<style lang="scss">
.selectListFormComp{
  .el-select__input.is-mini{
    width: auto!important;
    // height: auto!important;
  }
}


</style>
<style lang="scss" scoped>
.selectListFormComp{
  .compTable{
    margin-top: 2px;
    border-radius: 5px;
    overflow-y: auto;
  }
}
</style>
