// miniStore.js
// 简易的状态管理（2.6新出的状态分享） 公用属性
import Vue from "vue";
 
export const store = Vue.observable({ count: 0,name:'houxinchao' });

export const mutations = {
  setCount(count) {
    store.count = count;
  },
  setName(name) {
    store.name = name;
  }
};

