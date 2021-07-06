/*
formObj是一个集合对象，里面包含了针对formObj的配置，以及各个表单组件的配置参数
结构：
formObj:{
  id:'idname',//（必填项）自定义form的id名称，很多功能需要使用自定义的id,因为一个页面可能会有多个form存在,如果使用同样的id名，配置会冲突
  col:number,//自定义列数,如果不设置默认4列
  labelPosition:'right',//label文字的对齐位置，如果不设置，默认右对齐
  labelTop:true,//label文字在输入框的顶部显示，如果设置为true,注意id的名称一定要唯一性（否则多个form的id重名，将会导致不希望的label位置发生错误），如不设置，默认在输入框的左侧
  labelWidth:number,//自定义label的宽度，如果不设置默认100px
  needAdvanced:true,//是否需要展开收起功能,不设置或者设置为false，取消该功能
  noButton:true,//不显示查询和重置按钮，true-不显示 ，不设置或者设置为false，显示查询和重置按钮
  btnInline:false,//查询，重置按钮和右侧按钮是否在表单输入项的右侧，默认为false,当表单输入框非常少的时候（1-2个输入框），可以让查询和重置放在表单的右侧
  labelSuffix:'：'，//当有表单页面全部都是详情页的时候(全部使用textComp类型组件展示)或者label在输入框的顶部时候，可以使用冒号去分割label与(右边的文本/底部的组件)

  formCollapse:true,//开启可以折叠的form表单（允许一个表单存在多个折叠面板中，当使用这个功能时，formArr的数据结构必须修改为固定格式）
  activeNames:[1,2,3],//当formCollapse为true时有效，默认展开的折叠面板

  rules:{ //form表单验证
    areaName: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    num:[
      ................................
    ]
  },
  //表单上方的按钮组的配置
  topBtnArr:[
    {
      title:'全国总表',//title 按钮的名称
      key:'nationalTable',//每个按钮对象的key必须不一样，需要通过key去获取事件类型
      type:'success',//每个按钮的显示状态，不设置默认为''
      size:'small', //按钮大小，如不设置默认small
      icon:'.....' //按钮图标，如不设置默认没有图标

      showPopover:true,//按钮是否带提示信息，如果不设置或者设置为false，按钮不带提示信息
      popoverMargin:'left',//按钮的margin是左边还是右边,需要自己设置，left或者right
      popoverTitle:'标题',//按钮的提示标题，默认为空
      popoverWidth:300,//按钮的提示框宽度，默认为200
      popoverType:'hover',//按钮的提示框的触发方式，默认为hover,也可以使用(click,focus,manual)
      popoverContent:'提示的内容'
    },
    .........
  ],
  //表单下方右侧的按钮组
  bottomBtnArr:[
    {
      title:'导出',
      key:'download',
      type:'success',
      size:'small',
      display:true,//true显示，false隐藏
      icon:'.....'
    }
  ],
  //下拉列表组件的options，通过key绑定，可以方便修改下拉列表的选项
  selectData:{
    websiteData:[{name:'20:00',id:1},{name:'21:00',id:2}],
    ..................
  },
  //下拉列表组件的options，通过key绑定，可以方便对图片数据进行预处理(给imgComp赋值)
  imgData:{
    exceptionUrl:[]
  },
  //form表单组件
  formArr:[
    {
      type:'nullComp', //只是占位置的，并不会显示任何东西
      key:'',//因为是占位符使用，所以key可以不设置任何值
      col:2, //自定义单个组件占据form的列数，默认是1个组件占据1列，如果希望一个组件占据2列或者3列，可以单独配置
      outAdvanced:true
    },
    {
      type:'textComp',
      title:'文字组件',
      key:'22222', //key值，唯一值
      textCount:8, //文本字数限制
      color:'#ff0000',
      showTitle:true //如果有字数限制时，是否显示全部文字弹窗
    },
    {
      type:'timeRangeComp', //时间范围组件
      title:'查询时间', //label名称
      key:'queryTime',  //key值，唯一值
      defaultTime:['12:00:00', '23:59:59'],//默认时间，如果不设置默认['00:00:00', '23:59:59']
      outAdvanced:true,  //当使用展开和收起功能时候，outAdvanced是默认在外部显示的
      col:2,   //自定义单个组件占据form的列数，默认是1个组件占据1列，如果希望一个组件占据2列或者3列，可以单独配置
      display:'none',//隐藏该组件，如果不设置默认为''
    },
    {
      type:'dateTime',//年月日 选择组件
      title:'查询时间', //label名称
      key:'queryTime'  //key值，唯一值
    },
    {
      type:'selectComp', //下拉列表组件
      title:'大区',
      key:'websiteData',
      enableMatch:true,//是否开启输入匹配，如果不匹配自动清空
      placeholder:'请选择网点', //自定义placeholder名称，不设置的话默认为'请选择'
      custText:'content',//自定义text的字段名
      custValue:'content',//自定义value的字段名
      outAdvanced:true,
      strongMatch:true,//强匹配模式-当输入的文字不在下拉列表中，就不被使用
      allowCreate:true,//是否允许自己创建条目，不设置默认为false
      remote:true, //是否允许远程搜索，true-允许 false-不允许
      remoteMethod:
    },
    {
      type:'selectShowIdComp', //自定义模板的下拉列表组件
      title:'节点网点',
      key:'siteName',
      placeholder:'请选择或输入查找',
      custText:'content',//自定义text的字段名
      custValue:'content',//自定义value的字段名
      listName:'城市', //下拉列表左侧的名称
      listValue:'编码', //下拉列表右侧的名称
      multiple: true, //允许多选
      options:[ //自定义options
        {
          title:'城市', //对应的标题
          str:'text', //对应的字段
          mstyle:{width:'150px'} //自定义样式
        },
        {
          title:'编码',
          str:'code',
          mstyle:{width:'100px'}
        },
        {
          title:'网点类型',
          str:'type',
          mstyle:{width:'80px'}
        }
      ]
    }
    {
      type:'selectInputComp',//带下拉条件的输入框
      title:'',//这个组件不需要label的文字
      key:'complaintInput',
      selectkey:'complaintInputSelect',//下拉选项绑定的key
      outAdvanced:true
    },
    {
      type:'selectListComp', //带删除功能列表的下拉选择框
      title:'所属路由',
      key:'route'
    },
    {
      type:'selectDateComp',//带下拉条件的日期选择器
      title:'',//这个组件不需要label的文字
      key:'complaintDate',
      selectkey:'complaintDateSelect',//下拉选项绑定的key
      outAdvanced:true
    },
    {
      type:'inputComp',
      title:'普通输入框',
      key:'minput',
      autocomplete:'on' //记忆并且自动填充 on-开启  off-关闭
    },
    {
      type:'bigInputCheck',//后面带checkbox的textarea文本输入框
      title:'单号',
      checkName:'组合',//checkbox的名称
      checkKey:'checked'//checbox绑定值
    },
    {
      type:'numberInputComp', //数字输入框
      title:'核载吨数',
      key:'brand',
      precision:2, //数值精度 2-2个小数点
      controls:false, //是否显示右侧的数值调节按钮
      min:0, //最小值，可以不设置
      max:50 //最大值，可以不设置
    },
    {
      type:'checkSelectComp',//带checkbox的下拉选择列表
      title:'查询时间段',
      key:'auditNo2',
      checkKey:false //绑定checkbox
    }
    {
      type:'slectTabel',//select中的options是table
      title:'上站网点',
      key:'preSiteCode',
      display:'none'
    },
    {
      type:'checkgroupComp', //checkbox组
      title:' ',//checkbox组需要label,但是必须为空格
      key:'showCheck',
      col:2,
      showPopover:true,//是否显示提示信息
      popover:[ //如果有提示信息，设置提示内容
        {
          title:'标题1',
          width:300,
          type:'hover',
          content:'这是里面的内容1'
        },
        {
          title:'网点库存',
          width:400,
          type:'hover',
          content:'这是里面的内容2'
        },
        .........................
      ]
    },
    {
      type: "imgComp",//图片展示+预览（这里面的数据需要在imgData里面赋值）
      title: "异常图片",
      key: "exceptionUrl"//自定义
    },
    ..................后续待添加
  ],
  //model是默认值赋值操作，里面的key都对应着formArr中的key值
  model:{
    text1:'这是编辑人的数据啊',
    text2:'上海网点',
    time1:"2021-01-21 10:16:59"
  }
}
*/
<template>
  <div :id="formObj.id">
    <div id="customForm" :ref="formObj.id">
      <!-- 表单上方查询按钮组 -->
      <div class="btnbox">
        <template v-if="formObj.topBtnArr&&formObj.topBtnArr.length>0">

          <template v-for="(item) in formObj.topBtnArr">
            <!-- 按钮的popover 文字提示-->
            <el-popover
              v-if="item.showPopover"
              :key="item.key"
              placement="bottom"
              :style="{'width':item.popoverWidth?item.popoverWidth:'200px','margin-left':item.popoverMargin=='left'?'10px':0,'margin-right':item.popoverMargin=='right'?'10px':0}"
              :title="item.popoverTitle?item.popoverTitle:''"
              :width="item.popoverWidth?item.popoverWidth:'200'"
              :trigger="item.popoverType?item.popoverType:'hover'"
              :content="item.popoverContent?item.popoverContent:''"
            >
              <div v-if="item.popoverHtml" v-html="item.popoverHtml" style="width:100%;backgroud:rabg(255,255,255,1)"></div>
              <el-button
                v-if="item.comp=='button'"
                :key="item.key"
                slot="reference"
                :type="item.type?item.type:''"
                :size="item.size?item.size:'small'"
                @click="formClick($event,item.key)">
                {{item.title}}
              </el-button>

              <el-link v-if="item.comp=='text'" slot="reference"  type="primary">{{item.title}}</el-link>
            </el-popover>


            <el-button
              v-else
              :key="item.key"
              :type="item.type?item.type:''"
              :size="item.size?item.size:'small'"
              @click="formClick($event,item.key)">
              {{item.title}}
            </el-button>
          </template>

        </template>
      </div>

      <!-- form表单 -->
      <div class="search" :style="{ marginTop: formObj.searchTop?formObj.searchTop:'20px' }" v-if="formObj.formArr&&formObj.formArr.length>0">
        <el-form
            :ref="'form_'+formObj.id"
            class="demo-form-inline"
            :label-position="formObj.labelPosition?formObj.labelPosition:'right'"
            :rules="formObj.rules?formObj.rules:null"
            :label-width="formObj.labelTop?'100%':(formObj.labelWidth?formObj.labelWidth+'px':'100px')"
            :inline="formObj.formArr.inline?formObj.formArr.inline:true"
            :model="formItem"
            :label-suffix="formObj.labelSuffix?formObj.labelSuffix:''"
            :size="formObj.formArr.size?formObj.formArr.size:'mini'">

            <!-- form表单是需要分组折叠的 -->
            <el-collapse class="formCollapseContainer" v-if="formObj.formCollapse&&formObj.formCollapse==true" :value="formObj.activeNames" @change="handleChange">
              <el-collapse-item
                v-for="(items,index) in formObj.formArr"
                :title="items.title"
                :name="index+1"
                :key="items.key"
                style="position:relative"
              >
                <el-form-item
                  v-for="(item) in items.formItem"
                  :tag="item.type"
                  :key="item.key"
                  :prop="item.key"
                  :label="item.title&&item.title!=''?item.title:' '"
                  :style="{
                    width:formObj.col?(100/(item.col&&item.col!==1?(formObj.col/item.col):formObj.col)+'%'):'25%',
                    display:item.display?item.display:(formObj.needAdvanced==null||item.outAdvanced||advanced)?'inline-block':'none',
                    opacity:item.type=='nullComp'?'0':'1',
                    color:item.color?item.color+'!important':'#606266',
                    fontWeight:item.fontWeight?item.fontWeight:'default'
                    }"
                  >
                    <span v-if="item.labelSlot" slot="label" v-html="item.title"></span>
                    <el-col :span="24">
                      <formItem
                        :formItem="formItem"
                        :formObj="formObj"
                        :item="item"
                        :style="{
                          width:item.width?item.width:'100%',
                          marginLeft:(formObj.labelTop&&formObj.labelTop==true)?(labelWidth/2+'px'):0,float:'left'
                        }"
                        @formClick="formClick"
                        @formChange="formChange"
                        @formKeyupEnter="formKeyupEnter"
                        @formUploadChange="formUploadChange"
                        @submitFormUpload="submitFormUpload"
                        @formBlur="formBlur"
                        @optionChange="optionChange"
                        @formBtnClick="formBtnClick"
                        @inputCheckChange="inputCheckChange"
                        @inputEnter="inputEnter"
                        @formRemoveFiles="formRemoveFiles"
                        @formVisibleChange="formVisibleChange"
                      />

                      <formItem
                        v-if="item.hasSlot&&item.hasSlot==true"
                        :formItem="formItem"
                        :formObj="formObj"
                        :item="item.slotData"
                        :style="{
                          width:item.slotData.width?`calc(${item.slotData.width} - 10px)`:'100%',
                          float:'right'
                        }"
                        @formClick="formClick"
                        @formChange="formChange"
                        @formKeyupEnter="formKeyupEnter"
                        @formUploadChange="formUploadChange"
                        @submitFormUpload="submitFormUpload"
                        @formBlur="formBlur"
                        @optionChange="optionChange"
                        @formBtnClick="formBtnClick"
                        @inputCheckChange="inputCheckChange"
                        @inputEnter="inputEnter"
                        @formRemoveFiles="formRemoveFiles"
                        @formVisibleChange="formVisibleChange"
                      />
                    </el-col>
                </el-form-item>

                <!-- 预留插槽 -->
                <slot v-if="items.formCollapseSlotShow" name="formCollapseSlot" :slotkey="items.key" :slotIndex="index"></slot>

              </el-collapse-item>
            </el-collapse>

            <!-- form表单是不需要分组折叠的 -->
            <el-form-item
                :ref="'formItem_'+formObj.id"
                v-else
                v-for="(item) in formObj.formArr"
                :tag="item.type"
                :key="item.key"
                :prop="item.key"
                :label="item.title&&item.title!=''?item.title:' '"
                :style="{
                  width:formObj.col?(100/(item.col&&item.col!==1?(formObj.col/item.col):formObj.col)+'%'):'25%',
                  display:item.display?item.display:(formObj.needAdvanced==null||item.outAdvanced||advanced)?'inline-block':'none',
                  float:(item.title==' '||item.title=='')&&(item.type!=='vxeSelect'&&item.type!=='checkboxComp'&&item.type!=='radioComp')?none:'left',
                  opacity:item.type=='nullComp'?'0':'1'
                  }"
                >
                <!-- <span v-if="item.labelSlot" slot="label" v-html="item.title"></span> -->
                <el-col :span="24">
                  <!-- 这里的marginLeft只有在label出现在上方的时候才有效 -->
                  <formItem
                    ref="noFormCollapse"
                    :formItem="formItem"
                    :formObj="formObj"
                    :item="item"
                    :style="{
                      width:item.width?item.width:'100%',
                      marginLeft:(formObj.labelTop&&formObj.labelTop==true)?(labelWidth/2+'px'):0,float:'left'
                    }"
                    @formClick="formClick"
                    @formChange="formChange"
                    @formKeyupEnter="formKeyupEnter"
                    @formUploadChange="formUploadChange"
                    @submitFormUpload="submitFormUpload"
                    @formBlur="formBlur"
                    @optionChange="optionChange"
                    @formBtnClick="formBtnClick"
                    @inputCheckChange="inputCheckChange"
                    @inputEnter="inputEnter"
                    @formRemoveFiles="formRemoveFiles"
                    @formVisibleChange="formVisibleChange"
                  />

                  <formItem
                    v-if="item.hasSlot&&item.hasSlot==true"
                    :formItem="formItem"
                    :formObj="formObj"
                    :item="item.slotData"
                    :style="{
                      width:item.slotData.width?item.slotData.width:'100%',
                      float:item.slotData.float?item.slotData.float:'right',
                      marginLeft:item.slotData.marginLeft?item.slotData.marginLeft:'0'
                    }"
                    @formClick="formClick"
                    @formChange="formChange"
                    @formKeyupEnter="formKeyupEnter"
                    @formUploadChange="formUploadChange"
                    @submitFormUpload="submitFormUpload"
                    @formBlur="formBlur"
                    @optionChange="optionChange"
                    @formBtnClick="formBtnClick"
                    @inputCheckChange="inputCheckChange"
                    @inputEnter="inputEnter"
                    @formRemoveFiles="formRemoveFiles"
                    @formVisibleChange="formVisibleChange"
                  />
                  <!-- 副标题 -->
                  <div class="secondTitle" v-if="item.hasSlot&&item.hasSlot==true&&item.needLable==true" :style="{float:'right',width:item.secondTitleWidth?item.secondTitleWidth:'auto'}">
                    <span>{{item.slotData.title}}</span>
                  </div>
                </el-col>
            </el-form-item>

            <!-- form内右侧的查询和重置 -->
            <div v-if="formObj.btnInline&&(!formObj.noButton)" style="float:left;margin-left:10px;margin-bottom:18px;">
              <span class="table-page-search-submitButtons" :style="advanced && {overflow: 'hidden' } || {} ">
                <el-button v-if="formObj.noButton?!formObj.noButton:'true'" :disabled="formObj.searchDisable?formObj.searchDisable:false" type="primary" size="mini" @click="searchlist">查询</el-button>
                <el-button v-if="formObj.noButton?!formObj.noButton:'true'" style="margin-left: 8px" size="mini" @click="Reset()">重置</el-button>
                <a v-if="formObj.needAdvanced" @click="toggleAdvanced" style="margin-left: 8px;font-size:12px;cursor: pointer;color:#409EFF">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced ? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                </a>
              </span>
            </div>

            <!-- 表单左下方的按钮组 暂时不使用-->
            <!-- <el-form-item>
              <el-button
                v-for="(item) in formObj.bottomBtnArr"
                :key="item.key"
                :type="item.type?item.type:'primary'"
                :size="item.size?item.size:'small'"
                @click="formClick($event,item.key)">
              {{item.title}}</el-button>
            </el-form-item> -->

            <!-- 展开收起和右下角的按钮组 在form表单底部-->
            <el-row class="btnwrap"
              v-if="!formObj.btnInline&&(!formObj.noButton)" style="display:inline-block;width:100%;">
              <el-col :span="12">
                <span class="table-page-search-submitButtons" :style="advanced && {overflow: 'hidden' } || {} ">
                  <el-button v-if="formObj.noButton?!formObj.noButton:'true'" type="primary" size="mini" @click="searchlist">查询</el-button>
                  <el-button v-if="formObj.noButton?!formObj.noButton:'true'" style="margin-left: 8px" size="mini" @click="Reset()">重置</el-button>
                  <a v-if="formObj.needAdvanced" @click="toggleAdvanced" style="margin-left: 8px;font-size:12px;cursor: pointer;color:#409EFF">
                    {{ advanced ? '收起' : '展开' }}
                    <i :class="advanced ? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                  </a>
                </span>
              </el-col>
              <el-col :span="12">
                <span class="table-page-search-toolbar" :style="{float: 'right', marginRight: '0'}">
                  <el-button-group>
                    <template v-for="(item) in formObj.bottomBtnArr">
                      <el-button
                      v-if="(item.btnType||item.display==false)?false:true"
                      :key="item.key"
                      :type="item.type?item.type:''"
                      :size="item.size?item.size:'mini'"
                      :icon="item.icon?item.icon:''"
                      :disabled="item.disabled?item.disabled:false"
                      @click="formBtnClick($event,item.key)">{{item.title}}</el-button>

                      <!-- 文件上传按钮 -->
                      <el-upload
                        v-if="item.btnType=='import'"
                        :key="item.key"
                        style="float:left;"
                        ref="uploadFile"
                        :accept="item.acceptFile?item.acceptFile:''"
                        action=""
                        multiple
                        :limit="item.fileLimit?item.fileLimit:1"
                        :http-request="function (file) { return formImportFn(file, item)}"
                        :show-file-list="false"
                        :before-upload="function (file) { return beforeUpload(file, item)}"
                      >
                        <el-button
                          :size="item.size?item.size:'mini'"
                          :icon="item.icon?item.icon:''"
                          style="border-radius:0;border:0;height:28px"
                          type="primary"
                        >{{item.title}}</el-button>
                      </el-upload>
                    </template>
                  </el-button-group>
                </span>
              </el-col>
            </el-row>

            <!-- 右下角的按钮组 默认在form表单右侧-->
            <div class="btnwrap"
              style="width:100%;"
              v-if="formObj.btnInline"
              >
              <div v-if="formObj.bottomBtnArr&&formObj.bottomBtnArr.length>0" :style="{float:formObj.btnArrPos?formObj.btnArrPos:'right',width:formObj.btnArrPos?'100%':'auto'}">
                <span class="table-page-search-toolbar" :style="{float:formObj.btnArrPos?formObj.btnArrPos:'right', marginRight: '0'}">
                  <el-button-group>
                    <template v-for="(item) in formObj.bottomBtnArr">

                       <!-- popover 类型按钮-->
                      <el-popover
                        v-if="item.btnType=='popover'"
                        :key="item.key"
                        placement="bottom"
                        :style="{'width':item.popoverWidth?item.popoverWidth:'200px','margin-left':item.popoverMargin=='left'?'10px':0,'margin-right':item.popoverMargin=='right'?'10px':0}"
                        :title="item.popoverTitle?item.popoverTitle:''"
                        :width="item.popoverWidth?item.popoverWidth:'200'"
                        :trigger="item.popoverType?item.popoverType:'hover'"
                        :content="item.popoverContent?item.popoverContent:''"
                      >
                        <div v-if="item.popoverHtml" v-html="item.popoverHtml" style="width:100%;backgroud:rabg(255,255,255,1)"></div>
                        <el-button
                          v-if="item.comp=='button'"
                          :key="item.key"
                          slot="reference"
                          :type="item.type?item.type:''"
                          :size="item.size?item.size:'mini'"
                          @click="formClick($event,item.key)">
                          {{item.title}}
                        </el-button>

                        <el-link v-if="item.comp=='text'" slot="reference"  type="primary">{{item.title}}</el-link>
                      </el-popover>

                      <el-button
                        v-else
                        :key="item.key"
                        :type="item.type?item.type:''"
                        :size="item.size?item.size:'mini'"
                        :icon="item.icon?item.icon:''"
                        :disabled="item.disabled?item.disabled:false"
                        @click="formBtnClick($event,item.key)"
                      >{{item.title}}</el-button>

                    </template>
                  </el-button-group>
                </span>
              </div>
            </div>
          </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import selectinput from '@/components/public/new/selectinput'
