//单个form折叠
<template>
  <div class="page-container">
    <div class="header clearfix">
      <!-- <p class="titleComp">当一个form里的组件特别多的时候，可以将这个form里的组件拆分到多个折叠层里，这样可以方便查看和操作</p> -->
      <ui-form
        ref="uiForm"
        :formObj="formData1"
      ></ui-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'formPage',
  data() {
    const that = this;
    return {
      // form组件库
      formData1: {
        id: 'testForm1',
        col: 3, // 自定义列数
        formCollapse:true,//开启可以折叠的form表单
        activeNames:[1,2],
        labelTop: true,
        labelPosition: 'left',
        searchTop:'0px',//去掉margin-top的默认值
        labelWidth: 50, // 自定义label的宽度
        noButton: true, //不需要查询
        // 下拉列表的options
        selectData: {
          //radio
          radioComp: [
            {
              title: '男人',
            },
            {
              title: '女人',
            },
            {
              title: '老人',
            },
          ],
        },
        // form表单组件
        formArr: [
          {
            key: "base",
            title: "第一个折叠栏(展开状态)",
            formItem: [
              // {
              //   type: 'bigInput',
              //   title: '复合输入框',
              //   key: 'inputB',
              //   outAdvanced: true,
              //   placeholder: '请输入',
              // },
              {
                type: 'selectComp',
                title: '普通下拉',
                key: 'selectA',
                placeholder: '不支持巨量数据，大量数据会卡',
              },
              {
                type: "inputComp",
                title: "文字输入",
                key: "sendCarFormId",
              },
              {
                type: 'numberInputComp', //数字输入框
                title: '数字输入框',
                key: 'brand',
                placeholder: '可以设置小数点或者整数输入，以及小数点精度',
                precision: 2, //数值精度 2-2个小数点，不设置该属性或者为0时只能输入整数
                controls: false, //是否显示右侧的数值调节按钮
                min: 0, //最小值，可以不设置
                max: 50, //最大值，可以不设置
              }
            ],
          },
          {
            key: "base2",
            title: "第二个折叠栏(展开状态)",
            formItem: [
              {
                type: "dateTime",
                timeType:"datetime",
                title: "异常时间",
                key: "exceptionTime",
                minWidth: 150,
                align: "center",
                format:"yyyy-MM-dd HH:mm:ss",
                valueFormat:"yyyy-MM-dd HH:mm:ss"
              },
              {
                type: 'timeHMSComp',
                key: 'hms',
                title: '时分秒', //标题
                editable: false, //是否允许输入编辑
              },
              {
                type: 'dateTime',
                title: '只选择月份',
                key: 'month',
                clearable: false,
                placeholder: '请选择月份',
                timeType: 'month', //该属性不设置默认年月日
                format: 'yyyy-MM', //该属性不设置默认年月日
                valueFormat: 'yyyy-MM', //该属性不设置默认年月日
              },
              {
                type: 'radioComp',
                title: 'radio组件',
                key: 'radioComp',
                outAdvanced: true,
                startIndex: 1, //下标从1开始，而不是从0开始
              },
              {
                type: 'timeRangeComp',
                title: '时间范围', //label名称
                key: 'queryTime', //key值，唯一值
                valueFormat: 'yyyy-MM-dd HH:mm:ss', //时间格式
                disabled: false, //是否允许禁用
                defaultTime: ['12:00:00', '23:59:59'], //默认时间，如果不设置默认['00:00:00', '23:59:59']
                outAdvanced: true,
                clearable: false,
                pickerOption: {},
              },
              {
                type:'numberInputComp', //数字输入框
                title:'数字输入框1',
                key:'brand',
                precision:2, //数值精度 2-2个小数点，不设置该属性或者为0时只能输入整数
                controls:false, //是否显示右侧的数值调节按钮
                min:0, //最小值，可以不设置
                max:50, //最大值，可以不设置
                width:'49%',

                hasSlot:true,//是否 可以在当前列中再加入一个输入项，但是两个输入项的宽度需要自定义，否则都为100%
                needLable:true,//是否显示副标题
                slotData:{
                  width:'49%',
                  type:'numberInputComp', //数字输入框
                  title:'数字输入框2',
                  key:'brand',
                  precision:2, //数值精度 2-2个小数点，不设置该属性或者为0时只能输入整数
                  controls:false, //是否显示右侧的数值调节按钮
                  min:0, //最小值，可以不设置
                  max:50, //最大值，可以不设置
                },
              }
            ],
          },
          {
            key: "base3",
            title: "第三个折叠栏(收起状态)",
            formItem: [
              {
                type: 'textComp',
                title: '文字组件',
                key: 'textContent', //key值，唯一值
                color: '#00ff00',
                showTitle: true, //如果有字数限制时，是否显示全部文字弹窗
              },
              {
                type: 'bigDataSelectComp',
                title: '巨量单选',
                key: 'selectA',
                isHand: true,
                placeholder: '支持巨量数据',
              },
              {
                type: 'bigDataSelectComp',
                title: '巨量多选',
                key: 'selectC',
                isHand: true,
                multiple: true,
                placeholder: '支持巨量数据',
              },
              {
                type: 'bigDataSelectComp',
                title: '巨量带标题',
                key: 'selectB',
                isHand: true,
                selectType: 'selectShowIdComp',
                placeholder: '支持巨量数据和自定义标题',
                custText: 'text',
                custValue: 'value',
                options: [
                  {
                    title: '标题1',
                    str: 'text',
                    mstyle: { width: '20%' },
                  },
                  {
                    title: '标题2',
                    str: 'value',
                    mstyle: { width: '40%', textAlign: 'center' },
                  },
                  {
                    title: '标题3',
                    str: 'value',
                    mstyle: { width: '40%', textAlign: 'center' },
                  },
                ],
              },
              {
                type: 'timeRangeComp',
                title: '时间范围', //label名称
                key: 'queryTime', //key值，唯一值
                valueFormat: 'yyyy-MM-dd HH:mm:ss', //时间格式
                disabled: false, //是否允许禁用
                defaultTime: ['12:00:00', '23:59:59'], //默认时间，如果不设置默认['00:00:00', '23:59:59']
                outAdvanced: true,
                clearable: false,
                pickerOption: {},
              },
              {
                type: 'dateRangeComp',
                title: '日期范围',
                key: 'queryTime',
                outAdvanced: true,
                clearable: false,
                pickerOptions: {},
              },
              {
                type: 'cascader',
                title: '级联选择',
                key: 'cascaderKey',
                clearable: true,
                collapseTags: true,
              }
            ],
          }
        ],
        model: {
          textContent: '这里是文字展示组件',
          checkGroup:[] //必须先赋值为空数组
        },
      },
    }
  },
  created() {
    //创建下拉列表大数据测试
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    //创建下拉列表大数据测试
    getList() {
      let tempArr = []
      for (let i = 0; i < 300; i++) {
        tempArr.push({
          text: 'menu' + i,
          value: 'menu' + i,
        })
        this.dataForm.selectData.selectA = tempArr
        this.dataForm.selectData.selectC = tempArr
        this.dataForm.selectData.selectB = tempArr
        this.dataForm.selectData.selectD = tempArr
        this.dataForm.selectData.selectE = tempArr
      }
    },
    slotLabel(name) {
      return `<span>${name}</span><span name="custLabel2" style="color:#ff00d4;cursor:pointer;">(点击)</span>`;
    }
  },
}
</script>

<style lang="scss">
label {
  font-weight: normal;
}
</style>
