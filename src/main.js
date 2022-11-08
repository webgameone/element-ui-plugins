import "@/src/assets/z-tree/css/zTreeStyle/zTreeStyle.css"
//临时引入iconfont进行测试
import "@/src/assets/icon/iconfont.css"

import Vue from 'vue'
import App from './App.vue'
import ui from '@/components/index'
Vue.use(ui)

//z-tree下的所有引用
import jQuery from 'jQuery'
import "@/src/assets/z-tree/js/jquery.ztree.core.min.js"
import "@/src/assets/z-tree/js/jquery.ztree.excheck.min.js"
import "@/src/assets/z-tree/js/jquery.ztree.exedit.min.js"
import "@/src/assets/z-tree/js/jquery.ztree.exhide.min.js"

//jquery使用this.$$
Vue.prototype.$$ = jQuery;

new Vue({
  el: '#app',
  render: h => h(App)
})
