<template>
  <div class="hello">
    <h1>{{ msg | filterName}}</h1>
    <button @click="changeProvide">修改 provide</button>

    <!-- store示例 -->
    <demo-vue name="Child1" title="store示例">
      <p>count:{{count}}</p>
      <button @click="setCount(count+1)">+1</button>
      <button @click="setCount(count-1)">-1</button>
    </demo-vue>

    <!-- 多级传参示例 -->
    <demo-vue name="Child1" title="多级传参示例">
      <div>父组件传递的 $attrs:{{$attrs}}</div>
      <div> 当前页面接收的 $props:{{$props}}</div>
      <div>foo:{{foo}}</div>
      <child2-vue v-bind="$attrs" v-on="$listeners" @other-get="otherGet" @hook:mounted="$log('成功挂载');"></child2-vue>
    </demo-vue>

    <!-- 函数式组件 -->
    <demo-vue name="Child1" title="函数式组件">
      <child-function-vue v-bind="$attrs" ></child-function-vue>
    </demo-vue>

    <!--  长列表示例 -->
    <demo-vue name="Child1" title="长列表示例">
      <span v-for="(item, idx) in list" :key="idx">
        {{item.content}}
      </span>
    </demo-vue>
  </div>
</template>

<script>
import  { store, mutations }  from '../utils/miniStore';
import Child2Vue from './Child2.vue';
import ChildFunctionVue from './ChildFunction.vue';
import DemoVue from './Demo.vue';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    foo: String // foo作为props属性绑定
  },
  components:{
    Child2Vue,ChildFunctionVue,DemoVue
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
      this.$log("初始化");
      
      this.$log('child1:',this.$attrs,this.$listeners); 
      this.$listeners.get('111');
  },
   computed: {
    count() {
      return store.count;
    }
  },
  methods: {
   setCount: mutations.setCount,
   otherGet(){ },
   doSomething() {
     this.$log("父组件调用");
   },
   changeProvide() { },
  },
  filters: {
        filterName: (value) => {
            window.alert(value);
            return '本地过滤器';
        },
  },
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
</style>
