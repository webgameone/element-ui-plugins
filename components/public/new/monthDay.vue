//只有月份和日期的日期选择器
<template>
  <div>
    <el-popover
      placement="bottom"
      width="280"
      v-model="visible">
      <div class="date-month-day">
        <div class="header">
          <div class="left-arrow" @click="dirClick('left')"><i class="el-icon-arrow-left" /></div>
          <div v-text="getMonthFormat" @click="monthTile" style="cursor: pointer"></div>
          <div class="right-arrow" @click="dirClick('right')">
            <i class="el-icon-arrow-right" />
          </div>
        </div>
        <div class="content" v-if="monthShow">
          <div class="month" v-for="(item) in getMonths" :key="item.key" @click="monthClick(item)">
            <span :class="activeMonth(item.key)">{{item.value}}</span></div>
        </div>
        <div class="content" v-else>
          <div class="day" v-for="(item) in getDays" :key="item" @click="dayClick(item)">
            <span :class="activeDay(item)">{{item}}</span></div>
        </div>
      </div>
      <el-input
        slot="reference"
        :placeholder="placeholder"
        prefix-icon=""
        :style="`cursor: pointer;width: ${width} !important;`"
        :clearable="true"
        :readonly="true"
        v-model="dateVal">
      </el-input>
    </el-popover>
  </div>

</template>

<script>
import moment from 'moment'; // 导入日期插件

export default {
  props: {
    // 默认值
    dateDefault: {
      type: String,
    },
    // 居中排列
    placeholder: {
      type: String,
      default: '选择日期',
    },
    // 默认年份
    year: {
      type: String,
      default: '2020',
    },
    // 宽度
    width: {
      type: String,
      default: '100%',
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
      visible: false,
      monthShow: false,
      monthFormat: {
        1: '一月',
        2: '二月',
        3: '三月',
        4: '四月',
        5: '五月',
        6: '六月',
        7: '七月',
        8: '八月',
        9: '九月',
        10: '十月',
        11: '十一月',
        12: '十二月',
      },
      selectDate:'',
      dateVal: '',
      monthVal: '',
      dayVal: '',
    };
  },
  computed: {
    getMonthFormat() {
      return this.monthVal ? this.monthFormat[Number(this.monthVal)] : '';
    },
    // 默认选中天
    activeDay() {
      // eslint-disable-next-line func-names
      return function (item) {
        return Number(this.dayVal) === item ? 'active' : '';
      };
    },
    // 默认选中月
    activeMonth() {
      // eslint-disable-next-line func-names
      return function (item) {
        return this.monthVal === item ? 'active' : '';
      };
    },
    // 获取当前月的天数
    getDays() {
      let days = 30;
      const bigMonth = [1, 3, 5, 7, 8, 10, 12];
      if (this.monthVal && bigMonth.includes(Number(this.monthVal))) {
        days = 31;
      } else if (this.monthVal && Number(this.monthVal) === 2) {
        days = 28;
        if (Number(this.year) % 4 === 0) {
          days = 29;
        }
      }
      return days;
    },
    // 获取月份
    getMonths() {
      const mon = [];
      // 注意
      Object.keys(this.monthFormat).forEach(m => {
        mon.push({
          key: `${m}`,
          value: this.monthFormat[m],
        });
      });
      // for (let m in this.monthFormat) {
      //   mon.push({
      //     key: `${m}`,
      //     value: this.monthFormat[m],
      //   });
      // }
      return mon;
    },
  },
  mounted() {
    // console.log(this.year)
  },
  watch: {
    dateDefault: {
      handler(newVal) {
        if (newVal) {
          const defaultDate = `${this.year}-${this.dateDefault}`;
          this.dateVal = moment(defaultDate).format('M月D日');
          this.monthVal = moment(defaultDate).format('M');
          this.dayVal = moment(defaultDate).format('D');
        } else {
          this.dateVal = moment().format('M月D日');
          this.monthVal = moment().format('M');
          this.dayVal = moment().format('D');
          this.$emit('update:date', this.dateVal);
        }
      },
      immediate: true, // immediate选项可以开启首次赋值监听
    },
    visible: {
      handler(newVal) {
        if (newVal) {
          if(this.selectDate!=''){
            const defaultDate = `${this.year}-${this.selectDate}`;
            this.dateVal = moment(defaultDate).format('M月D日');
            this.monthVal = moment(defaultDate).format('M');
            this.dayVal = moment(defaultDate).format('D');
          }else if (this.dateDefault) {
            // 按照闰年来算，防止出现29号，算到1号
            const defaultDate = `${this.year}-${this.dateDefault}`;
            this.dateVal = moment(defaultDate).format('M月D日');
            this.monthVal = moment(defaultDate).format('M');
            this.dayVal = moment(defaultDate).format('D');
          } else {
            this.dateVal = moment().format('M月D日');
            this.monthVal = moment().format('M');
            this.dayVal = moment().format('D');
            this.$emit('update:date', this.dateVal);
          }
        } else {
          this.monthShow = false;
        }
      },
      immediate: true, // immediate选项可以开启首次赋值监听
    },
  },
  methods: {
    dirClick(type) {
      if (type === 'left') {
        if (Number(this.monthVal) === 1) {
          this.monthVal = '12';
        } else {
          this.monthVal = moment(this.monthVal).subtract(1, 'M').format('M');
        }
      }
      if (type === 'right') {
        if (Number(this.monthVal) === 12) {
          this.monthVal = '1';
        } else {
          this.monthVal = moment(this.monthVal).add(1, 'M').format('M');
        }
      }

      // 默认选中
      let month = moment().format('M');
      let day = moment().format('D');
      if(this.selectDate!=''){
        month = moment(this.selectDate).format('M');
        day = moment(this.selectDate).format('D');
      }else{
        if (this.dateDefault) {
          month = moment(this.dateDefault).format('M');
          day = moment(this.dateDefault).format('D');
        }
      }

      if (month === this.monthVal) {
        this.dayVal = Number(day);
      } else {
        this.dayVal = '';
      }
    },
    monthTile() {
      this.monthShow = true;
    },
    monthClick(month) {
      this.monthVal = month.key;
      this.dirClick();
      this.monthShow = false;
    },
    dayClick(item) {
      this.dayVal = item;
      const day = `${this.dayVal}`;
      const val = {
        day,
        month: this.monthVal,
        date: `${this.monthVal}-${day}`,
      };
      //测试
      const defaultDate = `${this.year}-${val.date}`;
      this.dateVal = moment(defaultDate).format('M月D日');
      this.monthVal = moment(defaultDate).format('M');
      this.dayVal = moment(defaultDate).format('D');
      this.selectDate = val.date;

      //测试end
      // this.$emit('update:date', val.date);
      this.$emit('change', val, this.item);
      this.visible = false;
      // this.$emit('sureValid');
    },
    focus() {
      this.$emit('sureValid');
    },
  },
};
</script>

