
@[TOC](Vue最佳实践)
# 一、vue通信类(简化组件间的通信)
## 1. 属性&事件传递
多级组件嵌套需要传递数据时，通常使用的方法是通过vuex。但如果仅仅是传递数据，而不做中间处理，使用vuex，为此Vue2.4 版本提供了另一种方法----`$attrs`/`$listeners`/`$props`
* `$attrs`：父组件传到当前组件的参数
*  `$listeners`：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件
*  `$props`：当前组件接收的参数--当前组件接收到的 props 对象。Vue 实例代理了对其 props 对象属性的访问。

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
![在这里插入图片描述](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS85LzI3LzE2ZDcwOWE1ZGYzOTQ3NzY?x-oss-process=image/format,png)
从上文可以看出，`$attrs`/`$listeners`/`$props`都是变量，可以层层传递。
注意：如果中途有一个参数被写在props属性中(如：props:{foo:String})，那么`$attrs`中会相应的除去该属性。将`$attrs`中的属性写到`$props`中，会出现如下效果：
![在这里插入图片描述](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS85LzI3LzE2ZDcwOWE1ZGY2ZDFiYjQ?x-oss-process=image/format,png)
## 2. 监听子组件生命周期
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
## 3. 父组件调用子组件方法
（没必要，但可以有）

## 4. 状态分享
使用Vue.observable(data)，可以写一个简易的store状态管理;

 * `Vue.observable()`：参数{Object} object
 * 让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象
 * 返回的对象可以直接用于渲染函数和计算属性内，并且会在发生改变时触发相应的更新。也可以作为最小化的跨组件状态存储器，用于简单的场景
 * **Vue 2.x以上，不向前兼容**

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

## 5. provide / inject
之前的组件通信，父-->儿子--> 孙子，如果想实现父到孙子节点的数据传递，那么中间必须经过儿子节点中转，如果中间层数少还好，如果层数过多，那么逐层传递非常麻烦，因此vue提供了` provide / inject`来进行跨越多层级之间的通信。

>* Vue2.2.0新增API,
>* 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文特性很相似。
>* `provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中`

![在这里插入图片描述](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS85LzI3LzE2ZDcwOWE1ZGY3ZjUxNjI?x-oss-process=image/format,png)
```java
// 父
export default {
	provide: {
   	 name: 'provide传的值'
 	},
}
```
```java
// 孙子 
export default {
	reject:['name'],
	created() {
		this.$log(this.name); // 打印结果：provide传的值
	}
}
```
可以看到使用 ` provide / inject`无需经过儿子节点进行值得中转。
需要注意的一点是，这里的` provide / inject`是不能
* **缺点**：虽然任意通信很方便，但在任意层级都能访问导致数据追踪比较困难，层层传递虽然麻烦但但适用追踪，因此这个属性通常并不建议使用，能用vuex(或文中提到的vue.observe())的使用vuex，不能用的多传参几层。但是在做组件库开发时，不对vuex进行依赖，且不知道用户使用环境的情况下可以很好的使用。

# 二、vue样式类
## 1. scoped
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
## 2. 穿透样式deep选择器
上一节scoped添加后无法修改，但在开发过程中有时需要修改子组件中的样式达到自己的效果（类似修改组件库样式）这样的情况，在这种情况下，使用`/deep/`修改包含scoped定义的子组件样式。

```html
// 父组件
<child class="deep-class" />

<style scoped>
	.deep-class /deep/ .demo{
	 	border-color:red
	}
</style>
```

```html
// 子组件
<template>
  <div class="hello">
	<div class="demo"></div>
  </div>
</template>
<style scoped>
	.demo{
		border:1px solid green;
	}
</style>
```
用`/deep/`后，页面样式生效，边框为红色。去掉`/deep/`，边框颜色为绿色。


