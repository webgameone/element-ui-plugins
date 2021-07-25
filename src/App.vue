<template>
  <div id="oaui-app">
    <!-- form组件 -->
    <div class="oaui-header clearfix">
      <ui-form
        ref="uiForm"
        :formObj="dataForm"
        @formReady="dataFormReady"
        @formBlur="formBlur"
        @formBtnClick="formBtnClick"
        @formChange="formChange"
        @searchList="searchList"
        @formKeyupEnter="formKeyupEnter"
        @formVisibleChange="formVisibleChange"
        @resetForm="resetForm"
        @getNodeData="getNodeData"
        @loadNode="loadNode"
      ></ui-form>
    </div>

    <!-- table组件 -->
    <div class="oaui-middle">
      <ui-table ref="xTable" :tableObj="tableObj" @tableOperation="tableOperation"></ui-table>
    </div>

    <!-- 分页 -->
    <div class="oaui-footer">
      <vxe-pager
        :current-page="usageRecord.page.current"
        :page-size="usageRecord.page.size"
        :total="usageRecord.page.total"
        :page-sizes="usageRecord.pageConfig.pageSizes"
        :layouts="usageRecord.pageConfig.layouts"
        @page-change="pageChange"
      >
        <template v-slot:right>
          <span>共{{usageRecord.page.total}}条记录</span>
        </template>
      </vxe-pager>
    </div>

    <!-- 可拖拽缩放的弹窗 -->
    <ui-drag-popup
      v-if="showpopup"
      :popObj="popObj"
      :dialogVisible="showpopup"
      @popupBtnFn="popupBtnFn"
    >
      <div slot="slot">
        <!-- form组件库 -->
        <ui-form
          @formReady="userFormReady"
          ref="userForm"
          :formObj="queryForm"
        ></ui-form>
      </div>
    </ui-drag-popup>

    <!-- ztree弹窗 -->
    <ui-drag-popup
      v-if="showZtreePopup"
      :popObj="popObj"
      :dialogVisible="showZtreePopup"
      @popupBtnFn="popupBtnFn"
    >
      <div slot="slot" style="height:100%">
        <ui-ztree
          :treeProps="ztreeObj"
        ></ui-ztree>
      </div>
    </ui-drag-popup>

    <!-- 抽屉弹窗 -->
    <ui-drawer-popup
      v-if="showDrawer"
      :drawerObj="drawerObj"
      :showDrawer="showDrawer"
      @drawerBtnFn="drawerBtnFn"
    >
      <div slot="slot">
        <!-- form组件库 -->
        <ui-form ref="drawerForm" :formObj="drawerForm"></ui-form>
      </div>
    </ui-drawer-popup>

    <!-- 自定义抽屉弹窗 -->
    <ui-custom-drawer
      v-if="showCustomDrawer"
      :drawerObj="customDrawerObj"
      @customDrawerFn="customDrawerFn"
      @customDrawerInnerFn="customDrawerInnerFn"
    >
      <div slot="slot">
        <el-button @click="customDrawerInnerFn('open')">打开二级抽屉</el-button>
        <ui-form ref="drawerForm" :formObj="drawerForm" @formClick="formClick" @formReady="drawerFormReady">
          <template slot="append">.com</template>
        </ui-form>
      </div>
      <div slot="inner">
        <ui-tree
          ref="uiTree"
          class="uiTree"
          :treeObj="formTree"
          @checkChange="checkChange"
          :filter-node-method="formTree.filterNode"
        >
          <template v-slot:treeButton="node">
            <span class="custom-tree-node">
              <span style="display:inline-block;width:200px">{{node.node.label}}</span>
              <span>
                <el-checkbox>添加</el-checkbox>
              </span>
            </span>
          </template>
        </ui-tree>
      </div>
    </ui-custom-drawer>
  </div>
</template>

