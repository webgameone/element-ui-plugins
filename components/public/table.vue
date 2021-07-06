<template>
  <div style="height:100%;overflow:hidden;">
    <slot name="tableTopSolt"></slot>
    <div :style="{'height':`calc(100% - ${tableObj.offsetHeight?tableObj.offsetHeight:0}px)`,'overflow':'hidden'}">
      <vxe-table
        row-id="id"
        :class="tableObj.classname?tableObj.classname:'tableBoxComponent'"
        :ref="`table_${tableObj.id}`"
        v-if="tableObj&&tableObj.col.length>0"
        column-key
        keep-source
        border
        resizable
        auto-resize
        highlight-current-row
        highlight-hover-row
        :key="tableKey"
        :loading="tableObj.loading?tableObj.loading:false"
        :height='tableObj.height?tableObj.height:"100%"'
        show-overflow
        :show-footer="tableObj.showFooter?tableObj.showFooter:false"
        :data="tableObj.tableData"
        :edit-config="tableObj.editConfig?tableObj.editConfig:{trigger: 'click', mode: 'cell'}"
        :edit-rules="tableObj.validRules"
        :footer-method="tableObj.footerMethod"
        @checkbox-all="selectAll"
        @checkbox-change="selectChange"
        @cell-click="cellClickEvent"
        @cell-dblclick='cellDBLClickEvent '
        :filter-config="{remote: true}"
        @filter-change="filterMethod"
        @radio-change="radioChangeEvent"
        :row-class-name="rowClassName"
        :cell-class-name="cellClassName"
        :span-method="colspanMethod"
        :scroll-x="{gt: 200}"
        :scroll-y="tableObj.scrollY?tableObj.scrollY:'{gt: 40}'"
        :header-cell-class-name="headerCellClassName"
        :tree-config="tableObj.treeConfig"
        >
          <template v-for="(items) in tableObj.col">
            <vxe-table-colgroup
              :align="items.align?items.align:'center'"
              v-if="items.type=='colgroup'&&(!items.display?items.display:true)"
              :title="items.title"
              :field="items.key"
              :key="items.key"
              :min-width="items.minWidth"
              :gtype="items.gtype?items.gtype:'column'"
            >
              <!-- type=group  :type="items.type?items.type:'column'"-->
              <template v-if="items.gtype=='colgroup'">
                <vxe-table-colgroup
                  v-for='(itemg) in items.column'
                  :title="itemg.title"
                  :field="itemg.key"
                  :key="itemg.key"
                  :align="items.align?items.align:'center'"
                >
                  <vxe-table-column
                    v-for="(item1) in itemg.column"
                    :key = "item1.key"
                    :align="item1.align?item1.align:'center'"
                    :type="item1.type?item1.type:''"
                    :width="item1.width?item1.width:'auto'"
                    :min-width="item1.minWidth"
                    :field="item1.key"
                    :title="item1.title"
                    :sortable="item1.sortable?item1.sortable:false"
                    :formatter="item1.formatter"
                    :cell-render="item1.cellRender?item1.cellRender:null"
                    :edit-render="item1.editRender?item1.editRender:null"
                    :visible="!item1.display?item1.display:true"
                    :tree-node="item.tree?true:false"
                    :sort-by="item.sortBy"
                  >
                  </vxe-table-column>
                </vxe-table-colgroup>
              </template>
              <template v-if="items.gtype=='column'">
                <vxe-table-column
                  v-for="(item) in items.column"
                  :key = "item.key"
                  :align="item.align?item.align:'center'"
                  :type="item.type?item.type:''"
                  :width="item.width?item.width:'auto'"
                  :min-width="item.minWidth"
                  :field="item.key"
                  :title="item.title"
                  :sortable="item.sortable?item.sortable:false"
                  :formatter="item.formatter"
                  :cell-render="item.cellRender?item.cellRender:null"
                  :edit-render="item.editRender?item.editRender:null"
                  :visible="!item.display?item.display:true"
                  :tree-node="item.tree?true:false"
                  :sort-by="item.sortBy"
                >

                <!-- 表头过滤 -->
                <!-- <template v-slot:filter="{ $panel, column }">
                  <div v-if="item.category == 'select'">
                    <select class="my-select" v-model="option.data" v-for="(option, index01) in column.filters" :key="index01" @change="$panel.changeOption($event, !!option.data, option)">
                      <option v-for="(label, cIndex) in item.complaintList" :key="cIndex" :value="label.value">
                        {{
                          label.label
                        }}
                      </option>
                    </select>
                  </div>
                  <div v-if="item.category == 'input'">
                    <input type="type" v-for="(option, index02) in column.filters" :key="index02" v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)" />
                  </div>
                </template> -->

                <!-- 预留插槽 -->
                <template v-if="item.slot" v-slot="{ row }">
                  <slot name='custColumn' :data='{ row }' :dataitem='item'></slot>
                </template>

                </vxe-table-column>
              </template>
            </vxe-table-colgroup>

            <template v-if="items.type=='column'">>
                <vxe-table-column
                  v-for="(item) in items.column"
                  :key = "item.key"
                  :align="item.align?item.align:'center'"
                  :type="item.type?item.type:''"
                  :width="item.width?item.width:'auto'"
                  :min-width="item.minWidth"
                  :field="item.key"
                  :title="item.title"
                  :sortable="item.sortable?item.sortable:false"
                  :formatter="item.formatter"
                  :cell-render="item.cellRender?item.cellRender:null"
                  :edit-render="item.editRender?item.editRender:null"
                  :visible="item.display"
                  :fixed="item.fixed?item.fixed:null"
                  :filters="item.category?[{ data:'' }]:null"
                  :tree-node="item.tree?true:false"
                  :sort-by="item.sortBy"
                >

                <template v-slot:filter="{ $panel, column }">
                  <div v-if="item.category == 'select'">
                    <select class="my-select" v-model="option.data" v-for="(option, index1) in column.filters" :key="index1" @change="$panel.changeOption($event, !!option.data, option)">
                      <option v-for="(label, cIndex) in item.complaintList" :key="cIndex" :value="label.value">
                        {{
                          label.label
                        }}
                      </option>
                    </select>
                  </div>
                  <div v-if="item.category == 'input'">
                    <input type="type" v-for="(option, index2) in column.filters" :key="index2" v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)" />
                  </div>
                </template>

                <!-- 过滤器 -->
                <template v-if="item.filterMethod" v-slot="{ row }">
                  <span v-text="item.filterMethod(row[item.key])"></span>
                </template>
                <!-- 预留插槽 -->
                <template v-else-if="item.slot" v-slot="{ row }">
                  <slot :name='item.slotName?item.slotName:"custColumn"' :data='{ row }'  :dataitem='item'></slot>
                </template>
                <template v-else-if="item.slotclick" v-slot="{ row }">
                  <span :class="{'cellclick':row[item.key]!==0}" @click="CellClick(row[item.key],item.title,row)">{{row[item.key]}}</span>
                </template>
                <!-- 操作 -->
                <template v-else-if="item.operation"  v-slot="{ row }">
                  <template v-for="(it,index) in item.child">
                      <el-button
                        v-if="it.type=='text'"
                        :type="it.type?it.type:'text'"
                        :key="it.key"
                        :disabled="it.disabled?it.disabled:false"
                        :style="{
                          color:it.color?it.color:'default',
                          'display':it.hide&&it.hide==true?'none':'inline-block'
                        }"
                        @click="operationFn($event,row,it.key,index)"
                      >{{it.title}}</el-button>

                      <vxe-switch 
                        v-if="it.type=='switch'"
                        :key="it.key"
                        @change="operationFn($event,row,it.key,index)"
                        v-model="row[it.key]"
                        :on-label="it.onLabel?it.onLabel:' '"
                        :off-label="it.offLabel?it.offLabel:' '"
                      />

                      <!-- 图标的按钮 -->
                      <i
                        v-if="it.type=='icon'"
                        :key="it.key"
                        :style="{
                          'margin-left':it.margin?it.margin+'px':'4px',
                          'margin-right':it.margin?it.margin+'px':'4px',
                          'font-size':it.size?it.size+'px':'18px',
                          'cursor':'pointer',
                          'color':it.color?it.color:'#409EFF',
                          'display':it.hide&&it.hide==true?'none':'inline-block'
                        }"
                        :class="'operationIcon iconfont '+it.icon"
                        @click="operationFn($event,row,it.key,index)"
                      ></i>

                      <el-popconfirm
                        v-if="it.type=='popconfirm'"
                        :key="it.key"
                        :placement="it.placement?it.placement:'top'"
                        :title="it.popTitle&&popTitle!=''?it.popTitle:'确定删除吗？'"
                        @confirm="operationFn($event,row,it.key,index)"
                      >
                        <i
                          v-if="it.popconfirmType=='icon'"
                          slot="reference"
                          :style="{
                            'margin-left':it.margin?it.margin+'px':'4px',
                            'margin-right':it.margin?it.margin+'px':'4px',
                            'font-size':it.size?it.size+'px':'18px',
                            'cursor':'pointer',
                            'color':it.color?it.color:'#409EFF',
                            'display':it.hide&&it.hide==true?'none':'inline-block'
                          }"
                          :class="'operationIcon iconfont '+it.icon"
                        ></i>
                        <el-button
                          v-else
                          type="text"
                          :style="{
                            color:it.color?it.color:'default',
                            marginRight:'10px',
                            'display':it.hide&&it.hide==true?'none':'inline-block'
                          }"
                          slot="reference">{{it.title}}</el-button>
                      </el-popconfirm>

                      <el-popover
                        v-if="it.type=='popover'"
                        :key="it.key"
                        :placement="it.placement?it.placement:'top'"
                        trigger="click"
                        :title="it.popTitle&&popTitle!=''?it.popTitle:''"
                      >
                        <div style="display:flex;flex-direction:column" v-if="it.popData && it.popData.length">
                          <el-button type="text" v-for="pop in it.popData" :key="pop.key" @click="operationFn($event,row,pop.key,index)">{{ pop.title }}</el-button>
                        </div>
                        <i
                          v-if="it.popoverType=='icon'"
                          slot="reference"
                          :style="{
                            'margin-left':it.margin?it.margin+'px':'4px',
                            'margin-right':it.margin?it.margin+'px':'4px',
                            'font-size':it.size?it.size+'px':'18px',
                            'cursor':'pointer',
                            'color':it.color?it.color:'#409EFF',
                            'display':it.hide&&it.hide==true?'none':'inline-block'
                          }"
                          :class="'operationIcon iconfont '+it.icon"
                        ></i>
                        <el-button
                          v-else
                          type="text"
                          :style="{
                            color:it.color?it.color:'default',
                            marginRight:'10px',
                            'display':it.hide&&it.hide==true?'none':'inline-block'
                          }"
                          slot="reference">{{it.title}}</el-button>
                      </el-popover>

                      <!-- 编辑，保存和取消按钮组 -->
                      <div v-if="it.type=='editGroup'" :key="it.key" style="display:inline-block;">
                        <template v-if="$refs[`table_${tableObj.id}`].isActiveByRow(row)">
                          <i
                            :style="{
                              'margin-left':it.margin?it.margin+'px':'4px',
                              'margin-right':it.margin?it.margin+'px':'4px',
                              'font-size':it.size?it.size+'px':'18px',
                              'cursor':'pointer',
                              'color':it.color?it.color:'#00ff00'
                            }"
                            :class="'operationIcon iconfont el-icon-check'"
                            @click="operationFn($event,row,'save',index)"
                          ></i>
                          <i
                            :style="{
                              'margin-left':it.margin?it.margin+'px':'4px',
                              'margin-right':it.margin?it.margin+'px':'4px',
                              'font-size':it.size?it.size+'px':'18px',
                              'cursor':'pointer',
                              'color':it.color?it.color:'#ff0000'
                            }"
                            :class="'operationIcon iconfont el-icon-close'"
                            @click="operationFn($event,row,'cancel',index)"
                          ></i>
                        </template>

                        <template v-else>
                          <!-- add图标不是每个编辑栏都需要 -->
                          <i
                            v-if="it.addIcon"
                            :style="{
                              'margin-left':it.margin?it.margin+'px':'4px',
                              'margin-right':it.margin?it.margin+'px':'4px',
                              'font-size':it.size?it.size+'px':'18px',
                              'cursor':'pointer',
                              'color':'#ff0000',
                            }"
                            :class="'operationIcon iconfont '+it.addIcon"
                            @click="operationFn($event,row,'addChild',index)"
                          ></i>
                          <i
                            :style="{
                              'margin-left':it.margin?it.margin+'px':'4px',
                              'margin-right':it.margin?it.margin+'px':'4px',
                              'font-size':it.size?it.size+'px':'18px',
                              'cursor':'pointer',
                              'color':'#409EFF',
                            }"
                            :class="'operationIcon iconfont '+it.editIcon"
                            @click="operationFn($event,row,'edit',index)"
                          ></i>
                          <i
                            :style="{
                              'margin-left':it.margin?it.margin+'px':'4px',
                              'margin-right':it.margin?it.margin+'px':'4px',
                              'font-size':it.size?it.size+'px':'18px',
                              'cursor':'pointer',
                              'color':'#ff0000',
                            }"
                            :class="'operationIcon iconfont '+it.deleteIcon"
                            @click="operationFn($event,row,'delete',index)"
                          ></i>
                        </template>
                      </div>
                  </template>
                </template>
                <!-- 表头添加图标 -->
                <template v-if='item.icon' v-slot:header>
                  <span class="headerbox">{{item.title}}<i class="vxe-icon--question hover-title" style="color:red;marginLeft:4px;marginTop:-4px"></i><span class="hovershow">{{item.hoverContent}}</span></span>
                </template>
                </vxe-table-column>
            </template>

          </template>
      </vxe-table>

      <!-- 高级table 暂时不写-->
      <!-- <vxe-grid
        v-if="tableObj&&tableObj.type=='grid'&&tableObj.col.length>0"
        border
        resizable
        auto-resize
        :key="tableKey"
        :loading="tableObj.loading?tableObj.loading:false"
        height="100%"
        show-overflow
        :show-footer="tableObj.showFooter?tableObj.showFooter:false"
        :data="tableObj.tableData"
        highlight-hover-row
        :footer-method="tableObj.footerMethod"
        :filter-config="{remote: true}"
        @filter-change="filterMethod"
      >
        <vxe-table-column
          v-for="(item) in tableObj.col"
          :field="item.key"
          :title="item.title"
          :key="item.key"
          :sortable="item.sortable?item.sortable:false"
          :filters="[{ data:'' }]"
          :width="item.width">
          <template v-slot="{ row }" v-if="item.category ==='data'">
            <span v-if="item.field==='sendDate'">{{ row.sendDate | fonrmdata }}</span>
            <span v-if="item.field==='exceptionDate'">{{ row.exceptionDate | fonrmdata }}</span>
            <span v-if="item.field==='acceptDate'">{{ row.acceptDate | fonrmdata }}</span>
            <span v-if="item.field==='centerCheckDate'">{{ row.centerCheckDate | fonrmdata }}</span>
            <span v-if="item.field==='appealDate1'">{{ row.appealDate1 | fonrmdata }}</span>
            <span v-if="item.field==='appealRespondDate1'">{{ row.appealRespondDate1 | fonrmdata }}</span>
            <span v-if="item.field==='byappealRespondDate1'">{{ row.byappealRespondDate1 | fonrmdata }}</span>
            <span v-if="item.field==='bybyappealDate1'">{{ row.bybyappealDate1 | fonrmdata }}</span>
            <span v-if="item.field==='appealRespondDate2'">{{ row.appealRespondDate2 | fonrmdata }}</span>
          </template>
          <template v-slot:filter="{ $panel, column }">
            <div v-if="item.category ==='select'">
              <select class="my-select" v-model="option.data" v-for="(option, index1) in column.filters" :key="index1" @change="$panel.changeOption($event, !!option.data, option)">
                <option v-for="(label, cIndex) in complaintList" :key="cIndex" :value="label.value">
                  {{
                  label.label
                  }}
                </option>
              </select>
            </div>
            <div v-if="item.category ==='input'">
              <input type="type" v-for="(option, index2) in column.filters" :key="index2" v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)" />
            </div>
          </template>
        </vxe-table-column>
      </vxe-grid> -->
    </div>
  </div>
