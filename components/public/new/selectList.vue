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
      :filter-method="item.filterMethod"
      @change="formChange($event,item)"
      @blur="formBlur($event,item)"
      @focus="formFocus()"
      @visible-change="formVisibleChange($event,item)"
    >
      <el-option v-for="(item) in formObj.selectData[item.key]" :key="item.value" :label="item.text" :value="item.value">{{ item.text }}</el-option>
    </el-select>

    <div>
      <el-table
        :data="tableData"
        class="compTable"
        border
        style="width: 100%;"
        height=200
        :show-header="false"
        :row-class-name="tableRowClassName">
        <el-table-column
          type="index"
          align="center"
          width="40">
        </el-table-column>
        <el-table-column
          prop="date"
          label="路由"
          align="center"
          min-width="200">
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
        // {
        //   date: '1111111111111111111.jpg',
        // },
        // {
        //   date: '2222222222222222222222222222222222222222222222222222222222222222222222222222222.jpg',
        // },
        // {
        //   date: '3333333333333333333333333333333333333.jpg',
        // }
      ],
      selectList:[]
    }
  },
  watch:{
    formItem: {
        handler(val, newval) {
          let temp = val[this.item.key];
          let tempArr = [];

          this.selectList = val[this.item.key];

          let mtime = setInterval(() => {
            if(this.formObj.selectData[this.item.key] && this.formObj.selectData[this.item.key].length!==0 &&temp){
              clearInterval(mtime)
              mtime = null;
              //给table赋值
              this.formObj.selectData[this.item.key].map((item)=>{
                temp.map((it)=>{
                  if((it)==(item.value)){
                    let obj = {
                      date:item.text
                    }
                    tempArr.push(obj)
                  }
                })
              })

              //table显示值
              this.tableData = tempArr;
            }
          }, 100);
        },
        deep: true
      }
  },
  mounted(){
  },
  methods: {
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
      }else{
        //非数组值
        this.formObj.selectData[this.item.key].map((item)=>{
          event.map((it)=>{
            if((it)==(item.value)){
              let obj = {
                date:item.text
              }
              tempArr.push(obj)
            }
          })
        })

        //table显示值
        this.tableData = tempArr;
      }

      this.$emit('formChange',event,item,item.key)
    },
    formBlur(){

    },
    formFocus(){

    },
    formVisibleChange(event,item){

    },
    deleteFn(row){
      //获取对应的text
      let v = row.date;
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
              let obj = {
                date:item.text
              }
              tempArr.push(obj)
            }
          })
        })

        //table显示值
        this.tableData = tempArr;
      }else{
        //非数组的值
        //获取对应的value
        this.formObj.selectData[this.item.key].map((item)=>{
          if(v==item.text){
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
              let obj = {
                date:item.text
              }
              tempArr.push(obj)
            }
          })
        })

        //table显示值
        this.tableData = tempArr;
      }

      this.$emit('formChange',this.selectList,this.item,this.item.key)
    }
  },
}
</script>
<style lang="scss" scoped>
.selectListFormComp{
  .compTable{
    margin-top: 2px;
    border-radius: 5px;
    overflow-y: auto;
  }
}
</style>
