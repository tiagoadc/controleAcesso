import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VMask from 'v-mask'
import moment from 'moment'

import Vuelidate from 'vuelidate'
import './css/app.css'
import './css/w3.css'
import './css/robotodraft.css'



import 'bootstrap/dist/css/bootstrap.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuelidate)
//Vue.use(VMask);
Vue.use(VMask)
moment.locale('pt-br');


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