</template>

<script>
/*使用说明
//table的配置项
tableObj:{
  loading:false,//表格搜索的loading
  showFooter:true,//是否显示表底
  notArrowDrag:false,//是否允许列拖动交换，为false允许，为true不允许
  treeChildName:'childs',//设置该table是否有tree子节点的属性名称，默认是childs
  offsetHeight:30,//如果使用了tableTopSolt，那么可以给slot一个固定的高度，table就需要减去相应的高度才能撑满页面高度，offsetHeight就是table将要减去slot的高度值
  editConfig:"{trigger: 'manual', mode: 'row'}",//开启编辑的方式，如果不设置默认是{trigger: 'click', mode: 'cell'}

  //底部合计的演示，如果不需要底部合计，这里一定要赋值为null,否则table会不断报错map ,top之类的
  footerMethod:({ columns, data })=>{
      const sums = []

      columns.forEach((column, columnIndex) => {
        if (columnIndex === 0) {
          sums.push('合计')
        } else {
          let tota = null;

          if(column.property!="groupTime"&&column.property!="areaName"&&column.property!="province"&&column.property!="siteName"&&column.property!="preSiteName"){
            tota = this.XEUtils.sum(data, column.property).toFixed(2);
          }else{
            tota = '-';
          }
          sums.push(tota);
        }
      })
      // 返回一个二维数组的表尾合计
      return [ sums ]
  },
  //所有的列都必须放置在col中
  col:[
    {
      type:'column', //如果不是表头分组的数据就放置在这里
      column:[
        {
          type:'seq', //序号的谷底写法
          title:'序号',
          width:60,
          align:'center'
        },
        {
          title:'被投诉网点-第二次回复时间',
          key:'appealRespondDate2',//必填项，key是唯一值，用于区分不同的字段
          width:250,//固定宽度值，
          minWidth:100,//自适应最小宽度值，如果设置了固定宽度值，该属性无效
          sortable:true,//该列是否支持排序
          display:true,// 是否显示列,默认为true
          align:'center',//列对齐方式
          customRow:true,//如果列的数据需要使用过滤器，这些必须开启
          filterMethod:(data)=>{ //过滤器，直接写在配置项中
            console.log(data)
            return 1111
          }
          fixed:'right',//是否将该列固定在最右侧(默认不需要设置该项)

          formatter:(v)=>{ //格式化列的值，可以自由修改列的值
            return dateFormat(v, 'YYYY-MM-DD HH:mm:ss')
          },
          cellRender:{'name':'preSiteName'},//自定义渲染列，name的值和key值保持一致(formatter和该项二选一)

          operation:true,//如果需要开启列的过滤，必须设置该项，并且设置为true
          category:'input' //过滤的类型，有input .select
          complaintList: [ //如果过滤类型为select，则需要使用该项给options传值
            { label: '是', value: '是' },
            { label: '否', value: '否' }
          ],
          filterMethod:(data)=>{ //当列需要使用过滤方法时，可以给filterMethod传递一个过滤方法
            console.log(data)
            return 1111
          }
        },
        {
          title:'xxxxxx',
          .......................
        },
        //下面只是针对固定右侧的操作栏的使用方式
        {
          title:'操作',
          key:'operation',
          width:250,
          align:'center',
          fixed:'right',
          customRow:true,//这项必须为true
          operation:true,
          child:[
            {
              title:'编辑',
              key:'modif',
              type:'text', //自定义按钮类型，如果不设置，按钮类型默认为text(popconfirm-气泡确认框)
              color:'#ff0000' 自定义文字颜色
            },
            {
              title:'删除',
              key:'delete',
              type:'text',
              color:'#ff0000',
              placement:'left' //气泡确认框出现的位置，可以不设置该配置，默认为top
            }
          ]
        },
        //switch切换按钮
        {
          title:'开启状态',
          key:'openState',
          width:100,
          align:'center',
          fixed:'right',
          operation:true,
          child:[
            {
              title:'状态',
              key:'delFlag',
              onLabel:'启用',
              offLabel:'停用',
              type:'switch'
            }
          ]
        }
      ]
    },
    {
      type:'colgroup', //如果是表头分组的数据，就放置在这里
      title:'分拨库存(已到)',//分组表头的标题
      key:'distributionGroup',//分组表头的key值
      display:true,// 是否显示分组
      column:[
        {
          title:'票数',
          key:'centerPollNum',
          formatter:(v)=>{
            return v.cellValue!==null?v.cellValue:0;
          },
          width:90
        },
        {
          .........................................
        }
      ]
    },
  ],
  tableData:null //table的数据
}

//自定义render的示例 ，add的名称要和cellRender中的name保持一致
this.VXETable.renderer.add('preSiteName', {
  renderDefault (h, renderOpts, params) {
    let { row, column } = params
    let { events } = renderOpts
    return [
      <span style="color:#409EFF;cursor:pointer;" onClick={()=>that.gotoCentralSubTable(row)}>{row.preSiteName}</span>
    ]
  }
})
*/
</script>
<script>
// 可拖动列引入库
import Sortable from 'sortablejs';