# 三、vue性能优化类
## 1. 长列表性能优化
* 在vue2.*的版本中，vue数据绑定的核心使用的是`Object.defineProperty()`，`Object.defineProperty` 把data中的的属性全部转为 `getter/setter`，这些` getter/setter` 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。
* 在vue开发过程中，如果有非常大的数组或Object，并且开发人员确信数据不会修改(无需监测动态变化只需要渲染)，可以使用 `Object.freeze()` 方法冻结该数据，达到性能优化的目的。
* `Object.freeze() `方法冻结该数据，这样vue就不会对该对象进行`getter和setter`。
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
### 性能监测
检测模式开启后，可以在chorme dev-tool中的的性能检测（performance）中看到其中的timings栏中看见各个组件的渲染时间，如下图所示：
![渲染时间显示](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS85LzI3LzE2ZDcwOWE1ZTBhZTY1ZTk?x-oss-process=image/format,png)
从上图可以看到，未使用**Object.freeze(list)** 的渲染总时长2207ms，其中hello-world组件加载时间为329ms、413ms、587ms。
![渲染时间显示](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS85LzI3LzE2ZDcwOWE1ZGZkZmIyNjg?x-oss-process=image/format,png)
从上图可以看到，使用**Object.freeze(list)** 后，渲染总时长1657ms，其中hello-world组件加载时间为34ms、180ms、468ms。
## 2. chorme 性能查看performance
### 像素管道
像素管道一般由 5 个部分组成。JavaScript、样式、布局、绘制、合成。如下图所示:
![像素管道](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS85LzI3LzE2ZDcwOWE1ZTE0ZTgxMTc?x-oss-process=image/format,png)
## 3. 函数式组件
函数式组件，即无状态，无法实例化，内部没有任何生命周期处理方法，非常轻量，因而渲染性能高，特别适合用来只依赖外部数据传递而变化的组件。
![在这里插入图片描述](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS85LzI3LzE2ZDcwOWE2MGExYWNjYjM?x-oss-process=image/format,png)
##  4. 善用watch
> `watch` 虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的侦听器。这就是为什么 Vue 通过 watch 选项提供了一个更通用的方法，来响应数据的变化。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的
* `watch一个对象`，键是需要观察的表达式，值是对应回调函数。主要用来监听某些特定数据的变化，从而进行某些具体的业务逻辑操作；可以看作是` computed` 和` methods` 的结合体；
* ` watch`更加适用于监听某一个值的变化并做对应的操作，比如请求后台接口等，而`computed`适用于计算已有的值并返回结果
* `watch`监听路由，监听数值变化
* 
# 四、开发推荐
## 1. 修饰符
* `.stop` - 调用 event.stopPropagation()。
* `.prevent` - 调用 event.preventDefault()。
* `.capture` - 添加事件侦听器时使用 capture 模式。
* `.self` - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
* `.{keyCode | keyAlias}` - 只当事件是从特定键触发时才触发回调。
* `.native` - 监听组件根元素的原生事件。
* `.once` - 只触发一次回调。
* `.left` - (2.2.0) 只当点击鼠标左键时触发。
* `.right` - (2.2.0) 只当点击鼠标右键时触发。
* `.middle` - (2.2.0) 只当点击鼠标中键时触发。
* `.passive` - (2.3.0) 以 { passive: true } 模式添加侦听器
## 2. Vue.nextTick
在了解nextTick前，需要知道**Vue 在更新 DOM 时是异步执行的**，当你设置 vm.someData = 'new value'，该组件不会立即重新渲染。当刷新队列时，组件会在下一个事件循环“tick”中更新。多数情况我们不需要关心这个过程，但是如果你想基于更新后的 DOM 状态来做点什么，这就可能会有些棘手。
这时就需要我们用到`Vue.nextTick`。

## 3. 组件编码注意事项
* 导出一个清晰、组织有序的组件，使得代码易于阅读和理解。同时也便于标准化；
* 使用短横线分隔的形式命名事件,因为不论什么形式vue最后都会转成'xx-xx'这种形式；
* 能避免操作 dom 就尽量避免，实在要用的话最好使用 ref 来代替 querySelector 等选择器方法；
* 一个 .vue 的文件行数最好控制在 200 行左右；
* 善用 v-if 和 v-show。比如，涉及到权限的必须用 v-if 而非 v-show。例如，用户必须登录后才能查看的，请用 v-if；
* 请尽量保证数据流的可追踪性。尽量不要使用 $parent，而是通过 props 属性接收父组件的传入；
* 不要在使用v-for的同一元素上使用v-if
## 相关链接
![在这里插入图片描述](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS85LzI3LzE2ZDcwOWE2MGQzNDhjMWE?x-oss-process=image/format,png)
[Vue API](https://cn.vuejs.org/v2/api/)