<style lang="scss" scoped>
  .date-month-day{
    .header{
      display: -webkit-flex; /* Safari */
      display: flex;
      text-align: center;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ebeef5;
      .left-arrow,.right-arrow{
        cursor: pointer;
        width: 30px;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #42424D;
        z-index: 9;
        background: #fff;
      }
    }
    .content{
      display: -webkit-flex; /* Safari */
      display: flex;
      text-align: center;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;
      .day{
        width: calc(100% / 7);
        height: 36px;
        padding: 4px 0;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
        position: relative;
        span{
          width: 24px;
          height: 24px;
          display: block;
          margin: 0 auto;
          line-height: 24px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
        }
        .active{
          color: #fff;
          background-color: #409eff;
        }
      }
      .month{
        width: calc(100% / 4);
        height: 48px;
        padding: 6px 0;
        box-sizing: border-box;
        cursor: pointer;
        span{
          width: 60px;
          height: 36px;
          display: block;
          line-height: 36px;
          color: #606266;
          margin: 0 auto;
          border-radius: 18px;
        }
        .active{
          color: #fff;
          background-color: #409eff;
        }
      }
    }
    ::v-deep{
      .el-input{
        width: 120px;
        z-index: 9;
      }
      .el-input__inner{
        cursor: pointer;
        border: none;
        text-align: center;
        padding: 0px;
        color: #42424D;
      }
    }
  }
</style>


