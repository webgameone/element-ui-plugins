<template>
  <div class="selecttablebox">
    <vxe-pulldown ref="xDown4">
      <template v-slot>
        <vxe-input
          v-model="value4"
          clearable
          @keyup="keyupEvent4"
          @focus="focusEvent4"
          @blur="blurEvent4"
          @input="keyupEvent4"
          @clear="clearFn()"
          :suffix-icon="icon"
          size="mini"
          >
        </vxe-input>
        <!-- suffix-icon="fa vxe-icon--arrow-bottom" -->
      </template>
      <template v-slot:dropdown>
        <div class="my-dropdown4">
          <vxe-grid
            highlight-hover-row
            auto-resize
            show-overflow
            height="auto"
            :loading="loading4"
            :data="tableList4"
            :columns="tablecolumn4"
            @cell-click="cellClickEvent4">
          </vxe-grid>
        </div>
      </template>
    </vxe-pulldown>
  </div>
</template>
<script>
export default {
  props:{
    tablecolumn:{
      type: Array,
      default: () => {
        return []
      }
    },
    tablelist:{
      type:Array,
      default:()=>{
        return []
      }
    },
    Resetname:{
      type:Object,
      default:()=>{
        return {
          label:'',
          code:''
        }
      }
    },
    item:{
      type:Object,
      default:()=>{
        return {
        }
      }
    },
    type:{
      type:String,
      default:'0'
    },
    valuetext:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      value4: '',
      row:{},//当前行数据
      rowindex:0,//当前行选中的索引
      loading4: false,
      tableList4: [],
      tableData4 :this.tablelist,
      tablecolumn4:[],
      Resetname4:this.Resetname,
      icon:'fa vxe-icon--arrow-bottom',
      defTableList:[]
    }
  },
  watch:{
    tablelist:{
      handler(val, newval) {
        this.tableData4 = val;
        this.selectFilter();
      },
      immediate: true,
      deep: true
    },
    tablecolumn:{
      handler(val, newval) {
        this.tablecolumn4 = val;
      },
      immediate: true,
      deep: true
    },
    valuetext:{
      handler(val, newval) {
        this.value4 = val;
        this.row={}
      },
      //immediate: true,
      deep: true
    },
    value4:{
      handler(val,newval){
        if(this.value4 ===''){
          this.row={}
        }
      }
    }
  },
  created(){
  },
  methods:{
    selectFilter() {
      if (this.tableData4.length > 20) {
        this.tableList4 = this.tableData4.slice(0, 20)
        this.defTableList =this.tableData4.slice(0, 20)
      } else {
        this.tableList4 = this.tableData4
      }
    },
    clearFn(){
      this.row = {};
      let prams ={
        row:{},
        index:0
      }
      this.$emit('selectchange', prams)
    },
    focusEvent4 () {
      this.$refs.xDown4.showPanel()
      this.$emit('clickshow','')
      this.icon='fa vxe-icon--arrow-top'
    },
    keyupEvent4 () {
      const { value4 } = this
      this.loading4 = true
      /*setTimeout(() => {

      }, 100)*/
      this.loading4 = false
      if (value4) {
        this.tableList4 = this.tableData4.filter(row => row[this.Resetname4.label].indexOf(value4) > -1)
      } else {
        this.tableList4 = this.defTableList
      }
      //this.selectFilter(value4);
      // this.$emit('selectsearch', value4)
    },
    blurEvent4(event){
      this.icon='fa vxe-icon--arrow-bottom';
      this.$emit('blurFn',event.value,this.item,this.Resetname4.label,this.Resetname4.code)
    },
    cellClickEvent4 ({ row, rowIndex}) {
      this.value4 = row.label || row[this.Resetname4.label]
      this.row = row
      this.rowindex = rowIndex
      this.$refs.xDown4.hidePanel()
      this.icon='fa vxe-icon--arrow-bottom'
      let prams ={
        row:row,
        index:rowIndex
      }
      this.$emit('selectchange', prams)
    },
    //清空
    setClear(){
      this.value4 = '';
    }
  }
}
</script>
<style lang="scss">
  .selecttablebox{
    .vxe-input{
      width:100%
    }
    .vxe-pulldown{
      width:100%
    }
  }
</style>
<style lang="scss" scoped>
.selecttablebox{

  .my-dropdown4 {
    width: 300px;
    height: 250px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
  }
}

</style>
