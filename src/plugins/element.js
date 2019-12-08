import Vue from 'vue'
import { Button, Form, FormItem, Input, Container, Header, Aside, Main,
Menu, Submenu, MenuItemGroup, MenuItem} from 'element-ui'
//导入弹框提示组件
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
//挂载到Vue组件上，这样每个vue都可以直接通过this.$message来访问
Vue.prototype.$message = Message