import selecttable from '@/components/public/new/Dropdownselectiontable'
import DatePickers from '@/components/public/new/DatePickers'
import beforeSelect from '@/components/public/new/beforeDrapdownSelect'
import bigInput from '@/components/public/new/bigInput'

//form表单元素
import formItem from '@/components/public/new/formItem'
export default {
  name:"uiForm",
  props:{
    formObj: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  components:{
    // selectinput,
    // selecttable,
    // DatePickers,
    // beforeSelect,
    // bigInput,
    formItem
  },
  data(){
    return{
      randKey:0,
      checkGroup:[],
      formItem: {},
      selectTableColumn:[
        { field: 'orgName', title: '网点名称'},
        { field: 'orgCode', title: '网点编码' }
      ],
      advanced:false, //查询展开收起
      labelWidth:100, //labelWidth的宽度
      inputvalue:'',
      drapSelect:''
    }
  },
  created() {
    //初始化checkBoxGroup
    this.setCheckBoxGroup();
  },
  mounted() {
    this.$nextTick(()=>{
      this.init();
      //通知父组件，form组件已经渲染完成了
      this.$emit('formReady')
    })
  },
  watch:{
    formObj:{
      handler(val, newval) {
        this.setFormContent()
      },
      deep: true
    }
  },
  methods: {
    //初始化form
    init(){
      //设置labelWidth的宽度
      this.setFormContent();

      //初始化formItem
      for(let item of this.formObj.formArr){
        if(item.key && item.key!==''){
          this.$set(this.$refs['form_'+this.formObj.id].model,item.key,null)
        }
      }

      //一进来先重置下，但是必须每个对象都要给个id值
      // this.$refs['form_'+this.formObj.id].resetFields();

      //初始化formItem
      for(let item of this.formObj.formArr){
        if(item.key && item.key!==''){
          // this.$set(this.$refs['form_'+this.formObj.id].model,item.key,null)

          //model默认值赋值操作
          if(this.formObj.model){
            if(this.formObj.model[item.key]){
              this.$set(this.$refs['form_'+this.formObj.id].model,item.key,this.formObj.model[item.key])
            }
          }
        }
      }

      //如果label的位置设置在输入框的顶部，就修改label的padding-left
      if(this.formObj.labelTop){
        let formObj = document.getElementById(this.formObj.id);
        let label = formObj.getElementsByClassName('el-form-item__label');

        label.forEach((item)=>{
          item.style.paddingLeft = (this.labelWidth/2)+"px"
        })
      }
    },
    //初始化checkBoxGroup(重要),如果不这么初始化，checkBoxGroup将不能被正确使用
    setCheckBoxGroup(){
      //初始化checkBoxGroup
      for(let item of this.formObj.formArr){
        if(item.type=='checkgroupComp'){
          this.$set(this.formItem, item.key, [])
        }
        if(item.formItem && item.formItem.length) {
          for(let it of item.formItem){
            if(it.type=='checkgroupComp'){
              this.$set(this.formItem, it.key, [])
            }
          }
        }
      }
    },
    //设置输入框的宽度
    setFormContent(){
      //设置labelWidth的宽度，如果没有设置就默认100
      if(this.formObj.labelWidth!==null){
        this.labelWidth = this.formObj.labelWidth;
      }

      let custForm = this.$refs[this.formObj.id];
      let formContent = custForm.getElementsByClassName('el-form-item__content');
      let len = formContent.length;

      for(let i=0;i<len;i++){
        formContent[i].style.width = `calc(100% - ${this.labelWidth}px)`;

        if(formContent[i].parentNode.getAttribute('tag') == 'selectInputComp' ||formContent[i].parentNode.getAttribute('tag') == 'selectDateComp' ||formContent[i].parentNode.getAttribute('tag') == 'beforeSelectComp'){
          //如果是带select的输入框或者带select的日期选择器，是不需要label的
          formContent[i].style.width = `100%`;
        }
        //新的-如果是前面带select的
        if(formContent[i].parentNode.getAttribute('tag') == 'vxeSelect'){
          formContent[i].style.width = `100%`;
        }
        //checkboxComp
        if(formContent[i].parentNode.getAttribute('tag') == 'checkboxComp' && formContent[i].parentNode.getAttribute('tag').innerHtml==''){
          formContent[i].style.width = `100%`;
        }
      }
    },
    //查询列表
    searchlist(){
      this.$emit('searchList')
    },
    //重置查询
    Reset(ths,isEmit=true){
      this.formObj.formArr.forEach((item,i)=>{
        if(item.checkKey){
          //如果是带checkbox的下拉列表
          this.$set(this.$refs['form_'+this.formObj.id].model,item.checkKey,null);
        }else if(item.type=="selectInputComp"){
          //前面有下拉列表的输入框
        }else if(item.type=="slectTabel"){
          //下拉组件带table
          this.$refs.noFormCollapse[i].$refs[item.key+'_slectTabel'].setClear();
        }else if(item.type=="selectDateComp"){
          //带select的日期下拉组件
          this.$refs.noFormCollapse[i].$refs.datapick.clearTime();
        }
	      if(item.type=='bigInputCheck'){
          this.$refs.noFormCollapse[i].$refs.bigInputCheckRef.clearInput();
        }
        if(item.type=="bigInput"){
          this.$refs.noFormCollapse[i].$refs.bigInputRef.clearInput();
        }
        if(item.hasSlot && item.slotData.type == "checkboxComp"){
          this.$set(this.$refs['form_'+this.formObj.id].model,item['slotData']['key'],null);
        }
      })

      this.$refs['form_'+this.formObj.id].resetFields();

      if(isEmit){
        this.$emit('resetForm');
      }
    },
    //查询展开收起
    toggleAdvanced(){
      this.advanced = !this.advanced
    },
    randomFn(){
      this.randKey = Math.random();
      // this.setFormContent()

      // //如果label的位置设置在输入框的顶部，就修改label的padding-left
      // if(this.formObj.labelTop){
      //   let formObj = document.getElementById(this.formObj.id);
      //   let label = formObj.getElementsByClassName('el-form-item__label');

      //   label.forEach((item)=>{
      //     item.style.paddingLeft = (this.labelWidth/2)+"px"
      //   })
      // }
    },
    //点击
    formClick(event,item){
      this.$emit('formClick',event,item)
    },
    //表单修改
    formChange(event,item,keyName,allData){
      this.$emit('formChange',event,item,keyName,allData)
    },
    //监测键盘Enter
    formKeyupEnter(event,item) {
      this.$emit('formKeyupEnter',event,item,item.key)
    },
    //表单文件选择后自动上传服务器的回调-获取到length后就上传服务器
    formUploadChange(event,item,length){
      this.$emit('formUploadChange',event,item,length);
    },
    submitFormUpload(){
      //上传到服务器
      this.$emit('submitFormUpload')
    },
    //form的blur事件
    formBlur(event,item,expandName,expandCode){
      if(item.type=="selectComp"){
        //下拉列表
        if(event.target.value!==''){
          let re = this.formObj.selectData[item.key].findIndex((item,index)=>{
            return item.text==event.target.value;
          })

          if(re!==-1){
            this.$set(this.formItem,item.key,this.formObj.selectData[item.key][re].value);
          }else{
            this.$set(this.formItem,item.key,event.target.value);
          }
        }else{
          this.$set(this.formItem,item.key,'');
        }
      }else if(item.type=="slectTabel"){
        if(event!==''){
          //这里只能判断orgName的字段
          let re = this.formObj.selectData[item.key].findIndex((item,index)=>{
            return item[expandName]==event;
          })

          if(re!==-1){
            this.$set(this.formItem,item.key,this.formObj.selectData[item.key][re][expandCode]);
          }else{
            this.$set(this.formItem,item.key,event);
          }
        }else{
          this.$set(this.formItem,item.key,'');
        }
      }else{
        this.$emit('formBlur',event,item,item.key)
      }
    },
    //form删除已上传的文件
    formRemoveFiles(event,item){
      this.$emit('formRemoveFiles',event,item)
    },
    formFocus(){
    },
    //form的formVisibleChange事件
    formVisibleChange(event,item){
      this.$emit('formVisibleChange',event,item)
    },
    //前面带select的日期修改事件
    selectDateChange(event,item,key){
      // console.log(event)
      this.$emit('formChange',event,item,key)
    },
    //前面带select的下拉框
    optionChange(event,item,key){
      this.$emit("optionChange",event,item,key)
    },
    //前面带select的input输入事件
    inputChange(event,item,key){
      this.$emit('formChange',event,item,key)
    },
    formBtnClick(event,item){
      this.$emit('formBtnClick',event,item)
    },
    //修改组件属性 keyName:key的名字   attrName:要修改的属性名称  value:属性要修改的值
    setFormAttribute(keyName,attrName,value){
      // console.log(this.formObj.formArr)
      if(this.formObj.formCollapse){
        //折叠的form结构
        for(let i=0;i<this.formObj.formArr.length;i++){
          let j = this.formObj.formArr[i].formItem.findIndex((e,index)=>{
            return e.key == keyName;
          })

          if(j!==-1){
            this.formObj.formArr[i].formItem[j][attrName] = value;
            // 第二个状态跟第一个保持一致
            if(this.formObj.formArr[i].formItem[j].hasSlot) {
              this.formObj.formArr[i].formItem[j].slotData[attrName] = value
            }
            if(this.formObj.formArr[i].formItem[j].showSelect) {
              this.formObj.formArr[i].formItem[j].select[attrName] = value
            }
          }
        }
      }else{
        //非折叠的form结构
        let i = this.formObj.formArr.findIndex((e,index)=>{
          return e.key == keyName;
        })

        if(i!==-1){
          this.formObj.formArr[i][attrName] = value
          // 第二个状态跟第一个保持一致
            if(this.formObj.formArr[i].hasSlot) {
              this.formObj.formArr[i].slotData[attrName] = value
            }
            if(this.formObj.formArr[i].hasSlot) {
              this.formObj.formArr[i].slotData[attrName] = value
            }
            if(this.formObj.formArr[i].showSelect) {
              this.formObj.formArr[i].select[attrName] = value
            }
        }
      }

    },
    //修改组件按钮属性 keyName:key的名字   attrName:要修改的属性名称  value:属性要修改的值
    setFormBtnAttribute(keyName,attrName,value){
      let formBtn = [];

      //如果有头部的btnArr
      if(this.formObj.topBtnArr && this.formObj.topBtnArr.length>0){
        formBtn = formBtn.concat(this.formObj.topBtnArr);
      }
      //如果有底部的btnArr
      if(this.formObj.bottomBtnArr && this.formObj.bottomBtnArr.length>0){
        formBtn = formBtn.concat(this.formObj.bottomBtnArr);
      }

      let i = formBtn.findIndex((e,index)=>{
        return e.key == keyName;
      })

      if(i!==-1){
        formBtn[i][attrName] = value
      }
    },
    selectDrap(command){
    },
    inputCheckChange(event,item){
      this.$emit('inputCheckChange',event,item)
    },
    //input  enter事件
    inputEnter(event,item){
      this.$refs.checkInput[0].select()
      this.$emit("inputEnter",event,item)
    },
    //form按钮-上传文件
    formImportFn(file,item){
      // console.log(file);
      this.$emit("formImport",file,item)
      // 清除掉上一次的上传
      this.$refs.uploadFile[0].clearFiles();
    },
    //form按钮-文件上传前的判断,支持的文件名用逗号分隔
    beforeUpload(file,item){
      //判断文件是否有.
      if(file.name.indexOf('.')==-1){
        this.$message.error(`文件格式错误`);
        return false;
      }

      let typeArr = item.acceptFile.split(',');
      let fId = typeArr.findIndex((item)=>{
        return '.'+file.name.split(".")[1] === item;
      })

      if(fId==-1){
        this.$message.error(`上传文件只能是 ${item.acceptFile} 格式!`);
        return false;
      }

      return true
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }

      // return CheckFormat && isLt2M;
    },
    //过滤未填写的字段
    filterParams(paramsData){
      let params = {}

      for(let item in paramsData){
        if(paramsData[item]!=null && typeof paramsData[item] != 'undefined'){
          params[item] = paramsData[item];
        }
      }

      return params;
    }
  },
}
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
#customForm{
  .el-form-item__content{
    // height: 28px!important;
  }
  .vxeSelectComp{
    height: 28px;
    .el-dropdown{
      width: 100%;
      overflow: hidden;
    }
    .el-dropdown-link{
      display: block;
      width: 99%;
      overflow: hidden;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      position: relative;
    }
    .el-icon--right{
      position: absolute;
      right: 1px;
      top:8px;
    }
  }
  .el-radio{
    margin-right:10px!important;
  }
  .el-form-item{
    margin-right:0;
  }
  .el-collapse{
    border-top:none;
    .el-collapse-item__header{
      font-size: 16px;
      font-weight:600;
    }
  }
  //label的行高修改,颜色也继承父级
  .el-form-item__label{
    float: inherit;
    color: inherit;
    // line-height: 16px;
  }

  .formCollapseContainer{
    .el-form-item__error{
      right: 0;
      left:inherit!important;
    }
  }
}
</style>
<style lang="scss" scoped>
.showAdvanced{
  display: inline-block;
}
.hideAdvanced{
  display: none!important;
}
.select_before{
  display: flex;
  .drapdown_left{
    width: 100px;
    text-align: right;
    padding-right: 11px;
  }
  .select_right {
    flex-grow: 1;
    flex: 1;
  }
}
.secondTitle{
  text-align: right;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>
