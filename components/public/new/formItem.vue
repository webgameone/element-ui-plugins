<template>
  <div class="formItemContainer">
    <!-- null只是占位置的 -->
    <div class="nullComp" v-if="item.type=='nullComp'" style="width:100%;"></div>
    <!-- topNull 文字在上面时候使用-->
    <div class="nullTopComp" v-if="item.type=='nullTopComp'" style="width:100%;"></div>

    <!-- 普通文本显示组件 -->
    <el-tooltip
      v-if="item.type=='textComp'"
      :disabled="item.showTitle?!item.showTitle:true"
    >
      <div v-if="item.showTitle?item.showTitle:false" slot="content">{{formItem[item.key]}}</div>

      <span
        v-if="item.textCount&&item.textCount>0"
        :style="{color:item.color?item.color:'#000000'}"
      >{{formItem[item.key]|formatLength(item.textCount)}}</span>
      <span
        v-else
        :style="{color:item.color?item.color:'#000000'}"
      >{{formItem[item.key]}}</span>
    </el-tooltip>

    <!-- 时分秒时间查询组件 -->
    <el-time-picker
      style="width:100%"
      v-if="item.type=='timeHMSComp'"
      v-model="formItem[item.key]"
      :editable="item.editable!=null?item.editable:true"
      :picker-options="item.pickerOptions?item.pickerOptions:null"
      @change="formChange($event,item)"
      placeholder="任意时间点">
    </el-time-picker>

    <!-- 时间查询组件 -->
    <el-date-picker
      class="timeRangeClass"
      style="width:100%;"
      v-if="item.type=='timeRangeComp'"
      v-model="formItem[item.key]"
      type="datetimerange"
      :value-format="item.valueFormat!=''?item.valueFormat:'yyyy-MM-dd HH:mm:ss'"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :clearable="item.clearable===false?item.clearable:true"
      :disabled="item.disabled?item.disabled:false"
      :default-time="item.defaultTime?item.defaultTime:['00:00:00', '23:59:59']"
      :picker-options="item.pickerOption"
      @change="formChange($event,item)">
    </el-date-picker>

    <!-- 前面有select的时间查询组件-->
    <DatePickers
      v-if="item.type=='selectDateComp'"
      :drapWidth="formObj.labelWidth?formObj.labelWidth:'100'"
      :selectinputlist="formObj.selectInputList[item.key]"
      :clearableProp="item.clearable===false?item.clearable:true"
      :dataType="item.dataType?item.dataType:'daterange'"
      :defaultDate = item.defaultDate
      selecttype="data"
      @selecttype="selectDateChange(formItem[item.selectkey]=$event,item,item.key)"
      @selectDateChange="selectDateChange(formItem[item.key]=$event,item,item.key)"
      ref='datapick'
      :pickerOptions='item.pickerOptions'
    >
    </DatePickers>

    <!-- 日期查询组件格式 2020-01-03~2020-01-23 -->
    <el-date-picker
      style="width:100%"
      v-if="item.type=='dateRangeComp'"
      v-model="formItem[item.key]"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format='yyyy-MM-dd'
      value-format='yyyy-MM-dd'
      :clearable="item.clearable===false?item.clearable:true"
      :picker-options="item.pickerOptions?item.pickerOptions:null"
      @change="formChange($event,item)"
    >
    </el-date-picker>

    <!--new 前面有select的下拉组件 -->
    <beforeSelect
      v-if="item.type=='beforeSelectComp'"
      :drapWidth="formObj.labelWidth?formObj.labelWidth:'100'"
      :selectinputlist='formObj.selectInputList[item.selectkey]'
      :selectlist='formObj.selectData[item.key]'
      :selectData='formObj.selectData'
      selectDrap='data'
      @selectDrap="selectDrap(formItem[item.selectkey]=$event)"
      @getDropdowmselect='optionChange(formItem[item.key]=$event,item,item.key)'
      :showRight='item.showRight?item.showRight:false'
    ></beforeSelect>

    <!-- 下拉组件 -->
    <el-select
      v-if="item.type=='selectComp'"
      filterable
      :multiple="item.multiple?item.multiple:false"
      :remote="item.remote?item.remote:false"
      :remote-method="item.remoteMethod?item.remoteMethod:null"
      :placeholder="item.placeholder?item.placeholder:'请选择'"
      :clearable="item.clearable!=null?item.clearable:true"
      :popper-append-to-body="item.appendBody||item.appendBody==undefined?true:false"
      :allow-create="item.allowCreate?item.allowCreate:false"
      :disabled="item.disabled?item.disabled:false"
      v-model="formItem[item.key]"
      style="width:100%;"
      autocomplete
      :filter-method="item.filterMethod"
      @change="formChange($event,item)"
      @blur="formBlur($event,item)"
      @focus="formFocus($event,item)"
      @visible-change="formVisibleChange($event,item)"
    >
      <el-option
        v-for="(it) in formObj.selectData[item.key]"
        :key="it[item.custValue]?it[item.custValue]:it.value"
        :label="it[item.custText]?it[item.custText]:it.text"
        :value="it[item.custValue]?it[item.custValue]:it.value"></el-option>
    </el-select>

    <!-- 可以支持大数据查询的下拉列表 -->
    <div v-if="item.type=='bigDataSelectComp'" class="bigDataSelectComp" style="width:100%;">
      <bigDataSelect
        :selectlist='formObj.selectData[item.key]'
        :formObj="formObj"
        :item="item"
        :formItem="formItem"
        ref="bigDataSelectComp"
        @formChange="formChange"
        @formBlur="formBlur"
        @formFocus="formFocus"
        @formClear="formClear"
        @formVisibleChange="formVisibleChange"
      ></bigDataSelect>
    </div>

    <div v-if="item.type=='selectTree'" style="width:100%;">
      <selectTree
        :selectlist='formObj.selectData[item.key]'
        :formObj="formObj"
        :item="item"
        :formItem="formItem"
        @formChange="formChange"
        @formBlur="formBlur"
        @formFocus="formFocus"
        @formVisibleChange="formVisibleChange"
        @getNodeData="getNodeData"
        @loadNode="loadNode"
      ></selectTree>
    </div>


    <!-- 下拉组件展示id和名称 -->
    <el-select
      v-if="item.type=='selectShowIdComp'"
      filterable
      class="selectShowIdCompClass"
      :multiple="item.multiple?item.multiple:false"
      :remote="item.remote?item.remote:false"
      :remote-method="item.remoteMethod?item.remoteMethod:null"
      :placeholder="item.placeholder?item.placeholder:'请选择'"
      :clearable="item.clearable!=null?item.clearable:true"
      :popper-append-to-body="false"
      :allow-create="item.allowCreate?item.allowCreate:false"
      :disabled="item.disabled?item.disabled:false"
      v-model="formItem[item.key]"
      style="width:100%"
      :filter-method="item.filterMethod"
      @change="formChange($event,item)"
      @blur="formBlur($event,item)"
      @focus="formFocus()"
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
          v-for="(it) in formObj.selectData[item.key]"
          :key="it[item.custValue]?it[item.custValue]:it.value"
          :label="it[item.custText]?it[item.custText]:it.text"
          :value="it[item.custValue]?it[item.custValue]:it.value"
          >
            <div style="display:flex;justify-content:space-between;">
              <span v-for="(child) in item.options" :key="it[child.str]" :style="child.mstyle">{{it[child.str]}}</span>
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
        <el-option v-for="(it) in formObj.selectData[item.key]"
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

    <!-- 底部带删除功能列表的select组件库 -->
    <selectList
      v-if="item.type=='selectListComp'"
      style="width:100%"
      :formObj="formObj"
      :item="item"
      :formItem="formItem"
      @formChange="formChange"
    ></selectList>

    <!-- 自定义table带删除功能列表的巨量数据select组件库 -->
    <bigSelectList
      v-if="item.type=='bigSelectListComp'"
      style="width:100%"
      :formObj="formObj"
      :item="item"
      :formItem="formItem"
      @formChange="formChange"
      @getBigSelectListTableData="getBigSelectListTableData"
      @formBlur="formBlur"
    ></bigSelectList>


    <!-- 前面带select的输入框 -->
    <selectinput
      v-if="item.type=='selectInputComp'"
      :selectinputlist="formObj.selectInputList[item.key]"
      :labelWidth="labelWidth"
      style="width:100%;"
      :deValue="formItem[item.key]"
      @selecttype="inputChange(formItem[item.selectkey]=$event,item,item.selectkey)"
      @inputChange="inputChange(formItem[item.key]=$event,item,item.key)"
    ></selectinput>

    <!-- 普通输入框 -->
    <el-input
      class="inputComponent"
      v-if="item.type=='inputComp'"
      v-model="formItem[item.key]"
      :minlength="item.minlength"
      :maxlength="item.maxlength"
      :clearable="item.clearable?item.clearable:false"
      :disabled="item.disabled?item.disabled:false"
      :autocomplete="item.autocomplete?item.autocomplete:'off'"
      :type="item.inputType?item.inputType:'text'"
      @input="formChange($event,item)"
      @change="formBlur($event,item)"
      @keyup.enter.native="formKeyupEnter($event,item)"
      :placeholder="item.placeholder?item.placeholder:'请输入内容'"
      style="width:100%;"
    >
      <!-- 前面的下拉列表 -->
      <bigDataSelect
        v-if="item.showSelect"
        :style="{width:item.selectWidth?item.selectWidth:'100px'}"
        slot="prepend"
        :selectlist='formObj.selectData[item.select.key]'
        :formObj="formObj"
        :item="item.select"
        :formItem="formItem"
        @formChange="formChange"
        @formBlur="formBlur"
        @formFocus="formFocus"
        @formVisibleChange="formVisibleChange"
      ></bigDataSelect>
      <!-- 后面的按钮 -->
      <div class="slotButton" slot="append" v-if="item.showButton" @click="formClick($event,item)">
        <i :class="item.icon?item.icon:'el-icon-arrow-right'"></i>
      </div>
    </el-input>

    <!-- 单行转多行输入框 -->
    <div v-if="item.type=='bigInput'" style="width:100%">
      <bigInput ref='bigInputRef' :data="formItem[item.key]" @backContentFn="formChange(formItem[item.key]=$event,item)"
      ></bigInput>
    </div>

    <!-- textarea具备高度的输入框 -->
    <el-input
      v-if="item.type=='textareaComp'"
      type="textarea"
      :rows="item.rows?item.rows:12"
      :minlength="item.minlength"
      :maxlength="item.maxlength"
      :disabled="item.disabled?item.disabled:false"
      placeholder="请输入内容"
      v-model="formItem[item.key]">
    </el-input>

    <!-- 单行转多行输入框,后面跟着checkbox -->
    <div v-if="item.type=='bigInputCheck'" style="width:100%">
      <bigInput ref='bigInputCheckRef' :data="formItem[item.key]" @backContentFn="formChange(formItem[item.key]=$event,item)"  :mwidth="'calc(100% - 57px)'" :placeholder='item.placeholder'></bigInput>
      <el-checkbox style="margin-left:5px;" v-model="formItem[item.checkKey]">{{item.checkName}}</el-checkbox>
    </div>

    <!-- 数字输入框 -->
    <el-input-number
      style="width:100%"
      v-if="item.type=='numberInputComp'"
      v-model="formItem[item.key]"
      :controls="item.controls?item.controls:false"
      :precision="item.precision?item.precision:null"
      controls-position="right"
      :disabled="item.disabled?item.disabled:false"
      @change="formChange($event,item)"
      :min="item.min"
      :max="item.max"
    ></el-input-number>

    <!-- 前面带checkbox的下拉组件 -->
    <div v-if="item.type=='checkSelectComp'" style="width:100%">
      <el-checkbox
        style="float:left;"
        label=""
        :disabled="formItem[item.key]?false:true"
        v-model="formItem[item.checkKey]"
        @change="formChange($event,item)"
      ></el-checkbox>
      <el-select
          class="checkboxSelect"
          filterable
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          clearable
          v-model="formItem[item.key]"
          style="width:calc(100% - 20px);float:right"
          @change="formChange($event,item)"
      >
          <el-option v-for="(item) in formObj.selectData[item.key]" :key="item.value" :label="item.text" :value="item.value">{{ item.text }}</el-option>
      </el-select>
    </div>

    <!-- 前面带chexkbox的输入框 -->
    <div v-if="item.type=='checkInputComp'" style='width:100%'>
      <el-checkbox
        style="float:left;"
        v-model="formItem[item.checkKey]"
        @change="inputCheckChange($event,item)"
      ></el-checkbox>
      <el-input
        ref='checkInput'
        v-model="formItem[item.key]"
        :placeholder="item.placeholder?item.placeholder:'请输入'"
        @keyup.enter.native ="inputEnter($event,item)"
        style="width:calc(100% - 20px);float:right"
      ></el-input>
    </div>

    <!-- checkbox-group -->
    <el-checkbox-group
      class="checkgroupClass"
      v-if="item.type=='checkgroupComp'"
      v-model="formItem[item.key]"
      :disabled="(!item.disabled || item.disabled == undefined)?false:true"
      @change="formChange($event,item)"
      style="width:100%;x;"
    >
      <template  v-for="(nitem,index) in formObj.selectData[item.key]">
        <el-popover
          v-if="item.showPopover"
          :key="nitem"
          style="margin-right:30px"
          placement="bottom"
          :title="item.popover[index].title?item.popover[index].title:''"
          :width="item.popover[index].width?item.popover[index].width:'200'"
          :trigger="item.popover[index].type?item.popover[index].type:'hover'"
          :content="item.popover[index].content?item.popover[index].content:''">
          <el-checkbox
            slot="reference"
            :key="nitem"
            :label="nitem"
          >
          </el-checkbox>
        </el-popover>

        <el-checkbox
          v-else
          :key="nitem"
          :label="nitem"
        >
        </el-checkbox>
      </template>
    </el-checkbox-group>

    <!-- 下拉组件带table -->
    <selecttable
        v-if="item.type=='slectTabel'"
        v-model="formItem[item.key]"
        @selectchange="formChange(formItem[item.key]=$event,item)"
        @change="formChange($event,item)"
        @blurFn="formBlur"
        :ref="item.key+'_slectTabel'"
        type='0'
        :item="item"
        :tablecolumn ='item.column?item.column:selectTableColumn'
        :tablelist='formObj.selectData[item.key]'
        :Resetname="{label:item.labelName,code:item.labelCode}"
        style="width:100%">
    </selecttable>

    <!-- 年月日 -->
    <el-date-picker
      class="dateTimeClass"
      style="width:100%;"
      v-if="item.type=='dateTime'"
      v-model="formItem[item.key]"
      :popper-append-to-body="false"
      :clearable="item.clearable===false?item.clearable:true"
      :disabled="item.disabled?item.disabled:false"
      :type="item.timeType!=null?item.timeType:'date'"
      :format="item.format!=null?item.format:'yyyy-MM-dd'"
      :value-format="item.valueFormat!=null?item.valueFormat:'yyyy-MM-dd'"
      :picker-options="item.pickerOptions?item.pickerOptions:null"
      placeholder="选择日期"
      @change="formChange($event,item)"
      >
    </el-date-picker>

    <!-- 选择月份组件 -->
    <el-date-picker
      v-if="item.type=='monthTime'"
      v-model="formItem[item.key]"
      type="month"
      :format="item.format?item.format:'yyyy-MM'"
      :value-format="item.valueformat?item.valueformat:'yyyy-MM'"
      placeholder="选择月份">
    </el-date-picker>
    <!-- 选择月份开始和结束月份 -->
    <el-date-picker
     v-if="item.type=='datamonthTime'"
      v-model="formItem[item.key]"
      type="monthrange"
      :clearable="item.clearable?item.clearable:false"
      :format="item.format?item.format:'yyyy-MM'"
      :value-format="item.valueformat?item.valueformat:'yyyy-MM'"
      :picker-options="item.pickerOptions?item.pickerOptions:null"
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份"
      @change="formChange($event,item)">
    </el-date-picker>
    <!-- format="yyyy-M"
      value-format="yyyy-M" -->

    <!-- 级联选择 -->
    <el-cascader
      style="width:100%"
      v-if="item.type=='cascader'"
      v-model="formItem[item.key]"
      :clearable="defaultTrue(item.clearable)"
      :options="formObj.selectData[item.key]"
      :props="item.props"
      :collapse-tags="defaultTrue(item.collapseTags)"
      :placeholder="item.placeholder?item.placeholder:'请选择'"
      :size="item.size?item.size:'mini'"
      :disabled="item.disabled?item.placeholder:false"
      :separator="item.separator?item.separator:'/'"
      :filterable="item.filterable?item.filterable:false"
      :filter-method="item.filterMethod"
      @change="formChange($event,item)"
      @blur="formBlur($event,item)"
      @expand-change="formVisibleChange($event,item)"

    >
    </el-cascader>


    <el-upload
      v-if="item.type=='singelUploadComp'"
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

    <!-- 上传组件 上传后就自动提交服务器-->
    <el-upload
      v-if="item.type=='uploadComp'&&item.uploadType=='autoUpload'"
      :class="(typeof item.multiple!=='undefined')&&!item.multiple?'upload-demo':'upload-demo-auto'"
      drag
      :accept="item.acceptFile?item.acceptFile:''"
      :multiple="(typeof item.multiple!=='undefined')&&!item.multiple?item.multiple:true"
      :limit="item.fileLimit?item.fileLimit:3"
      :auto-upload="true"
      :http-request="formImportFn"
      :file-list="fileList"
      :list-type="item.listType?item.listType:text"
      :on-change="function (file,fileList) { return handleChange(file,fileList ,item)}"
      :on-exceed="handleExceed"
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">单个文件大小不要超过10mb</div>
    </el-upload>


    <!-- 上传组件2 上传后需要手动提交服务器-->
    <div style="width:100%;" v-if="item.type=='uploadComp'&&item.uploadType=='handUpload'" class="handUploadContainer">
      <el-upload
        class="upload-demo-hand"
        multiple
        :accept="item.acceptFile?item.acceptFile:''"
        :with-credentials="true"
        :limit="item.fileLimit?item.fileLimit:10"
        :on-preview="handlePreview"
        :before-remove="beforeRemove"
        :on-remove="function (file,fileList) { return handleRemove(file,fileList ,item)}"
        :file-list="formItem[item.key]&&formItem[item.key].length>0?formItem[item.key]:[]"
        :list-type="item.listType?item.listType:text"
        :auto-upload="false"
        :on-change="function (file,fileList) { return handleChange(file,fileList ,item)}"
        :on-exceed="handleExceed"
      >
      <el-button class="selectUploadBtn" style="float:left;" slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button class="beginUploadBtn" style="float:right;margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">单个文件不能超过10MB</div>
      </el-upload>
    </div>

    <!-- 图片展示+图片预览 -->
    <div class="demo-image__preview" v-if="item.type=='imgComp'" style="max-height: 150px;overflow-y: auto;">
      <el-image
        style="width: 60px; height: 60px;margin-right: 5px;"
        :src="it"
        :preview-src-list="formObj.imgData[item.key]" v-for="(it) in formObj.imgData[item.key]" :key="it">
      </el-image>
    </div>

    <!--                                              以下都是小组件                                                                   -->

    <!-- checkbox组件 -->
    <div class="checkboxClass" v-if="item.type=='checkboxComp'">
      <el-checkbox
        @change="formChange($event,item)"
        v-model="formItem[item.key]"
        :disabled="item.disabled?item.disabled:false"
        :style="{marginLeft:item.marginLeft?item.marginLeft:0}"
      >{{item.secondTitle||item.title}}</el-checkbox>
    </div>

    <!-- el-radio -->
    <div v-if="item.type=='radioComp'">
      <el-radio
        v-for="(its,index) in formObj.selectData[item.key]"
        :key="its.title"
        v-model="formItem[item.key]"
        :disabled="item.disabled?item.disabled:false"
        :label="item.startIndex?(Number(item.startIndex)+index):index"
        @change="formChange($event,item)"
      >{{its.title}}</el-radio>
    </div>

    <!-- 输入框前的下拉选项，宽度一般和label保持一致 -->
    <div v-if="item.type=='vxeSelect'" class="selectwrap vxeSelectComp" :style="{'width':formObj.labelWidth?formObj.labelWidth+'px':100+'px',float:'left'}">
      <div class="dropDowmComponents">
        <el-select
          filterable
          :multiple="item.multiple?item.multiple:false"
          :remote="item.remote?item.remote:false"
          :remote-method="item.remoteMethod?item.remoteMethod:null"
          :placeholder="item.placeholder?item.placeholder:'请选择'"
          :popper-append-to-body="item.appendBody||item.appendBody==undefined?true:false"
          :allow-create="item.allowCreate?item.allowCreate:false"
          :disabled="item.disabled?item.disabled:false"
          v-model="formItem[item.key]"
          :clearable="item.clearable?item.clearable:false"
          style="width:100%"
          autocomplete
          :filter-method="item.filterMethod"
          @change="formChange($event,item)"
          @blur="formBlur($event,item)"
          @focus="formFocus($event,item)"
          @visible-change="formVisibleChange($event,item)"
        >
          <el-option
            v-for="(it) in formObj.selectData[item.key]"
            :key="it[item.custValue]?it[item.custValue]:it.value"
            :label="it[item.custText]?it[item.custText]:it.text"
            :value="it[item.custValue]?it[item.custValue]:it.value"></el-option>
        </el-select>
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
import selectList from '@/components/public/new/selectList'
import bigSelectList from '@/components/public/new/bigSelectList'
import bigDataSelect from '@/components/public/new/bigDataSelect'
import selectTree from '@/components/public/selectTree'

