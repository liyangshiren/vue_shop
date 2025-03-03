import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Container, Header, Aside, Main,
  Menu, Submenu, MenuItem,
  Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip,
  Pagination, Dialog, MessageBox, Tag, Tree, Select, Option, Cascader,Alert, TabPane, Tabs, Steps, Step,
  Checkbox,CheckboxGroup,Upload,Timeline,TimelineItem
} from 'element-ui'
// 导入弹框提示组件
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
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(TimelineItem)
Vue.use(Timeline)

// 挂载到Vue组件上，这样每个vue都可以直接通过this.$message来访问
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
