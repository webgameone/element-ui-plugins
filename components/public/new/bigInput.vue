<template>
  <div class="bigInputContainer" :style="{width:mwidth,float:'left'}">
    <el-input v-show="!inputing" v-model="input" placeholder="请输入内容" @focus="beginInputFn"></el-input>
    <el-input
      class="textareaItem"
      v-show="inputing"
      ref="textareaItem"
      v-model="input"
      placeholder="请输入内容"
      type="textarea"
      @change="endInputFn"
      @blur="endInputFn"
      :rows="5"></el-input>
  </div>
</template>

<script>
export default {
  props:{
    mwidth:{
      type:String,
      default:'100%'
    },
    data:{
      type:String,
      default:''
    }
  },
  watch:{
    data(newVal,oldVal){
      this.input = newVal;
    }
  },
  data(){
    return{
      inputing:false,
      input:''
    }
  },
  methods: {
    beginInputFn(){
      //显示文本输入框
      this.inputing = true;
      this.$nextTick(()=>{
        //焦点进入文本输入框
        this.$refs.textareaItem.$el.children[0].focus()
      })
    },
    endInputFn(){
      //隐藏文本输入框
      this.inputing = false;
      this.$emit('backContentFn',this.input)
    },
    clearInput(){
      this.input='';
    }
  },
}
</script>

<style lang="scss">
  .bigInputContainer{
    textarea{
      resize:none;
    }
    .textareaItem{
      position: absolute;
      z-index: 1000;
    }
  }
</style>