<script>
import { data } from '@/utils/ztreeData.json'
export default {
  name: "app",
  data() {
    return {
      showpopup: false,
      showZtreePopup:false,
      // form组件库
      dataForm: {
        id: "testForm",
        col: 4, // 自定义列数
        labelWidth: 120, // 自定义label的宽度
        btnInline: true, //查询按钮默认在右侧
        btnArrPos: "left", //下方按钮组默认位置
        showpopup: true,
        needAdvanced:true,//展开收起
        searchTop: '10px',//form距离顶部距离，默认20px
        noButton:false,//是否因此查询和重置按钮
        //自定义的查询按钮
        custQueryBtn:[
          {
            title: "增加",
            key: "add",
            type: "primary",
            disabled: false
          }
        ],
        // 表单下方的按钮组
        bottomBtnArr: [
          {
            title: "可拖拽缩放弹窗按钮",
            key: "btn1",
            type: "primary",
            disabled: false,
            icon: "el-icon-download"
          },
          {
            title: "不可拖拽缩放弹窗按钮",
            key: "btn2",
            icon: "el-icon-setting"
          },
          {
            title: "ztree",
            key: "ztreeBtn",
            type: "primary",
            disabled: false,
            icon: "el-icon-download"
          },
          {
            title: "抽屉弹窗",
            key: "drawerBtn"
          },
          {
            title:'更多操作',
            key:'moreOperation',
            btnType:'dropdown'
          },
          {
            title: "自定义弹窗",
            key: "customDrawerBtn"
          },
          {
              title:'逻辑说明',
              key:'loginShow',
              btnType:'popover',
              //popoverWidth:'500',
              //popoverContent:'哈哈哈哈',
              popoverHtml:'<p>1234</p>',
              comp:'button',
          }
        ],
        // 下拉列表的options
        selectData: {
          routeName: [],
          routeName2: [],
          routeName3: [],
          routeType: [], //路由类型
          moreOperation:[
            '操作1',
            '操作2',
            '操作3'
          ],//更多操作
          radioComp1: [
            {
              title: "第一个"
            },
            {
              title: "第二个"
            }
          ],
          updateType: [
            { text: "网点到中心", value: "网点到中心" },
            { text: "中心到中心", value: "中心到中心" },
            { text: "中心到网点", value: "中心到网点" }
          ],
          siteName: [], //节点网点
          childSiteName: [], //子级网点
          status: [
            { text: "未审核", value: "未审核" },
            { text: "审核通过", value: "审核通过" },
            { text: "审核驳回", value: "审核驳回" }
          ], //审核状态
          cascaderKey: [
            {
              value: "shanghai",
              label: "上海市",
              children: [
                {
                  value: "qingpu",
                  label: "青浦区"
                },
                {
                  value: "minhang",
                  label: "闵行"
                },
              ]
            }
          ],
          vxeSelectKey:[
            {
              text:'下拉选项1',
              value:'下拉选项1'
            },
            {
              text:'下拉选项2',
              value:'下拉选项2'
            }
          ]
        },
        // form表单组件
        formArr: [
          // {
          //   type: "inputComp",
          //   title: "两个组件",
          //   key: "driver1Name",
          //   maxlength: 50,
          //   clearable: true,
          //   autocomplete: "on",
          //   outAdvanced: true,
          //   width: "65%",

          //   hasSlot: true, //是否 可以在当前列中再加入一个输入项，但是两个输入项的宽度需要自定义，否则都为100%
          //   slotData: {
          //     type: "checkboxComp",
          //     key: "driver3Name",
          //     title: "勾选框",
          //     width: "30%"
          //   }
          // },
          {
            type: "inputComp",
            title: "输入框",
            key: "driver1Name",
            maxlength: 50,
            clearable: true,
            autocomplete: "on",
            selectWidth:'150px',
            showSelect:true,
            select:{
              key:'routeName',
              type:'bigDataSelectComp'
            },
            showButton:true,
            outAdvanced: true,
          },
          {
            type: "selectComp",
            title: "归属",
            key: "111111",
            isHand:true,
            placeholder: "请选择或输入查找",
            width:'40%',

            hasSlot:true,//是否 可以在当前列中再加入一个输入项，但是两个输入项的宽度需要自定义，否则都为100%
            needLable:true,
            secondTitleWidth:'calc(20% - 5px)',
            slotData:{
              width:'40%',
              type: "selectComp",
              // marginLeft:'5px',
              title: "路由",
              key: "routeType",
              custText: "content",
              custValue: "content",
              placeholder: "请选择或输入查找"
            },
          },
          {
            type: "bigDataSelectComp",
            title: "归属网点",
            key: "routeName",
            isHand:true,
            placeholder: "请选择或输入查找",
            width:'65%',
            custText:'mtext',
            custValue:'mvalue',

            hasSlot:true,//是否 可以在当前列中再加入一个输入项，但是两个输入项的宽度需要自定义，否则都为100%
            slotData:{
              type:'checkboxComp',
              key:'isEnable1',
              title:'含下级',
              width:'30%',
              float:'left',
              marginLeft:'5px'
            },
          },
          {
            type: "vxeSelect",
            key: "vxeSelectKey",
            title: " ",
            width:120,

            hasSlot: true, //是否 可以在当前列中再加入一个输入项，但是两个输入项的宽度需要自定义，否则都为100%
            slotData: {
              type:"dateRangeComp",
              title:'查询时间',
              key:'queryTime',
              outAdvanced:true,
              clearable:false,
              outAdvanced:true,
              width: `calc(100% - 120px)`,//如果是120，后面的就使用120
            }
          },
          {
            type: "radioComp",
            title: "radio组件",
            key: "radioComp1",
            outAdvanced: true,
            startIndex: 1 //下标从1开始，而不是从0开始
          },
          {
            type: "bigDataSelectComp",
            title: "网点名称",
            key: "routeName",
            isHand: true,
            custText:'mtext',
            custValue:'mvalue',
            placeholder: "请选择或输入查找",
          },
          {
            type: "checkboxComp",
            key: "start",
            title: "",
            disabled:false,
            marginLeft:'5px',
            secondTitle: "这个没标题"
          },
          {
            type: "bigDataSelectComp",
            title: "大数据多选",
            key: "routeName2",
            isHand: true,
            multiple: true,
            custText:'mtext',
            custValue:'mvalue',
            placeholder: "请选择或输入查找"
          },
          {
            type: "bigDataSelectComp",
            title: "大数据带标题",
            key: "routeName3",
            isHand: true,
            multiple: true,
            collapseTags: true,
            selectType: "selectShowIdComp",
            placeholder: "请选择或输入查找",
            custText: "mtext",
            custValue: "mvalue",
            options: [
              {
                title: "城市",
                str: "mtext",
                mstyle: { width: "50%" }
              },
              {
                title: "编码",
                str: "mvalue",
                mstyle: { width: "50%", textAlign: "center" }
              }
            ]
          },
          {
            type: "selectComp",
            title: "路由类型",
            key: "routeType",
            custText: "content",
            custValue: "content",
            placeholder: "请选择或输入查找"
          },
          {
            type:'checkboxComp',
            key:'isContain',
            title:'有标题',
            secondTitle:'这个有标题'
          },
          {
            type: "selectComp",
            title: "维护类型",
            key: "updateType",
            isHand:true,
            placeholder: "请选择或输入查找"
          },
          {
            type: "selectShowIdComp",
            title: "节点网点",
            key: "siteName",
            placeholder: "请选择或输入查找",
            custText: "orgName",
            custValue: "orgName",
            options: [
              {
                title: "城市",
                str: "orgName",
                mstyle: { width: "50%" }
              },
              {
                title: "编码",
                str: "orgCode",
                mstyle: { textAlign: "center", width: "50%" }
              }
            ]
          },
          {
            type: "selectShowIdComp",
            title: "子级网点",
            key: "childSiteName",
            placeholder: "请选择或输入查找",
            custText: "orgName",
            custValue: "orgName",
            options: [
              {
                title: "城市",
                str: "orgName",
                mstyle: { width: "50%" }
              },
              {
                title: "编码",
                str: "orgCode",
                mstyle: { width: "50%", textAlign: "center" }
              }
            ]
          },
          {
            type: "selectComp",
            title: "审核状态",
            key: "status",
            isHand:true,
            placeholder: "请选择或输入查找"
          },
          {
            type: "inputComp",
            title: "完整路由",
            key: "allRouteQuery",
            maxlength: 200,
            clearable: true,
            autocomplete: "on",
            outAdvanced: true
          },
          {
            type: "cascader",
            title: "级联选择",
            key: "cascaderKey",
            clearable: true,
            collapseTags: true
          },
          {
            type:'uploadComp',
            title:'背景图',
            key:'attachmentUrl',
            uploadType:'autoUpload',
            multiple:false,//如果设置未false或者去掉该属性，下方会有列表框，并且支持多选
            acceptSize:10 //只允许上传小于10M的文件
          },
          {
            type: "selectTree",
            title: "下拉树",
            key: "selectTree2",
            placeholder: "请选择或输入查找",
            treeObj:{
              isShowInput: false,
              key: "tree",
              treeDeptData: [
                {
                  label: "一级 1",
                  id:1,
                }
              ],
              checkedKeys: [],
              defaultProps: {
                children: "children",
                label: "label"
              },
              expandAll: false,
              showCheckbox: false,
              checkOnClickNode: true,
              checkStrictly: false,
              expandOnClickNode:false,
              lazy:true
            }
          },
        ]
      },
      //table组件库
      tableObj: {
        id: "mtable",
        loading: false,
        showFooter: true,
        notArrowDrag: true,
        treeConfig:{
          children: 'children',//children的名称
          expandRowKeys:[1005]
        },
        // treeConfig:{
        //   lazy: true,
        //   children: 'children',//children的名称
        //   hasChild: 'hasChild', // 设置是否有子节点标识
        //   loadMethod ({ row }) {
        //     // 模拟后台接口
        //     return new Promise(resolve => {
        //       setTimeout(() => {
        //         const list = [
        //           { id: row.id  + 1, content: '新的驾照1', comment: '这里是备注1', updateEmpName: '小王', updateSiteName: '100',updateTime:'2021-05-11',delFlag:true },
        //           { id: row.id  + 2, content: '新的驾照2', comment: '这里是备注2', updateEmpName: '小张', updateSiteName: '222',updateTime:'2021-12-22',delFlag:false }
        //         ]
        //         resolve(list)
        //       }, 500)
        //     })
        //   }
        // },
        editConfig: { trigger: "manual", mode: "row", autoClear: false }, //table 列表编辑的开启方式
        validRules: {
          content: [{ required: true, message: "该项必须填写" }],
          comment: [{ required: true, message: "该项必须填写" }]
        },
        // offsetHeight:60,
        //底部合计
        /*
        footerMethod:({ columns, data })=>{
            const sums = []

            columns.forEach((column, columnIndex) => {
              if (columnIndex === 0) {
                sums.push('合计')
              } else {
                let tota = null;

                if(column.property!="groupTime"&&column.property!="areaName"&&column.property!="province"&&column.property!="siteName"&&column.property!="preSiteName"){
                  if(column.property=='totalPoll'||column.property=='totalPcsSum'||column.property=='centerPollNum'||column.property=='centerPcsSum'||column.property=='branchPollNum'||column.property=='branchPcsSum'||column.property=='estimatePollNum'||column.property=='estimatePcsSum'||column.property=='allPollNum'||column.property=='allPcsSum'){
                    tota = this.XEUtils.sum(data, column.property);
                  }else{
                    tota = this.XEUtils.sum(data, column.property).toFixed(2);
                  }
                }else{
                  tota = '-';
                }
                sums.push(tota);
              }
            })
            // 返回一个二维数组的表尾合计
            return [ sums ]
        },
        */
        footerMethod: null, //这里要写上null,否则table会不断报错map ,top之类的
        col: [
          {
            type: "column",
            column: [
              // {
              //   type:'checkbox',
              //   width:60,
              //   align:'center'
              // },
                 {
                title: "操作",
                key: "operation",
                width: 140,
                align: "center",
                fixed: "left",
                operation: true,
                child: [
                  {
                    title: "开启编辑",
                    key: "edit",
                    type: "text"
                  },
                  {
                    title: "纯文字",
                    key: "oldDetail",
                    type: "text"
                  }
                ]
              },
              {
                type: "seq",
                title: "序号",
                width: 60,
                align: "center",
                tree: true //设置该列可以展开tree操作
              },
              // {
              //   title:'编号',
              //   key:'no',
              //   minWidth:100,
              //   align:'center'
              // },
              {
                title: "驾照类型",
                key: "content",
                width: 120,
                align: "center",
                editRender: {
                  name: "input",
                  attrs: { type: "text" }
                }
              },
              {
                title: "驾照类型2",
                key: "content2",
                width: 150,
                align: "center",
                editRender: {
                  name: "input",
                  attrs: { type: "text" }
                }
              },
              {
                title: "驾照类型3",
                key: "content3",
                width: 150,
                align: "center",
                editRender: {
                  name: "input",
                  attrs: { type: "text" }
                }
              },
              {
                title: "备注",
                key: "comment",
                minWidth: 120,
                align: "center",
                editRender: {
                  name: "input",
                  attrs: { type: "text" }
                }
              },
              {
                title: "编辑人",
                key: "updateEmpName",
                width: 120,
                align: "center",
                editRender: {
                  name: "input",
                  attrs: { type: "text" }
                }
              },
              {
                title: "编辑数字",
                key: "updateSiteName",
                minwidth: 120,
                align: "center",
                editRender: {
                  name: "input",
                  attrs: { type: "number" }
                }
              },
              {
                title: "编辑时间",
                key: "updateTime",
                minwidth: 250,
                align: "center"
              },
              // {
              //   title:'变更记录',
              //   key:'lastContent',
              //   minwidth:250,
              //   align:'center'
              // },
              {
                title: "是否停用",
                key: "delFlag",
                width: 100,
                align: "center",
                fixed: "right",
                operation: true,
                outFormatter: "bool",
                child: [
                  {
                    title: "状态",
                    key: "delFlag",
                    onLabel: "是",
                    offLabel: "否",
                    type: "switch"
                  }
                ]
              },
              {
                title: "操作",
                key: "operation",
                width: 500,
                align: "center",
                fixed: "right",
                operation: true,
                child: [
                  {
                    title: "开启编辑",
                    key: "edit",
                    type: "text"
                  },
                  {
                    title: "纯文字",
                    key: "oldDetail",
                    type: "text"
                  },
                  {
                    title: "文字带询问",
                    key: "reject1",
                    type: "popconfirm",
                    popTitle: "确定执行操作吗？",
                    placement: "top"
                  },
                  {
                    title: "删除红色",
                    key: "modif",
                    type: "icon",
                    icon: "el-icon-delete-solid",
                    size: "18",
                    color: "#ff0000",
                    hide: true //是否隐藏,true/false
                  },
                  {
                    title: "图标带询问",
                    key: "reject2",
                    type: "popconfirm",
                    popTitle: "确定执行操作吗？",
                    placement: "top",
                    hide: false, //不隐藏（可以不设置），这个属性不设置默认就是不隐藏

                    popconfirmType: "icon",
                    icon: "el-icon-delete-solid",
                    size: "18",
                    color: "#00ff00"
                  },
                  {
                    title: "询问多选项",
                    key: "popover",
                    type: "popover",
                    popTitle: "",
                    placement: "top",
                    hide: false, //不隐藏（可以不设置），这个属性不设置默认就是不隐藏
                    popData:[{
                      title:"重置系统密码",
                      key:"resetSystem"
                    },{
                      title:"重置巴枪密码",
                      key:"resetGun"
                    }],

                    popoverType: "icon",
                    icon: "el-icon-delete-solid",
                    size: "18",
                    color: "#00ff00"
                  },
                  {
                    type: "editGroup",
                    addIcon:'el-icon-plus',//增加得自定义icon
                    editIcon: "el-icon-edit", //编辑的自定义icon
                    deleteIcon: "el-icon-delete" //删除的自定义icon
                  }
                ]
              }
            ]
          }
        ],
        tableData: null
      },
      //弹窗对象
      popObj: {
        title: "新增",
        col: 3, //弹窗列数
        loading: false,
        // showFooter: false//隐藏底部按钮
      },
      showDrawer: false, //是否显示抽屉弹窗
      drawerObj: {
        title: "新增" //（默认''）
      }, //抽屉弹窗数据
      //弹窗内的form组件
      // form组件库
      queryForm: {
        id: "popupForm",
        col: 1, // 自定义列数
        labelWidth: 110, // 自定义label的宽度
        noButton: true, //不显示查询按钮
        labelTop: true,
        labelPosition: 'left',
        // 下拉列表的options
        selectData: {
          radioComp1: [{ title: "导航菜单" }, { title: "功能菜单" }],
          routeName2:[],
          routeName3: [],
          selectListA:[
          ],
          icon: [
            { text: "11111", value: "11111" },
            { text: "11111", value: "11111" },
            { text: "11111", value: "11111" },
            { text: "11111", value: "11111" },
            { text: "11111", value: "11111" },
            { text: "11111", value: "11111" },
            { text: "11111", value: "11111" },
            { text: "11111", value: "11111" }
          ]
        },
        rules: {
          //form表单验证
          type: [
            { required: true, message: "该项不能为空", trigger: "blur" },
            {
              min: 1,
              max: 50,
              message: "长度在 1 到 50 个字符",
              trigger: "blur"
            }
          ],
          updateType2: [
            { required: true, message: "该项不能为空", trigger: "change" }
          ]
        },
        // form表单组件
        formArr: [
          {
            type: "selectComp",
            title: "弹窗1",
            key: "111111",
            isHand:true,
            placeholder: "请选择或输入查找",
            width:'42%',

            hasSlot:true,//是否 可以在当前列中再加入一个输入项，但是两个输入项的宽度需要自定义，否则都为100%
            needLable:true,
            // secondTitleWidth:'calc(20% - 5px)',
            slotData:{
              width:'42%',
              type: "selectComp",
              title: "弹窗2",
              key: "routeType",
              custText: "content",
              custValue: "content",
              placeholder: "请选择或输入查找"
            },
          },
          {
            type: "bigDataSelectComp",
            title: "大数据多选",
            key: "routeName2",
            isHand: true,
            multiple: true,
            placeholder: "请选择或输入查找",
            filterMethod: query => {
              if (query !== "") {
                setTimeout(() => {
                  this.dataForm.selectData.routeName2 = this.routeNameData.filter(
                    item => {
                      // return item.value.indexOf(query) > -1;
                      if (item.text.includes(query)) {
                        return item;
                      }
                    }
                  );
                }, 100);
              } else {
                this.queryForm.selectData.routeName2 = this.routeNameData;
              }
            }
          },
          {
            type: "bigDataSelectComp",
            title: "大数据带标题",
            key: "routeName3",
            isHand: true,
            selectType: "selectShowIdComp",
            placeholder: "请选择或输入查找",
            custText: "text",
            custValue: "value",
            options: [
              {
                title: "城市",
                str: "text",
                mstyle: { width: "50%" }
              },
              {
                title: "编码",
                str: "value",
                mstyle: { width: "50%", textAlign: "center" }
              }
            ],
            filterMethod: query => {
              if (query !== "") {
                setTimeout(() => {
                  this.dataForm.selectData.routeName3 = this.routeNameData.filter(
                    item => {
                      // return item.value.indexOf(query) > -1;
                      if (item.text.includes(query)) {
                        return item;
                      }
                    }
                  );
                }, 100);
              } else {
                this.queryForm.selectData.routeName3 = this.routeNameData;
              }
            }
          },
          {
            type: "inputComp",
            title: "归属上级菜单",
            key: "type",
            maxlength: 50,
            clearable: true,
            disabled: true,
            autocomplete: "on"
          },
          {
            type: "radioComp",
            title: "菜单类型",
            key: "radioComp1",
            outAdvanced: true
          },
          {
            type: "inputComp",
            title: "菜单编码",
            key: "type",
            maxlength: 50,
            clearable: true,
            autocomplete: "on"
          },
          {
            type: "inputComp",
            title: "菜单名称",
            key: "type",
            maxlength: 50,
            clearable: true,
            autocomplete: "on",
            width: "75%",

            hasSlot: true, //是否 可以在当前列中再加入一个输入项，但是两个输入项的宽度需要自定义，否则都为100%
            slotData: {
              type: "checkboxComp",
              key: "driver3Name",
              title: "启用",
              width: "15%"
            }
          },
          {
            type: "selectComp",
            title: "系统分级",
            key: "updateType1",
            placeholder: "请选择或输入查找"
          },
          {
            type: "selectComp",
            title: "使用对象",
            key: "updateType2",
            placeholder: "请选择或输入查找"
          },
          {
            type: "inputComp",
            title: "同级排序",
            key: "sort",
            maxlength: 50,
            clearable: true,
            autocomplete: "on"
          },
          {
            type: "selectComp",
            title: "菜单icon",
            key: "icon",
            placeholder: "请选择或输入查找"
          },
          {
            type: "bigSelectListComp",
            title: "",
            key: "selectListA",
            multiple: true,
            placeholder: "请选择或输入查找",
            showHeader:true,//显示每列的标题
            height:'300',
            isHand: true,
            tableColData:[
              {
                title:'列表1',
                width:'80',
                key:'col1'
              },
              {
                title:'列表2',
                minWidth:'200',
                key:'col2'
              },
              {
                title:'列表3',
                minWidth:'100',
                key:'col3'
              }
            ]
          }
        ]
      },
      drawerForm: {
        id: "drawerForm",
        col: 3, // 自定义列数
        labelWidth: 10, // 自定义label的宽度
        noButton: true, //不显示查询按钮
        formCollapse: true, //开启可以折叠的form表单
        labelPosition: "left", //label文字左对齐
        labelTop: true,
        activeNames: [1, 2, 3, 4],
        // 下拉列表的options
        selectData: {
          siteType: [
            { text: "一级网点", value: "一级网点" },
            { text: "二级网点", value: "二级网点" },
            { text: "3级网点", value: "3级网点" }
          ],
          openAccount: [],
          routeName: [], //路由
          carNo: [], //车牌号码
          carType: [], //车辆类型
          carUse: [], //车辆用途
          intervalMode: [
            { text: "按周", value: "按周" },
            { text: "按月", value: "按月" }
          ], //周期模式
          periodWeek: [
            { text: "周日", value: "1" },
            { text: "周一", value: "2" },
            { text: "周二", value: "3" },
            { text: "周三", value: "4" },
            { text: "周四", value: "5" },
            { text: "周五", value: "6" },
            { text: "周六", value: "7" }
          ],
          periodMonth: [],
          showCheck: ["分拨库存", "网点库存", "预到库存", "未到库存"],
          area:[],
          pid: [{"id":"1022","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"8882223121222","stano":"H8882223121222","station":"测试网3点22222222223222","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1007","pidName":"名称","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A","city":"市B","district":"区C","town":"镇C","street":"街道C","addr":"addr","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"service1022","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":0,"level":1,"path":"1022","createTime":"2021-05-15 16:10:19","createBy":"12","updateTime":"2021-06-07 09:07:54","updateBy":"0","isDelete":0},{"id":"1023","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"88822213121222","stano":"H88822213121222","station":"测试网13点222222221223222","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1022","pidName":"测试网3点22222222223222","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A","city":"市B","district":"区C","town":"镇C","street":"街道C","addr":"addr","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"service1023","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":0,"level":2,"path":"1022|1023","createTime":"2021-05-20 09:54:04","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:07:54","updateBy":"0","isDelete":0},{"id":"1024","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"888222131121222","stano":"H888222131121222","station":"测试网13点2222221221223222","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1022","pidName":"测试网3点22222222223222","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A","city":"市B","district":"区C","town":"镇C","street":"街道C","addr":"addr","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"service1024","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":0,"level":2,"path":"1022|1024","createTime":"2021-05-20 09:54:22","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:07:54","updateBy":"0","isDelete":0},{"id":"1025","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"8882221311212122","stano":"H8882221311212122","station":"测试网13点22222212211223222","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1024","pidName":"测试网13点2222221221223222","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A","city":"市B","district":"区C","town":"镇C","street":"街道C","addr":"addr","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"service1025","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":0,"level":3,"path":"1022|1024|1025","createTime":"2021-05-20 09:54:40","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:07:54","updateBy":"0","isDelete":0},{"id":"1027","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"888222131112212122","stano":"H888","station":"新网点","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1024","pidName":"测试网13点2222221221223222","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A1","city":"市B11","district":"区C2","town":"11","street":"街道C","addr":"addr2","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager2","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"service","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":1,"level":3,"path":"1022|1024|1027","createTime":"2021-05-20 17:46:20","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:07:54","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4675","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"88822213111212122","stano":"H88822213111212122","station":"测试网13点222212212211223222","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1024","pidName":"测试网13点2222221221223222","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A","city":"市B","district":"区C","town":"镇C","street":"街道C","addr":"addr","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":0,"level":3,"path":"1022|1024|4675","createTime":"2021-05-27 17:16:32","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:07:54","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4676","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"8882221311121212122","stano":"H8882221311121212122","station":"测试网13点2222121221212211223222","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1024","pidName":"测试网13点2222221221223222","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A","city":"市B","district":"区C","town":"镇C","street":"街道C","addr":"addr","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":0,"level":3,"path":"1022|1024|4676","createTime":"2021-05-27 17:57:11","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:07:54","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4677","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"1","stano":"H888","station":"新网1点","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1024","pidName":"测试网13点2222221221223222","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A1","city":"市B11","district":"区C2","town":"11","street":"街道C","addr":"addr2","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager2","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":1,"level":3,"path":"1022|1024|4677","createTime":"2021-05-27 17:58:14","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:07:54","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4678","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"H","stanoSuffix":"s1","stano":"Hs1","station":"2","sysType":"TYPE_5","sysTableName":"B_STAT_TYPE","sysTypeName":"一级网点","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1024","pidName":"测试网13点2222221221223222","financeCenterId":"1002","financeCenterName":"名称","paymentAccountId":"1002","paymentAccountNo":1113,"statManageType":"经营类别","statManageTableName":"B_STAT_MANAGE_TYPE","serviceType":1,"state":"省A","city":"市B","district":"区C","town":"镇C","street":"街道C","addr":"addr","coordinate":"","operStartDate":"2020-09-01 00:00:00","operEndDate":"9999-12-31 00:00:00","remark":"","manager":"manager","managerTel":"managerTel","manager2":"manager2","manager2Tel":"manager2Tel","serviceTel":"serviceTel","networkManagerId":0,"isSysDelicc":0,"isSysDelicod":0,"isSysDeli":0,"serviceArea":"","noServiceArea":"","specialServiceArea":"","isOperate":1,"isFinace":0,"level":3,"path":"1022|1024|4678","createTime":"2021-05-31 15:01:51","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:07:54","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4684","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"1","stanoSuffix":"202106070910","stano":"1202106070910","station":"重固网点","sysType":"TYPE_1","sysTableName":"B_STAT_TYPE","sysTypeName":"集团","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1022","pidName":"测试网3点22222222223222","financeCenterId":"1023","financeCenterName":"测试网13点222222221223222","paymentAccountId":"1000","paymentAccountNo":111,"statManageType":"TYPE_1","statManageTableName":"B_STAT_MANAGE_TYPE","statManageTypeName":"直营","serviceType":1,"state":"上海市","city":"上海市","district":"青浦区","town":"重固镇","street":"","addr":"北青公路5777号","coordinate":"121.206469,31.189719","operStartDate":"2021-06-07 00:00:00","operEndDate":"2021-06-30 00:00:00","remark":"测试数据","manager":"邱福建","managerTel":"17610275289","manager2":"邱福建","manager2Tel":"17610275289","serviceTel":"17610275289","networkManagerId":0,"isSysDelicc":1,"isSysDelicod":1,"isSysDeli":1,"serviceArea":"1","noServiceArea":"3","specialServiceArea":"2","isOperate":1,"isFinace":0,"level":3,"path":"1022|4685|4684","createTime":"2021-06-07 09:10:30","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:21:14","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4685","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"1","stanoSuffix":"202106070920","stano":"1202106070920","station":"虹桥网点","sysType":"TYPE_1","sysTableName":"B_STAT_TYPE","sysTypeName":"集团","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1022","pidName":"测试网3点22222222223222","financeCenterId":"1022","financeCenterName":"测试网3点22222222223222","paymentAccountId":"1000","paymentAccountNo":111,"statManageType":"TYPE_1","statManageTableName":"B_STAT_MANAGE_TYPE","statManageTypeName":"直营","serviceType":1,"state":"上海市","city":"上海市","district":"闵行区","town":"虹桥镇","street":"","addr":"虹桥天地","coordinate":"121.316511,31.19209","operStartDate":"2021-06-07 00:00:00","operEndDate":"2021-06-30 00:00:00","remark":"测试备注","manager":"邱福建","managerTel":"17610275289","manager2":"邱福建","manager2Tel":"17610275289","serviceTel":"17610275289","networkManagerId":0,"isSysDelicc":1,"isSysDelicod":1,"isSysDeli":1,"serviceArea":"1","noServiceArea":"3","specialServiceArea":"2","isOperate":1,"isFinace":0,"level":2,"path":"1022|4685","createTime":"2021-06-07 09:20:51","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:20:51","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4686","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"1","stanoSuffix":"202106070925","stano":"1202106070925","station":"徐泾网点","sysType":"TYPE_1","sysTableName":"B_STAT_TYPE","sysTypeName":"集团","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1022","pidName":"测试网3点22222222223222","financeCenterId":"1022","financeCenterName":"测试网3点22222222223222","paymentAccountId":"1000","paymentAccountNo":111,"statManageType":"TYPE_1","statManageTableName":"B_STAT_MANAGE_TYPE","statManageTypeName":"直营","serviceType":1,"state":"上海市","city":"上海市","district":"青浦区","town":"徐泾镇","street":"","addr":"捷克小区","coordinate":"121.280257,31.160599","operStartDate":"2021-06-07 00:00:00","operEndDate":"2021-06-30 00:00:00","remark":"测试数据","manager":"邱福建","managerTel":"17610275289","manager2":"邱福建","manager2Tel":"17610275289","serviceTel":"17610275289","networkManagerId":0,"isSysDelicc":1,"isSysDelicod":1,"isSysDeli":1,"serviceArea":"1","noServiceArea":"3","specialServiceArea":"2","isOperate":1,"isFinace":0,"level":3,"path":"1022|4685|4686","createTime":"2021-06-07 09:27:45","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:30:43","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4687","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"1","stanoSuffix":"202106070935","stano":"1202106070935","station":"淀山湖网点","sysType":"TYPE_1","sysTableName":"B_STAT_TYPE","sysTypeName":"集团","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"1022","pidName":"测试网3点22222222223222","financeCenterId":"1022","financeCenterName":"测试网3点22222222223222","paymentAccountId":"1000","paymentAccountNo":111,"statManageType":"TYPE_1","statManageTableName":"B_STAT_MANAGE_TYPE","statManageTypeName":"直营","serviceType":1,"state":"江苏省","city":"苏州市","district":"昆山市","town":"淀山湖镇","street":"","addr":"淀山湖","coordinate":"121.035725,31.179277","operStartDate":"2021-06-07 00:00:00","operEndDate":"2021-06-30 00:00:00","remark":"测试数据","manager":"邱政德","managerTel":"17610275289","manager2":"邱政德","manager2Tel":"17610275289","serviceTel":"17610275289","networkManagerId":0,"isSysDelicc":1,"isSysDelicod":1,"isSysDeli":1,"serviceArea":"1","noServiceArea":"3","specialServiceArea":"2","isOperate":1,"isFinace":0,"level":3,"path":"1022|4685|4687","createTime":"2021-06-07 09:37:10","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 09:41:28","updateBy":"1000","updateName":"系统管理员","isDelete":0},{"id":"4688","companyId":"1000","companyName":"汇森集团","isEnable":1,"stanoPrefix":"1","stanoSuffix":"202106070943","stano":"1202106070943","station":"爱博网点","sysType":"TYPE_1","sysTableName":"B_STAT_TYPE","sysTypeName":"集团","openAccountType":"TYPE_3","openAccountTableName":"B_OPEN_ACCOUNT_TYPE","openAccountTypeName":"财务中心","pid":"4685","pidName":"虹桥网点","financeCenterId":"1022","financeCenterName":"测试网3点22222222223222","paymentAccountId":"1000","paymentAccountNo":111,"statManageType":"TYPE_1","statManageTableName":"B_STAT_MANAGE_TYPE","statManageTypeName":"直营","serviceType":1,"state":"上海市","city":"上海市","district":"闵行区","town":"华漕镇","street":"","addr":"爱博一村","coordinate":"121.311115,31.206757","operStartDate":"2021-06-07 00:00:00","operEndDate":"2021-06-30 00:00:00","remark":"测试数据","manager":"邱福建","managerTel":"17610275289","manager2":"邱福建","manager2Tel":"17610275289","serviceTel":"17610275289","networkManagerId":0,"isSysDelicc":1,"isSysDelicod":1,"isSysDeli":1,"serviceArea":"1","noServiceArea":"3","specialServiceArea":"2","isOperate":1,"isFinace":0,"level":3,"path":"1022|4685|4688","createTime":"2021-06-07 09:44:31","createBy":"1000","createName":"系统管理员","updateTime":"2021-06-07 10:18:13","updateBy":"1000","updateName":"系统管理员","isDelete":0}]
        },
        rules: {
          //form表单验证
          routeName: [
            { required: true, message: "该项不能为空", trigger: "change" }
          ],
          beginTime: [
            { required: true, message: "该项不能为空", trigger: "blue" }
          ],
          endTime: [
            { required: true, message: "该项不能为空", trigger: "blue" }
          ],
          driver1Name: [
            { required: true, message: "该项不能为空", trigger: "blur" }
          ],
          driver1Phone: [
            {
              required: false,
              // pattern: ocRegExp.Phone,
              message: "手机号码格式错误",
              trigger: "blur"
            }
          ],
          driver2Phone: [
            {
              required: false,
              // pattern: ocRegExp.Phone,
              message: "手机号码格式错误",
              trigger: "blur"
            }
          ],
          carNo: [
            {
              required: true,
              // pattern: ocRegExp.carNumber,
              message: "车牌号输入错误",
              trigger: "change"
            }
          ],
          carType: [
            { required: true, message: "该项不能为空", trigger: "change" }
          ],
          intervalMode: [
            { required: true, message: "该项不能为空", trigger: "change" }
          ],
          periodWeek: [
            { required: false, message: "该项不能为空", trigger: "blur" }
          ],
          periodMonth: [
            { required: false, message: "该项不能为空", trigger: "blur" }
          ]
        },
        // form表单组件
        formArr: [
          {
            key: "base",
            title: "基础资料",
            formItem: [
              {
                type: "inputComp",
                title: `<span>网点编码</span><span style="color:red">(注意事项)</span>`,
                key: "siteCode",
                placeholder: "请输入",
                showButton: true,
                icon: "el-icon-arrow-right",
                labelSlot: true
              },
              {
                type: "inputComp",
                title: "网点名称",
                key: "siteName",
                placeholder: "请输入"
              },
              {
                type: "selectComp",
                title: "网点类型",
                key: "siteType",
                enableMatch: true,
                placeholder: "请选择"
              },
              {
                type: "bigDataSelectComp",
                title: "归属上级",
                key: "pid",
                isHand: true,
                selectType: "selectShowIdComp",
                placeholder: "请选择或输入查找",
                custText: "station",
                custValue: "id",
                options: [
                  {
                    title: "网点名称",
                    str: "station",
                    mstyle: { width: "50%" }
                  },
                  {
                    title: "网点编号",
                    str: "stano",
                    mstyle: { width: "50%", textAlign: "center" }
                  }
                ]
              },
              {
                type: "bigDataSelectComp",
                title: "经营地址",
                key: "area",
                isHand: true,
                width: "50%",
                placeholder: "请选择或输入查找",
                custText: "text",
                custValue: "value",
                col:2,
                filterMethod: query => {
                  if (query !== "") {
                    setTimeout(() => {
                      this.drawerForm.selectData.area = this.destStrAll.filter(
                        item => {
                          if (item.text.indexOf(query) > -1) {
                            return item;
                          }
                        }
                      );
                    }, 100);
                  } else {
                    this.drawerForm.selectData.area = this.destStrAll;
                  }
                },

                hasSlot: true,
                slotData: {
                  type: "inputComp",
                  key: "address",
                  title: "启用",
                  width: "50%"
                }
              },
              {
                type: "dateTime",
                title: "开始时间",
                key: "beginTime",
                placeholder: "请选择时间"
              },
              {
                type: "dateTime",
                title: "结束时间",
                key: "endTime",
                placeholder: "请选择时间"
              },
              {
                type: "checkgroupComp",
                title: " ",
                key: "showCheck",
                disabled:false,
                col: 4
              },
            ]
          }
        ]
      },
      showCustomDrawer: false,
      // 自定义抽屉
      customDrawerObj: {
        title: "新增",
        innerObj: {
          showInner: false,
          title: "二级抽屉"
        }
      },
      //分页
      usageRecord: {
        page: {
          current: 1,
          size: 20,
          total: 0
        },
        pageConfig: {
          pageSizes: [
            { label: "10/条页", value: 10 },
            { label: "20/条页", value: 20 },
            { label: "50/条页", value: 50 },
            { label: "100/条页", value: 100 },
            { label: "200/条页", value: 200 },
            { label: "500/条页", value: 500 }
          ],
          layouts: [
            "Sizes",
            "PrevJump",
            "PrevPage",
            "Number",
            "NextPage",
            "NextJump",
            "FullJump"
          ]
        }
      },
      routeNameData: [],
      formTree: {
        isShowInput: true,
        key: "popTree",
        treeDeptData: [{"id":"1001","roleName":"菜单管理员"},{"id":"1002","roleName":"测试编辑功能"},{"id":"1003","roleName":"财务测试"},{"id":"1004","roleName":"信息"},{"id":"1006","roleName":"IT"}],
        checkedKeys: [],
        defaultProps: {
          children: "childMenu",
          label: "roleName"
        },
        filterNode: (value, data) => {
          if (!value) return true;
          return (
            data.roleName.indexOf(value) !== -1 || data.id.indexOf(value) !== -1
          );
        },
        expandAll: true,
        showCheckbox: true,
        checkOnClickNode: true,
        checkStrictly: false,
        treeSlot: true
      },
      //ztree
      ztreeObj:{
        id:'testTree',
        input: {
          show: true,//默认显示，可不写
          width: "100%",//默认50%
          disabled: true,
        },
        setting: {
          key:{
            children: "children"
          },
          data:{
            simpleData:{
              enable: true,
              idKey: 'id',
              pIdKey: 'pId',
              rootPId: 0,
            }
          },
          check: {
            enable: false //是否开启checkbox
          },
          view: {
            nameIsHTML: true,
            selectedMulti: false,
            showLine: true, //显示连线
            fontCss : {color:"#ff0000"},//文字样式
            dblClickExpand:true,//双击展开子节点
            showIcon:false //显示图标
          },
          edit: {
            enable: false,
            editNameSelectAll: false
          }
        },
        data:null
      }
    };
  },
  components: {},
  created() {
    //创建大数据测试
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      let mdata = [
        {
          id:1005,
          content: "C1",
          comment: "这是备注1",
          updateEmpName: "小刘",
          updateSiteName: 44,
          updateTime: "2021-05-17",
          delFlag: true,
          children: [
            {
              id:1006,
              content: "A1",
              comment: "这是新的备注啊",
              updateEmpName: "张三",
              updateSiteName: 11,
              updateTime: "2021-08-22",
              delFlag: false
            },
            {
              id:1007,
              content: "A2",
              comment: "这是新的备注啊111111",
              updateEmpName: "李四",
              updateSiteName: 22,
              updateTime: "2021-01-11",
              delFlag: true
            }
          ]
        },
        {
          content: "C2",
          comment: "这是备注2啊",
          updateEmpName: "小张",
          updateSiteName: 33,
          updateTime: "2021-02-03",
          delFlag: false,
          hasChild:true, //懒加载tree需要使用这个作为标记
        }
      ];
      this.tableObj.tableData = mdata;

      this.ztreeObj.data = data;

      //操作按钮的修改属性测试
      //修改颜色
      this.$refs.xTable.setOperationAttribute("reject2", "color", "#000000");
      //隐藏
      // this.$refs.xTable.setOperationAttribute(this.tableObj.col.length-1,'reject2','hide',true)

      //大数据下拉列表单选的回显
      this.$refs.uiForm.formItem.routeName = 3;
      //大数据下拉列表多选的回显
      this.$refs.uiForm.formItem.routeName2 = [5,300,700,1800,5000]

      setTimeout(() => {
        // this.$refs.uiForm.$refs.vxeSelectKey.setNewData('下拉选项2');
        // console.log(this.$refs.uiForm.$refs.formItem_testForm);
        // console.log('开始修改');
        this.$set(this.$refs.uiForm.formItem,'vxeSelectKey','下拉选项2')
        // this.$refs.uiForm.formItem.vxeSelectKey = '下拉选项2';
      }, 3000);
      // this.$refs.uiForm.formItem.vxeSelectKey = '下拉选项2';
    });
  },
  methods: {
    formBlur(event){
    },
    //创建大数据测试
    getList() {
      for (let i = 0; i < 100; i++) {
        this.routeNameData.push({
          mtext: "menu" + i,
          mvalue: i,
          other: "other"+i
        }); //测试数据10万条数据, 这里数据多少条无所谓,list.slice(0, rangeNumber)方法只会默认加载初始的10条数据
        this.dataForm.selectData.routeName = this.routeNameData;
        this.dataForm.selectData.routeName2 = this.routeNameData;
        this.dataForm.selectData.routeName3 = this.routeNameData;
        this.drawerForm.selectData.area = this.routeNameData
        this.destStrAll = this.routeNameData

        this.queryForm.selectData.routeName2 = this.routeNameData;
        this.queryForm.selectData.routeName3 = this.routeNameData;
      }
    },
    userFormReady(){
      this.$refs.userForm.Reset()
    },
    searchList() {
      console.log(this.$refs.uiForm.formItem)
    },
    tableOperation(event, row, key) {
      // console.log(key)
      const $table = this.$refs.xTable.$refs.table_mtable;

      if (key == "edit") {
        //开启编辑
        $table.setActiveRow(row);
      } else if (key == "save") {
        $table
          .fullValidate()
          .then(res => {
            // console.log(res);
          })
          .catch(errMap => {
            // console.log(errMap);
          });
      }
    },
    dataFormReady() {
      // this.$refs["uiForm"].setFormAttribute("start", "disabled", true);
    },
    formBtnClick(event, item) {
      if (item == "btn1") {
        this.queryForm.selectData.selectListA=[];
        for(let i=0;i<100;i++){
          let t = {
            text:`列表${i}`,
            value:`列表${i}`,
            table:{col1:`数据${i}`,col2:`数据${i}`,col3:`数据${i}`}
          }
          this.queryForm.selectData.selectListA.push(t);
        }
        this.showpopup = true;

        setTimeout(() => {
          //赋值测试
          this.$refs.userForm.formItem.selectListA=[
            '列表3','列表5','列表30'
          ]
        }, 300);
      } else if (item === "drawerBtn") {
        this.showDrawer = true;
      } else if (item === "customDrawerBtn") {
        this.showCustomDrawer = true;
      } else if (item == "ztreeBtn"){
        this.showZtreePopup = true;
      }
    },
    formChange(event, item, itemKey) {
      // console.log(event);
      // console.log(item.key);
    },
    formKeyupEnter(event, item, itemKey) {
      // console.log(item)
    },
    formClick(event, item) {
      switch (item.key) {
        case "siteCode":
          // 点击输入框右侧按钮，获取输入框内的值
          // console.log(this.$refs.drawerForm.formItem.siteCode);
          break;

        default:
          break;
      }
    },
    drawerFormReady(){
      let param = {
        area:"",
        siteName:""
      };
      Object.entries(param).map(item => {
        const name = item[0];
        this.$refs.drawerForm.setFormAttribute(name, "disabled", true);
      });
      this.$refs.drawerForm.formItem.pid = "1022";
    },
    popupBtnFn(type) {
      if (type == "close") {
        console.log('关闭弹窗')
        this.showpopup = false;
        this.showZtreePopup = false
      }
    },
    // 抽屉弹窗点击事件
    drawerBtnFn(type) {
      switch (type) {
        case "close":
          this.showDrawer = false;
          break;
        case "cancle":
          this.showDrawer = false;
          break;
        case "submit":
          // 提交表单校验
          this.$refs["drawerForm"].$refs["form_drawerForm"].validate(valid => {
            if (valid) {
              // console.log(this.$refs.drawerForm.formItem);
              this.showDrawer = false;
            }
          });
          break;

        default:
          break;
      }
    },
    // 自定义抽屉事件
    customDrawerFn(type) {
      switch (type) {
        case "close":
          this.showCustomDrawer = false;
          break;
        case "cancle":
          this.showCustomDrawer = false;
          break;
        case "submit":
          break;
        default:
          break;
      }
    },
    customDrawerInnerFn(type) {
      switch (type) {
        case "open":
          this.customDrawerObj.innerObj.showInner = true;
          break;
        case "close":
          this.customDrawerObj.innerObj.showInner = false;
          break;
        case "cancle":
          this.customDrawerObj.innerObj.showInner = false;
          break;
        case "submit":
          this.customDrawerObj.innerObj.showInner = false;
          break;

        default:
          break;
      }
    },
    //form 下拉列表事件
    formVisibleChange(event, item) {
      if (item.key == "routeName" && event == false) {
        setTimeout(() => {
          this.dataForm.selectData.routeName = this.routeNameData;
        }, 200);
        // if(this.$refs.uiForm.formItem.routeName==null||this.$refs.uiForm.formItem.routeName==''){
        //   setTimeout(() => {
        //     this.dataForm.selectData.routeName = this.routeNameData;
        //   }, 200);
        // }
      } else if (item.key == "routeName2" && event == false) {
        //多选的话就返回所有值
        setTimeout(() => {
          this.dataForm.selectData.routeName2 = this.routeNameData;
        }, 200);
      }
    },
    resetForm() {
      // console.log(this.$refs['selectTree_tree'])
    },
    getNodeData(data,item,tree) {
      // console.log(tree)
      // console.log(item)
    },
    loadNode(node, resolve) {
      // console.log(node)
      resolve([
        {
          label: "二级 1-1",
          id:11
        }
      ])
    },
    checkChange(node, check, checked) {
      // console.log(node)
      // console.log(check)
      // console.log(checked)
    }
  }
};
</script>

<style lang="scss">
.clearfix:after{
  content:'';
  display: table;
  clear: both;
}
.clearfix{
  *zoom:1;
}
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
}
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
/*正常情况下滑块的样式*/
::-webkit-scrollbar-thumb {
  background-color: #0000000d;
  border-radius: 10px;
  -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
}
/*鼠标悬浮在该类指向的控件上时滑块的样式*/
:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
}
/*鼠标悬浮在滑块上时滑块的样式*/
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
}
/*正常时候的主干部分*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0);
  background-color: white;
}
/*鼠标悬浮在滚动条上的主干部分*/
::-webkit-scrollbar-track:hover {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.4);
  background-color: rgba(0, 0, 0, 0.01);
}
</style>
<style lang="scss" scoped>
#oaui-app {
  margin: 0;
  padding: 0;

  display: flex; /*父元素的定义为flex布局*/
  height: 100%; /*这里也要定义，重要*/
  width: 100%;
  flex-direction: column; /*定义排列方向为竖排*/

  .oaui-header {
    display: block;
  }

  .oaui-middle {
    flex: 1; /*中间分配剩下的所有空间*/
    overflow: auto;
    margin-top: 24px;
  }
  .oaui-footer {
    height: 48px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