//过滤器
import {setTextLengthFilter} from '@/filters/index.js'
export default {
  filters: {
    formatLength (str,num) {
      return setTextLengthFilter(str,num)
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
  components:{
    selectinput,
    selecttable,
    DatePickers,
    beforeSelect,
    bigInput,
    selectList,
    bigSelectList,
    bigDataSelect,
    selectTree
  },
  // watch:{
  //   formItem:{
  //     handler(newVal,oldVal){
  //       console.log(newVal);
  //     },
  //     deep:true
  //   }
  // },
  updated() {
  },
  data(){
    return{
      fileList: [
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
      ],
      checkGroup:[],
      advanced:false, //查询展开收起
      labelWidth:100, //labelWidth的宽度
      inputvalue:'',
      drapSelect:'',
      selectTableColumn:[
        { field: 'orgName', title: '网点名称'},
        { field: 'orgCode', title: '网点编码' }
      ],
    }
  },
  mounted() {
  },
  methods: {
    selectDrap(command){
      // console.log(11111);
    },
    // showBigDataSelectComp(item){
    //   this.$refs[item.key].showPanel()
    // },
    //点击
    formClick(event,item){
      this.$emit('formClick',event,item)
    },
    //表单修改
    formChange(event,item,allData){
      // if(item.type=="bigDataSelectComp"){
      //   this.$set(this.formItem,item.key,event.value);
      //   this.$refs[item.key].hidePanel();
      // }
      this.$emit('formChange',event,item,item.key,allData)
    },
    formKeyupEnter(event,item) {
      this.$emit('formKeyupEnter',event,item,item.key)
    },
    //form的formVisibleChange事件
    formVisibleChange(event,item){
      this.$emit('formVisibleChange',event,item)
    },
    //form的blur事件
    formBlur(event,item,expandName,expandCode){
      if(item.type=="selectComp"){
        //下拉列表
        if(event.target.value!==''){
          let re = this.formObj.selectData[item.key].findIndex((it,index)=>{
            //如果有自定义的text
            if(item.custText){
              return it[item.custText]==event.target.value;
            }else{
              return it.text==event.target.value;
            }

          })

          if(re!==-1){
            if(item.custValue){
              this.$set(this.formItem,item.key,this.formObj.selectData[item.key][re][item.custValue]);
            }else{
              this.$set(this.formItem,item.key,this.formObj.selectData[item.key][re].value);
            }
          }else{
            //如果开启了强匹配模式
            if(item.strongMatch){
              return;
            }else{
              // 判断是否保存手动输入的值
              if(item.isHand) {
                this.$set(this.formItem,item.key,event.target.value);
              }
            }
          }
        }else{
          //是否开启了匹配
          if(item.enableMatch){
            this.$set(this.formItem,item.key,'');
          }
        }
      }else if(item.type=="bigDataSelectComp"){
        //巨量下拉列表
        if(event.target.value!==''){
          let re = this.formObj.selectData[item.key].findIndex((it,index)=>{
            //如果有自定义的text
            if(item.custText){
              return it[item.custText]==event.target.value;
            }else{
              return it.text==event.target.value;
            }

          })

          if(re!==-1){
            if(item.custValue){
              this.$set(this.formItem,item.key,this.formObj.selectData[item.key][re][item.custValue]);
            }else{
              this.$set(this.formItem,item.key,this.formObj.selectData[item.key][re].value);
            }
          }else{
            //如果开启了强匹配模式
            if(item.strongMatch){
              return;
            }else{
              // 判断是否保存手动输入的值
              if(item.isHand) {
                this.$set(this.formItem,item.key,event.target.value);
              }
            }
          }
        }else{
          //是否开启了匹配
          if(item.enableMatch){
            this.$set(this.formItem,item.key,'');
          }
        }
      }else if(item.type=="selectShowIdComp"){
        //自定义id的下拉列表
        if(event.target.value!==''){
          let re = this.formObj.selectData[item.key].findIndex((it,index)=>{
            if(item.custText){
              if(event.target.text&&typeof event.target.text !== 'undefined'){
                return it[item.custText]==event.target.text
              }else if(event.target.value&&typeof event.target.value !== 'undefined'){
                return it[item.custText]==event.target.value
              }
            }else{
              if(event.target.text&&typeof event.target.text !== 'undefined'){
                return it[item.text]==event.target.text
              }else if(event.target.value&&typeof event.target.value !== 'undefined'){
                return it[item.text]==event.target.value
              }
            }
          })

          if(re!==-1){
            if(item.custValue){
              this.$set(this.formItem,item.key,this.formObj.selectData[item.key][re][item.custValue]);
            }else{
              this.$set(this.formItem,item.key,this.formObj.selectData[item.key][re].value);
            }
          }else{
            this.$set(this.formItem,item.key,'');
            //如果开启了强匹配模式
            if(item.strongMatch){
              this.$emit('formBlur',event,item,item.key)
              return;
            }else{
              // 判断是否保存手动输入的值
              if(item.isHand) {
                this.$set(this.formItem,item.key,event.target.value);
              } else {
                this.$emit('formBlur',event,item,item.key)
              }
            }
          }
        }else{
          //是否开启了匹配
          if(item.enableMatch){
            this.$set(this.formItem,item.key,'');
          }
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
          //是否开启了匹配
          if(item.enableMatch){
            this.$set(this.formItem,item.key,'');
          }
        }
      }
      this.$emit('formBlur',event,item,item.key)
    },
    //form的焦点事件
    formFocus(event,item){
      if(item&&item.type=="selectComp"&&item.isHand){
        let e = event.target;
        let mvalue = '';

        if(e.value!==''){
          mvalue = e.value;
        }

        //监听输入事件
        e.oninput = (v)=>{
          mvalue = v.target.value;
          setTimeout(() => {
            e.placeholder = mvalue;
            v.target.value = mvalue;
            this.$set(this.formItem,item.key,mvalue);
          }, 100);
        }

        setTimeout(() => {
          e.value = mvalue;
        }, 50);
      }
    },
    formClear(item){
      this.$emit('formClear',item);
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
    inputCheckChange(event,item){
      this.$emit('inputCheckChange',event,item)
    },
    //input  enter事件
    inputEnter(event,item){
      this.$refs.checkInput[0].select()
      this.$emit("inputEnter",event,item)
    },
    //底部带自定义tbale的下拉列表的回调
    getBigSelectListTableData(tableData,item){
      this.$emit('getBigSelectListTableData',tableData,item)
    },
    //上传组件方法
    //上传的文件change
    handleChange(file,fileList,item){
      let badList = [];
      let nfileList = fileList;

      //拿到有问题的下标
      nfileList.forEach((fileItem,index)=>{
        //如果有限制文件类型
        if(item.acceptFile){
          //判断文件是否有.
          if(fileItem.name.indexOf('.')==-1){
            this.$message.error(`文件格式错误`);
            badList.push(index)
          }

          let typeArr = item.acceptFile.split(',');
          let fId = typeArr.findIndex((it)=>{
            return '.'+fileItem.name.split(".")[1] === it;
          })

          if(fId==-1){
            this.$message.error(`上传文件只能是 ${item.acceptFile} 格式!`);
            badList.push(index)
          }
        }
        //如果有限制文件大小
        if(item.acceptSize){
          const checkSize = fileItem.size / 1024 / 1024 < item.acceptSize;
          if (!checkSize) {
            this.$message.error(`上传的文件大小不能超过 ${item.acceptSize}MB!`);
            badList.push(index)
          }
        }
      })

      //错误的文件数组去重
      badList = Array.from(new Set(badList));

      //剔除掉错误的下标
      badList.forEach((it)=>{
        if(typeof it !== 'undefined'){
          nfileList.splice(it,1)
        }
      })

      if(item.uploadType=="autoUpload"){
        //自动上传服务器
        this.$emit('formChange',nfileList,item)
      }else if(item.uploadType=="handUpload"){
        //手动上传服务器
        this.$emit('formChange',nfileList,item)
      }

    },
    getNodeData(data,item,tree) {
      this.$emit("getNodeData", data, item,tree);
    },
    loadNode(node, resolve,item) {
      this.$emit("loadNode", node, resolve, item);
    },
    handleRemove(file, fileList,item) {
      this.$emit('formRemoveFiles',fileList,item)
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleCommand (command) {
      this.$emit('selectDrap', command.text)
    },
    submitUpload(){
      //上传到服务器
      this.$emit('submitFormUpload')
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    formImportFn(){
      // console.log("开始上传")
    },
    //重置查询
    Reset(ths,isEmit=true){
      for(let item of this.formObj.formArr){
        if(item.checkKey){
          //如果是带checkbox的下拉列表
          this.$set(this.$refs['form_'+this.formObj.id].model,item.checkKey,null);
        }else if(item.type=="selectInputComp"){
          //前面有下拉列表的输入框
        }else if(item.type=="slectTabel"){
          //下拉组件带table
          this.$refs[item.key+'_slectTabel'][0].setClear();
          // this.$set(this.$refs['form_'+this.formObj.id].model,item.key,null);
        }else if(item.type=="selectDateComp"){
          //带select的日期下拉组件
          this.$refs.datapick[0].clearTime();
        }
      }
      this.$refs['form_'+this.formObj.id].resetFields();

      if(isEmit){
        this.$emit('resetForm');
      }
    },
    defaultTrue(flag) {
      return flag || flag === undefined ? true : false
    },
    bigDataSetData(value){
      this.$refs.bigDataSelectComp.bigDataSetData(value)
    }
  },
}
</script>

<style lang="scss">
.formItemContainer{
  .nullComp{
    height: 29px;
  }
  //文字在顶部时候使用
  .nullTopComp{
    height: 58px;
  }
  //dateTime类型的
  .dateTimeClass{
    height:29px;
  }
  .checkgroupClass{
    height:29px;
  }
  .timeRangeClass{
    height:29px;
  }
  .el-select{
    .el-input{
      height: 29px;
    }
  }
  .checkboxClass{
    height: 29px;
  }
  //普通输入框的样式
  .inputComponent{
    height: 29px;
    .el-select{
      margin:0;
    }
    .el-input__inner{
      height: 29px;
    }
    .el-select {
      height: 26px;
    }
  }
  //可以支持大数据查询的下拉列表
  .bigDataSelectComp{
    .el-select{
      width: 100%;
    }
    .el-input__inner{
      height: 29px;
    }
  }
  .el-input-group__append, .el-input-group__prepend {
    cursor: pointer;
    height: 26px;
    padding: 0;
    .slotButton {
      padding: 5px 10px;
    }
  }
  .vxeSelectComp{
    height: 29px;
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
  /*上面都是输入框的高度 */


  //时间范围中间得‘至’字
  .el-date-editor .el-range-separator{
    width:20px;
  }
  .upload-demo{
    .el-upload {
      width:100%;
    }
  }
  //自动上传文件模块
  .upload-demo-auto{
    .el-upload{
      width: 100%;
    }
    // 上传列表
    .el-upload-list{
      border:1px solid #DCDFE6;
      height: 110px;
      overflow-y: auto;
    }
  }
  //手动上传文件模块
  .upload-demo-hand{
    // 上传列表
    .el-upload-list{
      border:1px solid #DCDFE6;
      height: 168px;
      overflow-y: auto;
    }
    .el-upload {
      float: left;
    }
    .beginUploadBtn{
      float: left!important;
    }
    .el-upload--text{
      float: left;
    }
    .el-upload__tip{
      width: 100%;
      float: left;
      margin-top: 2px;
    }
  }
  .el-upload-dragger{
    width: 100%;
    height: 90px;
  }
  .el-upload__tip{
    margin-top: -10px;
  }
  .el-upload-dragger .el-icon-upload{
    margin:0;
  }
  textarea{
    resize:none;
  }
  //带ID的下拉列表
  .selectShowIdCompClass{
    .el-scrollbar{
      position: relative;
    }
  }
  //前置下拉
  .dropDowmComponents{
    .el-input__inner{
      border: none;
      background: transparent;
    }
  }
  //多选的样式
  .selectMultiple{
    height: 100%!important;
    .el-input{
      height: 100%;
    }
  }
}
</style>