export default {
  name:"uiTable",
  props:{
    tableObj: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data() {
    return {
      tableKey:0 //强制刷新table使用的
    }
  },
  created(){
    this.columnDrop1();
  },
  mounted() {
    this.$nextTick(()=>{
      //通知父类table渲染完成
      this.$emit("tableReady")
    })
    // console.log(this.tableObj)
  },
  watch:{
    tableObj:{
      handler(val, newval) {
        // console.log('修改了')
        // this.tableKey = Math.random();
      },
      deep: true
    }
  },
  methods: {
    //点击事件
    CellClick(val,title,row){
      if(val !==0){
        this.$emit('CellClick',val,title,row)
      }
    },
    //表格双击事件---zhangyanru 2021/04/08
    cellDBLClickEvent(val){
      this.$emit("cellDBLClickEvent",val)
    },
    //单元格事件
    cellClickEvent(val){
      this.$emit("cellClickEvent",val)
    },
    //表格双击事件
    cellDBLClickEvent(val){
      this.$emit("cellDBLClickEvent",val)
    },
    //复选框全选
    selectAll(val){
      this.$emit("selectAll",val)
    },
    //复选框多选
    selectChange(val){
      this.$emit("selectChange",val)
    },
    //单选
    radioChangeEvent(val){
      this.$emit('radioChangeEvent',val)
    },
    //修改column属性 keyName:key的名字   attrName:要修改的属性名称  value:属性要修改的值   isGroup:是否修改表头组
    setColumnAttribute(keyName,attrName,value,isGroup=false){
      if(isGroup){
        // 带表头的组修改
        let i = this.tableObj.col.findIndex((e,index)=>{
          return e.key == keyName;
        })

        if(i!==-1){
          this.tableObj.col[i][attrName] = value
        }
      }else{
        // 不带表头的column修改
        for(let item of this.tableObj.col){
          if(item.type == 'column'){
            let i = item.column.findIndex((e,index)=>{
              return e.key == keyName;
            })

            if(i!==-1){
              item.column[i][attrName] = value;
              this.tableKey = Math.random();
            }
          }
        }
      }

    },
    //修改操作栏的属性(会对所有的row起作用)
    setOperationAttribute(keyName,attrName,value){
      let mcol = this.tableObj.col[this.tableObj.col.length-1];
      let len = mcol.column.length;
      let operationObj = null;

      if(len==0){
        return;
      }

      for(let i=0;i<len;i++){
        if(mcol.column[i].key=='operation'){
          operationObj = mcol.column[i].child;
        }
      }

      let i = operationObj.findIndex((e,index)=>{
        return e.key == keyName;
      })

      if(i!==-1){
        operationObj[i][attrName] = value;
        this.tableKey = Math.random();
      }
    },
    //可拖动列
    columnDrop1 () {
      this.$nextTick(() => {
        //配置项notArrowDrag为true的话不允许列拖动交换
        if(this.tableObj.notArrowDrag){
          return;
        }

        let refName='table_'+this.tableObj.id;
        const xTable = this.$refs[refName];
        this.sortable1 = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
          handle: '.vxe-header--column:not(.col--fixed)',
          onEnd: ({ item, newIndex, oldIndex }) => {
            const { fullColumn, tableColumn } = xTable.getTableColumn()
            const targetThElem = item
            const wrapperElem = targetThElem.parentNode
            const newColumn = fullColumn[newIndex]
            if (newColumn.fixed) {
              // 错误的移动
              if (newIndex > oldIndex) {
                wrapperElem.insertBefore(targetThElem, wrapperElem.children[oldIndex])
              } else {
                wrapperElem.insertBefore(wrapperElem.children[oldIndex], targetThElem)
              }
              return this.$XModal.message({ message: '固定列不允许拖动！', status: 'error' })
            }
            // 转换真实索引
            const oldColumnIndex = xTable.getColumnIndex(tableColumn[oldIndex])
            const newColumnIndex = xTable.getColumnIndex(tableColumn[newIndex])
            // 移动到目标列
            const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
            fullColumn.splice(newColumnIndex, 0, currRow)
            xTable.loadColumn(fullColumn)
          }
        })
      })
    },
    //过滤方法
    filterMethod(option, row){
      this.$emit('filterMethod',option,row)
    },
    //table行操作列事件
    operationFn(event,row,key,index){
      // console.log(event)
      // console.log(row);
      // console.log(key)
      this.$emit('tableOperation',event,row,key,index)
    },
    //强制刷新table
    reFreshTable(){
      this.tableKey = Math.random();
    },
    //同步数据区别
    rowClassName ({ row, rowIndex }) {
      if (row.changed) {
        return 'row-red'
      }
      if(this.tableObj.classname=='differencedocuments'){
        let arr=['diffRecOverMileageDispatchFee','diffRecDispatchFee','diffRecInfoFee','diffRecShortBargeFee','diffRecLoadUnloadFee','diffRecFreshTransferFee','diffRecTransferFee',
        'diffRecToPaymentProcFee','diffRecFuelFee','diffRecGoodsPaymentProcFee','diffRecDevelopFundFee','diffRecInsuranceFee','diffRecOperateFee','diffRecScanFee','diffRecOverWeightFee',
        'diffRecNetManageFee','diffRecBusLineFee','diffRecReceiptFee','diffPayReceiptFee','diffPayCarFee','diffPayFreshDispatchFee','diffPayDispatchBusLineFee',
        'diffPayOverWeightDispatchFee','diffPayOverMileageDispatchFee','diffPayOverWeightFee','diffPayLoadUnloadFee','diffPayShortBargeFee','diffPayGoodsPaymentFee',
        'diffPayOtherFee','diffPayDispatchFee','diffGoodsPayment','diffToPayment'];
        for(let i=0;i<arr.length;i++){
          if(row[arr[i]]!=undefined && row[arr[i]]!=0){
            return 'yellow_row'
          }
        }
      }
      if(this.tableObj.classname=='financeClass'){
        if(row.costTypeName=='总收入汇总' || row.costTypeName=='总成本汇总' || row.costTypeName=='总费用汇总'){
          return 'row-paure'
        }
        if(row.costTypeName=='主营业务毛利' || row.costTypeName=='经营费用-人工福利' || row.costTypeName=='分拨经营利润'){
          return 'row-yellow'
        }
      }
      if(this.tableObj.classname=='paymentEntry'){
        if(row.exception){
          return 'row-red'
        }
      }
    },
    //更改表头样式 ------隐藏财务报表第一列和第二列中间的边框（勿删）
    headerCellClassName ({ column, columnIndex }) {
      if (this.tableObj.classname=='financeClass' && column.property === 'costTypeName') {
        return 'col-border'
      }
       let greenArr=['recOverMileageDispatchFee','billRecOverMileageDispatchFee','diffRecOverMileageDispatchFee','recTransferFee','billRecTransferFee',
      'diffRecTransferFee','recScanFee','billRecScanFee','diffRecScanFee','recToPaymentProcFee','billRecToPaymentProcFee','diffRecToPaymentProcFee',
      'recOverWeightFee','billRecOverWeightFee','diffRecOverWeightFee','recInfoFee','billRecInfoFee','diffRecInfoFee','recLoadUnloadFee',
      'billRecLoadUnloadFee','diffRecLoadUnloadFee','recBusLineFee','billRecBusLineFee','diffRecBusLineFee','recFreshTransferFee',
      'billRecFreshTransferFee','diffRecFreshTransferFee','payGoodsPaymentFee','billPayGoodsPaymentFee','diffPayGoodsPaymentFee','payLoadUnloadFee','billPayLoadUnloadFee',
      'diffPayLoadUnloadFee','payOverMileageDispatchFee','billPayOverMileageDispatchFee','diffPayOverMileageDispatchFee','payDispatchBusLineFee',
      'billPayDispatchBusLineFee','diffPayDispatchBusLineFee','payCarFee','billPayCarFee','diffPayCarFee','payToPaymentFee','billPayToPaymentFee','diffPayToPaymentFee','goodsPayment','billGoodsPayment','diffGoodsPayment'];
      let blueArr=['recDispatchFee','recOperateFee','billRecDispatchFee','diffRecDispatchFee','billRecOperateFee','diffRecOperateFee','recInsuranceFee',
      'billRecInsuranceFee','diffRecInsuranceFee','recNetManageFee','billRecNetManageFee','diffRecNetManageFee','recGoodsPaymentProcFee',
      'recFuelFee','billRecFuelFee','diffRecFuelFee','recShortBargeFee','billRecShortBargeFee','diffRecShortBargeFee','diffRecReceiptFee',
      'billRecGoodsPaymentProcFee','diffRecGoodsPaymentProcFee','recReceiptFee','billRecReceiptFee','billRecDevelopFundFee','diffRecDevelopFundFee',
      'recDevelopFundFee','payOtherFee','billPayOtherFee','diffPayOtherFee',
      'payShortBargeFee','billPayShortBargeFee','diffPayShortBargeFee','payOverWeightFee','billPayOverWeightFee','diffPayOverWeightFee',
      'payOverWeightDispatchFee','billPayOverWeightDispatchFee','diffPayOverWeightDispatchFee','payFreshDispatchFee','billPayFreshDispatchFee',
      'diffPayFreshDispatchFee','payReceiptFee','billPayReceiptFee','diffPayReceiptFee','payDispatchFee','billPayDispatchFee',
      'diffPayDispatchFee','toPayment','billToPayment','diffToPayment'];
      if(this.tableObj.classname=='differencedocuments'){
        if(greenArr.includes(column.property)){
          return 'green_title'
        }
        if(blueArr.includes(column.property)){
          return 'blue_title'
        }
      }
      if(this.tableObj.classname=='areaClass' || this.tableObj.classname=='provinceClass' ||this.tableObj.classname=='regionClass' ||this.tableObj.classname=='siteClass' ||this.tableObj.classname=='netManageClass'){
        if(column.property=='nowCompleteDiff'){
          return 'header-icon'
        }

      }
    },
    //合并单元格
    colspanMethod({ row, _rowIndex,column, visibleData,}){
      if(this.tableObj.classname=='financeClass'){
        const fields = ['costTypeName','costTypeDtlName']
        const cellValue = row[column.property]
        if (cellValue && fields.includes(column.property)) {
          const prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow[column.property] === cellValue) {
              return { rowspan: 0, colspan: 0 }
          } else {
              let countRowspan = 1
              while (nextRow && nextRow[column.property] === cellValue) {
                  nextRow = visibleData[++countRowspan + _rowIndex]
              }
              if (countRowspan > 1) {
                  return { rowspan: countRowspan, colspan: 1 }
              }
          }
          if(row.costTypeName==row.costTypeDtlName){
            if (column.property === 'costTypeDtlName') {
              return { rowspan: 0, colspan: 0 }
            }else{
              return { rowspan: 1, colspan: 2}
            }
          }
        }
      }
    },
    //单元格样式
    cellClassName({ row, rowIndex, column, columnIndex }){
        if(this.tableObj.classname=='areaClass'){
          if(column.property==='monthCompleteRate' || column.property==='nowCompleteRate'){
            return 'col-rate'
          }else if(column.property==='areaName' || column.property==='queryMonthNum' || column.property==='queryNowNum' || column.property==='queryYesterdayNum'){
            return 'col-font'
          }
        }else if(this.tableObj.classname=='provinceClass'){
          if(column.property==='monthCompleteRate' || column.property==='nowCompleteRate'){
            return 'col-rate'
          }else if(column.property==='province' || column.property==='queryMonthNum' || column.property==='queryNowNum' || column.property==='queryYesterdayNum'){
            return 'col-font'
          }
        }else if(this.tableObj.classname=='regionClass'){
          if(column.property==='monthCompleteRate' || column.property==='nowCompleteRate'){
            return 'col-rate'
          }else if(column.property==='rangeName' || column.property==='queryMonthNum' || column.property==='queryNowNum' || column.property==='queryYesterdayNum'){
            return 'col-font'
          }
        }else if(this.tableObj.classname=='netManageClass'){
          if(column.property==='monthCompleteRate' || column.property==='nowCompleteRate'){
            return 'col-rate'
          }else if(column.property==='empManageName' || column.property==='queryMonthNum' || column.property==='queryNowNum' || column.property==='queryYesterdayNum'){
            return 'col-font'
          }
        }else if(this.tableObj.classname=='siteClass'){
          if(column.property==='monthCompleteRate' || column.property==='nowCompleteRate'){
            return 'col-rate'
          }else if(column.property==='siteName' || column.property==='queryMonthNum' || column.property==='queryNowNum' || column.property==='queryYesterdayNum'){
            return 'col-font'
          }
        }else if(this.tableObj.classname=='allnetRate'){
          if(column.property=='superiorCenter'  || (column.property=='sendNum' && row.sendNum>0) || (column.property=='signNum' && row.signNum>0) || (column.property=='notSignNum' && row.notSignNum>0) || (column.property=='warehouseNum' && row.warehouseNum>0)){
            return 'allnet'
          }
        }else if(this.tableObj.classname=='siteNameRate'){
          if((column.property=='votes' && row.votes>0) || (column.property=='signTicketNum' && row.signTicketNum>0) || (column.property=='noSignNum' && row.noSignNum>0) || (column.property=='dayOverSignNum' && row.dayOverSignNum>0)){
            return 'allnet'
          }
        }else if(this.tableObj.classname=='scanRate'){
          if(column.property=='province' || (column.property=='leakScanCount' && row.leakScanCount>0) || (column.property=='assessmentSum' && row.assessmentSum>0) || (column.property=='leakScanCount' && row.leakScanCount>0) || (column.property=='sendScanCount' && row.sendScanCount>0) || (column.property=='comeScanCount' && row.comeScanCount>0) || (column.property=='sendLeakScanCount' && row.sendLeakScanCount>0) || (column.property=='comeLeakScanCount' && row.comeLeakScanCount>0)){
            return 'color-blue'
          }
        }else if(this.tableObj.classname=='scanRate1'){
          if(column.property=='province' || (column.property=='leakScanCount' && row.leakScanCount>0)){
            return 'color-blue'
          }
        }else if(this.tableObj.classname=='scanAllocteRate'){
          if((column.property=='leakScanCount' && row.leakScanCount>0)
              || (column.property=='leakScanCount' && row.leakScanCount>0) ||  (column.property=='sendLeakScanCount' && row.sendLeakScanCount>0)
              || (column.property=='comeLeakScanCount' && row.comeLeakScanCount>0) || (column.property=='votes' && row.votes>0)
              || (column.property=='totalWarehouseNum' && row.totalWarehouseNum>0)
              || (column.property=='numVotes' && row.numVotes>0)){
            return 'color-blue'
          }
        }else if(this.tableObj.classname=='misPostRate'){
          if(column.property=='wrongScanCount' && row.wrongScanCount>0){
            return 'color-blue'
          }
        }else if(this.tableObj.classname=='controlProClass'){
          if(column.property=="score" && (Number(row.score.replace("%",""))<Number(row.targetScore.replace("%","")))){
            return 'color-red'
          }
        }else if(this.tableObj.classname=='controlSendCarClass'){
          if(column.property=="score" && Number(row.score.replace("%",""))<Number(row.targetScore.replace("%",""))){
            return 'color-red'
          }
        }else if(this.tableObj.classname=='controlRetentionClass'){
          if(column.property=="score" && Number(row.score.replace("%",""))>Number(row.targetScore.replace("%",""))){
            return 'color-red'
          }
        }else if(this.tableObj.classname=='controlScanClass'){
          if(column.property=="score" && Number(row.score.replace("‰",""))>Number(row.targetScore.replace("‰",""))){
            return 'color-red'
          }
        }else if(this.tableObj.classname=='controlMisClass'){
          if(column.property=="score" && Number(row.score.replace("‱",""))>Number(row.targetScore.replace("‱",""))){
            return 'color-red'
          }
        }else if(this.tableObj.classname=='controlCustomerClass'){
          if(column.property=="score" && Number(row.score.replace("%",""))>Number(row.targetScore.replace("%",""))){
            return 'color-red'
          }
        }else if(this.tableObj.classname=='controlDeliveryClass'){
          if(column.property=="score" && Number(row.score.replace("%",""))<Number(row.targetScore.replace("%",""))){
            return 'color-red'
          }
        }else if(this.tableObj.classname=='controlPunishClass'){
          if(column.property=="score" && Number(row.score)>Number(row.targetScore)){
            return 'color-red'
          }
        }
        //寄件交单账单差异对比
        if(this.tableObj.classname=='differencedocuments'){
          let arr=['diffRecOverMileageDispatchFee','diffRecDispatchFee','diffRecInfoFee','diffRecShortBargeFee','diffRecLoadUnloadFee','diffRecFreshTransferFee','diffRecTransferFee',
          'diffRecToPaymentProcFee','diffRecFuelFee','diffRecGoodsPaymentProcFee','diffRecDevelopFundFee','diffRecInsuranceFee','diffRecOperateFee','diffRecScanFee','diffRecOverWeightFee',
          'diffRecNetManageFee','diffRecBusLineFee','diffRecReceiptFee','diffPayReceiptFee','diffPayCarFee','diffPayFreshDispatchFee','diffPayDispatchBusLineFee',
          'diffPayOverWeightDispatchFee','diffPayOverMileageDispatchFee','diffPayOverWeightFee','diffPayLoadUnloadFee','diffPayShortBargeFee','diffPayGoodsPaymentFee',
          'diffPayOtherFee','diffPayDispatchFee','diffGoodsPayment','diffToPayment','payToPaymentFee','billPayToPaymentFee','diffPayToPaymentFee'];
          if(arr.includes(column.property)){
            if(row[column.property]!=0){
              return 'yellow_cell'
            }
          }
        }
    },
    //设置分组表头固定
    toggleFixedColumn (field, type) {
      const xTable = this.$refs[`table_${this.tableObj.id}`];
      const column = xTable.getColumnByField(field)
      const groupFixed = column.fixed ? null : type
      // 将分组整体设置固定列
      XEUtils.eachTree([column], column => {
        column.fixed = groupFixed
      })
      // 刷新列
      xTable.refreshColumn()
    }
  },
}
</script>

