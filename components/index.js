import uiTable from './public/table.vue'
import uiForm from './public/form.vue'
import uiPopup from './public/newPopup.vue'
import uiDragPopup from './public/dragPopup.vue'
import uiDrawerPopup from './public/drawerPopup.vue'
import uiCustomDrawer from './public/customDrawer.vue'
import uiTree from './public/tree'
import uiZtree from './public/new/ztree'


let ui = {}
ui.install = (Vue,options)=>{
  Vue.prototype.$info = 'form和table组件库'
  Vue.prototype.$myMethod = function (arr) {
    if (arr.length < 0) {
      return false
    } else {
      arr = arr.join('组件库已启用')
      return arr
    }
  }
  Vue.component(uiTable.name, uiTable) // 组件的name属性
  Vue.component(uiForm.name, uiForm) // 组件的name属性
  Vue.component(uiPopup.name, uiPopup) // 组件的name属性
  Vue.component(uiDragPopup.name, uiDragPopup) // 组件的name属性
  Vue.component(uiDrawerPopup.name, uiDrawerPopup)
  Vue.component(uiCustomDrawer.name, uiCustomDrawer)
  Vue.component(uiTree.name, uiTree)
  Vue.component(uiZtree.name, uiZtree)
}

export default ui
