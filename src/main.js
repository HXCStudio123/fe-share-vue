import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.prototype.$log = window.console.log;

const isDev = process.env.NODE_ENV !== "production";
Vue.config.performance = isDev;

new Vue({
  render: h => h(App),
}).$mount('#app')
