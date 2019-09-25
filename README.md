# fe-share-vue

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

@[TOC](Vue最佳实践)
## Vue最佳实践（前端技术分享）
### 长列表性能优化
使用freeze函数
开启性能监测模式：
```javascript
created() {
      let list = Array.from({ length: 100000 }, (item, index) => ({ content: index }))
      //  this.list = list;
       this.list = Object.freeze(list);
      window.console.log("初始化");
  },
```
```javascript
// 开发模式开启性能检测
const isDev = process.env.NODE_ENV !== "production";
Vue.config.performance = isDev;
```
检测模式开启后，可以在chorme dev-tool中的的性能检测（performance）中看到其中的timings栏中看见各个组件的渲染时间，如下图所示：
![渲染时间显示](https://img-blog.csdnimg.cn/20190924184452609.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3ODAwODg2,size_16,color_FFFFFF,t_70)
从上图可以看到，未使用**Object.freeze(list)** 的渲染总时长2207ms，其中hello-world组件加载时间为329ms、413ms、587ms。
![渲染时间显示](https://img-blog.csdnimg.cn/20190924184123526.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3ODAwODg2,size_16,color_FFFFFF,t_70)
从上图可以看到，使用**Object.freeze(list)** 后，渲染总时长1657ms，其中hello-world组件加载时间为34ms、180ms、468ms。
### chorme 性能查看performance
#### 像素管道
像素管道一般由 5 个部分组成。JavaScript、样式、布局、绘制、合成。如下图所示:
![像素管道](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS81LzI2LzE2YWYwMzIyNjI5ZTllYjY?x-oss-process=image/format,png)
### 状态分享
使用Vue.observable(data)，可以写一个简易的store状态管理

```java
// miniStore.js
// 简易的状态管理（2.6新出的状态分享） 公用属性
import Vue from "vue";

// 参数为定义的公共 变量 
export const store = Vue.observable({ count: 0 });

// 暴露设置值的方法
export const mutations = {
  setCount(count) {
    store.count = count;
  }
};
```
* 使用Vue.observable定义参数为**公共变量**的store 
* 暴露mutations，保证其他页面修改值后状态可以同步

```html
// App.js

<template>
  <div id="app">
  	...
  	 // 引入自定义store中的
    <p>count:{{count}}</p>
    <button @click="setCount(count+1)">+1</button>
    <button @click="setCount(count-1)">-1</button>
    <hello-world />
	...
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
// 1. 把自定义的文件引入需要引入的页面
import  { store, mutations }  from './utils/miniStore';
export default {
	...
	// 2. 计算属性监听count值变化
  computed: {
    count() {
      return store.count;
    }
  },
  methods: {
  	// 3. 单一页面修改值作用到所有页面，实现属性公用
   setCount: mutations.setCount
  }
}
</script>
```
* 把自定义的文件引入需要引入的页面
* 在页面中像使用data中的数据一样使用
* 计算属性监听count值变化
* 单一页面修改值作用到所有页面，实现属性公用
### 属性&事件传递
多级组件嵌套需要传递数据时，通常使用的方法是通过vuex。但如果仅仅是传递数据，而不做中间处理，使用vuex，为此Vue2.4 版本提供了另一种方法----`$attrs`/`$listeners`/`$props`
* `$attrs`：父组件传到当前组件的参数
*  `$listeners`：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件
*  `$props`：当前组件接收的参数

```html
// App.vue
 <child1-vue
          msg="child1" 
          :foo="foo"
          :boo="boo"
          :doo="doo"
          :coo="coo"
          @test-listen.native='testListen'
          @test-listen1='testListen1'
          @get='getNum'/>
<script>
export default {
	methods:{
		//可以看到$listeners中不含 带有 .native 修饰符的函数
		testListenNative() { window.console.log('主页接收') },
	 	testListen() { window.console.log('主页接收,没有native'); },
	 	getNum(num) { window.console.log('获取值'+num); },
	}
}
</script>
```
```html
// child1.vue
 <template>
  <div class="hello">
	 <div>父组件传递的 $attrs:{{$attrs}}</div>
	 <div> 当前页面接收的 $props:{{$props}}</div>
	 <!-- 打印$listeners : [test-listen,get] -->
	 <child2-vue v-bind="$attrs" v-on="$listeners" @other-get="otherGet"></child2-vue>
  </div>
</template>
<script>
export default {
  props: {
    msg: String,
    // foo: String // foo作为props属性绑定
  },
  components:{
    Child2Vue
  },
  inheritAttrs: false, // 可以关闭自动挂载到组件根元素上的没有在props声明的属性
}
</script>
```
```html
// child2.vue
  <template>
  <div class="hello">
	 <div>父组件传递的 $attrs:{{$attrs}}</div>
	 <div> 当前页面接收的 $props:{{$props}}</div>
	 <child3-vue v-bind="$attrs"></child3-vue>
	  <!-- 从child1中接收$listeners打印: [test-listen,get,other-get] -->
  </div>
</template>
<script>
export default {
  props: {
    // boo: String // foo作为props属性绑定
  },
  components:{
    Child3Vue
  },
}
</script>
```
```html
// child3.vue
 <template>
  <div class="hello">
	 <div>父组件传递的 $attrs:{{$attrs}}</div>
	 <div> 当前页面接收的 $props:{{$props}}</div>
  </div>
</template>
<script>
export default {
  props: {
    // coo: String // foo作为props属性绑定
  },
}
</script>
```
页面效果如下图所示：
/![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925104924100.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3ODAwODg2,size_16,color_FFFFFF,t_70)
从上文可以看出，`$attrs`/`$listeners`/`$props`都是变量，可以层层传递。
注意：如果中途有一个参数被写在props属性中(如：props:{foo:String})，那么`$attrs`中会相应的除去该属性。将`$attrs`中的属性写到`$props`中，会出现如下效果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925112933882.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3ODAwODg2,size_16,color_FFFFFF,t_70)

### 监听子组件生命周期
在日常的开发过程中，父子组件之间相互通信，父组件监听子组件是否已经创建data或是dom是否挂载完毕，通俗的用this.$emit来实现父子之间的频繁通信有些过于麻烦，父组件直接监听子组件的生命周期，在特定的时间做逻辑处理。
在父组件使用`@hook:mounted="method"`，子组件在对应的生命周期函数结束后执行method。
```html
// child1.vue
 <template>
  <div class="hello">
	 <div>父组件传递的 $attrs:{{$attrs}}</div>
	 <div> 当前页面接收的 $props:{{$props}}</div>
	 <!-- 打印$listeners : [test-listen,get] -->
	<child2-vue 
		v-bind="$attrs" 
		v-on="$listeners" 
		@other-get="otherGet" 
		@hook:mounted="doSomething"></child2-vue>
  </div>
</template>
<script>
export default {
	methods: {
		// 当子组件mounted执行过后，控制台打印 子组件mounted完成
	   doSomething() { window.console.log("子组件mounted完成"); }
  	}
}
</script>
```
### 函数式组件
函数式组件，即无状态，无法实例化，内部没有任何生命周期处理方法，非常轻量，因而渲染性能高，特别适合用来只依赖外部数据传递而变化的组件。
![在这里插入图片描述](https://img-blog.csdnimg.cn/201909251416316.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3ODAwODg2,size_16,color_FFFFFF,t_70)
###  watch和computed
先解释一下watch和computed区别：
* `computed`： 属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。主要当作属性来使用；
* `watch` ：一个对象，键是需要观察的表达式，值是对应回调函数。主要用来监听某些特定数据的变化，从而进行某些具体的业务逻辑操作；可以看作是 computed 和 methods 的结合体；
* watch更加适用于监听某一个值的变化并做对应的操作，比如请求后台接口等，而computed适用于计算已有的值并返回结果

###  .sync 修饰符
### provide / inject
### Vue组件局部样式 scoped
vue中style标签的scoped属性表示它的样式只作用于当前模块，是样式私有化, 设计的初衷就是让样式变得不可修改.
渲染的规则/原理：

* 给HTML的DOM节点添加一个 不重复的data属性 来表示 唯一性
* 在对应的 CSS选择器 末尾添加一个当前组件的 data属性选择器来私有化样式，如：.demo[data-v-2311c06a]{}
* 若组件内部包含其他组件，只会给其他组件的最外层标签加上当前组件的 data-v 属性
* 这也是我们有时更改组件库内部样式，有时失效的原因，有scoped属性后，修改的css样式会在生成时，加一个v-data，因此破坏了class的重名修改。所以去掉scoped后杨氏才会生效。

```html
<style scoped>
    .demo{
        color:green;
        text-align:left;
        border:1px solid green;
        margin: 20px;
    }
</style>
```
在浏览器中查看：

```css
.demo[data-v-3a2e0245] {
        color:green;
        text-align:left;
        border:1px solid green;
        margin: 20px;
}
```
**注意**：`scoped`添加后，父组件无法修改子组件中的样式
### Vue组件样式之 deep选择器
上一节scoped添加后无法修改，但在开发过程中有时需要修改子组件中的样式达到自己的效果（类似修改组件库样式）这样的情况，在这种情况下，使用`/deep/`修改包含scoped定义的子组件样式。

```
在这里插入代码片
```

### mixin混入示例demo
### fliter 示例demo
### 调试 Vue template
### Vue组件局部样式 scoped
### Vue组件样式之 deep选择器
### Vue组件局部样式 Modules
### nextTick
### 相关链接