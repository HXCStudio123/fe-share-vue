<template>
  <div id="app">
    外部1111
    <!-- store示例； -->
    <p>count:{{count}}</p>
    <button @click="setCount(count+1)">+1</button>
    <button @click="setCount(count-1)">-1</button>
    <button @click="coo = '修改后的coo'">修改测试</button>

    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- 多级数据传递 -->
    <HelloWorld
          msg="child1" 
          :foo="foo"
          :boo="boo"
          :doo="doo"
          :coo="coo"
          @test-listen.native='testListenNative'
          @test-listen='testListen'
          @get='getNum'/>
  </div>
</template>

<script>
import HelloWorld from './components/Child1.vue';
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
    HelloWorld
  },
  created() {
    
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
   testListenNative() {
     window.console.log('主页接收');
   },
   testListen() {
     window.console.log('主页接收,没有native');
   },
   getNum(num) {
     window.console.log('获取值'+num);
   },
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
