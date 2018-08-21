import Vue from 'vue'
import App from './App.vue'
// import { Select,Option,Tabs,TabPane,Button,MessageBox,Message} from 'element-ui'
// import ElementUI from 'element-ui';
import router from './router'

import './assets/css/reset.css'
import './assets/css/animate.css'
import './assets/css/reset_element_ui.css'

// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Tabs)
// Vue.use(TabPane)
// Vue.use(Button)
// Vue.use(Message)
// Vue.use(MessageBox)

// Vue.use(ElementUI);

import echarts from 'echarts'

Vue.prototype.$echarts = echarts;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
