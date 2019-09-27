<template>
    <demo-vue name="Child3" color="blueviolet">
        <div>父组件传递的 $attrs:{{$attrs}}</div>
        <div>coo:{{coo}}</div>
        <div>当前页面接收的 $props:{{$props}}</div>
    </demo-vue>
</template>

<script>
import DemoVue from "./Demo.vue";

export default {
    name:'child2',
    props: {
      coo: String // foo作为props属性绑定
    },
    inject:['name'],
    components:{
        DemoVue
    },
    created() {
        this.$log(this.name);
        window.console.log('child2',this.$attrs)
    }
}
</script>

<style scoped>
</style>