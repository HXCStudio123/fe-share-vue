<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
        <button @click="changeProvide">修改 provide</button>
        <!-- store示例 -->
        <hr/>
        <h2>store示例: </h2>
        <p>count:{{count}}</p>
        <button @click="setCount(count+1)">+1</button>
        <button @click="setCount(count-1)">-1</button>
        <!-- 多级传参示例 -->
        <hr/>
        <h2>多级传参示例:</h2>
          <div class="hello">
            <div style="margin:10px;text-align:left">Child1内部</div>
            <div class="demo">     
                <div>父组件传递的 $attrs:{{$attrs}}</div>
                <div> 当前页面接收的 $props:{{$props}}</div>
                <div>foo:{{foo}}</div>
                <child2-vue v-bind="$attrs" v-on="$listeners" @other-get="otherGet" @hook:mounted="doSomething"></child2-vue>
            </div>
          </div>
        <!-- 函数式组件 -->
        <hr/>
        <h2>函数式组件:</h2>
          <div class="hello">
            <div style="margin:10px;text-align:left">Child1内部</div>
            <div class="demo">     
              <child-function-vue v-bind="$attrs" ></child-function-vue>
            </div>
          </div>
        <!--  长列表示例 -->
        <hr/>
        <h2>长列表示例</h2>
        <span v-for="(item, idx) in list" :key="idx">
                {{item.content}}
        </span>
  </div>
</template>

<script>
import  { store, mutations }  from '../utils/miniStore';
import Child2Vue from './Child2.vue';
import ChildFunctionVue from './ChildFunction.vue';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    foo: String // foo作为props属性绑定
  },
  components:{
    Child2Vue,ChildFunctionVue
  },
  provide: {
    name: 'provide传的值'
  },
  inheritAttrs: false, // 可以关闭自动挂载到组件根元素上的没有在props声明的属性
  data() {
    return {
      list:[
        {
          id:1,
          name:"占位符"
        }
      ]
    }
  },

   created() {
      let list = Array.from({ length: 100000 }, (item, index) => ({ content: index }))
      // 开启性能模式以后  可以看到有freeze后时间缩短近30%
      this.list = list;
      // this.list = Object.freeze(list);
      window.console.log("初始化");
      
      window.console.log('child1:',this.$attrs,this.$listeners); // { "boo": "Html", "coo": "CSS", "doo": "Vue", "title": "前端工匠" }
      this.$listeners.get('111');
  },
   computed: {
    count() {
      return store.count;
    }
  },
  methods: {
   setCount: mutations.setCount,
   otherGet(){

   },
   doSomething() {
     window.console.log("子组件mounted完成");
   },
   changeProvide() {
     
   },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello{
  border:1px solid black;
  margin: 20px;
}
.demo{
  color:orange;text-align:left;
  border:1px solid orange;
  margin: 20px;
}
.deep-class{
  border: #42b983;
}
.deep-class /deep/ .test-deep{
  color: #42b983;
}
</style>
