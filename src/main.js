import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.prototype.$log = window.console.log;

Vue.prototype.$alert = (str)=>{
  window.alert(str)
};


// chorme devtool是否开启性能监测模式
const isDev = process.env.NODE_ENV !== "production";
Vue.config.performance = isDev;

new Vue({
  render: h => h(App),
}).$mount('#app')
