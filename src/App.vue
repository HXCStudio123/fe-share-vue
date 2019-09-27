<template>
  <div id="app">
    App内
    <!-- store示例； -->
    <p>count:{{count}}</p>
    <button @click="setCount(count+1)">+1</button>
    <button @click="setCount(count-1)">-1</button>
    <button @click="coo = '修改后的coo'">修改测试</button>
    <button @click=" () => $refs.child1.doSomething() ">调用子组件方法</button>
    
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <div @click="alert('外部')">
       外部
        <div @click="alert('内部')">内部</div>
    </div>
    <!-- 多级数据传递 -->
    <child1
          ref="child1"
          msg="child1" 
          :foo="foo"
          :boo="boo"
          :doo="doo"
          :coo="coo"
          @listener.native='listenerNative'
          @listener='listener'
          @get='get'/>
  </div>
</template>

<script>
import child1 from './components/Child1.vue';
import  { store, mutations }  from './utils/miniStore';

export default {
  name: 'app',
  data(){
    return {
      foo: "hello",
      boo: "world",
      coo: "fight",
      doo: "hard",
    };
  },
  components: {
    child1
  },
  created() {
    this.$log('App 的props',this.$props);
  },
  computed: {
    // store示例
    count() {
      return store.count;
    },
  },
  methods: {
    // store示例
   setCount: mutations.setCount,
   listenerNative() {
     this.$log('主页接收');
   },
   listener() {
     this.$log('主页接收,没有native');
        },
   get(num) {
     this.$log('获取值'+num);
   },
   alert(str) {
     this.$alert(str);
   }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
