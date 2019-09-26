<template>
    <demo-vue name="Child2" color="green">
        <div>父组件传递的 $attrs:{{$attrs}}</div>
        <div> 当前页面接收的 $props:{{$props}}</div>
        <div>boo:{{boo}}</div>
        <child3-vue v-bind="$attrs" class="deep-class"></child3-vue>
    </demo-vue>
</template>

<script>
import Child3Vue from './Child3.vue'
import DemoVue from './Demo.vue';
 
export default {
    name:'child2',
    props: {
      boo: String // foo作为props属性绑定
    },
    components:{
        Child3Vue,DemoVue
    },
    beforeCreate() {
        this.$log('child2:beforeC',this.$props,this.$attrs,this.$listeners);
    },
    created() {
        this.$log('child2:Created',this.$props,this.$attrs,this.$listeners);
    },
    mounted() {
        this.$log('child2:mounted',this.$props,this.$attrs,this.$listeners);
    }
}
</script>

<style scoped>
    .deep-class /deep/ .demo{
        border-color: red;
    }
</style>