<style lang="scss" scoped>
//table过滤下拉列表得宽度
.my-select {
  width: 100%;
}
.cellclick{
  cursor: pointer;
  color: blue;
  text-decoration:underline
}
</style>
<style lang="scss">
.vxe-header--row{
  background: #E8F3FF;
}
//交单管理页面数据同步显示
.tableBoxComponent .vxe-body--row.row-red {
  color: red;
}
.financeClass .vxe-body--row.row-paure {
  background: #B3CCFF;
}
.financeClass .vxe-body--row.row-yellow{
  background: #FFD9B3;
}
.financeClass .vxe-body--row.row-paure {
  background: #B3CCFF;
}
.financeClass .vxe-body--row.row-yellow{
  background: #FFD9B3;
}
//发货量统计
.areaClass .vxe-body--column.col-rate {
  background-color: #F59A23;
  color: #000;
  font-weight: 600;
}
.areaClass .vxe-body--column.col-font{
  color: #409EFF;
  font-weight: 600;
  text-decoration: underline;
}
.areaClass .vxe-body--column.col-font:hover{
  cursor: pointer;
}
.provinceClass .vxe-body--column.col-rate {
  background-color: #F59A23;
  color: #000;
  font-weight: 600;
}
.provinceClass .vxe-body--column.col-font{
  color: #409EFF;
  font-weight: 600;
  text-decoration: underline;
}
.provinceClass .vxe-body--column.col-font:hover{
  cursor: pointer;
}
.regionClass .vxe-body--column.col-rate {
  background-color: #F59A23;
  color: #000;
  font-weight: 600;
}
.regionClass .vxe-body--column.col-font{
  color: #409EFF;
  font-weight: 600;
  text-decoration: underline;
}
.regionClass .vxe-body--column.col-font:hover{
  cursor: pointer;
}
.netManageClass .vxe-body--column.col-rate {
  background-color: #F59A23;
  color: #000;
  font-weight: 600;
}
.netManageClass .vxe-body--column.col-font{
  color: #409EFF;
  font-weight: 600;
  text-decoration: underline;
}
.financeClass.border--full .vxe-header--column.col-border {
  border: 1px solid #E0EFF6;
  text-align: left;
}
.netManageClass .vxe-body--column.col-font:hover{
  cursor: pointer;
}
.siteClass .vxe-body--column.col-rate {
  background-color: #F59A23;
  color: #000;
  font-weight: 600;
}
.siteClass .vxe-body--column.col-font{
  color: #409EFF;
  font-weight: 600;
  text-decoration: underline;
}
.siteClass .vxe-body--column.col-font:hover{
  cursor: pointer;
}
.vxe-table.border--full .vxe-header--column {
    //border: 1px solid #E0E0E0;
    text-align:center;
}
//隐藏财务报表第一列和第二列中间的边框（勿删）
.financeClass.border--full .vxe-header--column.col-border .vxe-resizable{
  background: #E0EFF6;
}
.differencedocuments .vxe-header--column.green_title {
  background-color: #99FFCC;
}
.differencedocuments .vxe-header--column.blue_title {
  background-color: #99FFFF;
}
.differencedocuments .vxe-body--column.yellow_cell {
  background-color: yellow;
}
.differencedocuments .vxe-body--row.yellow_row {
  color: red;
}
.areaClass .vxe-header--column.header-icon{
  .headerbox{
    position: relative;
    .hover-title:hover {
    cursor: pointer;
    }
    .hover-title:hover+.hovershow{
      display: block;
    }
    .hovershow{
      display: none;
      color: red;
      position: absolute;
      top: -20px;
      left: 10px;
      font-size: 12px;
    }
  }
}
.provinceClass .vxe-header--column.header-icon{
  .headerbox{
    position: relative;
    .hover-title:hover {
    cursor: pointer;
    }
    .hover-title:hover+.hovershow{
      display: block;
    }
    .hovershow{
      display: none;
      color: red;
      position: absolute;
      top: -20px;
      left: 10px;
      font-size: 12px;
    }
  }
}
.regionClass .vxe-header--column.header-icon{
  .headerbox{
    position: relative;
    .hover-title:hover {
    cursor: pointer;
    }
    .hover-title:hover+.hovershow{
      display: block;
    }
    .hovershow{
      display: none;
      color: red;
      position: absolute;
      top: -20px;
      left: 10px;
      font-size: 12px;
    }
  }
}
.siteClass .vxe-header--column.header-icon{
  .headerbox{
    position: relative;
    .hover-title:hover {
    cursor: pointer;
    }
    .hover-title:hover+.hovershow{
      display: block;
    }
    .hovershow{
      display: none;
      color: red;
      position: absolute;
      top: -20px;
      left: 10px;
      font-size: 12px;
    }
  }
}
.netManageClass .vxe-header--column.header-icon{
  .headerbox{
    position: relative;
    .hover-title:hover {
    cursor: pointer;
    }
    .hover-title:hover+.hovershow{
      display: block;
    }
    .hovershow{
      display: none;
      color: red;
      position: absolute;
      top: -20px;
      left: 10px;
      font-size: 12px;
    }
  }
}
</style>
