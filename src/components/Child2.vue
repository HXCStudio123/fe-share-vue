<template>
  <div class="hello">
        <div style="margin:10px">Child2内部</div>
            <div class="demo">        
                <div>父组件传递的 $attrs:{{$attrs}}</div>
                <div> 当前页面接收的 $props:{{$props}}</div>
                <div>boo:{{boo}}</div>
            <child3-vue v-bind="$attrs" class="deep-class"></child3-vue>
         </div>
  </div>
</template>

<script>
import Child3Vue from './Child3.vue'
 
export default {
    name:'child2',
    props: {
      boo: String // foo作为props属性绑定
    },
    components:{
        Child3Vue
    },
    created() {
        window.console.log('child2',this.$attrs,this.$listeners)
    }
}
</script>

<style scoped>
    .demo{
        color:green;
        text-align:left;
        border:1px solid green;
        margin: 20px;
    }
    .deep-class /deep/ .demo{
        border-color: red;
    }
</style>