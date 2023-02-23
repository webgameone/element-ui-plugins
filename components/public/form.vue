<template>
  <div :id="formObj.id">
    <div id="customForm" class="clearfix" :ref="formObj.id">
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
                :icon="item.icon||''"
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
              :icon="item.icon||''"
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
            class="demo-form-inline clearfix formFlex"
            :label-position="formObj.labelPosition?formObj.labelPosition:'right'"
            :rules="formObj.rules?formObj.rules:null"
            :label-width="formObj.fixedWidth?'auto':(formObj.labelTop?'100%':(formObj.labelWidth?formObj.labelWidth+'px':'100px'))"
            :inline="formObj.formArr.inline?formObj.formArr.inline:true"
            :model="formItem"
            :label-suffix="formObj.labelSuffix?formObj.labelSuffix:''"
            :style="{
              background:formObj.formBackground?formObj.formBackground:'#fff',
            }"
            :size="formObj.formArr.size?formObj.formArr.size:'mini'">

            <!-- form表单是需要分组折叠的 -->
            <el-collapse class="formCollapseContainer" v-if="formObj.formCollapse&&formObj.formCollapse==true&&formObj.layer===undefined" :value="formObj.activeNames" @change="handleChange">
              <el-collapse-item
                v-for="(items,index) in formObj.formArr"
                :title="items.title"
                :name="index+1"
                :key="items.key"
                style="position:relative"
                class="formFlex"
              >
                <div class="formFlex">
                  <span
                    class="collapseSecondTitle"
                    :style="{
                      color:items.secondTitleColor?items.secondTitleColor:'#000000',
                      paddingLeft:items.secondTitleLeft?items.secondTitleLeft:'0px',
                      fontSize:items.seconfFontSize?items.seconfFontSize:'12px',
                      fontWeight:items.secondFontWeight?items.secondFontWeight:'normal'
                    }"
                  >{{items.secondTitle}}</span>
                  <el-form-item
                  v-for="(item) in items.formItem"
                  :tag="item.type"
                  :hasslot="item.hasSlot"
                  :key="item.key"
                  :prop="item.key"
                  :class="item.className?item.className:''"
                  :label="item.title&&item.title!=''?item.title:' '"
                  :style="{
                    width: formObj.fixedWidth?'auto':(formObj.col?(100/(item.col&&item.col!==1?(formObj.col/item.col):formObj.col)+'%'):'25%'),
                    display:item.display?item.display:(formObj.needAdvanced==null||item.outAdvanced||advanced)?'inline-block':'none',
                    opacity:(item.type=='nullComp'||item.type=='nullTopComp')?'0':'1',
                    color:item.titleColor?item.titleColor:'#606266',
                    background:formObj.formItemBgColor?formObj.formItemBgColor:'#fff',
                    fontWeight:item.fontWeight?item.fontWeight:'default',
                    marginLeft:formObj.fixedWidth?'15px':0
                    }"
                  >
                    <!-- 自定义的label -->
                    <span v-if="item.labelSlot" slot="label" v-html="item.title" @click="formClick"></span>
                    <el-col :span="24">
                      <formItem
                        :formItem="formItem"
                        :formObj="formObj"
                        :item="item"
                        :style="{
                          width:item.width?item.width:'100%',
                          float:'left'
                        }"
                        @formClick="formClick"
                        @formChange="formChange"
                        @formKeyupEnter="formKeyupEnter"
                        @formUploadChange="formUploadChange"
                        @submitFormUpload="submitFormUpload"
                        @formBlur="formBlur"
                        @formClear="formClear"
                        @optionChange="optionChange"
                        @formBtnClick="formBtnClick"
                        @inputCheckChange="inputCheckChange"
                        @inputEnter="inputEnter"
                        @formRemoveFiles="formRemoveFiles"
                        @formVisibleChange="formVisibleChange"
                        @getNodeData="getNodeData"
                        @loadNode="loadNode"
                        @getBigSelectListTableData="getBigSelectListTableData"
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
                        @formClear="formClear"
                        @optionChange="optionChange"
                        @formBtnClick="formBtnClick"
                        @inputCheckChange="inputCheckChange"
                        @inputEnter="inputEnter"
                        @formRemoveFiles="formRemoveFiles"
                        @formVisibleChange="formVisibleChange"
                        @getNodeData="getNodeData"
                        @loadNode="loadNode"
                        @getBigSelectListTableData="getBigSelectListTableData"
                      />


                      <!-- 副标题 -->
                      <div
                        class="secondTitle"
                        v-if="item.hasSlot&&item.hasSlot==true&&item.needLable==true"
                        :style="{
                          float:formObj.labelTop?'left':'right',
                          width:item.secondTitleWidth?item.secondTitleWidth:'auto',
                          'margin-top':formObj.labelTop?'-56px':'0',
                          'margin-left':formObj.labelTop?filterPre(item.slotData.width):'0'
                        }">
                        <span>{{item.slotData.title}}</span>
                      </div>
                    </el-col>
                  </el-form-item>

                  <!-- 预留插槽 -->
                  <slot v-if="items.formCollapseSlotShow" name="formCollapseSlot" :slotkey="items.key" :slotIndex="index"></slot>
                </div>


              </el-collapse-item>
            </el-collapse>

            <!-- form表单是需要分组折叠的 但是这个formItem里面包含更多的数组，方便增加删除组模块使用 -->
            <el-collapse class="formCollapseContainer" v-if="formObj.formCollapse&&formObj.formCollapse==true&&formObj.layer&&formObj.layer==true" :value="formObj.activeNames" @change="handleChange">
              <el-collapse-item
                v-for="(items,index) in formObj.formArr"
                :title="items.title"
                :name="index+1"
                :key="items.key"
                :style="{'position':'relative','display':items.display?items.display:'block'}"
                class="formFlex"
              >
                <div class="formFlex">
                  <div style="width:100%;" v-for="(mitem,index) in items.formItem" :key="index">
                    <!--数组模块的 增加按钮 -->
                    <el-button
                      @click="formBtnOperationFn('add',items.key,index)"
                      v-show="items.formBtnShow&&index==0&&!items.disabled"
                      size="mini"
                      :style="{'position':'absolute','right':items.formItem.length>1?'80px':'40px','z-index':'1'}"
                      circle type="success"
                      icon="el-icon-plus"
                    ></el-button>

                    <!--数组模块的 删除按钮 -->
                    <el-popconfirm
                      placement="top"
                      title="确定删除该节点吗？"
                      @confirm="formBtnOperationFn('delete',items.key,index)"
                    >
                      <el-button v-show="items.formBtnShow&&items.formItem.length!=1&&!items.disabled" slot="reference" size="mini" style="position:absolute;right:40px;z-index:1;" circle type="danger" icon="el-icon-delete"></el-button>
                    </el-popconfirm>

                    <el-form-item
                    v-for="(item) in mitem"
                    :tag="item.type"
                    :hasslot="item.hasSlot"
                    :key="item.key"
                    :prop="item.key"
                    :class="item.className?item.className:''"
                    :label="item.title&&item.title!=''?item.title:' '"
                    :style="{
                      width: formObj.fixedWidth?'auto':(formObj.col?(100/(item.col&&item.col!==1?(formObj.col/item.col):formObj.col)+'%'):'25%'),
                      display:item.display?item.display:(formObj.needAdvanced==null||item.outAdvanced||advanced)?'inline-block':'none',
                      opacity:(item.type=='nullComp'||item.type=='nullTopComp')?'0':'1',
                      color:item.titleColor?item.titleColor:'#606266',
                      background:formObj.formItemBgColor?formObj.formItemBgColor:'#fff',
                      fontWeight:item.fontWeight?item.fontWeight:'default',
                      marginLeft:formObj.fixedWidth?'15px':0
                      }"
                    >
                      <!-- 自定义的label -->
                      <span v-if="item.labelSlot" slot="label" v-html="item.title" @click="formClick"></span>
                      <el-col :span="24">
                        <formItem
                          :formItem="formItem"
                          :formObj="formObj"
                          :item="item"
                          :style="{
                            width:item.width?item.width:'100%',
                            float:'left'
                          }"
                          @formClick="formClick"
                          @formChange="formChange"
                          @formKeyupEnter="formKeyupEnter"
                          @formUploadChange="formUploadChange"
                          @submitFormUpload="submitFormUpload"
                          @formBlur="formBlur"
                          @formClear="formClear"
                          @optionChange="optionChange"
                          @formBtnClick="formBtnClick"
                          @inputCheckChange="inputCheckChange"
                          @inputEnter="inputEnter"
                          @formRemoveFiles="formRemoveFiles"
                          @formVisibleChange="formVisibleChange"
                          @getNodeData="getNodeData"
                          @loadNode="loadNode"
                          @getBigSelectListTableData="getBigSelectListTableData"
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
                          @formClear="formClear"
                          @optionChange="optionChange"
                          @formBtnClick="formBtnClick"
                          @inputCheckChange="inputCheckChange"
                          @inputEnter="inputEnter"
                          @formRemoveFiles="formRemoveFiles"
                          @formVisibleChange="formVisibleChange"
                          @getNodeData="getNodeData"
                          @loadNode="loadNode"
                          @getBigSelectListTableData="getBigSelectListTableData"
                        />


                        <!-- 副标题 -->
                        <div
                          class="secondTitle"
                          v-if="item.hasSlot&&item.hasSlot==true&&item.needLable==true"
                          :style="{
                            float:formObj.labelTop?'left':'right',
                            width:item.secondTitleWidth?item.secondTitleWidth:'auto',
                            'margin-top':formObj.labelTop?'-56px':'0',
                            'margin-left':formObj.labelTop?filterPre(item.slotData.width):'0'
                          }">
                          <span>{{item.slotData.title}}</span>
                        </div>

                      </el-col>
                    </el-form-item>

                    <!-- 预留插槽 -->
                    <slot v-if="items.formCollapseSlotShow" name="formCollapseSlot" :slotkey="items.key" :slotIndex="index"></slot>
                  </div>

                </div>

              </el-collapse-item>
            </el-collapse>

            <!-- form表单是不需要分组折叠的 -->
            <template v-if="formObj.formCollapse===undefined&&formObj.layer===undefined">
               <el-form-item
                :ref="'formItem_'+formObj.id"
                v-for="(item) in formObj.formArr"
                :tag="item.type"
                :hasslot="item.hasSlot"
                :key="item.key"
                :prop="item.key"
                :class="item.className?item.className:''"
                :label="item.title&&item.title!=''?item.title:' '"
                :style="{
                  width: formObj.fixedWidth?'auto':(formObj.col?(100/(item.col&&item.col!==1?(formObj.col/item.col):formObj.col)+'%'):'25%'),
                  display:item.display?item.display:(formObj.needAdvanced==null||item.outAdvanced||advanced)?'inline-block':'none',
                  float:(item.title==' '||item.title=='')&&(item.type!=='vxeSelect'&&item.type!=='checkboxComp'&&item.type!=='radioComp')?none:'left',
                  opacity:(item.type=='nullComp'||item.type=='nullTopComp')?'0':'1',
                  color:item.titleColor?item.titleColor:'#606266',
                  background:formObj.formItemBgColor?formObj.formItemBgColor:'#fff',
                  fontWeight:item.fontWeight?item.fontWeight:'default',
                  marginLeft:formObj.fixedWidth?'15px':0
                  }"
                >
                <!-- 自定义的label -->
                <span v-if="item.labelSlot" slot="label" v-html="item.title" @click="formClick"></span>
                <el-col :span="24">
                  <!-- 这里的marginLeft只有在label出现在上方的时候才有效 -->
                  <formItem
                    ref="noFormCollapse"
                    :formItem="formItem"
                    :formObj="formObj"
                    :item="item"
                    :style="{
                      width:item.width?item.width:'100%',
                      float:'left'
                    }"
                    @formClick="formClick"
                    @formChange="formChange"
                    @formKeyupEnter="formKeyupEnter"
                    @formUploadChange="formUploadChange"
                    @submitFormUpload="submitFormUpload"
                    @formBlur="formBlur"
                    @formClear="formClear"
                    @optionChange="optionChange"
                    @formBtnClick="formBtnClick"
                    @inputCheckChange="inputCheckChange"
                    @inputEnter="inputEnter"
                    @formRemoveFiles="formRemoveFiles"
                    @formVisibleChange="formVisibleChange"
                    @getNodeData="getNodeData"
                    @loadNode="loadNode"
                    @getBigSelectListTableData="getBigSelectListTableData"
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
                    @formClear="formClear"
                    @optionChange="optionChange"
                    @formBtnClick="formBtnClick"
                    @inputCheckChange="inputCheckChange"
                    @inputEnter="inputEnter"
                    @formRemoveFiles="formRemoveFiles"
                    @formVisibleChange="formVisibleChange"
                    @getNodeData="getNodeData"
                    @loadNode="loadNode"
                    @getBigSelectListTableData="getBigSelectListTableData"
                  />
                  <!-- 副标题 -->
                  <div
                    class="secondTitle"
                    v-if="item.hasSlot&&item.hasSlot==true&&item.needLable==true"
                    :style="{
                      float:formObj.labelTop?'left':'right',
                      width:item.secondTitleWidth?item.secondTitleWidth:'auto',
                      'margin-top':formObj.labelTop?'-56px':'0',
                      'margin-left':formObj.labelTop?filterPre(item.slotData.width):'0'
                    }">
                    <span>{{item.slotData.title}}</span>
                  </div>
                </el-col>
              </el-form-item>
            </template>

            <!-- form内右侧的查询和重置 -->
            <div v-if="formObj.btnInline" style="float:left;margin-left:10px;margin-bottom:18px;">
              <a v-if="formObj.needAdvanced" @click="toggleAdvanced" style="float:left;margin-right:8px;margin-top:4px;font-size:12px;cursor:pointer;color:#409EFF">
                {{ advanced ? '收起' : '展开' }}
                <i :class="advanced ? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
              </a>
              <span v-if="!formObj.noButton" class="table-page-search-submitButtons" :style="advanced && {overflow: 'hidden' } || {} ">
                <el-button v-if="formObj.noButton?!formObj.noButton:'true'" :disabled="formObj.searchDisable?formObj.searchDisable:false" type="primary" size="mini" @click="searchlist">查询</el-button>
                <el-button v-if="formObj.noButton?!formObj.noButton:'true'" style="margin-left: 8px" size="mini" @click="Reset()">重置</el-button>
              </span>
              <!-- 自定义按钮组 -->
              <template v-if="formObj.custQueryBtn&&formObj.custQueryBtn.length>0">
                <el-button
                v-for="(it) in formObj.custQueryBtn"
                :key="it.key"
                :disabled="it.disabled||false"
                :type="it.type||'primary'"
                size="mini"
                :icon="it.icon?it.icon:''"
                :circle="it.circle?it.circle:false"
                style="float:right;margin-left:10px;"
                @click="formClick($event,it.key)"><span v-if="!it.circle">{{it.title}}</span></el-button>
              </template>
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

            <!-- 展开收起和右下角的按钮组 在form表单底部 新-->
            <el-row v-if="!formObj.btnInline" class="btnwrap"
                :style="{
                  display:!formObj.noButton||(formObj.bottomBtnArr&&formObj.bottomBtnArr.length>0)?'inline-block':'none',
                  width:'100%'}">
                <el-col :span="!formObj.noButton?12:0" v-if="!formObj.noButton">
                  <span class="table-page-search-submitButtons" :style="advanced && {overflow: 'hidden' } || {} ">
                    <el-button v-if="formObj.noButton?!formObj.noButton:'true'" type="primary" size="mini" @click="searchlist">查询</el-button>
                    <el-button v-if="formObj.noButton?!formObj.noButton:'true'" style="margin-left: 8px" size="mini" @click="Reset()">重置</el-button>
                  </span>
                </el-col>
                <el-col :span="!formObj.noButton?12:(formObj.bottomBtnArr&&formObj.bottomBtnArr.length>0?24:0)">
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

                        <el-dropdown class="dropdownBtn" v-if="item.btnType=='dropdown'" :key="item.key" @command="formBtnCommand($event,item)">
                          <el-button type="primary" size="mini">
                            {{item.title}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              v-for="(oper) in formObj.selectData[item.key]"
                              :key="oper"
                              :command="oper"
                            >{{oper}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>

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
                            style="border-radius:0;border:0;height:29px"
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

                      <!-- popover 类型按钮 带触摸弹窗的-->
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

                      <!-- 下拉菜单 -->
                      <el-dropdown class="dropdownBtn" v-else-if="item.btnType=='dropdown'" :key="item.key" @command="formBtnCommand($event,item)">
                        <el-button type="primary" size="mini">
                          {{item.title}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-for="(oper) in formObj.selectData[item.key]"
                            :key="oper"
                            :command="oper"
                          >{{oper}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>

                      <!-- 普通按钮 -->
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

      //如果有form表单的背景颜色设置
      if(this.formObj.formBackground){
        this.$$('.el-collapse-item__wrap').css('background',this.formObj.formBackground);
      }
      //
      if(this.formObj.collapseBottomBorder){
        this.$$('.el-collapse-item__wrap').css('border-bottom',this.formObj.collapseBottomBorder);
      }

      //collapse收纳盒header背景颜色
      if(this.formObj.collapseHeaderBGColor){
        this.$$('.el-collapse-item__header').css('background',this.formObj.collapseHeaderBGColor);
      }
      //collapse收纳盒header文字颜色
      if(this.formObj.collapseHeaderTextColor){
        this.$$('.el-collapse-item__header').css('color',this.formObj.collapseHeaderTextColor);
      }
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

      //获取所有el-form-item元素
      let mainFormObj = document.getElementById(this.formObj.id);
      let elformItem = mainFormObj.getElementsByClassName('el-form-item');

      //初始化formItem的值
      if(this.formObj.formCollapse){
        //如果是折叠的form
        let allItem = [];
        //初始化formItem,并且修改最左侧的组件的样式
        this.formObj.formArr.forEach((item,index)=>{
          for(let its in item){
            if(its=='formItem'){
              allItem = allItem.concat(item[its]);
            }
          }
        })

        for(let item of allItem){
          if(item.key && item.key!==''){
            //model默认值赋值操作
            if(this.formObj.model){
              if(item.type=="inputComp"&&item.select){
                //前面有下拉列表的复合输入框
                this.$set(this.$refs['form_'+this.formObj.id].model,item.select.key,this.formObj.model[item.select.key])
              }

              if(this.formObj.model[item.key]){
                setTimeout(() => {
                  this.$set(this.$refs['form_'+this.formObj.id].model,item.key,this.formObj.model[item.key])
                }, 50);
                //checkgroupComp类型需要立即执行
                this.$set(this.$refs['form_'+this.formObj.id].model,item.key,this.formObj.model[item.key])
              }
            }
          }
          //如果有组合组件
          if(item.slotData&&item.slotData.key&&item.slotData.key!==''){
            // console.log(item.slotData.key);
            //model默认值赋值操作 组合组件
            if(this.formObj.model){
              if(this.formObj.model[item.key]){
                setTimeout(() => {
                  this.$set(this.$refs['form_'+this.formObj.id].model,item.slotData.key,this.formObj.model[item.slotData.key])
                }, 50);
              }
            }
          }
        }
      }else{
        //非折叠的form
        for(let item of this.formObj.formArr){
          if(item.key && item.key!==''){
            //model默认值赋值操作
            if(this.formObj.model){
              if(item.type=="inputComp"&&item.select){
                //前面有下拉列表的复合输入框
                this.$set(this.$refs['form_'+this.formObj.id].model,item.select.key,this.formObj.model[item.select.key])
              }

              if(this.formObj.model[item.key]){
                setTimeout(() => {
                  this.$set(this.$refs['form_'+this.formObj.id].model,item.key,this.formObj.model[item.key])
                }, 50);
                //checkgroupComp类型需要立即执行
                this.$set(this.$refs['form_'+this.formObj.id].model,item.key,this.formObj.model[item.key])
              }
            }
          }
          //如果有组合组件
          if(item.slotData&&item.slotData.key&&item.slotData.key!==''){
            // console.log(item.slotData.key);
            //model默认值赋值操作 组合组件
            if(this.formObj.model){
              if(this.formObj.model[item.key]){
                setTimeout(() => {
                  this.$set(this.$refs['form_'+this.formObj.id].model,item.slotData.key,this.formObj.model[item.slotData.key])
                }, 50);
              }
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
      let formItemContainer = custForm.getElementsByClassName('formItemContainer');
      let len = formContent.length;

      for(let i=0;i<len;i++){
        if(this.formObj.fixedWidth){
          formItemContainer[i].style.width = this.formObj.formArr[i].width?this.formObj.formArr[i].width+'px':'auto';
        }else{
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
          //tableInput
          if(formContent[i].parentNode.getAttribute('tag') == 'tableInput' && formContent[i].parentNode.children[0].innerHTML==' '){
            // formContent[i].style.width = `100%`;
            formContent[i].style.width = `calc(100% - ${this.labelWidth}px)`;
          }
          if(this.formObj.labelTop==true){
            formContent[i].style.marginLeft = `${this.labelWidth/2}px`;
          }
          //两个输入项的 通过hasslot判断
          if(formContent[i].parentNode.getAttribute('hasslot') == 'true' && this.formObj.labelTop){
            formContent[i].style.width = `calc(100% - ${this.labelWidth}px)`;
          }
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
    getNodeData(data,item,tree) {
      this.$emit("getNodeData", data, item,tree);
    },
    loadNode(node, resolve,item) {
      this.$emit("loadNode", node, resolve, item);
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
      if(item.type=="selectComp"||item.type=="bigDataSelectComp"||item.type=="bigSelectListComp"){
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
      }
      this.$emit('formBlur',event,item,item.key)
    },
    formClear(item){
      this.$emit('formClear',item);
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
    //按钮下拉菜单
    formBtnCommand(event,item){
      this.$emit('formBtnCommand',event,item)
    },
    formBtnClick(event,item){
      this.$emit('formBtnClick',event,item)
    },
    //折叠组-数组模块右侧的按钮事件
    formBtnOperationFn(typeName,key,index){
      this.$emit('formBtnOperationFn',typeName,key,index)
    },
    //修改组件属性 keyName:key的名字   attrName:要修改的属性名称  value:属性要修改的值
    setFormAttribute(keyName,attrName,value){
      // console.log(this.formObj.formArr)
      if(this.formObj.formCollapse&&!this.formObj.layer){
        //折叠但不分组
        //key名字
        let outKey = -1;
        //折叠的form结构
        for(let i=0;i<this.formObj.formArr.length;i++){
          let j = this.formObj.formArr[i].formItem.findIndex((e,index)=>{
            if(e.hasSlot&&e.slotData){
              if(e.slotData.key == keyName){
                return e.slotData.key == keyName;
              }
            }

            return e.key == keyName;
          })

          //需要修改的是折叠key的值
          if(this.formObj.formArr[i].key==keyName){
            outKey  = i;
          }else{
            outKey  = -1;
          }

          // console.log(j)
          //修改的是formItem里面组件的属性
          if(j!==-1){
            if(this.formObj.formArr[i].formItem[j]['key']==keyName){
              this.formObj.formArr[i].formItem[j][attrName] = value;
            }
            //1.有hasSlot,2.slotData里面的key值一样,3.eachAttribute分开属性设置
            if(this.formObj.formArr[i].formItem[j].hasSlot && this.formObj.formArr[i].formItem[j].slotData.key==keyName&&this.formObj.formArr[i].formItem[j].eachAttribute){
              this.formObj.formArr[i].formItem[j].slotData[attrName] = value
            }

            // 第二个状态跟第一个保持一致
            if(this.formObj.formArr[i].formItem[j].hasSlot&&!this.formObj.formArr[i].formItem[j].eachAttribute){
              if(this.formObj.formArr[i].formItem[j].hasSlot) {
                this.formObj.formArr[i].formItem[j].slotData[attrName] = value
              }
              if(this.formObj.formArr[i].formItem[j].showSelect) {
                this.formObj.formArr[i].formItem[j].select[attrName] = value
              }
            }
          }

          //修改的是折叠key的属性
          if(outKey!=-1){
            if(this.formObj.formArr[outKey]['key']==keyName){
              this.formObj.formArr[outKey][attrName] = value;
            }
          }
        }
      }else if(this.formObj.formCollapse&&this.formObj.layer){
        //折叠并且分组
        //key名字
        let outKey = -1;
        //折叠的form结构
        for(let i=0;i<this.formObj.formArr.length;i++){
          //formItem的数组循环
          this.formObj.formArr[i].formItem.map((item,index)=>{
              //formItem内部数组的循环
              let j = item.findIndex((e,index)=>{
                if(e.hasSlot&&e.slotData){
                  if(e.slotData.key == keyName){
                    return e.slotData.key == keyName;
                  }
                }

                return e.key == keyName;
              })

              //修改的是formItem里面组件的属性
              if(j!==-1){
                if(item[j]['key']==keyName){
                  item[j][attrName] = value;
                }
                //1.有hasSlot,2.slotData里面的key值一样,3.eachAttribute分开属性设置
                if(item[j].hasSlot && item[j].slotData.key==keyName&&item[j].eachAttribute){
                  item[j].slotData[attrName] = value
                }

                // 第二个状态跟第一个保持一致
                if(item[j].hasSlot&&!item[j].eachAttribute){
                  if(item[j].hasSlot) {
                    item[j].slotData[attrName] = value
                  }
                  if(item[j].showSelect) {
                    item[j].select[attrName] = value
                  }
                }
              }
          })

          //需要修改的是折叠key的值
          if(this.formObj.formArr[i].key==keyName){
            outKey  = i;
          }else{
            outKey  = -1;
          }

          //修改的是折叠key的属性
          if(outKey!=-1){
            if(this.formObj.formArr[outKey]['key']==keyName){
              this.formObj.formArr[outKey][attrName] = value;
            }
          }
        }
      }else{
        //非折叠的form结构
        let i = this.formObj.formArr.findIndex((e,index)=>{
          if(e.hasSlot&&e.slotData){
            if(e.slotData.key == keyName){
              return e.slotData.key == keyName;
            }
          }
          return e.key == keyName;
        })


        if(i!==-1){
          if(this.formObj.formArr[i].key==keyName){
            this.formObj.formArr[i][attrName] = value
          }
          //1.有hasSlot,2.slotData里面的key值一样,3.eachAttribute分开属性设置
          if(this.formObj.formArr[i].hasSlot && this.formObj.formArr[i].slotData.key==keyName&&this.formObj.formArr[i].eachAttribute){
            this.formObj.formArr[i].slotData[attrName] = value;
          }

          // 第二个状态跟第一个保持一致
          if(this.formObj.formArr[i].hasSlot&&!this.formObj.formArr[i].eachAttribute){
            //两个状态不保持一致
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
      }
    },
    //获取指定的组件属性
    getFormAttribute(keyName){
      if(this.formObj.formCollapse&&!this.formObj.layer){
        //折叠不分组
        //key名字
        let outKey = -1;
        //折叠的form结构
        for(let i=0;i<this.formObj.formArr.length;i++){
          let j = this.formObj.formArr[i].formItem.findIndex((e,index)=>{
            if(e.hasSlot&&e.slotData){
              if(e.slotData.key == keyName){
                return e.slotData.key == keyName;
              }
            }
            return e.key == keyName;
          })

          //需要修改的是折叠key的值
          if(this.formObj.formArr[i].key==keyName){
            outKey  = i;
          }else{
            outKey  = -1;
          }

          if(j!==-1){
            if(this.formObj.formArr[i].formItem[j]['key']==keyName){
              return this.formObj.formArr[i].formItem[j];
            }
            //1.有hasSlot,2.slotData里面的key值一样,3.eachAttribute分开属性设置
            if(this.formObj.formArr[i].formItem[j].hasSlot && this.formObj.formArr[i].formItem[j].slotData.key==keyName&&this.formObj.formArr[i].formItem[j].eachAttribute){
              return this.formObj.formArr[i].formItem[j].slotData;
            }
          }

          //修改的是折叠key的属性
          if(outKey!=-1){
            if(this.formObj.formArr[outKey]['key']==keyName){
              return this.formObj.formArr[outKey]
            }
          }
        }
      }else if(this.formObj.formCollapse&&this.formObj.layer){
        //折叠并且分组
        //key名字
        let outKey = -1;
        //折叠的form结构
        for(let i=0;i<this.formObj.formArr.length;i++){
          let resultArr = null;
          //formItem的数组循环
          this.formObj.formArr[i].formItem.map((item,index)=>{
              //formItem内部数组的循环
              let j = item.findIndex((e,index)=>{
                if(e.hasSlot&&e.slotData){
                  if(e.slotData.key == keyName){
                    return e.slotData.key == keyName;
                  }
                }

                return e.key == keyName;
              })

              //修改的是formItem里面组件的属性
              if(j!==-1){
                if(item[j]['key']==keyName){
                  resultArr = item[j]
                }
                //1.有hasSlot,2.slotData里面的key值一样,3.eachAttribute分开属性设置
                if(item[j].hasSlot && item[j].slotData.key==keyName&&item[j].eachAttribute){
                  resultArr = item[j].slotData
                }
              }
          })

          if(resultArr){
            return resultArr
          }

          //需要修改的是折叠key的值
          if(this.formObj.formArr[i].key==keyName){
            outKey  = i;
          }else{
            outKey  = -1;
          }

          //修改的是折叠key的属性
          if(outKey!=-1){
            if(this.formObj.formArr[outKey]['key']==keyName){
              return this.formObj.formArr[outKey]
            }
          }
        }
      }else{
        //非折叠的form结构
        let i = this.formObj.formArr.findIndex((e,index)=>{
          if(e.hasSlot&&e.slotData){
            if(e.slotData.key == keyName){
              return e.slotData.key == keyName;
            }
          }
          return e.key == keyName;
        })


        if(i!==-1){
          if(this.formObj.formArr[i].key==keyName){
            return this.formObj.formArr[i];
          }
          //1.有hasSlot,2.slotData里面的key值一样,3.eachAttribute分开属性设置
          if(this.formObj.formArr[i].hasSlot && this.formObj.formArr[i].slotData.key==keyName&&this.formObj.formArr[i].eachAttribute){
            return this.formObj.formArr[i].slotData;
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
    },
    //重新计算百分比的title位置
    filterPre(pre){
      let num = Number(pre.replace('%',''));
      return 100-num+'%'
    },
    //底部带自定义tbale的下拉列表的回调
    getBigSelectListTableData(tableData,item){
      this.$emit('getBigSelectListTableData',tableData,item)
    }
    // bigDataSetData(value){
    //   console.log(this.$refs);
    //   // console.log('formItem_'+this.formObj.id);
    //   // console.log(this.$refs['formItem_'+this.formObj.id]);
    //   // this.$refs['formItem_'+this.formObj.id].bigDataSetData(value);
    // }
  },
}
</script>

<style lang="scss">
.formFlex{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.clearfix:after{
  content:'';
  display: table;
  clear: both;
}
.clearfix{
  *zoom:1;
}
#customForm{
  .el-collapse-item__wrap{
    width: 100%;
  }
  .el-radio{
    margin-right:10px!important;
  }
  .el-form-item{
    // min-height: 30px;//最小高度
    margin-right:0;
    float: left;
  }
  .el-form-item__content{
    line-height: 27px!important;
    min-height:29px;
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
    line-height: 29px;
  }
  .formCollapseContainer{
    .el-form-item__error{
      right: 0;
      left:inherit!important;
    }
  }
  .btnwrap{
    .dropdownBtn{
      // height: 28px;
      float: left;
      .el-button{
        // height: 28px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.collapseSecondTitle{
  width: 100%;
}
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
